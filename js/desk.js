/* Escena de escritorio con lookbook guiado por scroll. */
(function (global) {
  let raf = 0;
  let target = 0;
  let current = 0;
  let mx = 0;
  let my = 0;
  let bound = null;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function destroyDesk() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (bound) {
      bound.space = null;
      window.removeEventListener("scroll", bound.onScroll, { passive: true });
      window.removeEventListener("resize", bound.onScroll);
      if (bound.pin) {
        bound.pin.removeEventListener("pointermove", bound.onMove);
        bound.pin.removeEventListener("pointerleave", bound.onLeave);
      }
      bound = null;
    }
  }

  function readProgress(space) {
    if (!space) return 0;
    const rail = space.closest(".desk-rail") || space.parentElement;
    if (!rail) return 0;
    const total = Math.max(1, rail.offsetHeight - window.innerHeight);
    const scrolled = clamp(window.scrollY || document.documentElement.scrollTop || 0, 0, total);
    return scrolled / total;
  }

  function apply(progress) {
    if (!bound) return;
    const { pin, book, cover, intro, hint, sheets, under, lefts, rights } = bound;
    const p = clamp(progress, 0, 1);
    pin.style.setProperty("--scroll", p.toFixed(4));
    pin.style.setProperty("--mx", mx.toFixed(3));
    pin.style.setProperty("--my", my.toFixed(3));

    const openT = clamp(p / 0.16, 0, 1);
    const coverDeg = -168 * easeInOut(openT);
    if (cover) cover.style.transform = `rotateY(${coverDeg.toFixed(2)}deg)`;
    book.dataset.open = openT > 0.55 ? "1" : "0";

    if (intro) {
      const fade = 1 - clamp((p - 0.02) / 0.14, 0, 1);
      intro.style.opacity = fade.toFixed(3);
      intro.style.transform = `translate3d(0, ${(1 - fade) * -24}px, 0)`;
      intro.style.pointerEvents = fade < 0.2 ? "none" : "auto";
    }
    if (hint) {
      const show = p < 0.08 ? 1 : clamp(1 - (p - 0.08) / 0.1, 0, 1);
      hint.style.opacity = show.toFixed(3);
      hint.textContent = openT < 0.5 ? "Desliza para abrir el lookbook" : "Sigue deslizando para pasar páginas";
    }

    const n = Math.max(1, sheets.length);
    const pageStart = 0.18;
    const pageSpan = Math.max(0.001, 1 - pageStart);
    const pageFloat = openT < 1 ? 0 : ((p - pageStart) / pageSpan) * n;
    const active = clamp(Math.floor(pageFloat), 0, n);
    const local = clamp(pageFloat - Math.floor(pageFloat), 0, 1);

    sheets.forEach((sheet, i) => {
      let amount = 0;
      if (pageFloat >= i + 1) amount = 1;
      else if (pageFloat > i) amount = easeInOut(local);
      const deg = -180 * amount;
      sheet.style.transform = `rotateY(${deg.toFixed(2)}deg)`;
      sheet.style.zIndex = String(40 + (n - i) + (amount > 0.01 && amount < 0.99 ? 20 : 0));
      sheet.dataset.flipping = amount > 0.02 && amount < 0.98 ? "1" : "0";
    });

    const leftIndex = clamp(Math.floor(pageFloat), 0, lefts.length - 1);
    lefts.forEach((node, i) => node.classList.toggle("on", i === leftIndex));
    const underIndex = clamp(Math.ceil(pageFloat), 0, rights.length - 1);
    rights.forEach((node, i) => node.classList.toggle("on", i === underIndex));
    pin.dataset.page = String(leftIndex);
    void under;
    void active;
  }

  function tick() {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.00035) current = target;
    apply(current);
    raf = requestAnimationFrame(tick);
  }

  function mountDesk() {
    destroyDesk();
    const pin = document.querySelector("[data-desk]");
    const space = document.querySelector("[data-desk-space]");
    const book = document.querySelector("[data-book]");
    if (!pin || !space || !book) return;

    const cover = book.querySelector("[data-cover]");
    const intro = pin.querySelector("[data-desk-intro]");
    const hint = pin.querySelector("[data-desk-hint]");
    const sheets = [...book.querySelectorAll("[data-sheet]")];
    const under = book.querySelector("[data-book-under]");
    const lefts = [...book.querySelectorAll("[data-left]")];
    const rights = [...book.querySelectorAll("[data-right]")];

    const onScroll = () => {
      target = readProgress(space);
    };
    const onMove = (event) => {
      const rect = pin.getBoundingClientRect();
      mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      pin.querySelectorAll(".desk-prop").forEach((prop) => {
        const depth = Number(prop.dataset.depth) || 12;
        const rot = prop.dataset.rot || "0";
        prop.style.transform = `translate3d(${(mx * depth).toFixed(1)}px, ${(my * depth * 0.5).toFixed(1)}px, 0) rotate(${rot}deg)`;
      });
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
      pin.querySelectorAll(".desk-prop").forEach((prop) => {
        prop.style.transform = "";
      });
    };

    bound = { pin, space, book, cover, intro, hint, sheets, under, lefts, rights, onScroll, onMove, onLeave };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    pin.addEventListener("pointermove", onMove);
    pin.addEventListener("pointerleave", onLeave);
    target = readProgress(space);
    current = target;
    apply(current);
    raf = requestAnimationFrame(tick);
  }

  global.mountDesk = mountDesk;
  global.destroyDesk = destroyDesk;
})(window);
