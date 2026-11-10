function adminShell(title, body) {
  const tab = VM.parts[1] || "resumen";
  const current = tab === "asesor" ? "contacto" : tab === "clave" ? "wompi" : tab;
  const item = (id, label) => `<a href="#/panel/${id}" class="${current === id || (id === "resumen" && !VM.parts[1]) ? "on" : ""}">${label}</a>`;
  return `
    <div class="admin">
      <aside class="side">
        <a href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
        ${item("resumen", "Resumen")}
        ${item("inventario", "Inventario")}
        ${item("seguimiento", "Seguimiento")}
        ${item("whatsapp", "WhatsApp")}
        ${item("contacto", "Contacto")}
        ${item("pedidos", "Pedidos")}
        ${item("wompi", "Wompi")}
        <div class="spacer"></div>
        <a href="#/inicio">Ver la tienda</a>
        <button class="navlink side-foot" data-act="logout">Cerrar sesión</button>
      </aside>
      <section class="admin-main">
        <div class="admin-top">
          <div>
            <div class="kicker">Panel · ${esc(VM.user?.name || "Administración")}</div>
            <h1>${title}</h1>
          </div>
          <div class="fine">${VM.config.wompiReady ? "Wompi conectado" : "Wompi pendiente de llaves"}</div>
        </div>
        ${body}
      </section>
    </div>`;
}

function viewDashboard(data) {
  const top = data.topProduct;
  const max = Math.max(1, ...data.days.map((day) => day.visits));
  return adminShell("Resumen", `
    <div class="stats">
      <article class="stat"><span>Personas hoy</span><strong>${data.today.sessions}</strong><em>${data.today.visits} páginas vistas</em></article>
      <article class="stat"><span>Personas en 7 días</span><strong>${data.week.sessions}</strong><em>${data.week.visits} páginas vistas</em></article>
      <article class="stat"><span>Pedidos</span><strong>${data.orders}</strong><em>${data.ordersPending} por cobrar · ${money(data.revenue)} aprobados</em></article>
      <article class="stat"><span>Inventario</span><strong>${data.units}</strong><em>${money(data.inventoryValue)} en existencia</em></article>
    </div>
    <div class="admin-grid">
      <article class="panel-card">
        <h3>Ingresos, últimos 14 días</h3>
        <div class="chart">
          ${data.days.map((day) => `<div class="bar" title="${day.visits} vistas · ${day.sessions} personas"><b class="${day.visits ? "on" : ""}" style="height:${day.visits ? Math.max(8, (day.visits / max) * 100) : 3}%"></b><em>${day.label}</em></div>`).join("")}
        </div>
        ${data.today.visits ? "" : `<p class="empty">El conteo real empieza cuando alguien entra a la tienda. Abre la página de inicio en otra pestaña y vuelve a mirar este resumen.</p>`}
      </article>
      <article class="panel-card">
        <h3>Producto más visto</h3>
        ${top ? `
          <img src="${esc(top.image)}" alt="" style="width:100%;height:140px;object-fit:cover;border-radius:14px">
          <strong style="display:block;margin-top:10px;font-family:var(--display);font-size:24px">${esc(top.name)}</strong>
          <p>${top.views} vistas acumuladas</p>` : `<p class="empty">Todavía nadie abre una ficha de producto.</p>`}
        <h3 style="margin-top:18px">Stock bajo</h3>
        ${data.lowStock.length ? data.lowStock.map((item) => `<div class="sum-row"><span>${esc(item.name)}</span><strong class="warn">${item.stock} / mín. ${item.minStock}</strong></div>`).join("") : `<p class="fine">Todo el inventario está sobre el mínimo.</p>`}
      </article>
    </div>
    <div class="admin-grid">
      <article class="panel-card">
        <h3>Contacto</h3>
        <p>Los clientes escriben a este número.</p>
        <strong style="display:block;font-family:var(--display);font-size:28px">${esc(VM.config.whatsapp || "")}</strong>
        <p><a href="#/panel/contacto">Cambiar número</a></p>
      </article>
      <article class="panel-card">
        <h3>Pedidos recientes</h3>
        ${data.recentOrders.length ? data.recentOrders.map((order) => `<div class="sum-row"><span>${esc(order.reference)} · ${esc(order.name)}</span><span>${money(order.total)}</span></div>`).join("") : `<p class="empty">Sin pedidos.</p>`}
        <div class="pay-badges" style="margin-top:16px"><span>${VM.config.wompiReady ? "Pasarela activa" : "Pasarela lista, sin llaves"}</span></div>
        <p class="fine">Webhook: ${esc(VM.config.webhookUrl || "")}</p>
      </article>
    </div>`);
}

function viewInventory(payload) {
  const rows = payload.products.map((product) => `
    <button type="button" class="inv-row" data-act="inv-open" data-id="${esc(product.id)}" data-name="${esc(product.name)}" data-line="${esc(product.line || "")}" data-sku="${esc(product.sku || "")}">
      <img src="${esc(product.image)}" alt="">
      <span><strong>${esc(product.name)}</strong><em>${esc(product.line || "")}</em></span>
      <b>${esc(product.sku || "")}</b>
    </button>`).join("");
  const open = payload.products.find((product) => product.id === VM.invId);
  const editor = open ? `
    <div class="inv-modal">
      <button type="button" class="inv-back" data-act="inv-close" aria-label="Cerrar"></button>
      <form class="inv-card form" data-form="product" data-id="${esc(open.id)}">
        <div class="inv-photo">
          <img src="${esc(open.image)}" alt="${esc(open.name)}">
          <label class="btn small">Subir foto<input name="photo" type="file" accept="image/*" hidden></label>
          <p class="fine">La foto se ajusta a la hoja, en Full HD y con mejor luz.</p>
        </div>
        <div class="inv-fields">
          <label>Nombre<input name="name" required value="${esc(open.name)}"></label>
          <label>Precio<input name="price" type="number" min="0" required value="${open.price}"></label>
          <label>Línea<input name="line" value="${esc(open.line || "")}"></label>
          <label>Acabado<input name="finish" value="${esc(open.finish || "")}"></label>
          <label>Contenido<input name="size" value="${esc(open.size || "")}"></label>
          <label>Referencia<input name="sku" value="${esc(open.sku || "")}"></label>
          <label class="wide">Frase<input name="summary" value="${esc(open.summary || "")}"></label>
          <label class="wide">Descripción<textarea name="description" rows="3">${esc(open.description || "")}</textarea></label>
          <label class="wide">Contiene<input name="ingredients" value="${esc((open.ingredients || []).join(" · "))}"></label>
          <div class="inv-actions"><button class="btn ghost" type="button" data-act="inv-close">Cerrar</button><button class="btn" type="submit">Guardar</button></div>
        </div>
      </form>
    </div>` : "";
  return adminShell("Inventario", `
    <div class="inv-tools">
      <input data-inv-filter="name" placeholder="Buscar por nombre" aria-label="Buscar por nombre">
      <input data-inv-filter="line" placeholder="Línea" aria-label="Buscar por línea">
      <input data-inv-filter="sku" placeholder="Referencia" aria-label="Buscar por referencia">
    </div>
    <div class="inv-list">${rows}</div>
    <p class="empty" id="inv-empty" hidden>Ningún producto coincide.</p>
    ${editor}`);
}

function viewTracking(payload) {
  const data = payload.metrics;
  const max = Math.max(1, ...data.days.map((day) => day.visits));
  const topMax = Math.max(1, ...data.topAll.map((item) => item.views));
  return adminShell("Seguimiento", `
    <div class="stats">
      <article class="stat"><span>Entran hoy</span><strong>${data.today.sessions}</strong><em>personas distintas</em></article>
      <article class="stat"><span>Páginas hoy</span><strong>${data.today.visits}</strong><em>vistas</em></article>
      <article class="stat"><span>Entran en 7 días</span><strong>${data.week.sessions}</strong><em>personas</em></article>
      <article class="stat"><span>Dispositivos</span><strong>${Object.values(data.devices).reduce((a, b) => a + b, 0) || 0}</strong><em>${Object.entries(data.devices).map(([k, v]) => `${esc(k)} ${v}`).join(" · ") || "sin datos"}</em></article>
    </div>
    <div class="admin-grid">
      <article class="panel-card">
        <h3>Tráfico</h3>
        <div class="chart">
          ${data.days.map((day) => `<div class="bar" title="${day.sessions} personas"><b class="${day.visits ? "on" : ""}" style="height:${day.visits ? Math.max(8, (day.visits / max) * 100) : 3}%"></b><em>${day.label}</em></div>`).join("")}
        </div>
      </article>
      <article class="panel-card">
        <h3>Páginas más vistas</h3>
        ${data.pages.length ? data.pages.map((page) => `<div class="sum-row"><span>${esc(page.path)}</span><strong>${page.views}</strong></div>`).join("") : `<p class="empty">Aún no hay navegación registrada.</p>`}
      </article>
    </div>
    <article class="panel-card" style="margin-top:14px">
      <h3>Producto más visto</h3>
      ${data.topAll.filter((item) => item.views > 0).map((item) => `
        <div class="sum-row" style="align-items:center">
          <span style="display:flex;gap:10px;align-items:center"><img src="${esc(item.image)}" alt="" style="width:64px;height:42px;object-fit:cover;border-radius:8px">${esc(item.name)}</span>
          <span style="flex:1;height:8px;background:#222;border-radius:99px;margin:0 12px;overflow:hidden"><b style="display:block;height:100%;width:${(item.views / topMax) * 100}%;background:var(--red)"></b></span>
          <strong>${item.views}</strong>
        </div>`).join("") || `<p class="empty">Cuando alguien abra un producto, aparecerá aquí.</p>`}
    </article>
    <article class="panel-card" style="margin-top:14px">
      <h3>Actividad reciente</h3>
      ${(payload.events || []).slice(0, 20).map((event) => `
        <div class="sum-row">
          <span>${esc(event.at.replace("T", " "))} · ${esc(event.device)} · ${esc(event.path)}</span>
          <span>${esc(event.productName || "")}</span>
        </div>`).join("") || `<p class="empty">Sin eventos.</p>`}
    </article>`);
}

function viewContact() {
  const phone = VM.config.whatsapp || "";
  return adminShell("Contacto", `
    <form class="form panel-card" data-form="contact" style="max-width:460px">
      <p class="fine">El número al que escriben los clientes.</p>
      <label>Celular<input name="phone" inputmode="tel" required value="${esc(phone)}" placeholder="573235835137"></label>
      <button class="btn" type="submit">Guardar número</button>
    </form>`);
}

function viewWhatsapp() {
  const phone = VM.config.whatsapp || SITE.whatsapp || "573235835137";
  const link = window.ViniciusBot ? ViniciusBot.waLink("Hola, quiero información de Vinicius Molding") : ("https://wa.me/" + phone);
  const qr = window.ViniciusBot ? ViniciusBot.qrSrc(link) : "";
  const history = (VM.botChat || []).map((row) => `<div class="bot-msg ${row.role}"><span>${esc(row.text)}</span></div>`).join("");
  return adminShell("WhatsApp", `
    <div class="wa-panel">
      <article class="panel-card wa-qr-card">
        <h3>Escanear y abrir</h3>
        <p class="fine">El cliente escanea el QR, abre WhatsApp y empieza a escribir. El bot responde con la información de Vinicius.</p>
        <div class="wa-qr">
          <img src="${esc(qr)}" alt="Código QR de WhatsApp" width="260" height="260">
        </div>
        <p class="wa-phone">+${esc(phone)}</p>
        <div class="wa-actions">
          <a class="btn" href="${esc(link)}" target="_blank" rel="noopener">Abrir WhatsApp</a>
          <a class="btn ghost" href="#/panel/contacto">Cambiar número</a>
        </div>
      </article>
      <article class="panel-card wa-chat-card">
        <h3>Chatbot Vinicius</h3>
        <p class="fine">Habla normal: precios, productos, uso, pedidos o la marca. La respuesta sale de tu catálogo.</p>
        <div class="bot-thread" id="bot-thread">${history || `<div class="bot-msg bot"><span>Hola, soy el asistente de Vinicius Molding. Pregúntame por un producto o di “catálogo”.</span></div>`}</div>
        <form class="bot-compose" data-form="bot-chat">
          <input name="message" required placeholder="Escribe como el cliente…" autocomplete="off">
          <button class="btn" type="submit">Enviar</button>
        </form>
      </article>
    </div>`);
}

function viewWompi() {
  const wompi = VM.config.wompi || {};
  return adminShell("Wompi", `
    <form class="form panel-card" data-form="wompi" style="max-width:560px">
      <p class="fine">Llaves de la pasarela. Con la pública y el secreto de integridad el pago queda activo.</p>
      <label>Llave pública<input name="publicKey" required value="${esc(wompi.publicKey || "")}" autocomplete="off"></label>
      <label>Secreto de integridad<input name="integritySecret" required value="${esc(wompi.integritySecret || "")}" autocomplete="off"></label>
      <label>Secreto de eventos<input name="eventsSecret" value="${esc(wompi.eventsSecret || "")}" autocomplete="off"></label>
      <p class="fine">Eventos: ${esc(VM.config.webhookUrl || "/api/wompi/events")}</p>
      <button class="btn" type="submit">Guardar Wompi</button>
    </form>`);
}

function viewOrders(orders) {
  const rows = orders.map((order) => `
    <tr>
      <td>${esc((order.at || "").replace("T", " "))}</td>
      <td><strong>${esc(order.reference)}</strong><div class="fine">${esc(order.customer?.name || "")} · ${esc(order.customer?.phone || "")}</div></td>
      <td>${(order.items || []).map((item) => `${item.qty} ${esc(item.name)}`).join("<br>")}</td>
      <td>${money(order.total)}</td>
      <td><span class="status ${esc(order.status)}">${esc(statusLabel(order.status))}</span>${order.simulated ? `<div class="fine">Simulado</div>` : ""}${order.transactionId ? `<div class="fine">${esc(order.transactionId)}</div>` : ""}</td>
    </tr>`).join("");
  return adminShell("Pedidos", `
    <article class="panel-card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Referencia</th><th>Detalle</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5" class="empty">Sin pedidos.</td></tr>`}</tbody>
        </table>
      </div>
    </article>`);
}

