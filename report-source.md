# 世界模型专题扩展：研究底稿

更新日期：2026-09-02
用途：`timeline-data.js` 世界模型切面的事实与取舍依据。这里是内部主张—来源账本；用户实际阅读入口仍是时间线与文献库。

## 范围与口径

本轮覆盖 2017—2026 的现代世界模型主线，重点回答三件事：模型怎样形成对环境的内部表征，怎样预测行动后果并用于规划，以及这条研究路线怎样演化为可交互世界、自动驾驶仿真、机器人数据引擎与空间智能产品。

纳入条目至少满足一项：

- 显式学习环境动力学或未来状态；
- 能以动作作为条件，预测动作的后果；
- 学得的模型被用于搜索、规划、策略训练或策略评估；
- 生成具有持续性、空间一致性或实时交互能力的环境。

普通视频生成、只强调“世界知识”的多模态模型、以及没有预测/仿真成分的 VLA 不因为营销措辞而被归为世界模型。Sora 是边界案例，但 OpenAI 的原始发布明确以“world simulators”为研究框架，因此保留，并在文字中避免把视觉逼真等同于可靠物理模拟。

## 直接结论

世界模型不是一条从“视频生成”突然出现的新线，而是至少六条路线在 2024 年后汇合：

1. **潜在动力学与模型式强化学习**：World Models → PlaNet → Dreamer → MuZero → DreamerV2 → EfficientZero → DreamerV3 → TD-MPC2。
2. **预测表征**：JEPA 路线图 → I-JEPA → V-JEPA → V-JEPA 2，把“预测像素”改写为“预测抽象表征”，再连接真实机器人规划。
3. **可交互生成**：Genie、GameNGen、Oasis、Matrix-Game，把离线视频推进到动作可控、实时、长时一致的生成环境。
4. **具身与机器人**：UniSim、Cosmos、DreamGen，让世界模型从演示器变成训练数据、策略评估和规划基础设施。
5. **自动驾驶**：GAIA 系列把视频世界模型从场景生成推进到多视角、反事实测试与闭环安全评估。
6. **3D/空间智能**：World Labs、HunyuanWorld、Marble、HY-World、Atlas，把可浏览 3D 世界、重建与 real-to-sim 连接起来。

真正的产业拐点不是“生成的视频更像真的”，而是三个门槛同时下降：环境制作成本、真实世界试错成本，以及在长尾危险场景上反复评测的成本。

## 覆盖矩阵

| 支线 | 早期锚点 | 扩展节点 | 产品/机构转折 | 当前覆盖状态 |
| --- | --- | --- | --- | --- |
| 模型式 RL | World Models、PlaNet、Dreamer、MuZero | DreamerV2、EfficientZero、DreamerV3、TD-MPC2 | — | 已覆盖主干 |
| 预测表征 | JEPA 路线图 | I-JEPA、V-JEPA、V-JEPA 2 | Meta FAIR 开源 | 已覆盖主干 |
| 可交互生成 | Genie | GameNGen、Matrix-Game | Oasis、Genie 2/3 | 已覆盖代表节点 |
| 机器人/Physical AI | UniSim | DreamGen | NVIDIA Cosmos、Cosmos 3 | 已覆盖研究到平台 |
| 自动驾驶 | GAIA-1 | GAIA-2/3 作为中间演进背景 | GAIA-4 闭环评估 | 已覆盖首个与最新拐点 |
| 3D/空间智能 | World Labs 3D 预览 | HunyuanWorld、HY-World | Marble、Atlas | 已覆盖中美代表路线 |
| 评测标准 | V-JEPA 2 benchmarks、DreamGen Bench | GameWorld Score、Cosmos HUE | 尚无统一行业基准 | 作为相关节点来源，不单独占时间线 |

## 取舍与局限

- “世界模型”仍没有单一行业定义。潜在状态预测、像素级视频生成、显式 3D 重建与世界—动作统一模型解决的问题不同，本时间线用共同能力而不是单一架构归类。
- 视觉一致性不自动等于因果正确或物理可靠。对 Sora、Oasis、Genie、Matrix-Game、Marble 等条目的表述只采用发布方已经展示或论文已经评估的能力。
- 商业发布的数据规模、领先性与“first”声明多为发布方口径；时间线把这些作为机构事件记录，不把它们提升为独立验证后的科学结论。
- GAIA-2、GAIA-3、V-JEPA 2.1、Cosmos Predict 2.5、HunyuanWorld 1.5、Matrix-Game 3.0 等有价值的中间版本没有全部拆成独立卡片，以避免版本号淹没真正的范式变化；它们被后继条目的来源与解释吸收。
- 2026 H2 尚在进行，Atlas、GAIA-4 与 Matrix-Game 3.5 属于“当前进展”，后续应根据公开论文、复现与实际采用情况重估。

## 主张—来源账本

| 节点 | 核心主张 | 一手来源 |
| --- | --- | --- |
| PlaNet | 从像素学习潜在动力学并在线规划 | [论文](https://arxiv.org/abs/1811.04551) · [全文](https://arxiv.org/pdf/1811.04551) |
| MuZero | 不知道规则也能学习与规划相关的价值、策略与奖励 | [论文](https://arxiv.org/abs/1911.08265) · [DeepMind](https://deepmind.google/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules/) |
| DreamerV2 | 在离散潜在世界中学习行为，Atari 55 项达到人类水平 | [论文](https://arxiv.org/abs/2010.02193) · [全文](https://arxiv.org/pdf/2010.02193) |
| EfficientZero | 以约两小时 Atari 交互数据取得总体超人表现 | [论文](https://arxiv.org/abs/2111.00210) · [代码](https://github.com/YeWR/EfficientZero) |
| JEPA 路线图 | 可配置世界模型、分层 JEPA 与规划组成 AMI 架构 | [OpenReview 全文](https://openreview.net/pdf?id=BZ5a1r-kVsf) |
| IRIS | 离散自编码器与自回归 Transformer 组成样本高效世界模型 | [论文](https://arxiv.org/abs/2209.00588) · [代码](https://github.com/eloialonso/iris) |
| I-JEPA | 在抽象表示而非像素空间预测缺失区域 | [论文](https://arxiv.org/abs/2301.08243) · [Meta](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/) |
| GAIA-1 | 视频、文本、动作共同条件化的自动驾驶生成世界模型 | [Wayve](https://wayve.ai/thinking/introducing-gaia1/) · [论文](https://arxiv.org/abs/2309.17080) |
| UniSim | 学习动作条件的真实世界模拟器，并把仿真策略零样本部署真机 | [项目](https://universal-simulator.github.io/) · [论文](https://arxiv.org/abs/2310.06114) |
| TD-MPC2 | 在隐式潜在世界模型里做局部轨迹优化，并扩展到 104 项任务 | [论文](https://arxiv.org/abs/2310.16828) · [项目](https://www.tdmpc2.com/) |
| V-JEPA | 从视频抽象特征做自监督预测，不依赖像素重建 | [Meta](https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture/) · [论文](https://arxiv.org/abs/2404.08471) |
| GameNGen | 扩散模型在单 TPU 上以 20+ FPS 模拟 DOOM | [项目](https://gamengen.github.io/) · [论文](https://arxiv.org/abs/2408.14837) |
| Oasis | Transformer 逐帧生成、键鼠实时控制的开放世界演示 | [Decart](https://decart.ai/publications/oasis-interactive-ai-video-game-model) · [体验](https://oasis.decart.ai/introduction) |
| World Labs 3D 预览 | 从单张图生成可在浏览器探索的持久 3D 世界 | [World Labs](https://www.worldlabs.ai/blog/generating-worlds) |
| NVIDIA Cosmos | 开放世界基础模型、视频处理与后训练平台进入 Physical AI | [NVIDIA 发布](https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development) · [论文](https://arxiv.org/abs/2501.03575) |
| Muse / WHAM | 同时生成游戏画面、玩家动作或二者，并支持持久编辑 | [Microsoft Research](https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/) · [Nature](https://www.nature.com/articles/s41586-025-08600-3) |
| DreamGen | 视频世界模型生成带伪动作的机器人轨迹，扩展策略训练数据 | [NVIDIA Research](https://research.nvidia.com/labs/gear/dreamgen/) · [论文](https://arxiv.org/abs/2505.12705) |
| V-JEPA 2 | 百万小时视频预训练后，用少量机器人视频实现零样本规划 | [Meta](https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/) · [论文](https://arxiv.org/abs/2506.09985) |
| HunyuanWorld 1.0 | 开放、可探索并支持模拟用途的 3D 世界生成 | [代码](https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0) · [报告](https://3d-models.hunyuan.tencent.com/world/HY_World_1_technical_report.pdf) |
| Matrix-Game 2.0 | 开源、25 FPS、流式的动作条件互动世界模型 | [代码](https://github.com/SkyworkAI/Matrix-Game) · [论文](https://arxiv.org/abs/2508.13009) |
| Marble | 多模态输入生成、编辑、扩展和导出 3D 世界，面向公众可用 | [World Labs](https://www.worldlabs.ai/blog/marble-world-model) |
| HY-World 2.0 | 开源 3D 世界模型同时推进世界生成与通用 3D 重建 | [代码](https://github.com/Tencent-Hunyuan/HY-World-2.0) · [报告](https://3d-models.hunyuan.tencent.com/world/world2_0/HY_World_2_0.pdf) |
| Cosmos 3 | 单一 Mixture-of-Transformers 统一理解、生成、仿真与动作 | [NVIDIA 发布](https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai) · [论文](https://arxiv.org/abs/2606.02800) |
| GAIA-4 | 把自动驾驶策略放回世界模型闭环中做可量化安全评估 | [Wayve](https://wayve.ai/thinking/gaia-4/) |
| Matrix-Game 3.5 | 几何感知记忆与静动态解耦提升长时一致和实时控制 | [论文](https://arxiv.org/abs/2608.29910) · [代码](https://github.com/SkyworkAI/Matrix-Game) |
| Atlas | 文本、图像、视频、3D 统一输入，覆盖生成、重建与 real-to-sim | [World Labs](https://www.worldlabs.ai/blog/atlas) |

## 后续更新建议

每半年复查四类信号：是否从开放环视频走向闭环交互、是否能定量预测策略排序、是否真正降低真实数据/真机试错成本、是否形成可被第三方调用或复现的平台。若只有画质提升而没有状态持续、动作控制、空间结构或评测价值，不宜单独占据时间线节点。
