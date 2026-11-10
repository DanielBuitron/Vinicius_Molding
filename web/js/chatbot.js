(() => {
  const COP = (n) => "$" + Number(n || 0).toLocaleString("es-CO");

  function products() {
    const fromVm = typeof VM !== "undefined" && VM.products && VM.products.length ? VM.products : null;
    const fromSite = typeof SITE !== "undefined" && SITE.products && SITE.products.length ? SITE.products : null;
    return fromVm || fromSite || [];
  }

  function norm(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function findProduct(q) {
    const list = products();
    let best = null;
    let score = 0;
    list.forEach((item) => {
      const bag = norm([item.name, item.sku, item.line, item.finish, item.category, item.summary, item.description, (item.ingredients || []).join(" ")].join(" "));
      let s = 0;
      q.split(" ").filter((w) => w.length > 2).forEach((w) => {
        if (bag.includes(w)) s += w.length > 4 ? 3 : 1;
      });
      ["cera", "pasta", "pomada", "shampoo", "tonico", "serum", "splash", "shaving", "ducha", "kids", "minoxidil", "canas", "carbon"].forEach((key) => {
        if (q.includes(key) && bag.includes(key)) s += 4;
      });
      if (s > score) {
        score = s;
        best = item;
      }
    });
    return score >= 3 ? best : null;
  }

  function listCatalog() {
    return products()
      .map((item) => "• " + item.name + " · " + (item.size || "") + " · " + COP(item.price))
      .join("\n");
  }

  function productCard(item) {
    const bits = [
      item.name + (item.finish ? " (" + item.finish + ")" : ""),
      item.summary || item.description || "",
      "Presentación: " + (item.size || "—"),
      "Precio: " + COP(item.price),
      item.sku ? "Referencia: " + item.sku : "",
      item.ingredients && item.ingredients.length ? "Contiene: " + item.ingredients.join(", ") : "",
      "Disponible: " + (Number(item.stock) > 0 ? "sí" : "agotado por ahora"),
    ].filter(Boolean);
    return bits.join("\n");
  }

  function reply(raw) {
    const q = norm(raw);
    const phone = (typeof VM !== "undefined" && VM.config && VM.config.whatsapp) || (typeof SITE !== "undefined" && SITE.whatsapp) || "573235835137";
    const city = (typeof VM !== "undefined" && VM.config && VM.config.city) || (typeof SITE !== "undefined" && SITE.city) || "Cali, Valle del Cauca";

    if (!q) {
      return "Hola, soy el asistente de Vinicius Molding. Pregúntame por productos, precios, uso o pedidos.";
    }

    if (/^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi)\b/.test(q)) {
      return "Hola, bienvenido a Vinicius Molding. Somos cuidado capilar masculino: molding, limpieza, tratamiento y cuerpo. ¿Qué necesitas hoy?";
    }

    if (/^(gracias|muy amable|perfecto|listo|ok|dale|de acuerdo)\b/.test(q) && q.length < 40) {
      return "Con gusto. Si quieres pedir, dime el producto y la cantidad, o escribe por WhatsApp al " + phone + ".";
    }

    if (/quien|quienes|marca|empresa|vinicius|que son|sobre ustedes|historia/.test(q)) {
      return "Vinicius Molding es una marca de cuidado capilar masculino. Fabricamos con Cosmypro Lab en Cali-Valle y comercializamos desde " + city + ". Tagline: Somos la solución, no el problema. Tenemos 14 productos para moldear, limpiar y cuidar cabello, barba y cuerpo.";
    }

    if (/whatsapp|asesor|hablar|contact|escribir|numero|celular|telefono/.test(q)) {
      return "Puedes escribirnos por WhatsApp al +" + phone + ". Ahí confirmamos pedido, ciudad y entrega.";
    }

    if (/envio|domicilio|entrega|llega|cali|pereira|risaralda|valle/.test(q)) {
      return "Despachamos y coordinamos entrega desde Cali, Valle del Cauca. También atendemos pedidos para otras ciudades por WhatsApp. Dime tu ciudad y te orientamos.";
    }

    if (/pedido|comprar|carrito|ordenar|como pido|quiero pedir/.test(q)) {
      return "Puedes armar el pedido en la revista (añadir al carrito) y al final enviamos un PDF al WhatsApp del asesor. También puedes decirme qué productos quieres y te armo la lista.";
    }

    if (/(precio|cuesta|lista de precios?|cuanto (vale|cuesta)|cuanto es)/.test(q) && !findProduct(q)) {
      const list = listCatalog();
      return list
        ? "Estos son los precios actuales:\n" + list + "\nSi quieres detalle de uno, dime el nombre."
        : "Puedo darte el precio de cada producto. Dime el nombre, por ejemplo cera, shampoo o tónico.";
    }

    if (/catalogo|productos|linea|que tienen|tienen|lista|todo/.test(q) && !findProduct(q)) {
      return "Catálogo Vinicius Molding:\n" + listCatalog() + "\nMolding, kids, limpieza, tratamiento y cuerpo. ¿Cuál te interesa?";
    }

    if (/ingrediente|contiene|formula|sin sal|parabeno|fragancia/.test(q)) {
      const hit = findProduct(q);
      if (hit) return productCard(hit);
      return "Varios productos llevan keratina, romero, aloe vera y cera de abeja. Los shampoos van sin sal. La ducha íntima va sin fragancia, colorantes ni parabenos. Dime el producto y te paso su fórmula.";
    }

    if (/minoxidil|anticaida|caida|crecimiento/.test(q)) {
      const hit = products().find((item) => /minoxidil|proteccion|tonico/i.test(item.name + " " + (item.description || ""))) || findProduct(q);
      if (hit) return productCard(hit);
    }

    if (/canas|cubre/.test(q)) {
      const hit = products().find((item) => /cubre canas/i.test(item.name)) || findProduct(q);
      if (hit) return productCard(hit);
    }

    if (/barba|bigote|serum/.test(q)) {
      const hit = products().find((item) => /serum|barba/i.test(item.name)) || findProduct(q);
      if (hit) return productCard(hit);
    }

    if (/kids|niño|ninos|infantil/.test(q)) {
      const hit = products().find((item) => /kids/i.test(item.name)) || findProduct(q);
      if (hit) return productCard(hit);
    }

    const product = findProduct(q);
    if (product) {
      if (/precio|cuanto|vale|cuesta/.test(q)) {
        return product.name + " cuesta " + COP(product.price) + " (" + (product.size || "unidad") + "). " + (product.summary || "");
      }
      if (/usar|uso|como se|aplicar|aplicacion/.test(q)) {
        return product.name + ": " + (product.description || product.summary || "Te ayudo con el uso.") + (product.size ? " Presentación " + product.size + "." : "");
      }
      return productCard(product);
    }

    if (/pago|wompi|transferencia|nequi|daviplata/.test(q)) {
      return "El pedido se confirma con el asesor por WhatsApp. Si la pasarela está activa, también se puede pagar en línea. Para agilizar, deja nombre, ciudad y productos.";
    }

    return "Puedo ayudarte con productos, precios, ingredientes, pedidos o WhatsApp. Pregunta por una cera, shampoo, tónico, serum, splash o ducha íntima, o di “catálogo” para ver la lista.";
  }

  function waLink(text) {
    const phone = (typeof VM !== "undefined" && VM.config && VM.config.whatsapp) || (typeof SITE !== "undefined" && SITE.whatsapp) || "573235835137";
    const msg = encodeURIComponent(text || "Hola, quiero hablar con Vinicius Molding.");
    return "https://wa.me/" + phone + "?text=" + msg;
  }

  function qrSrc(data) {
    return "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=" + encodeURIComponent(data);
  }

  window.ViniciusBot = { reply, waLink, qrSrc, products, listCatalog };
})();
