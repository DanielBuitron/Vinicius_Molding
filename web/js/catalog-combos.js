const CATALOG_COMBOS = [
  ["coleccion-moldeadores", "#E52C3B", [
    "Colección de moldeadores", "Styling collection", "造型产品套装",
  ], [
    "Seis presentaciones en cajas triangulares.", "Six styling products in triangular boxes.", "六款三角盒装造型产品。",
  ]],
  ["ducha-intima-y-cera-fibra", "#7B5CB8", [
    "Ducha íntima + cera y fibra", "Intimate wash + fiber wax", "私密清洁 + 纤维发蜡",
  ]],
  ["ducha-intima-y-cera-kids", "#E52C3B", [
    "Ducha íntima + cera Kids", "Intimate wash + Kids wax", "私密清洁 + 儿童发蜡",
  ]],
  ["ducha-intima-y-cera-moldeadora", "#E52C3B", [
    "Ducha íntima + cera moldeadora", "Intimate wash + styling wax", "私密清洁 + 造型发蜡",
  ]],
  ["ducha-intima-y-pasta-en-caja", "#00C8C2", [
    "Ducha íntima + pasta moldeadora en caja", "Intimate wash + boxed styling paste", "私密清洁 + 盒装造型发泥",
  ]],
  ["ducha-intima-y-patillera-amarilla", "#FFD300", [
    "Ducha íntima + patillera amarilla", "Intimate wash + yellow trimmer", "私密清洁 + 黄色修边器",
  ]],
  ["ducha-intima-y-patillera-plateada", "#585E65", [
    "Ducha íntima + patillera plateada", "Intimate wash + silver trimmer", "私密清洁 + 银色修边器",
  ]],
  ["ducha-intima-y-pomada", "#A4D800", [
    "Ducha íntima + pomada en envase", "Intimate wash + pomade in tin", "私密清洁 + 罐装发油",
  ]],
  ["ducha-intima-y-pomada-en-caja", "#A4D800", [
    "Ducha íntima + pomada en caja", "Intimate wash + boxed pomade", "私密清洁 + 盒装发油",
  ]],
  ["ducha-intima-y-shampoo-carbon", "#A4D800", [
    "Ducha íntima + shampoo carbón activo", "Intimate wash + activated charcoal shampoo", "私密清洁 + 活性炭洗发水",
  ]],
  ["ducha-intima-y-shampoo-proteccion", "#E52C3B", [
    "Ducha íntima + shampoo protección capilar", "Intimate wash + hair protection shampoo", "私密清洁 + 护发洗发水",
  ]],
  ["shampoo-y-minoxidil-12-5", "#E52C3B", [
    "Shampoo protección capilar + tónico minoxidil 12.5%",
    "Hair protection shampoo + 12.5% minoxidil tonic",
    "护发洗发水 + 12.5% 米诺地尔护理液",
  ]],
].map(([id, accent, names, descriptions = []]) => {
  const [es, en, zh] = names.map((name, index) => {
    const description = descriptions[index];
    return description ? { name, summary: description, description } : { name };
  });
  return {
    ...es,
    en,
    zh,
    id,
    accent,
    category: "kits",
    consultationOnly: true,
    image: "assets/catalogo-combos/" + id + ".webp?v=2",
  };
});
