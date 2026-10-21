#!/usr/bin/env node
/**
 * frontend-review v0.1 — 渲染 → 测量 → 分析 → 报告
 *
 * 用法:
 *   node src/review.mjs <url> [refUrl]
 *
 * 设计依据（开源范式）:
 *   - 规则分级: Front-End Checklist (Critical/High/Medium/Low)
 *   - token 维度: W3C Design Tokens (color/dimension/fontFamily/fontWeight)
 *   - 评审方式: Design Critique 的并排对比 + 参数级诊断
 */
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";

const url = process.argv[2];
const refUrl = process.argv[3];
if (!url) {
  console.error("usage: node src/review.mjs <url> [refUrl]");
  process.exit(1);
}

const slug = (s) =>
  s.replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60) ||
  "page";
const outDir = path.resolve("out", `${slug(url)}-${Date.now().toString(36)}`);
await fs.mkdir(outDir, { recursive: true });

const toUrl = (u) => (u.startsWith("http") ? u : pathToFileURL(path.resolve(u)).href);

async function capture(browser, target, label) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const consoleErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });
  await page.goto(toUrl(target), { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1500);
  // 让懒加载/字体稳定
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(300);

  const viewportPath = path.join(outDir, `${label}-viewport.png`);
  const fullPath = path.join(outDir, `${label}-full.png`);
  await page.screenshot({ path: viewportPath });
  await page.screenshot({ path: fullPath, fullPage: true });

  const data = await page.evaluate(() => {
    const visible = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (
        r.width > 2 &&
        r.height > 2 &&
        s.visibility !== "hidden" &&
        s.display !== "none" &&
        s.opacity !== "0"
      );
    };
    const els = [...document.querySelectorAll("body *")].filter(visible);
    const styles = els.map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const ownText = [...el.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent)
        .join("")
        .trim();
      return {
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 120),
        text: ownText.slice(0, 80),
        fontSize: parseFloat(s.fontSize) || 0,
        fontWeight: s.fontWeight,
        fontFamily: (s.fontFamily || "").split(",")[0].replace(/["']/g, "").trim(),
        lineHeight: s.lineHeight === "normal" ? null : parseFloat(s.lineHeight),
        letterSpacing: s.letterSpacing,
        color: s.color,
        bg: s.backgroundColor,
        borderColor: s.borderColor,
        borderRadius: s.borderRadius,
        boxShadow: s.boxShadow,
        padding: [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(parseFloat),
        margin: [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft].map(parseFloat),
        gap: s.gap,
        rect: {
          x: +r.x.toFixed(1),
          y: +(r.y + scrollY).toFixed(1),
          w: +r.width.toFixed(1),
          h: +r.height.toFixed(1),
        },
        isText: ownText.length > 0 && el.children.length === 0,
      };
    });

    const bgOf = (el) => {
      let n = el;
      while (n) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
        n = n.parentElement;
      }
      return "rgb(255, 255, 255)";
    };

    // 文本元素的背景色（用于对比度）
    const textNodes = els
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          [...el.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent.trim().length > 1
          ) && r.width > 4 && r.height > 4
        );
      })
      .slice(0, 600)
      .map((el) => {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          text: el.textContent.trim().slice(0, 60),
          fontSize: parseFloat(s.fontSize),
          fontWeight: s.fontWeight,
          color: s.color,
          bg: bgOf(el),
          rect: { x: r.x, y: r.y + scrollY, w: r.width, h: r.height },
        };
      });

    const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: +h.tagName[1],
      text: h.textContent.trim().slice(0, 60),
    }));

    const interactive = [...document.querySelectorAll("a,button,input,select,textarea,[role=button]")].map(
      (el) => {
        const s = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
          label: el.getAttribute("aria-label") || "",
          outline: s.outlineStyle,
          cursor: s.cursor,
        };
      }
    );

    const bodyText = document.body.innerText || "";
    return {
      title: document.title,
      lang: document.documentElement.lang,
      viewport: { w: innerWidth, h: innerHeight },
      doc: {
        w: document.documentElement.scrollWidth,
        h: document.documentElement.scrollHeight,
      },
      counts: { elements: els.length, textNodes: textNodes.length },
      styles,
      textNodes,
      headings,
      interactive,
      bodyText: bodyText.slice(0, 4000),
      hasEmptyState: /暂无|没有数据|空|empty|no data/i.test(bodyText),
      hasLoadingState: /加载|loading|skeleton|骨架/i.test(document.documentElement.innerHTML),
      hasErrorState: /出错|错误|失败|error|retry|重试/i.test(document.documentElement.innerHTML),
      hasFocusStyles: [...document.styleSheets].every(() => true), // 占位，后续用交互检测
    };
  });
  await page.close();
  return { ...data, screenshot: { viewportPath, fullPath }, consoleErrors };
}

// ---------- 分析 ----------
const R = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const uniq = (a) => [...new Set(a)];

function parseColor(c) {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(",").map((x) => parseFloat(x));
  return { r, g, b, a };
}
function lum({ r, g, b }) {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const l1 = lum(a),
    l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function hue(c) {
  const { r, g, b } = c;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  if (d === 0) return null;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  return h < 0 ? h + 360 : h;
}
function sat({ r, g, b }) {
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    l = (max + min) / 2;
  if (max === min) return 0;
  return (max - min) / (l > 0.5 ? 2 - max / 255 - min / 255 : max / 255 + min / 255);
}

function analyze(d) {
  const issues = [];
  const add = (severity, category, title, detail, fix) =>
    issues.push({ severity, category, title, detail, fix });

  const fontSizes = uniq(d.styles.map((s) => R(s.fontSize, 1)).filter((n) => n > 0)).sort(
    (a, b) => a - b
  );
  const fontFamilies = uniq(d.styles.map((s) => s.fontFamily).filter(Boolean));
  const fontWeights = uniq(d.styles.map((s) => s.fontWeight)).sort();

  // 字号阶梯
  if (fontSizes.length > 6)
    add("high", "比例", `字号种类过多（${fontSizes.length} 种）`, fontSizes.join(" / "), "收敛到 5–6 档，用固定比率（1.25 或 1.333）生成");
  const ratios = [];
  for (let i = 1; i < fontSizes.length; i++) ratios.push(R(fontSizes[i] / fontSizes[i - 1]));
  const ladderLike = ratios.length >= 3 && ratios.slice(1).every((r) => Math.abs(r - ratios[0]) < 0.08);
  if (ratios.length >= 3 && !ladderLike)
    add("medium", "比例", "字号阶梯不成体系", `相邻比值 ${ratios.join(" / ")}`, "固定一个比率生成全阶梯，避免 15/17/19 这类随手值");

  // 字体族
  if (fontFamilies.length > 2)
    add("high", "字体", `字体族过多（${fontFamilies.length} 种）`, fontFamilies.join(" / "), "通常 1–2 族足够：一个有性格的标题 + 一个中性正文");

  // 字重
  if (fontWeights.length > 4)
    add("medium", "字体", `字重种类过多（${fontWeights.length} 种）`, fontWeights.join(" / "), "收敛到 400/500/600 三档；避免 300 以下");

  // 间距体系
  const spacing = [];
  const pushSp = (v) => { if (v >= 2 && v <= 200 && Number.isInteger(v)) spacing.push(v); };
  for (const s of d.styles) {
    for (const v of [...s.padding, ...s.margin]) pushSp(v);
    if (s.gap && s.gap !== "normal") s.gap.split(" ").forEach((g) => pushSp(parseFloat(g)));
  }
  const spacingUniq = uniq(spacing).sort((a, b) => a - b);
  const offGrid = spacingUniq.filter((v) => v % 2 !== 0);
  if (spacingUniq.length > 10)
    add("high", "节奏", `间距档位过多（${spacingUniq.length} 种）`, spacingUniq.slice(0, 20).join(" / "), "收敛到 4/8/16/24/32/48/64 这类固定档位");
  if (offGrid.length > 3)
    add("medium", "节奏", `存在非偶数/非 4 倍间距（${offGrid.length} 个）`, offGrid.slice(0, 15).join(" / "), "统一到 4 的倍数；奇数间距会让对齐出现半像素错位");

  // 颜色
  const colors = uniq(
    d.styles
      .flatMap((s) => [s.color, s.bg, s.borderColor])
      .filter((c) => c && (c.match(/rgb/g) || []).length === 1 && !c.includes("rgba(0, 0, 0, 0)"))
  );
  const chromatic = colors
    .map(parseColor)
    .filter(Boolean)
    .filter((c) => sat(c) > 0.15 && lum(c) > 0.02 && lum(c) < 0.95);
  const hueVals = chromatic.map(hue).filter((h) => h !== null).sort((a, b) => a - b);
  const hueClusters = [];
  for (const h of hueVals) {
    const last = hueClusters[hueClusters.length - 1];
    if (!last || h - last.max > 15) hueClusters.push({ min: h, max: h, items: [h] });
    else { last.max = h; last.items.push(h); }
  }
  const hues = hueClusters.map((c) => Math.round(c.items.reduce((a, b) => a + b, 0) / c.items.length));
  if (hues.length > 4)
    add("high", "色彩", `色相过多（${hues.length} 个）`, hues.join("° / ") + "°", "主色 + 1 个强调色 + 中性色即可；超过 3 个色相很难和谐");
  if (colors.length > 16)
    add("medium", "色彩", `颜色值过多（${colors.length} 个）`, colors.slice(0, 24).join(" | "), "把颜色收敛成 token：主色/强调/中性/语义色");

  // 对比度
  let lowContrast = 0;
  const worst = [];
  for (const t of d.textNodes) {
    const fg = parseColor(t.color),
      bg = parseColor(t.bg);
    if (!fg || !bg) continue;
    const c = contrast(fg, bg);
    const large = t.fontSize >= 24 || (t.fontSize >= 18.66 && Number(t.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    if (c < min) {
      lowContrast++;
      worst.push({ text: t.text, ratio: R(c), fontSize: t.fontSize });
    }
  }
  if (lowContrast > 0)
    add("critical", "色彩", `对比度不足（${lowContrast} 处）`, worst.slice(0, 5).map((w) => `「${w.text}」${w.ratio}:1 @${w.fontSize}px`).join("；"), "正文 ≥4.5:1，大字 ≥3:1（WCAG AA）");

  // 圆角 / 阴影
  const radii = uniq(d.styles.map((s) => s.borderRadius).filter((r) => r && r !== "0px"));
  if (radii.length > 4)
    add("medium", "统一", `圆角种类过多（${radii.length} 种）`, radii.join(" / "), "收敛到 1–2 档（如 8/16 或全 0）");
  const shadows = uniq(d.styles.map((s) => s.boxShadow).filter((v) => v && v !== "none"));
  if (shadows.length > 4)
    add("medium", "统一", `阴影种类过多（${shadows.length} 种）`, `${shadows.length} 种`, "收敛成 2–3 档 elevation；阴影颜色跟主色调，不要纯黑透明");

  // 对齐线
  const xs = d.styles.filter((s) => s.isText).map((s) => Math.round(s.rect.x));
  const xCount = xs.reduce((m, x) => ((m[x] = (m[x] || 0) + 1), m), {});
  const lines = Object.entries(xCount)
    .filter(([, n]) => n >= 3)
    .map(([x]) => +x)
    .sort((a, b) => a - b);
  if (lines.length > 6)
    add("high", "节奏", `左对齐线过多（${lines.length} 条）`, `x = ${lines.slice(0, 12).join(", ")}`, "内容区只保留 2–3 条对齐线；其他元素吸附到网格");

  // 标题层级
  const h1 = d.headings.filter((h) => h.level === 1).length;
  if (h1 === 0) add("medium", "结构", "缺少 h1", "页面没有一级标题", "每页一个 h1，表达页面主题");
  if (h1 > 1) add("medium", "结构", `h1 重复（${h1} 个）`, d.headings.filter((h) => h.level === 1).map((h) => h.text).join(" | "), "一个页面只保留一个 h1");
  const jumps = d.headings.filter((h, i) => i > 0 && h.level - d.headings[i - 1].level > 1);
  if (jumps.length) add("medium", "结构", `标题跳级（${jumps.length} 处）`, jumps.map((h) => `h${h.level} ${h.text}`).join(" | "), "层级按 h1→h2→h3 递进，不要跳级");

  // 完成度
  if (!d.hasEmptyState) add("low", "完成度", "未发现空态", "列表/搜索等场景可能缺空态", "空态给出创建入口或模板，而不是一片空白");
  if (!d.hasLoadingState) add("low", "完成度", "未发现加载态", "异步数据场景可能缺骨架/进度", "用骨架屏或进度指示，避免布局跳动");
  if (!d.hasErrorState) add("low", "完成度", "未发现错误态", "失败场景可能没有兜底", "错误态给出原因、重试和下一步");

  // 交互可访问性
  const noLabel = d.interactive.filter((i) => (i.tag === "button" || i.tag === "a") && !i.text && !i.label);
  if (noLabel.length) add("high", "无障碍", `${noLabel.length} 个交互元素没有可读名称`, noLabel.slice(0, 5).map((i) => i.tag).join(", "), "图标按钮必须加 aria-label");

  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);

  return {
    fontSizes,
    fontFamilies,
    fontWeights,
    spacingUniq,
    colors,
    hues,
    radii,
    shadows,
    alignLines: lines,
    issues,
  };
}

// ---------- 报告 ----------
function report(d, a, refData, refA) {
  const sevLabel = { critical: "🔴 Critical", high: "🟠 High", medium: "🟡 Medium", low: "⚪ Low" };
  const lines = [];
  lines.push(`# 前端评审报告：${d.title || "(无标题)"}`);
  lines.push("");
  lines.push(`- 页面：\`${url}\``);
  lines.push(`- 视口：${d.viewport.w}×${d.viewport.h} · 文档：${d.doc.w}×${d.doc.h}`);
  lines.push(`- 可见元素：${d.counts.elements} · 文本节点：${d.counts.textNodes}`);
  lines.push(`- 截图：\`${path.basename(d.screenshot.viewportPath)}\` / \`${path.basename(d.screenshot.fullPath)}\``);
  lines.push("");
  lines.push("## 设计 token 提取");
  lines.push("");
  lines.push(`- **字体族**：${a.fontFamilies.join(" / ") || "—"}`);
  lines.push(`- **字号阶梯**：${a.fontSizes.join(" / ")}`);
  lines.push(`- **字重**：${a.fontWeights.join(" / ")}`);
  lines.push(`- **间距档位**：${a.spacingUniq.slice(0, 24).join(" / ")}`);
  lines.push(`- **色值数**：${a.colors.length} · **色相数**：${a.hues.length}（${a.hues.join("°, ")}°）`);
  lines.push(`- **圆角**：${a.radii.join(" / ") || "—"}`);
  lines.push(`- **阴影**：${a.shadows.length} 种`);
  lines.push(`- **左对齐线**：${a.alignLines.length} 条`);
  lines.push("");
  lines.push("## 问题清单");
  lines.push("");
  if (!a.issues.length) lines.push("未发现参数级问题。");
  for (const i of a.issues) {
    lines.push(`### ${sevLabel[i.severity]} · [${i.category}] ${i.title}`);
    lines.push("");
    lines.push(`- **观测**：${i.detail}`);
    lines.push(`- **修法**：${i.fix}`);
    lines.push("");
  }
  if (refData && refA) {
    lines.push("## 与参照页对比");
    lines.push("");
    lines.push("| 指标 | 当前 | 参照 |");
    lines.push("|---|---|---|");
    lines.push(`| 字号种类 | ${a.fontSizes.length} | ${refA.fontSizes.length} |`);
    lines.push(`| 字体族 | ${a.fontFamilies.length} | ${refA.fontFamilies.length} |`);
    lines.push(`| 字重 | ${a.fontWeights.length} | ${refA.fontWeights.length} |`);
    lines.push(`| 间距档位 | ${a.spacingUniq.length} | ${refA.spacingUniq.length} |`);
    lines.push(`| 色相数 | ${a.hues.length} | ${refA.hues.length} |`);
    lines.push(`| 圆角种类 | ${a.radii.length} | ${refA.radii.length} |`);
    lines.push(`| 左对齐线 | ${a.alignLines.length} | ${refA.alignLines.length} |`);
    lines.push(`| 问题数 | ${a.issues.length} | ${refA.issues.length} |`);
    lines.push("");
  }
  return lines.join("\n");
}

// ---------- 主流程 ----------
const browser = await chromium.launch({ channel: "chrome", headless: true });
const data = await capture(browser, url, "current");
const analysis = analyze(data);
let refData = null,
  refAnalysis = null;
if (refUrl) {
  refData = await capture(browser, refUrl, "reference");
  refAnalysis = analyze(refData);
}
await browser.close();

const md = report(data, analysis, refData, refAnalysis);
await fs.writeFile(path.join(outDir, "report.md"), md);
await fs.writeFile(
  path.join(outDir, "data.json"),
  JSON.stringify({ url, data, analysis, refUrl, refData, refAnalysis }, null, 2)
);

console.log(md);
console.log(`\n---\n输出目录: ${outDir}`);
