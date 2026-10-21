import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
for (const path of ["/", "/en/"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://127.0.0.1:4180" + path, { waitUntil: "load" });
  const r = await p.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map(e => e.id);
    const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
    const anchors = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute("href").slice(1)).filter(Boolean);
    const broken = [...new Set(anchors.filter(id => !document.getElementById(id)))];
    const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(h => h.tagName);
    const links = [...document.querySelectorAll("a")].filter(a => !a.textContent.trim() && !a.getAttribute("aria-label")).length;
    const imgs = [...document.querySelectorAll("img")].filter(i => !i.alt).length;
    return { dup, broken, h1: headings.filter(h => h === "H1").length, headings: headings.join(" "), namelessLinks: links, imgsNoAlt: imgs, jsonld: !!document.querySelector('script[type="application/ld+json"]') };
  });
  console.log(path, JSON.stringify(r));
  await p.close();
}
await b.close();
