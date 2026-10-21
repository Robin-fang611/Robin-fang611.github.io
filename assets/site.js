/* 运行时只做导航与工具：进度线、当前章节、目录弹层、复制邮箱、语言切换保锚点。
   没有滚动劫持、没有入场动画、没有数字滚动。关闭 JS，页面依然完整可读。 */
(() => {
  const root = document.documentElement;
  const $ = (sel, scope = document) => scope.querySelector(sel);

  /* ---------- 阅读进度 ---------- */
  const bar = $(".progress i");
  if (bar) {
    let queued = false;
    const paint = () => {
      const max = root.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      bar.style.transform = `scaleX(${p})`;
      queued = false;
    };
    const request = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    paint();
  }

  /* ---------- 当前章节 ---------- */
  const links = new Map(
    [...document.querySelectorAll("[data-toc]")].map((a) => [a.dataset.toc, a])
  );
  const sections = [...document.querySelectorAll("main section[id]")];
  if (links.size && sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((a) => a.removeAttribute("aria-current"));
          const active = links.get(entry.target.id);
          if (active) active.setAttribute("aria-current", "true");
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- 语言切换：保留当前章节 ---------- */
  const lang = $(".lang");
  if (lang) {
    const sync = () => {
      const base = lang.getAttribute("href").split("#")[0];
      lang.setAttribute("href", base + (location.hash || ""));
    };
    sync();
    addEventListener("hashchange", sync);
  }

  /* ---------- 移动端目录 ---------- */
  const dialog = $("#toc-dialog");
  const openBtn = $(".toc-btn");
  if (dialog && openBtn) {
    openBtn.addEventListener("click", () => {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target.closest("a")) dialog.close();
    });
    const closeBtn = $("[data-dialog-close]", dialog);
    if (closeBtn) closeBtn.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => openBtn.focus());
  }

  /* ---------- 打印 ---------- */
  const printBtn = $("[data-print]");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  /* ---------- 复制邮箱（失败则退回 mailto） ---------- */
  const copyBtn = $("[data-copy]");
  const status = $(".copy-status");
  if (copyBtn) {
    const email = copyBtn.dataset.copy;
    const label = copyBtn.textContent;
    const done = copyBtn.dataset.copied || label;
    const fail = copyBtn.dataset.fail || label;
    copyBtn.addEventListener("click", async (event) => {
      if (!navigator.clipboard) return; // 交给 mailto
      event.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.textContent = done;
        if (status) status.textContent = done;
        setTimeout(() => {
          copyBtn.textContent = label;
        }, 2000);
      } catch {
        if (status) status.textContent = fail;
        copyBtn.textContent = fail;
        setTimeout(() => {
          copyBtn.textContent = label;
        }, 3000);
      }
    });
  }
})();
