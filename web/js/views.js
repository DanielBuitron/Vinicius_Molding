function shellPublic(content) {
  const count = cartCount();
  const page = VM.parts[0] || "inicio";
  const links = [["inicio", "Inicio"], ["linea", "Línea"], ["marca", "La marca"], ["asesor", "Número"]];
  return `
    <a class="wa-side" href="${waHref()}" target="_blank" rel="noopener" aria-label="WhatsApp del asesor">${iconWhatsapp()}<span>Hablar con el asesor</span></a>
    <header class="site-header">
      <a class="brand" href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
      <nav class="nav ${VM.menu ? "open" : ""}">
        ${links.map(([id, label]) => `<a href="#/${id}" class="${page === id ? "active" : ""}">${label}</a>`).join("")}
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
        <a href="#/linea">La línea</a>
        <a href="#/marca">La marca</a>
        <a href="#/asesor">Dejar número</a>
      </div>
      <div>
        <strong>Asesor</strong>
        <a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a>
        <a href="#/asesor">Escribe tu celular</a>
      </div>
    </footer>`;
}

function viewHome() {
  const hero = productById("serum-barba") || VM.products[0];
  const rail = VM.products.slice(0, 8);
  return `
    <section class="opening">
      <div>
        <div class="eyebrow">Cali · cuidado capilar</div>
        <h1>Somos<br>la solución,<br><em>no el problema.</em></h1>
        <p class="lede">Fórmulas de alto rendimiento para el hombre que cuida la imagen como parte del oficio. Toma el producto y muévelo: arriba, abajo, a un lado y al otro.</p>
        <div class="hero-actions">
          <a class="btn" href="#/linea">Ver la línea</a>
          <a class="btn ghost" href="#/asesor">Dejar mi número</a>
        </div>
      </div>
      <div>${hero ? orbit(hero.image, hero.name) : ""}</div>
    </section>
    <section class="runway">
      <div class="runway-head">
        <h2>Arrastra la línea.</h2>
        <a href="#/linea">Catálogo</a>
      </div>
      <div class="rail">
        ${rail.map((item) => `<article>${orbit(item.image, item.name)}<h3><a href="#/producto/${esc(item.id)}">${esc(item.name)}</a></h3><p>${money(item.price)} · ${esc(item.size)}</p></article>`).join("")}
      </div>
    </section>
    <section class="manifesto">
      <h2>No vendemos promesas. Entregamos resultados.</h2>
      <p>Hecho para hombres de 25 a 45 años que quieren la opción correcta, no una más.</p>
    </section>
    ${phoneBlock()}`;
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

function viewLinea() {
  const filters = [["todos", "Todos"], ["fijacion", "Fijación"], ["cuidado", "Cuidado"], ["tratamiento", "Tratamiento"], ["kids", "Kids"]];
  const list = VM.products.filter((item) => VM.filter === "todos" || item.category === VM.filter);
  return `
    <section class="section">
      <div class="kicker">Catálogo</div>
      <div style="display:flex;justify-content:space-between;gap:16px;align-items:end;flex-wrap:wrap;margin:8px 0 28px">
        <h2>Diez fórmulas.<br>Una presencia.</h2>
        <div class="filters">${filters.map(([id, label]) => `<button class="chip ${VM.filter === id ? "on" : ""}" data-act="filter" data-cat="${id}">${label}</button>`).join("")}</div>
      </div>
      <div class="bands">
        ${list.map((item) => `
          <article class="band">
            <div>${orbit(item.image, item.name)}</div>
            <div>
              <div class="kicker">${esc(item.line)} · ${esc(item.size)}</div>
              <h3>${esc(item.name)}</h3>
              <p>${esc(item.summary)}</p>
              <div class="price">${money(item.price)}</div>
              <div class="buy-row">
                <a class="btn ghost" href="#/producto/${esc(item.id)}">Ver de cerca</a>
                <button class="btn" data-act="add" data-id="${esc(item.id)}" ${item.stock ? "" : "disabled"}>Agregar</button>
              </div>
            </div>
          </article>`).join("") || `<p class="empty">No hay piezas en esta familia.</p>`}
      </div>
    </section>`;
}

function viewProduct() {
  const product = productById(VM.parts[1]);
  if (!product) return `<section class="page"><h2 class="block-title">Esa pieza no está.</h2><a class="btn" href="#/linea">Volver</a></section>`;
  const qty = VM.qty[product.id] || 1;
  const hold = product.hold ? `<div class="hold">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= product.hold ? "on" : ""}"></i>`).join("")}</div>` : "";
  return `
    <article class="product-view">
      <div class="orbit-lg">${orbit(product.image, product.name)}</div>
      <div>
        <div class="kicker">${esc(categoryName(product.category))} · ${esc(product.sku)}</div>
        <h1>${esc(product.name)}</h1>
        <p class="lede">${esc(product.description)}</p>
        ${hold}
        <div class="meta"><span class="tag">${esc(product.finish)}</span><span class="tag">${esc(product.size)}</span>${(product.ingredients || []).map((item) => `<span class="tag">${esc(item)}</span>`).join("")}</div>
        <div class="price" style="font-size:28px">${money(product.price)}</div>
        ${stockLabel(product)}
        <div class="buy-row">
          <div class="qty">
            <button type="button" data-act="qty" data-id="${esc(product.id)}" data-dir="-1">−</button>
            <span>${qty}</span>
            <button type="button" data-act="qty" data-id="${esc(product.id)}" data-dir="1">+</button>
          </div>
          <button class="btn" data-act="add" data-id="${esc(product.id)}" data-qty="${qty}" ${product.stock ? "" : "disabled"}>Agregar al carrito</button>
        </div>
      </div>
    </article>`;
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
  if (!items.length) return `<section class="page"><h2 class="block-title">El carrito está vacío.</h2><a class="btn" href="#/linea">Ver la línea</a></section>`;
  return `
    <section class="cart-layout">
      <div>
        <h2 class="block-title" style="margin-bottom:16px">Tu selección</h2>
        ${items.map((item) => `
          <article class="line-item">
            <img src="${esc(item.image)}" alt="">
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
