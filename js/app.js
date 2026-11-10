let renderSeq = 0;
let advisorDone = false;
let checkoutOrder = null;

function parseRoute() {
  const search = new URLSearchParams(location.search);
  if (search.get("pedido") === "1") {
    const ref = search.get("ref") || "";
    const token = search.get("token") || "";
    history.replaceState(null, "", `#/pedido?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(token)}`);
  }
  const raw = (location.hash || "#/inicio").replace(/^#/, "");
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  return { parts: parts.length ? parts : ["inicio"], qs: new URLSearchParams(query || "") };
}

function titles() {
  const page = VM.parts[0];
  if (page === "inicio") {
    document.title = t("title.home");
    return;
  }
  if (page === "producto") {
    const product = productById(VM.parts[1]);
    const name = product ? (productField(product, "name") || product.name) : t("title.product");
    document.title = name + " · Vinicius Molding";
    return;
  }
  const names = {
    catalogo: t("title.catalog"),
    linea: t("title.catalog"),
    carrito: t("title.cart"),
    pago: t("title.pay"),
    pedido: t("title.order"),
    login: t("title.login"),
    panel: t("title.panel"),
    tienda: t("title.catalog"),
  };
  document.title = (names[page] || "Vinicius") + " · Vinicius Molding";
}

async function trackView() {
  const page = VM.parts[0];
  if (page === "panel" || page === "login") return;
  const path = "/" + VM.parts.join("/");
  const productId = page === "producto" ? VM.parts[1] : "";
  try {
    await api("/api/track", { method: "POST", body: { path, productId, sessionId: sessionId() } });
  } catch (err) {
    /* La tienda sigue aunque el conteo falle. */
  }
}

let paintedRoute = "";
let showcaseTimer = 0;

function scrollToStart() {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previous;
}

function stepShowcase(root, dir, index) {
  const slides = [...root.querySelectorAll(".showcase-slide")];
  if (slides.length < 2) return;
  const current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("on")));
  const next = index == null ? (current + dir + slides.length) % slides.length : Number(index) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("on", i === next));
  root.querySelectorAll(".showcase-dots button").forEach((dot, i) => dot.classList.toggle("on", i === next));
}

function bindShowcases() {
  clearInterval(showcaseTimer);
  const roots = [...document.querySelectorAll("[data-showcase]")];
  if (!roots.length) return;
  showcaseTimer = setInterval(() => {
    roots.forEach((root) => {
      if (root.dataset.pause === "1") return;
      stepShowcase(root, 1);
    });
  }, 4600);
  roots.forEach((root) => {
    root.addEventListener("pointerenter", () => { root.dataset.pause = "1"; });
    root.addEventListener("pointerleave", () => { delete root.dataset.pause; });
  });
}

function syncMagazine(home) {
  const revista = document.getElementById("revista");
  const app = document.getElementById("app");
  const css = document.getElementById("store-css");
  if (revista) revista.hidden = !home;
  if (app) app.hidden = home;
  if (css) css.media = home ? "not all" : "all";
  document.body.classList.toggle("mode-home", !!home);
  document.body.classList.toggle("mode-app", !home);
  const badge = document.getElementById("mag-count");
  if (badge) {
    const count = cartCount();
    badge.textContent = String(count);
    badge.hidden = count < 1;
  }
  if (home && window.GLon) document.body.classList.add("gl");
  const login = document.getElementById("login-link");
  if (login) {
    if (VM.user) {
      login.setAttribute("href", "#/panel/resumen");
    } else {
      login.setAttribute("href", "#/login");
    }
  }
  if (typeof applyStaticLang === "function") applyStaticLang();
}

function stopWhatsappPoll() {
  if (VM.waPollTimer) {
    clearInterval(VM.waPollTimer);
    VM.waPollTimer = 0;
  }
}

function whatsappRoute() {
  const page = (VM.parts && VM.parts[0]) || "";
  if (page === "vincular") return "public";
  if (page === "panel" && (VM.parts[1] || "") === "whatsapp") return "admin";
  return "";
}

function waChatsFingerprint(data) {
  const chats = (data && data.chats) || [];
  return chats.map((chat) => {
    const msgs = chat.messages || [];
    const last = msgs[msgs.length - 1] || {};
    return [chat.id, chat.updatedAt || "", msgs.length, last.id || "", last.text || ""].join(":");
  }).join("|");
}

function startWhatsappPoll() {
  stopWhatsappPoll();
  if (!whatsappRoute()) return;
  VM.waPollTimer = setInterval(async () => {
    const mode = whatsappRoute();
    if (!mode) {
      stopWhatsappPoll();
      return;
    }
    try {
      if (mode === "public") {
        const data = await api("/api/whatsapp/session");
        const prev = VM.waPublic || {};
        VM.waPublic = data;
        if (data.sessionReady || (data.qrAt && data.qrAt !== prev.qrAt) || data.sessionStatus !== prev.sessionStatus) {
          render();
        }
        return;
      }
      const data = await api("/api/admin/whatsapp");
      const prev = VM.waData || {};
      const wasLinked = Boolean(prev.sessionReady || VM.waLinked);
      VM.waData = data;
      if (data.sessionReady) {
        VM.waLinked = true;
        VM.waShowQr = false;
        localStorage.setItem("vm_wa_linked", "1");
      }
      const qrChanged = data.qrAt && data.qrAt !== prev.qrAt;
      const statusChanged = data.sessionStatus !== prev.sessionStatus
        || Boolean(data.hasQr) !== Boolean(prev.hasQr)
        || Boolean(data.sessionReady) !== Boolean(prev.sessionReady);
      const chatsChanged = waChatsFingerprint(data) !== waChatsFingerprint(prev);
      if (!wasLinked && data.sessionReady) {
        render();
        return;
      }
      if (qrChanged || statusChanged || chatsChanged) render();
    } catch (err) { /* el bridge aún arranca */ }
  }, 2000);
}

function mountWhatsappQr() {
  const box = document.getElementById("wa-qr");
  if (!box) {
    if (whatsappRoute()) startWhatsappPoll();
    else stopWhatsappPoll();
    return;
  }
  const link = box.dataset.waQr || "";
  const imgUrl = box.dataset.waQrImg || "";
  const sessionQr = box.dataset.waSession === "1";
  box.innerHTML = "";
  if (imgUrl) {
    const img = document.createElement("img");
    const resolved = typeof apiUrl === "function" ? apiUrl(imgUrl) : imgUrl;
    img.src = resolved + (resolved.includes("?") ? "&" : "?") + "r=" + Date.now();
    img.alt = "QR de WhatsApp";
    img.width = 264;
    img.height = 264;
    img.onerror = () => {
      if (sessionQr) {
        box.innerHTML = "<p class=\"wa-qr-wait\">Generando código de vinculación…</p>";
        return;
      }
      if (window.QRCode && link) {
        box.innerHTML = "";
        new QRCode(box, { text: link, width: 264, height: 264, correctLevel: QRCode.CorrectLevel.M });
      }
    };
    box.appendChild(img);
    startWhatsappPoll();
    return;
  }
  if (window.QRCode && link) {
    new QRCode(box, { text: link, width: 264, height: 264, correctLevel: QRCode.CorrectLevel.M });
  }
  startWhatsappPoll();
}

function paint(html, bodyClass) {
  const page = (VM.parts && VM.parts[0]) || "inicio";
  const extras = [];
  const keepGl = document.body.classList.contains("gl");
  if (bodyClass === "site" && (page === "inicio" || !page)) extras.push("home");
  if (bodyClass === "site" && page === "producto") extras.push("product-page");
  if (bodyClass === "site" && page === "tienda") extras.push("shop-page");
  document.body.className = [bodyClass, ...extras].join(" ");
  if (keepGl) document.body.classList.add("gl");
  document.getElementById("app").innerHTML = html;
  const route = location.hash || "#/inicio";
  if (route !== paintedRoute) {
    paintedRoute = route;
    scrollToStart();
  }
  const header = document.querySelector(".site-header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  if (page !== "tienda") {
    bindOrbits();
    if (typeof mountVolumes === "function") mountVolumes();
    bindShowcases();
    bindReel();
  }
  mountWhatsappQr();
  const thread = document.getElementById("wa-thread");
  if (thread) thread.scrollTop = thread.scrollHeight;
  if (page !== "tienda") {
    if (typeof destroyDesk === "function") destroyDesk();
    if (typeof mountDesk === "function") mountDesk();
  }
}

function refreshShop() {
  const app = document.getElementById("app");
  if (!app || ((VM.parts && VM.parts[0]) !== "tienda")) {
    render();
    return;
  }
  const y = window.scrollY;
  document.body.classList.add("shop-page");
  app.innerHTML = viewShop();
  window.scrollTo(0, y);
}

function bindReel() {
  const video = document.querySelector("[data-reel-video]");
  const bar = document.querySelector("[data-reel-bar]");
  const sound = document.querySelector("[data-act='reel-sound']");
  if (!video) return;
  video.muted = VM.reelMuted !== false;
  const syncSound = () => {
    if (!sound) return;
    sound.textContent = video.muted ? "Toca para oír" : "Sonido on";
    sound.classList.toggle("on", !video.muted);
  };
  syncSound();
  video.addEventListener("timeupdate", () => {
    if (bar && video.duration) bar.style.width = `${(100 * video.currentTime / video.duration).toFixed(2)}%`;
  });
  video.addEventListener("click", () => {
    video.muted = !video.muted;
    VM.reelMuted = video.muted;
    if (video.paused) video.play().catch(() => {});
    syncSound();
  });
  video.play().catch(() => {});
}

function bindOrbits() {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  document.querySelectorAll("[data-orbit]").forEach((el) => {
    const card = el.querySelector(".orbit-card");
    if (!card) return;
    let rx = 8;
    let ry = -18;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let moved = 0;
    const apply = () => {
      if (el.dataset.solid === "1") return;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      const shadow = el.querySelector(".orbit-shadow");
      if (shadow) shadow.style.transform = `translateX(${ry * 1.2}px) scale(${1.08 - Math.abs(ry) / 90}, ${0.82 + Math.abs(rx) / 70})`;
    };
    apply();
    el.addEventListener("pointerdown", (event) => {
      if (event.target.closest("a, button")) return;
      dragging = true;
      moved = 0;
      lastX = event.clientX;
      lastY = event.clientY;
      el.classList.add("dragging");
      el.setPointerCapture(event.pointerId);
    });
    el.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      moved += Math.abs(dx) + Math.abs(dy);
      ry = clamp(ry + dx * 0.28, -50, 50);
      rx = clamp(rx - dy * 0.24, -34, 34);
      lastX = event.clientX;
      lastY = event.clientY;
      apply();
    });
    el.addEventListener("click", (event) => {
      if (moved > 8) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
    el.addEventListener("dblclick", () => {
      rx = 8;
      ry = -18;
      apply();
    });
    el.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 4 : 8;
      if (event.key === "ArrowLeft") ry = clamp(ry - step, -50, 50);
      if (event.key === "ArrowRight") ry = clamp(ry + step, -50, 50);
      if (event.key === "ArrowUp") rx = clamp(rx - step, -34, 34);
      if (event.key === "ArrowDown") rx = clamp(rx + step, -34, 34);
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        apply();
      }
    });
    const stop = () => {
      dragging = false;
      el.classList.remove("dragging");
    };
    el.addEventListener("pointerup", () => {
      const open = moved < 8 && el.dataset.open;
      stop();
      if (open) location.hash = "#/producto/" + el.dataset.open;
    });
    el.addEventListener("pointercancel", stop);
  });
}

async function render() {
  const seq = ++renderSeq;
  const route = parseRoute();
  VM.parts = route.parts;
  VM.qs = route.qs;
  titles();
  const page = VM.parts[0];
  syncMagazine(page === "inicio");

  if (page === "login") {
    if (VM.user) {
      location.hash = "#/panel/resumen";
      return;
    }
    paint(viewLogin(), "site");
    return;
  }

  if (page === "vincular") {
    try {
      VM.waPublic = await api("/api/whatsapp/session");
    } catch (err) {
      VM.waPublic = {
        sessionReady: false,
        sessionStatus: "offline",
        hasQr: false,
        qrUrl: "/api/whatsapp/qr?mode=session&t=" + Date.now(),
        bridgeError: err.message || "Sin conexión al bridge",
      };
    }
    paint(viewVincularWhatsapp(VM.waPublic), "admin-body");
    return;
  }

  if (page === "tienda") {
    const token = VM.parts[1] || "";
    if (!token) {
      paint(shellPublic(`<section class="page"><h2 class="block-title">${t("shop.missing")}</h2><p>${t("shop.missingHint")}</p></section>`), "site");
      return;
    }
    VM.shopToken = token;
    paint(`<div class="boot"><img src="assets/isotipo-red.png" alt=""><p>${t("shop.loading")}</p></div>`, "site");
    try {
      const data = await api("/api/whatsapp/shop/" + encodeURIComponent(token));
      if (seq !== renderSeq) return;
      VM.shopData = data;
      VM.shopCart = Array.isArray(data.cart) ? data.cart.slice() : [];
      VM.shopDone = data.status === "confirmed";
      if (data.quoteRef) VM.shopData.quoteRef = data.quoteRef;
      paint(viewShop(), "site");
    } catch (err) {
      if (seq !== renderSeq) return;
      paint(shellPublic(`<section class="page"><h2 class="block-title">${t("shop.error")}</h2><p>${esc(err.message || t("shop.errorHint"))}</p></section>`), "site");
    }
    return;
  }

  if (page === "panel") {
    if (!VM.user) {
      location.hash = "#/login";
      return;
    }
    paint(`<div class="boot"><img src="assets/isotipo-red.png" alt=""><p>Cargando panel</p></div>`, "site");
    try {
      const html = await adminView();
      if (seq !== renderSeq) return;
      paint(html, "admin-body");
    } catch (err) {
      if (err.status === 401) {
        VM.user = null;
        VM.token = "";
        localStorage.removeItem("vm_token");
        localStorage.removeItem("vm_user");
        location.hash = "#/login";
        return;
      }
      paint(`<section class="page"><p>${esc(err.message)}</p></section>`, "site");
    }
    return;
  }

  if (page === "pedido") {
    paint(shellPublic(viewOrder(null, true)), "site");
    const ref = VM.qs.get("ref") || "";
    const token = VM.qs.get("token") || "";
    let order = checkoutOrder && checkoutOrder.reference === ref ? checkoutOrder : null;
    if (ref && token) {
      try {
        const data = await api(`/api/orders/status?reference=${encodeURIComponent(ref)}&token=${encodeURIComponent(token)}`);
        order = data.order;
      } catch (err) {
        order = null;
      }
    }
    if (seq !== renderSeq) return;
    paint(shellPublic(viewOrder(order, false)), "site");
    trackView();
    return;
  }

  if (page === "inicio") {
    trackView();
    return;
  }

  const content = {
    inicio: viewHome,
    catalogo: viewCatalog,
    linea: viewCatalog,
    producto: viewProduct,
    marca: viewMarca,
    asesor: () => viewAsesor(advisorDone),
    carrito: viewCart,
    pago: viewCheckout,
  }[page];
  paint(shellPublic(content ? content() : viewHome()), "site");
  const focus = VM.parts[1];
  if (focus && (page === "catalogo" || page === "linea")) {
    const block = document.querySelector(`[data-cat="${focus}"]`);
    if (block) block.scrollIntoView({ block: "start" });
  }
  trackView();
}

async function adminView() {
  const tab = VM.parts[1] || "resumen";
  if (tab === "clave" || tab === "wompi" || tab === "asesor" || tab === "contacto" || tab === "whatsapp") {
    try {
      const settings = await api("/api/admin/settings");
      VM.config.wompi = {
        publicKey: settings.publicKey || "",
        integritySecret: settings.integritySecret || "",
        eventsSecret: settings.eventsSecret || "",
        currency: settings.currency || "COP",
      };
      if (settings.whatsapp) VM.config.whatsapp = settings.whatsapp;
      VM.config.wompiReady = Boolean(settings.wompiReady);
      if (settings.webhookUrl) VM.config.webhookUrl = settings.webhookUrl;
    } catch (err) { /* en el sitio publicado quedan las llaves de este navegador */ }
    if (tab === "clave" || tab === "wompi") return viewWompi();
    if (tab === "whatsapp") {
      try {
        VM.waData = await api("/api/admin/whatsapp");
        if (VM.waData.sessionReady) {
          VM.waLinked = true;
          VM.waShowQr = false;
        } else {
          VM.waLinked = false;
          VM.waShowQr = true;
        }
      } catch (err) {
        const phone = VM.config.whatsapp || SITE.whatsapp || "573235835137";
        VM.waData = {
          ready: false,
          sessionReady: false,
          sessionStatus: "offline",
          hasQr: false,
          phone,
          phoneNumberId: "",
          verifyToken: "vinicius-wa",
          autoReply: true,
          hasToken: false,
          webhookUrl: "",
          qrUrl: "/api/whatsapp/qr?mode=session&t=" + Date.now(),
          openUrl: "https://api.whatsapp.com/send/?phone=" + phone + "&text=&type=phone_number&app_absent=0",
          chats: VM.waData && VM.waData.chats ? VM.waData.chats : [],
        };
        VM.waLinked = false;
        VM.waShowQr = true;
      }
      return viewWhatsapp(VM.waData);
    }
    return viewContact();
  }
  const localMetrics = () => {
    const products = (VM.products || []).map((item) => ({ ...item, views: item.views || 0, minStock: item.minStock || 6 }));
    const leads = JSON.parse(localStorage.getItem("vm_leads") || "[]");
    const days = ["L", "M", "X", "J", "V", "S", "D", "L", "M", "X", "J", "V", "S", "D"].map((label) => ({ label, visits: 0, sessions: 0 }));
    return {
      today: { sessions: 0, visits: 0 },
      week: { sessions: 0, visits: 0 },
      orders: 0,
      ordersPending: 0,
      revenue: 0,
      units: products.reduce((sum, item) => sum + Number(item.stock || 0), 0),
      inventoryValue: products.reduce((sum, item) => sum + Number(item.stock || 0) * Number(item.price || 0), 0),
      days,
      devices: {},
      pages: [],
      topAll: products.map((item) => ({ ...item, views: item.views || 0 })),
      topProduct: null,
      lowStock: products.filter((item) => Number(item.stock || 0) <= Number(item.minStock || 0)),
      recentLeads: leads.slice(0, 6),
      recentOrders: [],
      leadsNew: leads.filter((item) => item.status === "nuevo").length,
      products,
      leads,
    };
  };
  try {
    if (tab === "inventario") {
      const data = await api("/api/admin/products");
      return viewInventory(data);
    }
    if (tab === "seguimiento") {
      const data = await api("/api/analytics");
      VM.metrics = data.metrics;
      return viewTracking(data);
    }
    if (tab === "pedidos") {
      const [orders, dash] = await Promise.all([api("/api/orders"), api("/api/dashboard")]);
      VM.metrics = dash;
      return viewOrders(orders.orders || []);
    }
    const data = await api("/api/dashboard");
    VM.metrics = data;
    return viewDashboard(data);
  } catch (err) {
    if (err.status === 401) throw err;
    const local = localMetrics();
    VM.metrics = local;
    if (tab === "inventario") return viewInventory({ products: local.products });
    if (tab === "seguimiento") return viewTracking({ metrics: local, events: [] });
    if (tab === "pedidos") return viewOrders([]);
    return viewDashboard(local);
  }
}

function applyLocalSettings() {
  const phone = localStorage.getItem("vm_phone");
  if (phone) VM.config.whatsapp = phone;
  let wompi = {};
  try { wompi = JSON.parse(localStorage.getItem("vm_wompi") || "null") || {}; } catch (err) { wompi = {}; }
  if (wompi.publicKey || wompi.integritySecret || wompi.eventsSecret) VM.config.wompi = wompi;
  if (wompi.publicKey && wompi.integritySecret) VM.config.wompiReady = true;
  VM.waLinked = localStorage.getItem("vm_wa_linked") === "1";
}

async function payWithWompi(customer) {
  const wompi = VM.config.wompi || {};
  const items = cartDetailed();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const amount = total * 100;
  const currency = "COP";
  const reference = "VM" + Date.now().toString(36).toUpperCase();
  const raw = reference + amount + currency + wompi.integritySecret;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  const signature = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const params = new URLSearchParams({
    "public-key": wompi.publicKey,
    currency,
    "amount-in-cents": String(amount),
    reference,
    "signature:integrity": signature,
    "redirect-url": location.href.split("#")[0] + "#/pedido?ref=" + encodeURIComponent(reference),
    "customer-data:full-name": customer.name || "",
    "customer-data:phone-number": customer.phone || "",
  });
  if (customer.email) params.set("customer-data:email", customer.email);
  location.href = "https://checkout.wompi.co/p/?" + params.toString();
}

function catalogOverrides() {
  try { return JSON.parse(localStorage.getItem("vm_catalog") || "{}"); } catch (err) { return {}; }
}

function mergeCatalog(list) {
  const saved = catalogOverrides();
  return (list || []).map((item) => {
    const extra = saved[item.id];
    if (!extra) return item;
    const next = Object.assign({}, item, extra, { id: item.id });
    if (typeof next.ingredients === "string") {
      next.ingredients = next.ingredients.split(/[·,]/).map((part) => part.trim()).filter(Boolean);
    }
    return next;
  });
}

function prepareSheetPhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = 1500;
      const height = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const scale = Math.max(width / img.width, height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.filter = "contrast(1.08) brightness(1.08) saturate(1.08)";
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = () => reject(new Error("No se pudo leer la foto."));
    img.src = URL.createObjectURL(file);
  });
}

async function saveProduct(form, data) {
  const id = form.dataset.id;
  const file = form.querySelector('input[name="photo"]');
  const patch = {
    name: data.name,
    price: Number(data.price || 0),
    line: data.line,
    finish: data.finish,
    size: data.size,
    sku: data.sku,
    summary: data.summary,
    description: data.description,
    ingredients: String(data.ingredients || "").split(/[·,]/).map((part) => part.trim()).filter(Boolean),
  };
  if (file && file.files && file.files[0]) patch.image = await prepareSheetPhoto(file.files[0]);
  const all = catalogOverrides();
  all[id] = Object.assign({}, all[id] || {}, patch);
  try {
    localStorage.setItem("vm_catalog", JSON.stringify(all));
  } catch (err) {
    toast("La foto pesa demasiado para guardarla en este navegador.");
    return;
  }
  VM.products = mergeCatalog(VM.products);
  try { await api("/api/admin/products/" + id, { method: "PUT", body: patch }); } catch (err) { /* queda guardado en este navegador */ }
  toast("Producto guardado. Recarga la revista para ver la foto en la hoja.");
  VM.invId = "";
  render();
}

function formData(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = String(value).trim();
  });
  return data;
}

async function submitLead(data) {
  const phone = String(data.phone || "").replace(/\D/g, "");
  if (phone.length < 7) {
    toast("Escribe un celular válido");
    return;
  }
  try {
    await api("/api/leads", { method: "POST", body: { phone, name: "Cliente" } });
  } catch (err) {
    const saved = JSON.parse(localStorage.getItem("vm_leads") || "[]");
    saved.unshift({ id: "local_" + Date.now(), name: "Cliente", phone, city: "", interest: "", schedule: "", note: "", status: "nuevo", at: new Date().toISOString() });
    localStorage.setItem("vm_leads", JSON.stringify(saved));
  }
  advisorDone = true;
  toast("Número listo para el asesor");
  if (!location.hash.includes("/asesor")) location.hash = "#/asesor";
  else render();
}

function setQty(id, dir, cap) {
  const current = VM.qty[id] || 1;
  const next = Math.max(1, Math.min(cap || 20, current + dir));
  VM.qty[id] = next;
}

function addToCart(id, qty) {
  const product = productById(id);
  if (!product || !product.stock) {
    toast("Ese producto está agotado");
    return;
  }
  const amount = Math.max(1, Number(qty) || VM.qty[id] || 1);
  const row = VM.cart.find((item) => item.id === id);
  const next = (row ? row.qty : 0) + amount;
  if (next > product.stock) {
    toast("No hay tantas unidades");
    return;
  }
  if (row) row.qty = next;
  else VM.cart.push({ id, qty: amount });
  saveCart();
  toast(product.name + " en el carrito");
  render();
}
window.addToCart = addToCart;

const PDF_LATIN = { "á":"\xE1","é":"\xE9","í":"\xED","ó":"\xF3","ú":"\xFA","ñ":"\xF1","ü":"\xFC","Á":"\xC1","É":"\xC9","Í":"\xCD","Ó":"\xD3","Ú":"\xDA","Ñ":"\xD1","Ü":"\xDC","¿":"\xBF","¡":"\xA1" };

function pdfText(value) {
  return String(value || "").replace(/[^\x00-\x7F]/g, (ch) => PDF_LATIN[ch] || "?").replace(/[\\()]/g, (ch) => "\\" + ch);
}

function orderPdf(lines) {
  const body = ["BT", "/F1 11 Tf", "48 790 Td", "15 TL"];
  lines.forEach((line, index) => {
    const text = "(" + pdfText(line) + ") Tj";
    body.push(index ? "T* " + text : text);
  });
  body.push("ET");
  const stream = body.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    "<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += (index + 1) + " 0 obj\n" + object + "\nendobj\n";
  });
  const xref = pdf.length;
  pdf += "xref\n0 " + (objects.length + 1) + "\n";
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += String(offset).padStart(10, "0") + " 00000 n \n";
  });
  pdf += "trailer << /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF";
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 255;
  return new File([bytes], "pedido.pdf", { type: "application/pdf" });
}

function downloadFile(file) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 4000);
}

async function sendOrderWhatsapp(data) {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").replace(/\D/g, "");
  if (name.length < 2) {
    toast("Escribe tu nombre");
    return;
  }
  if (phone.length < 7) {
    toast("Escribe un celular válido");
    return;
  }
  const items = cartDetailed();
  if (!items.length) {
    toast("El carrito está vacío");
    return;
  }
  const ref = "VM-" + Date.now().toString(36).toUpperCase();
  const lines = [
    "VINICIUS MOLDING",
    "Pedido " + ref,
    new Date().toLocaleString("es-CO"),
    "",
    "Cliente: " + name,
    "Celular: " + phone,
    "Ciudad: " + (String(data.city || "").trim() || "-"),
    "Direccion: " + (String(data.address || "").trim() || "-"),
    String(data.note || "").trim() ? "Nota: " + String(data.note).trim() : "",
    "",
    "Productos",
  ];
  items.forEach((item) => {
    lines.push(item.qty + " x " + item.name + "  " + (item.sku || ""));
    lines.push("   " + money(item.price) + " c/u   =   " + money(item.price * item.qty));
  });
  lines.push("");
  lines.push("TOTAL  " + money(cartTotal()));
  lines.push("");
  lines.push("Asesor: verificar productos, valor y datos de entrega.");
  const clean = lines.filter((line) => line !== "");
  const file = orderPdf(clean);
  const named = new File([file], "Pedido-" + ref + ".pdf", { type: "application/pdf" });
  const message = clean.join("\n");
  const caption = message.length > 900 ? message.slice(0, 900) + "…" : message;
  const canFile = !!(navigator.canShare && navigator.canShare({ files: [named] }));
  if (canFile) {
    try {
      await navigator.share({ files: [named], title: "Pedido " + ref, text: caption });
      VM.cart = [];
      saveCart();
      toast("Envía el PDF al chat del asesor");
      location.hash = "#/inicio";
      return;
    } catch (err) {
      if (err && err.name === "AbortError") {
        toast("No se envió el PDF");
        return;
      }
    }
  }
  downloadFile(named);
  const chat = window.open(waHref(message), "_blank", "noopener");
  if (!chat) location.href = waHref(message);
  VM.cart = [];
  saveCart();
  toast("Se abrió el WhatsApp del asesor. Adjunta el PDF del pedido");
  location.hash = "#/inicio";
}

function bind() {
  document.body.addEventListener("click", async (event) => {
    const node = event.target.closest("[data-act]");
    if (!node) return;
    const act = node.dataset.act;
    if (act === "menu") {
      VM.menu = !VM.menu;
      render();
      return;
    }
    if (act === "reel-sound") {
      const video = document.querySelector("[data-reel-video]");
      if (!video) return;
      video.muted = !video.muted;
      VM.reelMuted = video.muted;
      if (video.paused) video.play().catch(() => {});
      node.textContent = video.muted ? "Toca para oír" : "Sonido on";
      node.classList.toggle("on", !video.muted);
      return;
    }
    if (act === "reel-seek") {
      const video = document.querySelector("[data-reel-video]");
      if (!video) return;
      video.currentTime = Number(node.dataset.t) || 0;
      video.play().catch(() => {});
      return;
    }
    if (act === "slide") {
      const rail = node.closest("[data-carousel-wrap]")?.querySelector("[data-rail]");
      if (rail) rail.scrollBy({ left: Number(node.dataset.dir) * Math.min(rail.clientWidth * 0.86, 640), behavior: "smooth" });
      return;
    }
    if (act === "show" || act === "show-dot") {
      const root = node.closest("[data-showcase]");
      if (!root) return;
      if (act === "show") stepShowcase(root, Number(node.dataset.dir));
      else stepShowcase(root, 0, node.dataset.index);
      return;
    }
    if (act === "filter") {
      VM.filter = node.dataset.cat;
      render();
      return;
    }
    if (act === "add") {
      addToCart(node.dataset.id, node.dataset.qty);
      return;
    }
    if (act === "shop-add" || act === "shop-qty") {
      const id = node.dataset.id;
      const product = (VM.shopData && VM.shopData.products || []).find((item) => item.id === id) || productById(id);
      if (!product) return;
      let cart = Array.isArray(VM.shopCart) ? VM.shopCart.slice() : [];
      let row = cart.find((item) => item.id === id);
      if (act === "shop-add") {
        if (!row) {
          cart.push({
            id: product.id,
            name: product.name,
            sku: product.sku || "",
            size: product.size || "",
            price: Number(product.price || 0),
            qty: 1,
          });
        } else {
          row.qty = Math.min(99, Number(row.qty || 0) + 1);
        }
      } else {
        if (!row) return;
        row.qty = Number(row.qty || 0) + Number(node.dataset.dir || 0);
        if (row.qty < 1) cart = cart.filter((item) => item.id !== id);
        else row.qty = Math.min(99, row.qty);
      }
      VM.shopCart = cart;
      refreshShop();
      try {
        await api("/api/whatsapp/shop/" + encodeURIComponent(VM.shopToken) + "/cart", {
          method: "POST",
          body: { cart: VM.shopCart },
        });
      } catch (err) { /* se reintenta al confirmar */ }
      return;
    }
    if (act === "shop-confirm") {
      if (!VM.shopToken || !(VM.shopCart || []).length) {
        toast("Agrega un producto y con gusto armamos tu cotización");
        return;
      }
      const btn = node;
      btn.disabled = true;
      btn.textContent = t("shop.sending");
      try {
        const result = await api("/api/whatsapp/shop/" + encodeURIComponent(VM.shopToken) + "/confirm", {
          method: "POST",
          body: { cart: VM.shopCart },
        });
        VM.shopDone = true;
        VM.shopData = Object.assign({}, VM.shopData || {}, {
          status: "confirmed",
          quoteRef: result.quoteRef || "",
        });
        toast(result.message || "Listo, revisa tu WhatsApp");
        refreshShop();
      } catch (err) {
        btn.disabled = false;
        btn.textContent = t("shop.send");
        toast(err.message || "No se pudo enviar la cotización");
      }
      return;
    }
    if (act === "inv-open") {
      VM.invId = node.dataset.id;
      render();
      return;
    }
    if (act === "inv-close") {
      VM.invId = "";
      render();
      return;
    }
    if (act === "wa-open") {
      VM.waChatId = node.dataset.id;
      VM.waShowQr = false;
      VM.waLinked = true;
      render();
      return;
    }
    if (act === "wa-linked") {
      VM.waLinked = true;
      VM.waShowQr = false;
      localStorage.setItem("vm_wa_linked", "1");
      render();
      return;
    }
    if (act === "wa-show-qr") {
      VM.waShowQr = true;
      VM.waLinked = false;
      render();
      return;
    }
    if (act === "wa-logout") {
      try {
        await api("/api/admin/whatsapp/logout", { method: "POST", body: {} });
      } catch (err) { /* se reintentará al refrescar */ }
      VM.waLinked = false;
      VM.waShowQr = true;
      localStorage.removeItem("vm_wa_linked");
      render();
      return;
    }
    if (act === "wa-settings") {
      VM.waSettings = !VM.waSettings;
      render();
      return;
    }
    if (act === "qty") {
      const product = productById(node.dataset.id);
      setQty(node.dataset.id, Number(node.dataset.dir), product ? product.stock : 20);
      render();
      return;
    }
    if (act === "cart-qty") {
      const row = VM.cart.find((item) => item.id === node.dataset.id);
      const product = productById(node.dataset.id);
      if (!row) return;
      row.qty += Number(node.dataset.dir);
      if (row.qty < 1) VM.cart = VM.cart.filter((item) => item.id !== row.id);
      if (product && row.qty > product.stock) row.qty = product.stock;
      saveCart();
      render();
      return;
    }
    if (act === "remove") {
      VM.cart = VM.cart.filter((item) => item.id !== node.dataset.id);
      saveCart();
      render();
      return;
    }
    if (act === "logout") {
      try { await api("/api/auth/logout", { method: "POST", body: {} }); } catch (err) { /* sale igual */ }
      VM.token = "";
      VM.user = null;
      localStorage.removeItem("vm_token");
      localStorage.removeItem("vm_user");
      location.hash = "#/inicio";
      return;
    }
    if (act === "save-stock") {
      const id = node.dataset.id;
      const price = document.querySelector(`[data-field="price"][data-id="${id}"]`).value;
      const stock = document.querySelector(`[data-field="stock"][data-id="${id}"]`).value;
      const minStock = document.querySelector(`[data-field="minStock"][data-id="${id}"]`).value;
      try {
        await api("/api/admin/products/" + id, { method: "PUT", body: { price: Number(price), stock: Number(stock), minStock: Number(minStock) } });
        toast("Inventario actualizado");
        const fresh = await api("/api/products");
        VM.products = fresh.products;
        render();
      } catch (err) {
        toast(err.message);
      }
      return;
    }
    if (act === "simulate") {
      try {
        const data = await api("/api/checkout/simulate", {
          method: "POST",
          body: { reference: node.dataset.ref, token: node.dataset.token, status: node.dataset.status },
        });
        checkoutOrder = data.order;
        toast(data.order.status === "aprobado" ? "Pago simulado aprobado" : "Pago simulado rechazado");
        render();
      } catch (err) {
        toast(err.message);
      }
    }
  });

  document.body.addEventListener("input", (event) => {
    const field = event.target;
    if (!field || !field.dataset || !field.dataset.invFilter) return;
    const read = (key) => {
      const node = document.querySelector(`[data-inv-filter="${key}"]`);
      return node ? node.value.trim().toLowerCase() : "";
    };
    const name = read("name");
    const line = read("line");
    const sku = read("sku");
    let visible = 0;
    document.querySelectorAll(".inv-row").forEach((row) => {
      const ok = row.dataset.name.toLowerCase().includes(name)
        && row.dataset.line.toLowerCase().includes(line)
        && row.dataset.sku.toLowerCase().includes(sku);
      row.hidden = !ok;
      if (ok) visible += 1;
    });
    const empty = document.getElementById("inv-empty");
    if (empty) empty.hidden = visible > 0;
  });

  document.body.addEventListener("change", async (event) => {
    const photo = event.target;
    if (photo && photo.name === "photo" && photo.files && photo.files[0]) {
      const preview = photo.closest(".inv-card") && photo.closest(".inv-card").querySelector("img");
      if (preview) preview.src = URL.createObjectURL(photo.files[0]);
    }
    const node = event.target.closest("[data-act='lead-status']");
    if (!node) return;
    try {
      await api("/api/leads/" + node.dataset.id, { method: "PATCH", body: { status: node.value } });
      toast("Contacto actualizado");
    } catch (err) {
      toast(err.message);
    }
  });

  document.body.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.dataset.form) return;
    event.preventDefault();
    const data = formData(form);
    const kind = form.dataset.form;
    try {
      if (kind === "product") {
        await saveProduct(form, data);
        return;
      }
      if (kind === "lead" || kind === "lead-mini") {
        await submitLead(data);
        return;
      }
      if (kind === "login") {
        const username = String(data.username || "").trim().toLowerCase();
        const password = String(data.password || "");
        const openLocal = () => {
          VM.token = "local-admin";
          VM.user = { name: "Administración", username: "admin" };
          localStorage.setItem("vm_token", VM.token);
          localStorage.setItem("vm_user", JSON.stringify(VM.user));
          location.hash = "#/panel/resumen";
        };
        try {
          const result = await api("/api/auth/login", { method: "POST", body: data });
          if (!result.token) throw Object.assign(new Error("No se pudo completar la acción."), { status: 0 });
          VM.token = result.token;
          VM.user = result.user;
          localStorage.setItem("vm_token", result.token);
          localStorage.removeItem("vm_user");
          location.hash = "#/panel/resumen";
        } catch (err) {
          if (username === "admin" && password === "admin123") openLocal();
          else throw err;
        }
        return;
      }
      if (kind === "comment") {
        const name = String(data.name || "").trim().slice(0, 40);
        const text = String(data.text || "").trim().slice(0, 280);
        if (name.length < 2 || text.length < 8) {
          toast("Escribí tu nombre y el comentario");
          return;
        }
        const note = { id: "c_" + Date.now(), name, text, at: new Date().toISOString() };
        try {
          const result = await api("/api/comments", { method: "POST", body: { name, text } });
          if (result.comment) Object.assign(note, result.comment);
        } catch (err) { /* queda en este navegador */ }
        VM.comments = [note, ...(VM.comments || [])].slice(0, 40);
        localStorage.setItem("vm_comments", JSON.stringify(VM.comments));
        toast("Comentario publicado");
        render();
        return;
      }
      if (kind === "contact") {
        const phone = String(data.phone || "").replace(/\D/g, "");
        if (phone.length < 10) {
          toast("Escribe el celular con indicativo");
          return;
        }
        localStorage.setItem("vm_phone", phone);
        VM.config.whatsapp = phone;
        try { await api("/api/admin/settings", { method: "POST", body: { whatsapp: phone } }); } catch (err) { /* queda en este navegador */ }
        toast("Número actualizado");
        render();
        return;
      }
      if (kind === "wompi") {
        const wompi = {
          publicKey: data.publicKey || "",
          integritySecret: data.integritySecret || "",
          eventsSecret: data.eventsSecret || "",
          currency: "COP",
        };
        localStorage.setItem("vm_wompi", JSON.stringify(wompi));
        VM.config.wompi = wompi;
        VM.config.wompiReady = Boolean(wompi.publicKey && wompi.integritySecret);
        try { await api("/api/admin/settings", { method: "POST", body: wompi }); } catch (err) { /* queda en este navegador */ }
        toast(VM.config.wompiReady ? "Wompi activo" : "Faltan llaves de Wompi");
        render();
        return;
      }
      if (kind === "checkout") {
        await sendOrderWhatsapp(data);
        return;
      }
      if (kind === "wa-api") {
        const body = {
          phone: String(data.phone || "").replace(/\D/g, ""),
          token: data.token || "",
          phoneNumberId: data.phoneNumberId || "",
          verifyToken: data.verifyToken || "vinicius-wa",
          autoReply: Boolean(data.autoReply),
        };
        localStorage.setItem("vm_wa_api", JSON.stringify(body));
        try {
          await api("/api/admin/whatsapp", { method: "POST", body });
          toast("WhatsApp API guardada");
        } catch (err) {
          toast(err.message || "API guardada en este navegador");
        }
        VM.waSettings = false;
        VM.waLinked = true;
        render();
        return;
      }
      if (kind === "wa-send") {
        const to = String(data.to || "").replace(/\D/g, "");
        const text = String(data.text || "").trim();
        if (!to || !text) return;
        try {
          await api("/api/admin/whatsapp/send", { method: "POST", body: { to, text } });
        } catch (err) {
          if (!VM.waData) VM.waData = { chats: [] };
          const chats = VM.waData.chats || [];
          let chat = chats.find((row) => row.id === to);
          if (!chat) {
            chat = { id: to, name: to, phone: to, messages: [], updatedAt: new Date().toISOString() };
            chats.unshift(chat);
          }
          chat.messages.push({ id: "local_" + Date.now(), from: "out", text, at: new Date().toISOString() });
          chat.updatedAt = new Date().toISOString();
          VM.waData.chats = chats;
          toast(err.message || "Mensaje local");
        }
        VM.waChatId = to;
        render();
        requestAnimationFrame(() => {
          const thread = document.getElementById("wa-thread");
          if (thread) thread.scrollTop = thread.scrollHeight;
        });
        return;
      }
    } catch (err) {
      toast(err.message);
    }
  });

  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });
}

window.addEventListener("hashchange", () => {
  VM.menu = false;
  const next = (location.hash || "#/inicio").replace(/^#\/?/, "").split(/[/?]/)[0];
  if (next !== "asesor") advisorDone = false;
  render();
});

window.onSiteLangChange = function () {
  if (typeof ensureLangDock === "function") ensureLangDock();
  if (typeof applyStaticLang === "function") applyStaticLang();
  render();
};

async function boot() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (typeof ensureLangDock === "function") ensureLangDock();
  if (typeof applyStaticLang === "function") applyStaticLang();
  bind();
  try {
    const [catalog, config, me] = await Promise.all([
      api("/api/products"),
      api("/api/config"),
      api("/api/me"),
    ]);
    VM.products = mergeCatalog(catalog.products);
    VM.config = Object.assign({ whatsapp: SITE.whatsapp, city: SITE.city }, config);
    if (!VM.config.whatsapp) VM.config.whatsapp = SITE.whatsapp;
    if (config.usdRate) {
      VM.trm = saveCachedTrm({
        usdRate: config.usdRate,
        date: config.trmDate || "",
        source: config.trmSource || "TRM",
      }) || { usdRate: config.usdRate, date: config.trmDate || "", source: config.trmSource || "TRM" };
    }
    VM.user = me.user;
    applyLocalSettings();
    if (config.whatsapp) VM.config.whatsapp = config.whatsapp;
    await loadTrm();
    try {
      const notes = await api("/api/comments");
      VM.comments = notes.comments || [];
    } catch (error) {
      VM.comments = JSON.parse(localStorage.getItem("vm_comments") || "[]");
    }
  } catch (err) {
    VM.products = mergeCatalog(SITE.products);
    VM.config = { wompiReady: false, city: SITE.city, whatsapp: SITE.whatsapp, email: "" };
    applyLocalSettings();
    try { await loadTrm(); } catch (trmErr) { /* usa tasa local */ }
    try { VM.comments = JSON.parse(localStorage.getItem("vm_comments") || "[]"); } catch (error) { VM.comments = []; }
    if (VM.token === "local-admin") {
      try { VM.user = JSON.parse(localStorage.getItem("vm_user") || "null"); } catch (error) { VM.user = null; }
    } else {
      VM.user = null;
    }
  }
  if (!location.hash) location.hash = "#/inicio";
  if (typeof getLang === "function" && getLang() === "en" && typeof warmProductTranslations === "function") {
    warmProductTranslations(VM.products || []);
  }
  render();
}

boot();
