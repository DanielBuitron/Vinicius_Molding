function shellPublic(content) {
  const count = cartCount();
  const page = VM.parts[0] || "inicio";
  const links = [["inicio", t("nav.home")], ["catalogo", t("nav.catalog")]];
  const home = page === "inicio";
  return `
    ${home ? "" : `<a class="wa-side" href="${waHref()}" target="_blank" rel="noopener" aria-label="${t("nav.advisor")}">${iconWhatsapp()}<span>${t("nav.advisor")}</span></a>`}
    <header class="site-header ${home ? "desk-header" : ""}">
      <a class="brand" href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
      ${home ? "" : `
      <nav class="nav ${VM.menu ? "open" : ""}">
        ${links.map(([id, label]) => `<a href="#/${id}" class="${page === id || (id === "catalogo" && page === "linea") ? "active" : ""}">${label}</a>`).join("")}
        <a href="#/login">${t("nav.panel")}</a>
      </nav>`}
      <div class="header-actions">
        ${localeControlsHtml("lang-inline")}
        <a class="btn touch" href="${waHref()}" target="_blank" rel="noopener">${t("nav.talk")}</a>
        ${home ? "" : `
        <a class="icon-btn" href="#/carrito" aria-label="${t("nav.cart")}">${iconBag()}<span class="cart-count ${count ? "show" : ""}" data-cart-count>${count}</span></a>
        <button class="menu-toggle" data-act="menu" aria-label="${t("nav.menu")}">${VM.menu ? iconClose() : iconMenu()}</button>`}
      </div>
    </header>
    <main>${content}</main>
    ${home ? "" : `
    <footer class="site-footer">
      <div>
        <img src="assets/logo-white.png" alt="">
        <p>${t("footer.blurb", { city: esc(VM.config.city || SITE.city) })}</p>
      </div>
      <div>
        <strong>${t("footer.house")}</strong>
        <a href="#/catalogo">${t("nav.catalog")}</a>
        <a href="#/inicio">${t("nav.home")}</a>
        <a href="#/catalogo/molding">${t("footer.lineMolding")}</a>
        <a href="#/catalogo/kits">${t("footer.kits")}</a>
        <a href="#/catalogo/limpieza">${t("footer.cleaning")}</a>
        <a href="#/catalogo/tratamiento">${t("footer.treatment")}</a>
        <a href="#/catalogo/kids">${t("footer.kids")}</a>
        <a href="#/catalogo/cuerpo">${t("footer.body")}</a>
      </div>
      <div>
        <strong>${t("footer.advisor")}</strong>
        <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </footer>`}`;
}

function packShot(item) {
  const name = productField(item, "name") || item.name;
  return `<a class="pack" href="#/producto/${esc(item.id)}" style="--accent:${esc(item.accent || "#E52C3B")}">
    <img src="${esc(cutoutSrc(item.image))}" alt="${esc(name)}" decoding="async" draggable="false">
    <em>${esc(name)}</em>
  </a>`;
}

function viewFan() {
  const items = VM.products || [];
  const mid = (items.length - 1) / 2;
  return `
    <section class="house">
      <div class="house-copy">
        <p class="kicker">La casa</p>
        <h2>${esc(pieceLabel(items.length))}.<br>Una línea.</h2>
        <p>Ceras, shampoos, tratamiento y cuerpo. El cuidado capilar masculino, en un solo lugar.</p>
      </div>
      <div class="lineup" data-lineup aria-label="Línea Vinicius">
        <div class="lineup-fallback">
          ${items.map((item, i) => `<a href="#/producto/${esc(item.id)}" style="--i:${(i - mid).toFixed(2)}" aria-label="${esc(item.name)}"><img src="${esc(cutoutSrc(item.image))}" alt="${esc(item.name)}" decoding="async" draggable="false"><span>${esc(item.name)}</span></a>`).join("")}
        </div>
      </div>
    </section>`;
}

function viewEdition(group) {
  const lead = group.items[0];
  const count = pieceLabel(group.items.length);
  return `
    <section class="edition" style="--accent:${esc(lead.accent || "#E52C3B")}">
      <div class="edition-copy">
        <p class="kicker">${esc(group.name)}</p>
        <h2>${count}.<br>${esc(group.name)}.</h2>
        <p class="lede">${esc(group.blurb)}</p>
        <a class="btn ghost" href="#/catalogo/${esc(group.id)}">Ver la línea</a>
      </div>
      <div class="edition-row">
        ${group.items.map(packShot).join("")}
      </div>
    </section>`;
}

function lookFace(opts) {
  const item = opts.item;
  const href = item ? `#/producto/${esc(item.id)}` : (opts.href || "#/catalogo");
  return `
    <a class="sheet-face ${opts.tone || ""}" href="${href}" style="--accent:${esc((item && item.accent) || opts.accent || "#E52C3B")}" tabindex="-1">
      <div class="sheet-copy">
        <p class="sheet-kicker">${esc(opts.kicker || "")}</p>
        <h3>${opts.title}</h3>
        ${opts.text ? `<p>${esc(opts.text)}</p>` : ""}
      </div>
      ${item ? `<img class="sheet-shot" src="${esc(cutoutSrc(item.image))}" alt="${esc(item.name)}" draggable="false">` : (opts.img ? `<img class="sheet-shot" src="${esc(opts.img)}" alt="" draggable="false">` : "")}
      ${opts.note ? `<span class="sheet-note">${esc(opts.note)}</span>` : ""}
    </a>`;
}

function lookSpreads() {
  const by = (id) => productById(id);
  const n = (VM.products || []).length;
  return [
    {
      left: lookFace({ kicker: "La casa", title: "Somos la<br>solución.", text: "No el problema. Cuidado capilar masculino hecho en Cali.", tone: "light", href: "#/catalogo", accent: "#E52C3B", img: "assets/isotipo-red.png", note: `${n} piezas` }),
      right: lookFace({ item: by("cera-brillo"), kicker: "Línea Molding", title: "Cada capa<br>cuenta.", text: "Ceras, pasta y pomada para armar el peinado.", accent: "#E52C3B" }),
    },
    {
      left: lookFace({ item: by("cera-fibra"), kicker: "Fibra", title: "Textura<br>viva.", text: "Agarre y volumen sin peso.", accent: "#7B2CBF" }),
      right: lookFace({ item: by("pasta"), kicker: "Pasta", title: "Mate<br>definido.", text: "Acabado seco para peinados diarios.", tone: "light", accent: "#00C8C2" }),
    },
    {
      left: lookFace({ item: by("pasta-minoxidil"), kicker: "Ingeniería", title: "Una pieza<br>de oficio.", text: "Minoxidil, pantenol y romero a base de cera de abeja.", accent: "#00C8C2" }),
      right: lookFace({ item: by("gel-cubre-canas"), kicker: "Acabado", title: "Canas bajo<br>control.", text: "Acabado húmedo brillante.", tone: "light", accent: "#E52C3B" }),
    },
    {
      left: lookFace({ item: by("tonico"), kicker: "Tratamiento", title: "Tónico<br>orgánico.", text: "19 activos para el cuero cabelludo.", accent: "#00C8C2" }),
      right: lookFace({ item: by("serum-barba"), kicker: "Barba", title: "Serum vivo<br>en la mesa.", text: "Argán, jojoba y aloe vera.", tone: "light", accent: "#A4D800" }),
    },
    {
      left: lookFace({ item: by("shampoo-proteccion"), kicker: "Limpieza", title: "Sin sal.<br>Con oficio.", text: "Protección capilar diaria.", accent: "#E52C3B" }),
      right: lookFace({ item: by("ducha-intima"), kicker: "Cuerpo", title: "Ducha íntima<br>for men.", text: "Sin fragancia ni parabenos.", tone: "light", accent: "#FFD300" }),
    },
    {
      left: lookFace({ item: by("splash"), kicker: "Splash", title: "Body splash<br>for men.", text: "Eucalipto y mentol. 250 ml.", accent: "#A4D800" }),
      right: lookFace({ kicker: "Catálogo", title: "Toda la línea<br>en un clic.", text: "Abre el catálogo y elige la pieza.", href: "#/catalogo", accent: "#E52C3B", tone: "cta", img: "assets/isotipo-red.png", note: "Ver catálogo" }),
    },
  ];
}

function viewDesk() {
  return `
    <section class="desk3d-rail">
      <div class="desk3d-pin" data-desk3d>
        <div class="desk3d-canvas" data-desk3d-canvas></div>
        <div class="desk3d-vignette" aria-hidden="true"></div>
        <div class="desk3d-grain" aria-hidden="true"></div>
        <div class="desk3d-intro" data-desk-intro>
          <p class="desk3d-tag">${t("home.tag")}</p>
          <h1>${t("home.title")}</h1>
          <p>${t("home.text")}</p>
        </div>
        <p class="desk3d-hint" data-desk-hint>${t("home.hint")}</p>
        <a class="desk3d-cta" href="#/catalogo">${t("home.cta")}</a>
      </div>
      <div class="desk3d-space" style="height:1400vh" aria-hidden="true"></div>
    </section>`;
}

function viewHome() {
  return viewDesk();
}

function viewTestimonials() {
  const lang = getLang();
  const textOf = (value) => (lang === "es" ? value : ensureTextTranslated(value, lang));
  return `
    <section class="voices">
      <div class="voices-stats">
        <p class="kicker">${t("voices.kicker")}</p>
        <div><strong>+1000</strong><span>${t("voices.orders")}</span></div>
        <div><strong>4.9★</strong><span>${t("voices.rating")}</span></div>
        <div><strong>100%</strong><span>${t("voices.original")}</span></div>
      </div>
      <div class="voices-grid">
        ${TESTIMONIOS.map((item) => `
          <article class="voice-card">
            <p class="stars" aria-label="${t("voices.stars")}">★★★★★</p>
            <p>“${esc(textOf(item.text))}”</p>
            <div class="voice-who">
              <b>${esc(item.initials)}</b>
              <div>
                <strong>${esc(item.name)}</strong>
                <span>${esc(textOf(item.product))} · ${t("voices.verified")}</span>
              </div>
            </div>
          </article>`).join("")}
      </div>
    </section>`;
}

function viewComments() {
  const notes = VM.comments || [];
  return `
    <section class="comments">
      <div class="runway-head">
        <h2>Comentarios</h2>
      </div>
      <div class="comments-layout">
        <form class="form panel-card" data-form="comment">
          <p class="fine">Deja tu comentario sobre Vinicius Molding.</p>
          <label>Nombre<input name="name" required maxlength="40" autocomplete="name"></label>
          <label>Comentario<textarea name="text" required maxlength="280" rows="4"></textarea></label>
          <button class="btn" type="submit">Publicar</button>
        </form>
        <div class="comment-list">
          ${notes.length ? notes.map((item) => `
            <article class="comment-card">
              <strong>${esc(item.name)}</strong>
              <span>${esc((item.at || "").replace("T", " ").slice(0, 16))}</span>
              <p>${esc(item.text)}</p>
            </article>`).join("") : `<p class="empty">Todavía no hay comentarios. El primero puede ser el tuyo.</p>`}
        </div>
      </div>
    </section>`;
}

function phoneBlock(done) {
  if (done) {
    return `<section class="dial-block"><div class="success-box"><strong>Número recibido.</strong><p>El asesor te contacta a ese celular.</p></div></section>`;
  }
  return `
    <section class="dial-block">
      <div>
        <div class="eyebrow">Asesor</div>
        <h2 class="block-title">El número donde te llamamos.</h2>
      </div>
      <form data-form="lead">
        <div class="dial">
          <input name="phone" inputmode="tel" autocomplete="tel" required placeholder="300 000 0000" aria-label="Número de celular">
          <button class="btn" type="submit">Enviar</button>
        </div>
        <p class="fine">Solo el celular. Nada más.</p>
      </form>
    </section>`;
}

function homeSlide(item, active) {
  const name = productField(item, "name") || item.name;
  const finish = productField(item, "finish") || item.finish;
  const summary = productField(item, "summary") || item.summary;
  return `
    <article class="showcase-slide ${active ? "on" : ""}">
      <div>${orbit(item.image, name, item.id)}</div>
      <div class="showcase-copy">
        <p class="kicker">${esc(finish)} · ${esc(item.size)}</p>
        <h3><a href="#/producto/${esc(item.id)}">${esc(name)}</a></h3>
        <p>${esc(summary)}</p>
        <strong class="price">${money(item.price)}</strong>
        <div class="hero-actions">
          <a class="btn" href="#/producto/${esc(item.id)}">${t("product.view")}</a>
          <button class="btn ghost" type="button" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>${t("catalog.add")}</button>
        </div>
      </div>
    </article>`;
}

function homeGroup(group) {
  const many = group.items.length > 1;
  return `
    <section class="showcase" ${many ? "data-showcase" : ""}>
      <div class="runway-head">
        <h2>${esc(group.name)}</h2>
        <div class="carousel-nav">
          ${many ? `<button type="button" class="icon-btn" data-act="show" data-dir="-1" aria-label="${t("catalog.prev")}">‹</button><button type="button" class="icon-btn" data-act="show" data-dir="1" aria-label="${t("catalog.next")}">›</button>` : ""}
          <a href="#/catalogo/${esc(group.id)}">${t("catalog.view")}</a>
        </div>
      </div>
      <div class="showcase-stage">
        ${group.items.map((item, index) => homeSlide(item, index === 0)).join("")}
      </div>
      ${many ? `<div class="showcase-dots">${group.items.map((item, index) => `<button type="button" class="${index === 0 ? "on" : ""}" data-act="show-dot" data-index="${index}" aria-label="${esc(productField(item, "name") || item.name)}"></button>`).join("")}</div>` : ""}
    </section>`;
}

function catalogGroups() {
  return localizedCatalog().map((group) => ({
    ...group,
    items: VM.products.filter((item) => item.category === group.id),
  })).filter((group) => group.items.length);
}

function catalogCard(item) {
  const name = productField(item, "name") || item.name;
  const summary = productField(item, "summary") || item.summary || "";
  return `
    <article class="sku folio-sku" style="--accent:${esc(item.accent)}">
      <a class="sku-shot" href="#/producto/${esc(item.id)}">
        <img src="${esc(cutoutSrc(item.image))}" alt="${esc(name)}" decoding="async" draggable="false">
      </a>
      <div class="sku-body">
        <p class="kicker">${esc(item.finish || item.size)}</p>
        <h3><a href="#/producto/${esc(item.id)}">${esc(name)}</a></h3>
        <p class="sku-sum">${esc(summary)}</p>
        <div class="sku-row">
          <span class="price">${money(item.price)}</span>
          <button class="btn small" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>${t("catalog.add")}</button>
        </div>
      </div>
    </article>`;
}

function sortCatalogItems(items, mode) {
  const list = items.slice();
  if (mode === "price-asc") list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  else if (mode === "price-desc") list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  else list.sort((a, b) => String(productField(a, "name") || a.name || "").localeCompare(String(productField(b, "name") || b.name || ""), "es"));
  return list;
}

function viewCatalog() {
  const focus = VM.parts[1] || "";
  const q = String((VM.catalogQuery || "")).trim().toLowerCase();
  const sort = VM.catalogSort || "name";
  const all = catalogGroups().map((group) => ({
    ...group,
    items: sortCatalogItems(group.items.filter((item) => {
      if (!q) return true;
      const blob = [item.name, item.summary, item.description, item.finish, item.line, item.sku]
        .concat(item.ingredients || [])
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    }), sort),
  })).filter((group) => group.items.length);
  const groups = focus ? all.filter((group) => group.id === focus) : all;
  const total = (VM.products || []).length;
  const visible = groups.reduce((count, group) => count + group.items.length, 0);
  return `
    <section class="section catalog desk-page">
      <div class="catalog-intro">
        <div>
          <div class="kicker">${t("catalog.kicker")}</div>
          <h2>${t("catalog.title")}</h2>
          <p class="catalog-lede">${t("catalog.lede")}</p>
        </div>
        <div class="catalog-tools">
          <label class="catalog-search">
            <span class="sr-only">${t("catalog.search")}</span>
            <input type="search" data-catalog-q placeholder="${esc(t("catalog.search"))}" value="${esc(VM.catalogQuery || "")}">
          </label>
          <label class="catalog-sort">
            <span>${t("catalog.sort")}</span>
            <select data-catalog-sort>
              <option value="name" ${sort === "name" ? "selected" : ""}>${t("catalog.sort.name")}</option>
              <option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>${t("catalog.sort.priceAsc")}</option>
              <option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>${t("catalog.sort.priceDesc")}</option>
            </select>
          </label>
        </div>
        <div class="filters" role="tablist" aria-label="${t("catalog.title")}">
          <a class="chip ${focus ? "" : "on"}" href="#/catalogo">${t("catalog.all")} <span>${total}</span></a>
          ${catalogGroups().map((group) => `<a class="chip ${focus === group.id ? "on" : ""}" href="#/catalogo/${esc(group.id)}">${esc(group.name)} <span>${group.items.length}</span></a>`).join("")}
        </div>
        <p class="catalog-count">${t("catalog.count", { n: visible })}</p>
      </div>
      ${groups.length ? groups.map((group) => `
        <section class="catalog-block" data-cat="${esc(group.id)}" id="cat-${esc(group.id)}">
          <div class="catalog-head">
            <div>
              <h3>${esc(group.name)}</h3>
              <p>${esc(group.blurb || "")}</p>
            </div>
            <span class="catalog-head-count">${group.items.length}</span>
          </div>
          <div class="sku-grid">
            ${group.items.map((item) => catalogCard(item)).join("")}
          </div>
        </section>`).join("") : `<p class="catalog-empty">${t("catalog.lede")}</p>`}
    </section>`;
}

function viewLinea() {
  return viewCatalog();
}

function productCard(item) {
  const name = productField(item, "name") || item.name;
  const summary = productField(item, "summary") || item.summary;
  return `<article class="pick">
    ${orbit(item.image, name, item.id)}
    <h3><a href="#/producto/${esc(item.id)}">${esc(name)}</a></h3>
    <p>${esc(summary)}</p>
    <div class="pick-row">
      <span class="price">${money(item.price)}</span>
      <button class="btn small" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>${t("catalog.add")}</button>
    </div>
  </article>`;
}

function carousel(title, items) {
  if (!items.length) return "";
  return `
    <section class="recommend" data-carousel-wrap>
      <div class="carousel-head">
        <h2>${title}</h2>
        <div class="carousel-nav">
          <button type="button" class="icon-btn" data-act="slide" data-dir="-1" aria-label="${t("catalog.prev")}">‹</button>
          <button type="button" class="icon-btn" data-act="slide" data-dir="1" aria-label="${t("catalog.next")}">›</button>
        </div>
      </div>
      <div class="rail" data-rail>${items.map(productCard).join("")}</div>
    </section>`;
}

function viewProduct() {
  const product = productById(VM.parts[1]);
  if (!product) return `<section class="page"><h2 class="block-title">${t("product.missing")}</h2><a class="btn" href="#/catalogo">${t("product.back")}</a></section>`;
  const qty = VM.qty[product.id] || 1;
  const name = productField(product, "name") || product.name;
  const finish = productField(product, "finish") || product.finish;
  const description = productField(product, "description") || product.description;
  const hold = product.hold ? `<div class="hold" aria-label="${t("product.hold", { n: product.hold })}">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= product.hold ? "on" : ""}"></i>`).join("")}</div>` : "";
  const facts = [
    [t("product.line"), product.line],
    [t("product.size"), product.size],
    [t("product.finish"), finish],
    [t("product.sku"), product.sku],
  ];
  const family = VM.products.filter((item) => item.category === product.category);
  return `
    <article class="product-stage" style="--accent:${esc(product.accent)}">
      <div class="product-copy">
        <a class="kicker" href="#/catalogo/${esc(product.category)}">${esc(categoryName(product.category))}</a>
        <h1>${esc(name)}</h1>
        <p class="lede">${esc(description)}</p>
        <div class="price" style="font-size:34px">${money(product.price)}</div>
        <p class="fine">${moneyAlt(product.price)}</p>
        ${stockLabel(product)}
        ${hold}
        <dl class="facts">${facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>
        <div class="meta">${(product.ingredients || []).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div>
        <div class="buy-row">
          <div class="qty">
            <button type="button" data-act="qty" data-id="${esc(product.id)}" data-dir="-1">−</button>
            <span>${qty}</span>
            <button type="button" data-act="qty" data-id="${esc(product.id)}" data-dir="1">+</button>
          </div>
          <button class="btn" data-act="add" data-id="${esc(product.id)}" data-qty="${qty}" ${product.stock ? "" : "disabled"}>${t("product.add")}</button>
          <a class="btn ghost" href="${waHref(t("wa.product", { name }))}" target="_blank" rel="noopener">${t("product.ask")}</a>
        </div>
      </div>
      <div class="orbit-lg">${orbit(product.image, name)}</div>
      <nav class="product-dots" aria-label="${t("product.more")}">
        ${family.map((item) => `<a href="#/producto/${esc(item.id)}" class="${item.id === product.id ? "on" : ""}" aria-label="${esc(productField(item, "name") || item.name)}" style="--accent:${esc(item.accent)}"></a>`).join("")}
      </nav>
    </article>
    ${carousel(t("product.recommend"), recommendedFor(product))}`;
}

function viewMarca() {
  const colors = [
    ["#000000", "Negro", "Autoridad"],
    ["#E52C3B", "Rojo", "Determinación"],
    ["#00C8C2", "Teal", "Contraste"],
    ["#FFD300", "Dorado", "Energía"],
    ["#585E65", "Gris", "Equilibrio"],
    ["#A4D800", "Lima", "Acento"],
  ];
  return `
    <section class="section">
      <div class="kicker">Identidad</div>
      <h2 class="block-title" style="max-width:820px;margin-top:10px">El poder empieza por la imagen.</h2>
      <p class="lede">Vinicius es cuidado capilar masculino para quien no improvisa. Voz firme, elegante y directa. El arquetipo es el Gobernante: control, excelencia y orden.</p>
      <div class="swatches">
        ${colors.map(([hex, name, role]) => `<article style="--swatch:${hex}"><b></b><strong>${name}</strong><span>${hex}</span><em>${role}</em></article>`).join("")}
      </div>
    </section>
    <section class="manifesto">
      <h2>Somos la solución, no el problema.</h2>
      <p>No seguimos tendencias. Entregamos resultado.</p>
    </section>
    <section class="section">
      <div class="bands">
        <article class="band">
          <div><img src="assets/logo-white.png" alt="Logotipo Vinicius Molding" style="width:min(460px,100%);margin:0 auto"></div>
          <div>
            <div class="kicker">Logotipo</div>
            <h3>Una V que se impone.</h3>
            <p>Isotipo angular, VINICIUS en mayúscula y MOLDING con aire. Se usa en negro, en blanco o en el rojo de la marca. Sin sombras, sin estirar, sin degradado.</p>
          </div>
        </article>
        <article class="band">
          <div>
            <div class="kicker">A quién</div>
            <h3>La opción correcta.</h3>
            <p>Hombres de 25 a 45 años. Profesionales, emprendedores, líderes. No quieren más opciones. Quieren la que funciona.</p>
          </div>
          <img src="assets/isotipo-red.png" alt="Isotipo" style="width:min(280px,70%);margin:0 auto">
        </article>
      </div>
    </section>`;
}

function viewAsesor(done) {
  return phoneBlock(done);
}

function shopQty(id) {
  const row = (VM.shopCart || []).find((item) => item.id === id);
  return row ? Number(row.qty || 0) : 0;
}

function shopTotal() {
  return (VM.shopCart || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
}

function viewShop() {
  const data = VM.shopData || {};
  const products = data.products || VM.products || [];
  const confirmed = data.status === "confirmed" || VM.shopDone;
  const cart = VM.shopCart || [];
  if (confirmed) {
    return `
      <section class="shop-app">
        <header class="shop-top">
          <img src="assets/logo-white.png" alt="Vinicius Molding">
          <p>${t("shop.tagline")}</p>
          ${localeControlsHtml("lang-inline")}
        </header>
        <div class="shop-done">
          <h1>${t("shop.doneTitle")}</h1>
          <p>${t("shop.doneText", { ref: data.quoteRef ? " · " + esc(data.quoteRef) : "" })}</p>
        </div>
      </section>`;
  }
  const groups = {};
  products.forEach((item) => {
    const key = item.category || "otros";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  const labels = {
    molding: t("cat.molding"),
    kids: t("cat.kids"),
    limpieza: t("cat.limpieza"),
    tratamiento: t("cat.tratamiento"),
    cuerpo: t("cat.cuerpo"),
  };
  return `
    <section class="shop-app">
      <header class="shop-top">
        <img src="assets/logo-white.png" alt="Vinicius Molding">
        <div>
          <strong>${t("shop.title")}</strong>
          <p>${t("shop.lede")}</p>
        </div>
        ${localeControlsHtml("lang-inline")}
      </header>
      <div class="shop-list">
        ${Object.keys(groups).map((key) => `
          <div class="shop-group">
            <h2>${esc(labels[key] || key)}</h2>
            ${groups[key].map((item) => {
              const qty = shopQty(item.id);
              const name = productField(item, "name") || item.name;
              const summary = productField(item, "summary") || item.summary || "";
              return `
                <article class="shop-card" style="--accent:${esc(item.accent || "#E52C3B")}">
                  <img src="${esc(cutoutSrc(item.image))}" alt="${esc(name)}" loading="lazy">
                  <div class="shop-card-body">
                    <strong>${esc(name)}</strong>
                    <em>${esc(item.size || "")} · ${esc(item.sku || "")}</em>
                    <p>${esc(summary)}</p>
                    <div class="shop-card-row">
                      <span>${money(item.price)}</span>
                      ${qty ? `
                        <div class="shop-qty">
                          <button type="button" data-act="shop-qty" data-id="${esc(item.id)}" data-dir="-1">−</button>
                          <b>${qty}</b>
                          <button type="button" data-act="shop-qty" data-id="${esc(item.id)}" data-dir="1">+</button>
                        </div>` : `
                        <button type="button" class="shop-add" data-act="shop-add" data-id="${esc(item.id)}">${t("shop.add")}</button>`}
                    </div>
                  </div>
                </article>`;
            }).join("")}
          </div>`).join("")}
      </div>
      <footer class="shop-bar">
        <div>
          <strong>${money(shopTotal())}</strong>
          <span>${t("shop.inCart", { n: cart.reduce((n, item) => n + Number(item.qty || 0), 0) })}</span>
        </div>
        <button type="button" class="shop-send" data-act="shop-confirm" ${cart.length ? "" : "disabled"}>${t("shop.send")}</button>
      </footer>
    </section>`;
}

function viewCart() {
  const items = cartDetailed();
  if (!items.length) return `<section class="page"><h2 class="block-title">${t("cart.empty")}</h2><a class="btn" href="#/inicio">${t("cart.back")}</a></section>`;
  return `
    <section class="cart-layout">
      <div>
        <h2 class="block-title" style="margin-bottom:16px">${t("cart.title")}</h2>
        ${items.map((item) => `
          <article class="line-item">
            <img src="${esc(cutoutSrc(item.image))}" alt="">
            <div>
              <strong>${esc(productField(item, "name") || item.name)}</strong>
              <div class="fine">${money(item.price)}</div>
              <div class="qty" style="margin-top:8px">
                <button data-act="cart-qty" data-id="${esc(item.id)}" data-dir="-1">−</button>
                <span>${item.qty}</span>
                <button data-act="cart-qty" data-id="${esc(item.id)}" data-dir="1">+</button>
              </div>
            </div>
            <div>
              <div class="price">${money(item.price * item.qty)}</div>
              <button class="linkish" data-act="remove" data-id="${esc(item.id)}">${t("cart.remove")}</button>
            </div>
          </article>`).join("")}
      </div>
      <aside class="summary">
        <h3>${t("cart.total")}</h3>
        <div class="sum-row"><strong>${money(cartTotal())}</strong></div>
        <p class="fine">${getCurrency() === "USD" ? t("cur.noteUsd") : t("cur.noteCop")}</p>
        <p class="fine">${t("cur.trm", { rate: new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(usdRate()) + " COP" })}</p>
        <a class="btn full" href="#/pago">${t("cart.send")}</a>
      </aside>
    </section>`;
}

function viewCheckout() {
  const items = cartDetailed();
  if (!items.length) return viewCart();
  return `
    <section class="checkout-layout">
      <form class="form panel-card" data-form="checkout">
        <h3>${t("checkout.title")}</h3>
        <p class="fine">${t("checkout.fine")}</p>
        <label>${t("checkout.name")}<input name="name" required></label>
        <label>${t("checkout.phone")}<input name="phone" required inputmode="tel"></label>
        <label>${t("checkout.city")}<input name="city" value="Cali"></label>
        <label>${t("checkout.address")}<input name="address"></label>
        <label>${t("checkout.note")}<textarea name="note" rows="3" placeholder="${t("checkout.notePh")}"></textarea></label>
        <button class="btn" type="submit">${t("checkout.submit")}</button>
      </form>
      <aside class="summary">
        <h3>${money(cartTotal())}</h3>
        ${items.map((item) => `<div class="sum-row"><span>${item.qty} × ${esc(productField(item, "name") || item.name)}</span><span>${money(item.price * item.qty)}</span></div>`).join("")}
        <p class="fine">${t("checkout.aside")}</p>
      </aside>
    </section>`;
}

function viewOrder(order, pending) {
  if (pending) return `<section class="page"><p>${t("order.confirming")}</p></section>`;
  if (!order) return `<section class="page"><h2 class="block-title">${t("order.missing")}</h2></section>`;
  const simulate = !VM.config.wompiReady && order.status === "pendiente_pago";
  return `
    <section class="page" style="max-width:760px">
      <div class="kicker">${esc(order.reference)}</div>
      <h2 class="block-title">${esc(statusLabel(order.status))}</h2>
      <div class="panel-card">${(order.items || []).map((item) => `<div class="sum-row"><span>${item.qty} × ${esc(item.name)}</span><span>${money(item.price * item.qty)}</span></div>`).join("")}</div>
      ${simulate ? `<div class="hero-actions"><button class="btn" data-act="simulate" data-status="APPROVED" data-ref="${esc(order.reference)}" data-token="${esc(order.token)}">Simular pago aprobado</button><button class="btn ghost" data-act="simulate" data-status="DECLINED" data-ref="${esc(order.reference)}" data-token="${esc(order.token)}">Simular rechazo</button></div>` : ""}
    </section>`;
}

function viewLogin() {
  return `
    <div class="login-wrap">
      <div class="login-art">
        <img src="assets/logo.png" alt="Vinicius Molding">
        <span class="login-bars" aria-hidden="true"></span>
      </div>
      <div class="login-side">
        <form class="login-card form" data-form="login">
          <div class="kicker">${t("nav.panel")}</div>
          <h1>${t("login.title")}</h1>
          ${localeControlsHtml("lang-inline")}
          <label>${t("login.user")}<input name="username" autocomplete="username" required value="admin"></label>
          <label>${t("login.pass")}<input name="password" type="password" autocomplete="current-password" required></label>
          <button class="btn" type="submit">${t("login.submit")}</button>
          <p class="hint">${t("login.hint")}</p>
        </form>
      </div>
    </div>`;
}
