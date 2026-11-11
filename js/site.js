const TESTIMONIOS = [
  { initials: "AM", name: "Andrés M.", product: "Kit Capilar", text: "Desde que uso Vinicius Molding siento mi cabello más fuerte y con mejor apariencia. Me encantó el resultado." },
  { initials: "JC", name: "Juan C.", product: "Shampoo", text: "El shampoo deja el cabello limpio, suave y con una sensación muy agradable. Ya se volvió parte de mi rutina." },
  { initials: "SR", name: "Sebastián R.", product: "Tónico Capilar", text: "Llevo varias semanas usando el tónico y estoy muy satisfecho con cómo se ve mi cabello. Excelente producto." },
  { initials: "DP", name: "David P.", product: "Kit Completo", text: "Compré el kit completo y me gustó mucho la combinación de productos. Mi cabello se siente más cuidado y saludable." },
];

const PIECE_WORDS = ["Cero", "Una pieza", "Dos piezas", "Tres piezas", "Cuatro piezas", "Cinco piezas", "Seis piezas", "Siete piezas", "Ocho piezas", "Nueve piezas", "Diez piezas", "Once piezas", "Doce piezas", "Trece piezas", "Catorce piezas"];

function pieceLabel(n) {
  if (typeof t === "function") {
    if (n === 0) return t("piece.0");
    if (n === 1) return t("piece.1");
    return t("piece.n", { n });
  }
  return PIECE_WORDS[n] || `${n} piezas`;
}

const CATALOG = [
  { id: "molding", name: "Línea Molding", blurb: "Ceras, pasta, pomada y gel para armar el peinado y sostenerlo." },
  { id: "kits", name: "Kits y combos", blurb: "Rutinas completas de crecimiento, restauración y cuidado capilar." },
  { id: "limpieza", name: "Limpieza", blurb: "Shampoos sin sal y ducha íntima." },
  { id: "tratamiento", name: "Tratamiento", blurb: "Tónico para el cuero cabelludo y serum de barba." },
  { id: "kids", name: "Kids", blurb: "La cera de fibra, en una edición para los más jóvenes." },
  { id: "cuerpo", name: "Cuerpo", blurb: "Splash y gel de afeitado para la rutina de cada día." },
];

const SITE = {
  whatsapp: "573235835137",
  city: "Cali, Valle del Cauca",
  apiBase: "https://grey-rid-gorgeous-toolkit.trycloudflare.com",
  siteBase: "https://danielbuitron.github.io/Vinicius_Molding",
  usdRate: 4000, // fallback si la TRM del BanRep no carga
  products: [
    { id: "cera-brillo", sku: "VM-CB-150", name: "Cera moldeadora", line: "Línea Molding", finish: "Brillo medio", category: "molding", size: "150 g", price: 36000, stock: 56, accent: "#E52C3B", image: "assets/products/cera-brillo.jpg", summary: "Define y moldea con brillo medio. Keratina, romero y aloe vera.", description: "Cera moldeadora de brillo medio. Keratina, romero, aloe vera y cera de abeja para un peinado que se mantiene.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "cera-fibra", sku: "VM-CF-150", name: "Cera y fibra", line: "Línea Molding", finish: "Acabado húmedo", category: "molding", size: "150 g", price: 36000, stock: 48, accent: "#6D4AFF", image: "assets/products/cera-fibra.jpg", summary: "Acabado húmedo con textura, como salido de la barbería.", description: "Cera y fibra en una sola fórmula para un acabado húmedo con textura. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "pasta", sku: "VM-PA-150", name: "Pasta moldeadora", line: "Línea Molding", finish: "Brillante", category: "molding", size: "150 g", price: 36000, stock: 34, accent: "#00C8C2", image: "assets/products/pasta.jpg", summary: "Brillo elegante y fijación para un aspecto profesional.", description: "Pasta moldeadora brillante. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "pomada", sku: "VM-PM-150", name: "Pomada", line: "Línea Molding", finish: "Acabado mate", category: "molding", size: "150 g", price: 36000, stock: 40, accent: "#FFD300", image: "assets/products/pomada.jpg", summary: "Control para el cabello rebelde, con acabado mate.", description: "Pomada moldeadora mate. Keratina, romero, aloe vera y cera de abeja para un peinado natural.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 5, featured: false },
    { id: "gel-cubre-canas", sku: "VM-GC-150", name: "Cubre canas", line: "Línea Molding", finish: "Acabado húmedo brillante", category: "molding", size: "150 g", price: 36000, stock: 28, accent: "#C5CAD1", image: "assets/products/gel-cubre-canas.jpg", summary: "Cubre las canas con un acabado húmedo brillante.", description: "Gel cubre canas. Acabado húmedo brillante. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: true },
    { id: "pasta-minoxidil", sku: "VM-PX-150", name: "Pasta minoxidil", line: "Línea Molding", finish: "A base de cera de abeja", category: "molding", size: "150 g", price: 36000, stock: 22, accent: "#2EE6D0", image: "assets/products/pasta-minoxidil.jpg", summary: "Pasta con minoxidil, pantenol y romero.", description: "Pasta minoxidil. Minoxidil, pantenol y romero, a base de cera de abeja. Usar en pelo seco o semi seco.", ingredients: ["Minoxidil", "Pantenol", "Romero", "Cera de abeja"], hold: 3, featured: true },
    { id: "cera-kids", sku: "VM-KD-150", name: "Cera niños", line: "Línea Molding", finish: "Fijación suave", category: "kids", size: "150 g", price: 36000, stock: 8, accent: "#E52C3B", image: "assets/products/cera-kids.jpg", summary: "Fórmula suave para el cabello de los más jóvenes.", description: "Cera de fibra Kids. Fijación pensada para cabello infantil, con keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: false },
    { id: "shampoo-proteccion", sku: "VM-SH-500", name: "Shampoo protección capilar", line: "Línea Cuidado personal", finish: "Sin sal", category: "limpieza", size: "500 g", price: 49000, stock: 62, accent: "#E52C3B", image: "assets/products/shampoo-proteccion.jpg", summary: "Fortalece el cabello y ayuda a reducir la caída por quiebre. Sin sal.", description: "Shampoo de protección capilar con romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico. Fórmula sin sal.", ingredients: ["Romero", "Keratina", "Cebolla", "Aloe vera", "Zanahoria", "Ácido hialurónico"], hold: null, featured: true },
    { id: "shampoo-carbon", sku: "VM-SC-500", name: "Shampoo anticaspa carbón activo", line: "Línea Cuidado personal", finish: "Sin sal", category: "limpieza", size: "500 ml", price: 49000, stock: 44, accent: "#FFD300", image: "assets/products/shampoo-carbon.jpg", summary: "Ayuda a eliminar la caspa y controla el exceso de grasa. Sin sal.", description: "Shampoo de carbón activo. Adiós caspa y picazón. Romero, keratina, cebolla, aloe vera y ácido hialurónico. Sin sal.", ingredients: ["Carbón activo", "Romero", "Keratina", "Cebolla", "Aloe vera", "Ácido hialurónico"], hold: null, featured: true },
    { id: "ducha-intima", sku: "VM-DI-180", name: "Ducha íntima", line: "Línea Cuidado personal", finish: "For men", category: "limpieza", size: "180 g", price: 29000, stock: 38, accent: "#A4D800", image: "assets/products/ducha-intima.jpg", summary: "Higiene masculina. Sin fragancia, colorantes ni parabenos.", description: "Ducha íntima for men. Fórmula sin fragancia, sin colorantes y sin parabenos.", ingredients: ["Sin fragancia", "Sin colorantes", "Sin parabenos"], hold: null, featured: false },
    { id: "tonico", sku: "VM-TO-065", name: "Tónico orgánico", line: "Línea Cuidado personal", finish: "Cabello, barba y cejas", category: "tratamiento", size: "65 ml", price: 67000, stock: 31, accent: "#FFD300", image: "assets/products/tonico.jpg", summary: "Nutre, fortalece y estimula el crecimiento.", description: "Tónico orgánico para cabello, barba y cejas. Romero, biotina, queratina, ácido hialurónico y aloe vera.", ingredients: ["Romero", "Biotina", "Queratina", "Ácido hialurónico", "Aloe vera"], hold: null, featured: true },
    { id: "tonico-minoxidil", sku: "VM-TM-065", name: "Tónico Minoxidil 12.5%", line: "Línea Cuidado personal", finish: "Cabello, barba y cejas", category: "tratamiento", size: "65 ml", price: 47000, stock: 24, accent: "#00C8C2", image: "assets/products/tonico-minoxidil.jpg", summary: "Nutre, fortalece y estimula el crecimiento con minoxidil 12.5%.", description: "Tónico Minoxidil 12.5% para cabello, barba y cejas. Estimula el crecimiento y fortalece el folículo.", ingredients: ["Minoxidil 12.5%", "Romero", "Aloe vera"], hold: null, featured: true },
    { id: "serum-barba", sku: "VM-SB-065", name: "Serum barba y crecimiento", line: "Línea Cuidado personal", finish: "Acondiciona", category: "tratamiento", size: "65 ml", price: 30000, stock: 27, accent: "#A4D800", image: "assets/products/serum-barba.jpg", summary: "Nutre, suaviza y fortalece la barba.", description: "Serum para barba y bigote. Aceite de argán, jojoba y aloe vera para peinarla y darle brillo.", ingredients: ["Aceite de argán", "Jojoba", "Aloe vera"], hold: null, featured: true },
    { id: "splash", sku: "VM-BS-250", name: "Body splash for men", line: "Línea Cuidado personal", finish: "For men", category: "cuerpo", size: "250 ml", price: 29000, stock: 36, accent: "#4BA3DC", image: "assets/products/splash.jpg", summary: "Splash corporal. Eucalipto y mentol.", description: "Body splash for men. Se aplica en la zona del cuerpo que se requiera. Agua, alcohol, eucalipto y mentol.", ingredients: ["Eucalipto", "Mentol", "Alcohol"], hold: null, featured: true },
    { id: "shaving-gel", sku: "VM-SG-250", name: "Shaving gel for men", line: "Línea Cuidado personal", finish: "Con aloe vera", category: "cuerpo", size: "250 ml", price: 29000, stock: 33, accent: "#FF6A00", image: "assets/products/shaving-gel.jpg", summary: "Gel de afeitar for men. Con aloe vera.", description: "Shaving gel for men. Contiene aloe vera. 250 ml.", ingredients: ["Aloe vera", "Eucalipto", "Mentol"], hold: null, featured: true },
    { id: "kit-capilar", sku: "VM-KIT-CAP", name: "Kit Capilar", line: "Kits y combos", finish: "Anticaída", category: "kits", size: "Combo", price: 156000, stock: 18, accent: "#E52C3B", image: "assets/products/kit-capilar.jpg", summary: "Fortalece el cabello y ayuda a reducir la caída.", description: "Kit Capilar pensado para fortalecer el cabello y ayudar a reducir la caída con una rutina completa.", ingredients: ["Shampoo", "Tónico", "Rutina diaria"], hold: null, featured: true },
    { id: "kit-capilar-avanzado", sku: "VM-KIT-AVA", name: "Kit Capilar Avanzado", line: "Kits y combos", finish: "Con dermaroller", category: "kits", size: "Combo", price: 189000, stock: 14, accent: "#00C8C2", image: "assets/products/kit-capilar-avanzado.jpg", summary: "Cabello, barba y cejas con dermaroller de microagujas.", description: "Kit Capilar Avanzado para cabello, barba y cejas. Incluye dermaroller para complementar la rutina mediante microagujas.", ingredients: ["Tónico", "Dermaroller", "Cuidado avanzado"], hold: null, featured: true },
    { id: "kit-capilar-avanzado-plus", sku: "VM-KIT-AVP", name: "Kit Capilar Avanzado Plus", line: "Kits y combos", finish: "Barba y cejas", category: "kits", size: "Combo", price: 119000, stock: 16, accent: "#6D4AFF", image: "assets/products/kit-capilar-avanzado-plus.jpg", summary: "Rutina avanzada para cabello, barba y cejas.", description: "Kit Capilar Avanzado con enfoque en cabello, barba y cejas. Complementa la rutina con dermaroller.", ingredients: ["Tónico", "Dermaroller"], hold: null, featured: true },
    { id: "kit-capilar-completo", sku: "VM-KIT-COM", name: "Kit Capilar Completo", line: "Kits y combos", finish: "Con dermaroller", category: "kits", size: "Combo", price: 101000, stock: 20, accent: "#FFD300", image: "assets/products/kit-capilar-completo.jpg", summary: "Rutina completa con dermaroller de microagujas.", description: "Kit capilar completo. El dermaroller complementa la rutina capilar mediante microagujas.", ingredients: ["Rutina completa", "Dermaroller"], hold: null, featured: true },
    { id: "kit-12-5", sku: "VM-KIT-125", name: "Kit Capilar 12.5%", line: "Kits y combos", finish: "Tónico + rodillo", category: "kits", size: "Combo", price: 67000, stock: 22, accent: "#A4D800", image: "assets/products/kit-12-5.jpg", summary: "Tónico 12.5% + rodillo para cabello, barba y cejas.", description: "Kit Capilar, Barba y Cejas 12.5%. Incluye tónico y rodillo de microagujas.", ingredients: ["Tónico 12.5%", "Dermaroller"], hold: null, featured: true },
    { id: "kit-crecimiento-23", sku: "VM-KIT-23", name: "Kit Crecimiento Capilar 23%", line: "Kits y combos", finish: "Anticaída", category: "kits", size: "Combo", price: 205000, stock: 12, accent: "#E52C3B", image: "assets/products/kit-crecimiento-23.jpg", summary: "Fortalece y ayuda a combatir la caída capilar.", description: "Kit de crecimiento capilar 23% para fortalecer y ayudar a combatir la caída.", ingredients: ["Tratamiento 23%", "Rutina intensiva"], hold: null, featured: true },
    { id: "kit-organico", sku: "VM-KIT-ORG", name: "Kit Orgánico", line: "Kits y combos", finish: "Con dermaroller", category: "kits", size: "Combo", price: 119000, stock: 15, accent: "#00C8C2", image: "assets/products/kit-organico.jpg", summary: "Cabello, barba y cejas con dermaroller.", description: "Kit Orgánico para cabello, barba y cejas. Complementa la rutina con dermaroller de microagujas.", ingredients: ["Tónico orgánico", "Dermaroller"], hold: null, featured: true },
    { id: "kit-organico-avanzado", sku: "VM-KIT-ORA", name: "Kit Orgánico Avanzado", line: "Kits y combos", finish: "Con rodillo", category: "kits", size: "Combo", price: 189000, stock: 11, accent: "#FFD300", image: "assets/products/kit-organico-avanzado.jpg", summary: "Tratamiento de crecimiento para cabello, barba y cejas + rodillo.", description: "Kit Orgánico Avanzado: tratamiento de crecimiento para cabello, barba y cejas con rodillo de microagujas.", ingredients: ["Tónico orgánico", "Dermaroller", "Rutina avanzada"], hold: null, featured: true },
    { id: "kit-restaurador", sku: "VM-KIT-RES", name: "Kit Restaurador Capilar", line: "Kits y combos", finish: "Shampoo + tónico", category: "kits", size: "Combo", price: 205000, stock: 10, accent: "#585E65", image: "assets/products/kit-restaurador.jpg", summary: "Shampoo + tónico orgánico para combatir la caída.", description: "Kit Restaurador Capilar con shampoo y tónico orgánico. Fortalece y ayuda a combatir la caída capilar.", ingredients: ["Shampoo", "Tónico orgánico"], hold: null, featured: true }
  ]
};

function waHref(text) {
  const number = (VM.config && VM.config.whatsapp) || SITE.whatsapp;
  const fallback = typeof t === "function" ? t("wa.default") : "Hola, quiero hablar con un asesor de Vinicius Molding.";
  const msg = encodeURIComponent(text || fallback);
  return "https://wa.me/" + number + "?text=" + msg;
}

function iconWhatsapp() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.13-.28.28-.12.54.16.27.71 1.17 1.52 1.89 1.05.93 1.93 1.22 2.2 1.36.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.13.44.2.51.31.06.11.06.64-.18 1.32z"/></svg>';
}

function cutoutSrc(src) {
  return String(src || "").replace(/\.jpe?g(\?.*)?$/i, ".png$1");
}

function productShot(src, alt, id) {
  const href = id ? `#/producto/${esc(id)}` : "";
  const tag = href ? "a" : "div";
  const link = href ? ` href="${href}"` : "";
  return `<${tag} class="product-shot"${link} aria-label="${esc(alt)}">
    <img src="${esc(cutoutSrc(src))}" alt="${esc(alt)}" decoding="async" draggable="false">
  </${tag}>`;
}

/** Compat: deja de usar el viewer 3D; muestra solo la foto. */
function orbit(src, alt, id) {
  return productShot(src, alt, id);
}

function recommendedFor(product) {
  const rest = VM.products.filter((item) => item.id !== product.id);
  const same = rest.filter((item) => item.category === product.category);
  const other = rest.filter((item) => item.category !== product.category);
  return same.concat(other).slice(0, 8);
}
