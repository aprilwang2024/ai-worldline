/*
 * 用 LLM（OpenAI 兼容接口）把 shortlist 候选起草成符合 schema 的时间线条目。
 *
 * 环境变量：
 *   LLM_API_KEY   必填
 *   LLM_BASE_URL  默认 https://open.bigmodel.cn/api/coding/paas/v4
 *   LLM_MODEL     默认 glm-5
 *
 * 护栏：来源 URL 只允许来自候选本身（禁止模型编造链接）；importance 一律 watching；
 * 校验不过的条目整条丢弃。输出 data/inbox/draft-events-<日期>.json，不改动正式数据。
 */
import { resolve } from "node:path";
import {
  ensureInbox, inboxDir, latestInboxFile, loadJson, normalizeUrl, periodFromdate,
  saveJson, timelinePath, today,
} from "./inbox-lib.mjs";

const BASE_URL = (process.env.LLM_BASE_URL || "https://coding.dashscope.aliyuncs.com/v1").replace(/\/+$/, "");
const MODEL = process.env.LLM_MODEL || "glm-5";
const API_KEY = process.env.LLM_API_KEY || "";
const SOURCE_TYPES = new Set(["paper", "official", "documentation", "engineering", "essay", "report", "reporting", "retrospective", "talk", "code"]);

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

function buildSystemPrompt(examples) {
  return [
    "你是「AI 世界线」的编辑助理。AI 世界线是一份按半年整理的基础模型、智能体与世界模型研究索引，收录标准见下方示例与规则。",
    "",
    "任务：把候选来源起草成时间线条目。只输出一个 JSON 数组，不要任何其他文字或代码围栏。",
    "数组中每个对象必须包含以下字段：",
    '- "id": 小写英文 kebab-case 唯一标识（如 "kimi-k3"）；',
    '- "date": 来源发布日期，YYYY-MM-DD；',
    '- "lane": "event"（公司/机构/产品/市场转折）或 "tech"（论文/架构/开源突破）；',
    '- "importance": 固定填 "watching"（重要性未定，交由人工审校）；',
    '- "title": 简短中文标题，保留专有名词原文；',
    '- "short": 一句话中文摘要，不超过 24 个字；',
    '- "what": 发生了什么，1-2 句中文，只陈述来源支持的事实；',
    '- "why": 为什么重要，1-2 句中文；',
    '- "changed": 它改变了什么，1-2 句中文；',
    '- "concepts": 相关概念数组（可空）；',
    '- "orgs": 相关机构数组；',
    '- "sources": 来源数组，每项 {"title","publisher","date","type","url","fullText"}。',
    "",
    "硬性规则：",
    "1. sources 的 url 必须逐字使用候选给出的 URL，禁止编造、改写或补充任何其他链接；",
    '2. type 只能是 "paper" / "official" / "documentation" / "engineering" / "essay" / "report" / "reporting" / "retrospective" / "talk" / "code" 之一；',
    "3. 没有把握写进 what/why/changed 的事实一律不写；意义不明确的候选直接跳过，宁缺毋滥；",
    "4. 日常小版本更新、无实质能力或市场变化的发布不值得收录，跳过；",
    "5. 用中文撰写 except id、URL 和专有名词。",
    "",
    "参考已收录条目的写法：",
    JSON.stringify(examples, null, 2),
  ].join("\n");
}

function buildUserPrompt(candidates) {
  return [
    "【候选来源】",
    "```json",
    JSON.stringify(candidates.map(({ title, url, publishedAt, summary, org, feedId }) => ({
      title, url, publishedAt, summary, org, feedId,
    })), null, 2),
    "```",
  ].join("\n");
}

function extractJsonArray(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("[");
  const end = body.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) throw new Error("响应中没有 JSON 数组");
  return JSON.parse(body.slice(start, end + 1));
}

function validateDraft(draft, knownIds, allowedUrls, batchIds) {
  const errors = [];
  const requireText = (field, label) => { if (typeof draft[field] !== "string" || !draft[field].trim()) errors.push(`${label} 缺失`); };
  ["id", "date", "lane", "title", "short", "what", "why", "changed"].forEach((field) => requireText(field, field));
  if (errors.length) return { errors };

  if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(draft.id)) errors.push("id 不是合法 kebab-case");
  if (knownIds.has(draft.id) || batchIds.has(draft.id)) errors.push("id 与既有条目重复");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) errors.push("date 格式错误");
  const period = periodFromdate(draft.date);
  if (!period) errors.push("date 无法解析出半年期");
  if (!["event", "tech"].includes(draft.lane)) errors.push("lane 非法");
  if (draft.importance && draft.importance !== "watching") errors.push("importance 只能是 watching");
  for (const field of ["concepts", "orgs", "topics"]) {
    if (draft[field] !== undefined && !Array.isArray(draft[field])) errors.push(`${field} 必须是数组`);
  }

  const sources = Array.isArray(draft.sources) ? draft.sources : [];
  if (!sources.length) errors.push("缺少来源");
  let trustedSource = false;
  sources.forEach((source, index) => {
    if (typeof source?.url !== "string" || !/^https?:\/\//.test(source.url)) { errors.push(`sources[${index}].url 非法`); return; }
    if (!allowedUrls.has(normalizeUrl(source.url))) { errors.push(`sources[${index}].url 不是候选给出的链接（疑似编造）`); return; }
    trustedSource = true;
    if (source.fullText && !/^https?:\/\//.test(String(source.fullText))) errors.push(`sources[${index}].fullText 非法`);
  });
  if (!trustedSource) errors.push("没有任何来源 URL 能对应到真实候选");
  return { errors };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const limit = Number(args.limit || 5);
  const minNew = Number(args["min-new"] || 1);
  const inputPath = args.input ? resolve(inboxDir, String(args.input)) : await latestInboxFile("shortlist-");
  if (!inputPath) {
    console.log("没有找到 shortlist-*.json，请先运行 npm run dedupe。");
    return;
  }
  const shortlist = (await loadJson(inputPath, [])).slice(0, limit);
  if (shortlist.length < minNew) {
    console.log(`候选仅 ${shortlist.length} 条（少于 --min-new ${minNew}），跳过起草。`);
    return;
  }
  if (!API_KEY) {
    console.error("未配置 LLM_API_KEY，无法起草。请设置环境变量后重试。");
    process.exit(1);
  }

  const timeline = await loadJson(timelinePath);
  const knownIds = new Set(timeline.events.map((event) => event.id));
  const allowedUrls = new Set(shortlist.map((item) => normalizeUrl(item.url)));

  const system = buildSystemPrompt([
    timeline.events.find((event) => event.id === "attention-is-all-you-need"),
    timeline.events.find((event) => event.id === "kimi-k3"),
  ].filter(Boolean).map(({ id, period, date, lane, importance, title, short, what, why, changed, concepts, orgs, sources }) => ({
    id, period, date, lane, importance, title, short, what, why, changed, concepts, orgs, sources,
  })));
  const user = buildUserPrompt(shortlist);

  console.log(`请求 ${MODEL}（${BASE_URL}）起草 ${shortlist.length} 条候选…`);
  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ], temperature: 0.2 }),
    signal: AbortSignal.timeout(300000),
  });
  if (!response.ok) {
    console.error(`LLM 请求失败 HTTP ${response.status}：${(await response.text().catch(() => "")).slice(0, 400)}`);
    process.exit(1);
  }
  const content = (await response.json())?.choices?.[0]?.message?.content || "";
  let drafts;
  try {
    drafts = extractJsonArray(content);
  } catch (error) {
    console.error(`解析 LLM 响应失败：${error.message}`);
    process.exit(1);
  }

  const batchIds = new Set();
  const valid = [];
  for (const draft of drafts) {
    const { errors } = validateDraft(draft, knownIds, allowedUrls, batchIds);
    if (errors.length) {
      console.warn(`[丢弃] ${draft?.id || draft?.title || "(未命名)"}：${errors.join("；")}`);
      continue;
    }
    batchIds.add(draft.id);
    valid.push({
      id: draft.id,
      period: periodFromdate(draft.date),
      date: draft.date,
      lane: draft.lane,
      importance: "watching",
      title: draft.title,
      short: draft.short,
      what: draft.what,
      why: draft.why,
      changed: draft.changed,
      concepts: Array.isArray(draft.concepts) ? draft.concepts : [],
      orgs: Array.isArray(draft.orgs) ? draft.orgs : [],
      sources: draft.sources,
      topics: Array.isArray(draft.topics) ? draft.topics : [],
    });
  }

  await ensureInbox();
  const outputPath = resolve(inboxDir, `draft-events-${today()}.json`);
  await saveJson(outputPath, { generatedAt: new Date().toISOString(), model: MODEL, shortlist: inputPath, events: valid });
  console.log(`起草完成：${valid.length}/${drafts.length} 条通过校验 → ${outputPath}`);
  if (!valid.length && drafts.length) process.exit(1);
}

await main();
