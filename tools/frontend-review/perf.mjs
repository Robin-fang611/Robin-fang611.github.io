import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const res = [];
p.on("response", r => res.push({ url: r.url(), type: r.request().resourceType(), status: r.status() }));
const t0 = Date.now();
await p.goto("http://127.0.0.1:4180/", { waitUntil: "load" });
const load = Date.now() - t0;
await p.waitForTimeout(800);
const perf = await p.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  const paint = performance.getEntriesByType("paint");
  return {
    dcl: Math.round(nav.domContentLoadedEventEnd),
    load: Math.round(nav.loadEventEnd),
    fcp: Math.round(paint.find(p => p.name === "first-contentful-paint")?.startTime || 0),
    resources: performance.getEntriesByType("resource").map(r => [r.name.split("/").pop(), Math.round(r.transferSize / 1024 * 10) / 10, r.initiatorType]),
  };
});
console.log("load(ms):", load, JSON.stringify(perf));
console.log("requests:", res.length, res.map(r => `${r.type}:${r.status}:${r.url.split("/").pop()}`).join(" | "));
await b.close();
