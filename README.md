# AI Worldline

**A source-first map of how modern AI changed.**

[中文](./README.zh-CN.md) · [Live site](https://aprilwang2024.github.io/ai-worldline/) · [Read the storylines](https://aprilwang2024.github.io/ai-worldline/#stories) · [Browse the data](./data/timeline.json) · [Suggest an entry](../../issues/new?template=add-event.yml)

![AI Worldline timeline](./assets/product-preview.png)

AI Worldline is an interactive, half-year-by-half-year map of the modern AI era. It separates two questions that are often mixed together:

- **Events** — companies, institutions, launches, and moments that changed the market.
- **Technology** — papers, architectures, research programs, and open-source breakthroughs that changed what was possible.

The public timeline has one deliberate cross-cutting slice: **world models / non-world-models**. Three editorial storylines connect selected events into causal reading paths. Every entry explains what happened, why it mattered, what it changed, and links back to papers, code, or official announcements.

## Why this is different

Most AI timelines are either long lists or news archives. AI Worldline is designed as a research index:

- every entry has at least one attributable source;
- primary papers, full text, code, and official releases come first;
- interpretation is separated into “what happened / why it mattered / what changed”;
- filters reveal a theme without turning it into a separate, misleading history;
- the world-model slice can be viewed on its own without becoming a misleading third lane;
- storylines reuse canonical events to explain phases and causal change;
- unfinished periods can be marked as `watching` instead of being presented as settled fact.

The current archive covers **2017–2026**, with **93 entries**, **132 unique sources**, and **3 curated storylines**. The world-model slice contains **34 entries** across model-based reinforcement learning, predictive representation, interactive generation, embodied AI, autonomous driving, and spatial intelligence.

## Use it

The published site is static and has no runtime dependencies. To run it locally:

```bash
python3 -m http.server 8808
```

Then open `http://127.0.0.1:8808/`.

You can also open `index.html` directly. Node.js is only required when changing the canonical dataset.

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
data/timeline.json       canonical timeline, topic, and storyline data
data/schema.json         JSON Schema for editors
scripts/                 validation and data generation
timeline-data.js         generated browser-compatible bundle
app.js                   filters, storylines, search, permalinks, and details
styles.css               visual system and responsive layout
.github/                 CI, Pages deployment, and contribution forms
```

## Editorial policy

This is a curated map, not a claim to contain all of AI history. Inclusion rules, source hierarchy, correction policy, and the distinction between facts and interpretation are documented in [`EDITORIAL_POLICY.md`](./EDITORIAL_POLICY.md). The detailed world-model research ledger is available in [`report-source.md`](./report-source.md).

## License

Code is available under the [MIT License](./LICENSE). Timeline data, summaries, and editorial content are available under [CC BY 4.0](./LICENSE-CONTENT.md). Source publications remain the property of their respective authors and publishers.
