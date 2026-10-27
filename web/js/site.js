const SITE = {
  whatsapp: "573235835137",
  city: "Cali, Valle del Cauca",
  products: [
    { id: "cera-fibra", sku: "VM-CF-150", name: "Cera de fibra", line: "Moldeadora", finish: "Acabado firme", category: "fijacion", size: "150 g", price: 44000, stock: 48, accent: "#6D4AFF", image: "assets/products/cera-fibra.jpg", summary: "Estructura el peinado y lo sostiene con fijación firme.", description: "Cera de fibra para quien pide control. Separa, define y mantiene la forma sin apelmazar el cabello.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 5, featured: true },
    { id: "cera-brillo", sku: "VM-CB-150", name: "Cera brillo medio", line: "Moldeadora", finish: "Brillo medio", category: "fijacion", size: "150 g", price: 42000, stock: 56, accent: "#E52C3B", image: "assets/products/cera-brillo.jpg", summary: "Moldea con brillo medio y una fijación que se ve, no que pesa.", description: "La cera de uso diario. Controla el peinado, aporta brillo medio y deja un acabado limpio.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 4, featured: true },
    { id: "pasta", sku: "VM-PA-150", name: "Pasta fijadora", line: "Fijación fuerte", finish: "Acabado brillante", category: "fijacion", size: "150 g", price: 46000, stock: 34, accent: "#00C8C2", image: "assets/products/pasta.jpg", summary: "Fijación fuerte y brillo marcado para peinados con presencia.", description: "Pasta de fijación fuerte. Construye volumen, sella la forma y deja un acabado brillante.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 5, featured: true },
    { id: "pomada", sku: "VM-PM-150", name: "Pomada mate", line: "Moldeadora", finish: "Acabado mate", category: "fijacion", size: "150 g", price: 38000, stock: 40, accent: "#FFD300", image: "assets/products/pomada.jpg", summary: "Textura maleable y acabado mate. Control sin brillo.", description: "Pomada moldeadora de acabado mate. Define con naturalidad y se retrabaja durante el día.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: false },
    { id: "cera-kids", sku: "VM-KD-150", name: "Cera de fibra Kids", line: "Vinicius Kids", finish: "Fijación suave", category: "kids", size: "150 g", price: 32000, stock: 8, accent: "#E52C3B", image: "assets/products/cera-kids.jpg", summary: "La misma cera de fibra, en una edición para los más jóvenes.", description: "Cera de fibra de la línea Kids. Fija el peinado con keratina, romero y aloe vera.", ingredients: ["Keratina", "Romero", "Aloe vera", "Cera de abeja"], hold: 3, featured: false },
    { id: "shampoo-proteccion", sku: "VM-SH-500", name: "Shampoo protección capilar", line: "Limpieza", finish: "Uso diario", category: "cuidado", size: "500 g", price: 36000, stock: 62, accent: "#A4D800", image: "assets/products/shampoo-proteccion.jpg", summary: "Limpia y protege. Sin sal.", description: "Shampoo de protección capilar con romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico. Fórmula sin sal.", ingredients: ["Romero", "Keratina", "Cebolla", "Aloe vera", "Zanahoria", "Ácido hialurónico"], hold: null, featured: false },
    { id: "shampoo-carbon", sku: "VM-SC-500", name: "Shampoo carbón activo", line: "Limpieza", finish: "Caspa y picazón", category: "cuidado", size: "500 ml", price: 39000, stock: 44, accent: "#585E65", image: "assets/products/shampoo-carbon.jpg", summary: "Carbón activo para cuero cabelludo con caspa y picazón. Sin sal.", description: "Shampoo de carbón activo. La etiqueta lo dice claro: adiós caspa y picazón. Fórmula sin sal.", ingredients: ["Carbón activo", "Romero", "Keratina", "Cebolla", "Aloe vera", "Ácido hialurónico"], hold: null, featured: true },
    { id: "serum-barba", sku: "VM-SB-065", name: "Serum barba y bigote", line: "Tratamiento", finish: "Acondiciona", category: "tratamiento", size: "65 ml", price: 49000, stock: 27, accent: "#A4D800", image: "assets/products/serum-barba.jpg", summary: "Ordena la barba y el bigote. Argán, jojoba y aloe vera.", description: "Serum para barba y bigote. Aporta suavidad y control con aceite de argán, jojoba y aloe vera.", ingredients: ["Aceite de argán", "Jojoba", "Aloe vera"], hold: null, featured: true },
    { id: "tonico", sku: "VM-TO-065", name: "Tónico orgánico", line: "Tratamiento", finish: "Cuero cabelludo", category: "tratamiento", size: "65 ml", price: 54000, stock: 31, accent: "#00C8C2", image: "assets/products/tonico.jpg", summary: "Tónico de extractos naturales para la rutina del cuero cabelludo.", description: "Tónico orgánico con romero, menta, queratina, ácido hialurónico y aloe vera.", ingredients: ["Romero", "Menta", "Queratina", "Ácido hialurónico", "Aloe vera"], hold: null, featured: true },
    { id: "ducha-intima", sku: "VM-DI-200", name: "Ducha íntima", line: "Higiene", finish: "For men", category: "cuidado", size: "200 g", price: 28000, stock: 38, accent: "#00C8C2", image: "assets/products/ducha-intima.jpg", summary: "Higiene masculina. pH balanceado, sin sulfatos y sin parabenos.", description: "Ducha íntima para hombre. Fórmula con pH balanceado, sin sulfatos y sin parabenos.", ingredients: ["pH balanceado", "Sin sulfatos", "Sin parabenos"], hold: null, featured: false }
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

function orbit(src, alt) {
  return `<div class="orbit" data-orbit tabindex="0" role="img" aria-label="${esc(alt)}. Arrastra para girar 360 grados">
    <div class="orbit-scene"><div class="orbit-card">
      <img class="face" src="${esc(src)}" alt="${esc(alt)}" draggable="false">
      <img class="face back" src="${esc(src)}" alt="" draggable="false">
    </div></div>
    <div class="orbit-foot"><span data-deg>0°</span><small>360°</small></div>
  </div>`;
}
