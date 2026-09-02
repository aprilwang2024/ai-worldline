/*
 * GENERATED FILE — do not edit directly.
 * Edit data/timeline.json, then run: npm run build:data
 */

window.AI_WORLDLINE_DATA = {
  "$schema": "./schema.json",
  "meta": {
    "title": "AI 世界线",
    "version": "1.0.0",
    "updatedAt": "2026-09-02",
    "currentPeriod": "2026-H2",
    "scope": "A curated, source-first timeline of the modern foundation-model, agent, and world-model era."
  },
  "lanes": {
    "event": {
      "label": "事件",
      "caption": "商业、公司与机构的重要进展",
      "color": "#0b0f18",
      "soft": "#eef1f5"
    },
    "tech": {
      "label": "技术",
      "caption": "研究、架构与开源突破",
      "color": "#0f5eea",
      "soft": "#e9f0ff"
    }
  },
  "topics": {
    "world-model": {
      "label": "世界模型",
      "caption": "理解、预测、规划与生成可交互世界",
      "color": "#087e87",
      "soft": "#e7f5f4"
    },
    "moe": {
      "label": "MoE",
      "caption": "稀疏激活与专家路由",
      "color": "#6657c8",
      "soft": "#f0edff"
    }
  },
  "periods": [
    {
      "id": "2017-H1",
      "label": "2017 H1"
    },
    {
      "id": "2017-H2",
      "label": "2017 H2"
    },
    {
      "id": "2018-H1",
      "label": "2018 H1"
    },
    {
      "id": "2018-H2",
      "label": "2018 H2"
    },
    {
      "id": "2019-H1",
      "label": "2019 H1"
    },
    {
      "id": "2019-H2",
      "label": "2019 H2"
    },
    {
      "id": "2020-H1",
      "label": "2020 H1"
    },
    {
      "id": "2020-H2",
      "label": "2020 H2"
    },
    {
      "id": "2021-H1",
      "label": "2021 H1"
    },
    {
      "id": "2021-H2",
      "label": "2021 H2"
    },
    {
      "id": "2022-H1",
      "label": "2022 H1"
    },
    {
      "id": "2022-H2",
      "label": "2022 H2"
    },
    {
      "id": "2023-H1",
      "label": "2023 H1"
    },
    {
      "id": "2023-H2",
      "label": "2023 H2"
    },
    {
      "id": "2024-H1",
      "label": "2024 H1"
    },
    {
      "id": "2024-H2",
      "label": "2024 H2"
    },
    {
      "id": "2025-H1",
      "label": "2025 H1"
    },
    {
      "id": "2025-H2",
      "label": "2025 H2"
    },
    {
      "id": "2026-H1",
      "label": "2026 H1"
    },
    {
      "id": "2026-H2",
      "label": "2026 H2",
      "status": "current"
    }
  ],
  "events": [
    {
      "id": "attention-is-all-you-need",
      "period": "2017-H1",
      "date": "2017-06-12",
      "lane": "tech",
      "importance": "major",
      "title": "Attention Is All You Need",
      "short": "Transformer 架构出现",
      "what": "Google 研究团队提出完全基于注意力机制的 Transformer，摆脱循环神经网络对序列计算的依赖。",
      "why": "它让大规模并行训练语言模型变得更可行，并成为此后 GPT、BERT 与现代多模态模型的共同底座。",
      "changed": "AI 的核心竞争开始从手工任务架构转向通用架构、数据与算力的规模化组合。",
      "concepts": [
        "Transformer",
        "Self-Attention",
        "Pretraining"
      ],
      "orgs": [
        "Google Brain",
        "Google Research"
      ],
      "sources": [
        {
          "title": "Attention Is All You Need",
          "publisher": "Vaswani et al. · arXiv",
          "date": "2017-06-12",
          "type": "paper",
          "url": "https://arxiv.org/abs/1706.03762",
          "fullText": "https://arxiv.org/pdf/1706.03762"
        }
      ]
    },
    {
      "id": "software-2",
      "period": "2017-H2",
      "date": "2017-11-11",
      "lane": "tech",
      "title": "Software 2.0",
      "short": "程序开始由数据训练出来",
      "what": "Andrej Karpathy 用 Software 2.0 描述一种新软件：行为不再主要由人逐行编写，而由数据和优化过程训练得到。",
      "why": "它为后来“模型即软件”“自然语言编程”和 Agent 工作流提供了一条非常早的解释线索。",
      "changed": "开发者开始把模型、数据集和训练过程视为新的软件工程材料。",
      "concepts": [
        "Software 2.0",
        "Learned Programs"
      ],
      "orgs": [
        "Andrej Karpathy"
      ],
      "sources": [
        {
          "title": "Software 2.0",
          "publisher": "Andrej Karpathy",
          "date": "2017-11-11",
          "type": "essay",
          "url": "https://karpathy.medium.com/software-2-0-a64152b37c35"
        }
      ]
    },
    {
      "id": "sparsely-gated-moe",
      "period": "2017-H1",
      "date": "2017-01-23",
      "lane": "tech",
      "topic": "moe",
      "importance": "major",
      "title": "稀疏门控 MoE",
      "short": "只激活部分专家，容量不再等于计算量",
      "what": "Google 研究团队提出 Sparsely-Gated Mixture-of-Experts 层，用可训练门控网络为每个输入选择少量前馈专家。",
      "why": "它让模型能够拥有极大的总参数容量，却不必让每个 token 都经过全部参数。",
      "changed": "条件计算从理论路线变成可在大规模语言和翻译任务上训练的架构组件，并在多年后成为前沿模型的主流选择。",
      "concepts": [
        "Mixture of Experts",
        "Sparse Activation",
        "Conditional Computation",
        "Routing"
      ],
      "orgs": [
        "Google Brain"
      ],
      "sources": [
        {
          "title": "Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer",
          "publisher": "Shazeer et al. · ICLR",
          "date": "2017-01-23",
          "type": "paper",
          "url": "https://research.google/pubs/outrageously-large-neural-networks-the-sparsely-gated-mixture-of-experts-layer/",
          "fullText": "https://arxiv.org/pdf/1701.06538"
        }
      ]
    },
    {
      "id": "alphago-zero",
      "period": "2017-H2",
      "date": "2017-10-19",
      "lane": "tech",
      "title": "AlphaGo Zero",
      "short": "从自我对弈中学习",
      "what": "AlphaGo Zero 不依赖人类棋谱，从规则和自我对弈出发学习围棋。",
      "why": "它让强化学习、自博弈与搜索成为通往超人能力的另一条重要技术路线。",
      "changed": "产业看见了训练系统可以超越人类示范数据，而不仅是模仿它。",
      "concepts": [
        "Reinforcement Learning",
        "Self-play",
        "Search"
      ],
      "orgs": [
        "Google DeepMind"
      ],
      "sources": [
        {
          "title": "Mastering the game of Go without human knowledge",
          "publisher": "Nature · Silver et al.",
          "date": "2017-10-19",
          "type": "paper",
          "url": "https://doi.org/10.1038/nature24270"
        }
      ]
    },
    {
      "id": "gpt-1",
      "period": "2018-H1",
      "date": "2018-06-11",
      "lane": "tech",
      "importance": "major",
      "title": "GPT-1",
      "short": "生成式预训练 + 任务微调",
      "what": "OpenAI 展示了先在海量无标注文本上做生成式预训练，再用少量有监督数据适配任务的路径。",
      "why": "它把 Transformer 从翻译架构推进为通用语言理解方法。",
      "changed": "预训练模型开始取代为每个 NLP 任务单独设计架构的方式。",
      "concepts": [
        "Generative Pretraining",
        "Fine-tuning"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Improving Language Understanding by Generative Pre-Training",
          "publisher": "OpenAI",
          "date": "2018-06",
          "type": "paper",
          "url": "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf",
          "fullText": "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf"
        }
      ]
    },
    {
      "id": "bert",
      "period": "2018-H2",
      "date": "2018-10-11",
      "lane": "tech",
      "importance": "major",
      "title": "BERT",
      "short": "双向语言表示成为基础设施",
      "what": "Google 提出 BERT，通过双向上下文预训练，在多项自然语言理解任务上刷新结果。",
      "why": "它快速进入搜索、问答、分类等真实产品，并证明“预训练 + 轻量适配”具有普适性。",
      "changed": "NLP 进入预训练模型时代，模型权重开始成为可复用基础设施。",
      "concepts": [
        "Bidirectional Transformer",
        "Masked Language Modeling"
      ],
      "orgs": [
        "Google AI Language"
      ],
      "sources": [
        {
          "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
          "publisher": "Devlin et al. · arXiv",
          "date": "2018-10-11",
          "type": "paper",
          "url": "https://arxiv.org/abs/1810.04805",
          "fullText": "https://arxiv.org/pdf/1810.04805"
        }
      ]
    },
    {
      "id": "world-models",
      "period": "2018-H1",
      "date": "2018-03-27",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "World Models",
      "short": "Agent 开始在自己学到的世界里想象未来",
      "what": "David Ha 与 Jürgen Schmidhuber 用视觉编码器、记忆模型和控制器学习环境的压缩时空表示，并让策略在模型生成的“梦境”中训练。",
      "why": "它给出世界模型的一条清晰定义：不只识别观察结果，还要预测环境如何演化以及行动会带来什么后果。",
      "changed": "学习环境动力学、在潜在空间中规划与训练策略，成为模型式强化学习和具身智能的重要路线。",
      "concepts": [
        "World Model",
        "Latent Dynamics",
        "Model-based RL",
        "Imagination"
      ],
      "orgs": [
        "Google Brain Tokyo",
        "NNAISENSE",
        "IDSIA"
      ],
      "sources": [
        {
          "title": "World Models",
          "publisher": "David Ha & Jürgen Schmidhuber",
          "date": "2018-03-27",
          "type": "paper",
          "url": "https://worldmodels.github.io/",
          "fullText": "https://arxiv.org/pdf/1803.10122"
        }
      ]
    },
    {
      "id": "gpt-2",
      "period": "2019-H1",
      "date": "2019-02-14",
      "lane": "event",
      "title": "GPT-2 分阶段发布",
      "short": "生成能力第一次引发发布治理争论",
      "what": "OpenAI 发布 GPT-2，并因潜在滥用风险采用分阶段开放策略。",
      "why": "它既展示了连贯长文本生成，也让模型发布、安全和社会影响第一次成为行业公共议题。",
      "changed": "旗舰模型不再只是论文成果，也成为需要治理的公共产品。",
      "concepts": [
        "Zero-shot Transfer",
        "Responsible Release"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Better Language Models and Their Implications",
          "publisher": "OpenAI",
          "date": "2019-02-14",
          "type": "official",
          "url": "https://openai.com/index/better-language-models/"
        }
      ]
    },
    {
      "id": "t5",
      "period": "2019-H2",
      "date": "2019-10-23",
      "lane": "tech",
      "title": "T5 与 Text-to-Text",
      "short": "所有 NLP 任务统一成文本生成",
      "what": "Google 用 Text-to-Text Transfer Transformer 将分类、翻译、问答等任务统一为输入文本到输出文本。",
      "why": "统一接口降低了任务间的结构差异，预示了后来通过自然语言控制通用模型的方式。",
      "changed": "任务开始被描述为文本，而不是固化在专用输出头和程序结构里。",
      "concepts": [
        "Text-to-Text",
        "Transfer Learning"
      ],
      "orgs": [
        "Google Research"
      ],
      "sources": [
        {
          "title": "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer",
          "publisher": "Raffel et al. · arXiv",
          "date": "2019-10-23",
          "type": "paper",
          "url": "https://arxiv.org/abs/1910.10683",
          "fullText": "https://arxiv.org/pdf/1910.10683"
        }
      ]
    },
    {
      "id": "scaling-laws",
      "period": "2020-H1",
      "date": "2020-01-23",
      "lane": "tech",
      "importance": "major",
      "title": "Scaling Laws",
      "short": "算力、数据与参数成为可预测的能力杠杆",
      "what": "OpenAI 团队总结语言模型损失与模型规模、数据量和计算量之间的幂律关系。",
      "why": "它把“做更大的模型”从经验押注变成可以规划资本和基础设施的产业路线。",
      "changed": "前沿 AI 竞争迅速资本密集化，GPU、数据中心和大规模训练成为战略资源。",
      "concepts": [
        "Scaling Laws",
        "Compute"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Scaling Laws for Neural Language Models",
          "publisher": "Kaplan et al. · arXiv",
          "date": "2020-01-23",
          "type": "paper",
          "url": "https://arxiv.org/abs/2001.08361",
          "fullText": "https://arxiv.org/pdf/2001.08361"
        }
      ]
    },
    {
      "id": "dreamer",
      "period": "2019-H2",
      "date": "2019-12-06",
      "lane": "tech",
      "topic": "world-model",
      "title": "Dreamer",
      "short": "在潜在世界中想象并学习行为",
      "what": "Dreamer 通过世界模型想象未来轨迹，并直接沿想象轨迹传播价值梯度来学习策略。",
      "why": "它把“学会一个世界”与“在这个世界里学会行动”连接成高效、可扩展的训练方法。",
      "changed": "世界模型从概念演示走向在视觉控制任务上稳定优于多类无模型强化学习方法。",
      "concepts": [
        "Latent Imagination",
        "Visual Control",
        "Model-based RL"
      ],
      "orgs": [
        "Google Research",
        "DeepMind"
      ],
      "sources": [
        {
          "title": "Dream to Control: Learning Behaviors by Latent Imagination",
          "publisher": "Danijar Hafner et al.",
          "date": "2019-12-06",
          "type": "paper",
          "url": "https://danijar.com/project/dreamer/",
          "fullText": "https://arxiv.org/pdf/1912.01603"
        }
      ]
    },
    {
      "id": "gpt-3",
      "period": "2020-H1",
      "date": "2020-05-28",
      "lane": "event",
      "importance": "major",
      "title": "GPT-3",
      "short": "Few-shot 与 Prompt 成为新交互",
      "what": "1750 亿参数的 GPT-3 展示了只通过文本提示和少量例子完成多类任务的能力。",
      "why": "开发者第一次可以把“任务说明”直接写进上下文，而不必为每项能力重新训练模型。",
      "changed": "Prompt、in-context learning 和通用模型 API 形成新的应用开发范式。",
      "concepts": [
        "Few-shot Learning",
        "In-context Learning",
        "Prompt"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Language Models are Few-Shot Learners",
          "publisher": "Brown et al. · arXiv",
          "date": "2020-05-28",
          "type": "paper",
          "url": "https://arxiv.org/abs/2005.14165",
          "fullText": "https://arxiv.org/pdf/2005.14165"
        }
      ]
    },
    {
      "id": "rag",
      "period": "2020-H1",
      "date": "2020-05-22",
      "lane": "tech",
      "title": "RAG",
      "short": "模型开始连接外部知识",
      "what": "RAG 将参数化语言模型与外部检索索引结合，让生成过程可以引用和更新显式知识。",
      "why": "它缓解了模型知识过时、来源不可追溯和企业私有信息无法进入回答的问题。",
      "changed": "企业 AI 的核心架构逐步从单纯调用模型转为“检索 + 上下文 + 生成”。",
      "concepts": [
        "Retrieval-Augmented Generation",
        "External Memory"
      ],
      "orgs": [
        "Facebook AI Research"
      ],
      "sources": [
        {
          "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
          "publisher": "Lewis et al. · arXiv",
          "date": "2020-05-22",
          "type": "paper",
          "url": "https://arxiv.org/abs/2005.11401",
          "fullText": "https://arxiv.org/pdf/2005.11401"
        }
      ]
    },
    {
      "id": "gpt-3-api-wave",
      "period": "2020-H2",
      "date": "2020-07-01",
      "lane": "event",
      "title": "GPT-3 API 应用潮",
      "short": "模型能力开始通过 API 分发",
      "what": "GPT-3 的早期 API 访问催生了写作、搜索、代码、游戏和生产力工具的大量快速原型。",
      "why": "创业者不再需要训练模型，就可以直接把前沿能力嵌入产品。",
      "changed": "“模型公司 + 应用公司”的产业分层开始成形，同时也催生 AI Wrapper 争论。",
      "concepts": [
        "Model API",
        "AI Application Layer"
      ],
      "orgs": [
        "OpenAI",
        "Early GPT-3 ecosystem"
      ],
      "sources": [
        {
          "title": "OpenAI API",
          "publisher": "OpenAI",
          "date": "2020-06-11",
          "type": "official",
          "url": "https://openai.com/index/openai-api/"
        }
      ]
    },
    {
      "id": "dall-e-clip",
      "period": "2021-H1",
      "date": "2021-01-05",
      "lane": "tech",
      "title": "DALL·E 与 CLIP",
      "short": "语言与视觉开始共享表示空间",
      "what": "OpenAI 同期展示文本生成图像的 DALL·E，以及把图像与自然语言对齐的 CLIP。",
      "why": "多模态不再只是把多个模型拼接，而开始形成跨媒介的通用表示与交互。",
      "changed": "文本提示逐渐成为控制图像与视觉模型的统一入口。",
      "concepts": [
        "Multimodality",
        "Text-to-Image",
        "Contrastive Learning"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "DALL·E: Creating Images from Text",
          "publisher": "OpenAI",
          "date": "2021-01-05",
          "type": "official",
          "url": "https://openai.com/index/dall-e/"
        },
        {
          "title": "CLIP: Connecting text and images",
          "publisher": "OpenAI",
          "date": "2021-01-05",
          "type": "official",
          "url": "https://openai.com/index/clip/"
        }
      ]
    },
    {
      "id": "github-copilot",
      "period": "2021-H1",
      "date": "2021-06-29",
      "lane": "event",
      "importance": "major",
      "title": "GitHub Copilot",
      "short": "AI 进入真实开发工作流",
      "what": "GitHub 发布由 OpenAI Codex 驱动的 Copilot 技术预览，在编辑器中建议整行或整段代码。",
      "why": "这是生成式 AI 第一次以持续、低摩擦的方式进入专业工作现场。",
      "changed": "Copilot 成为比 Chatbot 更早成熟的 AI 产品范式：人保持控制，模型参与生产。",
      "concepts": [
        "Copilot",
        "Human-AI Pairing",
        "Code Generation"
      ],
      "orgs": [
        "GitHub",
        "OpenAI",
        "Microsoft"
      ],
      "sources": [
        {
          "title": "Introducing GitHub Copilot: your AI pair programmer",
          "publisher": "GitHub",
          "date": "2021-06-29",
          "type": "official",
          "url": "https://github.blog/news-insights/product-news/introducing-github-copilot-ai-pair-programmer/"
        }
      ]
    },
    {
      "id": "switch-transformer",
      "period": "2021-H1",
      "date": "2021-01-11",
      "lane": "tech",
      "topic": "moe",
      "importance": "major",
      "title": "Switch Transformer",
      "short": "Top-1 路由把 MoE 推到万亿参数",
      "what": "Google 简化 MoE 路由，让每个 token 只进入一个专家，并解决训练稳定性、通信和低精度训练问题。",
      "why": "Switch Transformer 证明稀疏模型可以在近似固定计算成本下扩展到万亿参数规模。",
      "changed": "MoE 从难以驾驭的研究技巧，变成大模型扩大容量的现实架构路线。",
      "concepts": [
        "Mixture of Experts",
        "Top-1 Routing",
        "Sparse Transformer"
      ],
      "orgs": [
        "Google Research"
      ],
      "sources": [
        {
          "title": "Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity",
          "publisher": "Fedus, Zoph & Shazeer · arXiv",
          "date": "2021-01-11",
          "type": "paper",
          "url": "https://arxiv.org/abs/2101.03961",
          "fullText": "https://arxiv.org/pdf/2101.03961"
        }
      ]
    },
    {
      "id": "foundation-models",
      "period": "2021-H2",
      "date": "2021-08-16",
      "lane": "tech",
      "importance": "major",
      "title": "Foundation Models",
      "short": "基础模型成为统一产业概念",
      "what": "Stanford CRFM 用 Foundation Model 概括在广泛数据上训练、能够适配大量下游任务的模型。",
      "why": "这个词把语言模型、多模态模型、下游适配、风险与治理纳入同一个研究对象。",
      "changed": "行业开始围绕少量基础模型构建庞大的应用、数据和治理生态。",
      "concepts": [
        "Foundation Model",
        "Adaptation",
        "Emergence"
      ],
      "orgs": [
        "Stanford CRFM"
      ],
      "sources": [
        {
          "title": "On the Opportunities and Risks of Foundation Models",
          "publisher": "Stanford CRFM · arXiv",
          "date": "2021-08-16",
          "type": "report",
          "url": "https://arxiv.org/abs/2108.07258",
          "fullText": "https://arxiv.org/pdf/2108.07258"
        }
      ]
    },
    {
      "id": "codex-paper",
      "period": "2021-H2",
      "date": "2021-07-14",
      "lane": "tech",
      "title": "Codex 论文",
      "short": "代码成为大模型的高价值训练域",
      "what": "OpenAI 系统评估 Codex 在 Python 函数生成任务上的表现，并讨论重复采样与通过测试验证代码。",
      "why": "代码既有丰富公开数据，又可以执行和测试，后来成为 Agent 最先取得突破的专业领域。",
      "changed": "代码生成从编辑器补全走向可验证的任务完成。",
      "concepts": [
        "Program Synthesis",
        "Execution Feedback"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Evaluating Large Language Models Trained on Code",
          "publisher": "Chen et al. · arXiv",
          "date": "2021-07-14",
          "type": "paper",
          "url": "https://arxiv.org/abs/2107.03374",
          "fullText": "https://arxiv.org/pdf/2107.03374"
        }
      ]
    },
    {
      "id": "glam",
      "period": "2021-H2",
      "date": "2021-12-08",
      "lane": "tech",
      "topic": "moe",
      "title": "GLaM",
      "short": "1.2T 总参数，每次只激活约 8%",
      "what": "Google 发布 GLaM，以 64 个专家和 top-2 路由构建 1.2T 参数语言模型，每个 token 实际激活约 97B 参数。",
      "why": "它直观展示了 MoE 的核心交换：用稀疏激活获得更大模型容量，同时限制训练和推理计算。",
      "changed": "专家路由、负载均衡和分布式通信成为大模型架构设计的一等问题。",
      "concepts": [
        "Mixture of Experts",
        "Top-2 Routing",
        "Sparse Activation"
      ],
      "orgs": [
        "Google Research"
      ],
      "sources": [
        {
          "title": "GLaM: Efficient Scaling of Language Models with Mixture-of-Experts",
          "publisher": "Du et al. · arXiv",
          "date": "2021-12-08",
          "type": "paper",
          "url": "https://arxiv.org/abs/2112.06905",
          "fullText": "https://arxiv.org/pdf/2112.06905"
        },
        {
          "title": "More Efficient In-Context Learning with GLaM",
          "publisher": "Google Research",
          "date": "2021-12-09",
          "type": "official",
          "url": "https://www.research.google/blog/more-efficient-in-context-learning-with-glam/"
        }
      ]
    },
    {
      "id": "chinchilla",
      "period": "2022-H1",
      "date": "2022-03-29",
      "lane": "tech",
      "title": "Chinchilla Scaling",
      "short": "模型规模之外，数据配比同样关键",
      "what": "DeepMind 研究指出许多大模型训练不足，在固定计算预算下应使用更多数据和更合适的模型规模。",
      "why": "它修正了单纯追求参数量的路线，并影响后续训练配方。",
      "changed": "行业对 Scaling 的理解从“越大越好”走向模型、数据、计算的联合最优。",
      "concepts": [
        "Compute-optimal Training",
        "Scaling"
      ],
      "orgs": [
        "DeepMind"
      ],
      "sources": [
        {
          "title": "Training Compute-Optimal Large Language Models",
          "publisher": "Hoffmann et al. · arXiv",
          "date": "2022-03-29",
          "type": "paper",
          "url": "https://arxiv.org/abs/2203.15556",
          "fullText": "https://arxiv.org/pdf/2203.15556"
        }
      ]
    },
    {
      "id": "instructgpt",
      "period": "2022-H1",
      "date": "2022-03-04",
      "lane": "tech",
      "importance": "major",
      "title": "InstructGPT 与 RLHF",
      "short": "模型从续写文字变成遵循指令",
      "what": "OpenAI 使用示范、偏好排序和人类反馈强化学习，使 GPT-3 更符合用户意图。",
      "why": "模型有能力并不等于好用；指令对齐把原始能力转化为可交互产品。",
      "changed": "对齐、偏好数据和后训练成为旗舰模型竞争的核心组成。",
      "concepts": [
        "RLHF",
        "Instruction Tuning",
        "Alignment"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Training language models to follow instructions with human feedback",
          "publisher": "Ouyang et al. · arXiv",
          "date": "2022-03-04",
          "type": "paper",
          "url": "https://arxiv.org/abs/2203.02155",
          "fullText": "https://arxiv.org/pdf/2203.02155"
        }
      ]
    },
    {
      "id": "dall-e-2",
      "period": "2022-H1",
      "date": "2022-04-06",
      "lane": "event",
      "title": "DALL·E 2",
      "short": "一句话生成高质量图像",
      "what": "DALL·E 2 将自然语言描述转化为更真实、更高分辨率的图像，并支持编辑与变体。",
      "why": "它和随后出现的 Midjourney、Stable Diffusion 共同把生成式 AI 推到大众与创作者面前。",
      "changed": "AIGC 成为新的消费级产品类别，创意行业最先感受到冲击。",
      "concepts": [
        "AIGC",
        "Text-to-Image",
        "Diffusion"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "DALL·E 2",
          "publisher": "OpenAI",
          "date": "2022-04",
          "type": "official",
          "url": "https://openai.com/index/dall-e-2/"
        }
      ]
    },
    {
      "id": "stable-diffusion",
      "period": "2022-H2",
      "date": "2022-08-22",
      "lane": "event",
      "title": "Stable Diffusion 开放发布",
      "short": "生成图像进入开源生态",
      "what": "Stability AI 公开发布 Stable Diffusion，用户可以在消费级硬件和开放工具链中生成图像。",
      "why": "开放权重、社区模型与插件生态大幅降低了生成式图像的试验门槛。",
      "changed": "闭源产品与开放模型两种扩散路线开始长期并行。",
      "concepts": [
        "Open Weights",
        "Diffusion",
        "Creator Ecosystem"
      ],
      "orgs": [
        "Stability AI",
        "CompVis",
        "LAION"
      ],
      "sources": [
        {
          "title": "Stable Diffusion Public Release",
          "publisher": "Stability AI",
          "date": "2022-08",
          "type": "official",
          "url": "https://stability.ai/news-updates/stable-diffusion-public-release"
        }
      ]
    },
    {
      "id": "react",
      "period": "2022-H2",
      "date": "2022-10-06",
      "lane": "tech",
      "importance": "major",
      "title": "ReAct",
      "short": "推理与行动形成循环",
      "what": "ReAct 让语言模型交替生成推理轨迹和环境动作，通过观察结果继续调整计划。",
      "why": "它给出了今天 Agent loop 的清晰原型：思考、行动、观察、再思考。",
      "changed": "模型开始被看作能够与工具和环境交互的行动主体，而不仅是文本生成器。",
      "concepts": [
        "Reasoning + Acting",
        "Agent Loop",
        "Tool Use"
      ],
      "orgs": [
        "Princeton",
        "Google Research"
      ],
      "sources": [
        {
          "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
          "publisher": "Yao et al. · arXiv",
          "date": "2022-10-06",
          "type": "paper",
          "url": "https://arxiv.org/abs/2210.03629",
          "fullText": "https://arxiv.org/pdf/2210.03629"
        }
      ]
    },
    {
      "id": "chatgpt",
      "period": "2022-H2",
      "date": "2022-11-30",
      "lane": "event",
      "importance": "major",
      "title": "ChatGPT",
      "short": "自然语言成为大众计算界面",
      "what": "OpenAI 以研究预览发布 ChatGPT，把指令模型包装成可以追问、纠错和持续对话的产品。",
      "why": "它把大模型从技术圈推向大众，并让几乎所有知识工作者第一次直接体验通用生成能力。",
      "changed": "聊天框成为 AI 的默认入口，模型竞赛迅速变成平台、分发和产品竞赛。",
      "concepts": [
        "Conversational UI",
        "RLHF",
        "General Assistant"
      ],
      "orgs": [
        "OpenAI",
        "Microsoft"
      ],
      "sources": [
        {
          "title": "Introducing ChatGPT",
          "publisher": "OpenAI",
          "date": "2022-11-30",
          "type": "official",
          "url": "https://openai.com/index/chatgpt/"
        }
      ]
    },
    {
      "id": "llama-1",
      "period": "2023-H1",
      "date": "2023-02-24",
      "lane": "tech",
      "title": "LLaMA",
      "short": "高质量开放模型路线加速",
      "what": "Meta 发布 LLaMA 研究模型，展示更小模型在大量高质量数据训练后也能取得强结果。",
      "why": "权重扩散与社区微调迅速催生开放模型生态。",
      "changed": "前沿能力不再完全锁在少数 API 内，开放模型成为另一条产业主线。",
      "concepts": [
        "Open Weights",
        "Data Scaling",
        "Efficient Training"
      ],
      "orgs": [
        "Meta AI"
      ],
      "sources": [
        {
          "title": "LLaMA: Open and Efficient Foundation Language Models",
          "publisher": "Touvron et al. · arXiv",
          "date": "2023-02-27",
          "type": "paper",
          "url": "https://arxiv.org/abs/2302.13971",
          "fullText": "https://arxiv.org/pdf/2302.13971"
        }
      ]
    },
    {
      "id": "dreamerv3",
      "period": "2023-H1",
      "date": "2023-01-10",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "DreamerV3",
      "short": "一套配置跨越 150 多种任务",
      "what": "DreamerV3 用同一套超参数跨越多种控制领域，并通过在世界模型中想象未来来改善行为。",
      "why": "它证明世界模型路线可以从单项技巧发展为具备跨领域稳定性的通用强化学习算法。",
      "changed": "Agent 可以在学习到的潜在环境里进行大量低成本试错，甚至从零在 Minecraft 中收集钻石。",
      "concepts": [
        "World Model",
        "Latent Imagination",
        "General RL"
      ],
      "orgs": [
        "DeepMind",
        "University of Toronto"
      ],
      "sources": [
        {
          "title": "Mastering Diverse Domains through World Models",
          "publisher": "Hafner et al. · arXiv",
          "date": "2023-01-10",
          "type": "paper",
          "url": "https://arxiv.org/abs/2301.04104",
          "fullText": "https://arxiv.org/pdf/2301.04104"
        }
      ]
    },
    {
      "id": "gpt-4-claude",
      "period": "2023-H1",
      "date": "2023-03-14",
      "lane": "event",
      "importance": "major",
      "title": "GPT-4 与 Claude 登场",
      "short": "旗舰模型竞争正式形成",
      "what": "OpenAI 发布多模态 GPT-4；Anthropic 同日公开下一代助手 Claude。",
      "why": "前沿模型从单一领先者进入多家实验室长期竞赛，安全、长上下文和产品体验成为差异化方向。",
      "changed": "模型基准、API 生态、云合作与企业市场被纳入同一场平台竞争。",
      "concepts": [
        "Frontier Models",
        "Multimodality",
        "AI Safety"
      ],
      "orgs": [
        "OpenAI",
        "Anthropic"
      ],
      "sources": [
        {
          "title": "GPT-4",
          "publisher": "OpenAI",
          "date": "2023-03-14",
          "type": "official",
          "url": "https://openai.com/index/gpt-4-research/",
          "fullText": "https://cdn.openai.com/papers/gpt-4.pdf"
        },
        {
          "title": "Introducing Claude",
          "publisher": "Anthropic",
          "date": "2023-03-14",
          "type": "official",
          "url": "https://www.anthropic.com/news/introducing-claude"
        }
      ]
    },
    {
      "id": "autogpt",
      "period": "2023-H1",
      "date": "2023-03-30",
      "lane": "event",
      "title": "AutoGPT 爆火",
      "short": "第一轮大众 Agent 狂热",
      "what": "开源项目 AutoGPT 尝试让 GPT-4 自主拆解目标、使用工具、保存状态并反复执行。",
      "why": "它让“自主 Agent”从论文原型变成任何开发者都能运行的想象，但也暴露循环、漂移和成本失控。",
      "changed": "Agent 成为显性产品方向；可靠性而非 demo 可能性开始成为核心问题。",
      "concepts": [
        "Autonomous Agent",
        "Agent Loop",
        "Memory"
      ],
      "orgs": [
        "Open-source community"
      ],
      "sources": [
        {
          "title": "AutoGPT Repository",
          "publisher": "Significant Gravitas · GitHub",
          "date": "2023-03",
          "type": "code",
          "url": "https://github.com/Significant-Gravitas/AutoGPT"
        }
      ]
    },
    {
      "id": "function-calling",
      "period": "2023-H1",
      "date": "2023-06-13",
      "lane": "tech",
      "title": "Function Calling",
      "short": "模型调用外部系统被产品化",
      "what": "OpenAI 在 API 中提供结构化函数调用，使模型可以选择函数并生成符合参数模式的调用。",
      "why": "它把 Agent 的“行动”从提示词技巧变成稳定平台能力。",
      "changed": "工具定义、结构化输出和外部 API 开始成为 LLM 应用的标准组件。",
      "concepts": [
        "Tool Calling",
        "Structured Output",
        "API Orchestration"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Function calling and other API updates",
          "publisher": "OpenAI",
          "date": "2023-06-13",
          "type": "official",
          "url": "https://openai.com/index/function-calling-and-other-api-updates/"
        }
      ]
    },
    {
      "id": "llama-2",
      "period": "2023-H2",
      "date": "2023-07-18",
      "lane": "event",
      "importance": "major",
      "title": "Llama 2 开放生态",
      "short": "开放权重进入商业应用",
      "what": "Meta 与 Microsoft 发布 Llama 2，面向研究和商业使用提供模型权重与安全材料。",
      "why": "它把开放模型从研究社区推进到云平台、企业部署和大量衍生模型。",
      "changed": "闭源旗舰 API 与可部署开放权重成为两套长期共存的商业生态。",
      "concepts": [
        "Open Model Ecosystem",
        "Fine-tuning"
      ],
      "orgs": [
        "Meta",
        "Microsoft"
      ],
      "sources": [
        {
          "title": "Meta and Microsoft Introduce the Next Generation of Llama",
          "publisher": "Meta AI",
          "date": "2023-07-18",
          "type": "official",
          "url": "https://ai.meta.com/blog/llama-2/"
        },
        {
          "title": "Llama 2: Open Foundation and Fine-Tuned Chat Models",
          "publisher": "Meta AI Research",
          "date": "2023-07-18",
          "type": "paper",
          "url": "https://ai.meta.com/research/publications/llama-2-open-foundation-and-fine-tuned-chat-models/"
        }
      ]
    },
    {
      "id": "llm-app-stack",
      "period": "2023-H2",
      "date": "2023-09-01",
      "lane": "tech",
      "title": "LLM App Stack",
      "short": "RAG、向量库与编排成为创业基础设施",
      "what": "LangChain 等框架把模型、检索、工具、记忆和链式工作流封装为快速开发组件。",
      "why": "应用层开始形成自己的技术栈，而不是只把提示词直接发给模型 API。",
      "changed": "产业热点从训练模型扩展到向量数据库、评测、观测、编排和企业数据接入。",
      "concepts": [
        "RAG Stack",
        "Orchestration",
        "Vector Database"
      ],
      "orgs": [
        "LangChain",
        "LLM infrastructure ecosystem"
      ],
      "sources": [
        {
          "title": "LangChain's Second Birthday",
          "publisher": "LangChain",
          "date": "2024-10-24",
          "type": "retrospective",
          "url": "https://www.langchain.com/blog/langchain-second-birthday"
        }
      ]
    },
    {
      "id": "mixtral",
      "period": "2023-H2",
      "date": "2023-12-11",
      "lane": "tech",
      "topic": "moe",
      "importance": "major",
      "title": "Mixtral 8×7B",
      "short": "开放 MoE 把稀疏架构带进开发者生态",
      "what": "Mistral AI 发布开放权重的 Mixtral 8×7B，每层包含 8 个前馈专家，每个 token 路由到其中 2 个。",
      "why": "开发者第一次能够广泛下载、部署、微调并研究达到强性能的稀疏 MoE 模型。",
      "changed": "MoE 不再只是超大实验室的内部扩展技术，而成为开放模型竞争的核心架构。",
      "concepts": [
        "Sparse MoE",
        "Top-2 Routing",
        "Open Weights"
      ],
      "orgs": [
        "Mistral AI"
      ],
      "sources": [
        {
          "title": "Mixtral of Experts",
          "publisher": "Mistral AI · arXiv",
          "date": "2024-01-08",
          "type": "paper",
          "url": "https://arxiv.org/abs/2401.04088",
          "fullText": "https://arxiv.org/pdf/2401.04088"
        }
      ]
    },
    {
      "id": "custom-gpts",
      "period": "2023-H2",
      "date": "2023-11-06",
      "lane": "event",
      "title": "Custom GPTs 与 Assistants",
      "short": "每个人都能配置一个专用助手",
      "what": "OpenAI DevDay 发布 GPTs、Assistants API 与更多工具能力，让用户通过指令、知识和动作配置专用助手。",
      "why": "它把 Agent 产品从开发者实验推进到面向大众的配置体验。",
      "changed": "“一个通用聊天框”开始分化为大量带知识和工具的专用角色。",
      "concepts": [
        "Custom Assistant",
        "Knowledge + Actions"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "New models and developer products announced at DevDay",
          "publisher": "OpenAI",
          "date": "2023-11-06",
          "type": "official",
          "url": "https://openai.com/index/new-models-and-developer-products-announced-at-devday/"
        }
      ]
    },
    {
      "id": "sora",
      "period": "2024-H1",
      "date": "2024-02-15",
      "lane": "event",
      "topic": "world-model",
      "title": "Sora 预览",
      "short": "视频生成成为下一种模型奇观",
      "what": "OpenAI 展示从文本生成长达一分钟视频的 Sora 研究预览。",
      "why": "它把生成模型的“世界模拟”叙事推到台前，也让视频行业看到新的成本曲线。",
      "changed": "生成式 AI 的热点从文字和图像继续扩展到动态世界与视频工作流。",
      "concepts": [
        "Text-to-Video",
        "World Simulation"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Video generation models as world simulators",
          "publisher": "OpenAI",
          "date": "2024-02-15",
          "type": "official",
          "url": "https://openai.com/index/video-generation-models-as-world-simulators/"
        }
      ]
    },
    {
      "id": "deepseek-moe",
      "period": "2024-H1",
      "date": "2024-01-11",
      "lane": "tech",
      "topic": "moe",
      "importance": "major",
      "title": "DeepSeekMoE",
      "short": "共享专家与细粒度专家分工",
      "what": "DeepSeek 提出更细粒度的专家切分，并隔离始终处理公共知识的共享专家，以提高路由专业化。",
      "why": "它针对传统 MoE 专家知识混杂、冗余的问题，给出了后来 DeepSeek 系列持续采用的架构路径。",
      "changed": "MoE 竞争从“有多少专家”转向专家如何分工、共享知识和保持负载均衡。",
      "concepts": [
        "DeepSeekMoE",
        "Shared Experts",
        "Fine-grained Routing"
      ],
      "orgs": [
        "DeepSeek AI"
      ],
      "sources": [
        {
          "title": "DeepSeekMoE: Towards Ultimate Expert Specialization in Mixture-of-Experts Language Models",
          "publisher": "DeepSeek AI · arXiv",
          "date": "2024-01-11",
          "type": "paper",
          "url": "https://arxiv.org/abs/2401.06066",
          "fullText": "https://arxiv.org/pdf/2401.06066"
        }
      ]
    },
    {
      "id": "genie-1",
      "period": "2024-H1",
      "date": "2024-02-23",
      "lane": "tech",
      "topic": "world-model",
      "title": "Genie",
      "short": "从无动作标注的视频学出可交互世界",
      "what": "Google DeepMind 发布 11B 参数的 Genie，从互联网游戏视频中同时学习视觉表示、环境动力学和潜在动作。",
      "why": "模型无需真实动作标签，也能把文本、图片、照片或草图转化为逐帧可控制的虚拟环境。",
      "changed": "视频生成与 Agent 训练环境开始汇合，世界模型从预测走向可交互生成。",
      "concepts": [
        "Foundation World Model",
        "Latent Action",
        "Interactive Environment"
      ],
      "orgs": [
        "Google DeepMind"
      ],
      "sources": [
        {
          "title": "Genie: Generative Interactive Environments",
          "publisher": "Google DeepMind",
          "date": "2024-02-23",
          "type": "paper",
          "url": "https://deepmind.google/research/publications/60474/",
          "fullText": "https://arxiv.org/pdf/2402.15391"
        }
      ]
    },
    {
      "id": "gpt-4o",
      "period": "2024-H1",
      "date": "2024-05-13",
      "lane": "tech",
      "importance": "major",
      "title": "GPT-4o",
      "short": "原生实时多模态",
      "what": "GPT-4o 以单一模型处理文本、图像与实时音频输入输出，显著降低语音交互延迟。",
      "why": "AI 助手开始从“打字聊天”走向更自然的看、听、说。",
      "changed": "多模态模型从附加能力变成产品界面的基础。",
      "concepts": [
        "Omnimodal",
        "Realtime AI",
        "Voice Interface"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Hello GPT-4o",
          "publisher": "OpenAI",
          "date": "2024-05-13",
          "type": "official",
          "url": "https://openai.com/index/hello-gpt-4o/"
        }
      ]
    },
    {
      "id": "claude-artifacts",
      "period": "2024-H1",
      "date": "2024-06-21",
      "lane": "event",
      "importance": "major",
      "title": "Claude 3.5 与 Artifacts",
      "short": "聊天框变成共同工作的画布",
      "what": "Anthropic 发布 Claude 3.5 Sonnet，并让生成的代码、文档和设计在对话旁独立呈现和迭代。",
      "why": "Artifacts 展示了 AI 产品不必停留在消息流，可以拥有真正的工作对象和编辑空间。",
      "changed": "Canvas、Artifact 和 AI workspace 成为通用助手的新界面范式。",
      "concepts": [
        "AI Workspace",
        "Artifacts",
        "Collaborative Creation"
      ],
      "orgs": [
        "Anthropic"
      ],
      "sources": [
        {
          "title": "Claude 3.5 Sonnet",
          "publisher": "Anthropic",
          "date": "2024-06-21",
          "type": "official",
          "url": "https://www.anthropic.com/news/claude-3-5-sonnet"
        }
      ]
    },
    {
      "id": "cursor-breakout",
      "period": "2024-H2",
      "date": "2024-08-22",
      "lane": "event",
      "importance": "major",
      "title": "Cursor 爆发",
      "short": "AI IDE 成为新专业工作入口",
      "what": "Cursor 把代码库检索、对话、预测编辑和多文件修改深度整合进编辑器，并快速获得专业开发者采用。",
      "why": "它证明现象级 AI 产品未必来自基础模型公司，也可能来自对工作流和界面的重新设计。",
      "changed": "AI Coding 从补全功能升级为独立产品类别，并为后来的 Coding Agent 提供入口。",
      "concepts": [
        "AI IDE",
        "Next Edit Prediction",
        "Codebase Context"
      ],
      "orgs": [
        "Anysphere",
        "Anthropic",
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Series A and Magic",
          "publisher": "Cursor",
          "date": "2024-08-22",
          "type": "official",
          "url": "https://www.cursor.com/blog/series-a"
        },
        {
          "title": "Iterating with Shadow Workspaces",
          "publisher": "Cursor",
          "date": "2024-09-01",
          "type": "engineering",
          "url": "https://www.cursor.com/blog/shadow-workspace"
        }
      ]
    },
    {
      "id": "o1",
      "period": "2024-H2",
      "date": "2024-09-12",
      "lane": "tech",
      "importance": "major",
      "title": "o1 与推理模型",
      "short": "推理时计算成为新 Scaling 轴",
      "what": "OpenAI 发布 o1-preview，让模型在回答前投入更多推理计算，重点提升数学、编程与科学问题。",
      "why": "能力提升不再只来自更大的预训练，也来自模型在推理时搜索、反思和分配计算。",
      "changed": "Reasoning Model、test-time compute 和可调推理预算成为新竞争方向。",
      "concepts": [
        "Reasoning Model",
        "Test-time Compute",
        "Reinforcement Learning"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Learning to reason with LLMs",
          "publisher": "OpenAI",
          "date": "2024-09-12",
          "type": "official",
          "url": "https://openai.com/index/learning-to-reason-with-llms/"
        },
        {
          "title": "OpenAI o1 System Card",
          "publisher": "OpenAI",
          "date": "2024-09-12",
          "type": "report",
          "url": "https://cdn.openai.com/o1-preview-system-card-20240917.pdf",
          "fullText": "https://cdn.openai.com/o1-preview-system-card-20240917.pdf"
        }
      ]
    },
    {
      "id": "mcp",
      "period": "2024-H2",
      "date": "2024-11-25",
      "lane": "tech",
      "importance": "major",
      "title": "MCP 发布",
      "short": "Agent 连接工具与数据的公共协议",
      "what": "Anthropic 发布 Model Context Protocol，以开放协议连接 AI 应用、数据源和外部工具。",
      "why": "它降低了每个模型、工具和数据源之间重复构建定制集成的成本。",
      "changed": "Agent 生态开始形成类似 USB 的连接层，并被多个模型和开发平台采用。",
      "concepts": [
        "Model Context Protocol",
        "Interoperability",
        "Tool Ecosystem"
      ],
      "orgs": [
        "Anthropic",
        "MCP community"
      ],
      "sources": [
        {
          "title": "Introducing the Model Context Protocol",
          "publisher": "Anthropic",
          "date": "2024-11-25",
          "type": "official",
          "url": "https://www.anthropic.com/news/model-context-protocol"
        },
        {
          "title": "Model Context Protocol Specification",
          "publisher": "MCP",
          "date": "Living specification",
          "type": "documentation",
          "url": "https://modelcontextprotocol.io/"
        }
      ]
    },
    {
      "id": "building-effective-agents",
      "period": "2024-H2",
      "date": "2024-12-19",
      "lane": "tech",
      "title": "Building Effective Agents",
      "short": "Workflow 与 Agent 被清晰区分",
      "what": "Anthropic 总结生产中的 Agent 模式，区分预定义代码路径的 workflow 与由模型动态决定过程的 agent。",
      "why": "它给 Agent 热潮降温：复杂框架并非默认答案，简单、可组合、可评测的模式往往更有效。",
      "changed": "Agent 工程开始从炫技 demo 转向路由、并行、编排、评估和成本权衡。",
      "concepts": [
        "Agentic Workflows",
        "Orchestrator-Workers",
        "Evaluator-Optimizer"
      ],
      "orgs": [
        "Anthropic"
      ],
      "sources": [
        {
          "title": "Building effective agents",
          "publisher": "Anthropic Engineering",
          "date": "2024-12-19",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/building-effective-agents"
        }
      ]
    },
    {
      "id": "genie-2",
      "period": "2024-H2",
      "date": "2024-12-04",
      "lane": "event",
      "topic": "world-model",
      "title": "Genie 2",
      "short": "一张图生成可玩的 3D 训练环境",
      "what": "Google DeepMind 展示可从单张提示图生成动作可控、可由人或 Agent 操作的 3D 环境。",
      "why": "它把世界模型定位成具身 Agent 的环境生成器：模型不仅生成画面，还持续响应键鼠动作并预测下一状态。",
      "changed": "训练和评测通用 Agent 所需的环境，可以从昂贵的人工制作转向模型按需生成。",
      "concepts": [
        "Foundation World Model",
        "Embodied Agent",
        "Interactive 3D"
      ],
      "orgs": [
        "Google DeepMind"
      ],
      "sources": [
        {
          "title": "Genie 2: A large-scale foundation world model",
          "publisher": "Google DeepMind",
          "date": "2024-12-04",
          "type": "official",
          "url": "https://deepmind.google/blog/genie-2-a-large-scale-foundation-world-model/"
        }
      ]
    },
    {
      "id": "deepseek-r1",
      "period": "2025-H1",
      "date": "2025-01-20",
      "lane": "event",
      "importance": "major",
      "title": "DeepSeek-R1",
      "short": "开放推理模型震动全球市场",
      "what": "DeepSeek 发布 R1、R1-Zero 与蒸馏模型，公开强化学习推理路线并提供开放权重。",
      "why": "它展示了高水平推理能力可以更快、更低成本地扩散到开放生态。",
      "changed": "推理模型从少数闭源实验室的优势快速变成全球可复制的工程路线。",
      "concepts": [
        "Reasoning RL",
        "Distillation",
        "Open Weights"
      ],
      "orgs": [
        "DeepSeek"
      ],
      "sources": [
        {
          "title": "DeepSeek-R1 Release",
          "publisher": "DeepSeek",
          "date": "2025-01-20",
          "type": "official",
          "url": "https://deepseek.com/en/news/deepseek-r1/"
        },
        {
          "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
          "publisher": "DeepSeek-AI · arXiv",
          "date": "2025-01-22",
          "type": "paper",
          "url": "https://arxiv.org/abs/2501.12948",
          "fullText": "https://arxiv.org/pdf/2501.12948"
        }
      ]
    },
    {
      "id": "vibe-coding",
      "period": "2025-H1",
      "date": "2025-02-02",
      "lane": "tech",
      "importance": "major",
      "title": "Vibe Coding",
      "short": "软件开发从写代码转向描述意图",
      "what": "Andrej Karpathy 用 Vibe Coding 描述一种依靠自然语言、运行结果和快速反馈生成软件的方式。",
      "why": "这个词把已经发生的产品变化命名了：非开发者也能制作应用，专业开发者则以更高层级操作代码。",
      "changed": "软件生产的瓶颈从敲代码转向问题定义、上下文、验证和产品判断。",
      "concepts": [
        "Natural Language Programming",
        "Software 3.0",
        "Builder"
      ],
      "orgs": [
        "Andrej Karpathy",
        "Cursor",
        "Lovable",
        "Replit"
      ],
      "sources": [
        {
          "title": "Software Is Changing (Again)",
          "publisher": "Andrej Karpathy · AI Startup School",
          "date": "2025-06-17",
          "type": "talk",
          "url": "https://www.youtube.com/watch?v=LCEmiRjPEtQ"
        }
      ]
    },
    {
      "id": "claude-code",
      "period": "2025-H1",
      "date": "2025-02-24",
      "lane": "event",
      "importance": "major",
      "title": "Claude Code",
      "short": "Coding Agent 进入终端",
      "what": "Anthropic 发布 Claude Code 研究预览，让 Claude 直接搜索代码、编辑文件、运行测试和调用命令行工具。",
      "why": "终端和代码库提供了清晰工具、快速反馈与可验证结果，是 Agent 最早形成真实生产力的环境。",
      "changed": "AI Coding 从补全和对话升级为可委派的工程任务。",
      "concepts": [
        "Agentic Coding",
        "Terminal Agent",
        "Verification"
      ],
      "orgs": [
        "Anthropic"
      ],
      "sources": [
        {
          "title": "Claude 3.7 Sonnet and Claude Code",
          "publisher": "Anthropic",
          "date": "2025-02-24",
          "type": "official",
          "url": "https://www.anthropic.com/news/claude-3-7-sonnet"
        }
      ]
    },
    {
      "id": "deep-research",
      "period": "2025-H1",
      "date": "2025-02-02",
      "lane": "event",
      "title": "Deep Research",
      "short": "异步研究 Agent 产品化",
      "what": "OpenAI 发布能够自主浏览、分析大量网页和文件并生成带来源报告的研究 Agent。",
      "why": "它第一次让大众把一个需要几十分钟的完整知识任务交给模型异步执行。",
      "changed": "聊天产品开始吸收搜索、浏览、来源判断、写作和长任务进度管理。",
      "concepts": [
        "Research Agent",
        "Asynchronous Work",
        "Source Synthesis"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Introducing deep research",
          "publisher": "OpenAI",
          "date": "2025-02-02",
          "type": "official",
          "url": "https://openai.com/index/introducing-deep-research/"
        }
      ]
    },
    {
      "id": "manus",
      "period": "2025-H1",
      "date": "2025-03-06",
      "lane": "event",
      "title": "Manus 引发通用 Agent 热潮",
      "short": "“从想法到行动”成为产品叙事",
      "what": "Manus 通过招聘筛选、股票研究、房产搜索等演示，迅速引发对通用自主 Agent 的关注。",
      "why": "它把 Agent 叙事从开发者工具扩展到普通用户可理解的端到端任务交付。",
      "changed": "通用 Agent 成为全球产品竞赛；演示质量、真实可靠性与安全风险同时受到关注。",
      "concepts": [
        "General-purpose Agent",
        "Task Delivery"
      ],
      "orgs": [
        "Manus",
        "Butterfly Effect",
        "AWS"
      ],
      "sources": [
        {
          "title": "Manus Selects AWS to Power General Purpose AI Agent",
          "publisher": "Amazon Web Services",
          "date": "2025-12",
          "type": "official",
          "url": "https://press.aboutamazon.com/aws/2025/12/manus-selects-aws-to-power-general-purpose-ai-agent-serving-millions-globally"
        }
      ]
    },
    {
      "id": "agent-platforms",
      "period": "2025-H1",
      "date": "2025-04-09",
      "lane": "event",
      "title": "Agent SDK 与 A2A",
      "short": "Agent 平台和互操作协议集中出现",
      "what": "OpenAI 发布 Responses API 与 Agents SDK；Google 与伙伴推出 Agent2Agent 协议和 Agent Development Kit。",
      "why": "模型能力开始被包装为搜索、文件、计算机操作、追踪和多 Agent 编排的完整开发平台。",
      "changed": "平台竞争从模型 API 扩展到 Agent runtime、工具生态和跨 Agent 协作标准。",
      "concepts": [
        "Agents SDK",
        "A2A",
        "Agent Runtime"
      ],
      "orgs": [
        "OpenAI",
        "Google Cloud",
        "Agent ecosystem"
      ],
      "sources": [
        {
          "title": "New tools for building agents",
          "publisher": "OpenAI",
          "date": "2025-03-11",
          "type": "official",
          "url": "https://openai.com/index/new-tools-for-building-agents/"
        },
        {
          "title": "Google Cloud Next 25: Agent2Agent Protocol",
          "publisher": "Google",
          "date": "2025-04-11",
          "type": "official",
          "url": "https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/google-cloud-next-25-recap/"
        }
      ]
    },
    {
      "id": "codex-agent",
      "period": "2025-H1",
      "date": "2025-05-16",
      "lane": "event",
      "title": "Codex 云端 Coding Agent",
      "short": "工程任务开始异步并行委派",
      "what": "OpenAI 在 ChatGPT 中推出云端 Codex，让多个任务在隔离环境中并行运行并返回可审查结果。",
      "why": "它把人机协作从实时 pair programming 推向分派任务、等待执行、集中审核。",
      "changed": "Coding Agent 开始重塑工程团队的任务队列、代码审查和并行工作方式。",
      "concepts": [
        "Cloud Agent",
        "Parallel Delegation",
        "Sandbox"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Introducing Codex",
          "publisher": "OpenAI",
          "date": "2025-05-16",
          "type": "official",
          "url": "https://openai.com/index/introducing-codex/"
        }
      ]
    },
    {
      "id": "context-engineering",
      "period": "2025-H2",
      "date": "2025-09-29",
      "lane": "tech",
      "importance": "major",
      "title": "Context Engineering",
      "short": "从写提示词转向管理整个状态",
      "what": "Context Engineering 关注系统指令、工具、检索数据、消息历史和运行状态如何共同进入有限上下文。",
      "why": "长任务 Agent 的失败往往不是模型不够聪明，而是它在错误时间看到了错误信息。",
      "changed": "AI 工程的中心从一次性 prompt 优化转向持续的上下文选择、压缩、记忆和交接。",
      "concepts": [
        "Context Engineering",
        "Compaction",
        "Structured Memory"
      ],
      "orgs": [
        "Anthropic",
        "AI engineering community"
      ],
      "sources": [
        {
          "title": "Effective context engineering for AI agents",
          "publisher": "Anthropic Engineering",
          "date": "2025-09-29",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
        }
      ]
    },
    {
      "id": "agent-skills",
      "period": "2025-H2",
      "date": "2025-10-16",
      "lane": "tech",
      "importance": "major",
      "title": "Agent Skills",
      "short": "可复用工作方法进入 Agent 运行时",
      "what": "Anthropic 将指令、参考材料与脚本打包为按需加载的 Skills，使 Agent 能在不同任务中复用专业流程。",
      "why": "它补上了模型和工具之间的一层：不仅告诉 Agent 能用什么，还告诉它如何可靠地完成某类工作。",
      "changed": "能力扩展从改 prompt 或重新训练模型，转向可版本化、可组合的工作知识包。",
      "concepts": [
        "Agent Skills",
        "Progressive Disclosure",
        "Reusable Workflows"
      ],
      "orgs": [
        "Anthropic",
        "Open agent ecosystem"
      ],
      "sources": [
        {
          "title": "Equipping agents for the real world with Agent Skills",
          "publisher": "Anthropic Engineering",
          "date": "2025-10-16",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
        }
      ]
    },
    {
      "id": "genie-3",
      "period": "2025-H2",
      "date": "2025-08-05",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "Genie 3",
      "short": "实时生成可导航的通用世界",
      "what": "Google DeepMind 发布通用世界模型 Genie 3，可根据文字实时生成多类可导航环境，并维持数分钟的一致性。",
      "why": "世界模型从研究环境迈向开放场景模拟：它能根据 Agent 行动预测世界演化，也能通过提示触发天气和对象等世界事件。",
      "changed": "可无限生成的训练环境开始成为通用 Agent、自动驾驶与具身智能的共同基础设施想象。",
      "concepts": [
        "General-purpose World Model",
        "Realtime Simulation",
        "Promptable Events"
      ],
      "orgs": [
        "Google DeepMind"
      ],
      "sources": [
        {
          "title": "Genie 3: A new frontier for world models",
          "publisher": "Google DeepMind",
          "date": "2025-08-05",
          "type": "official",
          "url": "https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/"
        },
        {
          "title": "Genie 3",
          "publisher": "Google DeepMind",
          "date": "Living model page",
          "type": "documentation",
          "url": "https://deepmind.google/models/genie/"
        }
      ]
    },
    {
      "id": "sora-2",
      "period": "2025-H2",
      "date": "2025-09-30",
      "lane": "event",
      "topic": "world-model",
      "title": "Sora 2",
      "short": "视频模型开始更可靠地模拟失败与物理后果",
      "what": "OpenAI 发布 Sora 2，强调更准确的物理行为、状态持续、多镜头控制以及同步声音。",
      "why": "一个有用的世界模拟器必须能呈现行动失败后的真实后果，而不能为了满足提示让物体瞬移或世界变形。",
      "changed": "视频生成的评价从视觉奇观进一步转向物理一致性、可控性与作为训练环境的潜力。",
      "concepts": [
        "Video World Model",
        "Physical Consistency",
        "State Persistence"
      ],
      "orgs": [
        "OpenAI"
      ],
      "sources": [
        {
          "title": "Sora 2 is here",
          "publisher": "OpenAI",
          "date": "2025-09-30",
          "type": "official",
          "url": "https://openai.com/index/sora-2/"
        },
        {
          "title": "Sora 2 System Card",
          "publisher": "OpenAI",
          "date": "2025-09-30",
          "type": "report",
          "url": "https://cdn.openai.com/pdf/50d5973c-c4ff-4c2d-986f-c72b5d0ff069/sora_2_system_card.pdf",
          "fullText": "https://cdn.openai.com/pdf/50d5973c-c4ff-4c2d-986f-c72b5d0ff069/sora_2_system_card.pdf"
        }
      ]
    },
    {
      "id": "lovable-growth",
      "period": "2025-H2",
      "date": "2025-07-23",
      "lane": "event",
      "title": "Lovable 达到 $100M ARR",
      "short": "Vibe Coding 形成独立市场",
      "what": "Lovable 宣布达到一亿美元 ARR，并将产品升级为能够调用外部工具的 Agent。",
      "why": "它表明自然语言造软件不仅是开发者效率工具，也成为非技术创作者的消费级产品。",
      "changed": "“Builder”作为用户身份兴起，软件需求、原型和生产之间的距离显著缩短。",
      "concepts": [
        "Build Economy",
        "Vibe Coding",
        "No-code Agent"
      ],
      "orgs": [
        "Lovable"
      ],
      "sources": [
        {
          "title": "$100M ARR & Lovable Agent",
          "publisher": "Lovable",
          "date": "2025-07-23",
          "type": "official",
          "url": "https://lovable.dev/blog/agent"
        }
      ]
    },
    {
      "id": "effective-harnesses",
      "period": "2025-H2",
      "date": "2025-11-26",
      "lane": "tech",
      "importance": "major",
      "title": "Effective Harnesses",
      "short": "长任务能力取决于模型周围的系统",
      "what": "Anthropic 总结 initializer、进度文件、Git 历史、功能清单和端到端测试如何让 Agent 跨上下文持续工作。",
      "why": "它表明单纯把旗舰模型放进循环并不能完成长项目；环境和交接结构决定结果。",
      "changed": "Harness 从内部实现细节上升为 Agent 性能与可靠性的独立工程对象。",
      "concepts": [
        "Agent Harness",
        "Long-running Agent",
        "State Handoff"
      ],
      "orgs": [
        "Anthropic"
      ],
      "sources": [
        {
          "title": "Effective harnesses for long-running agents",
          "publisher": "Anthropic Engineering",
          "date": "2025-11-26",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents"
        }
      ]
    },
    {
      "id": "claude-cowork",
      "period": "2026-H1",
      "date": "2026-01-12",
      "lane": "event",
      "title": "Claude Cowork",
      "short": "Coding Agent 走向桌面知识工作",
      "what": "Anthropic 将 Claude Code 式的 Agent 能力扩展到文件、桌面和一般知识工作。",
      "why": "Coding Agent 的 harness 被证明可以迁移到研究、文档、分析和企业流程。",
      "changed": "头部实验室开始争夺“桌面数字同事”，而不只是聊天助手。",
      "concepts": [
        "Knowledge-work Agent",
        "Desktop Agent",
        "Cowork"
      ],
      "orgs": [
        "Anthropic Labs"
      ],
      "sources": [
        {
          "title": "Introducing Labs",
          "publisher": "Anthropic",
          "date": "2026-01-13",
          "type": "official",
          "url": "https://www.anthropic.com/news/introducing-anthropic-labs"
        }
      ]
    },
    {
      "id": "openclaw",
      "period": "2026-H1",
      "date": "2026-01-29",
      "lane": "event",
      "importance": "major",
      "title": "OpenClaw 爆火",
      "short": "开源 Personal Agent 出现 ChatGPT 时刻",
      "what": "OpenClaw 将长期记忆、定时任务、消息入口、工具与 Skills 组合成可在个人设备运行的开源助手。",
      "why": "它给用户的不是又一个模型，而是一个 24 小时存在、可替换模型、可改造并能主动行动的个人 Agent。",
      "changed": "价值重心从“选哪个模型”进一步移向用户拥有的 Agent runtime、记忆、工具和生态。",
      "concepts": [
        "Personal Agent",
        "Open Source",
        "Agent OS",
        "Always-on"
      ],
      "orgs": [
        "OpenClaw community",
        "GitHub",
        "OpenAI"
      ],
      "sources": [
        {
          "title": "OpenClaw Official Site",
          "publisher": "OpenClaw",
          "date": "Living project",
          "type": "official",
          "url": "https://openclaw.ai/"
        },
        {
          "title": "OpenClaw Repository",
          "publisher": "GitHub",
          "date": "Living repository",
          "type": "code",
          "url": "https://github.com/openclaw/openclaw"
        },
        {
          "title": "Meta to acquire Moltbook, the social network for AI agents",
          "publisher": "Associated Press",
          "date": "2026-03-10",
          "type": "reporting",
          "url": "https://apnews.com/article/31af42ccbb04001dd17a3fc7067d1de3"
        }
      ]
    },
    {
      "id": "moltbook",
      "period": "2026-H1",
      "date": "2026-01-27",
      "lane": "event",
      "title": "Moltbook 走红",
      "short": "Agent 社交网络成为文化现象",
      "what": "面向 AI Agent 的类 Reddit 网络 Moltbook 快速传播，大量 OpenClaw Agent 账号在其中发帖互动。",
      "why": "它让机器之间持续互动的未来第一次以高度可见、可传播的产品形式出现。",
      "changed": "Agent 身份、归因、安全和“究竟是谁在行动”成为新公共问题；Meta 随后收购其团队。",
      "concepts": [
        "Agent Network",
        "Machine Identity",
        "Attribution"
      ],
      "orgs": [
        "Moltbook",
        "Meta",
        "OpenClaw"
      ],
      "sources": [
        {
          "title": "Security concerns and skepticism are bursting the Moltbook bubble",
          "publisher": "Associated Press",
          "date": "2026-02-06",
          "type": "reporting",
          "url": "https://apnews.com/article/69855ab843a5597577120aac99efde9a"
        },
        {
          "title": "The Moltbook Illusion",
          "publisher": "arXiv",
          "date": "2026-02-07",
          "type": "paper",
          "url": "https://arxiv.org/abs/2602.07432",
          "fullText": "https://arxiv.org/pdf/2602.07432"
        }
      ]
    },
    {
      "id": "harness-design",
      "period": "2026-H1",
      "date": "2026-03-24",
      "lane": "tech",
      "importance": "major",
      "title": "Harness Engineering",
      "short": "Agent 的工作制度成为性能杠杆",
      "what": "Anthropic 等团队系统研究 planner、generator、evaluator、上下文重置、结构化交接和端到端验收。",
      "why": "同一个模型放进不同 Harness，可能得到完全不同的长任务质量、成本和安全表现。",
      "changed": "AI 工程从 prompt、context 继续向完整运行环境、验证循环和治理结构扩展。",
      "concepts": [
        "Harness Engineering",
        "Generator-Evaluator",
        "Context Reset",
        "Evals"
      ],
      "orgs": [
        "Anthropic",
        "Agent engineering community"
      ],
      "sources": [
        {
          "title": "Harness design for long-running application development",
          "publisher": "Anthropic Engineering",
          "date": "2026-03-24",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps"
        }
      ]
    },
    {
      "id": "managed-agents",
      "period": "2026-H1",
      "date": "2026-04-08",
      "lane": "tech",
      "title": "Managed Agents",
      "short": "Session、Harness 与 Sandbox 被独立管理",
      "what": "Anthropic 将 Agent 拆为可持久记录的 session、负责循环与工具路由的 harness，以及执行代码的 sandbox。",
      "why": "长任务与大规模并发要求模型的“脑”与执行环境的“手”可以分别扩展和治理。",
      "changed": "Agent runtime 逐渐成为像云计算运行时一样的独立基础设施层。",
      "concepts": [
        "Managed Agent",
        "Session Log",
        "Sandbox",
        "Runtime"
      ],
      "orgs": [
        "Anthropic"
      ],
      "sources": [
        {
          "title": "Scaling Managed Agents: Decoupling the brain from the hands",
          "publisher": "Anthropic Engineering",
          "date": "2026-04-08",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/managed-agents"
        }
      ]
    },
    {
      "id": "nemoclaw",
      "period": "2026-H1",
      "date": "2026-03-16",
      "lane": "event",
      "title": "NVIDIA NemoClaw",
      "short": "OpenClaw 走向受控企业运行环境",
      "what": "NVIDIA 发布用于在 OpenShell 沙箱中更安全运行常驻 OpenClaw Agent 的开放参考栈。",
      "why": "开源个人 Agent 的爆发快速催生企业级沙箱、策略和安全基础设施。",
      "changed": "Agent 热点开始从“能做什么”转向“被允许做什么、如何限制爆炸半径”。",
      "concepts": [
        "Agent Security",
        "Sandbox",
        "Policy"
      ],
      "orgs": [
        "NVIDIA",
        "OpenClaw"
      ],
      "sources": [
        {
          "title": "NVIDIA NemoClaw",
          "publisher": "NVIDIA Documentation",
          "date": "2026-03",
          "type": "documentation",
          "url": "https://docs.nvidia.com/nemoclaw/user-guide/openclaw/home/"
        }
      ]
    },
    {
      "id": "harness-mainstream",
      "period": "2026-H2",
      "date": "2026-08-01",
      "lane": "tech",
      "importance": "major",
      "status": "watching",
      "title": "Harness 成为主战场",
      "short": "模型之外的系统差异被显性化",
      "what": "Agent harness 开始从单一产品内部实现，变成开发工具、IDE、企业平台和开源社区共同讨论的独立层。",
      "why": "当模型能力越来越容易切换和追平，环境、上下文、测试、回滚、权限和观测决定实际可用性。",
      "changed": "团队开始像选择模型一样选择和设计 Harness；Agent 能否生产化取决于整套系统。",
      "concepts": [
        "Harness Engineering",
        "Model-Harness-Environment",
        "Agent Ops"
      ],
      "orgs": [
        "Anthropic",
        "OpenAI",
        "Microsoft",
        "Open-source community"
      ],
      "sources": [
        {
          "title": "Choose and use an agent harness",
          "publisher": "Visual Studio Code",
          "date": "2026-08",
          "type": "documentation",
          "url": "https://code.visualstudio.com/docs/agents/run/agent-harnesses"
        },
        {
          "title": "Code as Agent Harness",
          "publisher": "arXiv",
          "date": "2026-05-18",
          "type": "paper",
          "url": "https://arxiv.org/abs/2605.18747",
          "fullText": "https://arxiv.org/pdf/2605.18747"
        }
      ]
    },
    {
      "id": "kimi-k3",
      "period": "2026-H2",
      "date": "2026-07-16",
      "lane": "event",
      "topic": "moe",
      "importance": "major",
      "title": "Kimi K3",
      "short": "2.8T 级开放原生多模态 Agent 模型",
      "what": "Moonshot AI 发布 Kimi K3：2.8T 总参数、104B 激活参数、原生视觉与 1M 上下文，并计划完整开放模型权重。",
      "why": "它把超高稀疏度 MoE、长上下文、多模态和长时 Agent 工作整合在同一开放模型中，也让中国模型公司重新进入前沿规模竞争。",
      "changed": "开放模型的竞争尺度被推到 3T 级；架构重点从单纯堆参数转向 KDA、Attention Residuals、Stable LatentMoE 与低精度部署的系统组合。",
      "concepts": [
        "Kimi Delta Attention",
        "Attention Residuals",
        "Stable LatentMoE",
        "Native Multimodality",
        "1M Context"
      ],
      "orgs": [
        "Moonshot AI",
        "Kimi open-source ecosystem"
      ],
      "sources": [
        {
          "title": "Kimi K3 Technical Report",
          "publisher": "Moonshot AI",
          "date": "2026-07-27",
          "type": "paper",
          "url": "https://github.com/MoonshotAI/Kimi-K3/blob/main/k3_tech_report.pdf",
          "fullText": "https://raw.githubusercontent.com/MoonshotAI/Kimi-K3/main/k3_tech_report.pdf"
        },
        {
          "title": "Kimi K3: Open Frontier Intelligence",
          "publisher": "Kimi",
          "date": "2026-07-16",
          "type": "official",
          "url": "https://www.kimi.ai/blog/kimi-k3"
        },
        {
          "title": "MoonshotAI / Kimi-K3",
          "publisher": "GitHub",
          "date": "2026-07-27",
          "type": "code",
          "url": "https://github.com/MoonshotAI/Kimi-K3"
        }
      ]
    },
    {
      "id": "planet",
      "period": "2018-H2",
      "date": "2018-11-12",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "PlaNet",
      "short": "从像素学习动力学，并直接在潜在空间规划",
      "what": "PlaNet 从图像观察中学习随机潜在动力学模型，并通过在线规划选择连续控制动作。",
      "why": "它证明 Agent 不必先重建每个像素，也能学到足以规划的紧凑环境状态。",
      "changed": "世界模型从‘在梦里训练’的概念演示，推进到复杂视觉控制中的高样本效率规划。",
      "concepts": [
        "PlaNet",
        "Latent Dynamics",
        "Online Planning",
        "Model-based RL"
      ],
      "orgs": [
        "Google Brain",
        "DeepMind",
        "University of Michigan"
      ],
      "sources": [
        {
          "title": "Learning Latent Dynamics for Planning from Pixels",
          "publisher": "Hafner et al. · arXiv",
          "date": "2018-11-12",
          "type": "paper",
          "url": "https://arxiv.org/abs/1811.04551",
          "fullText": "https://arxiv.org/pdf/1811.04551"
        }
      ]
    },
    {
      "id": "muzero",
      "period": "2019-H2",
      "date": "2019-11-19",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "MuZero",
      "short": "不知道规则，也能学模型并向前搜索",
      "what": "MuZero 不重建完整环境，只学习规划直接需要的奖励、价值和策略，并把这个模型用于树搜索。",
      "why": "它说明有用的世界模型不必像素级复刻世界；只要保留决策相关结构，就能支持强规划。",
      "changed": "学习模型与搜索结合后，在围棋、国际象棋、将棋和 Atari 中同时达到超人或领先表现。",
      "concepts": [
        "MuZero",
        "Value-equivalent Model",
        "Tree Search",
        "Planning"
      ],
      "orgs": [
        "DeepMind"
      ],
      "sources": [
        {
          "title": "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model",
          "publisher": "Schrittwieser et al. · arXiv",
          "date": "2019-11-19",
          "type": "paper",
          "url": "https://arxiv.org/abs/1911.08265",
          "fullText": "https://arxiv.org/pdf/1911.08265"
        },
        {
          "title": "MuZero: Mastering Go, chess, shogi and Atari without rules",
          "publisher": "Google DeepMind",
          "date": "2020-12-23",
          "type": "official",
          "url": "https://deepmind.google/blog/muzero-mastering-go-chess-shogi-and-atari-without-rules/"
        }
      ]
    },
    {
      "id": "dreamerv2",
      "period": "2020-H2",
      "date": "2020-10-05",
      "lane": "tech",
      "topic": "world-model",
      "title": "DreamerV2",
      "short": "离散潜在世界首次在 Atari 55 项达到人类水平",
      "what": "DreamerV2 用离散潜在状态学习视觉世界，并让策略完全从世界模型的预测中学习行为。",
      "why": "它把潜在想象路线推进到长期由无模型方法主导的 Atari 基准。",
      "changed": "离散表示成为世界模型的重要技术选择，也为后来的 Transformer 视频 token 路线提供了连接点。",
      "concepts": [
        "Discrete Latents",
        "Latent Imagination",
        "Atari",
        "Model-based RL"
      ],
      "orgs": [
        "Google Research",
        "DeepMind",
        "University of Toronto"
      ],
      "sources": [
        {
          "title": "Mastering Atari with Discrete World Models",
          "publisher": "Hafner et al. · arXiv",
          "date": "2020-10-05",
          "type": "paper",
          "url": "https://arxiv.org/abs/2010.02193",
          "fullText": "https://arxiv.org/pdf/2010.02193"
        }
      ]
    },
    {
      "id": "efficientzero",
      "period": "2021-H2",
      "date": "2021-10-30",
      "lane": "tech",
      "topic": "world-model",
      "title": "EfficientZero",
      "short": "两小时游戏数据把模型式 RL 推过人类基线",
      "what": "EfficientZero 在 MuZero 框架上加入自监督表征、端到端价值前缀预测与离线数据校正，提高有限交互下的规划质量。",
      "why": "现实世界交互昂贵且危险，世界模型的核心承诺之一就是用更少真实数据学会有效行动。",
      "changed": "它在 Atari 100k 中以约两小时实时游戏经验首次取得总体超人表现，并开放了实现。",
      "concepts": [
        "EfficientZero",
        "Sample-efficient RL",
        "MuZero",
        "Limited Data"
      ],
      "orgs": [
        "Tsinghua University",
        "UC Berkeley"
      ],
      "sources": [
        {
          "title": "Mastering Atari Games with Limited Data",
          "publisher": "Ye et al. · arXiv",
          "date": "2021-10-30",
          "type": "paper",
          "url": "https://arxiv.org/abs/2111.00210",
          "fullText": "https://arxiv.org/pdf/2111.00210"
        },
        {
          "title": "YeWR / EfficientZero",
          "publisher": "GitHub",
          "date": "2021",
          "type": "code",
          "url": "https://github.com/YeWR/EfficientZero"
        }
      ]
    },
    {
      "id": "jepa-blueprint",
      "period": "2022-H1",
      "date": "2022-06-27",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "JEPA 世界模型路线图",
      "short": "预测抽象表征，而不是穷举像素细节",
      "what": "Yann LeCun 提出面向自主机器智能的模块化架构，把可配置世界模型、内在目标、分层 JEPA 与规划组合起来。",
      "why": "它给出了区别于自回归生成的路线：在抽象表征空间预测未来，忽略不可预测且与任务无关的细节。",
      "changed": "‘世界模型 + 规划’成为 Meta FAIR 一条公开的长期研究纲领，并衍生出 I-JEPA 与 V-JEPA。",
      "concepts": [
        "JEPA",
        "Hierarchical Planning",
        "Energy-based Model",
        "Autonomous Machine Intelligence"
      ],
      "orgs": [
        "Meta FAIR",
        "New York University",
        "Yann LeCun"
      ],
      "sources": [
        {
          "title": "A Path Towards Autonomous Machine Intelligence",
          "publisher": "Yann LeCun · OpenReview",
          "date": "2022-06-27",
          "type": "paper",
          "url": "https://openreview.net/forum?id=BZ5a1r-kVsf",
          "fullText": "https://openreview.net/pdf?id=BZ5a1r-kVsf"
        }
      ]
    },
    {
      "id": "iris-world-model",
      "period": "2022-H2",
      "date": "2022-09-01",
      "lane": "tech",
      "topic": "world-model",
      "title": "IRIS",
      "short": "Transformer 进入样本高效世界模型",
      "what": "IRIS 用离散自编码器压缩画面，再让自回归 Transformer 学习潜在世界的时间演化。",
      "why": "它把语言模型擅长的 token 序列建模迁移到 Agent 的想象环境中。",
      "changed": "世界模型与 Transformer 视频 token 路线开始明显汇合，并在 Atari 100k 的有限交互预算下取得领先结果。",
      "concepts": [
        "IRIS",
        "Autoregressive Transformer",
        "Discrete Autoencoder",
        "Sample Efficiency"
      ],
      "orgs": [
        "University of Geneva"
      ],
      "sources": [
        {
          "title": "Transformers are Sample-Efficient World Models",
          "publisher": "Micheli, Alonso & Fleuret · arXiv",
          "date": "2022-09-01",
          "type": "paper",
          "url": "https://arxiv.org/abs/2209.00588",
          "fullText": "https://arxiv.org/pdf/2209.00588"
        },
        {
          "title": "eloialonso / iris",
          "publisher": "GitHub",
          "date": "2022",
          "type": "code",
          "url": "https://github.com/eloialonso/iris"
        }
      ]
    },
    {
      "id": "i-jepa",
      "period": "2023-H1",
      "date": "2023-01-19",
      "lane": "tech",
      "topic": "world-model",
      "title": "I-JEPA",
      "short": "在抽象表示中预测图像缺失部分",
      "what": "I-JEPA 从一个图像上下文块预测其他区域的高层表示，不依赖像素重建或人工数据增强。",
      "why": "它是 JEPA 研究纲领的第一个大规模实证，展示预测表征可以学到语义与空间结构。",
      "changed": "世界模型研究出现一条非生成式分支：先学习世界中可预测的抽象结构，再把它扩展到视频和行动。",
      "concepts": [
        "I-JEPA",
        "Joint Embedding",
        "Self-supervised Learning",
        "Representation Prediction"
      ],
      "orgs": [
        "Meta FAIR"
      ],
      "sources": [
        {
          "title": "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture",
          "publisher": "Assran et al. · arXiv",
          "date": "2023-01-19",
          "type": "paper",
          "url": "https://arxiv.org/abs/2301.08243",
          "fullText": "https://arxiv.org/pdf/2301.08243"
        },
        {
          "title": "I-JEPA: The first AI model based on Yann LeCun’s vision",
          "publisher": "Meta AI",
          "date": "2023-06-13",
          "type": "official",
          "url": "https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/"
        }
      ]
    },
    {
      "id": "gaia-1",
      "period": "2023-H1",
      "date": "2023-06-17",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "GAIA-1",
      "short": "自动驾驶有了视频、文本与动作共同驱动的世界模型",
      "what": "Wayve 用真实城市驾驶数据训练 GAIA-1，让模型根据视频、语言与车辆动作生成可控的未来驾驶场景。",
      "why": "自动驾驶的稀有危险场景难以收集，更不能在真实道路上任意复现；世界模型提供了可生成的‘what if’实验场。",
      "changed": "世界模型从游戏控制进入高风险产业，开始承担训练、仿真与安全场景探索的角色。",
      "concepts": [
        "Driving World Model",
        "Action Conditioning",
        "Autoregressive Video",
        "Counterfactual Simulation"
      ],
      "orgs": [
        "Wayve"
      ],
      "sources": [
        {
          "title": "Introducing GAIA-1: A Cutting-Edge Generative AI Model for Autonomy",
          "publisher": "Wayve",
          "date": "2023-06-17",
          "type": "official",
          "url": "https://wayve.ai/thinking/introducing-gaia1/"
        },
        {
          "title": "GAIA-1: A Generative World Model for Autonomous Driving",
          "publisher": "Wayve · arXiv",
          "date": "2023-09-29",
          "type": "paper",
          "url": "https://arxiv.org/abs/2309.17080",
          "fullText": "https://arxiv.org/pdf/2309.17080"
        }
      ]
    },
    {
      "id": "unisim",
      "period": "2023-H2",
      "date": "2023-10-09",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "UniSim",
      "short": "让 Agent 在学出来的真实世界模拟器里训练",
      "what": "UniSim 组合图像、机器人与导航数据，学习响应高层指令和低层控制的动作条件视觉模拟器。",
      "why": "它展示了只在生成式模拟器里训练的规划器和强化学习策略，可以零样本迁移到真实机器人。",
      "changed": "视频生成不再只是内容输出，而成为具身 Agent 的可交互训练环境。",
      "concepts": [
        "Learned Simulator",
        "Action-conditioned Video",
        "Sim-to-Real",
        "Embodied Planning"
      ],
      "orgs": [
        "UC Berkeley",
        "Google DeepMind",
        "MIT"
      ],
      "sources": [
        {
          "title": "UniSim: Learning Interactive Real-World Simulators",
          "publisher": "Yang et al.",
          "date": "2023-10-09",
          "type": "official",
          "url": "https://universal-simulator.github.io/"
        },
        {
          "title": "Learning Interactive Real-World Simulators",
          "publisher": "Yang et al. · arXiv",
          "date": "2023-10-09",
          "type": "paper",
          "url": "https://arxiv.org/abs/2310.06114",
          "fullText": "https://arxiv.org/pdf/2310.06114"
        }
      ]
    },
    {
      "id": "td-mpc2",
      "period": "2023-H2",
      "date": "2023-10-25",
      "lane": "tech",
      "topic": "world-model",
      "title": "TD-MPC2",
      "short": "隐式世界模型开始随模型与数据规模扩展",
      "what": "TD-MPC2 在不解码像素的潜在世界模型中做局部轨迹优化，用统一超参数覆盖 104 个连续控制任务。",
      "why": "它提供了 Dreamer 之外另一条可扩展路线：世界模型不必生成可观看的未来，也能为规划保留足够结构。",
      "changed": "单个 317M 参数 Agent 可以跨 80 个任务、不同具身与动作空间学习，规模化进入连续控制研究。",
      "concepts": [
        "TD-MPC2",
        "Implicit World Model",
        "Model Predictive Control",
        "Multi-task RL"
      ],
      "orgs": [
        "UC San Diego",
        "Meta AI"
      ],
      "sources": [
        {
          "title": "TD-MPC2: Scalable, Robust World Models for Continuous Control",
          "publisher": "Hansen, Su & Wang · arXiv",
          "date": "2023-10-25",
          "type": "paper",
          "url": "https://arxiv.org/abs/2310.16828",
          "fullText": "https://arxiv.org/pdf/2310.16828"
        },
        {
          "title": "TD-MPC2",
          "publisher": "Project page",
          "date": "2023",
          "type": "code",
          "url": "https://www.tdmpc2.com/"
        }
      ]
    },
    {
      "id": "v-jepa",
      "period": "2024-H1",
      "date": "2024-02-15",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "V-JEPA",
      "short": "同一天，世界模型出现与 Sora 相反的预测哲学",
      "what": "V-JEPA 通过遮住视频片段并预测其抽象特征来学习运动与对象交互，不生成缺失像素。",
      "why": "它与同日发布的 Sora 形成清晰对照：一条路线生成视觉世界，另一条路线只预测对理解和规划有用的表示。",
      "changed": "世界模型的公共讨论从‘能否生成逼真视频’扩展到‘应该预测像素还是语义状态’。",
      "concepts": [
        "V-JEPA",
        "Feature Prediction",
        "Video Self-supervision",
        "Non-generative World Model"
      ],
      "orgs": [
        "Meta FAIR"
      ],
      "sources": [
        {
          "title": "V-JEPA: The next step toward advanced machine intelligence",
          "publisher": "Meta AI",
          "date": "2024-02-15",
          "type": "official",
          "url": "https://ai.meta.com/blog/v-jepa-yann-lecun-ai-model-video-joint-embedding-predictive-architecture/"
        },
        {
          "title": "Revisiting Feature Prediction for Learning Visual Representations from Video",
          "publisher": "Bardes et al. · arXiv",
          "date": "2024-02-15",
          "type": "paper",
          "url": "https://arxiv.org/abs/2404.08471",
          "fullText": "https://arxiv.org/pdf/2404.08471"
        },
        {
          "title": "facebookresearch / jepa",
          "publisher": "GitHub",
          "date": "2024",
          "type": "code",
          "url": "https://github.com/facebookresearch/jepa"
        }
      ]
    },
    {
      "id": "gamengen",
      "period": "2024-H2",
      "date": "2024-08-27",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "GameNGen",
      "short": "扩散模型第一次实时充当完整游戏引擎",
      "what": "GameNGen 让一个扩散模型在单颗 TPU 上以每秒 20 帧以上交互模拟经典游戏 DOOM。",
      "why": "它不只是生成游戏录像，而是根据玩家动作持续产生下一帧，展示神经模型替代部分传统引擎的可能。",
      "changed": "实时性成为可交互世界模型的关键竞争指标，随后 Oasis、Genie 3 与开源项目迅速沿这条线推进。",
      "concepts": [
        "Neural Game Engine",
        "Diffusion World Model",
        "Realtime Generation",
        "Action Conditioning"
      ],
      "orgs": [
        "Google Research",
        "Google DeepMind",
        "Tel Aviv University"
      ],
      "sources": [
        {
          "title": "Diffusion Models Are Real-Time Game Engines",
          "publisher": "Valevski et al.",
          "date": "2024-08-27",
          "type": "official",
          "url": "https://gamengen.github.io/"
        },
        {
          "title": "Diffusion Models Are Real-Time Game Engines",
          "publisher": "Valevski et al. · arXiv",
          "date": "2024-08-27",
          "type": "paper",
          "url": "https://arxiv.org/abs/2408.14837",
          "fullText": "https://arxiv.org/pdf/2408.14837"
        }
      ]
    },
    {
      "id": "oasis",
      "period": "2024-H2",
      "date": "2024-10-31",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "Oasis 爆火",
      "short": "AI 实时生成一个可以直接玩的开放世界",
      "what": "Decart 与 Etched 发布 Oasis：模型逐帧接收键鼠输入，在网页中实时生成类似 Minecraft 的可玩世界。",
      "why": "它把世界模型从论文视频变成大众可以亲手操控的现象级体验；Decart 称上线 72 小时达到 100 万用户。",
      "changed": "‘生成式交互体验’成为独立产品类别，推理延迟、长期记忆与服务成本进入世界模型竞争。",
      "concepts": [
        "Generative Interactive Experience",
        "Realtime Video",
        "Diffusion Transformer",
        "Low-latency Inference"
      ],
      "orgs": [
        "Decart",
        "Etched"
      ],
      "sources": [
        {
          "title": "Oasis: A Universe in a Transformer",
          "publisher": "Decart",
          "date": "2024-10-31",
          "type": "official",
          "url": "https://decart.ai/publications/oasis-interactive-ai-video-game-model"
        },
        {
          "title": "Oasis interactive demo",
          "publisher": "Decart",
          "date": "2024-10-31",
          "type": "official",
          "url": "https://oasis.decart.ai/introduction"
        }
      ]
    },
    {
      "id": "world-labs-generating-worlds",
      "period": "2024-H2",
      "date": "2024-12-02",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "World Labs 展示生成 3D 世界",
      "short": "从单张图片走进持久、可导航的空间",
      "what": "World Labs 公布首个空间智能预览：从单张图片生成可在浏览器中自由探索的 3D 世界。",
      "why": "它把 Fei-Fei Li 团队的世界模型路线与二维视频生成区分开，强调显式空间、视角控制和持久几何。",
      "changed": "‘空间智能’成为世界模型的一条产业叙事，连接内容创作、3D 工具、模拟器与机器人。",
      "concepts": [
        "Spatial Intelligence",
        "3D World Generation",
        "Persistent Geometry",
        "Novel View"
      ],
      "orgs": [
        "World Labs",
        "Fei-Fei Li"
      ],
      "sources": [
        {
          "title": "Generating Worlds",
          "publisher": "World Labs",
          "date": "2024-12-02",
          "type": "official",
          "url": "https://www.worldlabs.ai/blog/generating-worlds"
        }
      ]
    },
    {
      "id": "nvidia-cosmos",
      "period": "2025-H1",
      "date": "2025-01-06",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "NVIDIA Cosmos",
      "short": "世界基础模型被包装成 Physical AI 开放平台",
      "what": "NVIDIA 在 CES 发布 Cosmos：包含世界基础模型、视频 tokenizer、数据处理管线、护栏与后训练框架。",
      "why": "机器人和自动驾驶需要海量、可控又难以从现实采集的训练数据；Cosmos 把世界模型定位成产业基础设施。",
      "changed": "竞争单位从单个模型扩大为‘数据整理—预训练—定制—生成—评估’的完整 Physical AI 平台。",
      "concepts": [
        "World Foundation Model",
        "Physical AI",
        "Synthetic Data",
        "Open Models"
      ],
      "orgs": [
        "NVIDIA",
        "1X",
        "Agility Robotics",
        "Wayve",
        "XPENG"
      ],
      "sources": [
        {
          "title": "NVIDIA Launches Cosmos World Foundation Model Platform",
          "publisher": "NVIDIA Newsroom",
          "date": "2025-01-06",
          "type": "official",
          "url": "https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-world-foundation-model-platform-to-accelerate-physical-ai-development"
        },
        {
          "title": "Cosmos World Foundation Model Platform for Physical AI",
          "publisher": "NVIDIA · arXiv",
          "date": "2025-01-07",
          "type": "paper",
          "url": "https://arxiv.org/abs/2501.03575",
          "fullText": "https://arxiv.org/pdf/2501.03575"
        }
      ]
    },
    {
      "id": "muse-wham",
      "period": "2025-H1",
      "date": "2025-02-19",
      "lane": "event",
      "topic": "world-model",
      "title": "Microsoft Muse / WHAM",
      "short": "世界模型开始辅助游戏创意与玩法原型",
      "what": "Microsoft Research 与 Ninja Theory 发布 Muse，一个可生成游戏画面、控制器动作或两者的 World and Human Action Model。",
      "why": "它强调世界模型不只训练 Agent，也可以让人持续修改、分叉与探索玩法创意。",
      "changed": "生成式游戏从资产制作走向玩法和交互序列本身，研究模型也进入 Azure AI Foundry Labs。",
      "concepts": [
        "WHAM",
        "Human Action Model",
        "Gameplay Ideation",
        "Persistent Editing"
      ],
      "orgs": [
        "Microsoft Research",
        "Ninja Theory",
        "Xbox"
      ],
      "sources": [
        {
          "title": "Introducing Muse: Our first generative AI model designed for gameplay ideation",
          "publisher": "Microsoft Research",
          "date": "2025-02-19",
          "type": "official",
          "url": "https://www.microsoft.com/en-us/research/blog/introducing-muse-our-first-generative-ai-model-designed-for-gameplay-ideation/"
        },
        {
          "title": "World and Human Action Models towards gameplay ideation",
          "publisher": "Kanervisto et al. · Nature",
          "date": "2025-02-19",
          "type": "paper",
          "url": "https://www.nature.com/articles/s41586-025-08600-3",
          "fullText": "https://www.nature.com/articles/s41586-025-08600-3.pdf"
        }
      ]
    },
    {
      "id": "dreamgen",
      "period": "2025-H1",
      "date": "2025-05-19",
      "lane": "tech",
      "topic": "world-model",
      "title": "DreamGen",
      "short": "把视频世界模型变成机器人数据工厂",
      "what": "DreamGen 用视频世界模型生成新任务与新环境中的机器人视频，再用潜在动作模型或逆动力学模型恢复伪动作。",
      "why": "机器人数据长期受制于昂贵的真机遥操作；这项工作把扩展轴从人类采集转向 GPU 生成的神经轨迹。",
      "changed": "只用一个环境中的单项真机示范，策略仍能泛化到 22 种新行为与未见环境。",
      "concepts": [
        "Neural Trajectories",
        "Video World Model",
        "Inverse Dynamics",
        "Robot Data Scaling"
      ],
      "orgs": [
        "NVIDIA GEAR",
        "University of Washington"
      ],
      "sources": [
        {
          "title": "DreamGen: Unlocking Generalization in Robot Learning through Video World Models",
          "publisher": "NVIDIA Research",
          "date": "2025-05-20",
          "type": "official",
          "url": "https://research.nvidia.com/labs/gear/dreamgen/"
        },
        {
          "title": "DreamGen: Unlocking Generalization in Robot Learning through Neural Trajectories",
          "publisher": "Jang et al. · arXiv",
          "date": "2025-05-19",
          "type": "paper",
          "url": "https://arxiv.org/abs/2505.12705",
          "fullText": "https://arxiv.org/pdf/2505.12705"
        }
      ]
    },
    {
      "id": "v-jepa-2",
      "period": "2025-H1",
      "date": "2025-06-11",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "V-JEPA 2",
      "short": "从百万小时视频观察，走到零样本机器人规划",
      "what": "V-JEPA 2 先从超过一百万小时视频学习理解与预测，再用不到 62 小时机器人视频做动作条件后训练。",
      "why": "它首次把 JEPA 的抽象视频预测完整连接到‘理解—预测—规划’闭环，并在新实验室环境中零样本控制机械臂。",
      "changed": "互联网视频开始被视为物理先验来源；少量具身数据负责把观察知识接到真实动作上。",
      "concepts": [
        "V-JEPA 2",
        "Action-conditioned World Model",
        "Zero-shot Planning",
        "Physical Reasoning"
      ],
      "orgs": [
        "Meta FAIR"
      ],
      "sources": [
        {
          "title": "Introducing the V-JEPA 2 world model and new benchmarks for physical reasoning",
          "publisher": "Meta AI",
          "date": "2025-06-11",
          "type": "official",
          "url": "https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks/"
        },
        {
          "title": "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning",
          "publisher": "Assran et al. · arXiv",
          "date": "2025-06-11",
          "type": "paper",
          "url": "https://arxiv.org/abs/2506.09985",
          "fullText": "https://arxiv.org/pdf/2506.09985"
        },
        {
          "title": "facebookresearch / vjepa2",
          "publisher": "GitHub",
          "date": "2025",
          "type": "code",
          "url": "https://github.com/facebookresearch/vjepa2"
        }
      ]
    },
    {
      "id": "hunyuanworld-1",
      "period": "2025-H2",
      "date": "2025-07-26",
      "lane": "tech",
      "topic": "world-model",
      "importance": "major",
      "title": "HunyuanWorld 1.0 开源",
      "short": "文字或图片生成可探索、可导出的 3D 世界",
      "what": "腾讯混元开源 HunyuanWorld 1.0，用全景生成、世界分层与 3D 重建把文字或图片变成可探索空间。",
      "why": "它把开放世界模型从动作条件视频扩展到显式 3D 场景，并支持 3DGS、mesh 与物理模拟相关用途。",
      "changed": "中国开源社区进入 3D 世界模型竞争，模型权重与技术报告让空间生成路线更易被复用。",
      "concepts": [
        "3D World Model",
        "Panorama Generation",
        "3D Reconstruction",
        "Open Source"
      ],
      "orgs": [
        "Tencent Hunyuan"
      ],
      "sources": [
        {
          "title": "Tencent-Hunyuan / HunyuanWorld-1.0",
          "publisher": "GitHub",
          "date": "2025-07-26",
          "type": "code",
          "url": "https://github.com/Tencent-Hunyuan/HunyuanWorld-1.0"
        },
        {
          "title": "HunyuanWorld 1.0 Technical Report",
          "publisher": "Tencent Hunyuan",
          "date": "2025-07-26",
          "type": "report",
          "url": "https://3d-models.hunyuan.tencent.com/world/HY_World_1_technical_report.pdf",
          "fullText": "https://3d-models.hunyuan.tencent.com/world/HY_World_1_technical_report.pdf"
        }
      ]
    },
    {
      "id": "matrix-game-2",
      "period": "2025-H2",
      "date": "2025-08-18",
      "lane": "tech",
      "topic": "world-model",
      "title": "Matrix-Game 2.0",
      "short": "开源世界模型达到 25 FPS 流式交互",
      "what": "Skywork AI 发布动作条件的流式互动世界模型，以少步自回归扩散实时生成分钟级视频。",
      "why": "开源模型开始同时挑战三项难题：即时响应用户动作、长序列持续生成，以及多场景泛化。",
      "changed": "25 FPS 的代码与权重开放后，实时世界模型不再只存在于少数闭源实验室。",
      "concepts": [
        "Streaming World Model",
        "Few-step Diffusion",
        "Realtime Interaction",
        "Open Weights"
      ],
      "orgs": [
        "Skywork AI"
      ],
      "sources": [
        {
          "title": "Matrix-Game 2.0: An Open-Source, Real-Time, and Streaming Interactive World Model",
          "publisher": "Skywork AI · arXiv",
          "date": "2025-08-18",
          "type": "paper",
          "url": "https://arxiv.org/abs/2508.13009",
          "fullText": "https://arxiv.org/pdf/2508.13009"
        },
        {
          "title": "SkyworkAI / Matrix-Game",
          "publisher": "GitHub",
          "date": "2025-08-12",
          "type": "code",
          "url": "https://github.com/SkyworkAI/Matrix-Game"
        }
      ]
    },
    {
      "id": "marble-world-model",
      "period": "2025-H2",
      "date": "2025-11-12",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "Marble 向公众开放",
      "short": "多模态 3D 世界模型成为可以直接使用的产品",
      "what": "World Labs 将 Marble 正式开放：可从文字、图片、视频或粗略 3D 布局生成、编辑、扩展并组合世界。",
      "why": "它把世界模型从研究预览推进为创作者工具，并能导出 Gaussian splat、mesh 与视频进入既有 3D 工作流。",
      "changed": "世界模型产品开始与游戏、VFX、设计和机器人模拟工具链发生真实接口，而不只是展示生成片段。",
      "concepts": [
        "Multimodal World Model",
        "3D Editing",
        "Gaussian Splatting",
        "Spatial Creation"
      ],
      "orgs": [
        "World Labs"
      ],
      "sources": [
        {
          "title": "Marble: A Multimodal World Model",
          "publisher": "World Labs",
          "date": "2025-11-12",
          "type": "official",
          "url": "https://www.worldlabs.ai/blog/marble-world-model"
        },
        {
          "title": "Welcome to Marble",
          "publisher": "World Labs Documentation",
          "date": "Living documentation",
          "type": "documentation",
          "url": "https://docs.worldlabs.ai/"
        }
      ]
    },
    {
      "id": "hy-world-2",
      "period": "2026-H1",
      "date": "2026-04-16",
      "lane": "tech",
      "topic": "world-model",
      "title": "HY-World 2.0",
      "short": "开放 3D 世界模型把生成与重建放进同一体系",
      "what": "腾讯混元发布 HY-World 2.0，升级世界生成与 WorldMirror 通用 3D 预测，覆盖多视图/视频重建和可探索世界。",
      "why": "世界模型既需要想象不存在的空间，也需要从少量真实观测重建可用于模拟的空间。",
      "changed": "开源 3D 世界模型从单次生成推进到‘生成 + 重建’的双向空间基础设施。",
      "concepts": [
        "HY-World",
        "WorldMirror",
        "3D Reconstruction",
        "World Generation"
      ],
      "orgs": [
        "Tencent Hunyuan"
      ],
      "sources": [
        {
          "title": "Tencent-Hunyuan / HY-World-2.0",
          "publisher": "GitHub",
          "date": "2026-04-16",
          "type": "code",
          "url": "https://github.com/Tencent-Hunyuan/HY-World-2.0"
        },
        {
          "title": "HY-World 2.0 Technical Report",
          "publisher": "Tencent Hunyuan",
          "date": "2026-04-16",
          "type": "report",
          "url": "https://3d-models.hunyuan.tencent.com/world/world2_0/HY_World_2_0.pdf",
          "fullText": "https://3d-models.hunyuan.tencent.com/world/world2_0/HY_World_2_0.pdf"
        }
      ]
    },
    {
      "id": "cosmos-3",
      "period": "2026-H1",
      "date": "2026-05-31",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "title": "NVIDIA Cosmos 3",
      "short": "理解、生成、仿真和动作被统一进开放 omni 模型",
      "what": "NVIDIA 发布 Cosmos 3，以 Mixture-of-Transformers 统一文本、图像、视频、环境声音与动作序列。",
      "why": "世界模型此前往往分成推理器、视频生成器、模拟器和策略模型；Cosmos 3 尝试把这些接口收进一个可后训练底座。",
      "changed": "Physical AI 的平台竞争从‘用模型造数据’推进到同一模型同时理解世界、想象未来并生成动作。",
      "concepts": [
        "Omnimodal World Model",
        "Mixture-of-Transformers",
        "World-Action Model",
        "Physical AI"
      ],
      "orgs": [
        "NVIDIA",
        "Cosmos Coalition"
      ],
      "sources": [
        {
          "title": "NVIDIA Launches Cosmos 3, the Open Frontier Foundation Model for Physical AI",
          "publisher": "NVIDIA Newsroom",
          "date": "2026-05-31",
          "type": "official",
          "url": "https://nvidianews.nvidia.com/news/nvidia-launches-cosmos-3-the-open-frontier-foundation-model-for-physical-ai"
        },
        {
          "title": "Cosmos 3: Omnimodal World Models for Physical AI",
          "publisher": "NVIDIA · arXiv",
          "date": "2026-06-01",
          "type": "paper",
          "url": "https://arxiv.org/abs/2606.02800",
          "fullText": "https://arxiv.org/pdf/2606.02800"
        },
        {
          "title": "NVIDIA / cosmos",
          "publisher": "GitHub",
          "date": "2026-05-31",
          "type": "code",
          "url": "https://github.com/nvidia/cosmos"
        }
      ]
    },
    {
      "id": "gaia-4",
      "period": "2026-H2",
      "date": "2026-08-03",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "status": "watching",
      "title": "Wayve GAIA-4",
      "short": "自动驾驶策略进入世界模型的闭环安全测试",
      "what": "GAIA-4 把 Wayve AI Driver 的动作实时反馈给世界模型，让驾驶策略与生成环境持续互相影响。",
      "why": "开放环生成只能观看既定未来；闭环仿真才能测量策略改变世界后，世界又怎样改变策略的下一步。",
      "changed": "自动驾驶世界模型从场景合成和离线反事实，推进为可量化端到端安全表现的闭环评估工具。",
      "concepts": [
        "Closed-loop Simulation",
        "Policy Evaluation",
        "Autonomous Driving",
        "Safety Validation"
      ],
      "orgs": [
        "Wayve"
      ],
      "sources": [
        {
          "title": "GAIA-4: Multimodal World Models Powering Closed-Loop Simulation",
          "publisher": "Wayve",
          "date": "2026-08-03",
          "type": "official",
          "url": "https://wayve.ai/thinking/gaia-4/"
        }
      ]
    },
    {
      "id": "matrix-game-3-5",
      "period": "2026-H2",
      "date": "2026-08-30",
      "lane": "tech",
      "topic": "world-model",
      "status": "watching",
      "title": "Matrix-Game 3.5",
      "short": "几何记忆补上实时世界的长期一致性",
      "what": "Matrix-Game 3.5 引入 3D patch memory、投影相机条件与静动态解耦，在实时生成中召回走过的场景和主体。",
      "why": "实时世界模型最难的不只是每帧清晰，而是转身再回来时世界仍在、相机受控、动态对象没有换身份。",
      "changed": "开源互动世界模型开始把竞争焦点从单纯 FPS 推向几何一致、长期记忆与完整开放世界交互。",
      "concepts": [
        "Geometry-aware Memory",
        "Long-horizon Consistency",
        "Realtime Distillation",
        "Interactive World"
      ],
      "orgs": [
        "Skywork AI"
      ],
      "sources": [
        {
          "title": "Matrix-Game 3.5: Enhancing Real-Time Streaming Interactive World Models with Patch Memory",
          "publisher": "Skywork AI · arXiv",
          "date": "2026-08-30",
          "type": "paper",
          "url": "https://arxiv.org/abs/2608.29910",
          "fullText": "https://arxiv.org/pdf/2608.29910"
        },
        {
          "title": "SkyworkAI / Matrix-Game",
          "publisher": "GitHub",
          "date": "2026-08-30",
          "type": "code",
          "url": "https://github.com/SkyworkAI/Matrix-Game"
        }
      ]
    },
    {
      "id": "world-labs-atlas",
      "period": "2026-H2",
      "date": "2026-09-01",
      "lane": "event",
      "topic": "world-model",
      "importance": "major",
      "status": "watching",
      "title": "World Labs Atlas",
      "short": "一个模型统一生成、重建与 real-to-sim",
      "what": "World Labs 发布早期访问的 Atlas：原生处理文字、图像、视频与 3D，生成视角可控视频、重建场景并模拟机器人观察。",
      "why": "它把创作者需要的世界生成、机器人需要的真实场景重建，以及模拟器需要的时空演化放进同一模型。",
      "changed": "空间智能路线从 Marble 的 3D 创作产品，推进到可服务机器人导航和操作的通用 omni 世界模型。",
      "concepts": [
        "Omni World Model",
        "Spatial Reconstruction",
        "Space-time Simulation",
        "Real-to-Sim"
      ],
      "orgs": [
        "World Labs"
      ],
      "sources": [
        {
          "title": "Atlas: A World Model for Spatial Intelligence",
          "publisher": "World Labs",
          "date": "2026-09-01",
          "type": "official",
          "url": "https://www.worldlabs.ai/blog/atlas"
        }
      ]
    },
    {
      "id": "agent-reliability",
      "period": "2026-H2",
      "date": "2026-09-02",
      "lane": "event",
      "status": "watching",
      "title": "Agent 安全与可靠性升温",
      "short": "权限、评测、隔离与追责成为采用前提",
      "what": "随着 Agent 能发送消息、移动文件、执行代码和修改真实系统，平台开始强化沙箱、策略、审批、评测与可观察性。",
      "why": "Agent 的价值来自行动能力，而新的风险也恰恰来自它能行动。",
      "changed": "企业问题从“是否采用 AI”变成“允许哪些 Agent 在什么边界内代表谁行动”。",
      "concepts": [
        "Agent Security",
        "Evals",
        "Containment",
        "Human Approval"
      ],
      "orgs": [
        "NVIDIA",
        "Anthropic",
        "OpenAI",
        "Standards community"
      ],
      "sources": [
        {
          "title": "Demystifying evals for AI agents",
          "publisher": "Anthropic Engineering",
          "date": "2026-01-09",
          "type": "engineering",
          "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
        },
        {
          "title": "NVIDIA NemoClaw Documentation",
          "publisher": "NVIDIA",
          "date": "Living documentation",
          "type": "documentation",
          "url": "https://docs.nvidia.com/nemoclaw/user-guide/openclaw/home/"
        }
      ]
    }
  ]
};
