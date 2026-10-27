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
    document.title = "Vinicius Molding · Cuidado capilar masculino";
    return;
  }
  if (page === "producto") {
    const product = productById(VM.parts[1]);
    document.title = (product ? product.name : "Producto") + " · Vinicius Molding";
    return;
  }
  const names = {
    catalogo: "Catálogo",
    linea: "Catálogo",
    carrito: "Carrito",
    pago: "Pago",
    pedido: "Pedido",
    login: "Ingresar",
    panel: "Panel",
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

function paint(html, bodyClass) {
  document.body.className = bodyClass;
  document.getElementById("app").innerHTML = html;
  const route = location.hash || "#/inicio";
  if (route !== paintedRoute) {
    paintedRoute = route;
    scrollToStart();
  }
  const header = document.querySelector(".site-header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  bindOrbits();
  if (typeof mountVolumes === "function") mountVolumes();
  bindShowcases();
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

  if (page === "login") {
    if (VM.user) {
      location.hash = "#/panel/resumen";
      return;
    }
    paint(viewLogin(), "site");
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
  if (tab === "clave" || tab === "wompi" || tab === "asesor" || tab === "contacto") {
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

  document.body.addEventListener("change", async (event) => {
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
        const items = cartDetailed().map((item) => ({ id: item.id, qty: item.qty }));
        try {
          const result = await api("/api/checkout", {
            method: "POST",
            body: { items, customer: data },
          });
          checkoutOrder = result.order;
          VM.cart = [];
          saveCart();
          if (result.checkoutUrl) {
            location.href = result.checkoutUrl;
            return;
          }
          location.hash = `#/pedido?ref=${encodeURIComponent(result.reference)}&token=${encodeURIComponent(result.order.token)}`;
          return;
        } catch (err) {
          if (!(VM.config.wompi && VM.config.wompi.publicKey && VM.config.wompi.integritySecret)) throw err;
        }
        await payWithWompi(data);
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

async function boot() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  bind();
  try {
    const [catalog, config, me] = await Promise.all([
      api("/api/products"),
      api("/api/config"),
      api("/api/me"),
    ]);
    VM.products = catalog.products;
    VM.config = Object.assign({ whatsapp: SITE.whatsapp, city: SITE.city }, config);
    if (!VM.config.whatsapp) VM.config.whatsapp = SITE.whatsapp;
    VM.user = me.user;
    applyLocalSettings();
    if (config.whatsapp) VM.config.whatsapp = config.whatsapp;
  } catch (err) {
    VM.products = SITE.products;
    VM.config = { wompiReady: false, city: SITE.city, whatsapp: SITE.whatsapp, email: "" };
    applyLocalSettings();
    if (VM.token === "local-admin") {
      try { VM.user = JSON.parse(localStorage.getItem("vm_user") || "null"); } catch (error) { VM.user = null; }
    } else {
      VM.user = null;
    }
  }
  if (!location.hash) location.hash = "#/inicio";
  render();
}

boot();
