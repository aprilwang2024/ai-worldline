# 自动抓取与自动更新能力规划（Roadmap）

> 状态：**M1、M2 已实现**（2026-09-03），M3 待观察候选采纳率后再决定。本文档描述架构、组件边界、护栏与阶段路径。

## 现状结论

项目当前**不具备**自动抓取与自动更新世界线的能力。现有链路是：

```
人工发现事件 → Issue 模板（add-event / correction）
           → 维护者整理成 PR 修改 data/timeline.json
           → CI：validate.yml（npm test）+ pages.yml（build:data + 部署）
           → GitHub Pages 上线
           → 阿里云镜像每 10 分钟轮询 commit SHA，原子切换发布
```

仓库内没有任何抓取、订阅、候选管理代码；`scripts/` 只有 `validate-data.mjs` 与 `build-data.mjs`。数据的新鲜度完全取决于维护者手动更新 `data/timeline.json` 的频率。

值得保留的现状优势：

- **镜像已自动化**：`deploy/aliyun/` 的 systemd timer 每 10 分钟跟随 GitHub SHA，`main` 一合并， mainland 镜像 10 分钟内跟进，无需改造。
- **质量门禁已就位**：`validate-data.mjs` 的 schema/去重/链接校验 + PR 强制 `npm test`，任何自动产出的数据都必须过这道门。

## 目标

把「发现 → 起草 → 审校 → 发布」中的**发现与起草**自动化，**审校保留人工**。这与 `EDITORIAL_POLICY.md` 的定位一致：本站是 curate 出的研究索引，`why` / `changed` 是编辑判断，不应由爬虫直接定稿。

```
来源订阅 → 定时抓取 → 去重/打分 → LLM 结构化起草 → 自动开 Draft PR → 人工审校合并 → 现有 CI/部署/镜像
```

## 组件设计

### 1. 来源清单 `scripts/watchlist.json`（新增，人工维护）

```jsonc
{
  "feeds": [
    { "id": "arxiv-cs-ai-worldmodel", "type": "arxiv-query",
      "query": "cat:cs.LG AND (\"world model\" OR \"world models\")",
      "lane": "tech", "topics": ["world-model"], "weight": 0.9 },
    { "id": "huggingface-daily-papers", "type": "http-json",
      "url": "https://huggingface.co/api/daily_papers", "lane": "tech" },
    { "id": "openai-blog", "type": "rss", "url": "https://openai.com/news/rss.xml", "lane": "event" },
    { "id": "deepmind-blog", "type": "rss", "url": "…", "lane": "event" },
    { "id": "qwen-github-releases", "type": "github-releases", "repo": "QwenLM/Qwen", "lane": "tech" }
    // 实验室/机构官方博客 RSS 为主，科技媒体 RSS 为辅（weight 更低）
  ],
  "limitPerRun": 10
}
```

设计要点：清单本身就是编辑判断的机器可读版本，与 `EDITORIAL_POLICY.md` 的「What belongs / What usually does not belong」一一对应——每条 feed 声明 `lane`、可选 `topics` 与 `weight`，媒体类来源权重低于一手来源（来源层级：论文/官方发布 > 工程文章 > 报道）。

### 2. 抓取器 `scripts/collect-sources.mjs`（新增）

- Node 18+ 原生 `fetch`，不引入第三方依赖（与现有脚本风格一致）；RSS/Atom 用 ~100 行的轻量解析器。
- 输出原始候选 `data/inbox/candidates-<YYYY-MM-DD>.json`：`{ id, feedId, title, url, publishedAt, summary, fetchedAt }`。
- 每条 feed 记录 `lastFetched` / `seenUrls` 游标，持久化在 `data/inbox/state.json`，避免重复抓。
- 抓取失败单源隔离，不影响其他源；全部失败则以非零码退出让 CI 报红。

### 3. 去重与打分 `scripts/dedupe-candidates.mjs`（新增）

- 与 `data/timeline.json` 中所有既有条目的 `sources[].url`、标题、`orgs` + 日期做匹配，已收录的直接丢弃。
- 与 `data/inbox/rejected.json`（历史被人工否决的候选及其原因）匹配，避免反复打扰。
- 启发式打分：来源权重 × 关键词命中（如 world model 相关词表）× 机构知名度表，排序后截取 `limitPerRun`。

### 4. LLM 起草 `scripts/draft-candidates.mjs`（新增）

- 调 OpenAI 兼容 API（key 存 GitHub Secrets 的 `LLM_API_KEY`）。
- 输入：候选的标题/摘要/原文链接 + schema 说明 + `EDITORIAL_POLICY.md` 全文 + 3 个已收录条目作为 few-shot。
- 输出：符合 schema 的**草稿**条目数组（`id`、`period`、`date`、`lane`、`importance: "watching"`、`title`、`short`、`what`、`why`、`changed`、`concepts`、`orgs`、`sources`），写入 `data/inbox/draft-events-<run>.json`。
- 硬约束：`importance` 一律 `watching`；`sources` 只允许填抓取到的真实 URL，禁止模型编造链接；JSON 解析失败或 schema 不合即整批丢弃。
- 本步骤**不改 `data/timeline.json`**。

### 5. 定时工作流 `.github/workflows/update-watch.yml`（已实现）

```yaml
on:
  schedule:
    - cron: "0 2 * * *"     # 每日 02:00 UTC
  workflow_dispatch:
jobs:
  collect:
    steps:
      - uses: actions/cache@v4          # data/inbox 跨运行持久化（抓取游标 seenUrls 等）
      - run: npm run collect             # 抓取 + 去重打分
      - run: npm run dedupe
      - run: node scripts/draft-candidates.mjs --min-new 3 --limit 5
        env: { LLM_API_KEY: secrets.LLM_API_KEY }   # 候选不足 min-new 时静默跳过
      - run: node scripts/build-candidate-branch.mjs  # 合并草稿 + 重新生成数据 + PR 说明
      - uses: peter-evans/create-pull-request@v7
        with: { draft: true, branch: "auto/candidates-<日期>" }
```

- Draft PR 的 body 由 `build-candidate-branch.mjs` 自动生成：审校清单 + 每个候选一段（来源链接、LLM 起草的四个字段）。
- PR 一开出就自动触发现有 `validate.yml`，`npm test` 兜底。
- 维护者审校：核对来源真实性、修正 `why/changed` 措辞、调整 `importance`，然后 merge。合并后 `pages.yml` 自动部署、镜像自动跟进——**链路后半段零新增工作**。

## 护栏

| 风险 | 防线 |
| --- | --- |
| LLM 编造事实/来源 | 只允许引用抓取到的 URL；schema 校验 + 人工审校；`why/changed` 视为初稿 |
| 重复/低质候选刷屏 | `seenUrls` + `rejected.json` 去重；`limitPerRun` 上限；打分截断 |
| 自动写入破坏主分支 | 一切产出只进 Draft PR，主分支永远由人工 merge |
| Secret 泄漏 | `LLM_API_KEY` 只存在于 GitHub Secrets，抓取器本身无需任何 key |
| 上游改版导致解析失败 | 单源失败隔离 + artifact 留档 + CI 报红可观测 |

## 分阶段落地

- **M1（已实现）**：`watchlist.json` + `collect-sources.mjs` + `dedupe-candidates.mjs`。本地 `npm run collect && npm run dedupe` 即可验证（首次实测：7 个源、2218 条候选、自动去重 15 条既有来源）。
- **M2（已实现）**：`draft-candidates.mjs`（LLM 起草 + 严格校验）+ `build-candidate-branch.mjs` + `.github/workflows/update-watch.yml`（每日 02:00 UTC 定时，候选充足时自动开 Draft PR）。仓库需配置 Secret `LLM_API_KEY`；可选 Variables `LLM_BASE_URL`、`LLM_MODEL`（默认阿里云编码套餐网关 + `glm-5`）。
- **M3（可选，未实现）**：对连续高采纳率的白名单 feed（如 arXiv 高分论文）放宽——自动 merge 到 `importance: "watching"`，半年评审时统一复核。默认不开启，保持人工门禁。

### 本地运行

```bash
npm run collect           # 抓取全部来源 → data/inbox/candidates-<日期>.json
npm run dedupe            # 去重打分   → data/inbox/shortlist-<日期>.json
LLM_API_KEY=sk-xxx npm run draft -- --limit 5   # LLM 起草 → draft-events-<日期>.json
node scripts/build-candidate-branch.mjs          # 合并草稿 + 生成 PR 说明
```

说明：`data/inbox/` 已加入 `.gitignore`（运行产物不入库）。抓取游标在工作流中通过 Actions cache（`inbox-` 前缀）跨运行持久化；本机运行时若网络需要代理，设置标准 `HTTPS_PROXY` 环境变量并加 `NODE_USE_ENV_PROXY=1`（`npm run collect` / `npm run draft` 已内置该前缀，Node 20 的 CI 会忽略它）。

## 与 AI 对话框（`chat-widget.js`）的关系

自动更新管线保证 `data/timeline.json` 持续生长后，站内 AI 对话框读取的是同一份 `window.AI_WORLDLINE_DATA` 构建产物，**无需任何改动**即可回答最新内容——两条能力共用同一个数据源，互不耦合。
