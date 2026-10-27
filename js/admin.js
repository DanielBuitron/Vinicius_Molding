function adminShell(title, body) {
  const tab = VM.parts[1] || "resumen";
  const leads = VM.metrics ? VM.metrics.leadsNew : 0;
  const item = (id, label, extra) => `<a href="#/panel/${id}" class="${tab === id || (id === "resumen" && !VM.parts[1]) ? "on" : ""}">${label}${extra || ""}</a>`;
  return `
    <div class="admin">
      <aside class="side">
        <a href="#/inicio"><img src="assets/logo-white.png" alt="Vinicius Molding"></a>
        ${item("resumen", "Resumen")}
        ${item("inventario", "Inventario")}
        ${item("seguimiento", "Seguimiento")}
        ${item("asesor", "Asesor", leads ? `<span class="badge">${leads}</span>` : "")}
        ${item("pedidos", "Pedidos")}
        ${item("clave", "Clave")}
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
        <h3>Contactos recientes</h3>
        ${data.recentLeads.length ? data.recentLeads.map((lead) => `<div class="sum-row"><span>${esc(lead.name)} · ${esc(lead.phone)}</span><span class="status ${esc(lead.status)}">${esc(statusLabel(lead.status))}</span></div>`).join("") : `<p class="empty">Nadie ha dejado su número todavía.</p>`}
        <p><a href="#/panel/asesor">Abrir bandeja del asesor</a></p>
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
    <tr class="${product.stock <= product.minStock ? "low" : ""}">
      <td><img src="${esc(product.image)}" alt=""></td>
      <td><strong>${esc(product.name)}</strong><div class="fine">${esc(product.sku)} · ${product.views || 0} vistas</div></td>
      <td><input data-field="price" data-id="${esc(product.id)}" type="number" min="0" value="${product.price}"></td>
      <td><input data-field="stock" data-id="${esc(product.id)}" type="number" min="0" value="${product.stock}"></td>
      <td><input data-field="minStock" data-id="${esc(product.id)}" type="number" min="0" value="${product.minStock}"></td>
      <td><button class="btn small" data-act="save-stock" data-id="${esc(product.id)}">Guardar</button></td>
    </tr>`).join("");
  const moves = (payload.movements || []).slice(0, 8).map((move) => `
    <div class="sum-row"><span>${esc(move.name)} · ${esc(move.reason)}</span><span>${move.before} → ${move.after}</span></div>`).join("");
  return adminShell("Inventario", `
    <article class="panel-card">
      <div class="table-wrap">
        <table>
          <thead><tr><th></th><th>Producto</th><th>Precio</th><th>Stock</th><th>Mínimo</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </article>
    <article class="panel-card" style="margin-top:14px">
      <h3>Movimientos</h3>
      ${moves || `<p class="empty">Los ajustes y las ventas aprobadas quedan registrados aquí.</p>`}
    </article>`);
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

function viewLeads(leads) {
  const rows = leads.map((lead) => `
    <tr>
      <td>${esc((lead.at || "").replace("T", " "))}</td>
      <td><strong>${esc(lead.name)}</strong><div class="fine">${esc(lead.city || "")} · ${esc(lead.interest || "")} · ${esc(lead.schedule || "")}</div></td>
      <td><a href="tel:+${esc(lead.phone)}">${esc(lead.phone)}</a><div><a href="${esc(waLink(lead.phone))}" target="_blank" rel="noopener">WhatsApp</a></div></td>
      <td>${esc(lead.note || "")}</td>
      <td>
        <select data-act="lead-status" data-id="${esc(lead.id)}">
          ${["nuevo", "contactado", "cerrado"].map((status) => `<option value="${status}" ${lead.status === status ? "selected" : ""}>${statusLabel(status)}</option>`).join("")}
        </select>
      </td>
    </tr>`).join("");
  return adminShell("Asesor", `
    <article class="panel-card">
      <p class="fine">Números que la gente deja para que el asesor comercial devuelva la llamada.</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Contacto</th><th>Número</th><th>Nota</th><th>Estado</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5" class="empty">Todavía no hay números.</td></tr>`}</tbody>
        </table>
      </div>
    </article>`);
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
      <h3>Wompi</h3>
      <p>${VM.config.wompiReady ? "La pasarela está activa. El checkout redirige a Wompi y el regreso confirma la transacción." : "Deja en config.json la llave pública, el secreto de integridad y el secreto de eventos. El checkout, la firma y el webhook ya están armados."}</p>
      <div class="pay-badges">
        <span>publicKey</span><span>integritySecret</span><span>eventsSecret</span>
      </div>
      <p class="fine">Eventos: ${esc(VM.config.webhookUrl || "/api/wompi/events")}</p>
    </article>
    <article class="panel-card" style="margin-top:14px">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Fecha</th><th>Referencia</th><th>Detalle</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="5" class="empty">Sin pedidos.</td></tr>`}</tbody>
        </table>
      </div>
    </article>`);
}

function viewPassword() {
  return adminShell("Clave", `
    <form class="form panel-card" data-form="password" style="max-width:460px">
      <label>Clave actual<input name="current" type="password" required></label>
      <label>Clave nueva<input name="next" type="password" required minlength="8"></label>
      <button class="btn" type="submit">Actualizar clave</button>
    </form>`);
}
