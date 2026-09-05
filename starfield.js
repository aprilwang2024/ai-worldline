/*
 * 星空 — AI 画布上的世界线知识图谱。
 *
 * 伽利略（chat-widget.js）根据用户选择的兴趣视角调用 OpenAI 兼容接口，
 * 把整条时间线重新组织成一张节点-边图谱；本模块负责校验 LLM 输出、
 * 用无依赖的 Canvas 2D 引擎渲染（力导向布局 + 星点闪烁 + 缩放平移），
 * 并支持点击星点让 LLM 持续向外扩展（无限展开）。
 *
 * 画布宿主可在「伽利略面板的星空容器」与「星空路由的舞台」之间迁移，
 * 状态与动画循环始终保持。
 */
(function () {
  "use strict";

  const data = window.AI_WORLDLINE_DATA;
  if (!data) return;

  const STORAGE_KEY = "ai-worldline-chat-settings";
  const SUGGESTIONS = ["模型参数", "模型结构", "训练数据量", "算力基础设施演进", "开源与地缘竞争", "AI 研究者们的爱恨情仇"];
  const KINDS = new Set(["concept", "org", "event", "era"]);
  const KIND_COLORS = { concept: "#9fc2ff", org: "#ffd28a", event: "#8af0c8", era: "#e0a6ff" };
  const KIND_LABELS = { concept: "概念", org: "机构", event: "事件", era: "时期" };

  // ---------- 模型配置（与 chat-widget.js 同一套设置） ----------

  function loadSettings() {
    const defaults = window.AI_WORLDLINE_CHAT_CONFIG || {};
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {}; } catch (error) { saved = {}; }
    return {
      endpoint: text(saved.endpoint) || text(defaults.endpoint),
      model: text(saved.model) || text(defaults.model),
      apiKey: text(saved.apiKey) || text(defaults.apiKey),
      // 星空专用快速模型：留空则回退到对话模型
      starModel: text(saved.starModel) || text(defaults.starModel),
    };
  }

  function generationModel() {
    const settings = loadSettings();
    return settings.starModel || settings.model;
  }

  function text(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function isConfigured() {
    const settings = loadSettings();
    return Boolean(settings.endpoint && settings.model);
  }

  async function callLLM(messages, { temperature = 0.6, onDelta = null } = {}) {
    const settings = loadSettings();
    const model = generationModel();
    if (!settings.endpoint || !model) throw new Error("还没有配置对话模型");
    const base = settings.endpoint.replace(/\/+$/, "");
    const body = {
      model,
      messages,
      temperature,
      stream: Boolean(onDelta),
      // qwen 系模型走非思考模式，星空生成明显更快
      ...(model.startsWith("qwen") ? { enable_thinking: false } : {}),
    };
    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} — ${(await response.text().catch(() => "")).slice(0, 160)}`);
    }
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    if (onDelta && contentType.includes("text/event-stream")) {
      let full = "";
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
              if (typeof delta === "string" && delta) {
                full += delta;
                onDelta(delta, full);
              }
            } catch (error) { /* 忽略不完整分片 */ }
          }
        }
      }
      if (!full.trim()) throw new Error("模型没有返回内容");
      return full;
    }
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw new Error("模型没有返回内容");
    if (onDelta) onDelta(content, content);
    return content;
  }

  function extractJsonObject(text) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const body = fenced ? fenced[1] : text;
    const start = body.indexOf("{");
    const end = body.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("模型响应中没有 JSON 对象");
    return JSON.parse(body.slice(start, end + 1));
  }

  // ---------- 世界线索引（与对话共用同一份数据） ----------

  function sortedEvents() {
    return [...data.events].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }

  function eventIndexText() {
    const laneLabels = { event: "事件", tech: "技术" };
    return sortedEvents()
      .map((event) => `- ${event.id}｜${event.date ? event.date.slice(0, 10) : event.period}｜${laneLabels[event.lane] || event.lane}｜${event.title}｜${event.short}`)
      .join("\n");
  }

  // ---------- 图谱校验 ----------

  function slug(value) {
    return /^[a-z0-9][a-z0-9-]{1,60}$/.test(String(value || ""));
  }

  function normalizeNode(raw, usedIds, knownEventIds) {
    if (!raw || !slug(raw.id) || usedIds.has(raw.id)) return null;
    const label = String(raw.label || "").trim().slice(0, 14);
    if (!label) return null;
    usedIds.add(raw.id);
    return {
      id: raw.id,
      label,
      kind: KINDS.has(raw.kind) ? raw.kind : "concept",
      summary: String(raw.summary || "").trim().slice(0, 140),
      eventIds: (Array.isArray(raw.eventIds) ? raw.eventIds : []).filter((id) => knownEventIds.has(id)).slice(0, 3),
      magnitude: Math.min(5, Math.max(1, Number(raw.magnitude) || 3)),
    };
  }

  function normalizeEdges(rawEdges, nodeIds) {
    const seen = new Set();
    const edges = [];
    (Array.isArray(rawEdges) ? rawEdges : []).forEach((edge) => {
      const source = String(edge?.source || "");
      const target = String(edge?.target || "");
      if (source === target || !nodeIds.has(source) || !nodeIds.has(target)) return;
      const key = [source, target].sort().join("→");
      if (seen.has(key)) return;
      seen.add(key);
      edges.push({ source, target, relation: String(edge?.relation || "").slice(0, 10) });
    });
    return edges;
  }

  function parseGraphPayload(content, existingNodeIds) {
    const payload = extractJsonObject(content);
    const knownEventIds = new Set(data.events.map((event) => event.id));
    const usedIds = new Set(existingNodeIds);
    const nodes = (Array.isArray(payload.nodes) ? payload.nodes : [])
      .map((raw) => normalizeNode(raw, usedIds, knownEventIds))
      .filter(Boolean)
      .slice(0, 18);
    if (!nodes.length) throw new Error("模型没有产出可用节点");
    const nodeIds = new Set([...existingNodeIds, ...nodes.map((node) => node.id)]);
    const edges = normalizeEdges(payload.edges, nodeIds);
    return { lens: String(payload.lens || "").slice(0, 30), nodes, edges };
  }

  // 流式增量解析：模型输出的 JSON 每完成一个节点/边对象就立即回调，
  // 让星空「逐点、逐线」生长，而不是等全部生成完才出现。
  function createStreamingGraphParser({ onNode, onEdge }) {
    const knownEventIds = new Set(data.events.map((event) => event.id));
    const seenNodes = new Set();
    const seenEdges = new Set();
    let buf = "";
    let cursor = 0;
    let inString = false;
    let escaped = false;
    let depth = 0;
    let objectStart = -1;

    function handleObject(raw) {
      let obj;
      try { obj = JSON.parse(raw); } catch (error) { return; }
      if (!obj || typeof obj !== "object") return;
      if (typeof obj.source === "string" && typeof obj.target === "string") {
        const key = [obj.source, obj.target].sort().join("→");
        if (!seenEdges.has(key) && obj.source !== obj.target) {
          seenEdges.add(key);
          onEdge({ source: obj.source, target: obj.target, relation: String(obj.relation || "").slice(0, 10) });
        }
        return;
      }
      if (typeof obj.label === "string" && !seenNodes.has(obj.id)) {
        // normalizeNode 会把合法 id 写入 seenNodes（去重），失败的节点留待后续重试
        const node = normalizeNode(obj, seenNodes, knownEventIds);
        if (node) onNode(node);
      }
    }

    return {
      feed(chunk) {
        buf += chunk;
        for (; cursor < buf.length; cursor += 1) {
          const ch = buf[cursor];
          if (inString) {
            if (escaped) escaped = false;
            else if (ch === "\\") escaped = true;
            else if (ch === '"') inString = false;
            continue;
          }
          if (ch === '"') { inString = true; continue; }
          if (ch === "{") { depth += 1; if (depth === 2) objectStart = cursor; continue; }
          if (ch === "}") {
            if (depth === 2 && objectStart >= 0) handleObject(buf.slice(objectStart, cursor + 1));
            depth -= 1;
            objectStart = -1;
          }
        }
      },
    };
  }

  // ---------- 图谱状态 ----------

  const graph = { lens: "", nodes: new Map(), edges: [] };
  const expanded = new Set();
  let narrative = "";
  const engine = { current: null };
  let nodeSelectHandler = null;
  let busy = false;
  let mountedHost = null;

  function makeRuntimeNode(node, anchor = null, index = 0) {
    const base = anchor ? { x: anchor.x, y: anchor.y } : positionForIndex(index);
    const angle = Math.random() * Math.PI * 2;
    const radius = anchor ? 46 + Math.random() * 34 : 8 + Math.random() * 14;
    return {
      ...node,
      degree: 0,
      x: base.x + Math.cos(angle) * radius,
      y: base.y + Math.sin(angle) * radius * 0.8,
      vx: 0,
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      born: performance.now(),
      alpha: 0,
      expanded: false,
    };
  }

  // 螺旋布点：流式生成时每颗新星按黄金角依次落位
  function positionForIndex(index) {
    const angle = index * 2.39996;
    const radius = 56 + Math.sqrt(index + 1) * 44;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius * 0.85 };
  }

  function rebuildRuntime() {
    if (!engine.current) return;
    engine.current.setGraph(
      [...graph.nodes.values()],
      graph.edges.map((edge) => ({ ...edge })),
    );
  }

  // ---------- LLM 生成与扩展 ----------

  async function generate(lens, handlers = {}) {
    const { onStatus = () => {}, onDelta = () => {}, onNode = () => {}, onEdge = () => {} } = handlers;
    if (busy) throw new Error("伽利略正在编织另一片星空");
    if (!isConfigured()) throw new Error("还没有配置对话模型：请先在伽利略设置里填入 API 信息");
    busy = true;
    try {
      graph.lens = "";
      graph.nodes.clear();
      graph.edges = [];
      expanded.clear();
      rebuildRuntime();
      onStatus(`正在读取整条世界线，围绕「${lens}」重新编织…`);

      const parser = createStreamingGraphParser({
        onNode(node) {
          const runtime = makeRuntimeNode(node, null, graph.nodes.size);
          graph.nodes.set(node.id, runtime);
          engine.current?.addNode(runtime);
          onNode(runtime);
        },
        onEdge(edge) {
          const source = graph.nodes.get(edge.source);
          const target = graph.nodes.get(edge.target);
          if (!source || !target) return;
          if (graph.edges.some((existing) => existing.source === edge.source && existing.target === edge.target)) return;
          graph.edges.push(edge);
          source.degree += 1;
          target.degree += 1;
          engine.current?.addEdge(edge);
          onEdge(edge);
        },
      });

      const system = [
        "你是「AI 世界线」的策展助理伽利略。用户给了一个兴趣视角，请以该视角把下面的世界线条目索引重新组织成一张知识图谱（不是时间顺序，而是视角下的概念聚类与关联）。",
        "",
        "只输出一个 JSON 对象（不要代码围栏、不要解释文字）：",
        '{"lens":"视角短语","nodes":[{"id":"英文kebab-id","label":"中文短标签(≤12字)","kind":"concept|org|event|era","summary":"1-2句中文说明","eventIds":["索引中真实条目id，0-3个"],"magnitude":1到5的整数}],"edges":[{"source":"节点id","target":"节点id","relation":"中文关系(≤8字)"}]}',
        "",
        "要求：",
        "1. 12-16 个节点，边至少是节点数的 1.3 倍，整图连通；",
        "2. 围绕视角聚类：中心概念、代表机构/事件、关键转折、张力与呼应；",
        "3. eventIds 只能取自下方索引的真实 id，用于把星点锚定回条目；",
        "4. magnitude 表示该节点在视角下的重要度（5 最亮）。",
        "",
        "【世界线条目索引（id｜日期｜类别｜标题｜一句话摘要）】",
        eventIndexText(),
      ].join("\n");

      const content = await callLLM([
        { role: "system", content: system },
        { role: "user", content: `兴趣视角：${lens}` },
      ], {
        temperature: 0.55,
        onDelta: (delta) => {
          parser.feed(delta);
          onDelta(delta);
        },
      });

      // 流结束：以完整文本做最终校验，剔除增量阶段混入的不合格节点/边（保留已落位坐标）
      const parsed = parseGraphPayload(content, new Set());
      graph.lens = parsed.lens || lens;
      const kept = new Set();
      parsed.nodes.forEach((node, index) => {
        kept.add(node.id);
        const existing = graph.nodes.get(node.id);
        if (existing) {
          Object.assign(existing, node);
          return;
        }
        graph.nodes.set(node.id, makeRuntimeNode(node, null, index));
      });
      graph.edges = parsed.edges.filter((edge) => kept.has(edge.source) && kept.has(edge.target));
      graph.nodes.forEach((node) => { node.degree = 0; });
      graph.edges.forEach((edge) => {
        const source = graph.nodes.get(edge.source);
        const target = graph.nodes.get(edge.target);
        source.degree += 1;
        target.degree += 1;
      });
      rebuildRuntime();
      engine.current?.pulse();
      return { lens: graph.lens, nodeCount: graph.nodes.size, edgeCount: graph.edges.length, model: generationModel() };
    } finally {
      busy = false;
    }
  }

  async function expandNode(nodeId, onStatus = () => {}, onDelta = null) {
    if (busy) throw new Error("伽利略正在展开另一片星域");
    const anchor = graph.nodes.get(nodeId);
    if (!anchor) throw new Error("找不到这颗星");
    if (expanded.has(nodeId)) return { added: 0 };
    if (!isConfigured()) throw new Error("还没有配置对话模型");
    busy = true;
    try {
      onStatus(`伽利略正在展开「${anchor.label}」的周边星域…`);
      const neighborhood = graph.edges
        .filter((edge) => edge.source === nodeId || edge.target === nodeId)
        .map((edge) => `${edge.source} —${edge.relation}→ ${edge.target}`)
        .join("\n");
      const anchorEvents = (anchor.eventIds || [])
        .map((id) => data.events.find((event) => event.id === id))
        .filter(Boolean)
        .map((event) => `【${event.title}】${event.what}${event.why ? " 为什么重要：" + event.why : ""}`)
        .join("\n");
      const system = [
        "你是「AI 世界线」的策展助理伽利略。当前有一张围绕特定视角的知识图谱，用户点击了其中一颗星，请你围绕它向外扩展 5-8 颗新星。",
        "",
        "只输出一个 JSON 对象：",
        '{"lens":"沿用原视角","nodes":[{"id":"新的英文kebab-id，不得与已有节点重复","label":"≤12字","kind":"concept|org|event|era","summary":"1-2句","eventIds":["真实条目id，0-3个"],"magnitude":1-5}],"edges":[{"source":"已有或新节点id","target":"已有或新节点id","relation":"≤8字"}]}',
        "",
        "要求：新节点应覆盖目标星的上游起源、下游影响、同期对照与跨域呼应；每条新边至少一端连到目标星或其相邻星；eventIds 只能来自下方索引。",
        "",
        `【当前镜头】${graph.lens}`,
        `【目标星】${anchor.id}（${anchor.label}）：${anchor.summary}`,
        neighborhood ? `【目标星现有连线】\n${neighborhood}` : "【目标星现有连线】（暂无）",
        anchorEvents ? `【目标星锚定的世界线条目】\n${anchorEvents}` : "",
        `【全部已有节点 id】${[...graph.nodes.keys()].join(", ")}`,
        "",
        "【世界线条目索引】",
        eventIndexText(),
      ].filter(Boolean).join("\n");
      const content = await callLLM([
        { role: "system", content: system },
        { role: "user", content: `请展开「${anchor.label}」。` },
      ], { temperature: 0.7, onDelta: typeof onDelta === "function" ? onDelta : null });
      const parsed = parseGraphPayload(content, new Set(graph.nodes.keys()));
      const added = parsed.nodes.map((node) => {
        const runtime = makeRuntimeNode(node, anchor);
        graph.nodes.set(node.id, runtime);
        engine.current?.addNode(runtime);
        return runtime;
      });
      if (!added.length) throw new Error("模型没有产出新节点（可能与已有星点重复）");
      const newEdges = parsed.edges.filter((edge) => graph.nodes.has(edge.source) && graph.nodes.has(edge.target));
      newEdges.forEach((edge) => {
        graph.nodes.get(edge.source).degree += 1;
        graph.nodes.get(edge.target).degree += 1;
        engine.current?.addEdge(edge);
      });
      graph.edges = graph.edges.concat(newEdges);
      expanded.add(nodeId);
      anchor.expanded = true;
      engine.current?.pulse();
      return { added: added.length, edges: newEdges.length };
    } finally {
      busy = false;
    }
  }

  // ---------- Canvas 引擎 ----------

  function createEngine(host) {
    const wrap = document.createElement("div");
    wrap.className = "starfield-canvas-wrap";
    const canvas = document.createElement("canvas");
    canvas.className = "starfield-canvas";
    wrap.append(canvas);
    host.append(wrap);
    const ctx = canvas.getContext("2d");
    const bodyFont = getComputedStyle(document.body).fontFamily;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const view = { x: 0, y: 0, scale: 1 };
    let nodes = [];
    let edges = [];
    let simAlpha = 0;
    let raf = 0;
    let meteors = [];
    let nextMeteorAt = 2000;
    const bgStars = Array.from({ length: 110 }, () => ({
      nx: Math.random(),
      ny: Math.random(),
      r: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.2,
    }));

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 10);
      height = Math.max(rect.height, 10);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function toScreen(node) {
      return {
        x: (node.x - view.x) * view.scale + width / 2,
        y: (node.y - view.y) * view.scale + height / 2,
      };
    }

    function pick(screenX, screenY) {
      let best = null;
      let bestDistance = Infinity;
      nodes.forEach((node) => {
        const point = toScreen(node);
        const radius = (5 + node.magnitude * 1.4 + node.degree * 0.6) * view.scale;
        const distance = Math.hypot(point.x - screenX, point.y - screenY);
        if (distance < radius + 7 && distance < bestDistance) { best = node; bestDistance = distance; }
      });
      return best;
    }

    function step() {
      if (simAlpha > 0.015 && nodes.length) {
        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j += 1) {
            const b = nodes[j];
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let d2 = dx * dx + dy * dy;
            if (d2 < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 1; }
            const repulse = (2600 * simAlpha) / d2;
            const d = Math.sqrt(d2);
            const fx = (dx / d) * repulse;
            const fy = (dy / d) * repulse;
            a.vx -= fx; a.vy -= fy;
            b.vx += fx; b.vy += fy;
          }
          a.vx += (0 - a.x) * 0.0016 * simAlpha;
          a.vy += (0 - a.y) * 0.0016 * simAlpha;
        }
        edges.forEach((edge) => {
          const a = graph.nodes.get(edge.source);
          const b = graph.nodes.get(edge.target);
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (d - 130) * 0.012 * simAlpha;
          const fx = (dx / d) * force;
          const fy = (dy / d) * force;
          a.vx += fx; a.vy += fy;
          b.vx -= fx; b.vy -= fy;
        });
        nodes.forEach((node) => {
          node.vx *= 0.86;
          node.vy *= 0.86;
          node.x += Math.max(-4, Math.min(4, node.vx));
          node.y += Math.max(-4, Math.min(4, node.vy));
        });
        simAlpha *= 0.985;
      }
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      ctx.fillStyle = "rgba(200, 216, 255, 0.55)";
      bgStars.forEach((star) => {
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * star.speed + star.phase));
        ctx.globalAlpha = twinkle * 0.5;
        ctx.beginPath();
        ctx.arc(star.nx * width, star.ny * height, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 流星：随机划过，让等待与浏览都有生命感
      if (now > nextMeteorAt) {
        meteors.push({
          x: width * (0.15 + Math.random() * 0.7),
          y: height * (0.05 + Math.random() * 0.35),
          vx: 90 + Math.random() * 130,
          vy: 55 + Math.random() * 75,
          born: now,
          life: 800 + Math.random() * 500,
        });
        nextMeteorAt = now + 2600 + Math.random() * 4200;
      }
      meteors = meteors.filter((meteor) => now - meteor.born < meteor.life);
      meteors.forEach((meteor) => {
        const age = (now - meteor.born) / meteor.life;
        const elapsed = (age * meteor.life) / 1000;
        const x = meteor.x + meteor.vx * elapsed;
        const y = meteor.y + meteor.vy * elapsed;
        const alpha = Math.sin(Math.PI * age) * 0.8;
        const gradient = ctx.createLinearGradient(x - meteor.vx * 0.22, y - meteor.vy * 0.22, x, y);
        gradient.addColorStop(0, "rgba(210, 226, 255, 0)");
        gradient.addColorStop(1, `rgba(228, 239, 255, ${alpha})`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x - meteor.vx * 0.22, y - meteor.vy * 0.22);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      ctx.lineWidth = 1;
      edges.forEach((edge) => {
        const a = graph.nodes.get(edge.source);
        const b = graph.nodes.get(edge.target);
        if (!a || !b) return;
        const pa = toScreen(a);
        const pb = toScreen(b);
        ctx.strokeStyle = `rgba(140, 170, 255, ${0.14 + Math.min(a.degree + b.degree, 10) * 0.012})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
        if (edge.relation && view.scale > 0.9) {
          ctx.fillStyle = "rgba(190, 208, 255, 0.4)";
          ctx.font = "10px " + bodyFont;
          ctx.textAlign = "center";
          ctx.fillText(edge.relation, (pa.x + pb.x) / 2, (pa.y + pb.y) / 2 - 3);
        }
      });

      nodes.forEach((node) => {
        const point = toScreen(node);
        const appear = Math.min(1, (now - node.born) / 900);
        const twinkle = 0.78 + 0.22 * Math.sin(t * 1.3 + node.phase);
        const alpha = appear * twinkle;
        const radius = Math.max(2.5, (4.5 + node.magnitude * 1.4 + node.degree * 0.55) * view.scale);
        const color = KIND_COLORS[node.kind] || KIND_COLORS.concept;
        const halo = ctx.createRadialGradient(point.x, point.y, radius * 0.4, point.x, point.y, radius * 3.1);
        halo.addColorStop(0, hexWithAlpha(color, 0.32 * alpha));
        halo.addColorStop(1, hexWithAlpha(color, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius * 3.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(point.x - radius * 0.25, point.y - radius * 0.3, radius * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.92;
        ctx.fillStyle = "rgba(222, 232, 255, 0.95)";
        ctx.font = `${Math.max(10, 11.5 * Math.min(view.scale, 1.4))}px ` + bodyFont;
        ctx.textAlign = "center";
        ctx.fillText(node.label, point.x, point.y + radius + 14);
        ctx.globalAlpha = 1;
      });
    }

    function hexWithAlpha(hex, alpha) {
      const value = hex.replace("#", "");
      const r = parseInt(value.slice(0, 2), 16);
      const g = parseInt(value.slice(2, 4), 16);
      const b = parseInt(value.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function loop(now) {
      step();
      draw(now);
      raf = requestAnimationFrame(loop);
    }

    // 交互：拖拽平移、滚轮缩放、点击选星
    let gesture = null;
    canvas.addEventListener("pointerdown", (event) => {
      gesture = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y, moved: false };
      try { canvas.setPointerCapture(event.pointerId); } catch (error) { /* 合成事件或无真实指针时忽略 */ }
      canvas.classList.add("is-panning");
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!gesture) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (Math.hypot(dx, dy) > 4) gesture.moved = true;
      if (gesture.moved) {
        view.x = gesture.viewX - dx / view.scale;
        view.y = gesture.viewY - dy / view.scale;
      }
    });
    canvas.addEventListener("pointerup", (event) => {
      canvas.classList.remove("is-panning");
      const wasGesture = gesture;
      gesture = null;
      if (!wasGesture || wasGesture.moved) return;
      const rect = canvas.getBoundingClientRect();
      const node = pick(event.clientX - rect.left, event.clientY - rect.top);
      if (node && nodeSelectHandler) nodeSelectHandler(node);
    });
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? 1.12 : 0.9, event.clientX, event.clientY);
    }, { passive: false });

    function zoomBy(factor, anchorX, anchorY) {
      const rect = canvas.getBoundingClientRect();
      const ax = anchorX == null ? width / 2 : anchorX - rect.left;
      const ay = anchorY == null ? height / 2 : anchorY - rect.top;
      const worldX = (ax - width / 2) / view.scale + view.x;
      const worldY = (ay - height / 2) / view.scale + view.y;
      view.scale = Math.min(2.8, Math.max(0.35, view.scale * factor));
      view.x = worldX - (ax - width / 2) / view.scale;
      view.y = worldY - (ay - height / 2) / view.scale;
    }

    resize();
    raf = requestAnimationFrame(loop);
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    return {
      canvas: wrap,
      setGraph(nextNodes, nextEdges) {
        nodes = nextNodes;
        edges = nextEdges;
        simAlpha = Math.max(simAlpha, 0.9);
      },
      addNode(node) {
        nodes.push(node);
        simAlpha = Math.max(simAlpha, 0.65);
      },
      addEdge(edge) {
        edges.push(edge);
        simAlpha = Math.max(simAlpha, 0.5);
      },
      pulse() { simAlpha = 1; },
      zoomBy,
      resetView() { view.x = 0; view.y = 0; view.scale = 1; },
      destroy() {
        cancelAnimationFrame(raf);
        observer.disconnect();
        wrap.remove();
      },
    };
  }

  // ---------- 对外接口 ----------

  function mount(host) {
    if (!host) return;
    if (!engine.current) engine.current = createEngine(host);
    else if (engine.current.canvas.parentNode !== host) host.append(engine.current.canvas);
    engine.current.resize?.();
    mountedHost = host;
    rebuildRuntime();
  }

  function unmount() {
    mountedHost = null;
  }

  function moveCanvasTo(host) {
    if (!engine.current || !host) return;
    if (engine.current.canvas.parentNode !== host) host.append(engine.current.canvas);
    mountedHost = host;
  }

  window.AI_WORLDLINE_STARFIELD = {
    getSuggestions: () => [...SUGGESTIONS],
    hasGraph: () => graph.nodes.size > 0,
    getLens: () => graph.lens,
    getNodeIds: () => [...graph.nodes.keys()],
    getNarrative: () => narrative,
    recordNarrative(next) { narrative = String(next || "").slice(0, 40000); },
    isBusy: () => busy,
    isMounted: () => Boolean(mountedHost),
    onNodeSelect(handler) { nodeSelectHandler = typeof handler === "function" ? handler : null; },
    selectNode(nodeId) {
      const node = graph.nodes.get(nodeId);
      if (node && nodeSelectHandler) nodeSelectHandler(node);
    },
    generate,
    expandNode,
    mount,
    unmount,
    moveCanvasTo,
    zoomBy: (factor) => engine.current?.zoomBy(factor),
    resetView: () => engine.current?.resetView(),
  };
})();
