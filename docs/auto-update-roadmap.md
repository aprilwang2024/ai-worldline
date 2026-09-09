# 自动采集与候选起草

状态：1.3.0 已实现采集、去重、起草和 Draft PR。正式条目的审校与合并保留人工。

## 每日流程

`update-watch.yml` 每日 02:00 UTC（北京时间 10:00）运行，也可手动触发：

1. 按 `scripts/watchlist.json` 抓取 arXiv、RSS/Atom、Hugging Face 与 GitHub releases。
2. 对照正式条目、已见链接和拒绝记录去重，再按相关性排序。
3. 配置 `LLM_API_KEY` 后调用模型起草，定时运行至少 3 个新候选才起草，每次最多 5 条。
4. 校验草稿、构建候选文件并运行 `npm test`；有数据变化才开 Draft PR。
5. 维护者核对原始来源、修改解释并合并；GitHub Pages 发布，国内镜像每 10 分钟轮询主分支。

没有模型密钥时，采集与去重照常运行，候选作为 Actions artifact 保留 7 天，起草步骤跳过。它不会自动修改主分支或自动合并。

## 仓库配置

- Secret `LLM_API_KEY`：独立的服务端模型密钥。访客浏览器里的密钥不会用于此流程。
- Variable `LLM_BASE_URL`：可选，默认 `https://coding.dashscope.aliyuncs.com/v1`。
- Variable `LLM_MODEL`：可选，默认 `glm-5`；需与该密钥的模型权限匹配。
- GitHub Settings → Actions → General：创建候选 PR 需要允许 GitHub Actions 创建 pull requests。工作流只在采集 job 内请求 `contents: write`、`pull-requests: write`。

使用 `GITHUB_TOKEN` 创建的 Draft PR 不会自动触发另一条 PR 工作流。候选工作流本身先运行测试；维护者审校后将 PR 标为 Ready for review，会触发 `validate.yml` 再检查。

## 本地运行

```bash
npm run collect
npm run dedupe
# 先通过环境变量配置 LLM_API_KEY；不要把密钥提交进仓库。
npm run draft
node scripts/build-candidate-branch.mjs
npm test
```

中间文件在被 Git 忽略的 `data/inbox/`。默认只消费当天文件；无新候选、候选不足或起草失败都会清空当天草稿，避免缓存中的旧草稿被再次提交。

## 数据与审校边界

- 草稿固定 `status: watching`、`importance: normal`；日期必须真实有效，所属半年与日期一致。
- 标签和来源类型必须使用既有枚举；`sources[].url` 与可选的 `fullText` 只能逐字引用本次候选提供的 URL。
- 模型输入包含 `EDITORIAL_POLICY.md`，抓取内容被视为待核对资料。
- URL 白名单和结构校验不证明事实正确。维护者仍需打开原始来源，核对时间、摘要、重要性以及 `why` / `changed` 的判断。
- 某个来源失败不会阻断其他来源；全部来源失败会让运行报错。来源变更需维护 watchlist 和解析器。

更复杂的候选管理界面与采纳率分析暂未实现，待实际使用后再决定。
