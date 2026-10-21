# 卷宗 RB-2026 · Robin 的个人主页

把个人主页做成一份可以逐条核对的卷宗：先给结论，再给证据，最后给下一步。中英双语，静态生成，零运行时依赖。

线上：<https://robin-fang611.github.io/> · English: <https://robin-fang611.github.io/en/>

---

## 快速开始

```bash
npm run build   # 生成 index.html / en/index.html / 404.html / sitemap ...
npm run serve   # http://127.0.0.1:4173（被占用可传端口：npm run serve -- 4180）
```

> 需要 Node 18+。构建只用 Node 内置模块，没有 npm 依赖。

## 目录

```
src/
  content/site.mjs      唯一事实源：文案、数字、链接、中英字段
  render/page.mjs       渲染层：组件函数 + 页面骨架 + meta/JSON-LD
  styles/tokens.css     颜色、字阶、间距、动效、版心
  styles/base.css       重置、纸张、版心、跳过导航
  styles/components.css 印章、标签、按钮、顶栏、目录、dialog
  styles/sections.css   封面、章节、案例、证据、履历、生态、联系、打印
  client/site.js        运行时：进度、当前章节、目录弹层、复制邮箱、语言切换
  assets/favicon.svg
  og/og.html            OG 图模板（1200×630）
build.mjs               构建脚本
tools/serve.mjs         本地预览
tools/frontend-review/  评审器（Playwright，devDependency）
docs/                   命题、设计系统、ADR、评审、变更日志
index.html / en/ / assets/   构建产物（需提交，GitHub Pages 直接用）
```

## 改内容

只改 `src/content/site.mjs`，然后 `npm run build`。

- 文字：每个字段是 `{ zh, en }`，中英各一份。
- 数字：必须带口径与时间，并在 `source` 里给出处。规则见 `docs/decisions/ADR-006-routing-and-claims.md`。
- 加章节：写一个渲染函数 → 在 `renderPage` 里登记 → 在 `nav` 加一条。
- 语言：中英共用一份数据，不允许只改一边。

## 改视觉

只改 `src/styles/tokens.css` 的值；组件里不写死 px。当前约束：

- 字阶 6 档、字体 2 族、色相 3 个、圆角 1 档、间距 10 档
- 正文对比度 ≥4.5:1，大字 ≥3:1
- 动效 <600ms，且内容默认可见（不靠 opacity:0 入场）

## 评审

```bash
cd tools/frontend-review && npm i   # 仅首次
node review.mjs http://127.0.0.1:4173/ https://robin-fang611.github.io/   # 新版 vs 旧版
```

评审器依赖本机 Chrome（`channel: "chrome"`），不下载 Chromium。最新结论见 `docs/reviews/2026-10-21-v2.0.md`。

## 部署

GitHub Pages 从 `main` 分支根目录发布：

1. `npm run build`
2. 提交 `index.html`、`en/`、`assets/`、`404.html`、`sitemap.xml`、`robots.txt`、`.nojekyll`
3. push 到 `main`

`.nojekyll` 必须保留，否则 `en/` 目录和带下划线的文件会被 Jekyll 处理。

## 文档

- `docs/product.md` — 苏格拉底式盘问、命题、信息架构、内容规则
- `docs/profile-readme-rationale.md` — GitHub Profile README 的苏格拉底式整理
- `docs/design-system.md` — token、组件、状态、动效、无障碍
- `docs/decisions/` — 6 条 ADR
- `docs/reviews/` — 评审记录与并排对比
- `docs/changelog.md` — 版本变更

## 许可

文案与个人资料归房钰斌所有；代码可参考，事实请以页面标注的出处为准。
