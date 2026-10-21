# ADR-001 · 内容单源 + 静态生成，不引入前端框架

- 日期：2026-10-21
- 状态：已采纳

## 背景

旧站是一个 670 行的单文件 HTML + 另一个 40KB 的 `en.html`。内容、结构、样式、动效全部混在一起：改一句文案要改两处，换一次视觉要重写整页。2026-10 核对时，站点与 GitHub Profile 的事实已经互相矛盾（客户、头衔、社群规模）。

## 决定

- 建立 `src/content/site.mjs` 作为唯一事实源，中英字段写在同一个对象里。
- `src/render/page.mjs` 是纯函数渲染层；`build.mjs` 用 Node 内置模块生成 `index.html`、`en/index.html`、`404.html`、`sitemap.xml`、`robots.txt`。
- CSS 按 tokens / base / components / sections 拆分，构建时拼成一个文件。
- 不引入 React/Vite/Tailwind：这个站点只有 8 个区块、没有客户端状态、没有数据请求，框架只会增加构建与维护成本。

## 取舍

- 得到：一条命令构建、零运行时依赖、无 CDN、GitHub Pages 直接可用；中英共享一套事实。
- 放弃：组件热更新、生态插件。对一个人的静态主页，这些不重要。

## 后果

- 改事实 → 改 `site.mjs` → `npm run build`。
- 加章节 → 写一个渲染函数、在 `renderPage` 里登记、加一条 `nav`。
- 构建产物（`index.html`、`en/`、`assets/`）直接提交，GitHub Pages 不需要 CI。
