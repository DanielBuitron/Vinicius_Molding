const VM = {
  products: [],
  cart: [],
  user: null,
  config: { wompiReady: false, city: "Cali, Valle del Cauca", whatsapp: "573235835137", email: "" },
  token: localStorage.getItem("vm_token") || "",
  filter: "todos",
  menu: false,
  qty: {},
  parts: [],
  qs: new URLSearchParams(),
  comments: [],
};

try {
  VM.cart = JSON.parse(localStorage.getItem("vm_cart") || "[]");
  if (!Array.isArray(VM.cart)) VM.cart = [];
} catch (err) {
  VM.cart = [];
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function usdRate() {
  const fromConfig = VM && VM.config ? Number(VM.config.usdRate) : 0;
  const fromSite = typeof SITE !== "undefined" ? Number(SITE.usdRate) : 0;
  return fromConfig || fromSite || 4000;
}

function money(value) {
  const amount = Number(value) || 0;
  const currency = typeof getCurrency === "function" ? getCurrency() : "COP";
  if (currency === "USD") {
    const usd = amount / usdRate();
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd);
  }
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function moneyAlt(value) {
  const amount = Number(value) || 0;
  const currency = typeof getCurrency === "function" ? getCurrency() : "COP";
  if (currency === "USD") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / usdRate());
}

function moneyPair(value) {
  const currency = typeof getCurrency === "function" ? getCurrency() : "COP";
  return currency === "USD"
    ? `${money(value)} · ${moneyAlt(value)}`
    : `${money(value)} · ${moneyAlt(value)}`;
}

function sessionId() {
  let id = localStorage.getItem("vm_session");
  if (!id) {
    id = "s_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("vm_session", id);
  }
  return id;
}

function saveCart() {
  localStorage.setItem("vm_cart", JSON.stringify(VM.cart));
}

function cartCount() {
  return VM.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function cartDetailed() {
  return VM.cart.map((item) => {
    const product = VM.products.find((row) => row.id === item.id);
    return product ? { ...product, qty: item.qty } : null;
  }).filter(Boolean);
}

function cartTotal() {
  return cartDetailed().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function productById(id) {
  return VM.products.find((item) => item.id === id);
}

function apiBaseUrl() {
  if (typeof SITE !== "undefined" && !SITE.apiBase) {
    const meta = document.querySelector('meta[name="vm-api-base"]');
    const fromMeta = meta ? String(meta.getAttribute("content") || "").trim() : "";
    if (fromMeta) SITE.apiBase = fromMeta;
  }
  const fromSite = typeof SITE !== "undefined" ? String(SITE.apiBase || "") : "";
  const meta = document.querySelector('meta[name="vm-api-base"]');
  const fromMeta = meta ? String(meta.getAttribute("content") || "") : "";
  return (fromSite || fromMeta || "").replace(/\/$/, "");
}

function apiUrl(path) {
  const raw = String(path || "");
  if (!raw.startsWith("/")) return raw;
  const base = apiBaseUrl();
  const onPages = /\.github\.io$/i.test(location.hostname);
  if (onPages && base) return base + raw;
  return raw;
}

async function api(path, options = {}) {
  const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
  if (VM.token) headers.Authorization = "Bearer " + VM.token;
  const response = await fetch(apiUrl(path), {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = {};
  try {
    data = await response.json();
  } catch (err) {
    data = {};
  }
  if (!response.ok) {
    const error = new Error(data.error || "No se pudo completar la acción.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function toast(message) {
  document.querySelectorAll(".toast").forEach((node) => node.remove());
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

function iconBag() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>';
}

function iconMenu() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
}

function iconClose() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg>';
}

function chevronField() {
  let lines = "";
  for (let i = 0; i < 18; i += 1) {
    const x = 20 + i * 34;
    lines += `<polyline points="${x},20 ${x + 210},360 ${x},700"/>`;
  }
  return `<svg class="chevrons" viewBox="0 0 760 720" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">${lines}</svg>`;
}

function stockLabel(product) {
  if (!product.stock) return `<span class="stock-note out">${t("stock.out")}</span>`;
  if (product.stock <= 8) return `<span class="stock-note">${t("stock.low", { n: product.stock })}</span>`;
  return `<span class="stock-note ok">${t("stock.ok")}</span>`;
}

function categoryName(id) {
  const groups = typeof localizedCatalog === "function" ? localizedCatalog() : (typeof CATALOG !== "undefined" ? CATALOG : []);
  const group = groups.find((item) => item.id === id);
  return group ? group.name : id;
}

function waLink(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) digits = "57" + digits;
  return "https://wa.me/" + digits;
}

function statusLabel(status) {
  const key = "status." + status;
  const label = typeof t === "function" ? t(key) : "";
  return label && label !== key ? label : status;
}
