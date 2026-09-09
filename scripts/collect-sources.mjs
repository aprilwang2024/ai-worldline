/*
 * 抓取 watchlist.json 中的全部来源，把新条目写入 data/inbox/candidates-<日期>.json。
 * 抓取游标（已见 URL）持久化在 data/inbox/state.json，单源失败不影响其他源。
 */
import { resolve } from "node:path";
import {
  ensureInbox, inboxDir, loadJson, saveJson, statePath, today, userAgent, watchlistPath,
} from "./inbox-lib.mjs";

function decodeEntities(value) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function linkHref(xml) {
  const match = xml.match(/<link(?:\s[^>]*)?href="([^"]+)"/i);
  return match ? match[1].trim() : "";
}

function parseFeed(xml) {
  const isAtom = /<feed[\s>]/i.test(xml);
  const blocks = isAtom ? xml.split(/<entry[\s>]/i).slice(1) : xml.split(/<item[\s>]/i).slice(1);
  return blocks.map((block) => {
    const title = tagValue(block, "title");
    const url = isAtom ? linkHref(block) || tagValue(block, "id") : tagValue(block, "link");
    const summary = tagValue(block, "summary") || tagValue(block, "description") || tagValue(block, "content");
    const published = tagValue(block, "published") || tagValue(block, "pubDate") || tagValue(block, "updated") || tagValue(block, "date");
    return { title, url, summary, publishedAt: parseDate(published) };
  }).filter((item) => item.title && item.url);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": userAgent, accept: "application/rss+xml, application/atom+xml, application/json, text/xml, */*" },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function parseDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

async function collectFeed(feed) {
  if (feed.type === "arxiv") {
    const query = encodeURIComponent(feed.query);
    const max = feed.maxResults || 25;
    const xml = await fetchText(`https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${max}`);
    return parseFeed(xml).map((item) => ({
      ...item,
      url: item.url.replace(/v\d+$/, ""),
      publishedAt: parseDate(item.publishedAt),
    }));
  }
  if (feed.type === "hf-daily-papers") {
    const rows = JSON.parse(await fetchText(feed.url));
    if (!Array.isArray(rows)) throw new Error("daily_papers 响应不是数组");
    return rows.map((row) => ({
      title: String(row?.paper?.title || "").replace(/\s+/g, " ").trim(),
      url: `https://huggingface.co/papers/${row?.paper?.id || ""}`,
      summary: String(row?.paper?.summary || "").replace(/\s+/g, " ").trim(),
      publishedAt: parseDate(row?.paper?.publishedAt || row?.publishedAt),
    })).filter((item) => item.title && item.url);
  }
  if (feed.type === "github-releases") {
    const response = await fetch(`https://api.github.com/repos/${feed.repo}/releases?per_page=10`, {
      headers: { "user-agent": userAgent, accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    return (Array.isArray(rows) ? rows : []).map((release) => ({
      title: `${feed.repo.split("/")[1]} ${release.name || release.tag_name}`.trim(),
      url: release.html_url,
      summary: String(release.body || "").replace(/\s+/g, " ").trim().slice(0, 1500),
      publishedAt: parseDate(release.published_at),
    })).filter((item) => item.title && item.url);
  }
  const xml = await fetchText(feed.url);
  return parseFeed(xml);
}

async function main() {
  const watchlist = await loadJson(watchlistPath);
  if (!watchlist?.feeds?.length) throw new Error("watchlist.json 中没有配置任何 feed");
  await ensureInbox();
  const state = await loadJson(statePath, { feeds: {} });
  const collected = [];
  const failures = [];

  for (const feed of watchlist.feeds) {
    const seen = new Set(state.feeds?.[feed.id]?.seen || []);
    try {
      const items = await collectFeed(feed);
      const fresh = items.filter((item) => {
        const key = item.url.replace(/#.*$/, "").toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      state.feeds[feed.id] = { updatedAt: new Date().toISOString(), seen: [...seen].slice(-600) };
      fresh.forEach((item) => collected.push({
        feedId: feed.id,
        lane: feed.lane || "tech",
        topics: feed.topics || [],
        org: item.org || feed.org || "",
        weight: feed.weight ?? 0.5,
        title: item.title,
        url: item.url,
        publishedAt: item.publishedAt,
        summary: String(item.summary || "").slice(0, 1500),
      }));
      console.log(`[ok] ${feed.id}: ${items.length} 条，新 ${fresh.length} 条`);
    } catch (error) {
      failures.push({ id: feed.id, error: error.message });
      console.error(`[失败] ${feed.id}: ${error.message}`);
    }
  }

  await saveJson(statePath, state);
  // Always replace today's output, including an empty run, so cached candidates
  // cannot be mistaken for newly collected material.
  const outputPath = resolve(inboxDir, `candidates-${today()}.json`);
  await saveJson(outputPath, collected);
  if (collected.length) {
    console.log(`共 ${collected.length} 条新候选 → ${outputPath}`);
  } else {
    console.log("本次没有新候选。");
  }
  if (failures.length === watchlist.feeds.length) {
    console.error("全部 feed 均失败。");
    process.exit(1);
  }
}

await main();
