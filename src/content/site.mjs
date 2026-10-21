// 单一事实源（single source of truth）。
// 站点文案、数字、链接、社交账号全部在这里；中英共用一份数据，构建时分别渲染。
// 修改一条事实 = 改这里一处，然后 npm run build。

const zh = (s) => ({ zh: s, en: s });

export const site = {
  url: "https://robin-fang611.github.io",
  updated: "2026.10",
  email: "weiyangfang950@gmail.com",
  wechat: "weiyangfang950",

  links: {
    github: "https://github.com/Robin-fang611",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/685b590b000000001b021d86",
    douyin: "https://www.douyin.com/user/self?from_tab_name=main",
    bilibili: "https://space.bilibili.com/1340728968",
    x: "https://x.com/Robin126988",
  },

  seo: {
    zh: {
      lang: "zh-CN",
      title: "房钰斌 Robin · 把 AI 带到业务发生的地方",
      description:
        "市场营销出身、不写代码的 AI 原生构建者。驻场把 AI 做进货代的报价与单证流程，发起 1,700+ 人的黑客松组队社群，联合创办独立游戏工作室。",
      ogLocale: "zh_CN",
    },
    en: {
      lang: "en",
      title: "Robin Fang · Bringing AI to where the work happens",
      description:
        "A non-technical, AI-native builder. I embed with businesses to ship AI into freight quoting and documentation, founded a 1,700+ hacker community, and co-founded an indie game studio.",
      ogLocale: "en_US",
    },
  },

  ui: {
    skip: { zh: "跳到正文", en: "Skip to content" },
    toc: { zh: "目录", en: "Contents" },
    tocLabel: { zh: "章节目录", en: "Chapters" },
    openToc: { zh: "目录", en: "Contents" },
    close: { zh: "关闭", en: "Close" },
    langSwitch: { zh: "EN", en: "中文" },
    langSwitchLabel: { zh: "切换到英文版", en: "Switch to Chinese" },
    contactCta: { zh: "联系", en: "Contact" },
    copy: { zh: "复制邮箱", en: "Copy email" },
    copied: { zh: "已复制", en: "Copied" },
    copyFail: { zh: "复制失败，请手动选择", en: "Copy failed — select manually" },
    source: { zh: "出处", en: "Source" },
    print: { zh: "打印 / 存为 PDF", en: "Print / save as PDF" },
    socials: { zh: "社交", en: "Elsewhere" },
    wechat: { zh: "微信", en: "WeChat" },
    updated: { zh: "更新", en: "Updated" },
    volume: { zh: "卷宗", en: "File" },
    footerNote: {
      zh: "全站由一份内容数据生成",
      en: "Generated from a single content source",
    },
  },

  nav: [
    { id: "summary", n: "01", label: { zh: "摘要", en: "Summary" } },
    { id: "evidence", n: "02", label: { zh: "证据", en: "Evidence" } },
    { id: "record", n: "03", label: { zh: "履历", en: "Record" } },
    { id: "ecosystem", n: "04", label: { zh: "生态", en: "Ecosystem" } },
    { id: "method", n: "05", label: { zh: "方法", en: "Method" } },
    { id: "questions", n: "06", label: { zh: "议题", en: "Questions" } },
    { id: "contact", n: "07", label: { zh: "联系", en: "Contact" } },
  ],

  cover: {
    meta: [
      { zh: "卷宗 RB-2026", en: "File RB-2026" },
      { zh: "更新 2026.10", en: "Updated 2026.10" },
      { zh: "武汉 / 深圳", en: "Wuhan / Shenzhen" },
    ],
    eyebrow: { zh: "AI 落地 · 社群 · 游戏", en: "AI delivery · community · games" },
    title: {
      zh: ["把 AI 带到", "业务发生的地方"],
      en: ["Bringing AI to", "where work happens"],
    },
    lede: {
      zh: "我是房钰斌（Robin），市场营销出身，一行代码都不会手写。过去两年只做一件事：站到业务现场，用 AI 把最耗人的环节做掉——货代的报价台、黑客松的组队群、游戏的上线页。",
      en: "I'm Robin Fang, a marketing major who doesn't hand-write a line of code. For the past two years I've done one thing: stand on the shop floor and remove the most exhausting steps with AI — freight quoting desks, hackathon team-forming groups, a game's launch page.",
    },
    facts: [
      { zh: "云天远略（深圳）· 合伙人", en: "Partner, Yuntian Yuanlve (Shenzhen)" },
      { zh: "Linkathon · 早期共建者（1,700+ 人）", en: "Early co-builder, Linkathon (1,700+ members)" },
      { zh: "大隆盛游戏 · 联合创始人", en: "Co-founder, Dalongsheng Games" },
    ],
    actions: {
      primary: { zh: "看三份证据", en: "See the three proofs" },
      secondary: { zh: "约 20 分钟聊聊", en: "Book 20 minutes" },
    },
    seal: { zh: "房", en: "RF" },
  },

  sections: {
    summary: {
      title: { zh: "摘要", en: "Summary" },
      kicker: {
        zh: "三份证据。不是「我做过什么」，是「我解决了什么、结果是多少、谁在用它」。",
        en: "Three proofs. Not what I worked on, but what I solved, what changed, and who uses it.",
      },
    },
    evidence: {
      title: { zh: "证据", en: "Evidence" },
      kicker: {
        zh: "六条数字，每条都带口径和时间。没有出处的数字不上这张表。",
        en: "Six numbers, each with its definition and date. No source, no row.",
      },
    },
    record: {
      title: { zh: "履历", en: "Record" },
      kicker: {
        zh: "四章，按「在哪解决什么问题」排，不按时间平铺。",
        en: "Four chapters, ordered by the problem solved — not by date.",
      },
    },
    ecosystem: {
      title: { zh: "生态", en: "Ecosystem" },
      kicker: {
        zh: "我在哪些组织里、以什么身份出现。客户与机构已按约定脱敏。",
        en: "Where I show up, and in what role. Client names are anonymised by agreement.",
      },
    },
    method: {
      title: { zh: "方法", en: "Method" },
      kicker: {
        zh: "四条能被执行、也能被反驳的工作原则。",
        en: "Four operating principles that can be executed — and argued with.",
      },
    },
    questions: {
      title: { zh: "议题", en: "Questions" },
      kicker: {
        zh: "三件我还在想的事。判断会过时，依据可以核对。",
        en: "Three things I'm still working out. Judgements age; the evidence can be checked.",
      },
    },
  },

  cases: [
    {
      n: "01",
      id: "freight",
      title: { zh: "货代报价与单证系统", en: "Freight quoting & documentation system" },
      org: { zh: "华南某国际货代 · 驻场交付（已脱敏）", en: "A South China freight forwarder · on-site (anonymised)" },
      problem: {
        zh: "报价靠人翻表格，单证靠人复粘，一天几百封邮件。",
        en: "Quotes meant digging through spreadsheets; documents meant copy-paste. Hundreds of emails a day.",
      },
      action: {
        zh: "驻场六周梳理全流程，先做报价与单证两个最耗人的环节，上线后跟着业务继续改。",
        en: "Six weeks on site mapping the workflow, then shipped the two heaviest steps first and kept iterating with the team.",
      },
      result: {
        zh: "运营效率提升 30%，同等人力可以多接订单；系统进入日常使用。",
        en: "30% more operating efficiency; the same headcount takes more orders. The system is now part of daily work.",
      },
      metric: "+30%",
      metricLabel: { zh: "客户运营效率", en: "client operating efficiency" },
      source: { zh: "客户项目 · 2026.08 结项 · 客户口径", en: "Client project · closed 2026.08 · client-reported" },
    },
    {
      n: "02",
      id: "linkathon",
      title: { zh: "Linkathon 黑客松组队社群", en: "Linkathon — a hackathon team-forming community" },
      org: { zh: "发起人 · 零投流", en: "Founder · zero paid acquisition" },
      problem: {
        zh: "想打黑客松的人，找不到队友。",
        en: "People who wanted to join a hackathon had no one to team up with.",
      },
      action: {
        zh: "把组队做成机制：接龙自我介绍 → 标签破冰 → 自由组队；再用最笨的人工运营把机制跑起来。",
        en: "Turned team-forming into a mechanism: roll-call intros, tag-based icebreaking, open teaming — then ran it with stubbornly manual operations.",
      },
      result: {
        zh: "1,700+ 人，国内同类头部；零商业的线下见面会，台风天仍有人跨城到场。",
        en: "1,700+ members, among the largest in China; a no-sponsor meetup still drew people across cities in a typhoon.",
      },
      metric: "1,700+",
      metricLabel: { zh: "社群成员", en: "community members" },
      source: { zh: "社群统计 · 2026.10", en: "Community stats · 2026.10" },
    },
    {
      n: "03",
      id: "game",
      title: { zh: "大隆盛游戏 · 首作上线 Steam", en: "Dalongsheng Games — first title on Steam" },
      org: { zh: "联合创始人 · 非技术带队", en: "Co-founder · non-technical lead" },
      problem: {
        zh: "八个人的小团队，没有人有发行经验，要做出一款能上线的游戏。",
        en: "An eight-person team, no publishing experience, and a game that had to actually ship.",
      },
      action: {
        zh: "搭 AI 研发管线（剧情 / 关卡 / 美术 / 程序），把项目管理压到一个人能扛。",
        en: "Built an AI production pipeline across narrative, levels, art and code, and kept project management within one person's reach.",
      },
      result: {
        zh: "首作 2025.06 上线 Steam：4 章 20 关、四语版本，100% 好评（10 篇评测，样本有限）。新作《昨日重现》进入抖音黑客松 top30。",
        en: "The first title shipped on Steam in 2025.06: four chapters, 20 levels, four languages, 100% positive across 10 reviews (a small sample). The next game placed top 30 in Douyin's hackathon.",
      },
      metric: "100%",
      metricLabel: { zh: "Steam 好评率（样本有限）", en: "positive rating (small sample)" },
      source: { zh: "Steam 商店页 · 2026.09 复核", en: "Steam store page · re-checked 2026.09" },
      href: "https://store.steampowered.com/app/3724560/",
    },
  ],

  metrics: [
    {
      value: "1,700+",
      label: { zh: "Linkathon 社群成员，零投流", en: "Linkathon members, zero paid acquisition" },
      source: { zh: "社群统计 · 2026.10", en: "Community stats · 2026.10" },
    },
    {
      value: "400",
      label: { zh: "3 天做到 400 人，零投流", en: "400 members in three days, zero paid acquisition" },
      source: { zh: "社群增长记录 · 2026.07", en: "Community growth log · 2026.07" },
    },
    {
      value: "+30%",
      label: { zh: "驻场客户运营效率", en: "operating efficiency at the client" },
      source: { zh: "客户项目 · 2026.08", en: "Client project · 2026.08" },
    },
    {
      value: "832",
      label: { zh: "美食地图上线收录商户（快照）", en: "merchants on the food map at launch (snapshot)" },
      source: { zh: "wuhan-food-map · 2026.08 快照", en: "wuhan-food-map · 2026.08 snapshot" },
      href: "https://github.com/Robin-fang611/wuhan-food-map",
    },
    {
      value: "150 万+",
      label: {
        zh: "实习期团队私域 GMV",
        en: "team private-domain GMV during my internship",
      },
      source: { zh: "同创教育 · 2025.09 · 本人记录", en: "Tongchuang Education · 2025.09 · self-reported" },
    },
    {
      value: "8 人",
      label: { zh: "非技术背景带队的游戏团队规模", en: "game team size, led without a technical background" },
      source: { zh: "大隆盛游戏 · 2026", en: "Dalongsheng Games · 2026" },
    },
  ],

  record: [
    {
      n: "I",
      title: { zh: "企业交付 · 驻场", en: "Client delivery · on site" },
      entries: [
        {
          when: { zh: "2026 – 至今", en: "2026 – now" },
          org: { zh: "云天远略（深圳）", en: "Yuntian Yuanlve (Shenzhen)" },
          role: { zh: "合伙人", en: "Partner" },
          points: [
            {
              zh: "以驻场合伙人的形态，把 AI 能力带进客户的真实业务与营销场景。",
              en: "Work as an on-site partner, bringing AI into real operations and marketing.",
            },
            {
              zh: "客户是 40 人级的货代公司，没有技术团队；系统上线后进入日常使用。",
              en: "The client is a 40-person freight forwarder with no engineering team; the system is now part of daily work.",
            },
          ],
        },
        {
          when: { zh: "2026.05 – 08", en: "2026.05 – 08" },
          org: { zh: "华南某国际货代", en: "A South China freight forwarder" },
          role: { zh: "项目制合作 · 驻场交付", en: "Project partner · on-site delivery" },
          points: [
            {
              zh: "梳理报价、单证全流程，系统上线后进入日常使用。",
              en: "Mapped the full quoting and documentation workflow; the system is now used daily.",
            },
            {
              zh: "运营效率提升 30%，同等人力可多接订单。",
              en: "30% efficiency gain, more orders at the same headcount.",
            },
          ],
        },
      ],
    },
    {
      n: "II",
      title: { zh: "社群与生态", en: "Community & ecosystem" },
      entries: [
        {
          when: { zh: "2026.07 – 至今", en: "2026.07 – now" },
          org: { zh: "Linkathon", en: "Linkathon" },
          role: { zh: "早期共建者", en: "Early co-builder" },
          points: [
            {
              zh: "三大圈层 1,700+ 人：3 天 400 人、4 周 1,000 人、三个月 1,700+，零投流。",
              en: "1,700+ members across three circles: 400 in three days, 1,000 in four weeks, 1,700+ in three months — zero paid acquisition.",
            },
            {
              zh: "接龙 → 标签破冰 → 自由组队的机制流水线；零商业线下见面会。",
              en: "A mechanism pipeline from roll-call to tag-based icebreaking to open teaming; a sponsor-free meetup.",
            },
          ],
        },
        {
          when: { zh: "2026 – 至今", en: "2026 – now" },
          org: { zh: "Realize 具现", en: "Realize" },
          role: { zh: "发起人 · 武汉主理人", en: "Founder · Wuhan lead" },
          points: [
            {
              zh: "武汉发起、辐射全国的 AI 活动与资源对接平台，不绑定单一高校。",
              en: "An AI events and matchmaking platform started in Wuhan, national in reach, not tied to one campus.",
            },
            {
              zh: "财大 AI 社团作为校内落地端口，正在筹备。",
              en: "A campus AI club at ZUEL is being set up as the on-campus port.",
            },
          ],
        },
        {
          when: { zh: "2026.04 – 05", en: "2026.04 – 05" },
          org: { zh: "抖音校园 AI 创变者计划 · 校园赛", en: "Douyin Campus AI Changemaker · campus edition" },
          role: { zh: "站点负责人", en: "Campus lead" },
          points: [
            {
              zh: "独立操盘百人校园黑客松，谈下平台独家赞助。",
              en: "Ran a 100-person campus hackathon end to end and secured exclusive platform sponsorship.",
            },
            {
              zh: "联动武汉 10+ 高校社团，曝光 5 万+，现场产出 30+ 件作品。",
              en: "Worked with 10+ university clubs in Wuhan; 50k+ impressions and 30+ projects built on site.",
            },
          ],
        },
      ],
    },
    {
      n: "III",
      title: { zh: "游戏", en: "Games" },
      entries: [
        {
          when: { zh: "2025.05 – 至今", en: "2025.05 – now" },
          org: { zh: "大隆盛游戏", en: "Dalongsheng Games" },
          role: { zh: "联合创始人", en: "Co-founder" },
          points: [
            {
              zh: "非技术背景带 8 人团队，首作《浮华工造·千机百炼》上线 Steam。",
              en: "Led an eight-person team without a technical background; the first title shipped on Steam.",
            },
            {
              zh: "搭 AI 研发管线：研发效率 +40%，交付周期 -25%。",
              en: "Built an AI production pipeline: +40% production efficiency, -25% delivery cycle.",
            },
            {
              zh: "新作《昨日重现》以阿尔茨海默照护为题，进入抖音黑客松 top30。",
              en: "The next title, on Alzheimer's care, placed top 30 in Douyin's hackathon.",
            },
          ],
        },
      ],
    },
    {
      n: "IV",
      title: { zh: "早期与校园", en: "Earlier & campus" },
      collapsed: true,
      entries: [
        {
          when: { zh: "2025.07 – 09", en: "2025.07 – 09" },
          org: { zh: "武汉同创教育（金领学社）", en: "Wuhan Tongchuang Education" },
          role: { zh: "市场营销实习", en: "Marketing intern" },
          points: [
            {
              zh: "单周建成 500 人、精准度 85% 的核心社群，私域累计 3,000+。",
              en: "Built a 500-person core community in one week at 85% targeting accuracy; 3,000+ in the private domain.",
            },
            {
              zh: "设计「引流 → 培育 → 转化」链路，团队私域 GMV 150 万+。",
              en: "Designed the acquisition-to-conversion chain behind 1.5M+ RMB in team GMV.",
            },
          ],
        },
        {
          when: { zh: "2025.06 – 08", en: "2025.06 – 08" },
          org: { zh: "苏州丛蓉零点壹号创投", en: "Suzhou Congrong VC" },
          role: { zh: "合伙人助理", en: "Partner's assistant" },
          points: [
            {
              zh: "从 0 搭建社媒项目池获取体系，拓展 60+ 早期 AI 项目。",
              en: "Built a social-media sourcing system from scratch; 60+ early-stage AI projects mapped.",
            },
            {
              zh: "项目对接周期从 90 天压缩到 45 天。",
              en: "Cut the deal introduction cycle from 90 to 45 days.",
            },
          ],
        },
        {
          when: { zh: "2024.09 – 2028.06", en: "2024.09 – 2028.06" },
          org: { zh: "中南财经政法大学 · 市场营销", en: "Zhongnan University of Economics and Law · Marketing" },
          role: { zh: "本科在读 · 2028 届", en: "Undergraduate · class of 2028" },
          points: [
            {
              zh: "FMA 国际金融管理协会上届会长，任内推动协会的 AI 转型。",
              en: "Former president of the FMA finance association; led its AI transition.",
            },
            {
              zh: "中国国际大学生创新大赛国家级银奖（AI 生涯规划平台产品设计）。",
              en: "National silver award, China International College Students' Innovation Competition (AI career-planning product).",
            },
          ],
        },
        {
          when: { zh: "2025 – 2026", en: "2025 – 2026" },
          org: { zh: "世界 500 强校园俱乐部", en: "Fortune 500 campus club" },
          role: { zh: "主席", en: "President" },
          points: [
            {
              zh: "统筹路演、对接 10+ 投资机构；主导撰写政府侧申报材料与商业计划书。",
              en: "Ran roadshows and worked with 10+ investors; led government filings and the business plan.",
            },
            {
              zh: "支撑项目完成 100 万元天使轮融资。",
              en: "Supported a 1M RMB angel round.",
            },
          ],
        },
      ],
    },
  ],

  ecosystem: {
    roles: [
      {
        name: { zh: "云天远略（深圳）", en: "Yuntian Yuanlve (Shenzhen)" },
        role: { zh: "合伙人", en: "Partner" },
        line: {
          zh: "用驻场的方式为企业交付 AI 升级，项目制、按结果结算。",
          en: "On-site AI delivery for businesses: project-based, paid on outcomes.",
        },
        since: { zh: "2026 – 至今", en: "2026 – now" },
      },
      {
        name: { zh: "Realize 具现", en: "Realize" },
        role: { zh: "发起人 · 武汉主理人", en: "Founder · Wuhan lead" },
        line: {
          zh: "AI 活动执行与资源对接平台，不绑定单一高校。",
          en: "An AI events and matchmaking platform, not tied to a single campus.",
        },
        since: { zh: "2026 – 至今", en: "2026 – now" },
      },
      {
        name: { zh: "Linkathon", en: "Linkathon" },
        role: { zh: "早期共建者", en: "Early co-builder" },
        line: {
          zh: "黑客松组队社群，零投流 1,700+ 人。",
          en: "A hackathon team-forming community: 1,700+ members, zero paid acquisition.",
        },
        since: { zh: "2026.07 – 至今", en: "2026.07 – now" },
      },
      {
        name: { zh: "大隆盛游戏", en: "Dalongsheng Games" },
        role: { zh: "联合创始人", en: "Co-founder" },
        line: {
          zh: "8 人独立游戏团队，首作已上 Steam。",
          en: "An eight-person indie studio; the first title is live on Steam.",
        },
        since: { zh: "2025.05 – 至今", en: "2025.05 – now" },
      },
    ],
    partnersLabel: { zh: "合作过", en: "Worked with" },
    partners: ["Datawhale", "武汉开源聚变人工智能研究院", "模态空间", "观猹"],
  },

  method: [
    {
      n: "01",
      title: { zh: "先驻场，再谈方案", en: "Go on site before proposing" },
      body: {
        zh: "不到现场，看到的都是别人想让你看到的流程。",
        en: "Off site, you only see the process someone chose to show you.",
      },
    },
    {
      n: "02",
      title: { zh: "先量基线，再谈 ROI", en: "Measure the baseline before the ROI" },
      body: {
        zh: "没有基线的「效率提升」都是自嗨。",
        en: "An efficiency claim without a baseline is self-congratulation.",
      },
    },
    {
      n: "03",
      title: { zh: "用机制代替人力", en: "Replace manpower with mechanisms" },
      body: {
        zh: "组队、内容、交付都做成流水线，系统自己转，人不盯着。",
        en: "Teaming, content and delivery become pipelines that run without someone watching.",
      },
    },
    {
      n: "04",
      title: { zh: "把 AI 当镜子，不当裁判", en: "Use AI as a mirror, not a judge" },
      body: {
        zh: "关键判断主动找反方意见，不听顺耳的。",
        en: "On decisions that matter, actively look for the opposing view.",
      },
    },
  ],

  questions: [
    {
      n: "a",
      title: { zh: "AI 应用的价值在编排层", en: "The value of AI apps sits in orchestration" },
      body: {
        zh: "模型会商品化，护城河在工作流、数据和组织习惯。所以我把赌注放在交付，而不是模型。",
        en: "Models commoditise; the moat is in workflows, data and habits. So I bet on delivery, not on models.",
      },
    },
    {
      n: "b",
      title: { zh: "一人公司不是情怀，是分工变了", en: "The one-person company is a change in division of labour" },
      body: {
        zh: "OpenAI 分析 80 万条工作消息：43.5% 的岗位查询在干另一个职业的活，交叉最密处正是营销 × 工程。",
        en: "OpenAI's analysis of 800k work messages found 43.5% of job queries doing another profession's work — densest at marketing × engineering.",
      },
    },
    {
      n: "c",
      title: { zh: "获客入口正在换底层", en: "Acquisition is changing at the infrastructure level" },
      body: {
        zh: "AI 搜索结果页出现率一年内从 15% 到 43%，竞争从「我排第几」变成「AI 会不会引用我」。",
        en: "Appearance in AI answer pages rose from 15% to 43% in a year. The contest moved from ranking to being cited.",
      },
    },
  ],

  contact: {
    title: { zh: "一起把 AI 用到", en: "Let's put AI where" },
    title2: { zh: "有人真的在用的地方。", en: "people actually use it." },
    lead: {
      zh: "我在武汉和深圳两地，大三在读（2028 届）。下面三类事，任意一类都可以直接找我；不确定算哪类，也可以先聊 20 分钟。",
      en: "I split my time between Wuhan and Shenzhen, finishing my degree in 2028. Any of the three below is a good reason to reach out — or just take 20 minutes if you're not sure which.",
    },
    items: [
      {
        label: { zh: "合作 · 驻场交付", en: "Work with me · on-site delivery" },
        text: {
          zh: "传统企业（物流、制造、专业服务）想把 AI 落进流程，需要有人到现场把方案做成能用的系统。",
          en: "A traditional business (logistics, manufacturing, professional services) needs someone on site to turn AI into a working system.",
        },
      },
      {
        label: { zh: "工作 · 增长 / 产品", en: "Hiring · growth / product" },
        text: {
          zh: "AI 应用公司需要能同时听懂业务和产品的人；可实习，也可以谈更长期的合作。",
          en: "An AI product company needs someone who speaks both business and product. Internships or longer-term roles.",
        },
      },
      {
        label: { zh: "社群 · 活动与内容", en: "Community · events & content" },
        text: {
          zh: "黑客松、校园 AI 活动、开发者社群的内容与资源合作。",
          en: "Hackathons, campus AI events, developer community content and partnerships.",
        },
      },
    ],
    emailLabel: { zh: "邮箱", en: "Email" },
    note: { zh: "通常 24 小时内回复。", en: "I usually reply within 24 hours." },
  },


  opensource: [
    {
      name: "world-sage",
      href: "https://github.com/Robin-fang611/world-sage",
      desc: {
        zh: "检索增强的智能体预设：世界知识 72.5% → 82.5%（CulturalBench，仓库自报）",
        en: "A retrieval-augmented agent preset: world knowledge 72.5% → 82.5% (CulturalBench, repo-reported)",
      },
    },
    {
      name: "vision-bridge-hook",
      href: "https://github.com/Robin-fang611/vision-bridge-hook",
      desc: {
        zh: "给 DeepSeek 装上眼睛：自动触发的视觉桥接 Hook",
        en: "Eyes for DeepSeek: an auto-triggered vision bridge hook",
      },
    },
    {
      name: "wuhan-food-map",
      href: "https://github.com/Robin-fang611/wuhan-food-map",
      desc: {
        zh: "武汉美食地图：财大周边 + 全城，在线运行",
        en: "A Wuhan food map: campus and city-wide, running live",
      },
    },
    {
      name: "echoes-of-yesterday",
      href: "https://github.com/Robin-fang611/echoes-of-yesterday",
      desc: {
        zh: "阿尔茨海默照护题材的叙事互动游戏",
        en: "A narrative game about Alzheimer's care",
      },
    },
  ],

  footer: {
    rights: { zh: "© 2026 房钰斌 Robin", en: "© 2026 Robin Fang" },
    source: { zh: "源码", en: "Source" },
  },
};
