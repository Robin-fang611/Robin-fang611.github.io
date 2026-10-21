// 渲染层：内容 → HTML。纯函数，无状态；中英共用同一套组件。
import { site } from "../content/site.mjs";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const t = (v, L) => (typeof v === "string" ? v : v[L] ?? v.zh);
const arr = (v, L) => (Array.isArray(v) ? v : [v]).map((x) => t(x, L));

const arrow = `<span class="arrow" aria-hidden="true">→</span>`;

function topbar(L, alt) {
  const ui = site.ui;
  return `<header class="topbar">
  <div class="wrap topbar-in">
    <a class="brand" href="#cover">
      <span class="seal seal-xs" aria-hidden="true">${esc(site.cover.seal[L])}</span>
      <span class="brand-name">${L === "zh" ? '房钰斌 <em>Robin</em>' : 'Robin <em>Fang</em>'}</span>
    </a>
    <div class="topbar-actions">
      <button class="toc-btn" type="button" aria-haspopup="dialog" aria-controls="toc-dialog">
        ${esc(t(ui.openToc, L))}
      </button>
      <a class="lang" href="${alt.url}" hreflang="${alt.lang}" lang="${alt.lang}"
        aria-label="${esc(t(ui.langSwitchLabel, L))}">${esc(t(ui.langSwitch, L))}</a>
      <a class="btn btn-sm" href="#contact">${esc(t(ui.contactCta, L))}</a>
    </div>
  </div>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>`;
}

function rail(L) {
  return `<aside class="rail">
  <nav aria-label="${esc(t(site.ui.tocLabel, L))}">
    <ol class="toc">
      ${site.nav
        .map(
          (n) =>
            `<li><a href="#${n.id}" data-toc="${n.id}">${n.n} ${esc(t(n.label, L))}</a></li>`
        )
        .join("\n      ")}
    </ol>
  </nav>
</aside>`;
}

function cover(L) {
  const c = site.cover;
  const [l1, l2] = c.title[L];
  return `<section class="cover" id="cover" aria-labelledby="cover-title">
  <p class="docmeta">${c.meta.map((m) => `<span>${esc(t(m, L))}</span>`).join("")}</p>
  <p class="label">${esc(t(c.eyebrow, L))}</p>
  <h1 id="cover-title">${esc(l1)}<br /><span class="ink">${esc(l2)}<svg class="ink-line" viewBox="0 0 600 24" preserveAspectRatio="none" aria-hidden="true"><path d="M4 17 C 150 7, 430 6, 596 13" /></svg></span></h1>
  <p class="lede">${esc(t(c.lede, L))}</p>
  <ul class="facts">
    ${c.facts.map((f) => `<li>${esc(t(f, L))}</li>`).join("\n    ")}
  </ul>
  <div class="actions">
    <a class="btn" href="#summary">${esc(t(c.actions.primary, L))}</a>
    <a class="link" href="#contact">${esc(t(c.actions.secondary, L))}${arrow}</a>
  </div>
  <span class="seal seal-lg" aria-hidden="true">${esc(c.seal[L])}</span>
</section>`;
}

function secHead(id, n, title, kicker) {
  return `<header class="sec-head">
    <span class="seal seal-sm" aria-hidden="true">${n}</span>
    <h2 id="${id}-title">${esc(title)}</h2>
    <p class="sec-kicker">${esc(kicker)}</p>
  </header>`;
}

function caseRow(item, L) {
  return `<article class="case">
    <div class="case-body">
      <p class="case-org">${esc(t(item.org, L))}</p>
      <h3>${esc(t(item.title, L))}</h3>
      <div class="case-lines">
        <p><b>${L === "zh" ? "问题：" : "Problem:"}</b>${esc(t(item.problem, L))}</p>
        <p><b>${L === "zh" ? "做法：" : "Move:"}</b>${esc(t(item.action, L))}</p>
        <p><b>${L === "zh" ? "结果：" : "Result:"}</b>${esc(t(item.result, L))}</p>
      </div>
    </div>
    <div class="case-metric">
      <strong>${esc(item.metric)}</strong>
      <span>${esc(t(item.metricLabel, L))}</span>
    </div>
    <p class="source">${esc(t(site.ui.source, L))} · ${
      item.href
        ? `<a href="${item.href}" target="_blank" rel="noopener">${esc(t(item.source, L))}</a>`
        : esc(t(item.source, L))
    }</p>
  </article>`;
}

function summary(L) {
  const s = site.sections.summary;
  return `<section class="sec" id="summary" aria-labelledby="summary-title">
  ${secHead("summary", "01", t(s.title, L), t(s.kicker, L))}
  <div class="cases">${site.cases.map((c) => caseRow(c, L)).join("\n")}</div>
</section>`;
}

function evidence(L) {
  const s = site.sections.evidence;
  return `<section class="sec" id="evidence" aria-labelledby="evidence-title">
  ${secHead("evidence", "02", t(s.title, L), t(s.kicker, L))}
  <ol class="metrics">
    ${site.metrics
      .map(
        (m) => `<li class="metric">
      <p class="metric-value">${esc(m.value)}</p>
      <p class="metric-label">${esc(t(m.label, L))}</p>
      <p class="source">${esc(t(site.ui.source, L))} · ${
          m.href
            ? `<a href="${m.href}" target="_blank" rel="noopener">${esc(t(m.source, L))}</a>`
            : esc(t(m.source, L))
        }</p>
    </li>`
      )
      .join("\n    ")}
  </ol>
</section>`;
}

function entry(e, L) {
  return `<li class="entry">
    <p class="entry-when">${esc(t(e.when, L))}</p>
    <h4 class="entry-org">${esc(t(e.org, L))}</h4>
    <p class="entry-role">${esc(t(e.role, L))}</p>
    <ul class="points">
      ${e.points.map((p) => `<li>${esc(t(p, L))}</li>`).join("\n      ")}
    </ul>
  </li>`;
}

function record(L) {
  const s = site.sections.record;
  const chapters = site.record.map((ch) => {
    const head = `<h3 class="chapter-title"><span class="chapter-n">${ch.n}</span>${esc(t(ch.title, L))}</h3>`;
    const list = `<ol class="entries">${ch.entries.map((e) => entry(e, L)).join("\n")}</ol>`;
    if (!ch.collapsed) return `<div class="chapter">${head}${list}</div>`;
    return `<details class="chapter chapter-details">
      <summary>${head}<span class="plus" aria-hidden="true"></span></summary>
      ${list}
    </details>`;
  });
  return `<section class="sec" id="record" aria-labelledby="record-title">
  ${secHead("record", "03", t(s.title, L), t(s.kicker, L))}
  ${chapters.join("\n")}
</section>`;
}

function ecosystem(L) {
  const s = site.sections.ecosystem;
  const e = site.ecosystem;
  return `<section class="sec" id="ecosystem" aria-labelledby="ecosystem-title">
  ${secHead("ecosystem", "04", t(s.title, L), t(s.kicker, L))}
  <ul class="roles">
    ${e.roles
      .map(
        (r) => `<li class="role">
      <h3>${esc(t(r.name, L))}</h3>
      <p class="role-meta">${esc(t(r.role, L))} · ${esc(t(r.since, L))}</p>
      <p class="role-line">${esc(t(r.line, L))}</p>
    </li>`
      )
      .join("\n    ")}
  </ul>
  <p class="partners"><span class="label">${esc(t(e.partnersLabel, L))}</span>${e.partners
    .map(esc)
    .join(" · ")}</p>
  <h3 class="sub-title">${esc(L === "zh" ? "公开仓库" : "Open source")}</h3>
  <ul class="repos">
    ${site.opensource
      .map(
        (r) => `<li class="repo">
      <a href="${r.href}" target="_blank" rel="noopener">${esc(r.name)}${arrow}</a>
      <p>${esc(t(r.desc, L))}</p>
    </li>`
      )
      .join("\n    ")}
  </ul>
</section>`;
}

function method(L) {
  const s = site.sections.method;
  return `<section class="sec" id="method" aria-labelledby="method-title">
  ${secHead("method", "05", t(s.title, L), t(s.kicker, L))}
  <ol class="methods">
    ${site.method
      .map(
        (m) => `<li class="method">
      <h3><span class="n">${m.n}</span>${esc(t(m.title, L))}</h3>
      <p>${esc(t(m.body, L))}</p>
    </li>`
      )
      .join("\n    ")}
  </ol>
</section>`;
}

function questions(L) {
  const s = site.sections.questions;
  return `<section class="sec" id="questions" aria-labelledby="questions-title">
  ${secHead("questions", "06", t(s.title, L), t(s.kicker, L))}
  <ol class="questions">
    ${site.questions
      .map(
        (q) => `<li class="question">
      <h3><span class="n">${q.n}</span>${esc(t(q.title, L))}</h3>
      <p>${esc(t(q.body, L))}</p>
    </li>`
      )
      .join("\n    ")}
  </ol>
</section>`;
}

function contact(L) {
  const c = site.contact;
  return `<section class="contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap contact-in">
    <div class="contact-main">
      <span class="seal seal-sm" aria-hidden="true">07</span>
      <h2 id="contact-title">${esc(t(c.title, L))}<br />${esc(t(c.title2, L))}</h2>
      <p class="contact-lead">${esc(t(c.lead, L))}</p>
      <div class="contact-actions">
        <a class="btn" href="mailto:${site.email}" data-copy="${site.email}" data-copied="${esc(t(site.ui.copied, L))}" data-fail="${esc(t(site.ui.copyFail, L))}">${esc(t(site.ui.copy, L))}</a>
        <a class="link link-dark" href="mailto:${site.email}">${esc(site.email)}</a>
      </div>
      <p class="copy-status" role="status" aria-live="polite"></p>
      <p class="contact-wechat">${esc(t(site.ui.wechat, L))} ${esc(site.wechat)}</p>
    </div>
    <div class="contact-side">
      <ul class="requests">
        ${c.items
          .map(
            (i) => `<li>
          <p class="req-label">${esc(t(i.label, L))}</p>
          <p class="req-text">${esc(t(i.text, L))}</p>
        </li>`
          )
          .join("\n        ")}
      </ul>
      <p class="label socials-label">${esc(t(site.ui.socials, L))}</p>
      <ul class="socials">
        <li><a href="${site.links.github}" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="${site.links.xiaohongshu}" target="_blank" rel="noopener">小红书</a></li>
        <li><a href="${site.links.douyin}" target="_blank" rel="noopener">抖音</a></li>
        <li><a href="${site.links.bilibili}" target="_blank" rel="noopener">Bilibili</a></li>
        <li><a href="${site.links.x}" target="_blank" rel="noopener">X</a></li>
      </ul>
      <p class="contact-note">${esc(t(c.note, L))}</p>
    </div>
  </div>
</section>`;
}

function footer(L) {
  const f = site.footer;
  return `<footer class="footer">
  <div class="wrap footer-in">
    <p>${esc(t(f.rights, L))}</p>
    <p>${esc(t(site.ui.volume, L))} RB-2026 · ${esc(t(site.ui.updated, L))} ${site.updated} · ${esc(t(site.ui.footerNote, L))}</p>
    <p><a href="${site.links.github}/Robin-fang611.github.io" target="_blank" rel="noopener">${esc(t(f.source, L))}${arrow}</a></p>
  </div>
</footer>`;
}

function dialog(L) {
  return `<dialog class="dialog" id="toc-dialog" aria-labelledby="toc-dialog-title">
  <div class="dialog-head">
    <h2 id="toc-dialog-title">${esc(t(site.ui.toc, L))}</h2>
    <button class="dialog-close" type="button" data-dialog-close>${esc(t(site.ui.close, L))}</button>
  </div>
  <ol class="dialog-toc">
    ${site.nav
      .map((n) => `<li><a href="#${n.id}">${n.n} ${esc(t(n.label, L))}</a></li>`)
      .join("\n    ")}
  </ol>
</dialog>`;
}

export function renderPage(L) {
  const seo = site.seo[L];
  const alt = L === "zh" ? { url: "/en/", lang: "en" } : { url: "/", lang: "zh-CN" };
  const canonical = L === "zh" ? `${site.url}/` : `${site.url}/en/`;
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "房钰斌",
    alternateName: "Robin Fang",
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: L === "zh" ? "AI 产品与增长" : "AI product & growth",
    alumniOf: { "@type": "CollegeOrUniversity", name: "中南财经政法大学" },
    sameAs: Object.values(site.links),
  };

  return `<!doctype html>
<html lang="${seo.lang}" class="no-js">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(seo.title)}</title>
<meta name="description" content="${esc(seo.description)}" />
<link rel="canonical" href="${canonical}" />
<link rel="alternate" hreflang="zh-CN" href="${site.url}/" />
<link rel="alternate" hreflang="en" href="${site.url}/en/" />
<link rel="alternate" hreflang="x-default" href="${site.url}/" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<meta property="og:type" content="profile" />
<meta property="og:title" content="${esc(seo.title)}" />
<meta property="og:description" content="${esc(seo.description)}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:locale" content="${seo.ogLocale}" />
<meta property="og:image" content="${site.url}/assets/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#F4F0E7" />
<link rel="stylesheet" href="/assets/site.css" />
<script>document.documentElement.classList.replace("no-js","js");</script>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">${esc(t(site.ui.skip, L))}</a>
${topbar(L, alt)}
<main id="main">
  <div class="wrap page">
    ${rail(L)}
    <div class="col">
      ${cover(L)}
      ${summary(L)}
      ${evidence(L)}
      ${record(L)}
      ${ecosystem(L)}
      ${method(L)}
      ${questions(L)}
    </div>
  </div>
  ${contact(L)}
</main>
${footer(L)}
${dialog(L)}
<script src="/assets/site.js" defer></script>
</body>
</html>`;
}
