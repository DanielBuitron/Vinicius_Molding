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

function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
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

async function api(path, options = {}) {
  const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});
  if (VM.token) headers.Authorization = "Bearer " + VM.token;
  const response = await fetch(path, {
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
  if (!product.stock) return '<span class="stock-note out">Agotado</span>';
  if (product.stock <= 8) return `<span class="stock-note">Quedan ${product.stock}</span>`;
  return '<span class="stock-note ok">Disponible</span>';
}

function categoryName(id) {
  const group = (typeof CATALOG !== "undefined" ? CATALOG : []).find((item) => item.id === id);
  return group ? group.name : id;
}

function waLink(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 10) digits = "57" + digits;
  return "https://wa.me/" + digits;
}

function statusLabel(status) {
  return ({
    nuevo: "Nuevo",
    contactado: "Contactado",
    cerrado: "Cerrado",
    pendiente_pago: "Pendiente de pago",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
    anulado: "Anulado",
    error: "Error",
  })[status] || status;
}
