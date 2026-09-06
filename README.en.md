# AI Worldline

**A source-first timeline of foundation models, agents, and world models.**

[Bilingual overview](./README.md) · [简体中文](./README.zh-CN.md) · [Live site](https://aprilwang2024.github.io/ai-worldline/) · [Browse the data](./data/timeline.json) · [Suggest an entry](../../issues/new?template=add-event.yml)

![AI Worldline demo](./assets/ai-worldline-demo.gif)

AI Worldline is an interactive, half-year-by-half-year map of the foundation-model era. It separates two questions that are often mixed together:

- **Events** — companies, institutions, launches, and moments that changed the market.
- **Technology** — papers, architectures, research programs, and open-source breakthroughs that changed what was possible.

The public timeline has one deliberate cross-cutting slice: **world models / non-world-models**. Every entry explains what happened, why it mattered, what it changed, and links back to papers, code, or official announcements.

## Why this is different

Most AI timelines are either long lists or news archives. AI Worldline is designed as a research index:

- every entry has at least one attributable source;
- primary papers, full text, code, and official releases come first;
- interpretation is separated into “what happened / why it mattered / what changed”;
- filters reveal a theme without turning it into a separate, misleading history;
- the world-model slice can be viewed on its own without becoming a misleading third lane;
- unfinished periods can be marked as `watching` instead of being presented as settled fact.

The current archive covers **2017–2026**, with **93 entries** and **132 unique sources**. The world-model slice contains **34 entries** across model-based reinforcement learning, predictive representation, interactive generation, embodied AI, autonomous driving, and spatial intelligence.

## Use it

The published site is static and has no runtime dependencies. To run it locally:

```bash
python3 -m http.server 8808
```

Then open `http://127.0.0.1:8808/`.

You can also open `index.html` directly. Node.js is only required when changing the canonical dataset.

## Ask AI

The in-site assistant "**伽利略** (Galileo)" lives in a draggable round button that snaps to any page edge (position is remembered) and unfolds into a chat panel with a smooth animation. It answers questions using the full text knowledge of the timeline (every loaded entry) plus the page you are currently viewing (route, active slice, selected entry). Select any text on the page, right-click and choose "让伽利略讨论这段内容" to send the passage to the assistant; the entry's source panel offers a one-click shortcut as well. It talks to any OpenAI-compatible Chat Completions endpoint:

The **星空 (Starfield)** tab is Galileo's AI canvas: entering the page auto-opens Galileo's dialog to pick an interest lens (e.g. "模型参数", "算力基础设施演进", "AI 研究者们的爱恨情仇"); the starfield page then weaves the timeline live — stars light up one by one and edges are drawn progressively beside the streaming model output. Clicking any star expands its neighbourhood the same way, star by star, indefinitely. Generation uses a fast non-thinking model by default (configure via `starModel` in `chat-config.js`); chat keeps using your main model.

- **Local preview with a real model**: `CHAT_API_KEY=your-key npm run preview`, then open `http://127.0.0.1:8808/` — the preview server ships a same-origin proxy, so the key stays in the local process and never reaches the browser or the repository (defaults to Zhipu `glm-5`; override with `CHAT_MODEL` / `CHAT_UPSTREAM`);
- **Site maintainers** can preset `endpoint` and `model` in [`chat-config.js`](./chat-config.js) (optionally with a key held by a private proxy), or **visitors** can enter their own credentials via the ⚙ panel — keys are stored only in the visitor's browser.

The scheduled update pipeline (collect → dedupe and rank → LLM draft → human-reviewed draft PRs) is implemented; see [`docs/auto-update-roadmap.md`](./docs/auto-update-roadmap.md) and `npm run collect` / `npm run dedupe` / `npm run draft`.

## Contribute an event

The canonical archive lives in [`data/timeline.json`](./data/timeline.json), not in the generated JavaScript bundle.

```bash
npm run validate
npm run build:data
npm test
```

Each pull request is checked for duplicate IDs, unknown periods and taxonomies, invalid dates, missing explanations, malformed URLs, and entries without sources. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the editorial and technical workflow.

If you do not want to edit JSON, use the structured [event suggestion form](../../issues/new?template=add-event.yml) or [correction form](../../issues/new?template=correction.yml).

## Project structure

```text
data/timeline.json       canonical timeline and topic data
data/schema.json         JSON Schema for editors
scripts/                 validation and data generation
timeline-data.js         generated browser-compatible bundle
app.js                   filters, search, permalinks, and details
chat-config.js           endpoint and model config for the in-site AI chat
chat-widget.js           in-site AI chat widget
styles.css               visual system and responsive layout
docs/                    planning and design documents
.github/                 CI, Pages deployment, and contribution forms
```

## Editorial policy

This is a curated map, not a claim to contain all of AI history. Inclusion rules, source hierarchy, correction policy, and the distinction between facts and interpretation are documented in [`EDITORIAL_POLICY.md`](./EDITORIAL_POLICY.md). The detailed world-model research ledger is available in [`report-source.md`](./report-source.md).

## License

Code is available under the [MIT License](./LICENSE). Timeline data, summaries, and editorial content are available under [CC BY 4.0](./LICENSE-CONTENT.md). Source publications remain the property of their respective authors and publishers.
