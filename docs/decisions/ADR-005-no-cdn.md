# ADR-005 · 不加载网络字体与第三方脚本

- 日期：2026-10-21
- 状态：已采纳

## 背景

旧版从 jsDelivr 加载 LXGW WenKai、Lenis，从 Google Fonts 加载 Playfair Display 与 IBM Plex Mono。三类资源在国内网络下经常超时：字体回退导致版式跳动，Lenis 失败则静默降级。

## 决定

- 不加载任何网络字体，使用系统字体栈：
  - 标题/数字：`"Songti SC", "STSong", "Noto Serif SC", "SimSun", serif`
  - 正文：`-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`
- 不加载任何第三方 JS；运行时只有 3.5KB 自写的 `site.js`。
- 不引入图片：页面视觉由文字、细线、SVG 墨线、CSS 印块构成（OG 图除外）。

## 取舍

- 得到：首屏 3 个请求、无 FOIT/FOUT、无 CDN 依赖、国内访问稳定。
- 放弃：特定字体的绝对还原。宋体/黑体在 macOS 与 Windows 上都能落到可用字体。

## 后果

- 新组件不得引入 `@import`、`<link href="https://...">` 或第三方脚本。
- 字体族数量上限 2（评审器阈值），新增字体需先改本 ADR。
