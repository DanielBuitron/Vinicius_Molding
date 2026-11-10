(() => {
  const KEY = "vm_lang";
  const CUR_KEY = "vm_currency";
  const dict = {
    es: {
      "lang.es": "ES",
      "lang.en": "EN",
      "lang.switch": "Idioma",
      "cur.switch": "Moneda",
      "cur.cop": "COP",
      "cur.usd": "USD",
      "cur.noteCop": "Precios en pesos colombianos. El envío se coordina desde Cali.",
      "cur.noteUsd": "USD con TRM del Banco de la República. El pago se confirma en COP.",
      "cur.trm": "TRM BanRep: {rate}",
      "nav.home": "Inicio",
      "nav.catalog": "Catálogo",
      "nav.panel": "Panel",
      "nav.login": "Iniciar sesión",
      "nav.loginShort": "Entrar",
      "nav.cart": "Carrito",
      "nav.menu": "Menú",
      "nav.talk": "Hablar",
      "nav.askCatalog": "Pedir catálogo",
      "nav.askCatalogShort": "Catálogo",
      "nav.advisor": "Hablar con el asesor",
      "footer.house": "Casa",
      "footer.advisor": "Asesor",
      "footer.blurb": "Cuidado capilar masculino. {city}.",
      "footer.lineMolding": "Línea Molding",
      "footer.cleaning": "Limpieza",
      "footer.treatment": "Tratamiento",
      "footer.kids": "Kids",
      "footer.body": "Cuerpo",
      "home.tag": "Nueva escena 3D",
      "home.title": "Lookbook interactivo<br>que puedes explorar",
      "home.text": "Desliza la rueda. La tapa se abre y las páginas giran sobre la mesa.",
      "home.hint": "Desliza para abrir",
      "home.cta": "Ver catálogo",
      "catalog.kicker": "Lookbook · Vinicius",
      "catalog.title": "Catálogo",
      "catalog.lede": "La misma línea del escritorio, pieza por pieza.",
      "catalog.all": "Todos",
      "catalog.add": "Agregar",
      "catalog.view": "Ver",
      "catalog.prev": "Anterior",
      "catalog.next": "Siguiente",
      "product.missing": "Esa pieza no está.",
      "product.back": "Volver al catálogo",
      "product.line": "Línea",
      "product.size": "Presentación",
      "product.finish": "Acabado",
      "product.sku": "Referencia",
      "product.add": "Agregar al carrito",
      "product.ask": "Consultar",
      "product.hold": "Fijación {n} de 5",
      "product.more": "Otras de la línea",
      "product.recommend": "Te recomendamos",
      "product.view": "Ver producto",
      "stock.out": "Agotado",
      "stock.low": "Quedan {n}",
      "stock.ok": "Disponible",
      "cart.empty": "El carrito está vacío.",
      "cart.back": "Volver a la revista",
      "cart.title": "Tu selección",
      "cart.remove": "Quitar",
      "cart.total": "Total",
      "cart.note": "Precios en la moneda elegida. El pago se confirma en COP desde Cali.",
      "cart.send": "Enviar pedido",
      "checkout.title": "Datos de contacto",
      "checkout.fine": "Al enviar, el PDF del pedido sale al WhatsApp del asesor.",
      "checkout.name": "Nombre",
      "checkout.phone": "Celular",
      "checkout.city": "Ciudad",
      "checkout.address": "Dirección",
      "checkout.note": "Nota",
      "checkout.notePh": "Horario, barrio o indicación",
      "checkout.submit": "Enviar PDF al asesor",
      "checkout.aside": "El asesor lo recibe en su WhatsApp para confirmar productos, valor y entrega.",
      "order.confirming": "Confirmando el pago…",
      "order.missing": "No encontramos el pedido.",
      "login.title": "Ingresar",
      "login.user": "Usuario",
      "login.pass": "Clave",
      "login.submit": "Entrar",
      "login.hint": "Acceso interno del equipo comercial.",
      "shop.tagline": "Somos la solución, no el problema.",
      "shop.doneTitle": "¡Listo!",
      "shop.doneText": "Ya te enviamos a WhatsApp el PDF elegante de tu cotización{ref}. Gracias por elegirnos.",
      "shop.title": "Catálogo Vinicius",
      "shop.lede": "Mira con calma, añade lo que quieras y al final te enviamos la cotización a tu WhatsApp.",
      "shop.add": "Añadir",
      "shop.inCart": "{n} en carrito",
      "shop.send": "Enviar cotización al WhatsApp",
      "shop.missing": "Falta el enlace del catálogo.",
      "shop.missingHint": "Pide “catálogo” por WhatsApp para recibir uno nuevo.",
      "shop.loading": "Cargando catálogo",
      "shop.error": "No pudimos abrir el catálogo.",
      "shop.errorHint": "Pide “catálogo” otra vez por WhatsApp.",
      "shop.sending": "Enviando…",
      "mag.cover": "Cubierta",
      "mag.about": "Quiénes somos",
      "mag.collection": "Colección · Contenido",
      "mag.contact": "Contacto",
      "mag.prev": "Página anterior",
      "mag.next": "Página siguiente",
      "mag.detail": "Detalle del producto",
      "mag.wa": "Pedir por WhatsApp",
      "mag.close": "Cerrar",
      "mag.prevProduct": "Producto anterior",
      "mag.nextProduct": "Producto siguiente",
      "mag.waFab": "Hablar con un asesor",
      "mag.whoTitle": "Quiénes somos",
      "mag.whoP1": "Somos una marca de cuidado capilar masculino creada para hombres que no improvisan, que cuidan cada detalle y saben que el éxito también se construye desde el cuero cabelludo.",
      "mag.whoP2": "No vendemos promesas, entregamos resultados.",
      "mag.solution": "Somos la solución, no el problema",
      "mag.solutionP": "Productos capilares que funcionan, sin rodeos ni falsas promesas.",
      "mag.collectionTitle": "Colección",
      "mag.collectionP": "{n} productos para moldear, limpiar y cuidar el cabello, la barba y el cuerpo.",
      "mag.contents": "Contenido",
      "mag.fullLine": "La línea completa",
      "mag.fullLineP": "{n} piezas en la revista: molding, limpieza, tratamiento y cuerpo.",
      "mag.orderYours": "Pide el tuyo",
      "mag.orderP": "Fabricado por Cosmypro Lab, Cali-Valle. Comercializado por Vinicius Molding.",
      "mag.price": "Precio",
      "mag.size": "Contenido",
      "mag.finishLabel": "Acabado",
      "mag.contains": "Contiene",
      "mag.base": "Base",
      "mag.use": "Uso",
      "mag.formula": "Fórmula",
      "mag.add": "Añadir al carrito",
      "mag.less": "Menos",
      "mag.more": "Más",
      "mag.waAsk": "Hola, quiero información de {name} (N.º {ref})",
      "mag.ref": "N.º {ref} · Vinicius Molding",
      "wa.default": "Hola, quiero hablar con un asesor de Vinicius Molding.",
      "wa.catalog": "Hola, quiero el catálogo de Vinicius Molding",
      "wa.product": "Hola, quiero información de {name}.",
      "cat.molding": "Línea Molding",
      "cat.molding.blurb": "Ceras, pasta, pomada y gel para armar el peinado y sostenerlo.",
      "cat.kids": "Kids",
      "cat.kids.blurb": "La cera de fibra, en una edición para los más jóvenes.",
      "cat.limpieza": "Limpieza",
      "cat.limpieza.blurb": "Shampoos sin sal y ducha íntima.",
      "cat.tratamiento": "Tratamiento",
      "cat.tratamiento.blurb": "Tónico para el cuero cabelludo y serum de barba.",
      "cat.cuerpo": "Cuerpo",
      "cat.cuerpo.blurb": "Splash y gel de afeitado para la rutina de cada día.",
      "piece.0": "Cero",
      "piece.1": "Una pieza",
      "piece.n": "{n} piezas",
      "title.home": "Vinicius Molding · Cuidado capilar masculino",
      "title.catalog": "Catálogo",
      "title.cart": "Carrito",
      "title.pay": "Pago",
      "title.order": "Pedido",
      "title.login": "Ingresar",
      "title.panel": "Panel",
      "title.product": "Producto",
      "status.nuevo": "Nuevo",
      "status.contactado": "Contactado",
      "status.cerrado": "Cerrado",
      "status.pendiente_pago": "Pendiente de pago",
      "status.aprobado": "Aprobado",
      "status.rechazado": "Rechazado",
      "status.anulado": "Anulado",
      "status.error": "Error",
    },
    en: {
      "lang.es": "ES",
      "lang.en": "EN",
      "lang.switch": "Language",
      "cur.switch": "Currency",
      "cur.cop": "COP",
      "cur.usd": "USD",
      "cur.noteCop": "Prices in Colombian pesos. Shipping is arranged from Cali.",
      "cur.noteUsd": "USD using Banco de la República TRM. Payment is confirmed in COP.",
      "cur.trm": "BanRep TRM: {rate}",
      "nav.home": "Home",
      "nav.catalog": "Catalog",
      "nav.panel": "Dashboard",
      "nav.login": "Sign in",
      "nav.loginShort": "Sign in",
      "nav.cart": "Cart",
      "nav.menu": "Menu",
      "nav.talk": "Chat",
      "nav.askCatalog": "Get catalog",
      "nav.askCatalogShort": "Catalog",
      "nav.advisor": "Talk to an advisor",
      "footer.house": "House",
      "footer.advisor": "Advisor",
      "footer.blurb": "Men’s hair care. {city}.",
      "footer.lineMolding": "Molding line",
      "footer.cleaning": "Cleansing",
      "footer.treatment": "Treatment",
      "footer.kids": "Kids",
      "footer.body": "Body",
      "home.tag": "New 3D scene",
      "home.title": "An interactive lookbook<br>you can explore",
      "home.text": "Scroll the wheel. The cover opens and the pages turn on the desk.",
      "home.hint": "Scroll to open",
      "home.cta": "View catalog",
      "catalog.kicker": "Lookbook · Vinicius",
      "catalog.title": "Catalog",
      "catalog.lede": "The same desk line, piece by piece.",
      "catalog.all": "All",
      "catalog.add": "Add",
      "catalog.view": "View",
      "catalog.prev": "Previous",
      "catalog.next": "Next",
      "product.missing": "That piece isn’t here.",
      "product.back": "Back to catalog",
      "product.line": "Line",
      "product.size": "Size",
      "product.finish": "Finish",
      "product.sku": "SKU",
      "product.add": "Add to cart",
      "product.ask": "Ask",
      "product.hold": "Hold {n} of 5",
      "product.more": "More from this line",
      "product.recommend": "You may also like",
      "product.view": "View product",
      "stock.out": "Sold out",
      "stock.low": "{n} left",
      "stock.ok": "In stock",
      "cart.empty": "Your cart is empty.",
      "cart.back": "Back to the magazine",
      "cart.title": "Your picks",
      "cart.remove": "Remove",
      "cart.total": "Total",
      "cart.note": "Prices in your selected currency. Payment is confirmed in COP from Cali.",
      "cart.send": "Place order",
      "checkout.title": "Contact details",
      "checkout.fine": "When you send, the order PDF goes to the advisor’s WhatsApp.",
      "checkout.name": "Name",
      "checkout.phone": "Phone",
      "checkout.city": "City",
      "checkout.address": "Address",
      "checkout.note": "Note",
      "checkout.notePh": "Time, neighborhood or notes",
      "checkout.submit": "Send PDF to advisor",
      "checkout.aside": "The advisor gets it on WhatsApp to confirm products, total and delivery.",
      "order.confirming": "Confirming payment…",
      "order.missing": "We couldn’t find that order.",
      "login.title": "Sign in",
      "login.user": "Username",
      "login.pass": "Password",
      "login.submit": "Enter",
      "login.hint": "Internal access for the sales team.",
      "shop.tagline": "We are the solution, not the problem.",
      "shop.doneTitle": "All set!",
      "shop.doneText": "We already sent the elegant quote PDF to your WhatsApp{ref}. Thanks for choosing us.",
      "shop.title": "Vinicius catalog",
      "shop.lede": "Browse at your pace, add what you like, and we’ll send the quote to your WhatsApp.",
      "shop.add": "Add",
      "shop.inCart": "{n} in cart",
      "shop.send": "Send quote to WhatsApp",
      "shop.missing": "Catalog link missing.",
      "shop.missingHint": "Ask for “catalog” on WhatsApp to get a new one.",
      "shop.loading": "Loading catalog",
      "shop.error": "We couldn’t open the catalog.",
      "shop.errorHint": "Ask for “catalog” again on WhatsApp.",
      "shop.sending": "Sending…",
      "mag.cover": "Cover",
      "mag.about": "About us",
      "mag.collection": "Collection · Contents",
      "mag.contact": "Contact",
      "mag.prev": "Previous page",
      "mag.next": "Next page",
      "mag.detail": "Product detail",
      "mag.wa": "Order on WhatsApp",
      "mag.close": "Close",
      "mag.prevProduct": "Previous product",
      "mag.nextProduct": "Next product",
      "mag.waFab": "Talk to an advisor",
      "mag.whoTitle": "About us",
      "mag.whoP1": "We are a men’s hair-care brand made for men who don’t improvise, who care about every detail and know that success is also built from the scalp up.",
      "mag.whoP2": "We don’t sell promises. We deliver results.",
      "mag.solution": "We are the solution, not the problem",
      "mag.solutionP": "Hair products that work, with no fluff or empty promises.",
      "mag.collectionTitle": "Collection",
      "mag.collectionP": "{n} products to style, cleanse and care for hair, beard and body.",
      "mag.contents": "Contents",
      "mag.fullLine": "The full line",
      "mag.fullLineP": "{n} pieces in the magazine: molding, cleansing, treatment and body.",
      "mag.orderYours": "Get yours",
      "mag.orderP": "Made by Cosmypro Lab, Cali-Valle. Marketed by Vinicius Molding.",
      "mag.price": "Price",
      "mag.size": "Size",
      "mag.finishLabel": "Finish",
      "mag.contains": "Contains",
      "mag.base": "Base",
      "mag.use": "Use",
      "mag.formula": "Formula",
      "mag.add": "Add to cart",
      "mag.less": "Less",
      "mag.more": "More",
      "mag.waAsk": "Hi, I’d like info on {name} (No. {ref})",
      "mag.ref": "No. {ref} · Vinicius Molding",
      "wa.default": "Hi, I’d like to talk to a Vinicius Molding advisor.",
      "wa.catalog": "Hi, I’d like the Vinicius Molding catalog",
      "wa.product": "Hi, I’d like info on {name}.",
      "cat.molding": "Molding line",
      "cat.molding.blurb": "Waxes, paste, pomade and gel to shape and hold your style.",
      "cat.kids": "Kids",
      "cat.kids.blurb": "Fiber wax in an edition for younger hair.",
      "cat.limpieza": "Cleansing",
      "cat.limpieza.blurb": "Salt-free shampoos and intimate wash.",
      "cat.tratamiento": "Treatment",
      "cat.tratamiento.blurb": "Scalp tonic and beard serum.",
      "cat.cuerpo": "Body",
      "cat.cuerpo.blurb": "Splash and shaving gel for the daily routine.",
      "piece.0": "Zero",
      "piece.1": "One piece",
      "piece.n": "{n} pieces",
      "title.home": "Vinicius Molding · Men’s hair care",
      "title.catalog": "Catalog",
      "title.cart": "Cart",
      "title.pay": "Checkout",
      "title.order": "Order",
      "title.login": "Sign in",
      "title.panel": "Dashboard",
      "title.product": "Product",
      "status.nuevo": "New",
      "status.contactado": "Contacted",
      "status.cerrado": "Closed",
      "status.pendiente_pago": "Payment pending",
      "status.aprobado": "Approved",
      "status.rechazado": "Declined",
      "status.anulado": "Canceled",
      "status.error": "Error",
    },
  };

  const productEn = {
    "cera-brillo": {
      name: "Medium shine wax",
      finish: "Medium shine",
      summary: "All-day hold with a natural-looking shine.",
      description: "Medium-shine molding wax. Keratin, rosemary, aloe vera and beeswax for a style that stays.",
    },
    "cera-fibra": {
      name: "Fiber wax",
      finish: "Wet look",
      summary: "Wet-look finish, like you just left the barbershop.",
      description: "Fiber wax with a wet finish. Moves with you and restyles easily. Keratin, rosemary, aloe vera and beeswax.",
    },
    pasta: {
      name: "Molding paste",
      finish: "Shiny",
      summary: "Elegant shine and hold for a polished look.",
      description: "Shiny molding paste. Keratin, rosemary, aloe vera and beeswax.",
    },
    pomada: {
      name: "Matte pomade",
      finish: "Matte finish",
      summary: "Control for unruly hair, with a matte finish.",
      description: "Matte molding pomade. Keratin, rosemary, aloe vera and beeswax for a natural style.",
    },
    "gel-cubre-canas": {
      name: "Gray-cover gel",
      finish: "Wet glossy finish",
      summary: "Covers gray hair with a wet glossy finish.",
      description: "Gray-cover gel. Wet glossy finish. Keratin, rosemary, aloe vera and beeswax.",
    },
    "pasta-minoxidil": {
      name: "Minoxidil paste",
      finish: "Beeswax base",
      summary: "Paste with minoxidil, panthenol and rosemary.",
      description: "Minoxidil paste. Minoxidil, panthenol and rosemary on a beeswax base. Use on dry or semi-dry hair.",
    },
    "cera-kids": {
      name: "Kids fiber wax",
      finish: "Soft hold",
      summary: "Gentle formula for younger hair.",
      description: "Kids fiber wax. Hold made for children’s hair, with keratin, rosemary, aloe vera and beeswax.",
    },
    "shampoo-proteccion": {
      name: "Hair protection shampoo",
      finish: "Salt-free",
      summary: "Cleanses and protects. Salt-free.",
      description: "Hair protection shampoo with rosemary, keratin, onion, aloe vera, carrot and hyaluronic acid. Salt-free formula.",
    },
    "shampoo-carbon": {
      name: "Activated charcoal shampoo",
      finish: "Salt-free",
      summary: "Activated charcoal for flaky, itchy scalp. Salt-free.",
      description: "Activated charcoal shampoo. Helps with dandruff and itch. Rosemary, keratin, onion, aloe vera, carrot and hyaluronic acid. Salt-free.",
    },
    "ducha-intima": {
      name: "Intimate wash",
      finish: "For men",
      summary: "Men’s hygiene. No fragrance, dyes or parabens.",
      description: "Intimate wash for men. Fragrance-free, dye-free and paraben-free.",
    },
    tonico: {
      name: "Organic tonic",
      finish: "Scalp",
      summary: "Extract tonic for the scalp. 19 actives.",
      description: "Organic tonic with rosemary, biotin, rhubarb, keratin, hyaluronic acid and aloe vera. Apply to the scalp.",
    },
    "serum-barba": {
      name: "Beard & mustache serum",
      finish: "Conditions",
      summary: "Soft, shiny beard. Argan, jojoba and aloe vera.",
      description: "Beard and mustache serum. Argan oil, jojoba and aloe vera to style and add shine.",
    },
    splash: {
      name: "Body splash for men",
      finish: "For men",
      summary: "Body splash. Eucalyptus and menthol.",
      description: "Body splash for men. Apply where needed. Water, alcohol, eucalyptus and menthol.",
    },
    "shaving-gel": {
      name: "Shaving gel for men",
      finish: "With aloe vera",
      summary: "Shaving gel for men. With aloe vera.",
      description: "Shaving gel for men. Contains aloe vera. 250 ml.",
    },
  };

  function detectLang() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "es") return saved;
    } catch (_) {}
    const nav = String((navigator.language || "es")).toLowerCase();
    return nav.startsWith("en") ? "en" : "es";
  }

  function detectCurrency(currentLang) {
    try {
      const saved = localStorage.getItem(CUR_KEY);
      if (saved === "USD" || saved === "COP") return saved;
    } catch (_) {}
    return currentLang === "en" ? "USD" : "COP";
  }

  let lang = detectLang();
  let currency = detectCurrency(lang);

  function t(key, vars) {
    const pack = dict[lang] || dict.es;
    let text = pack[key] || dict.es[key] || key;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        text = text.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name]));
      });
    }
    return text;
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "es";
    try { localStorage.setItem(KEY, lang); } catch (_) {}
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-lang-btn") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });
    applyStaticLang();
    if (lang === "en" && typeof window.VM !== "undefined") warmProductTranslations(window.VM.products || []);
    if (typeof window.refreshRevistaLang === "function") window.refreshRevistaLang();
    if (typeof window.onSiteLangChange === "function") window.onSiteLangChange(lang);
    return lang;
  }

  function getLang() {
    return lang;
  }

  function getCurrency() {
    return currency;
  }

  function setCurrency(next) {
    currency = next === "USD" ? "USD" : "COP";
    try { localStorage.setItem(CUR_KEY, currency); } catch (_) {}
    document.body.dataset.currency = currency;
    document.querySelectorAll("[data-currency-btn]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-currency-btn") === currency);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-currency-btn") === currency ? "true" : "false");
    });
    if (typeof window.refreshRevistaLang === "function") window.refreshRevistaLang();
    if (typeof window.onSiteLangChange === "function") window.onSiteLangChange(lang);
    return currency;
  }

  function localizedCatalog() {
    return [
      { id: "molding", name: t("cat.molding"), blurb: t("cat.molding.blurb") },
      { id: "kids", name: t("cat.kids"), blurb: t("cat.kids.blurb") },
      { id: "limpieza", name: t("cat.limpieza"), blurb: t("cat.limpieza.blurb") },
      { id: "tratamiento", name: t("cat.tratamiento"), blurb: t("cat.tratamiento.blurb") },
      { id: "cuerpo", name: t("cat.cuerpo"), blurb: t("cat.cuerpo.blurb") },
    ];
  }

  const TR_KEY = "vm_tr_en";
  let trCache = {};
  try { trCache = JSON.parse(localStorage.getItem(TR_KEY) || "{}") || {}; } catch (_) { trCache = {}; }
  const pendingTr = new Set();
  let refreshTimer = 0;

  function scheduleLangRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (typeof window.refreshRevistaLang === "function") window.refreshRevistaLang();
      if (typeof window.onSiteLangChange === "function") window.onSiteLangChange(lang);
    }, 350);
  }

  function cachedEn(text) {
    const src = String(text || "").trim();
    if (!src) return "";
    return trCache[src] || "";
  }

  function saveEn(text, en) {
    const src = String(text || "").trim();
    const out = String(en || "").trim();
    if (!src || !out) return;
    trCache[src] = out;
    try { localStorage.setItem(TR_KEY, JSON.stringify(trCache)); } catch (_) {}
  }

  function queueTranslate(text) {
    const src = String(text || "").trim();
    if (!src || cachedEn(src) || pendingTr.has(src) || src.length < 2) return;
    pendingTr.add(src);
    const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(src.slice(0, 450)) + "&langpair=es|en";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const out = data && data.responseData && data.responseData.translatedText;
        if (out && String(out).trim() && String(out).trim() !== src) {
          saveEn(src, out);
          if (lang === "en") scheduleLangRefresh();
        }
      })
      .catch(() => {})
      .finally(() => pendingTr.delete(src));
  }

  function ensureTextEn(text) {
    const src = String(text || "").trim();
    if (!src) return "";
    const hit = cachedEn(src);
    if (hit) return hit;
    queueTranslate(src);
    return src;
  }

  function productField(product, field) {
    if (!product) return "";
    const raw = product[field] || "";
    if (lang !== "en") return raw;
    const row = productEn[product.id];
    if (row && row[field]) return row[field];
    if (product.en && product.en[field]) return product.en[field];
    return ensureTextEn(raw);
  }

  function warmProductTranslations(list) {
    if (lang !== "en") return;
    (list || []).forEach((item) => {
      ["name", "summary", "description", "finish", "line"].forEach((field) => {
        const raw = item && item[field];
        if (!raw) return;
        if (productEn[item.id] && productEn[item.id][field]) return;
        if (item.en && item.en[field]) return;
        ensureTextEn(raw);
      });
    });
  }

  function langSwitcherHtml(extraClass) {
    return `<div class="lang-switch ${extraClass || ""}" role="group" aria-label="${t("lang.switch")}">
      <button type="button" data-lang-btn="es" aria-pressed="${lang === "es" ? "true" : "false"}" class="${lang === "es" ? "on" : ""}">ES</button>
      <button type="button" data-lang-btn="en" aria-pressed="${lang === "en" ? "true" : "false"}" class="${lang === "en" ? "on" : ""}">EN</button>
    </div>`;
  }

  function currencySwitcherHtml(extraClass) {
    return `<div class="lang-switch currency-switch ${extraClass || ""}" role="group" aria-label="${t("cur.switch")}">
      <button type="button" data-currency-btn="COP" aria-pressed="${currency === "COP" ? "true" : "false"}" class="${currency === "COP" ? "on" : ""}">COP</button>
      <button type="button" data-currency-btn="USD" aria-pressed="${currency === "USD" ? "true" : "false"}" class="${currency === "USD" ? "on" : ""}">USD</button>
    </div>`;
  }

  function localeControlsHtml(extraClass) {
    return `<div class="locale-controls ${extraClass || ""}">${langSwitcherHtml()}${currencySwitcherHtml()}</div>`;
  }

  function applyStaticLang() {
    const loginLong = document.querySelector("#login-link .long");
    const loginShort = document.querySelector("#login-link .short");
    const login = document.getElementById("login-link");
    if (login) {
      const isPanel = (login.getAttribute("href") || "").includes("panel");
      if (loginLong && loginShort) {
        loginLong.textContent = isPanel ? t("nav.panel") : t("nav.login");
        loginShort.textContent = isPanel ? t("nav.panel") : t("nav.loginShort");
      } else if (!login.querySelector("span")) {
        login.textContent = isPanel ? t("nav.panel") : t("nav.login");
      }
    }
    const ask = document.querySelector("#revista .top-actions a.btn:not(.login)");
    if (ask) {
      const long = ask.querySelector(".long");
      const short = ask.querySelector(".short");
      if (long) long.textContent = t("nav.askCatalog");
      if (short) short.textContent = t("nav.askCatalogShort");
      ask.setAttribute("href", "https://wa.me/573235835137?text=" + encodeURIComponent(t("wa.catalog")));
    }
    const cart = document.getElementById("mag-cart");
    if (cart) cart.setAttribute("aria-label", t("nav.cart"));
    const prev = document.getElementById("prev");
    const next = document.getElementById("next");
    if (prev) prev.setAttribute("aria-label", t("mag.prev"));
    if (next) next.setAttribute("aria-label", t("mag.next"));
    const zoom = document.getElementById("zoom");
    if (zoom) zoom.setAttribute("aria-label", t("mag.detail"));
    const zwa = document.getElementById("zwa");
    if (zwa) zwa.textContent = t("mag.wa");
    const zx = document.getElementById("zx");
    if (zx) zx.textContent = t("mag.close");
    const zp = document.getElementById("zp");
    if (zp) zp.setAttribute("aria-label", t("mag.prevProduct"));
    const zn = document.getElementById("zn");
    if (zn) zn.setAttribute("aria-label", t("mag.nextProduct"));
    const fab = document.querySelector(".wa-fab");
    if (fab) {
      fab.setAttribute("aria-label", t("mag.waFab"));
      fab.setAttribute("href", "https://wa.me/573235835137?text=" + encodeURIComponent(t("wa.default")));
    }
    const title = document.querySelector("title");
    if (title && document.body.classList.contains("mode-home")) {
      document.title = t("title.home");
    }
    document.querySelectorAll("[data-currency-btn]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-currency-btn") === currency);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-currency-btn") === currency ? "true" : "false");
    });
  }

  function ensureLangDock() {
    let dock = document.getElementById("lang-dock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "lang-dock";
      document.body.appendChild(dock);
    }
    dock.innerHTML = localeControlsHtml("lang-dock-switch");
  }

  window.t = t;
  window.setLang = setLang;
  window.getLang = getLang;
  window.setCurrency = setCurrency;
  window.getCurrency = getCurrency;
  window.localizedCatalog = localizedCatalog;
  window.productField = productField;
  window.warmProductTranslations = warmProductTranslations;
  window.ensureTextEn = ensureTextEn;
  window.langSwitcherHtml = langSwitcherHtml;
  window.currencySwitcherHtml = currencySwitcherHtml;
  window.localeControlsHtml = localeControlsHtml;
  window.applyStaticLang = applyStaticLang;
  window.ensureLangDock = ensureLangDock;

  document.documentElement.lang = lang;
  document.addEventListener("DOMContentLoaded", () => {
    document.body.dataset.lang = lang;
    document.body.dataset.currency = currency;
    ensureLangDock();
    applyStaticLang();
  });
  document.addEventListener("click", (event) => {
    const langBtn = event.target.closest("[data-lang-btn]");
    if (langBtn) {
      event.preventDefault();
      const next = langBtn.getAttribute("data-lang-btn");
      if (next && next !== getLang()) setLang(next);
      return;
    }
    const curBtn = event.target.closest("[data-currency-btn]");
    if (curBtn) {
      event.preventDefault();
      const next = curBtn.getAttribute("data-currency-btn");
      if (next && next !== getCurrency()) setCurrency(next);
    }
  });
})();
