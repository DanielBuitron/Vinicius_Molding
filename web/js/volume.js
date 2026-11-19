/* Envase en 3D con la etiqueta real de cada producto. */
const volumeViewers = [];
const kidsViewers = [];
const volumeModels = new Map();
let volumeJob = 0;
let volumeLogo = null;
let volumeWord = null;
let localVolumeTextures;
const volumeScriptUrl = typeof document !== "undefined" && document.currentScript?.src;

const PACKS = {
  "cera-fibra": { kind: "tin", accent: "#6E45C8", body: "#121214", ink: "#f6f3ec", title: "CERA & FIBRA", lidLines: ["ACABADO HÚMEDO"], size: "200 g", hold: 4, wax: ["#fbfaf6", "#efeae0", "#ddd4c4"] },
  "cera-brillo": { kind: "tin", accent: "#E10600", body: "#121214", ink: "#f6f3ec", title: "CERA", lidLines: ["MOLDEADORA", "BRILLO MEDIO"], size: "150 g", hold: 3, wax: ["#f8f3e4", "#ead9b0", "#d2bc88"] },
  "pasta": { kind: "tin", accent: "#2FBE9B", body: "#121214", ink: "#f6f3ec", title: "PASTA", lidLines: ["MOLDEADORA", "BRILLANTE"], size: "150 g", hold: 4, wax: ["#d8f6ff", "#67d4ee", "#1aa8cc"] },
  "pomada": { kind: "tin", accent: "#C6DE14", body: "#121214", ink: "#f6f3ec", title: "POMADA", lidLines: ["MOLDEADORA", "MATE"], size: "150 g", hold: 3, wax: ["#fff1a8", "#f0c52a", "#d9a40c"] },
  "gel-cubre-canas": { kind: "tin", accent: "#f4f4f4", body: "#121214", ink: "#f6f3ec", title: "GEL", lidLines: ["CUBRE CANAS"], size: "150 g", hold: 3, wax: ["#131313", "#0e0e0e", "#070707"] },
  "pasta-minoxidil": { kind: "tin", accent: "#141414", body: "#2EE6D0", ink: "#141414", title: "PASTA", lidLines: ["MINOXIDIL"], size: "150 g", hold: 3, sideLines: ["MINOXIDIL", "PANTENOL", "ROMERO"] },
  "cera-kids": { kind: "tin", accent: "#FFD300", body: "#e10600", ink: "#ffffff", title: "CERA DE FIBRA", lidSub: "KIDS", size: "150 g", hold: 3, kids: true },
  "shampoo-proteccion": { kind: "pump", accent: "#E10600", body: "#f4f2ee", ink: "#171717", title: "SHAMPOO", lidSub: "PROTECCIÓN CAPILAR", size: "500 g", face: "white" },
  "shampoo-carbon": { kind: "pump", accent: "#d7ff3a", body: "#171717", ink: "#f4f1ea", title: "SHAMPOO", lidSub: "CARBÓN ACTIVO", size: "500 ml", face: "carbon", v: "#ececec" },
  "serum-barba": { kind: "dropper", accent: "#A4D800", body: "#1a1a1c", ink: "#f4f1ea", title: "SERUM", lidSub: "BARBA · BIGOTE", size: "65 ml", face: "serum" },
  "tonico": { kind: "spray", accent: "#E4C84A", body: "#101012", ink: "#f7f4ea", title: "TÓNICO", lidSub: "ORGÁNICO", size: "65 ml", face: "tonico" },
  "tonico-minoxidil": { kind: "spray", accent: "#E52C3B", body: "#101012", ink: "#f7f4ea", title: "TÓNICO", lidSub: "MINOXIDIL 12.5%", concentration: "12.5%", size: "65 ml", face: "minox" },
  "tonico-23": { kind: "spray", accent: "#E52C3B", body: "#18181a", ink: "#f7f4ea", title: "TÓNICO", lidSub: "MINOXIDIL 23%", concentration: "23%", size: "65 ml", face: "minox" },
  "ducha-intima": { kind: "tube", accent: "#8ED400", body: "#141416", ink: "#f4f1ea", title: "DUCHA ÍNTIMA", lidSub: "FOR MEN", size: "180 g", face: "tube" },
  "splash": { kind: "spray", accent: "#4BA3DC", body: "#0c2f4a", ink: "#f4f8fc", title: "BODY SPLASH", lidSub: "FOR MEN", size: "250 ml", face: "splash" },
  "shaving-gel": { kind: "tube", accent: "#FF6A00", body: "#161616", ink: "#f4f1ea", title: "SHAVING GEL", lidSub: "FOR MEN", size: "250 ml", face: "shave" },
};

const LID_ART = {
  "cera-brillo": ["assets/lid-cera.png", "assets/strip-cera.jpg"],
  "cera-fibra": ["assets/lid-fibra.png", "assets/strip-fibra.jpg"],
  "pasta": ["assets/lid-pasta.png", "assets/strip-pasta.jpg"],
  "pomada": ["assets/lid-pomada.png", "assets/strip-pomada.jpg"],
  "pasta-minoxidil": ["productos_3d/pasta-minoxidil/texturas/tapa-3d.webp", "assets/strip-pasta-minoxidil.jpg"],
  "gel-cubre-canas": ["assets/lid-gel-cubre-canas.png", "assets/strip-gel-cubre-canas.jpg"],
  "cera-kids": ["assets/lid-cera-kids.png", "assets/strip-cera-kids.jpg"],
};

const MOLDING_STAGE_ART = {
  "cera-brillo": { box: "frente.jpg", edge: "canto-cera.jpg", ingredients: "canto-ingredientes.jpg", cream: "crema-foto.jpg", tone: "#dfd5af" },
  "cera-fibra": { box: "frente.jpg", edge: "canto-nombre.jpg", ingredients: "canto-ingredientes.jpg", tone: "#d1cbb4" },
  pasta: { box: "frente.jpg", tone: "#5c9da9" },
  pomada: { box: "frente.jpg", tone: "#b6a23d" },
  "gel-cubre-canas": { edge: "canto-3d.webp", tone: "#131314", creamTint: "#303030", creamRoughness: 0.68, creamRelief: 0.003 },
  "cera-kids": { edge: "banda-3d.webp", band: "banda-3d.webp", tone: "#85628f", boxColor: "#be1b29", flipTopV: true },
};

const FORM = {
  "shampoo-proteccion": { top: "pump", body: "#f7f5f2", face: "white", box: "#f3f0ea", boxBack: true, wrapFront: 0.5, labelRange: [0.1, 0.75] },
  "shampoo-carbon": { top: "pump", body: "#121214", face: "carbon", box: "#222120", boxBack: true, wrapFront: 0.5, labelRange: [0.09, 0.76] },
  "ducha-intima": { top: "tube", body: "#221f1f", face: "tube", labelBack: true, labelRange: [0.1, 0.91] },
  tonico: { top: "spray", body: "#151619", face: "tonico", box: "#094b53", boxBack: true, wrapFront: 0.25, labelRange: [0.075, 0.79] },
  "tonico-minoxidil": { top: "spray", body: "#160d0e", face: "minox", box: "#a52224", boxDepth: 0.53, boxSide: "left", boxBack: true, labelBase: "#a52224", labelBack: true, labelRange: [0.075, 0.79] },
  "tonico-23": { top: "spray", box: "#1b1b1c", boxDepth: 0.55, boxSide: true, boxBack: true, labelRange: [0.075, 0.8] },
  "serum-barba": { top: "dropper", body: "#121214", face: "serum", box: "#222220", boxSide: true, wrapFront: 0.25, labelRange: [0.09, 0.77] },
  splash: { top: "spray", body: "#174e69", face: "splash", wrapFront: 0.25, labelRange: [0.10, 0.83] },
  "shaving-gel": { top: "pump", body: "#d78124", face: "shave", wrapFront: 0.25, labelRange: [0.09, 0.82] },
};

const SHELF = {
  demarroller: 1,
  "lapiz-barba": 1,
  patillera: 1,
  soplador: 1,
  "tapete-iman": 1,
  "tapete-sin-iman": 1,
  "porta-cuallero": 1,
  cuadros: 1,
};

const KIT_PARTS = {
  "kit-capilar": ["shampoo-proteccion", "tonico"],
  "kit-capilar-avanzado": ["tonico", "shampoo-proteccion"],
  "kit-capilar-avanzado-plus": ["tonico", "serum-barba"],
  "kit-capilar-completo": ["shampoo-proteccion", "tonico", "serum-barba"],
  "kit-12-5": ["tonico"],
  "kit-crecimiento-23": ["shampoo-proteccion", "tonico"],
  "kit-organico": ["tonico", "shampoo-proteccion"],
  "kit-organico-avanzado": ["tonico", "shampoo-proteccion"],
  "kit-restaurador": ["shampoo-proteccion", "tonico"],
};

function releaseVolumes() {
  while (volumeViewers.length) volumeViewers.pop().dispose();
}

function mountOrbits(job) {
  document.querySelectorAll("[data-orbit]").forEach((el) => {
    if (el.dataset.flat === "1") return;
    const img = el.querySelector("img");
    if (!img) return;
    buildVolume(img.getAttribute("src"), el.dataset.id).then((model) => {
      if (job !== volumeJob || !el.isConnected || !model) return;
      volumeViewers.push(attachVolume(el, model));
      pumpVolumes();
    }).catch((error) => {
      console.error(error);
    });
  });
}

function mountVolumes() {
  releaseVolumes();
  volumeJob += 1;
  const job = volumeJob;
  if (mountVolumes.observer) mountVolumes.observer.disconnect();
  const nodes = [...document.querySelectorAll("[data-orbit]")];
  if (!nodes.length || typeof THREE === "undefined") return;
  const maxLive = 8;
  const active = [];
  const distance = (el) => {
    const rect = el.getBoundingClientRect();
    return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
  };

  const drop = (el) => {
    el._token = (el._token || 0) + 1;
    const viewer = el._viewer;
    if (viewer) {
      const index = volumeViewers.indexOf(viewer);
      if (index >= 0) volumeViewers.splice(index, 1);
      viewer.dispose();
      el._viewer = null;
    }
    delete el.dataset.solid;
    delete el.dataset.loading;
    const card = el.querySelector(".orbit-card");
    if (card) card.style.visibility = "";
    const index = active.indexOf(el);
    if (index >= 0) active.splice(index, 1);
  };

  const take = (el) => {
    if (job !== volumeJob || !el.isConnected || el._viewer || el.dataset.loading === "1") return;
    while (active.length >= maxLive) {
      let worst = active[0];
      active.forEach((item) => {
        if (distance(item) > distance(worst)) worst = item;
      });
      drop(worst);
    }
    const img = el.querySelector("img");
    if (!img) return;
    const token = (el._token || 0) + 1;
    el._token = token;
    el.dataset.loading = "1";
    active.push(el);
    buildVolume(img.getAttribute("src"), el.dataset.id).then((model) => {
      if (job !== volumeJob || el._token !== token || !el.isConnected || !model) {
        const index = active.indexOf(el);
        if (index >= 0 && !el._viewer) active.splice(index, 1);
        if (el._token === token) delete el.dataset.loading;
        return;
      }
      const viewer = attachVolume(el, model);
      el._viewer = viewer;
      delete el.dataset.loading;
      volumeViewers.push(viewer);
      pumpVolumes();
    }).catch((error) => {
      console.error(error);
      if (el._token === token) delete el.dataset.loading;
    });
  };

  mountVolumes.observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) take(entry.target);
      else drop(entry.target);
    });
  }, { rootMargin: "160px 0px" });
  nodes.forEach((el) => mountVolumes.observer.observe(el));
}

function pumpVolumes() {
  if (pumpVolumes.running) return;
  pumpVolumes.running = true;
  const frame = () => {
    for (let index = kidsViewers.length - 1; index >= 0; index -= 1) {
      const viewer = kidsViewers[index];
      if (!viewer.el.isConnected) {
        viewer.dispose();
        kidsViewers.splice(index, 1);
        continue;
      }
      try { viewer.draw(); } catch (error) { console.error(error); }
    }
    volumeViewers.forEach((viewer) => {
      try { viewer.draw(); } catch (error) { console.error(error); }
    });
    if (volumeViewers.length || kidsViewers.length) requestAnimationFrame(frame);
    else pumpVolumes.running = false;
  };
  requestAnimationFrame(frame);
}

function studioLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.42));
  scene.add(new THREE.HemisphereLight(0xfff6ee, 0x16161c, 0.7));
  const key = new THREE.DirectionalLight(0xfff8f2, 3.35);
  key.position.set(3.1, 5.4, 6.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd7e6ff, 1.28);
  fill.position.set(-5.4, 2.1, 3.4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff3e4, 2.15);
  rim.position.set(-2.6, 4.4, -5.6);
  scene.add(rim);
  const bounce = new THREE.DirectionalLight(0xffffff, 0.48);
  bounce.position.set(0.4, -3.6, 2.2);
  scene.add(bounce);
  const spark = new THREE.PointLight(0xfff7ee, 1.55, 14);
  spark.position.set(1.6, 3.1, 4.2);
  scene.add(spark);
}

function centeredClone(object) {
  const root = object.clone();
  const bounds = new THREE.Box3().setFromObject(root);
  const center = bounds.getCenter(new THREE.Vector3());
  root.children.forEach((child) => child.position.sub(center));
  return root;
}

function packSrc(item) {
  return String((item && item.image) || "").replace(/\.jpe?g(\?.*)?$/i, ".png$1");
}

const STILL_W = 1080;
const STILL_H = 1440;
const stillCache = new Map();
let stillRenderer = null;

function getStillRenderer() {
  if (stillRenderer) return stillRenderer;
  stillRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  stillRenderer.setClearColor(0x000000, 0);
  stillRenderer.outputColorSpace = THREE.SRGBColorSpace;
  stillRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  stillRenderer.toneMappingExposure = 1.28;
  stillRenderer.setPixelRatio(1);
  stillRenderer.setSize(STILL_W, STILL_H, false);
  return stillRenderer;
}

function stillDataUrl(canvas) {
  try {
    const webp = canvas.toDataURL("image/webp", 0.92);
    if (webp.indexOf("data:image/webp") === 0) return webp;
  } catch (error) { /* el navegador no exporta webp */ }
  return canvas.toDataURL("image/png");
}

async function renderPackStill(src) {
  if (stillCache.has(src)) return stillCache.get(src);
  const model = await buildVolume(src);
  const renderer = getStillRenderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, STILL_W / STILL_H, 0.1, 80);
  studioLights(scene);
  const pack = packFromSrc(src);
  const root = centeredClone(model.object);
  if (pack.kind === "tin") {
    root.rotation.x = 0.48;
    root.rotation.y = 0.28;
    root.rotation.z = 0.04;
  } else if (pack.kind === "tube") {
    root.rotation.x = 0.06;
    root.rotation.y = 0.38;
    root.rotation.z = 0.08;
  } else {
    root.rotation.x = 0.05;
    root.rotation.y = -0.38;
    root.rotation.z = 0;
  }
  scene.add(root);
  const sphere = new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());
  const zoom = pack.kind === "tin" ? 0.98 : pack.kind === "tube" ? 1.02 : 1.04;
  camera.position.set(0, sphere.radius * 0.08, sphere.radius / Math.tan(THREE.MathUtils.degToRad(14)) * zoom);
  camera.lookAt(0, -sphere.radius * 0.04, 0);
  renderer.render(scene, camera);
  const url = stillDataUrl(renderer.domElement);
  stillCache.set(src, url);
  return url;
}

function fillPackStills(job) {
  const images = [...document.querySelectorAll("img[data-pack-still]")];
  if (!images.length) return;
  images.reduce((chain, img) => chain.then(async () => {
    if (job !== volumeJob) return;
    try {
      const url = await renderPackStill(img.getAttribute("data-pack-still"));
      if (job !== volumeJob || !img.isConnected) return;
      img.src = url;
    } catch (error) {
      console.error(error);
    }
  }), Promise.resolve());
}

function loadLocalVolumeTextures() {
  if (!localVolumeTextures) {
    localVolumeTextures = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = volumeScriptUrl
        ? new URL("volume-textures.local.js?v=4", volumeScriptUrl).href
        : "js/volume-textures.local.js?v=4";
      script.onload = () => {
        script.remove();
        if (window.VOLUME_LOCAL_TEXTURES) resolve(window.VOLUME_LOCAL_TEXTURES);
        else reject(new Error("El archivo local de texturas 3D está vacío."));
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("No se pudo cargar el archivo local de texturas 3D."));
      };
      document.head.appendChild(script);
    }).catch((error) => {
      localVolumeTextures = undefined;
      throw error;
    });
  }
  return localVolumeTextures;
}

async function loadBitmap(src) {
  if (location.protocol === "file:" && !src.startsWith("data:")) {
    const path = src.split(/[?#]/, 1)[0].replace(/^\.?\//, "");
    const textures = await loadLocalVolumeTextures();
    if (!Object.hasOwn(textures, path)) throw new Error("Textura 3D local ausente: " + path);
    src = textures[path];
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function volumeFile(src) {
  return String(src).split("/").pop().replace(/\.(png|jpe?g|webp).*$/i, "");
}

function packFromSrc(src) {
  const file = volumeFile(src);
  const id = PACKS[file] ? file : "cera-fibra";
  return { id, ...PACKS[id] };
}

function buildVolume(src, id) {
  const file = id && (PACKS[id] || FORM[id]) ? id : volumeFile(src);
  if (!volumeModels.has(file)) {
    const pending = createVolume(file).catch((error) => {
      volumeModels.delete(file);
      throw error;
    });
    volumeModels.set(file, pending);
  }
  return volumeModels.get(file);
}

async function createVolume(file) {
  try {
    if (document.fonts && document.fonts.load) await document.fonts.load("700 64px Outfit");
  } catch (error) { /* se usa la fuente de respaldo */ }
  if (!volumeLogo) {
    try { volumeLogo = await loadBitmap("assets/isotipo-white.png"); } catch (error) { volumeLogo = null; }
  }
  if (!volumeWord) {
    try { volumeWord = await loadBitmap("assets/logotipo-white.png"); } catch (error) { volumeWord = null; }
  }
  if (file.indexOf("kit-") === 0 || KIT_PARTS[file]) return null;
  if (FORM[file]) {
    const fit = FORM[file].box ? 0.88 : 1.03;
    return { object: await makeForm(file), kids: false, tilt: 0.12, fit, hold: true };
  }
  if (!PACKS[file]) return null;
  const pack = { id: file, ...PACKS[file] };
  const art = { logo: volumeLogo, word: volumeWord };
  const stageArt = MOLDING_STAGE_ART[pack.id];
  if (stageArt) {
    return { object: await makeMoldingStage(pack, stageArt), kids: false, tilt: 0.58, fit: 0.94, sway: true, frameParts: true };
  }
  const official = LID_ART[pack.id];
  if (official) {
    try {
      art.lid = await loadBitmap(official[0]);
      art.strip = await loadBitmap(official[1]);
    } catch (error) { /* se dibuja el frente si falta el arte oficial */ }
  }
  const object = pack.kind === "tin"
    ? makeTin(pack, art)
    : pack.kind === "tube"
      ? makeTube(pack, art)
      : makeBottle(pack, art, pack.kind);
  return { object, kids: false, tilt: pack.kind === "tin" ? 1.02 : pack.kind === "pump" ? 0.04 : pack.kind === "tube" ? 0.28 : 0.08 };
}

function imageTexture(img, repeat) {
  const texture = new THREE.Texture(img);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function canvasTexture(canvas, offsetX) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.wrapS = THREE.RepeatWrapping;
  texture.offset.x = offsetX || 0;
  return texture;
}

function tinted(image, color, w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!image) return canvas;
  ctx.drawImage(image, 0, 0, w, h);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  return canvas;
}

function stripedMark(logo, color, w, h) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, Math.round(w / 42));
  const gap = Math.max(6, Math.round(w / 22));
  ctx.lineCap = "square";
  for (let i = -h; i < w + h; i += gap) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i - h * 0.7, h);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "destination-in";
  if (logo) ctx.drawImage(logo, 0, 0, w, h);
  return canvas;
}

function lidRays(ctx, color) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 490, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.42;
  ctx.lineWidth = 2;
  for (let i = -360; i < 1600; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 20);
    ctx.lineTo(i - 560, 1000);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSlice(ctx, img, sx, sy, sw, sh, dw, dh) {
  const scale = Math.max(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(img, sx, sy, sw, sh, (dw - w) / 2, (dh - h) / 2, w, h);
}

function drawContain(ctx, img, sx, sy, sw, sh, dw, dh) {
  const scale = Math.min(dw / sw, dh / sh);
  const w = sw * scale;
  const h = sh * scale;
  ctx.drawImage(img, sx, sy, sw, sh, (dw - w) / 2, (dh - h) / 2, w, h);
}

function artTexture(img, w, h, fit) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(0, 0, w, h);
  if (fit === "cover") drawSlice(ctx, img, 0, 0, img.width, img.height, w, h);
  else drawContain(ctx, img, 0, 0, img.width, img.height, w, h);
  const texture = canvasTexture(canvas, 0);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function photoTexture(img, w, h, mode) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);
  if (mode === "lid") drawContain(ctx, img, 0, 0, img.width, img.height * 0.62, w, h);
  else if (mode === "side") drawContain(ctx, img, 0, img.height * 0.52, img.width, img.height * 0.4, w, h);
  else drawContain(ctx, img, 0, 0, img.width, img.height, w, h);
  const texture = canvasTexture(canvas, 0);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function markIsLight(hex) {
  const n = parseInt(String(hex || "#000").replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

function drawWord(ctx, x, y, w, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(w * 0.15)}px Outfit, sans-serif`;
  ctx.letterSpacing = `${Math.max(1, Math.round(w * 0.012))}px`;
  ctx.fillText("VINICIUS", x + w / 2, y);
  ctx.font = `500 ${Math.round(w * 0.05)}px Outfit, sans-serif`;
  ctx.letterSpacing = `${Math.max(2, Math.round(w * 0.045))}px`;
  ctx.fillText("MOLDING", x + w / 2, y + w * 0.1);
  ctx.restore();
}

function drawV(ctx, x, y, w, color) {
  const h = w * 0.86;
  const t = w * 0.2;
  ctx.fillStyle = color;
    ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + t, y);
  ctx.lineTo(x + w * 0.5, y + h);
  ctx.lineTo(x + w * 0.5 - t * 0.32, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
  ctx.moveTo(x + w, y);
  ctx.lineTo(x + w - t, y);
  ctx.lineTo(x + w * 0.5, y + h);
  ctx.lineTo(x + w * 0.5 + t * 0.32, y + h);
    ctx.closePath();
    ctx.fill();
  }

function lidLabel(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.beginPath();
  ctx.arc(512, 512, 512, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 470, 0, Math.PI * 2);
  ctx.clip();
  if (pack.id === "pasta-minoxidil") paintPastaLid(ctx);
  else if (pack.id === "gel-cubre-canas") paintGelLid(ctx);
  else if (pack.kids) paintKidsLid(ctx);
  else paintStandardLid(ctx, pack);
  ctx.restore();
  const texture = canvasTexture(canvas, 0);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function paintStandardLid(ctx, pack) {
  const mark = pack.kids ? "#ffffff" : pack.accent;
  ctx.save();
  ctx.beginPath();
  ctx.rect(40, 180, 560, 620);
  ctx.clip();
  lidRays(ctx, mark);
  ctx.restore();
  drawWord(ctx, 190, 128, 644, pack.ink);
  drawV(ctx, 186, 248, 652, mark);
  ctx.textBaseline = "middle";
  const title = pack.title || "";
  const lines = pack.lidLines || [];
  if (pack.kids) {
    const letters = [["K", "#FFD300"], ["I", "#B6E000"], ["D", "#3DB7FF"], ["S", "#7CFF6B"]];
    ctx.font = "800 78px Outfit, sans-serif";
    ctx.textAlign = "center";
    letters.forEach(([ch, color], index) => {
      ctx.fillStyle = color;
      ctx.fillText(ch, 360 + index * 100, 820);
    });
  } else {
    const titleSize = title.length > 10 ? 52 : 86;
    ctx.fillStyle = pack.ink;
    ctx.font = `800 ${titleSize}px Outfit, sans-serif`;
    ctx.textAlign = "left";
    const titleX = 128;
    const titleY = 812;
    ctx.fillText(title, titleX, titleY);
    const titleWidth = ctx.measureText(title).width;
    ctx.fillStyle = mark;
    ctx.font = "700 24px Outfit, sans-serif";
    const lineX = titleX + titleWidth + 22;
    const beside = lines.length && lineX + 210 < 900;
    lines.forEach((line, index) => {
      ctx.fillText(line, beside ? lineX : titleX, beside ? titleY - 14 + index * 30 : titleY + 52 + index * 30);
    });
  }
  ctx.fillStyle = pack.ink;
  ctx.globalAlpha = 0.9;
  ctx.font = "600 24px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("|  " + (pack.size || ""), 512, 910);
}

function paintPastaLid(ctx) {
  drawWord(ctx, 190, 118, 644, "#f4fffe");
  ctx.save();
  ctx.beginPath();
  ctx.rect(40, 190, 520, 520);
  ctx.clip();
  lidRays(ctx, "#083734");
  ctx.restore();
  drawV(ctx, 168, 220, 688, "#141414");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#141414";
  ctx.font = "800 96px Outfit, sans-serif";
  ctx.fillText("PASTA", 512, 748);
  ctx.font = "700 34px Outfit, sans-serif";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#141414";
  ctx.strokeText("MINOXIDIL", 512, 812);
  ctx.font = "600 26px Outfit, sans-serif";
  ctx.fillText("|  150 g", 512, 900);
}

function paintGelLid(ctx) {
  ctx.strokeStyle = "#c4a15a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(512, 512, 448, 0, Math.PI * 2);
  ctx.stroke();
  drawWord(ctx, 200, 124, 624, "#d8d8d8");
  ctx.save();
  ctx.beginPath();
  ctx.rect(50, 190, 540, 500);
  ctx.clip();
  lidRays(ctx, "#9a9a9a");
  ctx.restore();
  drawV(ctx, 186, 236, 652, "#5c5c5c");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#e6e6e6";
  ctx.font = "800 72px Outfit, sans-serif";
  ctx.strokeText("GEL", 390, 770);
  ctx.font = "700 26px Outfit, sans-serif";
  ctx.strokeText("CUBRE CANAS", 680, 778);
  ctx.strokeStyle = "#b5b5b5";
  ctx.font = "600 22px Outfit, sans-serif";
  ctx.strokeText("150 g", 512, 860);
}

function paintKidsLid(ctx) {
  drawWord(ctx, 250, 118, 520, "#ffffff");
  ctx.fillStyle = "#2f6bff";
  ctx.beginPath();
  ctx.moveTo(80, 250);
  ctx.lineTo(250, 390);
  ctx.lineTo(80, 540);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(944, 270);
  ctx.lineTo(774, 420);
  ctx.lineTo(944, 580);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f7f7f7";
  ctx.beginPath();
  ctx.moveTo(340, 300);
  ctx.lineTo(512, 246);
  ctx.lineTo(684, 300);
  ctx.lineTo(720, 430);
  ctx.lineTo(512, 560);
  ctx.lineTo(304, 430);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e10600";
  ctx.beginPath();
  ctx.moveTo(512, 330);
  ctx.lineTo(575, 455);
  ctx.lineTo(449, 455);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 40px Outfit, sans-serif";
  ctx.fillText("CERA & FIBRA", 512, 680);
  [["K", "#FFD300"], ["I", "#FF8A00"], ["D", "#3DB7FF"], ["S", "#3DDC97"]].forEach(([ch, color], index) => {
    ctx.fillStyle = color;
    ctx.font = "800 96px Outfit, sans-serif";
    ctx.fillText(ch, 330 + index * 120, 800);
  });
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 26px Outfit, sans-serif";
  ctx.fillText("150 g", 512, 910);
}

function drawSideBlock(ctx, cx, pack) {
  if (pack.id === "gel-cubre-canas") {
    paintGelSide(ctx, cx);
    return;
  }
  const color = pack.kids ? "#ffffff" : pack.accent;
  const badgeFill = pack.kids ? "#FFD300" : color;
  const badgeInk = pack.kids ? "#141414" : pack.id === "pasta-minoxidil" ? "#2EE6D0" : markIsLight(color) ? "#141414" : "#f6f3ec";
  drawV(ctx, cx - 490, 42, 160, color);
  ctx.fillStyle = color;
  ctx.fillRect(cx - 270, 48, 4, 184);
  ctx.fillStyle = pack.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 28px Outfit, sans-serif";
  (pack.sideLines || ["KERATINA", "ROMERO", "ALOE VERA"]).forEach((line, index) => {
    ctx.fillText(line, cx - 246, 86 + index * 40);
  });
  const bx = cx + 70;
  ctx.fillStyle = badgeFill;
  ctx.fillRect(bx, 46, 176, 176);
  ctx.save();
  ctx.translate(bx + 88, 78);
  ctx.strokeStyle = badgeInk;
  ctx.fillStyle = badgeInk;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, 2, 9, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-8, -4, 7, 3, -0.7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(8, -4, 7, 3, 0.7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = badgeInk;
  ctx.textAlign = "center";
  ctx.font = "800 16px Outfit, sans-serif";
  ctx.fillText("A BASE", bx + 88, 112);
  ctx.fillText("DE CERA", bx + 88, 134);
  ctx.fillText("DE ABEJA", bx + 88, 156);
  ctx.textAlign = "left";
  ctx.fillStyle = pack.ink;
  ctx.font = "600 16px Outfit, sans-serif";
  ctx.fillText("Rigidez", bx + 186, 86);
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = i < pack.hold ? color : "rgba(255,255,255,0.35)";
    ctx.arc(bx + 198 + i * 24, 118, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = pack.ink;
  ctx.globalAlpha = 0.85;
  ctx.font = "500 15px Outfit, sans-serif";
  ctx.fillText("Usar en pelo", bx + 186, 156);
  ctx.fillText("seco/semi seco", bx + 186, 178);
  ctx.globalAlpha = 1;
}

function paintGelSide(ctx, cx) {
  drawV(ctx, cx - 470, 48, 150, "#8a8a8a");
  ctx.fillStyle = "#9a9a9a";
  ctx.fillRect(cx - 270, 52, 3, 168);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "#ececec";
  ctx.lineWidth = 2.4;
  ctx.font = "800 52px Outfit, sans-serif";
  ctx.strokeText("GEL", cx - 246, 136);
  ctx.font = "700 22px Outfit, sans-serif";
  ctx.strokeText("CUBRE", cx + 30, 112);
  ctx.strokeText("CANAS", cx + 30, 146);
  ctx.fillStyle = "#101012";
  ctx.strokeStyle = "#b9b9b9";
  ctx.lineWidth = 2;
  ctx.fillRect(cx + 200, 48, 168, 176);
  ctx.strokeRect(cx + 200, 48, 168, 176);
  ctx.fillStyle = "#e8e8e8";
  ctx.textAlign = "center";
  ctx.font = "700 16px Outfit, sans-serif";
  ["ACABADO", "HÚMEDO", "BRILLANTE"].forEach((line, index) => ctx.fillText(line, cx + 284, 96 + index * 28));
}

function sideLabel(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 280;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 2048, 280);
  [0, 1024, 2048].forEach((cx) => drawSideBlock(ctx, cx, pack));
  const texture = canvasTexture(canvas, 0.5);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function arcProfile(cr, cz, radius, a0, a1, steps) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const q = a0 + (a1 - a0) * (i / steps);
    points.push(new THREE.Vector2(cr + radius * Math.cos(q), cz + radius * Math.sin(q)));
  }
  return points;
}

function latheMesh(points, material) {
  const geo = new THREE.LatheGeometry(points, 128);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const span = Math.max(0.0001, maxY - minY);
  for (let i = 0; i < pos.count; i += 1) uv.setY(i, (pos.getY(i) - minY) / span);
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function makeTin(pack, art, openable) {
  const R = 1;
  const Hb = 0.606;
  const Hl = 0.273;
  const fr = 0.0485;
  const st = 0.024;
  const lw = 0.121;
  const rec = 0.024;
  const H2 = Math.PI / 2;
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: "#0b0b0d", roughness: 0.34, metalness: 0.84 });
  const official = art.lid && art.strip;
  const side = art.stripTex || (official ? imageTexture(art.strip, true) : sideLabel(pack, art));
  if (!official || pack.id === "pasta-minoxidil" || pack.id === "gel-cubre-canas" || pack.id === "cera-kids") {
    side.wrapS = THREE.RepeatWrapping;
    side.offset.x = 0.5;
    side.needsUpdate = true;
  }
  const body = latheMesh([
    ...arcProfile(R - fr, fr, fr, -H2, 0, 8),
    new THREE.Vector2(R, Hb),
  ], new THREE.MeshStandardMaterial({
    map: side,
    roughness: 0.48,
    metalness: 0.06,
  }));
  group.add(body);
  const lid = latheMesh([
    new THREE.Vector2(R, Hb),
    new THREE.Vector2(R + st, Hb),
    ...arcProfile(R + st - fr, Hb + Hl - fr, fr, 0, H2, 8),
    new THREE.Vector2(R - lw, Hb + Hl),
    new THREE.Vector2(R - lw, Hb + Hl - rec),
  ], metal);
  const face = new THREE.Mesh(new THREE.CircleGeometry(R - lw - 0.004, 72), new THREE.MeshStandardMaterial({
    map: art.lidTex || (official ? imageTexture(art.lid, false) : lidLabel(pack, art)),
    roughness: 0.42,
    metalness: 0.04,
    side: THREE.DoubleSide,
  }));
  face.rotation.x = -Math.PI / 2;
  face.position.y = Hb + Hl - rec + 0.002;
  if (openable) {
    group.add(waxMesh(R, Hb, pack));
    const pivot = new THREE.Group();
    pivot.name = "kids-lid";
    pivot.position.set(0, Hb, -(R * 0.72));
    lid.position.y -= pivot.position.y;
    face.position.y -= pivot.position.y;
    lid.position.z -= pivot.position.z;
    face.position.z -= pivot.position.z;
    pivot.add(lid);
    pivot.add(face);
    group.add(pivot);
  } else {
    group.add(lid);
  group.add(face);
  }
  const base = new THREE.Mesh(new THREE.CircleGeometry(R - fr * 0.4, 48), metal);
  base.rotation.x = Math.PI / 2;
  base.position.y = 0.002;
  group.add(base);
  return group;
}

function waxTexture(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const wash = ctx.createRadialGradient(230, 210, 20, 256, 256, 280);
  const tone = (pack && pack.wax) || ["#efe4f8", "#c9b0de", "#8d68b8"];
  wash.addColorStop(0, tone[0]);
  wash.addColorStop(0.45, tone[1]);
  wash.addColorStop(1, tone[2]);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 512, 512);
  ctx.lineCap = "round";
  for (let i = 0; i < 7; i += 1) {
    ctx.strokeStyle = i % 2 ? "rgba(92,58,130,.55)" : "rgba(255,246,255,.7)";
    ctx.lineWidth = i % 2 ? 16 : 8;
    ctx.beginPath();
    for (let t = 0; t < 18; t += 0.15) {
      const radius = 18 + t * 14 + i * 6;
      const angle = t * 0.85 + i;
      const x = 250 + Math.cos(angle) * radius;
      const y = 246 + Math.sin(angle) * radius * 0.92;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  return canvasTexture(canvas, 0);
}

function waxMesh(R, Hb, pack) {
  const points = [];
  const steps = 14;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const radius = Math.max(0.012, (R - 0.18) * Math.cos(t * Math.PI * 0.5));
    const y = Hb - 0.05 + Math.sin(t * Math.PI) * 0.11 * (1 - t * 0.35);
    points.push(new THREE.Vector2(radius, y));
  }
  return latheMesh(points, new THREE.MeshStandardMaterial({
    map: waxTexture(pack),
    roughness: 0.38,
    metalness: 0.02,
  }));
}

function kidsBoxTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e4233c";
  ctx.fillRect(0, 0, 1024, 640);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 48px Outfit, sans-serif";
  ctx.fillText("VINICIUS", 512, 250);
  ctx.font = "500 18px Outfit, sans-serif";
  ctx.fillText("MOLDING", 512, 292);
  ctx.font = "800 36px Outfit, sans-serif";
  ctx.fillText("CERA & FIBRA", 512, 360);
  [["K", "#FFD300"], ["I", "#3DB7FF"], ["D", "#3DDC97"], ["S", "#2EC8B0"]].forEach(([ch, color], index) => {
    ctx.fillStyle = color;
    ctx.font = "800 78px Outfit, sans-serif";
    ctx.fillText(ch, 400 + index * 75, 445);
  });
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 22px Outfit, sans-serif";
  ctx.fillText("KERATINA  /  ROMERO  /  ALOE VERA", 512, 520);
  ctx.font = "700 28px Outfit, sans-serif";
  ctx.fillText("1200 g", 512, 568);
  return canvasTexture(canvas, 0);
}

function kidsFace(corners, material) {
  const geo = new THREE.BufferGeometry();
  const order = [0, 1, 2, 0, 2, 3];
  const position = [];
  order.forEach((index) => position.push(corners[index].x, corners[index].y, corners[index].z));
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function kidsTriangle(a, b, c, material) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute([
    a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z,
  ], 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 1, 0, 0.5, 1], 2));
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function flankLines(ctx, x, y, dir, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineWidth = 7;
  for (let i = 0; i < 4; i += 1) {
    const yy = y - 54 + i * 34;
    ctx.beginPath();
    ctx.moveTo(x + dir * 18, yy + 16);
    ctx.lineTo(x + dir * 118, yy - 18);
    ctx.stroke();
  }
  ctx.restore();
}

function moldLidCanvas(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111114";
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4f4f4";
  ctx.font = "700 58px Outfit, sans-serif";
  ctx.fillText("VINICIUS", 512, 250);
  ctx.font = "500 22px Outfit, sans-serif";
  ctx.fillStyle = "#c8c8c8";
  ctx.fillText("MOLDING", 512, 292);
  flankLines(ctx, 512, 470, -1, pack.accent);
  flankLines(ctx, 512, 470, 1, pack.accent);
  drawV(ctx, 330, 360, 364, pack.accent);
  ctx.fillStyle = "#f7f7f7";
  ctx.font = "800 92px Outfit, sans-serif";
  ctx.fillText(pack.title, 512, 760);
  ctx.fillStyle = pack.accent;
  ctx.font = "700 28px Outfit, sans-serif";
  ctx.fillText(pack.lidLines.join("  ·  "), 512, 820);
  ctx.fillStyle = "#bdbdbd";
  ctx.font = "600 24px Outfit, sans-serif";
  ctx.fillText(pack.size, 512, 868);
  return canvas;
}

function moldStripCanvas(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#141416";
  ctx.fillRect(0, 0, 2048, 512);
  drawV(ctx, 70, 90, 280, pack.accent);
  ctx.fillStyle = "#f4f4f4";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 54px Outfit, sans-serif";
  ["KERATINA", "ROMERO", "ALOE VERA"].forEach((line, index) => {
    ctx.fillText(line, 430, 150 + index * 110);
  });
  return canvas;
}

function moldFaceCanvas(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#111114";
  ctx.fillRect(0, 0, 1024, 640);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f4f4f4";
  ctx.font = "700 42px Outfit, sans-serif";
  ctx.fillText("VINICIUS", 512, 250);
  ctx.fillStyle = "#bdbdbd";
  ctx.font = "500 16px Outfit, sans-serif";
  ctx.fillText("MOLDING", 512, 286);
  flankLines(ctx, 512, 400, -1, pack.accent);
  flankLines(ctx, 512, 400, 1, pack.accent);
  drawV(ctx, 390, 330, 244, pack.accent);
  ctx.fillStyle = "#9a9a9a";
  ctx.font = "500 16px Outfit, sans-serif";
  ctx.fillText("VINICIUSMOLDING.COM", 512, 575);
  return canvas;
}

function moldEdgeCanvas(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101012";
  ctx.fillRect(0, 0, 1400, 360);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "800 64px Outfit, sans-serif";
  ctx.fillText(pack.title, 70, 120);
  ctx.fillStyle = pack.accent;
  ctx.font = "700 28px Outfit, sans-serif";
  ctx.fillText(pack.lidLines.join("  ·  "), 70, 175);
  ctx.fillStyle = "#f2f2f2";
  ctx.font = "600 26px Outfit, sans-serif";
  ctx.fillText("KERATINA   ·   ROMERO   ·   ALOE VERA", 70, 250);
  ctx.fillStyle = pack.accent;
  ctx.font = "700 28px Outfit, sans-serif";
  ctx.fillText(pack.size, 70, 305);
  return canvas;
}

function spiderFaceCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e10600";
  ctx.fillRect(0, 0, 1024, 640);
  ctx.strokeStyle = "rgba(255,211,0,.85)";
  ctx.lineWidth = 8;
  for (let i = 0; i < 8; i += 1) {
    ctx.beginPath();
    ctx.ellipse(512, 430, 70 + i * 38, 48 + i * 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "#f5c400";
  ctx.beginPath();
  ctx.ellipse(512, 430, 250, 175, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.ellipse(512, 430, 40 + i * 36, 28 + i * 22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  [[390, 390], [620, 390]].forEach(([x, y]) => {
    ctx.fillStyle = "#f7f7f7";
    ctx.beginPath();
    ctx.moveTo(x, y - 70);
    ctx.lineTo(x + 78, y - 20);
    ctx.lineTo(x + 48, y + 70);
    ctx.lineTo(x - 48, y + 70);
    ctx.lineTo(x - 78, y - 20);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#111";
    ctx.stroke();
  });
  ctx.fillStyle = "#111";
  ctx.font = "700 22px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("VINICIUS", 512, 520);
  return canvas;
}

function spiderEdgeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e10600";
  ctx.fillRect(0, 0, 1400, 360);
  ctx.strokeStyle = "#f5c400";
  ctx.lineWidth = 6;
  for (let i = -2; i < 8; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 180, 0);
    ctx.bezierCurveTo(i * 180 + 80, 120, i * 180 + 40, 240, i * 180 + 160, 360);
    ctx.stroke();
  }
  ctx.fillStyle = "#f6f6f6";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "800 54px Outfit, sans-serif";
  ctx.fillText("CERA & FIBRA", 80, 120);
  ctx.fillStyle = "#f5c400";
  ctx.font = "800 72px Outfit, sans-serif";
  ctx.fillText("KIDS", 620, 118);
  ctx.fillStyle = "#fff";
  ctx.font = "600 26px Outfit, sans-serif";
  ctx.fillText("KERATINA  /  ROMERO  /  ALOE VERA", 80, 210);
  ctx.font = "700 28px Outfit, sans-serif";
  ctx.fillText("1200 g", 80, 270);
  return canvas;
}

function makePrismBox(frontCanvas, edgeCanvas, color) {
  const group = new THREE.Group();
  const s = 2.4;
  const h = s * Math.sqrt(3) / 2;
  const zf = 0.62;
  const zb = -0.62;
  const wall = new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.08, side: THREE.DoubleSide });
  const faceMat = new THREE.MeshStandardMaterial({ map: canvasTexture(frontCanvas, 0), roughness: 0.46, metalness: 0.05, side: THREE.DoubleSide });
  const edgeMat = new THREE.MeshStandardMaterial({ map: canvasTexture(edgeCanvas, 0), roughness: 0.5, metalness: 0.04, side: THREE.DoubleSide });
  const p = (x, y, z) => new THREE.Vector3(x, y, z);
  const left = -s / 2;
  const right = s / 2;
  group.add(kidsFace([p(left, 0, zb), p(right, 0, zb), p(right, 0, zf), p(left, 0, zf)], wall));
  group.add(kidsFace([p(left, 0, zb), p(left, 0, zf), p(0, h, zf), p(0, h, zb)], wall));
  group.add(kidsFace([p(right, 0, zf), p(right, 0, zb), p(0, h, zb), p(0, h, zf)], wall));
  group.add(kidsTriangle(p(right, 0, zb), p(0, h, zb), p(left, 0, zb), wall));
  const door = new THREE.Group();
  door.name = "kids-door";
  door.position.set(left, 0, zf);
  door.add(kidsTriangle(p(0, 0, 0), p(s, 0, 0), p(s / 2, h, 0), faceMat));
  group.add(door);
  group.name = "kids-box";
  return group;
}

function makeSpiderBox() {
  const box = makePrismBox(spiderFaceCanvas(), spiderEdgeCanvas(), "#e10600");
  box.rotation.y = 0.7;
  return box;
}

function photoMat(img, rough, metal) {
  return new THREE.MeshStandardMaterial({
    map: imageTexture(img, false),
    roughness: rough,
    metalness: metal,
    side: THREE.DoubleSide,
  });
}

function faceQuad(corners, uvs, material) {
  const geo = new THREE.BufferGeometry();
  const position = [];
  const uv = [];
  corners.forEach((corner) => position.push(corner.x, corner.y, corner.z));
  uvs.forEach((value) => uv.push(value));
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

function roundPrint(img) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101013";
  ctx.beginPath();
  ctx.arc(512, 512, 508, 0, Math.PI * 2);
  ctx.clip();
  const height = 1024 * (img.height / img.width);
  ctx.drawImage(img, 0, (1024 - height) * 0.28, 1024, height);
  return canvas;
}

function setCeraView(root, mode) {
  const box = root.getObjectByName("PackagingBox");
  const wax = root.getObjectByName("CreamContent");
  const lid = root.getObjectByName("ContainerLid");
  const pose = lid && (mode === "cerrado" ? lid.userData.shut : lid.userData.aside);
  if (lid && pose) {
    lid.position.set(pose[0], pose[1], pose[2]);
    lid.rotation.set(pose[3], pose[4], pose[5]);
  }
  if (wax) wax.visible = mode !== "cerrado";
  if (box) box.visible = mode === "completo";
}

function ceraLidPrint() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101114";
  ctx.beginPath();
  ctx.arc(512, 512, 490, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.strokeStyle = "#e10600";
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(150 + i * 16, 700);
    ctx.lineTo(300, 390 - i * 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(874 - i * 16, 700);
    ctx.lineTo(724, 390 - i * 10);
    ctx.stroke();
  }
  drawWord(ctx, 0, 200, 1024, "#f6f3ec");
  drawV(ctx, 292, 300, 440, "#e10600");
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f6f3ec";
  ctx.font = "700 86px Outfit, sans-serif";
  ctx.fillText("CERA", 150, 760);
  ctx.fillStyle = "#e10600";
  ctx.font = "700 26px Outfit, sans-serif";
  ctx.fillText("MOLDEADORA", 430, 724);
  ctx.fillStyle = "#f6f3ec";
  ctx.fillText("BRILLO MEDIO", 430, 760);
  ctx.fillStyle = "#e10600";
  ctx.font = "600 24px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("150 g", 512, 860);
  return canvas;
}

function ceraSidePrint() {
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101114";
  ctx.fillRect(0, 0, 1400, 420);
  ctx.strokeStyle = "#e10600";
  ctx.lineWidth = 7;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(70 + i * 20, 50);
    ctx.lineTo(110 + i * 20, 370);
    ctx.stroke();
  }
  drawV(ctx, 230, 50, 250, "#e10600");
  ctx.strokeStyle = "#e10600";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(560, 70);
  ctx.lineTo(560, 350);
  ctx.stroke();
  ctx.fillStyle = "#f4f1ea";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 58px Outfit, sans-serif";
  ctx.fillText("KERATINA", 600, 120);
  ctx.fillText("ROMERO", 600, 210);
  ctx.fillText("ALOE VERA", 600, 300);
  return canvas;
}

function drawBeeMark(ctx, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "#f4f1ea";
  ctx.lineWidth = Math.max(2.2, s * 0.055);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(-s * 0.02, -s * 0.2, s * 0.3, s * 0.16, -0.45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(s * 0.16, -s * 0.16, s * 0.22, s * 0.12, 0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, s * 0.08, s * 0.15, s * 0.3, 0.15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-s * 0.12, 0);
  ctx.lineTo(s * 0.14, -0.02 * s);
  ctx.moveTo(-s * 0.1, s * 0.16);
  ctx.lineTo(s * 0.12, s * 0.14);
  ctx.moveTo(-s * 0.05, -s * 0.16);
  ctx.quadraticCurveTo(-s * 0.22, -s * 0.46, -s * 0.32, -s * 0.38);
  ctx.moveTo(s * 0.06, -s * 0.14);
  ctx.quadraticCurveTo(s * 0.22, -s * 0.42, s * 0.32, -s * 0.34);
  ctx.stroke();
  ctx.restore();
}

function ceraBodyDesign(vMark, accent) {
  const canvas = document.createElement("canvas");
  canvas.width = 2100;
  canvas.height = 560;
  const ctx = canvas.getContext("2d");
  const red = accent || "#e10600";
  const ink = "#f3f1ec";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = red;
  ctx.lineWidth = 7;
  ctx.lineCap = "butt";
  for (let i = 0; i < 5; i += 1) {
    const x = 48 + i * 26;
    ctx.beginPath();
    ctx.moveTo(x, 78);
    ctx.lineTo(x + 86, 482);
    ctx.stroke();
  }
  const markH = 460;
  const markW = markH * (vMark.width / vMark.height);
  const markX = 210;
  const markArt = !accent || String(accent).toLowerCase() === "#e10600" ? vMark : tintedMark(vMark, red);
  ctx.drawImage(markArt, markX, (canvas.height - markH) / 2, markW, markH);
  const rule = markX + markW + 42;
  ctx.strokeStyle = red;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(rule, 96);
  ctx.lineTo(rule, 464);
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 86px Poppins, sans-serif";
  const textX = rule + 40;
  ctx.fillText("KERATINA", textX, 188);
  ctx.fillText("ROMERO", textX, 282);
  ctx.fillText("ALOE VERA", textX, 376);
  const badgeX = textX + ctx.measureText("ALOE VERA").width + 56;
  const badgeH = 300;
  const badgeY = (canvas.height - badgeH) / 2;
  const redW = 168;
  const panelW = 250;
  ctx.fillStyle = red;
  ctx.fillRect(badgeX, badgeY, redW, badgeH);
  ctx.fillStyle = "#121214";
  ctx.fillRect(badgeX + redW, badgeY, panelW, badgeH);
  ctx.strokeStyle = red;
  ctx.lineWidth = 4;
  ctx.strokeRect(badgeX + redW + 3, badgeY + 3, panelW - 6, badgeH - 6);
  drawBeeMark(ctx, badgeX + redW / 2, badgeY + badgeH / 2, badgeH * 0.34);
  ctx.fillStyle = ink;
  ctx.font = "700 34px Poppins, sans-serif";
  ["A BASE", "DE CERA", "DE ABEJA"].forEach((line, index) => {
    ctx.fillText(line, badgeX + redW + 18, badgeY + 78 + index * 78);
  });
  return canvas;
}

function makeOpenableJar(lidImg, sideImg, creamImg, spec) {
  const kids = !!spec?.kids;
  const fit = { outer: 0.74, inner: 0.61, bodyH: 0.46, neckH: 0.1, lipH: 0.028, lidH: 0.048, creamTop: kids ? 0.485 : 0.455 };
  const plastic = new THREE.MeshStandardMaterial({ color: "#0c0c0e", roughness: 0.32, metalness: 0.62 });
  const jarPlastic = plastic.clone();
  jarPlastic.roughness = 0.22;
  jarPlastic.metalness = 0.74;
  if (kids) {
    plastic.metalness = 0.1;
    jarPlastic.metalness = 0.1;
  }
  const R = fit.outer;
  const shellPts = [];
  const add = (r, y) => shellPts.push(new THREE.Vector2(r, y));
  add(0.03, 0.01);
  add(R * 0.76, 0.01);
  add(R * 0.94, 0.028);
  add(R, 0.05);
  add(R, fit.bodyH);
  add(R * 0.97, fit.bodyH + 0.01);
  let groove = fit.bodyH + 0.016;
  for (let i = 0; i < 4; i += 1) {
    add(R * 0.972, groove);
    add(R * 1.0, groove + 0.004);
    add(R * 1.0, groove + 0.008);
    add(R * 0.972, groove + 0.013);
    groove += 0.016;
  }
  add(R * 0.99, groove + 0.004);
  add(R * 1.018, groove + 0.01);
  const total = groove + 0.02;
  add(R * 1.006, total);
  add(fit.inner + 0.02, total);
  add(fit.inner, total - 0.014);
  add(fit.inner, fit.creamTop + 0.04);
  const body = new THREE.Group();
  body.name = "ContainerBody";
  body.add(new THREE.Mesh(new THREE.LatheGeometry(shellPts, 128), jarPlastic));
  if (spec?.bodyLabel || sideImg) {
    const labelArt = spec?.bodyLabel || ceraBodyDesign(sideImg, spec?.accent);
    const labelMap = imageTexture(labelArt, false);
    const labelH = (fit.bodyH - 0.05) * 0.86;
    const labelArc = spec?.bodyLabel ? Math.PI * 2 : (labelH / R) * (labelArt.width / labelArt.height);
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(R * 1.003, R * 1.003, labelH, 120, 1, true, -labelArc / 2, labelArc),
      new THREE.MeshStandardMaterial({
        map: labelMap,
        transparent: !spec?.bodyLabel,
        alphaTest: spec?.bodyLabel ? 0 : 0.2,
        roughness: kids ? 0.44 : 0.22,
        metalness: kids ? 0.06 : 0.55,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      })
    );
    label.name = "ContainerLabels";
    label.position.y = 0.045 + labelH / 2;
    body.add(label);
  }
  const creamColor = (spec && spec.wax && spec.wax[0]) || "#f3e6c4";
  const creamMat = new THREE.MeshStandardMaterial({ color: creamColor, roughness: 0.62, metalness: 0.02 });
  const creamPts = [
    new THREE.Vector2(0.02, 0.04),
    new THREE.Vector2(fit.inner * 0.97, 0.04),
    new THREE.Vector2(fit.inner * 0.97, fit.creamTop + 0.03),
    new THREE.Vector2(0.02, fit.creamTop + 0.03),
  ];
  const cream = new THREE.Group();
  cream.name = "CreamContent";
  cream.add(new THREE.Mesh(new THREE.LatheGeometry(creamPts, 80), creamMat));
  const surface = creamImg ? imageTexture(creamImg, false) : null;
  const creamFace = new THREE.Mesh(
    new THREE.CircleGeometry(fit.inner * 0.955, 80),
    new THREE.MeshStandardMaterial({
      map: surface,
      bumpMap: surface,
      bumpScale: spec?.creamRelief ?? 0.013,
      color: surface ? (spec?.creamTint || (kids ? "#ffffff" : "#e3e3e3")) : creamColor,
      roughness: spec?.creamRoughness ?? 0.59,
      metalness: 0.02,
    })
  );
  creamFace.rotation.x = -Math.PI / 2;
  creamFace.position.y = fit.creamTop + 0.042;
  cream.add(creamFace);
  body.add(cream);
  const lidPts = [
    new THREE.Vector2(fit.outer * 0.72, 0.002),
    new THREE.Vector2(fit.outer * 1.004, 0.002),
    new THREE.Vector2(fit.outer * 1.014, 0.01),
    new THREE.Vector2(fit.outer * 1.014, fit.lidH - 0.006),
    new THREE.Vector2(fit.outer * 1.002, fit.lidH),
    new THREE.Vector2(0.02, fit.lidH),
  ];
  const lid = new THREE.Group();
  lid.name = "ContainerLid";
  lid.add(new THREE.Mesh(new THREE.LatheGeometry(lidPts, 96), plastic));
  const lidArt = lidImg || (spec ? moldLidDesign(spec, sideImg) : null);
  const print = new THREE.Mesh(new THREE.CircleGeometry(fit.outer * 0.994, 96), new THREE.MeshStandardMaterial({ map: imageTexture(lidArt, false), roughness: 0.46, metalness: 0.04 }));
  print.rotation.x = -Math.PI / 2;
  print.position.y = fit.lidH + 0.001;
  lid.add(print);
  lid.userData.shut = [0, total - 0.006, 0, 0, 0, 0];
  lid.userData.aside = [fit.outer * 2.5, 0, 0.12, 0, 0.35, 0];
  const jar = new THREE.Group();
  jar.name = "cera-tin";
  jar.add(body, lid);
  return jar;
}

function tintedMark(img, color) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas;
}

function trackText(ctx, text, x, y, tracking) {
  const chars = String(text).split("");
  let width = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) + tracking * Math.max(0, chars.length - 1);
  let cursor = x - width / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((ch) => {
    ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + tracking;
  });
  ctx.textAlign = prev;
}

function moldLidDesign(pack, vMark) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const accent = pack.accent || "#e10600";
  const ink = "#f4f1ea";
  ctx.fillStyle = "#101114";
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 488, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = accent;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "butt";
  for (let i = 0; i < 5; i += 1) {
    const shift = i * 13;
    ctx.beginPath();
    ctx.moveTo(156 + shift, 655);
    ctx.lineTo(292 + shift * 0.15, 330);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(868 - shift, 655);
    ctx.lineTo(732 - shift * 0.15, 330);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 78px Poppins, sans-serif";
  ctx.fillText("VINICIUS", 512, 148);
  ctx.font = "500 16px Poppins, sans-serif";
  trackText(ctx, "MOLDING", 512, 196, 12);
  const mark = tintedMark(vMark, accent);
  const mw = 560;
  const mh = mw * (vMark.height / vMark.width);
  const markY = 228;
  ctx.drawImage(mark, (1024 - mw) / 2, markY, mw, mh);
  const title = pack.title || "";
  const lines = pack.lidLines || [];
  const wide = title.length > 10;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  if (wide) {
    ctx.fillStyle = ink;
    ctx.font = "700 46px Poppins, sans-serif";
    ctx.fillText(title, 118, 790);
    ctx.fillStyle = accent;
    ctx.font = "700 24px Poppins, sans-serif";
    lines.forEach((line, index) => ctx.fillText(line, 118, 836 + index * 28));
  } else {
    ctx.fillStyle = ink;
    ctx.font = "700 84px Poppins, sans-serif";
    ctx.fillText(title, 112, 812);
    const titleW = ctx.measureText(title).width;
    ctx.fillStyle = accent;
    ctx.font = "700 22px Poppins, sans-serif";
    lines.forEach((line, index) => ctx.fillText(line, 128 + titleW, 786 + index * 28));
  }
  ctx.textAlign = "center";
  ctx.fillStyle = accent;
  ctx.font = "600 18px Poppins, sans-serif";
  ctx.fillText(pack.size || "", 512, 928);
  return canvas;
}

function moldBoxFront(pack, vMark) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 780;
  const ctx = canvas.getContext("2d");
  const accent = pack.accent || "#e10600";
  ctx.fillStyle = "#101114";
  ctx.fillRect(0, 0, 900, 780);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(900, 0);
  ctx.lineTo(450, 780);
  ctx.closePath();
  ctx.fillStyle = "#101114";
  ctx.fill();
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(80 + i * 22, 250);
    ctx.lineTo(250 + i * 10, 620);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(820 - i * 22, 250);
    ctx.lineTo(650 - i * 10, 620);
    ctx.stroke();
  }
  const mark = tintedMark(vMark, accent);
  const mw = 280;
  const mh = mw * (vMark.height / vMark.width);
  ctx.drawImage(mark, (900 - mw) / 2, 250, mw, mh);
  ctx.fillStyle = "#f6f3ec";
  ctx.font = "700 48px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(pack.title || "", 450, 210);
  ctx.fillStyle = accent;
  ctx.font = "700 22px Poppins, sans-serif";
  ctx.fillText((pack.lidLines || []).join("  "), 450, 250 + mh + 28);
  ctx.restore();
  return canvas;
}

function standingPhoto(img, width, height, depth, cutout) {
  const group = new THREE.Group();
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshStandardMaterial({
      map: imageTexture(img, false),
      transparent: !!cutout,
      alphaTest: cutout ? 0.12 : 0,
      roughness: 0.4,
      metalness: 0.04,
      side: THREE.FrontSide,
    })
  );
  face.position.z = depth / 2 + 0.004;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width * (cutout ? 0.62 : 0.98), height * (cutout ? 0.9 : 0.98), depth),
    new THREE.MeshStandardMaterial({ color: "#141418", roughness: 0.7, metalness: 0.06 })
  );
  group.add(body, face);
  return group;
}

function makePackBox(pack, art) {
  const face = art.box || frontLabel(pack, art);
  const height = pack.top === "pump" ? 2.56 : 2.32;
  const width = height * face.width / face.height;
  const depth = width * (pack.boxDepth ?? 0.8);
  const print = photoMat(face, 0.62, 0.02);
  const board = new THREE.MeshStandardMaterial({ color: pack.box || pack.body || "#f4f1ea", roughness: 0.74, metalness: 0.03 });
  const side = art.boxSide ? photoMat(art.boxSide, 0.66, 0.02) : board;
  const back = art.boxBack ? photoMat(art.boxBack, 0.62, 0.02) : board;
  const sides = pack.boxSide === "left" ? [board, side] : [side, board];
  return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), [...sides, board, board, print, back]);
}

async function makeForm(id) {
  const spec = FORM[id];
  const pack = { id, ...PACKS[id], ...spec };
  const art = { logo: volumeLogo, word: volumeWord };
  if (spec.labelRange) {
    const files = [[spec.wrapFront == null ? "photo" : "wrap", "etiqueta-3d.webp"]];
    if (spec.labelBack) files.push(["back", "reverso-3d.webp"]);
    if (spec.box) files.push(["box", "caja-3d.webp?v=2"]);
    if (spec.boxSide) files.push(["boxSide", "caja-lateral-3d.webp"]);
    if (spec.boxBack) files.push(["boxBack", "caja-reverso-3d.webp"]);
    const base = "productos_3d/" + id + "/texturas/";
    await Promise.all(files.map(async ([name, file]) => {
      try { art[name] = await loadBitmap(base + file); } catch (error) { /* El visor puede dibujar la etiqueta de respaldo. */ }
    }));
  }
  const group = new THREE.Group();
  let productX = 0;
  if (spec.box) {
    const carton = makePackBox(pack, art);
    const { width, height } = carton.geometry.parameters;
    carton.position.set(-width / 2 - 0.18, height / 2, -0.21);
    carton.rotation.y = -0.16;
    productX = spec.top === "pump" ? 0.52 : 0.49;
    group.add(carton);
  }
  const product = spec.top === "tube" ? makeTube(pack, art) : makeBottle(pack, art, spec.top);
  const scale = spec.top === "pump" ? 0.54 : spec.top === "tube" ? 0.86 : 0.75;
  product.scale.setScalar(scale);
  product.position.set(productX, 0, 0.18);
  group.add(product);
  return group;
}

async function makeShelf(id) {
  const base = "productos_3d/" + id + "/texturas/";
  const group = new THREE.Group();
  let boxImg = null;
  try { boxImg = await loadBitmap(base + "caja.jpg?v=1"); } catch (error) { boxImg = null; }
  const prod = await loadBitmap(base + "producto.jpg?v=1");
  if (boxImg) {
    const boxH = 1.72;
    const boxW = Math.min(boxH * (boxImg.width / boxImg.height), 1.25);
    const box = standingPhoto(boxImg, boxW, boxH, 0.32, false);
    box.position.set(-0.82, 0, -0.08);
    group.add(box);
  }
  const prodH = 1.9;
  const prodW = Math.min(prodH * (prod.width / prod.height), 1.2);
  const product = standingPhoto(prod, prodW, prodH, 0.18, false);
  product.position.set(boxImg ? 0.78 : 0, 0, 0.16);
  group.add(product);
  return group;
}

function photographicMoldBox(front, canto, ingredients, { color = "#141418", flipTopV = false } = {}) {
  const board = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.02, side: THREE.DoubleSide });
  const face = (img) => (img ? photoMat(img, 0.5, 0.04) : board);
  const width = 2.35;
  const height = width * Math.sqrt(3) / 2;
  const depth = 0.46;
  const top = 0.42;
  const bottom = top - height;
  const left = -width / 2;
  const right = width / 2;
  const frontZ = depth / 2;
  const backZ = -depth / 2;
  const box = new THREE.Group();
  box.name = "PackagingBox";
  const frontGeo = new THREE.BufferGeometry();
  frontGeo.setAttribute("position", new THREE.Float32BufferAttribute([
    left, top, frontZ, 0, bottom, frontZ, right, top, frontZ,
  ], 3));
  frontGeo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 1, 0.5, 0, 1, 1], 2));
  frontGeo.computeVertexNormals();
  box.add(new THREE.Mesh(frontGeo, photoMat(front, 0.48, 0.04)));
  const backGeo = new THREE.BufferGeometry();
  backGeo.setAttribute("position", new THREE.Float32BufferAttribute([
    left, top, backZ, right, top, backZ, 0, bottom, backZ,
  ], 3));
  backGeo.computeVertexNormals();
  box.add(new THREE.Mesh(backGeo, board));
  box.add(faceQuad([
    new THREE.Vector3(left, top, frontZ),
    new THREE.Vector3(right, top, frontZ),
    new THREE.Vector3(right, top, backZ),
    new THREE.Vector3(left, top, backZ),
  ], flipTopV ? [0, 0, 1, 0, 1, 1, 0, 1] : [0, 1, 1, 1, 1, 0, 0, 0], face(canto)));
  box.add(faceQuad([
    new THREE.Vector3(right, top, frontZ),
    new THREE.Vector3(0, bottom, frontZ),
    new THREE.Vector3(0, bottom, backZ),
    new THREE.Vector3(right, top, backZ),
  ], [0, 1, 1, 1, 1, 0, 0, 0], face(ingredients)));
  box.add(faceQuad([
    new THREE.Vector3(0, bottom, frontZ),
    new THREE.Vector3(left, top, frontZ),
    new THREE.Vector3(left, top, backZ),
    new THREE.Vector3(0, bottom, backZ),
  ], [0, 1, 1, 1, 1, 0, 0, 0], board));
  box.position.set(0.55, -bottom, -0.25);
  return box;
}

async function makeMoldingStage(pack, spec) {
  const base = "productos_3d/" + pack.id + "/texturas/";
  const [front, lid, cream, edge, ingredients, band] = await Promise.all([
    loadBitmap(base + (spec.box || "caja-3d.webp")),
    loadBitmap(base + "tapa-3d.webp"),
    loadBitmap(base + (spec.cream || "crema-3d.webp")),
    spec.edge && loadBitmap(base + spec.edge),
    spec.ingredients && loadBitmap(base + spec.ingredients),
    loadBitmap(spec.band ? base + spec.band : LID_ART[pack.id][1]),
  ]);
  const box = photographicMoldBox(front, edge, ingredients, { color: spec.boxColor, flipTopV: spec.flipTopV });
  box.position.set(0.02, box.position.y, -0.49);
  box.rotation.y = -0.08;
  const jar = makeOpenableJar(lid, null, cream, {
    ...spec, ...pack, bodyLabel: band, wax: [spec.tone],
  });
  jar.position.set(0.52, 0.04, 0.67);
  jar.getObjectByName("ContainerLid").userData.aside = [-1.45, 0.61, 0.09, 0.91, -0.08, 0];
  const stage = new THREE.Group();
  stage.add(box, jar);
  setCeraView(stage, "completo");
  return stage;
}

function makeFamilyStage(pack, vMark) {
  const front = moldBoxFront(pack, vMark);
  const board = new THREE.MeshStandardMaterial({ color: "#141418", roughness: 0.8, metalness: 0.02, side: THREE.DoubleSide });
  const width = 2.35;
  const height = width * Math.sqrt(3) / 2;
  const depth = 0.46;
  const top = 0.42;
  const bottom = top - height;
  const left = -width / 2;
  const right = width / 2;
  const frontZ = depth / 2;
  const backZ = -depth / 2;
  const box = new THREE.Group();
  box.name = "PackagingBox";
  const frontGeo = new THREE.BufferGeometry();
  frontGeo.setAttribute("position", new THREE.Float32BufferAttribute([
    left, top, frontZ, 0, bottom, frontZ, right, top, frontZ,
  ], 3));
  frontGeo.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 0.5, 1, 1, 0], 2));
  frontGeo.computeVertexNormals();
  const frontMat = new THREE.MeshStandardMaterial({ map: canvasTexture(front, 0), roughness: 0.48, metalness: 0.04, side: THREE.DoubleSide });
  frontMat.map.wrapS = THREE.ClampToEdgeWrapping;
  frontMat.map.wrapT = THREE.ClampToEdgeWrapping;
  box.add(new THREE.Mesh(frontGeo, frontMat));
  const backGeo = new THREE.BufferGeometry();
  backGeo.setAttribute("position", new THREE.Float32BufferAttribute([
    left, top, backZ, right, top, backZ, 0, bottom, backZ,
  ], 3));
  backGeo.computeVertexNormals();
  box.add(new THREE.Mesh(backGeo, board));
  const edgeMat = photoMat(moldEdgeCanvas(pack), 0.5, 0.04);
  box.add(faceQuad([
    new THREE.Vector3(left, top, frontZ),
    new THREE.Vector3(right, top, frontZ),
    new THREE.Vector3(right, top, backZ),
    new THREE.Vector3(left, top, backZ),
  ], [1, 1, 0, 1, 0, 0, 1, 0], edgeMat));
  box.add(faceQuad([
    new THREE.Vector3(right, top, frontZ),
    new THREE.Vector3(0, bottom, frontZ),
    new THREE.Vector3(0, bottom, backZ),
    new THREE.Vector3(right, top, backZ),
  ], [0, 1, 1, 1, 1, 0, 0, 0], edgeMat));
  box.add(faceQuad([
    new THREE.Vector3(0, bottom, frontZ),
    new THREE.Vector3(left, top, frontZ),
    new THREE.Vector3(left, top, backZ),
    new THREE.Vector3(0, bottom, backZ),
  ], [0, 1, 1, 1, 1, 0, 0, 0], board));
  box.position.set(0.55, -bottom, -0.25);
  const jar = makeOpenableJar(null, vMark, null, pack);
  jar.position.set(-0.85, 0, 0.35);
  const group = new THREE.Group();
  group.add(box, jar);
  setCeraView(group, "completo");
  return group;
}

function makeMoldStage(pack, art) {
  const stage = new THREE.Group();
  const box = makePrismBox(moldFaceCanvas(pack), moldEdgeCanvas(pack), "#111114");
  box.rotation.y = 0.28;
  stage.add(box);
  const open = makeTin(pack, art, true);
  open.name = "kids-open";
  open.scale.setScalar(0.5);
  open.position.set(0.2, 0, 1.35);
  const lid = open.getObjectByName("kids-lid");
  if (lid) lid.position.x += 1.65;
  stage.add(open);
  return stage;
}

function makeKidsBox() {
  const group = new THREE.Group();
  const s = 2.4;
  const h = s * Math.sqrt(3) / 2;
  const zf = 0.7;
  const zb = -0.7;
  const red = new THREE.MeshStandardMaterial({ color: "#e4233c", roughness: 0.5, metalness: 0.05, side: THREE.DoubleSide });
  const cavity = new THREE.MeshStandardMaterial({ color: "#9d1428", roughness: 0.74, metalness: 0.02, side: THREE.DoubleSide });
  const brand = new THREE.MeshStandardMaterial({ map: kidsBoxTexture(), roughness: 0.45, metalness: 0.04, side: THREE.DoubleSide });
  const p = (x, y, z) => new THREE.Vector3(x, y, z);
  const left = -s / 2;
  const right = s / 2;
  group.add(kidsFace([p(left, 0, zb), p(right, 0, zb), p(right, 0, zf), p(left, 0, zf)], cavity));
  group.add(kidsFace([p(left, 0, zb), p(left, 0, zf), p(0, h, zf), p(0, h, zb)], red));
  group.add(kidsFace([p(right, 0, zf), p(right, 0, zb), p(0, h, zb), p(0, h, zf)], red));
  group.add(kidsTriangle(p(right, 0, zb), p(0, h, zb), p(left, 0, zb), red));
  const door = new THREE.Group();
  door.name = "kids-door";
  door.position.set(left, 0, zf);
  door.add(kidsTriangle(p(0, 0, 0), p(s, 0, 0), p(s / 2, h, 0), brand));
  group.add(door);
  group.name = "kids-box";
  return group;
}

function makeKidsStage(pack, art) {
  const stage = new THREE.Group();
  const box = makeKidsBox();
  box.rotation.y = 0.22;
  stage.add(box);
  const open = makeTin(pack, art, true);
  open.name = "kids-open";
  open.scale.setScalar(0.52);
  open.position.set(0.15, 0, 1.45);
  stage.add(open);
  return stage;
}

function kidsEase(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function tickKids(root, now, still) {
  const box = root.getObjectByName("kids-box");
  const door = root.getObjectByName("kids-door");
  const open = root.getObjectByName("kids-open");
  const lid = open && open.getObjectByName("kids-lid");
  if (!box || !door || !open || !lid) return;
  if (!open.userData.home) open.userData.home = open.position.clone();
  if (lid.userData.baseX == null) {
    lid.userData.baseX = lid.position.x;
    lid.userData.baseY = lid.position.y;
    lid.userData.baseZ = lid.position.z;
  }
  if (!root.userData.t0) root.userData.t0 = now;
  const home = open.userData.home;
  if (still) {
    door.rotation.y = 0;
    open.visible = true;
    open.position.set(home.x - 0.28, home.y, home.z);
    lid.rotation.set(0, 0, 0);
    lid.position.set(lid.userData.baseX + 1.55, lid.userData.baseY, lid.userData.baseZ + 0.12);
    return;
  }
  const inside = box.position.clone();
  inside.y += 0.28;
  const cycle = 12;
  const u = (((now - root.userData.t0) / 1000) % cycle) / cycle;
  let x = inside.x;
  let y = inside.y;
  let z = inside.z;
  let doorOpen = 0;
  let aside = 0;
  let show = false;
  if (u < 0.2) {
    doorOpen = 0;
  } else if (u < 0.34) {
    doorOpen = kidsEase((u - 0.2) / 0.14);
  } else if (u < 0.52) {
    doorOpen = 1;
    show = true;
    const t = kidsEase((u - 0.34) / 0.18);
    x = inside.x + (home.x - inside.x) * t;
    y = inside.y + Math.sin(t * Math.PI) * 0.85;
    z = inside.z + (home.z - inside.z) * t;
  } else if (u < 0.66) {
    doorOpen = 1;
    show = true;
    aside = kidsEase((u - 0.52) / 0.14);
    x = home.x;
    y = home.y;
    z = home.z;
  } else {
    doorOpen = 1;
    show = true;
    aside = 1;
    x = home.x;
    y = home.y;
    z = home.z;
  }
  door.rotation.y = -2.15 * doorOpen;
  open.visible = show;
  open.position.set(x, y, z);
  lid.rotation.set(0, 0, 0);
  lid.position.set(
    lid.userData.baseX + aside * 2.45,
    lid.userData.baseY,
    lid.userData.baseZ + aside * 0.2
  );
}

function panel(pack) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 900, 1400);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  return { canvas, ctx };
}

function paintMark(ctx, art, pack, x, y, w) {
  drawV(ctx, x + w * 0.08, y, w * 0.84, pack.v || pack.accent);
}

function drawRays(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 3;
  for (let i = -h; i < w + h; i += 14) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i - h * 0.42, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSalt(ctx, x, y, fill, ink, scale = 1) {
  const w = 168 * scale;
  const h = 52 * scale;
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.4 * scale;
  ctx.beginPath();
  ctx.arc(x + 26 * scale, y + h / 2, 11 * scale, 0, Math.PI * 2);
  ctx.moveTo(x + 18 * scale, y + h / 2 - 8 * scale);
  ctx.lineTo(x + 34 * scale, y + h / 2 + 8 * scale);
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = `800 ${Math.round(16 * scale)}px Outfit, sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("SIN SAL", x + 48 * scale, y + h / 2);
}

function frontLabel(pack, art) {
  const { canvas, ctx } = panel(pack);
  if (pack.face === "white") {
    const left = 80;
    ctx.textAlign = "left";
    ctx.fillStyle = pack.ink;
    ctx.font = "800 108px Outfit, sans-serif";
    ctx.fillText("SHAMPOO", left, 190);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 40px Outfit, sans-serif";
    ctx.fillText("PROTECCIÓN CAPILAR", left, 270);
    drawRays(ctx, left + 20, 320, 680, 500, pack.accent);
    drawV(ctx, left + 50, 340, 620, pack.accent);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 30px Outfit, sans-serif";
    ctx.fillText("CONTIENE EXTRACTO", left, 980);
    ctx.fillStyle = pack.ink;
    ctx.font = "600 28px Outfit, sans-serif";
    ["ROMERO  ·  KERATINA", "CEBOLLA  ·  ALOE VERA", "ZANAHORIA", "ÁCIDO HIALURÓNICO"].forEach((line, index) => {
      ctx.fillText(line, left, 1030 + index * 40);
    });
    drawSalt(ctx, left, 1210, pack.accent, "#ffffff", 1.7);
    ctx.fillStyle = pack.ink;
    ctx.font = "600 32px Outfit, sans-serif";
    ctx.fillText("|  " + pack.size, left, 1340);
  } else if (pack.face === "carbon") {
    const left = 80;
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 108px Outfit, sans-serif";
    ctx.fillText("SHAMPOO", left, 180);
    ctx.fillStyle = "#9a9aa2";
    ctx.font = "600 42px Outfit, sans-serif";
    ctx.fillText("CARBON ACTIVO", left, 258);
    drawRays(ctx, left + 10, 310, 700, 470, "#9a9aa2");
    drawV(ctx, left + 40, 325, 630, pack.v || "#8a8a92");
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 32px Outfit, sans-serif";
    ctx.fillText("ADIÓS CASPA", left, 960);
    ctx.fillText("Y PICAZÓN", left, 1004);
    drawSalt(ctx, left + 390, 930, pack.accent, "#141414", 1.65);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 28px Outfit, sans-serif";
    ctx.fillText("CONTIENE EXTRACTO", left, 1100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 26px Outfit, sans-serif";
    ["ROMERO  ·  KERATINA", "CEBOLLA  ·  ALOE VERA", "ZANAHORIA", "ÁCIDO HIALURÓNICO"].forEach((line, index) => {
      ctx.fillText(line, left, 1148 + index * 36);
    });
    ctx.font = "600 32px Outfit, sans-serif";
    ctx.fillText("|  500 mL", left, 1330);
  } else if (pack.face === "tube") {
    drawWord(ctx, 80, 120, 740, "#f4f1ea");
    drawRays(ctx, 120, 250, 660, 460, pack.accent);
    drawV(ctx, 175, 270, 550, pack.accent);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 84px Outfit, sans-serif";
    ctx.fillText("DUCHA", 450, 820);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 76px Outfit, sans-serif";
    ctx.fillText("ÍNTIMA", 450, 910);
    ctx.fillStyle = "#e8e8e8";
    ctx.font = "600 30px Outfit, sans-serif";
    ctx.fillText("FOR MEN", 450, 980);
    ctx.save();
    ctx.translate(250, 1120);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 32px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SIN", 0, 0);
    ctx.restore();
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 30px Outfit, sans-serif";
    ["FRAGANCIA", "COLORANTES", "PARABENOS"].forEach((line, index) => ctx.fillText(line, 300, 1060 + index * 44));
    ctx.textAlign = "center";
    ctx.fillStyle = pack.accent;
    ctx.font = "600 32px Outfit, sans-serif";
    ctx.fillText("|  " + pack.size, 450, 1260);
    ctx.strokeStyle = pack.accent;
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 3;
    for (let i = 0; i < 11; i += 1) {
      ctx.beginPath();
      ctx.moveTo(250 + i * 36, 1310);
      ctx.lineTo(220 + i * 36, 1390);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (pack.face === "shave") {
    drawWord(ctx, 110, 130, 680, "#f4f1ea");
    drawRays(ctx, 90, 250, 720, 460, pack.accent);
    drawV(ctx, 155, 270, 590, pack.accent);
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 86px Outfit, sans-serif";
    ctx.fillText("SHAVING", 90, 860);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 86px Outfit, sans-serif";
    ctx.fillText("GEL", 90, 960);
    ctx.font = "600 30px Outfit, sans-serif";
    ctx.fillText("FOR MEN", 340, 968);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(90, 1030, 168, 156);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(174, 1120);
    ctx.quadraticCurveTo(140, 1084, 156, 1052);
    ctx.stroke();
    ctx.fillStyle = "#1a1a1a";
    ctx.textAlign = "center";
    ctx.font = "800 16px Outfit, sans-serif";
    ctx.fillText("CONTIENE", 174, 1140);
    ctx.fillText("ALOE VERA", 174, 1162);
    ctx.textAlign = "left";
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText("|  250 mL", 90, 1260);
    ctx.strokeStyle = pack.accent;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i += 1) {
      ctx.beginPath();
      ctx.moveTo(250 + i * 36, 1310);
      ctx.lineTo(222 + i * 36, 1388);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = "center";
  } else if (pack.face === "minox") {
    const is23 = pack.concentration === "23%";
    ctx.fillStyle = is23 ? "#19191b" : "#c41218";
    ctx.fillRect(70, 80, 760, 1220);
    if (is23) {
      ctx.fillStyle = "#c41218";
      ctx.fillRect(70, 310, 760, 350);
    }
    drawWord(ctx, 160, 150, 580, "#ffffff");
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText("PARA CABELLO & BARBA", 450, 280);
    ctx.font = "800 92px Outfit, sans-serif";
    ctx.fillText("TÓNICO", 450, 400);
    ctx.font = "700 48px Outfit, sans-serif";
    ctx.fillText("Minoxidil", 450, 470);
    if (!is23) {
      ctx.fillStyle = "#d9dde2";
      ctx.fillRect(120, 520, 660, 130);
    }
    ctx.fillStyle = is23 ? "#ffffff" : "#c41218";
    ctx.font = "800 78px Outfit, sans-serif";
    ctx.fillText(pack.concentration, 450, 590);
    ctx.fillStyle = "#ffffff";
    if (!is23) {
      ctx.textAlign = "left";
      ctx.font = "700 28px Outfit, sans-serif";
      ctx.fillText("Contiene", 140, 720);
      ctx.font = "600 26px Outfit, sans-serif";
      ["12.5% minoxidil", "Dudasteride 0.5%", "Biotina", "Ácido hialurónico"].forEach((line, index) => {
        ctx.fillText(line, 140, 770 + index * 40);
      });
    }
    ctx.textAlign = "center";
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText("2.3 FL. Oz  /  65 ml", 450, 1180);
  } else if (pack.face === "tonico") {
    ctx.fillStyle = "#0e3f42";
    ctx.fillRect(70, 70, 760, 1240);
    drawWord(ctx, 170, 140, 560, "#f7f4ea");
    drawRays(ctx, 140, 250, 620, 420, pack.accent);
    drawV(ctx, 190, 270, 520, pack.accent);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 88px Outfit, sans-serif";
    ctx.fillText("TÓNICO", 450, 760);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 48px Outfit, sans-serif";
    ctx.fillText("ORGÁNICO", 450, 830);
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 22px Outfit, sans-serif";
    ctx.fillText("CONTIENE", 130, 910);
    ctx.font = "600 22px Outfit, sans-serif";
    ["ROMERO", "ÁCIDO", "HIALURÓNICO"].forEach((line, index) => ctx.fillText(line, 130, 952 + index * 32));
    ctx.fillStyle = pack.accent;
    ["· BIOTINA", "· RUIBARBO", "· KERATINA", "· ALOE VERA"].forEach((line, index) => ctx.fillText(line, 470, 910 + index * 32));
    ctx.fillStyle = pack.accent;
    ctx.fillRect(120, 1080, 660, 86);
    ctx.fillStyle = "#142018";
    ctx.textAlign = "center";
    ctx.font = "800 26px Outfit, sans-serif";
    ctx.fillText("ESTIMULANTE CON 19 ACTIVOS", 450, 1124);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 24px Outfit, sans-serif";
    ctx.fillText("2.3 FL. Oz  /  65 ml", 450, 1240);
  } else if (pack.face === "splash") {
    drawWord(ctx, 140, 170, 620, "#f4f8fc");
    drawRays(ctx, 130, 280, 640, 430, "#7ec8f0");
    drawV(ctx, 185, 300, 530, pack.accent);
    ctx.textAlign = "center";
    ctx.fillStyle = pack.accent;
    ctx.font = "800 72px Outfit, sans-serif";
    ctx.fillText("BODY", 450, 860);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Outfit, sans-serif";
    ctx.fillText("SPLASH", 450, 970);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 36px Outfit, sans-serif";
    ctx.fillText("FOR MEN", 450, 1060);
    ctx.fillStyle = "#d7ebf8";
    ctx.font = "600 30px Outfit, sans-serif";
    ctx.fillText("250 mL", 450, 1200);
    ctx.strokeStyle = "#7ec8f0";
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath();
      ctx.moveTo(90 + i * 18, 1280);
      ctx.lineTo(70 + i * 18, 1340);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(760 - i * 18, 1280);
      ctx.lineTo(780 - i * 18, 1340);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else {
    drawWord(ctx, 160, 140, 580, "#f4f1ea");
    drawRays(ctx, 140, 250, 620, 400, pack.accent);
    drawV(ctx, 190, 270, 520, pack.accent);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Outfit, sans-serif";
    ctx.fillText("SERUM", 450, 760);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(145, 810, 610, 64);
    ctx.fillStyle = "#141414";
    ctx.font = "800 28px Outfit, sans-serif";
    ctx.fillText("BARBA  ·  BIGOTE", 450, 844);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(145, 910, 610, 150);
    ctx.fillStyle = "#141414";
    ctx.font = "700 26px Outfit, sans-serif";
    ctx.fillText("CONTIENE ARGÁN,", 450, 958);
    ctx.fillText("JOJOBA, ALOE VERA", 450, 1000);
    ctx.fillStyle = "#f4f1ea";
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText("2.3 FL. Oz  /  65 mL", 450, 1160);
  }
  return canvas;
}

function labelBand(pack, art, radius, height, y) {
  const arc = 1.7;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, -arc / 2, arc),
    new THREE.MeshStandardMaterial({
      map: frontLabel(pack, art),
      roughness: 0.42,
      metalness: 0.04,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    })
  );
  mesh.position.y = y;
  const back = mesh.clone();
  back.rotation.y = Math.PI;
  return [mesh, back];
}

function addPump(group, mat, metal, neckY) {
  const ring = metal || mat;
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.06, 48), ring);
  lip.position.y = neckY + 0.025;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.34, 0.32, 56), ring);
  collar.position.y = neckY + 0.19;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.23, 40), mat);
  stem.position.y = neckY + 0.43;
  const lever = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 20), mat);
  lever.scale.set(0.42, 0.062, 0.17);
  lever.rotation.z = -0.08;
  lever.position.set(0.16, neckY + 0.55, 0);
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.066, 0.33, 24), mat);
  nozzle.scale.z = 1.24;
  nozzle.rotation.z = -Math.PI / 2 - 0.29;
  nozzle.position.set(0.44, neckY + 0.526, 0);
  group.add(lip, collar, stem, lever, nozzle);
}

function flutedCollar(radius, height, flutes, depth, mat) {
  const shape = new THREE.Shape();
  const steps = flutes * 8;
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const r = radius + Math.cos(angle * flutes) * depth;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 1 });
  geo.translate(0, 0, -height / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

function addSpray(group, mat, pack) {
  const tonic = pack.face === "tonico" || pack.face === "minox";
  if (tonic) {
    const label = document.createElement("canvas");
    label.width = 640;
    label.height = 480;
    const ctx = label.getContext("2d");
    ctx.fillStyle = "#141416";
    ctx.fillRect(0, 0, label.width, label.height);
    ctx.fillStyle = "#252529";
    ctx.fillRect(293, 24, 54, 456);
    drawV(ctx, 303, 45, 34, "#f5f2ed");
    ctx.save();
    ctx.translate(319, 118);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = "#f5f2ed";
    ctx.font = "600 25px Poppins, sans-serif";
    ctx.fillText("SELLO DE SEGURIDAD", 0, 0);
    ctx.restore();
    const top = mat.clone();
    top.color.set("#ffffff");
    top.map = canvasTexture(label, 0.5);
    top.roughness = 0.21;
    const radius = pack.face === "minox" ? 0.235 : 0.222;
    const profile = [[0.18, 2.01], [radius, 2.035], [radius, 2.92], [radius * 0.92, 2.97], [0.005, 2.975]];
    const hood = latheMesh(profile.map(([r, y]) => new THREE.Vector2(r, y)), top);
    hood.name = "SecurityCap";
    group.add(hood);
    return;
  }
  const y0 = 2.30;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.08, 40), mat);
  neck.position.y = y0 + 0.04;
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.03, 36), mat);
  seat.position.y = y0 + 0.09;
  const collar = flutedCollar(0.215, 0.42, 24, 0.013, mat);
  collar.position.y = y0 + 0.28;
  const actuator = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.125, 0.18, 28), mat);
  actuator.position.y = y0 + 0.50;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.048, 0.14, 16), mat);
  stem.position.y = y0 + 0.64;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.03, 0.14, 12), mat);
  nozzle.rotation.z = -Math.PI / 2 - 0.32;
  nozzle.position.set(0.07, y0 + 0.52, 0);
  group.add(neck, seat, collar, actuator, stem, nozzle);
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#c7bcb1",
    roughness: 0.02,
    metalness: 0,
    transparent: true,
    opacity: 0.26,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const capH = 0.82;
  const capR = 0.235;
  const shroud = new THREE.Mesh(new THREE.CylinderGeometry(capR, capR, capH, 48, 1, true), glass);
  shroud.position.y = y0 + 0.14 + capH / 2;
  shroud.renderOrder = 2;
  const lid = new THREE.Mesh(new THREE.CircleGeometry(capR, 40), glass);
  lid.rotation.x = -Math.PI / 2;
  lid.position.y = y0 + 0.14 + capH;
  lid.renderOrder = 2;
  group.add(shroud, lid);
}

function addDropper(group) {
  const y0 = 2.04;
  const capMat = new THREE.MeshPhysicalMaterial({
    color: "#1a1b20",
    roughness: 0.34,
    metalness: 0.18,
    clearcoat: 0.25,
    clearcoatRoughness: 0.28,
  });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.08, 36), capMat);
  neck.position.y = y0 + 0.04;
  const cap = flutedCollar(0.205, 0.38, 22, 0.012, capMat);
  cap.position.y = y0 + 0.26;
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.045, 32), capMat);
  lip.position.y = y0 + 0.47;
  const rubber = new THREE.MeshPhysicalMaterial({
    color: "#0e0e10",
    roughness: 0.52,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
  });
  const bulb = new THREE.Mesh(new THREE.LatheGeometry([
    [0.05, 0], [0.09, 0.03], [0.14, 0.12], [0.155, 0.24], [0.13, 0.36], [0.08, 0.44], [0.03, 0.48], [0.008, 0.5],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 40), rubber);
  bulb.position.y = y0 + 0.46;
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#c8d0d8",
    roughness: 0.04,
    metalness: 0,
    transparent: true,
    opacity: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
  });
  const pipette = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 1.55, 16), glass);
  pipette.position.y = 1.18;
  group.add(neck, cap, lip, bulb, pipette);
}

function bottleProfile(pack, top) {
  if (top === "pump") {
    if (pack.face === "shave") {
      return [
        [0.02, 0], [0.44, 0], [0.49, 0.07], [0.51, 0.18], [0.52, 2.77], [0.51, 2.92],
        [0.45, 3.02], [0.32, 3.09], [0.23, 3.13], [0.22, 3.16], [0.02, 3.16],
      ];
    }
    return [
      [0.02, 0], [0.48, 0], [0.58, 0.036], [0.65, 0.09], [0.68, 0.22], [0.68, 2.77],
      [0.67, 2.99], [0.62, 3.18], [0.54, 3.30], [0.42, 3.40], [0.26, 3.47], [0.24, 3.56], [0.02, 3.56],
    ];
  }
  if (top === "spray" && (pack.face === "tonico" || pack.face === "minox")) {
    return [
      [0.02, 0], [0.34, 0], [0.40, 0.03], [0.42, 0.09], [0.425, 0.2],
      [0.425, 1.5], [0.41, 1.68], [0.34, 1.84], [0.24, 1.94], [0.18, 2.02], [0.02, 2.02],
    ];
  }
  if (top === "spray") {
    return [
      [0.02, 0], [0.38, 0], [0.46, 0.04], [0.48, 0.12], [0.48, 1.85],
      [0.45, 2.02], [0.34, 2.16], [0.24, 2.24], [0.18, 2.3], [0.02, 2.3],
    ];
  }
  if (top === "dropper") {
    return [
      [0.02, 0], [0.32, 0], [0.40, 0.04], [0.43, 0.12], [0.44, 0.28],
      [0.44, 1.52], [0.42, 1.7], [0.34, 1.86], [0.22, 1.96], [0.17, 2.04], [0.02, 2.04],
    ];
  }
  return [
    [0.02, 0], [0.46, 0], [0.56, 0.08], [0.58, 0.22], [0.58, 1.28],
    [0.5, 1.48], [0.34, 1.66], [0.2, 1.78], [0.2, 1.92], [0.02, 1.92],
  ];
}

function assignWrapUV(geometry) {
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i += 1) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const span = Math.max(0.0001, maxY - minY);
  for (let i = 0; i < pos.count; i += 1) {
    uv.setY(i, (pos.getY(i) - minY) / span);
  }
  uv.needsUpdate = true;
}

function bodyPrint(pack, art, vBottom, vTop, span) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  const glass = pack.face === "serum";
  if (!glass) {
    ctx.fillStyle = pack.body;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  const bandH = Math.round(canvas.height * (vTop - vBottom));
  const bandTop = Math.round(canvas.height * (1 - vTop));
  if (art.wrap) {
    const x = Math.round(canvas.width * (0.5 - pack.wrapFront));
    ctx.drawImage(art.wrap, x, bandTop, canvas.width, bandH);
    if (x) ctx.drawImage(art.wrap, x - canvas.width, bandTop, canvas.width, bandH);
    return canvasTexture(canvas, 0.5);
  }
  if (pack.labelBase) {
    ctx.fillStyle = pack.labelBase;
    ctx.fillRect(0, bandTop, canvas.width, bandH);
  }
  const artCanvas = art.photo || frontLabel(pack, art);
  const w = Math.min(Math.round(bandH * (artCanvas.width / artCanvas.height)), Math.round(canvas.width * (span || 0.46)));
  const h = Math.round(w * (artCanvas.height / artCanvas.width));
  const x = Math.round((canvas.width - w) / 2);
  const y = Math.round(canvas.height * (1 - vTop) + (bandH - h) / 2);
  const stamp = (image, dx) => {
    let left = x + dx;
    while (left < 0) left += canvas.width;
    while (left >= canvas.width) left -= canvas.width;
    ctx.drawImage(image, left, y, w, h);
    if (left + w > canvas.width) ctx.drawImage(image, left - canvas.width, y, w, h);
  };
  stamp(artCanvas, 0);
  if (art.back || !art.photo) stamp(art.back || artCanvas, Math.round(canvas.width / 2));
  return canvasTexture(canvas, 0.5);
}

function makeBottle(pack, art, top) {
  const group = new THREE.Group();
  const pump = top === "pump";
  const shave = pack.face === "shave";
  const points = bottleProfile(pack, top).map(([x, y]) => new THREE.Vector2(x, y));
  const dropper = top === "dropper";
  const [labelBottom, labelTop] = pack.labelRange || (pump ? [0.1, 0.78] : [0.12, 0.84]);
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 96), dropper
    ? new THREE.MeshPhysicalMaterial({
      color: "#111218",
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 0.82,
      clearcoatRoughness: 0.1,
    })
    : new THREE.MeshPhysicalMaterial({
      color: pack.body,
      roughness: pump && pack.face === "white" ? 0.16 : top === "spray" ? 0.18 : 0.28,
      metalness: top === "spray" ? 0.04 : 0,
      clearcoat: top === "spray" ? 0.7 : 0.3,
      clearcoatRoughness: top === "spray" ? 0.1 : 0.22,
    }));
  group.add(body);
  if (dropper) {
    const skinGeo = body.geometry.clone();
    assignWrapUV(skinGeo);
    const skin = new THREE.Mesh(skinGeo, new THREE.MeshStandardMaterial({
      map: bodyPrint(pack, art, labelBottom, labelTop),
      transparent: true,
      alphaTest: 0.4,
      roughness: 0.46,
      metalness: 0,
    }));
    skin.scale.setScalar(1.012);
    group.add(skin);
  } else {
    assignWrapUV(body.geometry);
    body.material.color.set("#ffffff");
    body.material.map = bodyPrint(pack, art, labelBottom, labelTop);
  }
  const capMat = new THREE.MeshPhysicalMaterial({
    color: pump && (pack.face === "white" || shave) ? "#eeebe5" : "#161618",
    roughness: pump && (pack.face === "white" || shave) ? 0.18 : 0.3,
    metalness: pump && (pack.face === "white" || shave) ? 0 : 0.2,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  });
  if (pump) {
    const chrome = shave ? null : new THREE.MeshPhysicalMaterial({ color: "#d5d8dc", roughness: 0.22, metalness: 0.7, clearcoat: 0.35 });
    addPump(group, capMat, chrome, shave ? 3.16 : 3.56);
  }
  else if (top === "spray") addSpray(group, capMat, pack);
  else addDropper(group);
  return group;
}

function makeTube(pack, art) {
  const group = new THREE.Group();
  const ducha = pack.face === "tube";
  const flat = ducha ? 0.58 : 0.52;
  const points = (ducha
    ? [
      [0.02, 0.5], [0.30, 0.48], [0.38, 0.62], [0.42, 0.82],
      [0.46, 1.2], [0.50, 1.75], [0.54, 2.22], [0.56, 2.48], [0.55, 2.55], [0.02, 2.56],
    ]
    : [
      [0.02, 0.46], [0.3, 0.4], [0.36, 0.55], [0.38, 0.85],
      [0.42, 1.35], [0.48, 1.85], [0.5, 2.02], [0.28, 2.12], [0.02, 2.12],
    ]
  ).map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 80), new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.39,
    metalness: 0.06,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  }));
  assignWrapUV(body.geometry);
  const [labelBottom, labelTop] = pack.labelRange || [0.2, 0.84];
  body.material.map = bodyPrint(pack, art, labelBottom, labelTop, 0.36);
  body.scale.z = flat;
  group.add(body);
  const capMat = new THREE.MeshPhysicalMaterial({
    color: "#1c1c20",
    roughness: 0.22,
    metalness: 0.4,
    clearcoat: 0.85,
    clearcoatRoughness: 0.14,
  });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(ducha ? 0.32 : 0.34, ducha ? 0.36 : 0.38, ducha ? 0.46 : 0.42, 40), capMat);
  cap.scale.z = ducha ? 0.5 : 0.58;
  cap.position.y = ducha ? 0.23 : 0.2;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(ducha ? 0.32 : 0.34, ducha ? 0.33 : 0.35, 0.08, 40), capMat);
  lid.scale.z = ducha ? 0.46 : 0.5;
  lid.position.y = ducha ? 0.44 : 0.38;
  const notch = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), capMat);
  notch.scale.set(1.5, 0.42, 0.55);
  notch.position.set(0, ducha ? 0.24 : 0.22, ducha ? 0.14 : 0.16);
  group.add(cap, lid, notch);
  const crimpMat = new THREE.MeshStandardMaterial({ color: "#2a2a30", roughness: 0.35, metalness: 0.55 });
  const crimpY = ducha ? 2.56 : 2.12;
  const crimpW = ducha ? 0.96 : 0.98;
  const seam = new THREE.Mesh(new THREE.BoxGeometry(crimpW, 0.048, 0.061), crimpMat);
  seam.position.y = crimpY - 0.016;
  group.add(seam);
  return group;
}

function attachVolume(el, model) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const catalogCard = Boolean(el.closest(".sku-shot"));
  const recording = Boolean(window.VM_RECORD);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: recording || el.hasAttribute("data-kids-still"),
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "vol-view";
  const root = model.object.clone();
  const bounds = new THREE.Box3().setFromObject(root);
  const center = bounds.getCenter(new THREE.Vector3());
  root.children.forEach((child) => child.position.sub(center));
  bounds.translate(center.negate());
  scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222226, 0.75));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3.2, 4.4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdde7ff, 0.75);
  fill.position.set(-4, 1.5, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff6ee, 1.05);
  rim.position.set(-2, 3, -4);
  scene.add(rim);

  const sphere = new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());
  const frameDistance = () => sphere.radius / Math.tan(THREE.MathUtils.degToRad(15)) * (model.fit || 1.18);
  camera.position.z = frameDistance();
  camera.lookAt(0, 0, 0);

  function updateProjection() {
    camera.zoom = 1;
    camera.updateProjectionMatrix();
    if (!catalogCard && !model.frameParts) return;

    camera.updateMatrixWorld();
    const tiltAxis = new THREE.Vector3(1, 0, 0);
    const corner = new THREE.Vector3();
    let extent = 0;
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          corner.set(x, y, z).applyAxisAngle(tiltAxis, model.tilt).project(camera);
          extent = Math.max(extent, Math.abs(corner.x), Math.abs(corner.y));
        }
      }
    }
    camera.zoom = Math.min(1.10, 0.94 / extent);
    camera.updateProjectionMatrix();
  }

  function frameVisibleParts() {
    const rotation = root.rotation.clone();
    root.rotation.set(0, 0, 0);
    root.updateMatrixWorld(true);
    const visible = new THREE.Box3();
    root.traverseVisible((node) => {
      if (!node.isMesh) return;
      if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
      visible.union(node.geometry.boundingBox.clone().applyMatrix4(node.matrixWorld));
    });
    const offset = visible.getCenter(new THREE.Vector3());
    root.children.forEach((child) => child.position.sub(offset));
    visible.getBoundingSphere(sphere);
    bounds.copy(visible).translate(offset.negate());
    camera.position.z = frameDistance();
    updateProjection();
    root.rotation.copy(rotation);
  }

  const home = { x: model.tilt, y: 0 };
  const target = { x: home.x, y: home.y };
  root.rotation.x = target.x;
  root.rotation.y = target.y;
  el.dataset.solid = "1";
  let sceneHost = el.querySelector(".orbit-scene");
  if (!sceneHost) {
    sceneHost = document.createElement("span");
    sceneHost.className = "orbit-scene";
    el.appendChild(sceneHost);
  }
  sceneHost.appendChild(renderer.domElement);
  const card = el.querySelector(".orbit-card");
  if (card) card.style.visibility = "hidden";
  const controls = el.querySelector(".orbit-tools");

  const resize = () => {
    const width = el.clientWidth || 300;
    const reserved = catalogCard ? Math.max(22, (controls?.offsetHeight || 0) + 13) : 22;
    const height = Math.max(1, el.clientHeight - reserved);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width > 340 ? 1.6 : 1));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    updateProjection();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(el);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const interactive = !el.hasAttribute("data-kids-stage");
  const startTime = performance.now();
  let held = false;
  let still = !!model.hold || (model.sway && (!interactive || matchMedia("(prefers-reduced-motion: reduce)").matches));
  el.addEventListener("pointerdown", (event) => {
    if (!interactive || event.button !== 0 || event.target.closest("[data-orbit-act]")) return;
    held = true;
    el.classList.add("dragging");
    el._px = event.clientX;
    el._py = event.clientY;
    el._moved = 0;
    try { el.setPointerCapture(event.pointerId); } catch (error) { /* el puntero ya se soltó */ }
  });
  el.addEventListener("pointerup", (event) => {
    held = false;
    el.classList.remove("dragging");
    if ((el._moved || 0) < 8 && el.dataset.id && !event.target.closest("[data-orbit-act]")) {
      location.hash = "#/producto/" + el.dataset.id;
    }
  });
  el.addEventListener("pointercancel", () => {
    held = false;
    el.classList.remove("dragging");
  });
  el.addEventListener("pointermove", (event) => {
    if (!held) return;
    const dx = event.clientX - el._px;
    const dy = event.clientY - el._py;
    el._moved = (el._moved || 0) + Math.abs(dx) + Math.abs(dy);
    el._px = event.clientX;
    el._py = event.clientY;
    target.y += dx * 0.012;
    target.x = clamp(target.x + dy * 0.01, -0.85, 1.05);
    if (Math.abs(dx) + Math.abs(dy) > 1) still = true;
  });
  el.addEventListener("click", (event) => {
    const act = event.target.closest("[data-orbit-act]");
    if (!act) return;
    event.preventDefault();
    event.stopPropagation();
    still = true;
    if (act.dataset.orbitAct === "up") target.x = 0.98;
    if (act.dataset.orbitAct === "down") target.x = -0.55;
    if (act.dataset.orbitAct === "spin") target.y += Math.PI * 2;
    if (act.dataset.orbitAct === "cerrado" || act.dataset.orbitAct === "abierto" || act.dataset.orbitAct === "completo") {
      setCeraView(root, act.dataset.orbitAct);
      if (model.frameParts) {
        target.x = home.x;
        target.y = Math.round(root.rotation.y / (2 * Math.PI)) * (2 * Math.PI);
        frameVisibleParts();
      }
    }
  });
  el.addEventListener("keydown", (event) => {
    if (event.key.startsWith("Arrow")) still = true;
    const step = event.shiftKey ? 0.08 : 0.18;
    if (event.key === "ArrowLeft") target.y -= step;
    if (event.key === "ArrowRight") target.y += step;
    if (event.key === "ArrowUp") target.x = clamp(target.x - step, -1.25, 0.7);
    if (event.key === "ArrowDown") target.x = clamp(target.x + step, -1.25, 0.7);
  });
  el.addEventListener("dblclick", () => {
    target.x = home.x;
    target.y = home.y;
  });
  el.addEventListener("wheel", (event) => {
    event.preventDefault();
    const next = camera.position.z * (event.deltaY > 0 ? 1.08 : 0.92);
    camera.position.z = clamp(next, sphere.radius * 1.15, sphere.radius * 8);
  }, { passive: false });

  const shadow = el.querySelector(".orbit-shadow");
  if (recording) {
    window.VM_STEP = (yaw) => {
      root.rotation.x = home.x;
      root.rotation.y = yaw;
      renderer.render(scene, camera);
    };
  }

  return {
    el,
    draw() {
      if (el.hasAttribute("data-kids-still")) {
        if (!el.dataset.framed) {
          camera.position.z *= 0.92;
          el.dataset.framed = "1";
        }
        tickKids(root, performance.now(), true);
        root.rotation.y = 0.15;
        renderer.render(scene, camera);
        return;
      }
      if (recording) {
        renderer.render(scene, camera);
        return;
      }
      if (!held && !still) {
        if (model.sway) target.y = 0.26 * Math.sin((performance.now() - startTime) / 1150);
        else target.y += 0.006;
      }
      if (model.kids) tickKids(root, performance.now(), false);
      root.rotation.x += (target.x - root.rotation.x) * 0.16;
      root.rotation.y += (target.y - root.rotation.y) * 0.16;
      if (shadow) shadow.style.transform = `translateX(${Math.sin(root.rotation.y) * -26}px) scaleX(${0.85 + Math.abs(Math.sin(root.rotation.y)) * 0.2})`;
      renderer.render(scene, camera);
    },
    dispose() {
      observer.disconnect();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

function mountKidsStages() {
  if (!document.getElementById("kids-stage-css")) {
    const style = document.createElement("style");
    style.id = "kids-stage-css";
    style.textContent = "#revista .pg.kids-stage{position:relative}#revista .kids-view{position:absolute;inset:0;z-index:1}#revista .kids-view .orbit-scene{position:absolute;inset:0}";
    document.head.appendChild(style);
  }
  document.querySelectorAll("[data-kids-stage], [data-kids-still]").forEach((el) => {
    if (el._viewer || el.dataset.loading === "1" || typeof THREE === "undefined") return;
    el.dataset.loading = "1";
    buildVolume(el.getAttribute("data-src") || "assets/products/cera-kids.png").then((model) => {
      if (!el.isConnected || !model) {
        delete el.dataset.loading;
        return;
      }
      const viewer = attachVolume(el, model);
      el._viewer = viewer;
      delete el.dataset.loading;
      kidsViewers.push(viewer);
      pumpVolumes();
    }).catch((error) => {
      console.error(error);
      delete el.dataset.loading;
    });
  });
}

if (typeof document !== "undefined") {
  const watchKids = () => {
    if (!document.body) return;
    mountKidsStages();
    new MutationObserver(() => mountKidsStages()).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watchKids);
  else watchKids();
}
