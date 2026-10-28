const TESTIMONIOS = [
  { initials: "AM", name: "Andrés M.", product: "Kit Capilar", text: "Desde que uso Vinicius Molding siento mi cabello más fuerte y con mejor apariencia. Me encantó el resultado." },
  { initials: "JC", name: "Juan C.", product: "Shampoo", text: "El shampoo deja el cabello limpio, suave y con una sensación muy agradable. Ya se volvió parte de mi rutina." },
  { initials: "SR", name: "Sebastián R.", product: "Tónico Capilar", text: "Llevo varias semanas usando el tónico y estoy muy satisfecho con cómo se ve mi cabello. Excelente producto." },
  { initials: "DP", name: "David P.", product: "Kit Completo", text: "Compré el kit completo y me gustó mucho la combinación de productos. Mi cabello se siente más cuidado y saludable." },
];

const PIECE_WORDS = ["Cero", "Una pieza", "Dos piezas", "Tres piezas", "Cuatro piezas", "Cinco piezas", "Seis piezas", "Siete piezas", "Ocho piezas", "Nueve piezas", "Diez piezas", "Once piezas", "Doce piezas", "Trece piezas", "Catorce piezas"];

function pieceLabel(n) {
  return PIECE_WORDS[n] || `${n} piezas`;
}

const CATALOG = [
  { id: "molding", name: "Línea Molding", blurb: "Ceras, pasta, pomada y gel para armar el peinado y sostenerlo." },
  { id: "kids", name: "Kids", blurb: "La cera de fibra, en una edición para los más jóvenes." },
  { id: "limpieza", name: "Limpieza", blurb: "Shampoos sin sal y ducha íntima." },
  { id: "tratamiento", name: "Tratamiento", blurb: "Tónico para el cuero cabelludo y serum de barba." },
  { id: "cuerpo", name: "Cuerpo", blurb: "Splash y gel de afeitado para la rutina de cada día." },
];

const SITE = {
  whatsapp: "573235835137",
  city: "Cali, Valle del Cauca",
  products: [
    { id: "cera-brillo", sku: "VM-CB-150", name: "Cera brillo medio", line: "Línea Molding", finish: "Brillo medio", category: "molding", size: "150 g", price: 24000, stock: 56, accent: "#E52C3B", image: "assets/products/cera-brillo.jpg", summary: "Fijación que resiste el día y un brillo que se ve natural.", description: "Cera moldeadora de brillo medio. Keratina, romero, aloe vera y cera de abeja para un peinado que se mantiene.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "cera-fibra", sku: "VM-CF-150", name: "Cera de fibra", line: "Línea Molding", finish: "Acabado húmedo", category: "molding", size: "150 g", price: 24000, stock: 48, accent: "#6D4AFF", image: "assets/products/cera-fibra.jpg", summary: "Acabado húmedo, como salido de la barbería.", description: "Cera de fibra con acabado húmedo. Se adapta al movimiento y se peina fácil. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "pasta", sku: "VM-PA-150", name: "Pasta moldeadora", line: "Línea Molding", finish: "Brillante", category: "molding", size: "150 g", price: 24000, stock: 34, accent: "#00C8C2", image: "assets/products/pasta.jpg", summary: "Brillo elegante y fijación para un aspecto profesional.", description: "Pasta moldeadora brillante. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "pomada", sku: "VM-PM-150", name: "Pomada mate", line: "Línea Molding", finish: "Acabado mate", category: "molding", size: "150 g", price: 24000, stock: 40, accent: "#FFD300", image: "assets/products/pomada.jpg", summary: "Control para el cabello rebelde, con acabado mate.", description: "Pomada moldeadora mate. Keratina, romero, aloe vera y cera de abeja para un peinado natural.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 5, featured: false },
    { id: "gel-cubre-canas", sku: "VM-GC-150", name: "Gel cubre canas", line: "Línea Molding", finish: "Acabado húmedo brillante", category: "molding", size: "150 g", price: 24000, stock: 28, accent: "#C5CAD1", image: "assets/products/gel-cubre-canas.jpg", summary: "Cubre las canas con un acabado húmedo brillante.", description: "Gel cubre canas. Acabado húmedo brillante. Keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: true },
    { id: "pasta-minoxidil", sku: "VM-PX-150", name: "Pasta minoxidil", line: "Línea Molding", finish: "A base de cera de abeja", category: "molding", size: "150 g", price: 24000, stock: 22, accent: "#2EE6D0", image: "assets/products/pasta-minoxidil.jpg", summary: "Pasta con minoxidil, pantenol y romero.", description: "Pasta minoxidil. Minoxidil, pantenol y romero, a base de cera de abeja. Usar en pelo seco o semi seco.", ingredients: ["Minoxidil", "Pantenol", "Romero", "Cera de abeja"], hold: 3, featured: true },
    { id: "cera-kids", sku: "VM-KD-150", name: "Cera de fibra Kids", line: "Línea Molding", finish: "Fijación suave", category: "kids", size: "150 g", price: 24000, stock: 8, accent: "#E52C3B", image: "assets/products/cera-kids.jpg", summary: "Fórmula suave para el cabello de los más jóvenes.", description: "Cera de fibra Kids. Fijación pensada para cabello infantil, con keratina, romero, aloe vera y cera de abeja.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: false },
    { id: "shampoo-proteccion", sku: "VM-SH-500", name: "Shampoo protección capilar", line: "Línea Cuidado personal", finish: "Sin sal", category: "limpieza", size: "500 g", price: 34000, stock: 62, accent: "#E52C3B", image: "assets/products/shampoo-proteccion.jpg", summary: "Limpia y protege. Sin sal.", description: "Shampoo de protección capilar con romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico. Fórmula sin sal.", ingredients: ["Romero", "Keratina", "Cebolla", "Aloe vera", "Zanahoria", "Ácido hialurónico"], hold: null, featured: true },
    { id: "shampoo-carbon", sku: "VM-SC-500", name: "Shampoo carbón activo", line: "Línea Cuidado personal", finish: "Sin sal", category: "limpieza", size: "500 ml", price: 32000, stock: 44, accent: "#FFD300", image: "assets/products/shampoo-carbon.jpg", summary: "Carbón activo para cuero cabelludo con caspa y picazón. Sin sal.", description: "Shampoo de carbón activo. Adiós caspa y picazón. Romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico. Sin sal.", ingredients: ["Carbón activo", "Romero", "Keratina", "Cebolla", "Aloe vera", "Ácido hialurónico"], hold: null, featured: true },
    { id: "ducha-intima", sku: "VM-DI-180", name: "Ducha íntima", line: "Línea Cuidado personal", finish: "For men", category: "limpieza", size: "180 g", price: 29000, stock: 38, accent: "#A4D800", image: "assets/products/ducha-intima.jpg", summary: "Higiene masculina. Sin fragancia, colorantes ni parabenos.", description: "Ducha íntima for men. Fórmula sin fragancia, sin colorantes y sin parabenos.", ingredients: ["Sin fragancia", "Sin colorantes", "Sin parabenos"], hold: null, featured: false },
    { id: "tonico", sku: "VM-TO-065", name: "Tónico orgánico", line: "Línea Cuidado personal", finish: "Cuero cabelludo", category: "tratamiento", size: "65 ml", price: 52000, stock: 31, accent: "#FFD300", image: "assets/products/tonico.jpg", summary: "Tónico de extractos para el cuero cabelludo. 19 activos.", description: "Tónico orgánico con romero, biotina, ruibarbo, queratina, ácido hialurónico y aloe vera. Se aplica en el cuero cabelludo.", ingredients: ["Romero", "Biotina", "Ruibarbo", "Queratina", "Ácido hialurónico", "Aloe vera"], hold: null, featured: true },
    { id: "serum-barba", sku: "VM-SB-065", name: "Serum barba y bigote", line: "Línea Cuidado personal", finish: "Acondiciona", category: "tratamiento", size: "65 ml", price: 20000, stock: 27, accent: "#A4D800", image: "assets/products/serum-barba.jpg", summary: "Barba suave y brillante. Argán, jojoba y aloe vera.", description: "Serum para barba y bigote. Aceite de argán, jojoba y aloe vera para peinarla y darle brillo.", ingredients: ["Aceite de argán", "Jojoba", "Aloe vera"], hold: null, featured: true },
    { id: "splash", sku: "VM-BS-250", name: "Body splash for men", line: "Línea Cuidado personal", finish: "For men", category: "cuerpo", size: "250 ml", price: 29000, stock: 36, accent: "#4BA3DC", image: "assets/products/splash.jpg", summary: "Splash corporal. Eucalipto y mentol.", description: "Body splash for men. Se aplica en la zona del cuerpo que se requiera. Agua, alcohol, eucalipto y mentol.", ingredients: ["Eucalipto", "Mentol", "Alcohol"], hold: null, featured: true },
    { id: "shaving-gel", sku: "VM-SG-250", name: "Shaving gel for men", line: "Línea Cuidado personal", finish: "Con aloe vera", category: "cuerpo", size: "250 ml", price: 29000, stock: 33, accent: "#FF6A00", image: "assets/products/shaving-gel.jpg", summary: "Gel de afeitar for men. Con aloe vera.", description: "Shaving gel for men. Contiene aloe vera. 250 ml.", ingredients: ["Aloe vera", "Eucalipto", "Mentol"], hold: null, featured: true }
  ]
};

function waHref(text) {
  const number = (VM.config && VM.config.whatsapp) || SITE.whatsapp;
  const msg = encodeURIComponent(text || "Hola, quiero hablar con un asesor de Vinicius Molding.");
  return "https://wa.me/" + number + "?text=" + msg;
}

function iconWhatsapp() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.27.64-.39 1.02-.39.12 0 .23 0 .33.01.3.01.45.03.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.13-.28.28-.12.54.16.27.71 1.17 1.52 1.89 1.05.93 1.93 1.22 2.2 1.36.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.54.73 1.8.86.27.13.44.2.51.31.06.11.06.64-.18 1.32z"/></svg>';
}

function cutoutSrc(src) {
  return String(src || "").replace(/\.jpe?g(\?.*)?$/i, ".png$1");
}

function orbit(src, alt, id) {
  const open = id ? ` data-open="${esc(id)}"` : "";
  return `<div class="orbit" data-orbit${open} tabindex="0" aria-label="${esc(alt)}">
    <div class="orbit-scene">
      <span class="orbit-shadow"></span>
      <div class="orbit-card"><img src="${esc(cutoutSrc(src))}" alt="${esc(alt)}" draggable="false"></div>
    </div>
  </div>`;
}

function recommendedFor(product) {
  const rest = VM.products.filter((item) => item.id !== product.id);
  const same = rest.filter((item) => item.category === product.category);
  const other = rest.filter((item) => item.category !== product.category);
  return same.concat(other).slice(0, 8);
}
