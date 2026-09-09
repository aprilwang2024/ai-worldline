# Changelog

All material additions and corrections to AI Worldline are recorded here.

## 1.3.0 — 2026-09-09

- added Galileo chat, text-selection discussion, the AI starfield, and a scheduled source-to-draft-PR pipeline, contributed by [aszzp](https://github.com/aszzp) in [#1](https://github.com/aprilwang2024/ai-worldline/pull/1);
- fixed model parameter compatibility, model availability feedback, direct starfield entry, custom lenses, and compact-screen controls;
- validated generated draft dates, taxonomies, and original source URLs, prevented stale draft reuse, and added regression tests;
- kept automated drafts behind human review; collection can run without a model key.

## 1.2.1 — 2026-09-03

- narrowed the project description to foundation models, agents, and world models;
- made the source panel and timeline toolbar responsive across common desktop zoom levels;
- refreshed the animated README demo with the custom wordmark and current timeline views.

## 1.2.0 — 2026-09-03

- added a lightweight animated README demo covering the timeline, world-model slice, event details, and source library;
- replaced the English-only default README with a bilingual project overview and dedicated Chinese and English guides;
- made the language switch and live site prominent at the top of every README.
- removed the storyline feature, its interpretive data, UI, routes, styles, and validation rules to keep the project source-first and maintainable;

## 1.1.1 — 2026-09-02

- separated the timeline controls into a primary-lane group and a topic-slice group;
- renamed the ambiguous “all” states to “event + technology” and “mixed view”;
- simplified the public topic choices to world models and non-world-models;
- fixed timeline content painting over the source panel at compact desktop widths.

## 1.1.0 — 2026-09-02

- added three curated storylines that connect existing events into causal reading paths;
- migrated the single `topic` field to composable `topics[]` tags;
- added an Agent Software slice alongside world models and MoE;
- made timeline topic filters data-driven while preserving the non-world-model view;
- added storyline, phase, node, and cross-reference validation.

## 1.0.0 — 2026-09-02

- prepared AI Worldline as a standalone open-source project;
- introduced canonical JSON data and a documented schema;
- added deterministic data generation and automated validation;
- added bilingual project documentation and contribution governance;
- added source-backed world-model coverage across six research and industry branches;
- added stable links for timeline views and individual events;
- added GitHub Pages and pull-request validation workflows.
