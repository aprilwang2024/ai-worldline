#!/usr/bin/env node
/*
 * 本机预览服务：静态站点 + OpenAI 兼容对话代理（用于接入 GLM 等模型实测）。
 *
 * 用法：
 *   CHAT_API_KEY=sk-xxx node scripts/dev-chat-proxy.mjs
 *   CHAT_API_KEY=sk-xxx CHAT_MODEL=glm-5 CHAT_UPSTREAM=https://coding.dashscope.aliyuncs.com/v1 node scripts/dev-chat-proxy.mjs --port 8808
 *
 * - 静态文件服务仓库根目录（http://127.0.0.1:8808）；
 * - 同源转发 POST /v1/chat/completions 到上游并注入 Authorization，
 *   因此页面配置只需 endpoint="/v1"，浏览器永远接触不到密钥；
 * - 密钥只从环境变量或 --key 读取，不会写入任何仓库文件。
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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

const args = parseArgs(process.argv.slice(2));
const port = Number(args.port || process.env.PORT || 8808);
const model = args.model || process.env.CHAT_MODEL || "glm-5";
const upstream = String(args.upstream || process.env.CHAT_UPSTREAM || "https://coding.dashscope.aliyuncs.com/v1").replace(/\/+$/, "");
const apiKey = String(args.key || process.env.CHAT_API_KEY || "");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".gif": "image/gif",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

function send(res, status, contentType, body) {
  res.writeHead(status, { "Content-Type": contentType, "Cache-Control": "no-store" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 4 * 1024 * 1024) { reject(new Error("request body too large")); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function proxyChat(req, res) {
  if (!apiKey) {
    return send(res, 503, "application/json", JSON.stringify({ error: { message: "dev-chat-proxy 未配置 CHAT_API_KEY，无法转发对话请求" } }));
  }
  let upstreamRes;
  try {
    upstreamRes = await fetch(`${upstream}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: await readBody(req),
      signal: AbortSignal.timeout(300000),
    });
  } catch (error) {
    return send(res, 502, "application/json", JSON.stringify({ error: { message: `上游请求失败：${error.message}` } }));
  }
  const headers = {
    "Content-Type": upstreamRes.headers.get("content-type") || "application/json",
    "Cache-Control": "no-store",
  };
  res.writeHead(upstreamRes.status, headers);
  if (upstreamRes.body) Readable.fromWeb(upstreamRes.body).pipe(res);
  else res.end();
}

function injectChatConfig(html) {
  const anchor = '<script src="./chat-widget.js';
  if (!html.includes(anchor)) return html;
  const inline = `<script>window.AI_WORLDLINE_CHAT_CONFIG = Object.assign({}, window.AI_WORLDLINE_CHAT_CONFIG, { endpoint: "/v1", model: ${JSON.stringify(model)} });</script>\n    `;
  return html.replace(anchor, `${inline}${anchor}`);
}

async function serveStatic(url, res, method) {
  const pathname = decodeURIComponent(url.pathname);
  const rel = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(root, rel));
  if (!filePath.startsWith(root + sep) && filePath !== root) return send(res, 403, "text/plain", "forbidden");
  let content;
  try {
    content = await readFile(filePath);
  } catch (error) {
    return send(res, 404, "text/plain", "not found");
  }
  if (filePath.endsWith("index.html") && apiKey) content = Buffer.from(injectChatConfig(content.toString("utf8")), "utf8");
  res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream", "Cache-Control": "no-store" });
  res.end(method === "HEAD" ? undefined : content);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://127.0.0.1");
    if (req.method === "POST" && url.pathname === "/v1/chat/completions") return await proxyChat(req, res);
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "text/plain", "method not allowed");
    await serveStatic(url, res, req.method);
  } catch (error) {
    send(res, 500, "text/plain", `internal error: ${error.message}`);
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`ai-worldline 预览服务: http://127.0.0.1:${port}/`);
  console.log(`对话上游: ${upstream} · 模型: ${model} · 密钥: ${apiKey ? "已配置（仅进程内存）" : "未配置（仅静态预览）"}`);
});
