(function () {
  "use strict";

  const data = window.AI_WORLDLINE_DATA;
  const app = document.querySelector("#app");
  const toast = document.querySelector("#toast");
  const mobileNav = document.querySelector("#mobile-nav");

  if (!data || !app) return;

  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8l4 4v13H6zM14 3.5v4h4M9 12h6M9 15.5h5"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 .8-4-2-5-2.5M14.5 21v-3.2a2.8 2.8 0 0 0-.8-2.2c2.6-.3 5.3-1.3 5.3-5.8A4.5 4.5 0 0 0 17.8 6a4.2 4.2 0 0 0-.1-3.7S16.8 2 14.5 3.5a12 12 0 0 0-6 0C6.2 2 5.3 2.3 5.3 2.3A4.2 4.2 0 0 0 5.2 6 4.5 4.5 0 0 0 4 9.8c0 4.5 2.7 5.5 5.3 5.8a2.8 2.8 0 0 0-.8 2.2V21"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.4 2.5 3.5 5.5 3.5 9S14.4 18.5 12 21c-2.4-2.5-3.5-5.5-3.5-9S9.6 5.5 12 3"/></svg>',
    target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="10" height="11" rx="1"/><path d="M15 8V5H6v11h2"/></svg>',
  };

  const sourceLabels = {
    paper: "论文",
    official: "官方发布",
    documentation: "文档",
    engineering: "工程文章",
    essay: "文章",
    report: "报告",
    reporting: "报道",
    retrospective: "回顾",
    talk: "演讲",
    code: "代码",
  };

  const validLanes = new Set(["all", ...Object.keys(data.lanes)]);
  const validRoutes = new Set(["timeline", "sources", "about"]);
  const publicTopics = new Set(["all", "world-model", "not-world-model"]);
  const initialParams = new URLSearchParams(window.location.search);
  const requestedView = initialParams.get("view");
  const requestedTopic = initialParams.get("topic");
  const requestedEvent = data.events.find((event) => event.id === initialParams.get("event"));
  const initialLane = validLanes.has(requestedView) ? requestedView : "all";
  const initialTopic = publicTopics.has(requestedTopic)
    ? requestedTopic
    : requestedView === "world-model"
      ? "world-model"
      : requestedView === "other" ? "not-world-model" : "all";

  const state = {
    route: getRoute(),
    lane: initialLane,
    topic: initialTopic,
    query: initialParams.get("q") || "",
    selectedId: requestedEvent?.id || data.events.find((event) => event.id === "kimi-k3")?.id || data.events.at(-1)?.id,
    drawerOpen: Boolean(requestedEvent && initialParams.get("open") === "1"),
    timelineHasPosition: false,
    libraryQuery: "",
    libraryType: "all",
  };

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(value = "") {
    return escapeHTML(value).replaceAll("`", "&#096;");
  }

  function getRoute() {
    const route = window.location.hash.replace("#", "");
    return validRoutes.has(route) ? route : "timeline";
  }

  function normalizeRoute() {
    const route = window.location.hash.replace("#", "");
    if (validRoutes.has(route)) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("story");
    url.hash = "timeline";
    window.history.replaceState(null, "", url);
  }

  function readLocationState() {
    const params = new URLSearchParams(window.location.search);
    const nextView = params.get("view");
    const nextTopic = params.get("topic");
    const nextEvent = data.events.find((event) => event.id === params.get("event"));
    state.route = getRoute();
    state.lane = validLanes.has(nextView) ? nextView : "all";
    state.topic = publicTopics.has(nextTopic)
      ? nextTopic
      : nextView === "world-model"
        ? "world-model"
        : nextView === "other" ? "not-world-model" : "all";
    state.query = params.get("q") || "";
    if (nextEvent) state.selectedId = nextEvent.id;
    state.drawerOpen = Boolean(nextEvent && params.get("open") === "1");
    syncSelectionToVisibleEvents();
  }

  function writeLocationState({ historyMode = "replace", open = state.drawerOpen } = {}) {
    const url = new URL(window.location.href);
    url.search = "";
    if (state.route === "timeline") {
      if (state.lane !== "all") url.searchParams.set("view", state.lane);
      if (state.topic !== "all") url.searchParams.set("topic", state.topic);
      if (state.query.trim()) url.searchParams.set("q", state.query.trim());
      if (state.selectedId) url.searchParams.set("event", state.selectedId);
      if (open && state.selectedId) url.searchParams.set("open", "1");
    }
    url.hash = state.route;
    window.history[historyMode === "push" ? "pushState" : "replaceState"](null, "", url);
    updateDocumentMeta();
  }

  function eventPermalink(eventId) {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("event", eventId);
    url.searchParams.set("open", "1");
    url.hash = "timeline";
    return url.toString();
  }

  function updateDocumentMeta() {
    const event = getSelectedEvent();
    const hasExplicitEvent = Boolean(state.route === "timeline" && event && new URLSearchParams(window.location.search).has("event"));
    const routeTitles = { sources: "文献库 · AI 世界线", about: "关于 · AI 世界线" };
    document.title = hasExplicitEvent ? `${event.title} · AI 世界线` : routeTitles[state.route] || "AI 世界线";
    const description = hasExplicitEvent
      ? event.what
      : "AI 世界线：追踪基础模型、智能体与世界模型的关键演进，每个节点回到原始来源。";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  function getSelectedEvent() {
    return data.events.find((event) => event.id === state.selectedId) || null;
  }

  function eventHasTopic(event, topicId) {
    return Array.isArray(event.topics) && event.topics.includes(topicId);
  }

  function topicLabels(event) {
    return [eventHasTopic(event, "world-model") ? "世界模型" : "非世界模型"];
  }

  function eventMatches(event, query = state.query) {
    if (!query.trim()) return true;
    const haystack = [event.title, event.short, event.what, event.why, ...(event.concepts || []), ...(event.orgs || [])].join(" ").toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  }

  function sortEvents(events) {
    return [...events].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }

  function getPeriodEvents(periodId, type) {
    return sortEvents(data.events.filter((event) => {
      if (event.period !== periodId || event.lane !== type || !eventMatches(event)) return false;
      return eventPassesTopic(event);
    }));
  }

  function visibleTypes() {
    if (state.lane === "event") return ["event"];
    if (state.lane === "tech") return ["tech"];
    return ["event", "tech"];
  }

  function eventPassesTopic(event) {
    if (state.topic === "not-world-model") return !eventHasTopic(event, "world-model");
    if (state.topic !== "all") return eventHasTopic(event, state.topic);
    return true;
  }

  function eventPassesView(event) {
    const laneMatches = state.lane === "all" || event.lane === state.lane;
    return laneMatches && eventPassesTopic(event);
  }

  function syncSelectionToVisibleEvents() {
    const visible = sortEvents(data.events.filter((event) => eventPassesView(event) && eventMatches(event)));
    if (!visible.some((event) => event.id === state.selectedId)) state.selectedId = visible.at(-1)?.id || null;
  }

  function render() {
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.route === state.route));
    if (state.route === "timeline") renderTimeline();
    if (state.route === "sources") renderLibrary();
    if (state.route === "about") renderAbout();
  }

  function renderTimeline() {
    const selected = getSelectedEvent();
    app.innerHTML = `
      <section class="timeline-screen" aria-label="AI 世界线主时间轴">
        <div class="timeline-main">
          <div class="toolbar">
            <div class="view-switch" aria-label="筛选时间线">
              <div class="filter-group" role="group" aria-label="选择主轴"><span class="filter-label">主轴</span>${renderLaneButton("all", "事件＋技术")}${renderLaneButton("event", "事件")}${renderLaneButton("tech", "技术")}</div>
              <span class="view-divider" role="separator" aria-hidden="true"></span>
              <div class="filter-group" role="group" aria-label="选择专题切面"><span class="filter-label">切面</span>${renderTopicButton("all", "混合显示")}${renderTopicButton("world-model", "世界模型")}${renderTopicButton("not-world-model", "非世界模型")}</div>
            </div>
            <label class="search-box">${icons.search}<input id="timeline-search" type="search" value="${escapeAttr(state.query)}" placeholder="搜索事件、技术或机构" autocomplete="off" /></label>
          </div>
          <div class="timeline-viewport" id="timeline-viewport">${renderDesktopBoard()}${renderMobileChronology()}</div>
          <footer class="timeline-footer">
            <span class="timeline-hint">2017 → 2026 · ${data.events.length} 个条目 · ${getLibraryRows().length} 份来源</span>
            <div class="timeline-utilities"><button class="utility-button" type="button" data-action="go-current">${icons.target}<span>回到现在</span></button></div>
          </footer>
        </div>
        <aside class="source-panel" aria-label="所选条目的文献">${renderSourcePanel(selected)}</aside>
      </section>${renderDetailDrawer(selected)}`;
    bindTimelineEvents();
    positionTimeline();
  }

  function renderLaneButton(key, label) {
    return `<button class="view-button ${state.lane === key ? "is-active" : ""}" type="button" data-lane="${key}" aria-pressed="${state.lane === key}">${label}</button>`;
  }

  function renderTopicButton(key, label) {
    const active = state.topic === key;
    const title = key === "all" ? "同时显示世界模型与非世界模型" : active ? "再次点击返回混合显示" : `只看${escapeAttr(label)}`;
    return `<button class="view-button ${active ? "is-active" : ""}" type="button" data-topic="${key}" aria-pressed="${active}" title="${title}">${escapeHTML(label)}</button>`;
  }

  function renderDesktopBoard() {
    const currentIndex = Math.max(0, data.periods.findIndex((period) => period.id === data.meta.currentPeriod));
    const types = visibleTypes();
    return `<div class="desktop-board" style="--period-count:${data.periods.length};--current-index:${currentIndex}">
      <div class="current-line" aria-hidden="true"><span>今天</span></div>
      <div class="period-header"><div class="period-range"><button type="button" data-action="scroll-left" aria-label="向前查看">${icons.left}</button><span>2017&nbsp;&nbsp;→&nbsp;&nbsp;2026</span><button type="button" data-action="scroll-right" aria-label="向后查看">${icons.right}</button></div>${data.periods.map((period) => `<div class="period-cell ${period.status === "current" ? "is-current" : ""}" data-period-header="${escapeAttr(period.id)}">${escapeHTML(period.label)}</div>`).join("")}</div>
      ${types.map((type) => renderDesktopRow(type)).join("")}
    </div>`;
  }

  function rowMeta(type) { return data.lanes[type]; }

  function renderDesktopRow(type) {
    const meta = rowMeta(type);
    return `<section class="timeline-row row-${type}" aria-label="${escapeAttr(meta.label)}"><header class="row-label"><h2>${escapeHTML(meta.label)}</h2><p>${escapeHTML(meta.caption)}</p></header>${data.periods.map((period) => { const events = getPeriodEvents(period.id, type); return `<div class="timeline-cell ${events.length > 3 ? "is-dense" : ""}" data-period="${escapeAttr(period.id)}">${events.map((event) => renderTimelineEvent(event, type)).join("")}</div>`; }).join("")}</section>`;
  }

  function renderTimelineEvent(event, type = event.lane) {
    const date = event.date ? event.date.slice(0, 10) : event.period;
    return `<button class="event-entry ${eventHasTopic(event, "world-model") ? "topic-world-model" : ""} ${state.selectedId === event.id ? "is-selected" : ""} ${event.importance === "major" ? "is-major" : ""}" type="button" data-event-id="${escapeAttr(event.id)}" data-event-type="${escapeAttr(type)}" aria-label="查看 ${escapeAttr(event.title)}"><strong>${escapeHTML(event.title)}</strong><span class="event-date">${escapeHTML(date)}</span><span class="event-summary">${escapeHTML(event.short)}</span></button>`;
  }

  function renderMobileChronology() {
    const types = visibleTypes();
    const periods = [...data.periods].reverse();
    return `<div class="mobile-chronology"><div class="mobile-range"><button type="button" data-action="scroll-left">${icons.left}</button><span>2017 H1&nbsp;&nbsp;—&nbsp;&nbsp;2026 H2</span><button type="button" data-action="go-current">${icons.right}</button></div><div class="mobile-periods">${periods.map((period) => { const hasEvents = types.some((type) => getPeriodEvents(period.id, type).length); if (!hasEvents && (state.query || state.lane !== "all" || state.topic !== "all")) return ""; return `<article class="mobile-period" data-mobile-period="${escapeAttr(period.id)}"><header class="mobile-period-head"><span class="mobile-period-node"></span><h2>${escapeHTML(period.label)}</h2>${period.status === "current" ? "<span>进行中</span>" : ""}</header><div class="mobile-period-body">${types.map((type) => renderMobileGroup(period.id, type)).join("")}</div></article>`; }).join("")}</div></div>`;
  }

  function renderMobileGroup(periodId, type) {
    const events = getPeriodEvents(periodId, type);
    if (!events.length) return "";
    const meta = rowMeta(type);
    return `<section class="mobile-group group-${type}"><h3>${escapeHTML(meta.label)}</h3><div>${events.map((event) => renderTimelineEvent(event, type)).join("")}</div></section>`;
  }

  function renderSourcePanel(event) {
    if (!event) return `<div class="empty-selection"><strong>选择一个条目</strong><p>原始论文、官方发布和全文链接会在这里展开。</p></div>`;
    const lane = data.lanes[event.lane];
    const topics = topicLabels(event);
    return `<div class="source-panel-inner"><div class="source-panel-head"><span>${escapeHTML([lane.label, ...topics].join(" · "))}</span></div><h2 class="selection-heading">${escapeHTML(event.title)}</h2><time class="selection-date">${escapeHTML(event.date || event.period)}</time><p class="selection-summary">${escapeHTML(event.what)}</p><div class="source-count">来源（${event.sources.length}）</div><div class="bibliography-list">${event.sources.map(renderBibliographyRow).join("")}</div><div class="source-panel-actions"><button class="source-detail-button" type="button" data-action="open-detail">查看完整条目 ${icons.right}</button><button class="source-link-button" type="button" data-action="copy-event-link" aria-label="复制条目链接">${icons.copy}</button></div></div>`;
  }

  function sourceIcon(source) {
    if (source.type === "code") return icons.github;
    if (source.type === "official" || source.type === "documentation") return icons.globe;
    return icons.file;
  }

  function renderBibliographyRow(source) {
    const link = source.fullText || source.url;
    let host = "";
    try { host = new URL(link).hostname.replace("www.", ""); } catch (error) { host = sourceLabels[source.type] || source.type; }
    return `<a class="bibliography-row" href="${escapeAttr(link)}" target="_blank" rel="noopener noreferrer"><span class="bibliography-icon">${sourceIcon(source)}</span><span class="bibliography-copy"><strong>${escapeHTML(source.title)}</strong><span>${escapeHTML(source.publisher)}</span><time>${escapeHTML(source.date || "日期未标注")}</time></span><span class="bibliography-host">${escapeHTML(host)}</span></a>`;
  }

  function renderDetailDrawer(event) {
    if (!event) return "";
    const topics = topicLabels(event);
    return `<div class="detail-backdrop ${state.drawerOpen ? "is-open" : ""}" data-action="close-detail"></div><aside class="detail-drawer ${state.drawerOpen ? "is-open" : ""}" aria-hidden="${state.drawerOpen ? "false" : "true"}"><div class="drawer-handle" aria-hidden="true"></div><header class="detail-drawer-head"><div><span>${escapeHTML([data.lanes[event.lane].label, ...topics].join(" · "))}</span><h2>${escapeHTML(event.title)}</h2><time>${escapeHTML(event.date || event.period)}</time></div><div class="drawer-actions"><button class="icon-button" type="button" data-action="copy-event-link" aria-label="复制条目链接">${icons.copy}</button><button class="icon-button" type="button" data-action="close-detail" aria-label="关闭详情">${icons.close}</button></div></header><div class="detail-body">${renderDetailSection("发生了什么", event.what)}${renderDetailSection("为什么重要", event.why)}${renderDetailSection("它改变了什么", event.changed)}<section class="detail-section"><h3>相关概念</h3><div class="tag-list">${(event.concepts || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div></section><section class="detail-section"><h3>相关机构</h3><div class="tag-list">${(event.orgs || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div></section><div class="detail-source-title">原始来源</div><div class="bibliography-list detail-bibliography">${event.sources.map((source) => renderDetailSource(source, event)).join("")}</div></div></aside>`;
  }

  function renderDetailSection(title, content) {
    return `<section class="detail-section"><h3>${title}</h3><p>${escapeHTML(content)}</p></section>`;
  }

  function renderDetailSource(source, event) {
    return `<div class="detail-source-row">${renderBibliographyRow(source)}<button type="button" data-copy-source="${escapeAttr(source.url)}" data-copy-title="${escapeAttr(source.title)}" data-copy-date="${escapeAttr(source.date || "")}" data-copy-event="${escapeAttr(event.title)}">${icons.copy}<span>复制引用</span></button></div>`;
  }

  function bindTimelineEvents() {
    document.querySelectorAll("[data-lane]").forEach((button) => button.addEventListener("click", () => { state.lane = button.dataset.lane; state.drawerOpen = false; syncSelectionToVisibleEvents(); state.timelineHasPosition = true; writeLocationState({ historyMode: "push", open: false }); renderTimeline(); }));
    document.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () => { state.topic = button.dataset.topic === "all" || state.topic === button.dataset.topic ? "all" : button.dataset.topic; state.drawerOpen = false; syncSelectionToVisibleEvents(); state.timelineHasPosition = true; writeLocationState({ historyMode: "push", open: false }); renderTimeline(); }));
    document.querySelector("#timeline-search")?.addEventListener("input", (event) => { state.query = event.target.value; state.drawerOpen = false; syncSelectionToVisibleEvents(); state.timelineHasPosition = true; writeLocationState({ open: false }); renderTimeline(); const search = document.querySelector("#timeline-search"); search?.focus(); search?.setSelectionRange(state.query.length, state.query.length); });
    document.querySelectorAll("[data-event-id]").forEach((button) => button.addEventListener("click", () => { state.selectedId = button.dataset.eventId; state.drawerOpen = window.innerWidth <= 1050; state.timelineHasPosition = true; writeLocationState({ historyMode: "push" }); renderTimeline(); }));
    bindSharedActions();
  }

  function bindSharedActions() {
    document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", (event) => {
      const action = button.dataset.action;
      if (action === "open-detail") { state.drawerOpen = true; state.timelineHasPosition = true; writeLocationState({ open: true }); renderTimeline(); }
      if (action === "close-detail") { state.drawerOpen = false; state.timelineHasPosition = true; writeLocationState({ open: false }); renderTimeline(); }
      if (action === "copy-event-link") copyEventLink();
      if (action === "go-current") scrollToPeriod(data.meta.currentPeriod, true);
      if (action === "scroll-left") scrollTimelineBy(-620);
      if (action === "scroll-right") scrollTimelineBy(620);
    }));
    document.querySelectorAll("[data-copy-source]").forEach((button) => button.addEventListener("click", () => copySource(button.dataset)));
  }

  function positionTimeline() {
    const viewport = document.querySelector("#timeline-viewport");
    if (!viewport) return;
    const prior = Number(sessionStorage.getItem("ai-worldline-scroll-v2") || 0);
    if (state.timelineHasPosition && prior) viewport.scrollLeft = prior;
    else scrollToPeriod(getSelectedEvent()?.period || data.meta.currentPeriod, false);
    state.timelineHasPosition = true;
    viewport.addEventListener("scroll", () => sessionStorage.setItem("ai-worldline-scroll-v2", String(viewport.scrollLeft)), { passive: true });
  }

  function scrollTimelineBy(delta) {
    document.querySelector("#timeline-viewport")?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function scrollToPeriod(periodId, smooth) {
    if (window.innerWidth <= 760) {
      const mobileViewport = document.querySelector("#timeline-viewport");
      const mobilePeriod = document.querySelector(`[data-mobile-period="${CSS.escape(periodId)}"]`);
      if (!mobileViewport || !mobilePeriod) return;
      mobileViewport.scrollTo({ top: Math.max(0, mobilePeriod.offsetTop - 50), behavior: smooth ? "smooth" : "auto" });
      return;
    }
    const viewport = document.querySelector("#timeline-viewport");
    const header = document.querySelector(`[data-period-header="${CSS.escape(periodId)}"]`);
    if (!viewport || !header) return;
    const target = Math.max(0, header.offsetLeft - viewport.clientWidth * 0.48);
    viewport.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
    sessionStorage.setItem("ai-worldline-scroll-v2", String(target));
  }

  function copySource(dataset) {
    copyText(`${dataset.copyTitle}. ${dataset.copyEvent}. ${dataset.copyDate}. ${dataset.copySource}`).then(() => showToast("引用信息已复制"));
  }

  function copyEventLink() {
    const event = getSelectedEvent();
    if (!event) return;
    copyText(eventPermalink(event.id)).then(() => showToast("条目链接已复制"));
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (error) { const input = document.createElement("textarea"); input.value = text; input.style.position = "fixed"; input.style.opacity = "0"; document.body.append(input); input.select(); document.execCommand("copy"); input.remove(); }
  }

  function getLibraryRows() {
    const seen = new Set(); const rows = [];
    data.events.forEach((event) => event.sources.forEach((source) => { const key = source.url || source.fullText; if (seen.has(key)) return; seen.add(key); rows.push({ ...source, eventTitle: event.title, period: event.period, lane: event.lane, topics: event.topics }); }));
    return rows;
  }

  function renderLibrary() {
    const allRows = getLibraryRows();
    const rows = allRows.filter((row) => { const typeMatches = state.libraryType === "all" || row.type === state.libraryType; const query = state.libraryQuery.trim().toLowerCase(); return typeMatches && (!query || [row.title, row.publisher, row.eventTitle, row.period].join(" ").toLowerCase().includes(query)); });
    const types = [...new Set(allRows.map((row) => row.type))].sort();
    app.innerHTML = `<section class="library-screen"><header class="page-head"><h1>文献库</h1><p>${allRows.length} 份不重复的论文、官方发布、工程文档与报道。来源不是脚注，而是时间线的一部分。</p></header><div class="library-controls"><input id="library-search" type="search" value="${escapeAttr(state.libraryQuery)}" placeholder="搜索标题、机构或对应事件"/><select id="library-type"><option value="all">全部类型</option>${types.map((type) => `<option value="${escapeAttr(type)}" ${state.libraryType === type ? "selected" : ""}>${escapeHTML(sourceLabels[type] || type)}</option>`).join("")}</select></div><table class="library-table"><thead><tr><th>时间</th><th>文献</th><th>关联条目</th><th>类型</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${escapeHTML(row.period)}</td><td><a href="${escapeAttr(row.fullText || row.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(row.title)}</a><span>${escapeHTML(row.publisher)} · ${escapeHTML(row.date || "日期未标注")}</span></td><td>${escapeHTML(row.eventTitle)}</td><td>${escapeHTML(sourceLabels[row.type] || row.type)}</td></tr>`).join("")}</tbody></table>${rows.length ? "" : `<div class="empty-page">没有匹配的文献。</div>`}</section>`;
    document.querySelector("#library-search")?.addEventListener("input", (event) => { state.libraryQuery = event.target.value; renderLibrary(); const search = document.querySelector("#library-search"); search?.focus(); search?.setSelectionRange(state.libraryQuery.length, state.libraryQuery.length); });
    document.querySelector("#library-type")?.addEventListener("change", (event) => { state.libraryType = event.target.value; renderLibrary(); });
  }

  function renderAbout() {
    app.innerHTML = `<section class="about-screen"><header class="page-head"><h1>关于这条线</h1><p>v${escapeHTML(data.meta.version)} · 更新于 ${escapeHTML(data.meta.updatedAt)}。这是一份持续编辑的研究索引，不是宣称完整的 AI 历史。</p></header><div class="about-grid"><div class="about-lead">事件记录产业如何转向。<br>技术记录能力为什么跃迁。</div><div class="about-content"><section><h2>两条主轴</h2><p><strong>事件</strong>收录商业、公司、机构和现象级产品转折；<strong>技术</strong>收录论文、架构、协议、实验室与开源社区的突破。原来的理念并入技术，机构并入事件。</p></section><section><h2>一个切面</h2><p><strong>世界模型 / 非世界模型</strong>是横跨两条主轴的专题切面。默认混合显示完整历史，也可以单独观察其中一侧；它不会被误画成互相隔离的第三条轴。</p></section><section><h2>怎样更新</h2><p>在 <code>data/timeline.json</code> 中追加半年和条目，运行数据生成与校验，再提交变更。每条记录写清“发生了什么 / 为什么重要 / 改变了什么”，并至少附一份论文全文或官方来源。</p></section><section><h2>开放共建</h2><p>项目在 <a href="https://github.com/aprilwang2024/ai-worldline" target="_blank" rel="noopener noreferrer">GitHub</a> 上开放代码、数据与编辑规则。可以提交新事件、补充原始来源或发起事实纠错。</p></section></div></div></section>`;
  }

  document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => {
    mobileNav?.classList.remove("is-open");
    state.route = button.dataset.route;
    state.drawerOpen = false;
    writeLocationState({ historyMode: "push", open: false });
    render();
    app.focus({ preventScroll: true });
  }));
  document.querySelectorAll("[data-header-action]").forEach((button) => button.addEventListener("click", () => { if (button.dataset.headerAction === "menu") mobileNav?.classList.toggle("is-open"); if (button.dataset.headerAction === "search") { if (state.route !== "timeline") window.location.hash = "timeline"; window.setTimeout(() => document.querySelector("#timeline-search")?.focus(), 0); } }));
  function handleLocationNavigation() {
    normalizeRoute();
    readLocationState();
    mobileNav?.classList.remove("is-open");
    render();
    app.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", handleLocationNavigation);
  window.addEventListener("popstate", handleLocationNavigation);
  window.addEventListener("keydown", (event) => { if (event.key !== "Escape") return; if (state.drawerOpen) { state.drawerOpen = false; writeLocationState({ open: false }); renderTimeline(); } else mobileNav?.classList.remove("is-open"); });

  normalizeRoute();
  if (requestedEvent && !eventPassesView(requestedEvent)) {
    state.lane = "all";
    state.topic = "all";
  }
  syncSelectionToVisibleEvents();
  updateDocumentMeta();
  render();
})();
