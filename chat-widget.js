/*
 * 站内 AI 助手「伽利略」— 依据整条世界线的文本知识 + 用户当前页面回答提问。
 *
 * 知识全部来自页面已加载的 window.AI_WORLDLINE_DATA（data/timeline.json 的构建产物）：
 * 全量条目以一行索引进入系统提示，与提问相关的条目再附完整详情，
 * 因此无需任何服务端检索组件。对话通过 OpenAI 兼容的
 * Chat Completions 接口完成，端点与密钥来自 chat-config.js，
 * 访客也可以在面板设置里填自己的密钥（仅存 localStorage）。
 *
 * 交互：伽利略平时是一个可拖动的圆形按钮吸附在页面左右边缘（位置持久化），
 * 点击后从按钮所在方位展开为对话框；选中页面文字后右键可选择「让伽利略讨论」。
 */
(function () {
  "use strict";

  const data = window.AI_WORLDLINE_DATA;
  const defaults = window.AI_WORLDLINE_CHAT_CONFIG || {};
  if (!data) return;

  const STORAGE_KEY = "ai-worldline-chat-settings";
  const HISTORY_LIMIT = 12;
  const DETAIL_LIMIT = 14;

  const icons = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.9-3.1A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M18.5 5.5l-1.8 1.8M7.3 16.7l-1.8 1.8"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/></svg>',
  };

  const laneLabels = { event: "事件", tech: "技术" };

  let settings = loadSettings();
  let messages = [];
  let busy = false;
  let controller = null;

  // ---------- 设置 ----------

  function loadSettings() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch (error) { saved = {}; }
    return {
      endpoint: text(saved.endpoint) || text(defaults.endpoint),
      model: text(saved.model) || text(defaults.model),
      apiKey: text(saved.apiKey) || text(defaults.apiKey),
    };
  }

  function saveSettings(next) {
    settings = { ...settings, ...next };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (error) { /* 隐私模式下静默降级 */ }
  }

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function isConfigured() {
    return Boolean(settings.endpoint && settings.model);
  }

  // ---------- 视图与知识 ----------

  function getView() {
    try { return window.AI_WORLDLINE_GET_VIEW?.() || { routeLabel: "时间线" }; }
    catch (error) { return { routeLabel: "时间线" }; }
  }

  function describeView(view) {
    const parts = [view.routeLabel || "时间线"];
    if (view.route === "timeline") {
      parts.push(`主轴：${view.laneLabel || "事件＋技术"}`, `切面：${view.topicLabel || "混合显示"}`);
      if (view.searchQuery) parts.push(`搜索词：${view.searchQuery}`);
      if (view.selectedEventTitle) parts.push(`选中条目：${view.selectedEventTitle}${view.detailDrawerOpen ? "（详情抽屉已打开）" : ""}`);
    }
    if (view.route === "sources") {
      parts.push(`文献类型筛选：${view.libraryType || "all"}`);
      if (view.librarySearch) parts.push(`文献搜索词：${view.librarySearch}`);
    }
    return parts.join(" · ");
  }

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function eventHaystack(event) {
    return [event.title, event.short, event.what, event.why, event.changed, ...(event.concepts || []), ...(event.orgs || [])]
      .join(" ")
      .toLowerCase();
  }

  function tokenize(question) {
    const lower = question.toLowerCase();
    const tokens = new Set();
    (lower.match(/[a-z0-9][a-z0-9.\-+#]{1,}/g) || []).forEach((token) => tokens.add(token));
    (lower.match(/[\u4e00-\u9fff]{2,}/g) || []).forEach((run) => {
      if (run.length <= 4) tokens.add(run);
      for (let i = 0; i < run.length - 1; i += 1) tokens.add(run.slice(i, i + 2));
    });
    return [...tokens].filter((token) => token.length >= 2);
  }

  function scoreEvent(event, tokens) {
    if (!tokens.length) return 0;
    const haystack = eventHaystack(event);
    let hits = 0;
    tokens.forEach((token) => { if (haystack.includes(token)) hits += 1; });
    return hits;
  }

  function sortedEvents() {
    return [...data.events].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }

  function pickDetailEvents(question, view) {
    const events = sortedEvents();
    const picked = new Map();
    const add = (event) => { if (event && !picked.has(event.id)) picked.set(event.id, event); };

    const selected = events.find((event) => event.id === view.selectedEventId);
    add(selected);

    const tokens = tokenize([question, view.searchQuery || ""].join(" "));
    const scored = events
      .map((event) => ({ event, score: scoreEvent(event, tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    scored.forEach((item) => add(item.event));

    events.slice(-4).forEach(add);

    return [...picked.values()].slice(0, DETAIL_LIMIT);
  }

  function renderEventDetail(event) {
    const lines = [
      `### ${event.title}`,
      `- 日期：${event.date || event.period}；类别：${laneLabels[event.lane] || event.lane}${(event.topics || []).includes("world-model") ? "；切面：世界模型" : ""}`,
      `- 发生了什么：${event.what}`,
      `- 为什么重要：${event.why}`,
      `- 改变了什么：${event.changed}`,
    ];
    if ((event.concepts || []).length) lines.push(`- 相关概念：${event.concepts.join("、")}`);
    if ((event.orgs || []).length) lines.push(`- 相关机构：${event.orgs.join("、")}`);
    if ((event.sources || []).length) {
      lines.push("- 原始来源：");
      event.sources.forEach((source) => lines.push(`  - ${source.title}（${source.publisher}${source.date ? "，" + source.date : ""}）：${source.fullText || source.url}`));
    }
    return lines.join("\n");
  }

  function buildSystemPrompt(question, view) {
    const events = sortedEvents();
    const index = events
      .map((event) => `- ${event.date ? event.date.slice(0, 10) : event.period}｜${laneLabels[event.lane] || event.lane}｜${event.title}｜${event.short}`)
      .join("\n");
    const details = pickDetailEvents(question, view).map(renderEventDetail).join("\n\n");
    return [
      "你是「AI 世界线」的站内研究助手。AI 世界线是一张按半年整理的基础模型、智能体与世界模型演进图谱，每个条目都回到论文、代码或官方发布等一手来源。",
      "",
      "回答规则：",
      "1. 只依据下方「世界线知识库」与「用户当前页面」回答；引用条目时给出条目标题与日期，并尽量附出来源链接。",
      "2. 知识库不是完整的 AI 历史。超出其覆盖范围的问题，如实说明本站未收录，不要编造事件、日期、机构或链接。",
      "3. 「用户当前页面」描述了用户正在看的内容；当用户问到「这个条目」「当前视图」时，以该上下文作答。",
      "4. 用用户提问的语言回答（默认中文），先给结论，再给依据，保持简洁，可用短段落或要点列表。",
      "",
      `【用户当前页面】${describeView(view)}（${view.url || ""}）`,
      "",
      "【世界线知识库 · 全部条目索引（日期｜类别｜标题｜一句话摘要）】",
      index,
      "",
      "【与本问题相关条目的详情】",
      details || "（未检索到明显相关条目，请依靠索引回答）",
    ].join("\n");
  }

  // ---------- Markdown 轻量渲染（先转义，后替换，防注入） ----------

  function renderInline(text) {
    return text
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  function renderMarkdown(text) {
    return escapeHTML(text).split(/\n{2,}/).map((block) => {
      const lines = block.split("\n");
      if (lines.length === 1 && /^#{1,4}\s+/.test(lines[0])) {
        return `<h4>${renderInline(lines[0].replace(/^#{1,4}\s+/, ""))}</h4>`;
      }
      if (lines.length && lines.every((line) => /^\s*\d+[.、]\s*/.test(line))) {
        return `<ol>${lines.map((line) => `<li>${renderInline(line.replace(/^\s*\d+[.、]\s*/, ""))}</li>`).join("")}</ol>`;
      }
      let html = "";
      let inList = false;
      for (const line of lines) {
        const item = line.match(/^\s*[-*]\s+(.*)$/);
        if (item) {
          if (!inList) { html += "<ul>"; inList = true; }
          html += `<li>${renderInline(item[1])}</li>`;
        } else {
          if (inList) { html += "</ul>"; inList = false; }
          if (line.trim()) html += `<p>${renderInline(line)}</p>`;
        }
      }
      if (inList) html += "</ul>";
      return html;
    }).join("");
  }

  // ---------- API 调用 ----------

  function describeError(error) {
    if (error?.name === "AbortError") return null;
    if (error instanceof TypeError) {
      return "请求失败：无法连接到 API 端点。请检查地址是否正确，以及该 API 是否允许浏览器跨域（CORS）访问。";
    }
    const message = String(error?.message || "未知错误");
    if (/401|403/.test(message)) return `请求被拒绝（${message}）：请检查 API 密钥是否有效。`;
    if (/404/.test(message)) return `端点不存在（${message}）：请确认 API 地址应以服务根路径结尾（例如 https://api.deepseek.com），模型名是否正确。`;
    if (/429/.test(message)) return `请求过于频繁或额度不足（${message}），请稍后再试。`;
    return `请求失败：${message}`;
  }

  async function requestCompletion(apiMessages, onDelta) {
    const base = settings.endpoint.replace(/\/+$/, "");
    controller = new AbortController();
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
      },
      body: JSON.stringify({ model: settings.model, messages: apiMessages, stream: true, temperature: 0.4 }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`HTTP ${response.status}${detail ? ` — ${detail.slice(0, 220)}` : ""}`);
    }
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("text/event-stream")) {
      const json = await response.json();
      const content = json?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content) onDelta(content);
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split(/\n\n/);
      buffer = chunks.pop() || "";
      for (const chunk of chunks) {
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) onDelta(delta);
          } catch (error) { /* 忽略不完整分片 */ }
        }
      }
    }
  }

  // ---------- 界面 ----------

  const root = document.createElement("div");
  root.className = "ai-chat";
  root.innerHTML = `
    <button class="ai-chat-fab" type="button" aria-label="伽利略 · AI 世界线助手" title="伽利略 · AI 世界线助手（可拖动到页面边缘吸附）">
      <span class="ai-chat-face" aria-hidden="true"><svg viewBox="0 0 48 48"><circle class="ai-chat-face-body" cx="24" cy="24" r="20"/><g class="ai-chat-eyes"><circle cx="17.5" cy="20.5" r="2.5"/><circle cx="30.5" cy="20.5" r="2.5"/></g><path class="ai-chat-smile" d="M18.5 29.5q5.5 4.5 11 0"/></svg></span>
    </button>
    <section class="ai-chat-panel" role="dialog" aria-label="伽利略 · AI 世界线助手">
      <header class="ai-chat-head">
        <div class="ai-chat-title">${icons.chat}<span>伽利略 · 世界线助手</span></div>
        <div class="ai-chat-head-actions">
          <button class="ai-chat-icon-button" type="button" data-chat-action="settings" aria-label="对话设置" title="对话设置">${icons.gear}</button>
          <button class="ai-chat-icon-button" type="button" data-chat-action="clear" aria-label="清空对话" title="清空对话">${icons.trash}</button>
          <button class="ai-chat-icon-button" type="button" data-chat-action="close" aria-label="关闭对话框">${icons.close}</button>
        </div>
      </header>
      <div class="ai-chat-context"><span class="ai-chat-context-chip" data-chat-context>准备中…</span></div>
      <form class="ai-chat-settings" data-chat-settings hidden>
        <label>API 端点（OpenAI 兼容，根路径）<input type="url" name="endpoint" placeholder="https://api.deepseek.com" autocomplete="off" /></label>
        <label>模型名称<input type="text" name="model" placeholder="deepseek-chat" autocomplete="off" /></label>
        <label>API 密钥<input type="password" name="apiKey" placeholder="仅保存在本浏览器" autocomplete="off" /></label>
        <div class="ai-chat-settings-actions">
          <span class="ai-chat-settings-note">密钥只保存在你的浏览器本地，不经过本站服务器。</span>
          <button type="submit" class="ai-chat-save">保存</button>
        </div>
      </form>
      <div class="ai-chat-messages" data-chat-messages></div>
      <form class="ai-chat-composer">
        <textarea data-chat-input rows="1" placeholder="问点什么，比如：世界模型这条线是怎么演进的？"></textarea>
        <button class="ai-chat-send" type="submit" aria-label="发送">${icons.send}</button>
      </form>
      <footer class="ai-chat-foot">回答仅基于本站收录的条目 · 生成内容可能有误，重要判断请回原始来源核对</footer>
    </section>`;

  const fab = root.querySelector(".ai-chat-fab");
  const panel = root.querySelector(".ai-chat-panel");
  const contextChip = root.querySelector("[data-chat-context]");
  const settingsForm = root.querySelector("[data-chat-settings]");
  const messagesEl = root.querySelector("[data-chat-messages]");
  const composer = root.querySelector(".ai-chat-composer");
  const input = root.querySelector("[data-chat-input]");
  const sendButton = root.querySelector(".ai-chat-send");

  function refreshContextChip() {
    contextChip.textContent = `当前页面：${describeView(getView())}`;
  }

  // ---------- 边缘吸附与拖拽（支持左/右/上/下四边） ----------
  const DOCK_KEY = "ai-worldline-chat-dock";

  function clampRatio(value) {
    return Math.min(0.94, Math.max(0.06, value));
  }

  function loadDock() {
    try {
      const saved = JSON.parse(localStorage.getItem(DOCK_KEY) || "null");
      const edges = ["left", "right", "top", "bottom"];
      if (saved && edges.includes(saved.edge) && typeof saved.ratio === "number") {
        return { edge: saved.edge, ratio: clampRatio(saved.ratio) };
      }
      if (saved && edges.includes(saved.side) && typeof saved.ratio === "number") {
        return { edge: saved.side, ratio: clampRatio(saved.ratio) };
      }
    } catch (error) { /* 隐私模式下使用默认位置 */ }
    return { edge: "right", ratio: 0.64 };
  }

  let dock = loadDock();
  let dragState = null;

  function isOpen() {
    return panel.classList.contains("is-open");
  }

  function applyDock({ snap = false } = {}) {
    root.classList.toggle("dock-left", dock.edge === "left");
    root.classList.toggle("dock-right", dock.edge === "right");
    root.classList.toggle("dock-top", dock.edge === "top");
    root.classList.toggle("dock-bottom", dock.edge === "bottom");
    ["top", "left", "right", "bottom"].forEach((prop) => { fab.style[prop] = ""; });
    const size = fab.offsetWidth || 54;
    const pad = 20;
    if (dock.edge === "left" || dock.edge === "right") {
      const top = Math.min(window.innerHeight - size - 12, Math.max(12, dock.ratio * window.innerHeight - size / 2));
      fab.style.top = `${Math.round(top)}px`;
      fab.style[dock.edge] = `${pad}px`;
    } else {
      const left = Math.min(window.innerWidth - size - 12, Math.max(12, dock.ratio * window.innerWidth - size / 2));
      fab.style.left = `${Math.round(left)}px`;
      fab.style[dock.edge] = `${pad}px`;
    }
    if (snap) {
      fab.classList.add("is-snapping");
      window.setTimeout(() => fab.classList.remove("is-snapping"), 380);
    }
    let originX;
    let originY;
    if (dock.edge === "left") { originX = "0%"; originY = dock.ratio <= 0.5 ? "top" : "bottom"; }
    else if (dock.edge === "right") { originX = "100%"; originY = dock.ratio <= 0.5 ? "top" : "bottom"; }
    else if (dock.edge === "top") { originY = "top"; originX = dock.ratio <= 0.5 ? "0%" : "100%"; }
    else { originY = "bottom"; originX = dock.ratio <= 0.5 ? "0%" : "100%"; }
    panel.style.transformOrigin = window.innerWidth <= 760 ? "50% 100%" : `${originX} ${originY}`;
  }

  function open(prefill = "") {
    applyDock();
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    fab.classList.add("is-hidden");
    refreshContextChip();
    if (prefill) {
      input.value = prefill;
      autosize();
    }
    input.focus();
  }

  function close() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    settingsForm.hidden = true;
    fab.classList.remove("is-hidden");
  }

  function discuss(selection) {
    const trimmed = String(selection || "").trim().slice(0, 1200);
    if (trimmed) open(`我想和你讨论页面上选中的这段内容：\n\n「${trimmed}」\n\n请先概括它的要点，再结合世界线知识库谈谈你的看法。`);
    else open();
  }

  function onDragMove(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(deltaX, deltaY) > 6) {
      dragState.moved = true;
      fab.classList.add("is-dragging");
    }
    if (!dragState.moved) return;
    const size = fab.offsetWidth || 54;
    fab.style.left = `${Math.round(Math.min(window.innerWidth - size - 12, Math.max(12, dragState.rect.left + deltaX)))}px`;
    fab.style.top = `${Math.round(Math.min(window.innerHeight - size - 12, Math.max(12, dragState.rect.top + deltaY)))}px`;
    fab.style.right = "";
    fab.style.bottom = "";
  }

  function endDragListeners() {
    window.removeEventListener("pointermove", onDragMove, true);
    window.removeEventListener("pointerup", onDragEnd, true);
    window.removeEventListener("pointercancel", onDragCancel, true);
  }

  function onDragEnd(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    endDragListeners();
    const wasDrag = dragState.moved;
    fab.classList.remove("is-dragging");
    dragState = null;
    if (!wasDrag) {
      open();
      return;
    }
    const distances = {
      left: event.clientX,
      right: window.innerWidth - event.clientX,
      top: event.clientY,
      bottom: window.innerHeight - event.clientY,
    };
    dock.edge = Object.keys(distances).reduce((a, b) => (distances[a] <= distances[b] ? a : b));
    dock.ratio = clampRatio((dock.edge === "left" || dock.edge === "right")
      ? event.clientY / window.innerHeight
      : event.clientX / window.innerWidth);
    try { localStorage.setItem(DOCK_KEY, JSON.stringify(dock)); } catch (error) { /* 忽略持久化失败 */ }
    applyDock({ snap: true });
  }

  function onDragCancel() {
    endDragListeners();
    fab.classList.remove("is-dragging");
    dragState = null;
    applyDock({ snap: true });
  }

  fab.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, rect: fab.getBoundingClientRect(), moved: false };
    window.addEventListener("pointermove", onDragMove, true);
    window.addEventListener("pointerup", onDragEnd, true);
    window.addEventListener("pointercancel", onDragCancel, true);
  });
  // 键盘激活（Enter/Space 触发的 click 没有 detail），避免与 pointerup 重复打开
  fab.addEventListener("click", (event) => { if (event.detail === 0) open(); });
  window.addEventListener("resize", () => applyDock());

  // ---------- 选中文本 → 右键发送给伽利略 ----------
  let menuSelection = "";
  const contextMenu = document.createElement("div");
  contextMenu.className = "ai-chat-context-menu";
  contextMenu.setAttribute("role", "menu");
  contextMenu.setAttribute("aria-label", "发送给伽利略");
  contextMenu.setAttribute("aria-hidden", "true");
  contextMenu.innerHTML = `<button type="button" role="menuitem" data-menu-action="discuss">${icons.chat}<span>让伽利略讨论这段内容</span></button>`;

  function isMenuOpen() {
    return contextMenu.classList.contains("is-open");
  }

  function hideContextMenu() {
    contextMenu.classList.remove("is-open");
    contextMenu.setAttribute("aria-hidden", "true");
    menuSelection = "";
  }

  document.addEventListener("contextmenu", (event) => {
    const selection = String(window.getSelection?.() || "").trim();
    if (selection.length < 2 || root.contains(event.target)) { hideContextMenu(); return; }
    event.preventDefault();
    menuSelection = selection.slice(0, 1200);
    const menuWidth = 248;
    const menuHeight = 44;
    contextMenu.style.left = `${Math.max(12, Math.min(event.clientX, window.innerWidth - menuWidth - 12))}px`;
    contextMenu.style.top = `${Math.max(12, Math.min(event.clientY, window.innerHeight - menuHeight - 12))}px`;
    contextMenu.classList.add("is-open");
    contextMenu.setAttribute("aria-hidden", "false");
  });
  contextMenu.addEventListener("click", (event) => {
    if (!event.target.closest("[data-menu-action]")) return;
    const selection = menuSelection;
    hideContextMenu();
    discuss(selection);
  });
  document.addEventListener("pointerdown", (event) => {
    if (isMenuOpen() && !contextMenu.contains(event.target)) hideContextMenu();
  }, true);
  window.addEventListener("blur", hideContextMenu);
  window.addEventListener("resize", hideContextMenu);
  window.addEventListener("scroll", hideContextMenu, true);


  function toggleSettings() {
    settingsForm.hidden = !settingsForm.hidden;
    if (!settingsForm.hidden) {
      settingsForm.endpoint.value = settings.endpoint;
      settingsForm.model.value = settings.model;
      settingsForm.apiKey.value = settings.apiKey;
      settingsForm.endpoint.focus();
    }
  }

  function autosize() {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 132)}px`;
  }

  function appendMessage(role, content) {
    const bubble = document.createElement("div");
    bubble.className = `ai-chat-message is-${role}`;
    bubble.innerHTML = role === "user"
      ? `<div class="ai-chat-bubble">${escapeHTML(content).replaceAll("\n", "<br>")}</div>`
      : `<div class="ai-chat-bubble">${renderMarkdown(content)}</div>`;
    messagesEl.append(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function updateWelcome() {
    if (messages.length) return;
    const configured = isConfigured();
    appendMessage("assistant", configured
      ? "我是伽利略，本站的世界线助手 🪐 我可以依据收录的全部条目和你正在看的页面回答问题。试试：\n- 世界模型这条研究线是怎么演进的？\n- 2024 年有哪些关键发布？\n- 选中页面里的一段文字，右键发给我讨论"
      : "我是伽利略，本站的世界线助手 🪐 我可以依据收录的全部条目和你正在看的页面回答问题，但还没有配置对话模型。请点右上角 ⚙ 填入任意 OpenAI 兼容 API（端点、模型名、密钥），密钥只保存在你的浏览器本地。");
  }

  async function send() {
    const question = input.value.trim();
    if (!question || busy) return;
    if (!isConfigured()) {
      appendMessage("user", question);
      input.value = "";
      autosize();
      appendMessage("assistant", "还没有配置对话模型：请点面板右上角 ⚙，填入任意 OpenAI 兼容 API 的端点、模型名与密钥后再试。");
      return;
    }

    const view = getView();
    refreshContextChip();
    appendMessage("user", question);
    input.value = "";
    autosize();

    const apiMessages = [
      { role: "system", content: buildSystemPrompt(question, view) },
      ...messages.slice(-HISTORY_LIMIT),
      { role: "user", content: question },
    ];
    messages.push({ role: "user", content: question });

    busy = true;
    sendButton.innerHTML = icons.stop;
    sendButton.setAttribute("aria-label", "停止生成");
    const bubble = appendMessage("assistant", "");
    const body = bubble.querySelector(".ai-chat-bubble");
    body.innerHTML = '<p class="ai-chat-typing">思考中…</p>';

    let answer = "";
    const onDelta = (delta) => {
      if (!answer) body.innerHTML = "";
      answer += delta;
      body.innerHTML = renderMarkdown(answer);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    try {
      await requestCompletion(apiMessages, onDelta);
      if (!answer) {
        answer = "（模型没有返回内容，请检查模型名称后重试。）";
        body.innerHTML = renderMarkdown(answer);
      }
      messages.push({ role: "assistant", content: answer });
    } catch (error) {
      const message = describeError(error);
      if (message) {
        if (answer) {
          body.insertAdjacentHTML("beforeend", `<p class="ai-chat-error">${escapeHTML(message)}</p>`);
          messages.push({ role: "assistant", content: answer });
        } else {
          body.innerHTML = `<p class="ai-chat-error">${escapeHTML(message)}</p>`;
          messages.pop();
        }
      } else if (answer) {
        // 用户主动停止：保留已生成的部分
        messages.push({ role: "assistant", content: answer });
      } else {
        messages.pop();
      }
    } finally {
      busy = false;
      controller = null;
      sendButton.innerHTML = icons.send;
      sendButton.setAttribute("aria-label", "发送");
      input.focus();
    }
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-chat-action]");
    if (!button) return;
    if (button.dataset.chatAction === "close") close();
    if (button.dataset.chatAction === "settings") toggleSettings();
    if (button.dataset.chatAction === "clear") {
      if (busy) controller?.abort();
      messages = [];
      messagesEl.innerHTML = "";
      updateWelcome();
    }
  });
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSettings({
      endpoint: settingsForm.endpoint.value,
      model: settingsForm.model.value,
      apiKey: settingsForm.apiKey.value,
    });
    settingsForm.hidden = true;
    if (!messages.length) { messagesEl.innerHTML = ""; updateWelcome(); }
    refreshContextChip();
  });
  composer.addEventListener("submit", (event) => {
    event.preventDefault();
    if (busy) { controller?.abort(); return; }
    send();
  });
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    send();
  });
  input.addEventListener("compositionend", autosize);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (isMenuOpen()) { hideContextMenu(); return; }
    if (!isOpen()) return;
    if (!settingsForm.hidden) settingsForm.hidden = true;
    else close();
  });
  function onAppStateChange() {
    if (isOpen()) refreshContextChip();
  }
  // 筛选等站内状态通过 history.pushState/replaceState 写入，不会触发 hashchange，
  // 在这里包装一层以便面板打开时实时更新「当前页面」提示。
  const nativePushState = window.history.pushState?.bind(window.history);
  const nativeReplaceState = window.history.replaceState?.bind(window.history);
  if (nativePushState) {
    window.history.pushState = (...args) => {
      const result = nativePushState(...args);
      onAppStateChange();
      return result;
    };
  }
  if (nativeReplaceState) {
    window.history.replaceState = (...args) => {
      const result = nativeReplaceState(...args);
      onAppStateChange();
      return result;
    };
  }
  window.addEventListener("hashchange", onAppStateChange);
  window.addEventListener("popstate", onAppStateChange);

  updateWelcome();
  applyDock({ snap: false });
  document.body.append(root);
  document.body.append(contextMenu);
  window.AI_WORLDLINE_CHAT = {
    open,
    close: close,
    discuss,
  };
})();
