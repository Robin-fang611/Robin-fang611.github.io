// 构建：内容 → 页面。零依赖，一条命令。
import { readFile, writeFile, mkdir, copyFile, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { renderPage } from "./src/render/page.mjs";
import { site } from "./src/content/site.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(here, "assets");
const today = new Date().toISOString().slice(0, 10);

const cssOrder = ["tokens.css", "base.css", "components.css", "sections.css"];
const banner = `/* 卷宗 RB-2026 · generated ${today} · 修改请改 src/styles/*.css，不要改这个文件 */\n`;

await mkdir(assets, { recursive: true });

const css = banner + (await Promise.all(
  cssOrder.map((f) => readFile(path.join(here, "src/styles", f), "utf8"))
)).join("\n");
await writeFile(path.join(assets, "site.css"), css);

await copyFile(path.join(here, "src/client/site.js"), path.join(assets, "site.js"));

for (const f of await readdir(path.join(here, "src/assets"))) {
  await copyFile(path.join(here, "src/assets", f), path.join(assets, f));
}

await writeFile(path.join(here, "index.html"), renderPage("zh"));
await mkdir(path.join(here, "en"), { recursive: true });
await writeFile(path.join(here, "en/index.html"), renderPage("en"));

const notFound = `<!doctype html>
<html lang="zh-CN" class="no-js">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>404 · 这一页不在卷宗里</title>
<meta name="robots" content="noindex" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/assets/site.css" />
<script>document.documentElement.classList.replace("no-js","js");</script>
</head>
<body>
<main id="main">
  <div class="wrap page">
    <div class="col" style="padding-block: var(--s10)">
      <p class="docmeta"><span>卷宗 RB-2026</span><span>404</span></p>
      <p class="label" style="margin-top: var(--s7); color: var(--accent)">Not in this file</p>
      <h1 style="margin-top: var(--s4); font-size: var(--fs-5)">这一页不在卷宗里。</h1>
      <p class="lede" style="margin-top: var(--s5)">链接可能过期，或者地址少了一段。回到封面，从 01 摘要重新开始。</p>
      <p style="margin-top: var(--s7)"><a class="btn" href="/">回到封面</a></p>
    </div>
  </div>
</main>
</body>
</html>
`;
await writeFile(path.join(here, "404.html"), notFound);

await writeFile(
  path.join(here, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>${site.url}/en/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>
`
);

await writeFile(
  path.join(here, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`
);

await writeFile(path.join(here, ".nojekyll"), "");

// 旧版单页已被 en/ 取代；删掉避免 GitHub Pages 继续暴露过期内容
await rm(path.join(here, "en.html"), { force: true });

const sizes = {
  "index.html": (await readFile(path.join(here, "index.html"))).length,
  "en/index.html": (await readFile(path.join(here, "en/index.html"))).length,
  "assets/site.css": (await readFile(path.join(assets, "site.css"))).length,
  "assets/site.js": (await readFile(path.join(assets, "site.js"))).length,
};
console.log("built", Object.entries(sizes).map(([k, v]) => `${k} ${(v / 1024).toFixed(1)}KB`).join(" · "));
