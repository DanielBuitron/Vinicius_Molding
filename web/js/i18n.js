(() => {
  const KEY = "vm_lang";
  const dict = {
    es: {
      "lang.es": "ES",
      "lang.en": "EN",
      "lang.switch": "Idioma",
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
      "cart.note": "Pesos colombianos. El envío se coordina desde Cali.",
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
      "cart.note": "Colombian pesos. Shipping is arranged from Cali.",
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

  let lang = detectLang();

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
    if (typeof window.refreshRevistaLang === "function") window.refreshRevistaLang();
    if (typeof window.onSiteLangChange === "function") window.onSiteLangChange(lang);
    return lang;
  }

  function getLang() {
    return lang;
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

  function productField(product, field) {
    if (!product) return "";
    if (lang === "en") {
      const row = productEn[product.id];
      if (row && row[field]) return row[field];
    }
    return product[field] || "";
  }

  function langSwitcherHtml(extraClass) {
    return `<div class="lang-switch ${extraClass || ""}" role="group" aria-label="${t("lang.switch")}">
      <button type="button" data-lang-btn="es" aria-pressed="${lang === "es" ? "true" : "false"}" class="${lang === "es" ? "on" : ""}">ES</button>
      <button type="button" data-lang-btn="en" aria-pressed="${lang === "en" ? "true" : "false"}" class="${lang === "en" ? "on" : ""}">EN</button>
    </div>`;
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
  }

  function ensureLangDock() {
    if (document.getElementById("lang-dock")) return;
    const dock = document.createElement("div");
    dock.id = "lang-dock";
    dock.innerHTML = langSwitcherHtml("lang-dock-switch");
    document.body.appendChild(dock);
  }

  window.t = t;
  window.setLang = setLang;
  window.getLang = getLang;
  window.localizedCatalog = localizedCatalog;
  window.productField = productField;
  window.langSwitcherHtml = langSwitcherHtml;
  window.applyStaticLang = applyStaticLang;
  window.ensureLangDock = ensureLangDock;

  document.documentElement.lang = lang;
  document.addEventListener("DOMContentLoaded", () => {
    document.body.dataset.lang = lang;
    ensureLangDock();
    applyStaticLang();
  });
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-lang-btn]");
    if (!btn) return;
    event.preventDefault();
    const next = btn.getAttribute("data-lang-btn");
    if (next && next !== getLang()) setLang(next);
  });
})();
