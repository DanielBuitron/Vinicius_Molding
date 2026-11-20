const CAMPAIGN_COPY = {
  kicker: ["Cuidado capilar masculino", "Men’s hair care", "男士头发护理"],
  slogan: ["Somos la solución,|no el problema.", "We are the solution,|not the problem.", "我们是解决方案，|而非问题。"],
  intro: ["Moldeado y cuidado capilar Vinicius Molding.", "Styling and hair care by Vinicius Molding.", "Vinicius Molding 造型与头发护理。"],
  explore: ["Explorar productos", "Explore products", "探索产品"],
  exploreShort: ["Explorar", "Explore", "探索"],
  scroll: ["Desliza para abrir la caja", "Scroll to open the box", "向下滑动打开包装盒"],
  discover: ["Descubre tu estilo", "Discover your style", "发现你的风格"],
  question: ["¿Qué quieres conseguir con tu peinado?", "What look are you going for?", "你想要什么样的造型？"],
  natural: ["Acabado natural", "Natural finish", "自然效果"],
  texture: ["Textura y definición", "Texture and definition", "纹理与线条"],
  control: ["Fijación y control", "Hold and control", "定型与控制"],
  structure: ["Peinado estructurado", "Structured styling", "立体造型"],
  care: ["Cuidado capilar", "Hair care", "头发护理"],
  line: ["Líneas de producto", "Product lines", "产品系列"],
  molding: ["Moldeado", "Styling", "造型"],
  product: ["Ver ficha", "View product", "查看产品"],
  add: ["Añadir al carrito", "Add to cart", "加入购物车"],
  closed: ["Cerrado", "Closed", "闭合"],
  inside: ["Interior", "Inside", "内部"],
  rotate: ["Girar 360°", "Rotate 360°", "旋转 360°"],
  rotateLeft: ["Girar a la izquierda", "Rotate left", "向左旋转"],
  rotateRight: ["Girar a la derecha", "Rotate right", "向右旋转"],
  view3d: ["Ver en 3D", "View in 3D", "查看 3D"],
  loading3d: ["Cargando el visor", "Loading viewer", "正在加载查看器"],
  unavailable3d: ["El visor no está disponible. Puedes explorar la foto y la ficha del producto.", "The viewer is unavailable. You can explore the product photo and details.", "查看器不可用。你可以查看产品照片和详情。"],
  other: ["Completa tu rutina", "Complete your routine", "完善日常护理"],
  all: ["Ver catálogo completo", "View full catalog", "查看完整目录"],
  use: ["Modo de uso", "Directions", "使用方法"],
  waxBenefit: ["Define y moldea con brillo medio.", "Shapes and defines with medium shine.", "塑造线条，呈现中等光泽。"],
  shampooBenefit: ["Acondiciona el cabello y aporta brillo y suavidad.", "Conditions hair for shine and softness.", "调理头发，提升光泽与柔顺度。"],
  useShampoo: ["Aplica sobre el cabello húmedo y frota suavemente hasta hacer espuma. Deja actuar 5 minutos y enjuaga con abundante agua.", "Apply to damp hair and massage gently to lather. Leave for 5 minutes, then rinse thoroughly.", "涂于湿发，轻揉至起泡。静置 5 分钟，再用清水充分冲洗。"],
  useDry: ["Frota una pequeña cantidad entre las manos y aplícala sobre el cabello seco.", "Rub a small amount between your hands and apply to dry hair.", "取少量在掌心揉开，涂于干发。"],
  useSemiDry: ["Frota una pequeña cantidad entre las palmas. Distribúyela en cabello seco o semiseco y moldea con los dedos.", "Rub a small amount between your palms. Spread through dry or semi-dry hair and style with your fingers.", "取少量在掌心揉开，均匀涂于干发或半干发，用手指造型。"],
  usePaste: ["Frota una pequeña cantidad entre las palmas. Distribúyela uniformemente y define el peinado con los dedos.", "Rub a small amount between your palms. Apply evenly and define the style with your fingers.", "取少量在掌心揉开，均匀涂抹，用手指定型。"],
};

const CAMPAIGN_GOALS = {
  natural: ["pomada", "useDry"],
  texture: ["cera-fibra", "useSemiDry"],
  control: ["cera-brillo", "useSemiDry"],
  structure: ["pasta", "usePaste"],
  care: ["shampoo-proteccion", "useShampoo"],
};
const CAMPAIGN_LINES = ["molding", "limpieza", "tratamiento", "kids", "cuerpo", "kits", "accesorios"];
const CAMPAIGN_ACCENTS = {
  "cera-brillo": "#e52c3b", "cera-fibra": "#585e65", pasta: "#00c8c2", pomada: "#a4d800",
  "cera-kids": "#ffd300", "shampoo-proteccion": "#e52c3b", "shampoo-carbon": "#585e65",
  "ducha-intima": "#a4d800", "serum-barba": "#a4d800", tonico: "#00c8c2",
  "tonico-minoxidil": "#e52c3b", "tonico-23": "#e52c3b", splash: "#00c8c2",
  "shaving-gel": "#e52c3b",
};
const CAMPAIGN_POSTER = "assets/inicio/cera-cerrada.webp";
const CAMPAIGN_STORY = [
  { at: 0, preview: "cera-caja", label: ["Caja", "Box", "包装盒"],
    title: ["Quiénes somos", "About us", "关于我们"],
    text: ["Vinicius Molding es una marca de cuidado capilar y personal con atención desde Cali.", "Vinicius Molding is a hair and personal care brand serving customers from Cali.", "Vinicius Molding 是一个来自卡利的头发与个人护理品牌。"] },
  { at: 0.36, preview: "cera-caja-abierta", label: ["Abrir", "Open", "打开"],
    title: ["Qué encuentras", "What we make", "我们的产品"],
    text: ["Ceras, pastas y pomadas para dar forma y definir el peinado. También tenemos línea Kids, productos para el cuerpo y accesorios de barbería.", "Waxes, pastes and pomades to shape and define hair, plus Kids, body care and barber accessories.", "提供塑形发蜡、发泥与发膏，以及儿童系列、身体护理和理发配件。"] },
  { at: 0.67, preview: "cera-envase", label: ["Destapar", "Unscrew", "旋开"],
    title: ["Limpieza y tratamiento", "Cleansing and treatment", "清洁与护理"],
    text: ["Champús para la limpieza y el cuidado capilar. Sérum para barba y bigote, y tónicos con indicaciones según cada fórmula.", "Shampoos for cleansing and hair care, serum for beards and moustaches, and tonics with directions for each formula.", "洗发水用于清洁和护理头发，精华用于胡须护理，护理液的用法因配方而异。"], href: "#/catalogo/tratamiento" },
  { at: 1, preview: "cera-interior", label: ["Interior", "Inside", "内部"],
    title: ["La tienda Vinicius", "The Vinicius shop", "Vinicius 商店"],
    text: ["La Cera Moldeadora define el peinado con brillo medio. En la tienda puedes comparar acabados, consultar cada ficha y comprar desde el carrito.", "Molding Wax defines hair with a medium shine. Browse finishes, check product details and shop from your cart.", "塑形发蜡呈现中等光泽。你可以在商店比较不同效果、查看详情并通过购物车购买。"], href: "#/producto/cera-brillo" },
];
const storyAsset = (scene) => `assets/inicio/${scene.preview}.webp`;
const campaignSelection = { line: "molding", item: "cera-brillo", goal: "natural" };
let campaignController;
let campaignIntroduced = false;

function campaignText(key) {
  return campaignLocalized(CAMPAIGN_COPY[key]);
}

function campaignLocalized(values) {
  return values[({ es: 0, en: 1, zh: 2 })[getLang()] ?? 0];
}

function campaignName(item) {
  return productField(item, "name") || item.name;
}

function campaignLineName(line) {
  return line === "molding" ? campaignText("molding") : categoryName(line);
}

function campaignCatalog() {
  const products = catalogProducts();
  const groups = new Map(CAMPAIGN_LINES.map((line) => [line, products.filter((item) => item.category === line)]));
  const molding = groups.get("molding");
  const wax = molding.findIndex((item) => item.id === "cera-brillo");
  if (wax > 0) molding.unshift(molding.splice(wax, 1)[0]);
  const firstLine = CAMPAIGN_LINES.find((line) => groups.get(line).length);
  if (!groups.get(campaignSelection.line).length && firstLine) campaignSelection.line = firstLine;
  const current = groups.get(campaignSelection.line);
  const index = Math.max(0, current.findIndex((item) => item.id === campaignSelection.item));
  if (current[index]) campaignSelection.item = current[index].id;
  return { groups, current, index };
}

function campaignFigure(item, placement) {
  const model = CATALOG_VOLUME_LINES.has(item.category);
  const main = studioCover(item.id) || item.image;
  const closed = item.id === "cera-brillo" ? ` data-campaign-closed="${CAMPAIGN_POSTER}"` : "";
  return `<figure class="campaign-figure campaign-figure-${placement}" data-campaign-figure="${placement}"
      data-product="${esc(item.id)}" data-cover="${esc(main)}"${closed}${model ? " data-campaign-3d" : ""}>
    <div class="campaign-visual" data-campaign-visual${model ? ` aria-label="${esc(campaignName(item))}"` : ""}>
      <img class="campaign-poster" src="${esc(main)}" alt="${esc(campaignName(item))}" draggable="false" decoding="async" loading="lazy">
    </div>
    ${model ? `<div class="campaign-view-tools">
      <button type="button" data-campaign-enable>${campaignText("view3d")}</button>
      <div class="campaign-view-controls" hidden>
        <button type="button" data-campaign-pose="cerrado" aria-pressed="false" hidden>${campaignText("closed")}</button>
        <button type="button" data-campaign-pose="completo" aria-pressed="true" hidden>${campaignText("inside")}</button>
        <button type="button" data-campaign-rotate="-1" aria-label="${campaignText("rotateLeft")}">‹</button>
        <button type="button" data-campaign-rotate="1" aria-label="${campaignText("rotateRight")}">›</button>
        <button type="button" data-campaign-rotate="full">${campaignText("rotate")}</button>
      </div>
    </div>` : ""}
    <span class="sr-only" data-campaign-view-status role="status"></span>
  </figure>`;
}

function campaignDetails(item, usage, heading = "h2") {
  const name = campaignName(item);
  const finish = [productField(item, "finish"), item.size].filter(Boolean).join("  /  ");
  const ingredients = (item.ingredients || []).slice(0, 3).join(" · ");
  const displayPrice = Number(item.price) > 0 && !item.consultationOnly;
  const buy = displayPrice && productById(item.id);
  const benefit = { "cera-brillo": "waxBenefit", "shampoo-proteccion": "shampooBenefit" }[item.id];
  const summary = benefit ? campaignText(benefit) : (productField(item, "summary") || item.summary);
  return `<div class="campaign-detail">
    ${finish ? `<p class="campaign-eyebrow">${esc(finish)}</p>` : ""}
    <${heading}>${esc(name)}</${heading}>
    ${summary ? `<p class="campaign-description">${esc(summary)}</p>` : ""}
    ${!usage && ingredients ? `<p class="campaign-fine">${esc(ingredients)}</p>` : ""}
    ${usage ? `<p class="campaign-usage"><strong>${campaignText("use")}</strong><span>${campaignText(usage)}</span></p>` : ""}
    ${displayPrice ? `<p class="campaign-price">${esc(money(item.price))} <small>${esc(getCurrency())}</small></p>` : ""}
    <div class="campaign-actions">
      ${buy ? `<button type="button" class="campaign-primary" data-act="add" data-id="${esc(item.id)}" data-qty="1" ${item.stock > 0 ? "" : "disabled"}>${item.stock > 0 ? campaignText("add") : t("stock.out")}</button>` :
        `<a class="campaign-primary" href="${waHref(t("wa.product", { name }))}" target="_blank" rel="noopener">${t("product.ask")}</a>`}
      <a class="campaign-link" href="#/producto/${esc(item.id)}">${campaignText("product")} <span aria-hidden="true">→</span></a>
    </div>
  </div>`;
}

function campaignExplorer() {
  const { groups, current, index } = campaignCatalog();
  const item = current[index];
  if (!item) return `<a class="campaign-link" href="#/catalogo">${campaignText("all")}</a>`;
  const next = current[(index + 1) % current.length];
  return `<div class="campaign-explorer-body" style="--scene-accent:${CAMPAIGN_ACCENTS[item.id] || "#585e65"}">
    <div class="campaign-inner">
      <div class="campaign-lines" role="group" aria-label="${campaignText("line")}">${[...groups].filter(([, products]) => products.length).map(([line]) =>
        `<button type="button" data-campaign-line="${line}" aria-pressed="${line === campaignSelection.line}">${esc(campaignLineName(line))}</button>`).join("")}</div>
      <div class="campaign-product-scene">
        <div class="campaign-media-wrap">
          ${campaignFigure(item, "product")}
          ${current.length > 1 ? `<div class="campaign-steps">
            <button type="button" data-campaign-step="-1" aria-label="${t("catalog.prev")}">‹</button>
            <button type="button" data-campaign-step="1" aria-label="${t("catalog.next")}">›</button>
          </div>` : ""}
        </div>
        <div class="campaign-product-copy">
          ${campaignDetails(item)}
          ${current.length > 1 ? `<div class="campaign-next">
            <button type="button" data-campaign-step="-1" aria-label="${t("catalog.prev")}">←</button>
            <button type="button" data-campaign-step="1" aria-label="${t("catalog.next")} · ${esc(campaignName(next))}">${esc(campaignName(next))} <span aria-hidden="true">→</span></button>
          </div>` : ""}
        </div>
      </div>
    </div>
  </div>`;
}

function campaignRecommendation() {
  const [id, usage] = CAMPAIGN_GOALS[campaignSelection.goal];
  const item = catalogProductById(id);
  if (!item) return `<a class="campaign-link" href="#/catalogo">${campaignText("all")}</a>`;
  return `<div class="campaign-style-result" style="--scene-accent:${CAMPAIGN_ACCENTS[item.id] || "#585e65"}">
    ${campaignFigure(item, "style")}${campaignDetails(item, usage, "h3")}
  </div>`;
}

function viewCampaign() {
  const hero = catalogProductById("cera-brillo");
  const [start, finish] = campaignText("slogan").split("|");
  return `<div class="campaign" data-campaign>
    <section class="campaign-hero campaign-story" data-campaign-hero>
      <div class="campaign-story-pin">
      <div class="campaign-inner">
        <div class="campaign-story-grid">
          <div class="campaign-hero-copy">
            <p class="campaign-eyebrow">${campaignText("kicker")}</p>
            <h1><span>${start}</span><span>${finish}</span></h1>
            <p class="campaign-intro">${hero ? esc(campaignName(hero)) : campaignText("intro")}</p>
            <p class="campaign-story-mobile-hint" aria-hidden="true">↓ ${campaignText("scroll")}</p>
            <a class="campaign-link" href="#/catalogo">${t("nav.askCatalog")} <span aria-hidden="true">→</span></a>
          </div>
          <figure class="campaign-figure campaign-story-figure" data-campaign-figure="hero" data-product="cera-brillo"
            data-cover="${storyAsset(CAMPAIGN_STORY[0])}" data-campaign-3d>
            <div class="campaign-visual" data-campaign-visual>
              <img class="campaign-poster" src="${storyAsset(CAMPAIGN_STORY[0])}" alt="${hero ? esc(campaignName(hero)) : "Vinicius Molding"}"
                width="960" height="960" fetchpriority="high" decoding="async">
            </div>
            <span class="sr-only" data-campaign-view-status role="status"></span>
          </figure>
          <div class="campaign-story-editorial">
            ${CAMPAIGN_STORY.map((scene, index) => `<article class="campaign-chapter" data-campaign-chapter="${index}" ${index ? "hidden" : ""}>
              <p class="campaign-eyebrow">${campaignLocalized(scene.label)}</p>
              <h2>${campaignLocalized(scene.title)}</h2>
              <p>${campaignLocalized(scene.text)}</p>
              ${scene.href ? `<a class="campaign-link" href="${scene.href}">${index === 2 ? t("footer.treatment") : campaignText("product")} <span aria-hidden="true">→</span></a>` : ""}
            </article>`).join("")}
          </div>
        </div>
        <div class="campaign-story-navigation">
          <button type="button" class="campaign-scroll" data-story-next><span aria-hidden="true">↓</span> <span data-story-next-label>${campaignText("scroll")}</span></button>
          <div class="campaign-story-steps" role="group" aria-label="${campaignText("exploreShort")}">
            ${CAMPAIGN_STORY.map((scene, index) => `<button type="button" data-story-step="${index}" aria-pressed="${index === 0}">${campaignLocalized(scene.label)}</button>`).join("")}
          </div>
        </div>
      </div>
      </div>
    </section>
    <section class="campaign-explore" id="campaign-explore" tabindex="-1" aria-label="${campaignText("explore")}" data-campaign-explorer>${campaignExplorer()}</section>
    <section class="campaign-style" id="campaign-style" tabindex="-1" aria-labelledby="campaign-style-title">
      <div class="campaign-inner campaign-style-grid">
        <div class="campaign-quiz">
          <h2 id="campaign-style-title">${campaignText("discover")}</h2>
          <p>${campaignText("question")}</p>
          <div class="campaign-goals" role="group" aria-label="${campaignText("question")}">
            ${Object.keys(CAMPAIGN_GOALS).map((goal) => `<button type="button" data-campaign-goal="${goal}" aria-pressed="${goal === campaignSelection.goal}">${campaignText(goal)}<span aria-hidden="true">→</span></button>`).join("")}
          </div>
        </div>
        <div data-campaign-recommendation>${campaignRecommendation()}</div>
      </div>
    </section>
    <section class="campaign-complements campaign-inner">
      <h2>${campaignText("other")}</h2>
      <div class="campaign-complement-links">
        ${["limpieza", "kits", "accesorios"].map((line) => `<a href="#/catalogo/${line}">${esc(campaignLineName(line))}<span aria-hidden="true">↗</span></a>`).join("")}
      </div>
      <a class="campaign-link" href="#/catalogo">${campaignText("all")} <span aria-hidden="true">→</span></a>
    </section>
    <p class="sr-only" role="status" data-campaign-announcement></p>
  </div>`;
}

function mountCampaign() {
  const root = document.querySelector("[data-campaign]");
  if (!root) return;
  const controller = new AbortController();
  const { signal } = controller;
  const header = document.querySelector(".campaign-header");
  if (!campaignIntroduced) {
    header.setAttribute("data-campaign-reveal", "");
    campaignIntroduced = true;
  }
  const hero = root.querySelector("[data-campaign-hero]");
  const pin = hero.querySelector(".campaign-story-pin");
  const poster = hero.querySelector(".campaign-poster");
  const chapters = [...hero.querySelectorAll("[data-campaign-chapter]")];
  const storySteps = [...hero.querySelectorAll("[data-story-step]")];
  const storyNext = hero.querySelector("[data-story-next-label]");
  const mobileHint = hero.querySelector(".campaign-story-mobile-hint");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  const connection = navigator.connection;
  const manuallyEnabled = new Set();
  const failed = new WeakSet();
  const poses = new WeakMap();
  let figures = [];
  let renderer, active, chosen, requested, changeId = 0, scheduled = 0;
  let idle, hardFailure = false;
  let lookX = 0, lookY = 0, drag;
  let storyChapter = 0;

  function showStatus(figure, key) {
    figure.querySelector("[data-campaign-view-status]").textContent = campaignText(key);
  }

  function setLive(figure, live) {
    figure.toggleAttribute("data-campaign-live", live);
    const visual = figure.querySelector("[data-campaign-visual]");
    if (!live && figure.dataset.campaignFigure === "hero") poster.src = storyAsset(CAMPAIGN_STORY[storyChapter]);
    if (live && figure.dataset.campaignFigure !== "hero") visual.tabIndex = 0;
    else visual.removeAttribute("tabindex");
    const enable = figure.querySelector("[data-campaign-enable]");
    if (enable) {
      enable.hidden = live || failed.has(figure) || hardFailure;
      enable.disabled = false;
      enable.textContent = campaignText("view3d");
      figure.querySelector(".campaign-view-controls").hidden = !live;
    }
  }

  function leaveModel() {
    if (active) setLive(active, false);
    active = null;
    drag = null;
    renderer?.detach();
  }

  function selectPose(figure, pose) {
    poses.set(figure, pose);
    for (const button of figure.querySelectorAll("[data-campaign-pose]")) {
      button.setAttribute("aria-pressed", String(button.dataset.campaignPose === pose));
    }
    const img = figure.querySelector("img");
    const fallback = pose === "cerrado" && figure.dataset.campaignClosed;
    img.src = fallback || figure.dataset.cover;
    if (active === figure) renderer.pose(pose, !motion.matches);
  }

  async function mountModel(figure, job) {
    try {
      await loadStoreVolume();
      if (signal.aborted || job !== changeId) return;
      await loadVolumeEngine();
      if (signal.aborted || job !== changeId) return;
      const model = await buildVolume(figure.dataset.cover, figure.dataset.product);
      if (signal.aborted || job !== changeId) return;
      if (!model) throw new Error("Producto sin modelo");
      if (!renderer) {
        try { renderer = createCampaignVolume(); } catch (error) { hardFailure = true; throw error; }
      }
      const isHero = figure.dataset.campaignFigure === "hero";
      const host = figure.querySelector("[data-campaign-visual]");
      renderer.mount(host, model, poses.get(figure) || (isHero ? "cerrado" : "completo"), isHero,
        CAMPAIGN_ACCENTS[figure.dataset.product] || "#585e65");
      active = figure;
      figure.querySelectorAll("[data-campaign-pose]").forEach((button) => { button.hidden = !model.frameParts; });
      setLive(figure, true);
      const canvas = host.querySelector("canvas");
      if (!canvas.dataset.campaignBound) {
        canvas.dataset.campaignBound = "true";
        canvas.addEventListener("webglcontextlost", () => {
          hardFailure = true;
          if (active) showStatus(active, "unavailable3d");
          leaveModel();
          figures.forEach((item) => setLive(item, false));
        }, { signal });
      }
      if (requested === figure) {
        host.focus({ preventScroll: true });
        requested = null;
      }
      schedule();
    } catch (_) {
      if (signal.aborted || job !== changeId) return;
      failed.add(figure);
      if (requested === figure) {
        showStatus(figure, "unavailable3d");
        figure.querySelector("[data-campaign-view-status]").classList.add("campaign-visible-status");
      }
      if (hardFailure) figures.forEach((item) => setLive(item, false));
      else setLive(figure, false);
    }
  }

  function display(figure) {
    if (figure === chosen) return;
    const old = chosen;
    chosen = figure;
    const job = ++changeId;
    if (old && old !== active) setLive(old, false);
    leaveModel();
    if (!figure) return;
    const enable = figure.querySelector("[data-campaign-enable]");
    if (enable) {
      enable.disabled = true;
      enable.textContent = campaignText("loading3d");
    }
    mountModel(figure, job);
  }

  function automatic() {
    return idle && !motion.matches && pointer.matches && !connection?.saveData &&
      !/^(slow-)?2g$/.test(connection?.effectiveType || "") && !(navigator.deviceMemory > 0 && navigator.deviceMemory < 4);
  }

  function storyPosition() {
    const range = hero.getBoundingClientRect();
    const top = header.getBoundingClientRect().height;
    const travel = Math.max(1, range.height - pin.offsetHeight);
    return { start: window.scrollY + range.top - top, progress: Math.min(1, Math.max(0, (top - range.top) / travel)), travel };
  }

  function seekStory(index) {
    const { start, travel } = storyPosition();
    window.scrollTo({ top: start + travel * CAMPAIGN_STORY[index].at, behavior: motion.matches ? "instant" : "smooth" });
  }

  function setStoryChapter(index) {
    if (index === storyChapter) return;
    storyChapter = index;
    chapters.forEach((chapter, i) => { chapter.hidden = i !== index; });
    storySteps.forEach((step, i) => step.setAttribute("aria-pressed", String(i === index)));
    storyNext.textContent = index === 0 ? campaignText("scroll") :
      (index === CAMPAIGN_STORY.length - 1 ? campaignText("explore") : campaignLocalized(CAMPAIGN_STORY[index + 1].label));
    mobileHint.textContent = "↓ " + storyNext.textContent;
    if (active?.dataset.campaignFigure !== "hero") poster.src = storyAsset(CAMPAIGN_STORY[index]);
  }

  function update() {
    scheduled = 0;
    const height = window.innerHeight;
    const { progress } = storyPosition();
    setStoryChapter(progress >= 0.91 ? 3 : progress >= 0.58 ? 2 : progress >= 0.27 ? 1 : 0);
    hero.style.setProperty("--story-progress", String(progress));
    hero.style.setProperty("--light-x", `${50 + lookX * 4 - progress * 5}%`);

    let nearest = null;
    let best = 0;
    if (!document.hidden && !hardFailure) for (const figure of figures) {
      const story = figure.dataset.campaignFigure === "hero";
      const enabled = manuallyEnabled.has(figure.dataset.campaignFigure) || automatic() ||
        (story && idle && !motion.matches && !connection?.saveData && !/^(slow-)?2g$/.test(connection?.effectiveType || ""));
      if (!enabled || failed.has(figure)) continue;
      const rect = figure.getBoundingClientRect();
      const visible = Math.min(height, rect.bottom) - Math.max(0, rect.top);
      if (visible <= 0 || visible < Math.min(rect.height * 0.3, height * 0.2)) continue;
      const score = visible / Math.min(height, rect.height) + (figure === active ? 0.06 : 0);
      if (score > best || figure === requested || figure === drag?.figure) {
        best = (figure === requested || figure === drag?.figure) ? Infinity : score;
        nearest = figure;
      }
    }
    display(nearest);
    if (active?.dataset.campaignFigure === "hero" && !motion.matches) renderer.compose(progress, lookX, lookY);
  }

  function schedule() {
    if (!scheduled && !signal.aborted) scheduled = requestAnimationFrame(update);
  }

  function registerFigures() {
    figures = [...root.querySelectorAll("[data-campaign-3d]")];
    if (chosen && !chosen.isConnected) display(null);
    schedule();
  }

  function refreshScene(key, focus, announce = true) {
    const explorer = key === "explorer";
    const target = root.querySelector(explorer ? "[data-campaign-explorer]" : "[data-campaign-recommendation]");
    const markup = explorer ? campaignExplorer() : campaignRecommendation();
    if (target.innerHTML !== markup) target.innerHTML = markup;
    if (focus) target.querySelector(focus)?.focus({ preventScroll: true });
    if (announce) root.querySelector("[data-campaign-announcement]").textContent = target.querySelector(".campaign-detail h2, .campaign-detail h3")?.textContent || "";
    registerFigures();
  }

  function click(event) {
    const button = event.target.closest("button");
    if (!button) return;
    const { campaignJump, campaignLine, campaignStep, campaignGoal, campaignPose, campaignRotate } = button.dataset;
    if (button.hasAttribute("data-story-step")) {
      seekStory(Number(button.dataset.storyStep));
      return;
    }
    const storyAdvance = button.hasAttribute("data-story-next");
    if (storyAdvance && storyChapter < CAMPAIGN_STORY.length - 1) {
      seekStory(storyChapter + 1);
      return;
    }
    if (campaignJump || storyAdvance) {
      const section = root.querySelector(`#campaign-${campaignJump || "explore"}`);
      if (VM.menu) {
        VM.menu = false;
        showCampaignMenu(false);
      }
      section.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: motion.matches ? "instant" : "smooth", block: "start" });
      return;
    }
    if (campaignLine && campaignLine !== campaignSelection.line) {
      campaignSelection.line = campaignLine;
      refreshScene("explorer", `[data-campaign-line="${campaignLine}"]`);
      return;
    }
    if (campaignStep) {
      const { current, index } = campaignCatalog();
      campaignSelection.item = current[(index + Number(campaignStep) + current.length) % current.length].id;
      const nav = button.closest(".campaign-steps") ? ".campaign-steps" : ".campaign-next";
      refreshScene("explorer", `${nav} [data-campaign-step="${campaignStep}"]`);
      return;
    }
    if (campaignGoal && campaignGoal !== campaignSelection.goal) {
      campaignSelection.goal = campaignGoal;
      for (const option of root.querySelectorAll("[data-campaign-goal]")) {
        option.setAttribute("aria-pressed", String(option === button));
      }
      refreshScene("recommendation");
      return;
    }
    const figure = button.closest("[data-campaign-3d]");
    if (!figure) return;
    if (button.hasAttribute("data-campaign-enable")) {
      manuallyEnabled.add(figure.dataset.campaignFigure);
      requested = figure;
      schedule();
    } else if (campaignPose) selectPose(figure, campaignPose);
    else if (campaignRotate && active === figure) {
      const turn = campaignRotate === "full" ? (motion.matches ? Math.PI : 2 * Math.PI) : Number(campaignRotate) * (Math.PI / 6);
      renderer.turn(0, turn, motion.matches);
    }
  }

  function dragStart(event) {
    const visual = event.target.closest("[data-campaign-visual]");
    if (!active || active.dataset.campaignFigure === "hero" || !visual || !active.contains(visual) || event.button !== 0 || !event.isPrimary) return;
    drag = { figure: active, id: event.pointerId, x: event.clientX, y: event.clientY };
    visual.setPointerCapture(event.pointerId);
  }

  function dragMove(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    drag.x = event.clientX;
    drag.y = event.clientY;
    if (dx || dy) renderer.turn(event.pointerType === "touch" ? 0 : dy * 0.007, dx * 0.011, motion.matches);
  }

  function dragEnd(event) {
    if (event.pointerId === drag?.id) {
      drag = null;
      schedule();
    }
  }

  root.addEventListener("click", click, { signal });
  header.addEventListener("click", click, { signal });
  root.addEventListener("pointerdown", dragStart, { signal });
  root.addEventListener("pointermove", dragMove, { signal });
  root.addEventListener("pointerup", dragEnd, { signal });
  root.addEventListener("pointercancel", dragEnd, { signal });
  root.addEventListener("lostpointercapture", dragEnd, { signal });
  root.addEventListener("keydown", (event) => {
    if (!active?.contains(event.target) || !event.target.matches("[data-campaign-visual]")) return;
    const delta = { ArrowLeft: [0, -0.24], ArrowRight: [0, 0.24], ArrowUp: [-0.18, 0], ArrowDown: [0.18, 0] }[event.key];
    if (!delta) return;
    event.preventDefault();
    renderer.turn(...delta, motion.matches);
  }, { signal });
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || drag || motion.matches) return;
    const bounds = hero.getBoundingClientRect();
    lookX = 2 * (event.clientX - bounds.left) / bounds.width - 1;
    lookY = 2 * (event.clientY - bounds.top) / bounds.height - 1;
    schedule();
  }, { signal });
  hero.addEventListener("pointerleave", () => { lookX = lookY = 0; schedule(); }, { signal });
  window.addEventListener("scroll", schedule, { passive: true, signal });
  window.addEventListener("resize", schedule, { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  motion.addEventListener("change", schedule, { signal });
  pointer.addEventListener("change", schedule, { signal });

  const ready = () => { if (!signal.aborted) { idle = true; schedule(); } };
  if ("requestIdleCallback" in window) requestIdleCallback(ready, { timeout: 900 });
  else setTimeout(ready, 300);
  registerFigures();
  campaignController = {
    refresh() {
      refreshScene("explorer", null, false);
      refreshScene("recommendation", null, false);
    },
    dispose() {
      controller.abort();
      if (scheduled) cancelAnimationFrame(scheduled);
      renderer?.dispose();
    },
  };
}

function unmountCampaign() {
  campaignController?.dispose();
  campaignController = undefined;
}

function refreshCampaign() {
  campaignController?.refresh();
}

function showCampaignMenu(open) {
  const header = document.querySelector(".campaign-header");
  if (!header) return false;
  header.querySelector(".nav").classList.toggle("open", open);
  const toggle = header.querySelector(".menu-toggle");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.innerHTML = open ? iconClose() : iconMenu();
  return true;
}
