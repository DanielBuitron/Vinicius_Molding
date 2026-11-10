(() => {
  const KEY = "vm_lang";
  const CUR_KEY = "vm_currency";
  const dict = {
    es: {
      "lang.es": "ES",
      "lang.en": "EN",
      "lang.zh": "中文",
      "lang.switch": "Idioma",
      "voices.kicker": "Testimonios",
      "voices.orders": "Órdenes entregadas a clientes en todo el país.",
      "voices.rating": "Calificación promedio de nuestros clientes.",
      "voices.original": "Productos originales de cuidado capilar profesional.",
      "voices.stars": "5 estrellas",
      "voices.verified": "Compra verificada",
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
      "nav.askCatalog": "Ver catálogo",
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
      "footer.kits": "Kits",
      "home.tag": "Nueva escena 3D",
      "home.title": "Lookbook interactivo<br>que puedes explorar",
      "home.text": "Desliza la rueda. La tapa se abre y las páginas giran sobre la mesa.",
      "home.hint": "Desliza para abrir",
      "home.cta": "Ver catálogo",
      "catalog.kicker": "Lookbook · Vinicius",
      "catalog.title": "Catálogo",
      "catalog.lede": "Ceras, shampoos, tratamientos y kits. Filtra por línea y elige tu pieza.",
      "catalog.all": "Todos",
      "catalog.add": "Agregar",
      "catalog.view": "Ver",
      "catalog.prev": "Anterior",
      "catalog.next": "Siguiente",
      "catalog.search": "Buscar producto…",
      "catalog.sort": "Ordenar",
      "catalog.sort.name": "Nombre",
      "catalog.sort.priceAsc": "Precio ↑",
      "catalog.sort.priceDesc": "Precio ↓",
      "catalog.count": "{n} productos",
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
      "cat.kits": "Kits y combos",
      "cat.kits.blurb": "Rutinas completas de crecimiento, restauración y cuidado capilar.",
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
      "lang.zh": "中文",
      "lang.switch": "Language",
      "voices.kicker": "Testimonials",
      "voices.orders": "Orders delivered to clients nationwide.",
      "voices.rating": "Average rating from our clients.",
      "voices.original": "Original professional hair-care products.",
      "voices.stars": "5 stars",
      "voices.verified": "Verified purchase",
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
      "nav.askCatalog": "View catalog",
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
      "footer.kits": "Kits",
      "home.tag": "New 3D scene",
      "home.title": "An interactive lookbook<br>you can explore",
      "home.text": "Scroll the wheel. The cover opens and the pages turn on the desk.",
      "home.hint": "Scroll to open",
      "home.cta": "View catalog",
      "catalog.kicker": "Lookbook · Vinicius",
      "catalog.title": "Catalog",
      "catalog.lede": "Waxes, shampoos, treatments and kits. Filter by line and pick your piece.",
      "catalog.all": "All",
      "catalog.add": "Add",
      "catalog.view": "View",
      "catalog.prev": "Previous",
      "catalog.next": "Next",
      "catalog.search": "Search product…",
      "catalog.sort": "Sort",
      "catalog.sort.name": "Name",
      "catalog.sort.priceAsc": "Price ↑",
      "catalog.sort.priceDesc": "Price ↓",
      "catalog.count": "{n} products",
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
      "cat.kits": "Kits & combos",
      "cat.kits.blurb": "Complete routines for growth, restoration and hair care.",
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
    zh: {
      "lang.es": "ES",
      "lang.en": "EN",
      "lang.zh": "中文",
      "lang.switch": "语言",
      "voices.kicker": "用户评价",
      "voices.orders": "已向全国客户完成超过一千笔订单。",
      "voices.rating": "客户平均评分。",
      "voices.original": "100% 专业男士护发正品。",
      "voices.stars": "五星",
      "voices.verified": "已验证购买",
      "cur.switch": "货币",
      "cur.cop": "COP",
      "cur.usd": "USD",
      "cur.noteCop": "价格以哥伦比亚比索显示。配送从卡利协调。",
      "cur.noteUsd": "美元按哥伦比亚共和国银行 TRM 换算。付款以 COP 确认。",
      "cur.trm": "BanRep TRM：{rate}",
      "nav.home": "首页",
      "nav.catalog": "目录",
      "nav.panel": "后台",
      "nav.login": "登录",
      "nav.loginShort": "登录",
      "nav.cart": "购物车",
      "nav.menu": "菜单",
      "nav.talk": "咨询",
      "nav.askCatalog": "查看目录",
      "nav.askCatalogShort": "目录",
      "nav.advisor": "联系顾问",
      "footer.house": "品牌",
      "footer.advisor": "顾问",
      "footer.blurb": "男士护发。{city}。",
      "footer.lineMolding": "造型系列",
      "footer.cleaning": "清洁",
      "footer.treatment": "护理",
      "footer.kids": "儿童",
      "footer.body": "身体",
      "footer.kits": "套装",
      "home.tag": "全新 3D 场景",
      "home.title": "可互动探索的<br>Lookbook",
      "home.text": "滑动滚轮。封面打开，书页在桌面上翻动。",
      "home.hint": "滑动打开",
      "home.cta": "查看目录",
      "catalog.kicker": "Lookbook · Vinicius",
      "catalog.title": "目录",
      "catalog.lede": "发蜡、洗发水、护理与套装。按系列筛选并选择产品。",
      "catalog.all": "全部",
      "catalog.add": "加入",
      "catalog.view": "查看",
      "catalog.prev": "上一页",
      "catalog.next": "下一页",
      "catalog.search": "搜索产品…",
      "catalog.sort": "排序",
      "catalog.sort.name": "名称",
      "catalog.sort.priceAsc": "价格 ↑",
      "catalog.sort.priceDesc": "价格 ↓",
      "catalog.count": "{n} 件产品",
      "product.missing": "找不到该产品。",
      "product.back": "返回目录",
      "product.line": "系列",
      "product.size": "规格",
      "product.finish": "效果",
      "product.sku": "货号",
      "product.add": "加入购物车",
      "product.ask": "咨询",
      "product.hold": "定型力 {n}/5",
      "product.more": "同系列其他产品",
      "product.recommend": "为你推荐",
      "product.view": "查看产品",
      "stock.out": "售罄",
      "stock.low": "仅剩 {n}",
      "stock.ok": "有货",
      "cart.empty": "购物车是空的。",
      "cart.back": "返回杂志",
      "cart.title": "你的选择",
      "cart.remove": "移除",
      "cart.total": "合计",
      "cart.note": "按所选货币显示价格。付款以 COP 在卡利确认。",
      "cart.send": "提交订单",
      "checkout.title": "联系信息",
      "checkout.fine": "提交后，订单 PDF 会发送到顾问的 WhatsApp。",
      "checkout.name": "姓名",
      "checkout.phone": "手机",
      "checkout.city": "城市",
      "checkout.address": "地址",
      "checkout.note": "备注",
      "checkout.notePh": "时间、社区或说明",
      "checkout.submit": "发送 PDF 给顾问",
      "checkout.aside": "顾问会在 WhatsApp 收到，以确认产品、金额和配送。",
      "order.confirming": "正在确认付款…",
      "order.missing": "未找到该订单。",
      "login.title": "登录",
      "login.user": "用户名",
      "login.pass": "密码",
      "login.submit": "进入",
      "login.hint": "销售团队内部入口。",
      "shop.tagline": "我们是解决方案，不是问题。",
      "shop.doneTitle": "完成！",
      "shop.doneText": "精美报价 PDF 已发送到你的 WhatsApp{ref}。感谢选择我们。",
      "shop.title": "Vinicius 目录",
      "shop.lede": "慢慢浏览，加入喜欢的产品，最后我们会把报价发到你的 WhatsApp。",
      "shop.add": "加入",
      "shop.inCart": "购物车 {n} 件",
      "shop.send": "发送报价到 WhatsApp",
      "shop.missing": "缺少目录链接。",
      "shop.missingHint": "请在 WhatsApp 发送“目录”以获取新链接。",
      "shop.loading": "正在加载目录",
      "shop.error": "无法打开目录。",
      "shop.errorHint": "请再次在 WhatsApp 发送“目录”。",
      "shop.sending": "发送中…",
      "mag.cover": "封面",
      "mag.about": "关于我们",
      "mag.collection": "系列 · 目录",
      "mag.contact": "联系",
      "mag.prev": "上一页",
      "mag.next": "下一页",
      "mag.detail": "产品详情",
      "mag.wa": "通过 WhatsApp 订购",
      "mag.close": "关闭",
      "mag.prevProduct": "上一个产品",
      "mag.nextProduct": "下一个产品",
      "mag.waFab": "联系顾问",
      "mag.whoTitle": "关于我们",
      "mag.whoP1": "我们是男士护发品牌，专为不将就、注重细节的男士而生，他们知道成功也从头皮开始。",
      "mag.whoP2": "我们不卖承诺，只交付结果。",
      "mag.solution": "我们是解决方案，不是问题",
      "mag.solutionP": "真正有效的护发产品，不绕弯，不做虚假承诺。",
      "mag.collectionTitle": "系列",
      "mag.collectionP": "{n} 款产品，用于造型、清洁与护理头发、胡须和身体。",
      "mag.contents": "目录",
      "mag.fullLine": "完整产品线",
      "mag.fullLineP": "杂志中共有 {n} 件产品：造型、清洁、护理与身体。",
      "mag.orderYours": "立即选购",
      "mag.orderP": "由 Cosmypro Lab（卡利-山谷）制造，Vinicius Molding 销售。",
      "mag.price": "价格",
      "mag.size": "规格",
      "mag.finishLabel": "效果",
      "mag.contains": "成分",
      "mag.base": "基质",
      "mag.use": "用法",
      "mag.formula": "配方",
      "mag.add": "加入购物车",
      "mag.less": "减少",
      "mag.more": "增加",
      "mag.waAsk": "你好，我想了解 {name}（编号 {ref}）",
      "mag.ref": "编号 {ref} · Vinicius Molding",
      "wa.default": "你好，我想联系 Vinicius Molding 顾问。",
      "wa.catalog": "你好，我想要 Vinicius Molding 目录",
      "wa.product": "你好，我想了解 {name}。",
      "cat.molding": "造型系列",
      "cat.molding.blurb": "发蜡、发泥、发油与发胶，塑造并保持发型。",
      "cat.kids": "儿童",
      "cat.kids.blurb": "纤维发蜡的儿童版。",
      "cat.limpieza": "清洁",
      "cat.limpieza.blurb": "无盐洗发水与男士私密洗护。",
      "cat.tratamiento": "护理",
      "cat.tratamiento.blurb": "头皮精华与胡须精华。",
      "cat.cuerpo": "身体",
      "cat.cuerpo.blurb": "身体喷雾与剃须啫喱，适合日常护理。",
      "cat.kits": "套装与组合",
      "cat.kits.blurb": "完整的生发、修护与护发护理方案。",
      "piece.0": "零",
      "piece.1": "一件",
      "piece.n": "{n} 件",
      "title.home": "Vinicius Molding · 男士护发",
      "title.catalog": "目录",
      "title.cart": "购物车",
      "title.pay": "结算",
      "title.order": "订单",
      "title.login": "登录",
      "title.panel": "后台",
      "title.product": "产品",
      "status.nuevo": "新",
      "status.contactado": "已联系",
      "status.cerrado": "已关闭",
      "status.pendiente_pago": "待付款",
      "status.aprobado": "已批准",
      "status.rechazado": "已拒绝",
      "status.anulado": "已取消",
      "status.error": "错误",
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

  const productZh = {
    "cera-brillo": {
      name: "中亮泽发蜡",
      finish: "中亮泽",
      summary: "全天定型，呈现自然亮泽。",
      description: "中亮泽造型发蜡。含角蛋白、迷迭香、芦荟与蜂蜡，持久塑形。",
    },
    "cera-fibra": {
      name: "纤维发蜡",
      finish: "湿润效果",
      summary: "湿润造型，如同刚从理发店出来。",
      description: "湿润效果纤维发蜡。随发型灵活调整，易梳理。含角蛋白、迷迭香、芦荟与蜂蜡。",
    },
    pasta: {
      name: "造型发泥",
      finish: "亮泽",
      summary: "优雅亮泽与定型，打造专业外观。",
      description: "亮泽造型发泥。含角蛋白、迷迭香、芦荟与蜂蜡。",
    },
    pomada: {
      name: "哑光发油",
      finish: "哑光效果",
      summary: "强力控制不服帖头发，哑光质感。",
      description: "哑光造型发油。含角蛋白、迷迭香、芦荟与蜂蜡，呈现自然发型。",
    },
    "gel-cubre-canas": {
      name: "遮盖白发啫喱",
      finish: "湿润亮泽",
      summary: "遮盖白发，呈现湿润亮泽效果。",
      description: "遮盖白发啫喱。湿润亮泽效果。含角蛋白、迷迭香、芦荟与蜂蜡。",
    },
    "pasta-minoxidil": {
      name: "米诺地尔发泥",
      finish: "蜂蜡基底",
      summary: "含米诺地尔、泛醇与迷迭香的发泥。",
      description: "米诺地尔发泥。以蜂蜡为基底，含米诺地尔、泛醇与迷迭香。用于干发或半干发。",
    },
    "cera-kids": {
      name: "儿童纤维发蜡",
      finish: "轻柔定型",
      summary: "专为儿童头发设计的温和配方。",
      description: "儿童纤维发蜡。温和定型，含角蛋白、迷迭香、芦荟与蜂蜡。",
    },
    "shampoo-proteccion": {
      name: "护发洗发水",
      finish: "无盐",
      summary: "清洁并呵护头发。无盐配方。",
      description: "护发洗发水，含迷迭香、角蛋白、洋葱、芦荟、胡萝卜与透明质酸。无盐配方。",
    },
    "shampoo-carbon": {
      name: "活性炭洗发水",
      finish: "无盐",
      summary: "活性炭配方，舒缓头皮屑与瘙痒。无盐。",
      description: "活性炭洗发水。有助于改善头皮屑与瘙痒。含迷迭香、角蛋白、洋葱、芦荟、胡萝卜与透明质酸。无盐。",
    },
    "ducha-intima": {
      name: "男士私密洗护",
      finish: "男士专用",
      summary: "男士私密清洁。无香精、无色素、无对羟基苯甲酸酯。",
      description: "男士私密洗护。无香精、无色素、无对羟基苯甲酸酯。",
    },
    tonico: {
      name: "有机头皮精华",
      finish: "头皮护理",
      summary: "头皮植物精华。含 19 种活性成分。",
      description: "有机头皮精华，含迷迭香、生物素、大黄、角蛋白、透明质酸与芦荟。用于头皮。",
    },
    "serum-barba": {
      name: "胡须与唇须精华",
      finish: "柔顺护理",
      summary: "柔顺亮泽胡须。含阿甘油、荷荷巴油与芦荟。",
      description: "胡须与唇须精华。阿甘油、荷荷巴油与芦荟，便于梳理并增添光泽。",
    },
    splash: {
      name: "男士身体喷雾",
      finish: "男士专用",
      summary: "身体喷雾。桉树与薄荷醇。",
      description: "男士身体喷雾。按需喷涂。含水、酒精、桉树与薄荷醇。",
    },
    "shaving-gel": {
      name: "男士剃须啫喱",
      finish: "含芦荟",
      summary: "男士剃须啫喱。含芦荟。",
      description: "男士剃须啫喱。含芦荟。250 毫升。",
    },
  };

  const LANGS = ["es", "en", "zh"];

  function detectLang() {
    try {
      const saved = localStorage.getItem(KEY);
      if (LANGS.includes(saved)) return saved;
    } catch (_) {}
    const nav = String((navigator.language || "es")).toLowerCase();
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("en")) return "en";
    return "es";
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
    lang = LANGS.includes(next) ? next : "es";
    try { localStorage.setItem(KEY, lang); } catch (_) {}
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.body.dataset.lang = lang;
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("on", btn.getAttribute("data-lang-btn") === lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang-btn") === lang ? "true" : "false");
    });
    applyStaticLang();
    if ((lang === "en" || lang === "zh") && typeof window.VM !== "undefined") {
      warmProductTranslations(window.VM.products || []);
    }
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
      { id: "kits", name: t("cat.kits"), blurb: t("cat.kits.blurb") },
      { id: "limpieza", name: t("cat.limpieza"), blurb: t("cat.limpieza.blurb") },
      { id: "tratamiento", name: t("cat.tratamiento"), blurb: t("cat.tratamiento.blurb") },
      { id: "kids", name: t("cat.kids"), blurb: t("cat.kids.blurb") },
      { id: "cuerpo", name: t("cat.cuerpo"), blurb: t("cat.cuerpo.blurb") },
    ];
  }

  const trCaches = { en: {}, zh: {} };
  try { trCaches.en = JSON.parse(localStorage.getItem("vm_tr_en") || "{}") || {}; } catch (_) { trCaches.en = {}; }
  try { trCaches.zh = JSON.parse(localStorage.getItem("vm_tr_zh") || "{}") || {}; } catch (_) { trCaches.zh = {}; }
  const pendingTr = new Set();
  let refreshTimer = 0;

  function scheduleLangRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (typeof window.refreshRevistaLang === "function") window.refreshRevistaLang();
      if (typeof window.onSiteLangChange === "function") window.onSiteLangChange(lang);
    }, 350);
  }

  function cachedTr(target, text) {
    const src = String(text || "").trim();
    if (!src || !trCaches[target]) return "";
    return trCaches[target][src] || "";
  }

  function saveTr(target, text, out) {
    const src = String(text || "").trim();
    const translated = String(out || "").trim();
    if (!src || !translated || !trCaches[target]) return;
    trCaches[target][src] = translated;
    try { localStorage.setItem("vm_tr_" + target, JSON.stringify(trCaches[target])); } catch (_) {}
  }

  function queueTranslate(text, target) {
    const src = String(text || "").trim();
    const dest = target === "zh" ? "zh" : "en";
    const key = dest + ":" + src;
    if (!src || cachedTr(dest, src) || pendingTr.has(key) || src.length < 2) return;
    pendingTr.add(key);
    const pair = dest === "zh" ? "es|zh-CN" : "es|en";
    const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(src.slice(0, 450)) + "&langpair=" + pair;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const out = data && data.responseData && data.responseData.translatedText;
        if (out && String(out).trim() && String(out).trim() !== src) {
          saveTr(dest, src, out);
          if (lang === dest) scheduleLangRefresh();
        }
      })
      .catch(() => {})
      .finally(() => pendingTr.delete(key));
  }

  function ensureTextTranslated(text, target) {
    const src = String(text || "").trim();
    const dest = target || (lang === "zh" ? "zh" : "en");
    if (!src || dest === "es") return src;
    const hit = cachedTr(dest, src);
    if (hit) return hit;
    queueTranslate(src, dest);
    return src;
  }

  function ensureTextEn(text) {
    return ensureTextTranslated(text, "en");
  }

  function productField(product, field) {
    if (!product) return "";
    const raw = product[field] || "";
    if (lang === "es") return raw;
    if (lang === "zh") {
      const row = productZh[product.id];
      if (row && row[field]) return row[field];
      if (product.zh && product.zh[field]) return product.zh[field];
      return ensureTextTranslated(raw, "zh");
    }
    const row = productEn[product.id];
    if (row && row[field]) return row[field];
    if (product.en && product.en[field]) return product.en[field];
    return ensureTextTranslated(raw, "en");
  }

  function warmProductTranslations(list) {
    if (lang !== "en" && lang !== "zh") return;
    const pack = lang === "zh" ? productZh : productEn;
    (list || []).forEach((item) => {
      ["name", "summary", "description", "finish", "line"].forEach((field) => {
        const raw = item && item[field];
        if (!raw) return;
        if (pack[item.id] && pack[item.id][field]) return;
        if (item[lang] && item[lang][field]) return;
        ensureTextTranslated(raw, lang);
      });
    });
  }

  function langSwitcherHtml(extraClass) {
    return `<div class="lang-switch ${extraClass || ""}" role="group" aria-label="${t("lang.switch")}">
      <button type="button" data-lang-btn="es" aria-pressed="${lang === "es" ? "true" : "false"}" class="${lang === "es" ? "on" : ""}">ES</button>
      <button type="button" data-lang-btn="en" aria-pressed="${lang === "en" ? "true" : "false"}" class="${lang === "en" ? "on" : ""}">EN</button>
      <button type="button" data-lang-btn="zh" aria-pressed="${lang === "zh" ? "true" : "false"}" class="${lang === "zh" ? "on" : ""}">中文</button>
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
      ask.setAttribute("href", "#/catalogo");
      ask.removeAttribute("target");
      ask.removeAttribute("rel");
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
  window.ensureTextTranslated = ensureTextTranslated;
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
