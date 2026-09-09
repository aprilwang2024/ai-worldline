import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const inboxDir = resolve(root, "data/inbox");
export const watchlistPath = resolve(root, "scripts/watchlist.json");
export const timelinePath = resolve(root, "data/timeline.json");
export const statePath = resolve(inboxDir, "state.json");
export const rejectedPath = resolve(inboxDir, "rejected.json");
export const userAgent = "ai-worldline-collector/1.0 (+https://github.com/aprilwang2024/ai-worldline)";

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function ensureInbox() {
  await mkdir(inboxDir, { recursive: true });
}

export async function loadJson(path, fallback = null) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

export async function saveJson(path, data) {
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function latestInboxFile(prefix) {
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(inboxDir).catch(() => [])).filter((name) => name.startsWith(prefix) && name.endsWith(".json")).sort();
  return files.at(-1) ? resolve(inboxDir, files.at(-1)) : null;
}

// 归一化 URL 用于去重：小写 host、去掉跟踪参数与末尾斜杠、arXiv 去版本号并统一 abs/pdf。
export function normalizeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.protocol = "https:";
    url.hash = "";
    [...url.searchParams.keys()].forEach((key) => {
      if (/^(utm_|fbclid|ref|referrer)/i.test(key)) url.searchParams.delete(key);
    });
    let out = `${url.host}${url.pathname.replace(/\/+$/, "")}${url.search}`;
    out = out.toLowerCase();
    out = out.replace(/(arxiv\.org\/(?:abs|pdf)\/[^/]+?)v\d+$/, "$1");
    out = out.replace(/^(arxiv\.org)\/pdf\//, "$1/abs/");
    return out;
  } catch (error) {
    return String(value).trim().toLowerCase();
  }
}

export function normalizeTitle(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
}

export function periodFromdate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  const [year, month] = String(date).split("-").map(Number);
  return `${year}-H${month <= 6 ? 1 : 2}`;
}

export function scoreKeywords(haystack, keywords) {
  const lower = haystack.toLowerCase();
  let hits = 0;
  keywords.forEach((keyword) => { if (lower.includes(keyword)) hits += 1; });
  return hits;
}
