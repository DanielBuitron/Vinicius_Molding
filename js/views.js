function shellPublic(content) {
  const count = cartCount();
  const page = VM.parts[0] || "inicio";
  const links = [["inicio", "Inicio"], ["catalogo", "Catálogo"]];
  const home = page === "inicio";
  return `
    ${home ? "" : `<a class="wa-side" href="${waHref()}" target="_blank" rel="noopener" aria-label="WhatsApp del asesor">${iconWhatsapp()}<span>Hablar con el asesor</span></a>`}
    <header class="site-header ${home ? "desk-header" : ""}">
      <a class="brand" href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
      ${home ? "" : `
      <nav class="nav ${VM.menu ? "open" : ""}">
        ${links.map(([id, label]) => `<a href="#/${id}" class="${page === id || (id === "catalogo" && page === "linea") ? "active" : ""}">${label}</a>`).join("")}
        <a href="#/login">Panel</a>
      </nav>`}
      <div class="header-actions">
        <a class="btn touch" href="${waHref()}" target="_blank" rel="noopener">Hablar</a>
        ${home ? "" : `
        <a class="icon-btn" href="#/carrito" aria-label="Carrito">${iconBag()}<span class="cart-count ${count ? "show" : ""}" data-cart-count>${count}</span></a>
        <button class="menu-toggle" data-act="menu" aria-label="Menú">${VM.menu ? iconClose() : iconMenu()}</button>`}
      </div>
    </header>
    <main>${content}</main>
    ${home ? "" : `
    <footer class="site-footer">
      <div>
        <img src="assets/logo-white.png" alt="">
        <p>Cuidado capilar masculino. ${esc(VM.config.city || SITE.city)}.</p>
      </div>
      <div>
        <strong>Casa</strong>
        <a href="#/catalogo">Catálogo</a>
        <a href="#/inicio">Inicio</a>
        <a href="#/catalogo/molding">Línea Molding</a>
        <a href="#/catalogo/limpieza">Limpieza</a>
        <a href="#/catalogo/tratamiento">Tratamiento</a>
        <a href="#/catalogo/kids">Kids</a>
        <a href="#/catalogo/cuerpo">Cuerpo</a>
      </div>
      <div>
        <strong>Asesor</strong>
        <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </footer>`}`;
}

function packShot(item) {
  return `<a class="pack" href="#/producto/${esc(item.id)}" style="--accent:${esc(item.accent || "#E52C3B")}">
    <img src="${esc(cutoutSrc(item.image))}" alt="${esc(item.name)}" decoding="async" draggable="false">
    <em>${esc(item.name)}</em>
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
          <p class="desk3d-tag">Nueva escena 3D · v200</p>
          <h1>Lookbook interactivo<br>que puedes explorar</h1>
          <p>Desliza la rueda. La tapa se abre y las páginas giran sobre la mesa.</p>
        </div>
        <p class="desk3d-hint" data-desk-hint>Desliza para abrir</p>
        <a class="desk3d-cta" href="#/catalogo">Ver catálogo</a>
      </div>
      <div class="desk3d-space" style="height:1400vh" aria-hidden="true"></div>
    </section>`;
}

function viewHome() {
  return viewDesk();
}

function viewTestimonials() {
  return `
    <section class="voices">
      <div class="voices-stats">
        <p class="kicker">Testimonios</p>
        <div><strong>+1000</strong><span>Órdenes entregadas a clientes en todo el país.</span></div>
        <div><strong>4.9★</strong><span>Calificación promedio de nuestros clientes.</span></div>
        <div><strong>100%</strong><span>Productos originales de cuidado capilar profesional.</span></div>
      </div>
      <div class="voices-grid">
        ${TESTIMONIOS.map((item) => `
          <article class="voice-card">
            <p class="stars" aria-label="5 estrellas">★★★★★</p>
            <p>“${esc(item.text)}”</p>
            <div class="voice-who">
              <b>${esc(item.initials)}</b>
              <div>
                <strong>${esc(item.name)}</strong>
                <span>${esc(item.product)} · Compra verificada</span>
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
  return `
    <article class="showcase-slide ${active ? "on" : ""}">
      <div>${orbit(item.image, item.name, item.id)}</div>
      <div class="showcase-copy">
        <p class="kicker">${esc(item.finish)} · ${esc(item.size)}</p>
        <h3><a href="#/producto/${esc(item.id)}">${esc(item.name)}</a></h3>
        <p>${esc(item.summary)}</p>
        <strong class="price">${money(item.price)}</strong>
        <div class="hero-actions">
          <a class="btn" href="#/producto/${esc(item.id)}">Ver producto</a>
          <button class="btn ghost" type="button" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>Agregar</button>
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
          ${many ? `<button type="button" class="icon-btn" data-act="show" data-dir="-1" aria-label="Anterior">‹</button><button type="button" class="icon-btn" data-act="show" data-dir="1" aria-label="Siguiente">›</button>` : ""}
          <a href="#/catalogo/${esc(group.id)}">Ver</a>
        </div>
      </div>
      <div class="showcase-stage">
        ${group.items.map((item, index) => homeSlide(item, index === 0)).join("")}
      </div>
      ${many ? `<div class="showcase-dots">${group.items.map((item, index) => `<button type="button" class="${index === 0 ? "on" : ""}" data-act="show-dot" data-index="${index}" aria-label="${esc(item.name)}"></button>`).join("")}</div>` : ""}
    </section>`;
}

function catalogGroups() {
  return CATALOG.map((group) => ({
    ...group,
    items: VM.products.filter((item) => item.category === group.id),
  })).filter((group) => group.items.length);
}

function catalogCard(item) {
  return `
    <article class="sku folio-sku" style="--accent:${esc(item.accent)}">
      <a class="sku-shot" href="#/producto/${esc(item.id)}">
        <img src="${esc(cutoutSrc(item.image))}" alt="${esc(item.name)}" decoding="async" draggable="false">
      </a>
      <div class="sku-body">
        <p class="kicker">${esc(item.catName || item.size)}</p>
        <h3><a href="#/producto/${esc(item.id)}">${esc(item.name)}</a></h3>
        <div class="sku-row">
          <span class="price">${money(item.price)}</span>
          <button class="btn small" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>Agregar</button>
        </div>
      </div>
    </article>`;
}

function viewCatalog() {
  const focus = VM.parts[1] || "";
  const all = catalogGroups();
  const groups = focus ? all.filter((group) => group.id === focus) : all;
  const total = all.reduce((count, group) => count + group.items.length, 0);
  return `
    <section class="section catalog desk-page">
      <div class="catalog-intro">
        <div>
          <div class="kicker">Lookbook · Vinicius</div>
          <h2>Catálogo</h2>
          <p class="catalog-lede">La misma línea del escritorio, pieza por pieza.</p>
        </div>
        <div class="filters">
          <a class="chip ${focus ? "" : "on"}" href="#/catalogo">Todos <span>${total}</span></a>
          ${all.map((group) => `<a class="chip ${focus === group.id ? "on" : ""}" href="#/catalogo/${esc(group.id)}">${esc(group.name)} <span>${group.items.length}</span></a>`).join("")}
        </div>
      </div>
      <div class="sku-grid">
        ${groups.flatMap((group) => group.items.map((item) => catalogCard({ ...item, catName: group.name }))).join("")}
      </div>
    </section>`;
}

function viewLinea() {
  return viewCatalog();
}

function productCard(item) {
  return `<article class="pick">
    ${orbit(item.image, item.name, item.id)}
    <h3><a href="#/producto/${esc(item.id)}">${esc(item.name)}</a></h3>
    <p>${esc(item.summary)}</p>
    <div class="pick-row">
      <span class="price">${money(item.price)}</span>
      <button class="btn small" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>Agregar</button>
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
          <button type="button" class="icon-btn" data-act="slide" data-dir="-1" aria-label="Anterior">‹</button>
          <button type="button" class="icon-btn" data-act="slide" data-dir="1" aria-label="Siguiente">›</button>
        </div>
      </div>
      <div class="rail" data-rail>${items.map(productCard).join("")}</div>
    </section>`;
}

function viewProduct() {
  const product = productById(VM.parts[1]);
  if (!product) return `<section class="page"><h2 class="block-title">Esa pieza no está.</h2><a class="btn" href="#/catalogo">Volver al catálogo</a></section>`;
  const qty = VM.qty[product.id] || 1;
  const hold = product.hold ? `<div class="hold" aria-label="Fijación ${product.hold} de 5">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= product.hold ? "on" : ""}"></i>`).join("")}</div>` : "";
  const facts = [
    ["Línea", product.line],
    ["Presentación", product.size],
    ["Acabado", product.finish],
    ["Referencia", product.sku],
  ];
  const family = VM.products.filter((item) => item.category === product.category);
  return `
    <article class="product-stage" style="--accent:${esc(product.accent)}">
      <div class="product-copy">
        <a class="kicker" href="#/catalogo/${esc(product.category)}">${esc(categoryName(product.category))}</a>
        <h1>${esc(product.name)}</h1>
        <p class="lede">${esc(product.description)}</p>
        <div class="price" style="font-size:34px">${money(product.price)}</div>
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
          <button class="btn" data-act="add" data-id="${esc(product.id)}" data-qty="${qty}" ${product.stock ? "" : "disabled"}>Agregar al carrito</button>
          <a class="btn ghost" href="${waHref("Hola, quiero información de " + product.name + ".")}" target="_blank" rel="noopener">Consultar</a>
        </div>
      </div>
      <div class="orbit-lg">${orbit(product.image, product.name)}</div>
      <nav class="product-dots" aria-label="Otras de la línea">
        ${family.map((item) => `<a href="#/producto/${esc(item.id)}" class="${item.id === product.id ? "on" : ""}" aria-label="${esc(item.name)}" style="--accent:${esc(item.accent)}"></a>`).join("")}
      </nav>
    </article>
    ${carousel("Te recomendamos", recommendedFor(product))}`;
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

function viewCart() {
  const items = cartDetailed();
  if (!items.length) return `<section class="page"><h2 class="block-title">El carrito está vacío.</h2><a class="btn" href="#/inicio">Volver a la revista</a></section>`;
  return `
    <section class="cart-layout">
      <div>
        <h2 class="block-title" style="margin-bottom:16px">Tu selección</h2>
        ${items.map((item) => `
          <article class="line-item">
            <img src="${esc(cutoutSrc(item.image))}" alt="">
            <div>
              <strong>${esc(item.name)}</strong>
              <div class="fine">${money(item.price)}</div>
              <div class="qty" style="margin-top:8px">
                <button data-act="cart-qty" data-id="${esc(item.id)}" data-dir="-1">−</button>
                <span>${item.qty}</span>
                <button data-act="cart-qty" data-id="${esc(item.id)}" data-dir="1">+</button>
              </div>
            </div>
            <div>
              <div class="price">${money(item.price * item.qty)}</div>
              <button class="linkish" data-act="remove" data-id="${esc(item.id)}">Quitar</button>
            </div>
          </article>`).join("")}
      </div>
      <aside class="summary">
        <h3>Total</h3>
        <div class="sum-row"><strong>${money(cartTotal())}</strong></div>
        <p class="fine">Pesos colombianos. El envío se coordina desde Cali.</p>
        <a class="btn full" href="#/pago">Enviar pedido</a>
      </aside>
    </section>`;
}

function viewCheckout() {
  const items = cartDetailed();
  if (!items.length) return viewCart();
  return `
    <section class="checkout-layout">
      <form class="form panel-card" data-form="checkout">
        <h3>Datos de contacto</h3>
        <p class="fine">El asesor recibe un PDF con el pedido para verificarlo.</p>
        <label>Nombre<input name="name" required></label>
        <label>Celular<input name="phone" required inputmode="tel"></label>
        <label>Ciudad<input name="city" value="Cali"></label>
        <label>Dirección<input name="address"></label>
        <label>Nota<textarea name="note" rows="3" placeholder="Horario, barrio o indicación"></textarea></label>
        <button class="btn" type="submit">Enviar por WhatsApp</button>
      </form>
      <aside class="summary">
        <h3>${money(cartTotal())}</h3>
        ${items.map((item) => `<div class="sum-row"><span>${item.qty} × ${esc(item.name)}</span><span>${money(item.price * item.qty)}</span></div>`).join("")}
        <p class="fine">El PDF queda para que el asesor confirme productos, valor y entrega.</p>
      </aside>
    </section>`;
}

function viewOrder(order, pending) {
  if (pending) return `<section class="page"><p>Confirmando el pago…</p></section>`;
  if (!order) return `<section class="page"><h2 class="block-title">No encontramos el pedido.</h2></section>`;
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
          <div class="kicker">Panel</div>
          <h1>Ingresar</h1>
          <label>Usuario<input name="username" autocomplete="username" required value="admin"></label>
          <label>Clave<input name="password" type="password" autocomplete="current-password" required></label>
          <button class="btn" type="submit">Entrar</button>
          <p class="hint">Acceso interno del equipo comercial.</p>
        </form>
      </div>
    </div>`;
}
