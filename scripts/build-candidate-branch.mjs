/*
 * 把 draft-events-*.json 中通过校验的草稿合并进工作区的 data/timeline.json，
 * 重新生成 timeline-data.js，并输出 Draft PR 的说明文件 pr-body-<日期>.md。
 * 不做任何 git 操作——分支与 PR 由 update-watch.yml 中的 create-pull-request 完成。
 */
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import {
  ensureInbox, inboxDir, latestInboxFile, loadJson, normalizeTitle, normalizeUrl,
  saveJson, timelinePath, today,
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

function eventSection(event) {
  return [
    `## ${event.title}（${event.date} · ${event.lane}）`,
    "",
    `- **一句话**：${event.short}`,
    `- **发生了什么**：${event.what}`,
    `- **为什么重要**：${event.why}`,
    `- **改变了什么**：${event.changed}`,
    `- **概念**：${(event.concepts || []).join("、") || "—"}`,
    `- **机构**：${(event.orgs || []).join("、") || "—"}`,
    `- **来源**：${(event.sources || []).map((source) => `[${source.title}](${source.url})`).join(" · ")}`,
    "",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const draftPath = args.drafts ? resolve(inboxDir, String(args.drafts)) : await latestInboxFile("draft-events-");
  const bundle = draftPath ? await loadJson(draftPath, { events: [], model: "" }) : { events: [], model: "" };
  const drafts = Array.isArray(bundle.events) ? bundle.events : [];

  const timeline = await loadJson(timelinePath);
  const knownIds = new Set(timeline.events.map((event) => event.id));
  const knownTitles = new Set(timeline.events.map((event) => normalizeTitle(event.title)));
  const knownUrls = new Set(timeline.events.flatMap((event) => (event.sources || []).flatMap((source) => [normalizeUrl(source.url), source.fullText ? normalizeUrl(source.fullText) : ""])));

  const added = [];
  for (const draft of drafts) {
    const duplicated = knownIds.has(draft.id)
      || knownTitles.has(normalizeTitle(draft.title))
      || (draft.sources || []).some((source) => knownUrls.has(normalizeUrl(source.url)));
    if (duplicated) {
      console.warn(`[跳过] ${draft.id}：与既有条目重复`);
      continue;
    }
    timeline.events.push(draft);
    knownIds.add(draft.id);
    added.push(draft);
  }

  if (added.length) {
    timeline.events.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    timeline.meta.updatedAt = today();
    await saveJson(timelinePath, timeline);
    await import("./build-data.mjs");
  }

  const body = [
    "> 本 PR 由 `update-watch` 工作流自动起草" + (bundle.model ? `（模型：\`${bundle.model}\`）` : "") + "，**全部条目处于 `watching` 状态，需人工审校后才能合并**。",
    "",
    "审校清单：",
    "- [ ] 来源链接真实可达，且支撑条目陈述的事实；",
    "- [ ] `why` / `changed` 的判断符合 [编辑原则](./EDITORIAL_POLICY.md)；",
    "- [ ] 半年期、主轴与切面归类正确；",
    "- [ ] 标题与措辞与全站风格一致。",
    "",
    ...(added.length ? added.map(eventSection) : ["本次没有候选条目。"]),
    "",
    "---",
    `${added.length} 个候选条目等待审校。`,
    "",
  ].join("\n");
  await ensureInbox();
  const bodyPath = resolve(inboxDir, `pr-body-${today()}.md`);
  await writeFile(bodyPath, body, "utf8");
  console.log(added.length
    ? `已合并 ${added.length} 个草稿条目并重新生成数据，PR 说明 → ${bodyPath}`
    : "没有新增条目，仅写出 PR 说明占位。");
}

await main();
