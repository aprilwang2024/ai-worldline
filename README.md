<div align="center">
  <h1>AI 世界线 · AI Worldline</h1>
  <p>
    <strong>基础模型 · 智能体 · 世界模型</strong><br />
    A source-first timeline of foundation models, agents, and world models.
  </p>
  <p>
    <a href="https://aprilwang2024.github.io/ai-worldline/"><strong>在线体验 · Live site</strong></a>
    · <a href="./README.zh-CN.md">中文完整版</a>
    · <a href="./README.en.md">English README</a>
    · <a href="../../issues/new?template=add-event.yml">贡献事件 · Suggest an entry</a>
  </p>
</div>

![AI 世界线动态演示 / AI Worldline demo](./assets/ai-worldline-demo.gif)

<p align="center"><sub>完整时间线 · 世界模型切面 · 条目详情 · 文献库</sub></p>

## 中文

AI 世界线是一张按半年整理的基础模型时代演进图谱。它把经常混在一起的两类变化分开，并让每个判断回到论文、代码或机构官方发布：

- **事件**：公司、机构、产品发布与改变市场方向的时刻；
- **技术**：论文、架构、研究路线与开源社区带来的能力跃迁；
- **世界模型切面**：在完整历史、世界模型和非世界模型之间切换；
- **文献库**：集中浏览所有条目的原始来源和全文链接。

当前档案覆盖 **2017—2026**，包含 **93 个条目**和 **132 份去重来源**。世界模型切面有 **34 个条目**，覆盖模型式强化学习、预测表征、可交互生成、具身智能、自动驾驶与空间智能。

[阅读中文完整介绍、编辑原则与贡献方法 →](./README.zh-CN.md)

## English

AI Worldline is an interactive, half-year-by-half-year map of foundation models, agents, and world models. It separates market-moving **events** from capability-changing **technology**, with a focused world-model slice and a source library.

Every entry explains what happened, why it mattered, what it changed, and links back to papers, code, technical reports, or official announcements. The current archive covers **2017–2026**, with **93 entries** and **132 unique sources**.

[Read the full English introduction, editorial policy, and contribution guide →](./README.en.md)

## 参与共建 · Contributing

权威数据源是 [`data/timeline.json`](./data/timeline.json)。每个 Pull Request 都会检查重复 ID、错误分类、日期、解释字段、链接和来源。The canonical archive lives in [`data/timeline.json`](./data/timeline.json), and every pull request is validated automatically.

```bash
npm run validate
npm run build:data
npm test
```

项目采用 [MIT License](./LICENSE)；时间线数据与编辑内容采用 [CC BY 4.0](./LICENSE-CONTENT.md)。Code is MIT licensed; timeline data and editorial content are available under CC BY 4.0.
