function shellPublic(content) {
  const count = cartCount();
  const page = VM.parts[0] || "inicio";
  const links = [["inicio", "Inicio"], ["catalogo", "Catálogo"]];
  return `
    <a class="wa-side" href="${waHref()}" target="_blank" rel="noopener" aria-label="WhatsApp del asesor">${iconWhatsapp()}<span>Hablar con el asesor</span></a>
    <header class="site-header">
      <a class="brand" href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
      <nav class="nav ${VM.menu ? "open" : ""}">
        ${links.map(([id, label]) => `<a href="#/${id}" class="${page === id || (id === "catalogo" && page === "linea") ? "active" : ""}">${label}</a>`).join("")}
        <a href="#/login">Panel</a>
      </nav>
      <div class="header-actions">
        <a class="icon-btn" href="#/carrito" aria-label="Carrito">${iconBag()}<span class="cart-count ${count ? "show" : ""}" data-cart-count>${count}</span></a>
        <button class="menu-toggle" data-act="menu" aria-label="Menú">${VM.menu ? iconClose() : iconMenu()}</button>
      </div>
    </header>
    <main>${content}</main>
    <footer class="site-footer">
      <div>
        <img src="assets/logo-white.png" alt="">
        <p>Cuidado capilar masculino. ${esc(VM.config.city || SITE.city)}.</p>
      </div>
      <div>
        <strong>Casa</strong>
        <a href="#/catalogo">Catálogo</a>
        <a href="#/inicio">Testimonios</a>
        <a href="#/catalogo/molding">Línea Molding</a>
        <a href="#/catalogo/limpieza">Limpieza</a>
        <a href="#/catalogo/tratamiento">Tratamiento</a>
        <a href="#/catalogo/kids">Kids</a>
      </div>
      <div>
        <strong>Asesor</strong>
        <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </footer>`;
}

function viewHome() {
  const hero = productById("cera-brillo") || VM.products[0];
  return `
    <section class="opening">
      <div>
        <div class="eyebrow">Cali · cuidado capilar</div>
        <h1>Somos<br>la solución,<br><em>no el problema.</em></h1>
        <p class="lede">Fórmulas de alto rendimiento para el hombre que cuida la imagen como parte del oficio.</p>
        <div class="hero-actions">
          <a class="btn" href="#/catalogo">Ver el catálogo</a>
        </div>
      </div>
      <div>${hero ? orbit(hero.image, hero.name, hero.id) : ""}</div>
    </section>
    ${catalogGroups().map(homeGroup).join("")}
    <section class="manifesto">
      <h2>No vendemos promesas.<br><em>Entregamos resultados.</em></h2>
      <p>Para quien busca la opción correcta, no una más.</p>
    </section>
    ${viewTestimonials()}
    ${viewComments()}
    <section class="short-block">
      <div class="runway-head">
        <h2>La línea, en un minuto</h2>
      </div>
      <video class="short-video" controls playsinline preload="metadata" poster="assets/short-poster.jpg">
        <source src="assets/short-linea.mp4" type="video/mp4">
      </video>
    </section>`;
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
    <article class="sku">
      <a class="sku-shot" href="#/producto/${esc(item.id)}">${orbit(item.image, item.name, item.id)}</a>
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
    <section class="section catalog">
      <div class="catalog-intro">
        <div>
          <div class="kicker">Cartilla Vinicius</div>
          <h2>Catálogo</h2>
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
  return `
    <article class="product-view">
      <div class="orbit-lg">${orbit(product.image, product.name)}</div>
      <div>
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
  if (!items.length) return `<section class="page"><h2 class="block-title">El carrito está vacío.</h2><a class="btn" href="#/catalogo">Ver el catálogo</a></section>`;
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
        <a class="btn full" href="#/pago">Continuar al pago</a>
      </aside>
    </section>`;
}

function viewCheckout() {
  const items = cartDetailed();
  if (!items.length) return viewCart();
  const ready = VM.config.wompiReady;
  return `
    <section class="checkout-layout">
      <form class="form panel-card" data-form="checkout">
        <h3>Pago</h3>
        <label>Nombre<input name="name" required></label>
        <label>Celular<input name="phone" required inputmode="tel"></label>
        <label>Correo<input name="email" type="email" placeholder="opcional"></label>
        <label>Ciudad<input name="city" value="Cali"></label>
        <label>Dirección<input name="address"></label>
        <button class="btn" type="submit">${ready ? "Pagar con Wompi" : "Crear pedido"}</button>
      </form>
      <aside class="summary">
        <h3>${money(cartTotal())}</h3>
        ${items.map((item) => `<div class="sum-row"><span>${item.qty} × ${esc(item.name)}</span><span>${money(item.price * item.qty)}</span></div>`).join("")}
        <div class="pay-badges"><span>Tarjetas</span><span>PSE</span><span>Nequi</span><span>Bancolombia</span></div>
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
        <img src="assets/logo-white.png" alt="Vinicius Molding">
        <h2>El control también se administra.</h2>
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
