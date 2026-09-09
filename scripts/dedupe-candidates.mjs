/*
 * 读取最新 candidates-*.json，对照已收录时间线与 rejected 清单去重、按关键词与来源权重打分，
 * 输出 data/inbox/shortlist-<日期>.json（最多 watchlist.limitPerRun 条）。
 */
import { resolve } from "node:path";
import {
  ensureInbox, inboxDir, loadJson, normalizeTitle, normalizeUrl,
  rejectedPath, saveJson, scoreKeywords, timelinePath, today, watchlistPath,
} from "./inbox-lib.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    args[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : true;
    if (args[key] !== true) i += 1;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const watchlist = await loadJson(watchlistPath);
  const limit = Number(args.limit || watchlist.limitPerRun || 10);
  const inputPath = args.input ? resolve(inboxDir, String(args.input)) : resolve(inboxDir, `candidates-${today()}.json`);
  if (!inputPath) {
    console.log("没有找到 candidates-*.json，请先运行 npm run collect。");
    return;
  }
  const candidates = await loadJson(inputPath, []);
  const timeline = await loadJson(timelinePath);

  const knownUrls = new Set();
  const knownTitles = new Set();
  timeline.events.forEach((event) => {
    knownTitles.add(normalizeTitle(event.title));
    (event.sources || []).forEach((source) => {
      knownUrls.add(normalizeUrl(source.url));
      if (source.fullText) knownUrls.add(normalizeUrl(source.fullText));
    });
  });
  const rejected = await loadJson(rejectedPath, []);
  const rejectedUrls = new Set(rejected.map((item) => normalizeUrl(item.url)).filter(Boolean));
  const rejectedTitles = new Set(rejected.map((item) => normalizeTitle(item.title)).filter(Boolean));

  const keywords = watchlist.keywords || [];
  const majorOrgs = watchlist.majorOrgs || [];

  const kept = [];
  let duplicateCount = 0;
  for (const candidate of candidates) {
    const url = normalizeUrl(candidate.url);
    const title = normalizeTitle(candidate.title);
    const alreadyKnown = knownUrls.has(url) || (title.length > 6 && knownTitles.has(title));
    const wasRejected = rejectedUrls.has(url) || (title.length > 6 && rejectedTitles.has(title));
    if (alreadyKnown || wasRejected) { duplicateCount += 1; continue; }
    const haystack = [candidate.title, candidate.summary, candidate.org].filter(Boolean).join(" ");
    const keywordHits = scoreKeywords(haystack, keywords);
    const orgHit = majorOrgs.some((org) => haystack.toLowerCase().includes(org)) ? 0.4 : 0;
    kept.push({
      ...candidate,
      url: candidate.url,
      score: Number((candidate.weight * 2 + Math.min(keywordHits * 0.25, 1.5) + orgHit).toFixed(2)),
      matched: keywordHits,
    });
    knownUrls.add(url);
    knownTitles.add(title);
  }

  kept.sort((a, b) => b.score - a.score);
  const shortlist = kept.slice(0, limit);
  const outputPath = resolve(inboxDir, `shortlist-${today()}.json`);
  await ensureInbox();
  await saveJson(outputPath, shortlist);
  console.log(`候选 ${candidates.length} 条：去重淘汰 ${duplicateCount} 条，保留 ${kept.length} 条，入围 ${shortlist.length} 条 → ${outputPath}`);
  shortlist.forEach((item, index) => console.log(`  ${index + 1}. [${item.score}] ${item.title} — ${item.url}`));
}

await main();
