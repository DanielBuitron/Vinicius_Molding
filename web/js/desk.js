/* Escritorio + lookbook grande con tapa CSS y volteo StPageFlip por scroll. */
(function (global) {
  let raf = 0;
  let target = 0;
  let current = 0;
  let mx = 0;
  let my = 0;
  let bound = null;
  let flipper = null;
  let desiredSpread = 0;
  let busy = false;
  let pageSpreads = 1;

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function destroyDesk() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (flipper) {
      try { flipper.destroy(); } catch (err) { /* ignore */ }
      flipper = null;
    }
    if (bound) {
      window.removeEventListener("scroll", bound.onScroll, { passive: true });
      window.removeEventListener("resize", bound.onResize);
      if (bound.pin) {
        bound.pin.removeEventListener("pointermove", bound.onMove);
        bound.pin.removeEventListener("pointerleave", bound.onLeave);
      }
      bound = null;
    }
  }

  function readProgress(rail) {
    if (!rail) return 0;
    const total = Math.max(1, rail.offsetHeight - window.innerHeight);
    const scrolled = clamp(window.scrollY || document.documentElement.scrollTop || 0, 0, total);
    return scrolled / total;
  }

  function sizeBook() {
    if (!bound) return { w: 560, h: 400 };
    const pin = bound.pin;
    const full = Math.min(pin.clientWidth * 0.96, 1280);
    const w = Math.floor(full / 2);
    const h = Math.min(Math.floor(window.innerHeight * 0.7), Math.floor(w * 0.78), 620);
    return { w: Math.max(320, w), h: Math.max(260, h) };
  }

  function currentSpreadIndex() {
    if (!flipper) return 0;
    return Math.floor(flipper.getCurrentPageIndex() / 2);
  }

  function syncFlip() {
    if (!flipper || busy) return;
    const now = currentSpreadIndex();
    if (desiredSpread === now) return;
    busy = true;
    try {
      if (desiredSpread > now) flipper.flipNext("top");
      else flipper.flipPrev("top");
    } catch (err) {
      busy = false;
    }
    setTimeout(() => { busy = false; }, 1050);
  }

  function apply(progress) {
    if (!bound) return;
    const { pin, intro, hint, stage, cover } = bound;
    const p = clamp(progress, 0, 1);
    pin.style.setProperty("--scroll", p.toFixed(4));
    pin.style.setProperty("--mx", mx.toFixed(3));
    pin.style.setProperty("--my", my.toFixed(3));

    const openT = clamp(p / 0.14, 0, 1);
    const coverDeg = -178 * (openT < 0.5 ? 2 * openT * openT : 1 - Math.pow(-2 * openT + 2, 2) / 2);
    if (cover) {
      cover.style.transform = `translate(-50%, -50%) rotateY(${coverDeg.toFixed(2)}deg)`;
      cover.style.opacity = openT > 0.92 ? "0" : "1";
      cover.style.pointerEvents = openT > 0.5 ? "none" : "auto";
    }
    if (stage) stage.dataset.open = openT > 0.35 ? "1" : "0";

    if (intro) {
      const fade = 1 - clamp(p / 0.12, 0, 1);
      intro.style.opacity = fade.toFixed(3);
      intro.style.transform = `translate3d(0, ${(1 - fade) * -16}px, 0)`;
      intro.style.pointerEvents = fade < 0.15 ? "none" : "auto";
    }
    if (hint) {
      hint.style.opacity = (p < 0.09 ? 1 : clamp(1 - (p - 0.09) / 0.1, 0, 1)).toFixed(3);
      hint.textContent = openT < 0.5 ? "Desliza para abrir" : "Sigue deslizando";
    }

    if (openT < 0.98) {
      desiredSpread = 0;
      return;
    }
    const pageProgress = clamp((p - 0.16) / 0.84, 0, 1);
    desiredSpread = clamp(Math.round(pageProgress * (pageSpreads - 1)), 0, pageSpreads - 1);
    syncFlip();
  }

  function tick() {
    current += (target - current) * 0.18;
    if (Math.abs(target - current) < 0.0004) current = target;
    apply(current);
    raf = requestAnimationFrame(tick);
  }

  function mountFlipper(root) {
    if (!global.St || !St.PageFlip) return null;
    const pages = root.querySelectorAll(".flip-page");
    const { w, h } = sizeBook();
    const pf = new St.PageFlip(root, {
      width: w,
      height: h,
      size: "stretch",
      minWidth: 300,
      maxWidth: 700,
      minHeight: 260,
      maxHeight: 640,
      drawShadow: true,
      flippingTime: 1000,
      usePortrait: false,
      startZIndex: 8,
      autoSize: true,
      maxShadowOpacity: 0.6,
      showCover: false,
      mobileScrollSupport: false,
      swipeDistance: 36,
      clickEventForward: true,
      useMouseEvents: true,
      showPageCorners: true,
      disableFlipByClick: false,
    });
    pf.loadFromHTML(pages);
    pf.on("flip", () => { busy = false; });
    pf.on("changeState", (e) => { if (e.data === "read") busy = false; });
    return pf;
  }

  function mountDesk() {
    destroyDesk();
    const pin = document.querySelector("[data-desk]");
    const space = document.querySelector("[data-desk-space]");
    const rail = document.querySelector(".desk-rail");
    const root = document.querySelector("[data-flip]");
    if (!pin || !space || !rail || !root) return;

    pageSpreads = Number(root.dataset.spreads || 1);
    flipper = mountFlipper(root);

    const intro = pin.querySelector("[data-desk-intro]");
    const hint = pin.querySelector("[data-desk-hint]");
    const stage = pin.querySelector("[data-book-stage]");
    const cover = pin.querySelector("[data-hard-cover]");

    const onScroll = () => { target = readProgress(rail); };
    const onResize = () => {
      if (flipper) flipper.update();
      onScroll();
    };
    const onMove = (event) => {
      const rect = pin.getBoundingClientRect();
      mx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      pin.querySelectorAll(".desk-prop").forEach((prop) => {
        const depth = Number(prop.dataset.depth) || 6;
        const rot = prop.dataset.rot || "0";
        prop.style.transform = `translate3d(${(mx * depth * 0.45).toFixed(1)}px, ${(my * depth * 0.25).toFixed(1)}px, 0) rotate(${rot}deg)`;
      });
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
      pin.querySelectorAll(".desk-prop").forEach((prop) => { prop.style.transform = ""; });
    };

    bound = { pin, space, rail, intro, hint, stage, cover, onScroll, onResize, onMove, onLeave };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    pin.addEventListener("pointermove", onMove);
    pin.addEventListener("pointerleave", onLeave);
    target = readProgress(rail);
    current = target;
    apply(current);
    raf = requestAnimationFrame(tick);
  }

  global.mountDesk = mountDesk;
  global.destroyDesk = destroyDesk;
})(window);
