import { chromium } from "playwright-core";
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto("http://127.0.0.1:4180/src/og/og.html", { waitUntil: "load" });
await p.waitForTimeout(300);
await p.screenshot({ path: "../../assets/og.png" });
await b.close();
console.log("og written");
