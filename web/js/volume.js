/* Envase en 3D: tapa, cuerpo y etiqueta. Se gira y se ve por todos los lados. */
const volumeViewers = [];
const volumeModels = new Map();
let volumeJob = 0;
let volumeLogo = null;

const PACKS = {
  "cera-fibra": { kind: "tin", name: "CERA DE FIBRA", sub: "ACABADO FIRME", accent: "#6D4AFF", body: "#141414", ink: "#f4f1ea", size: "150 g", notes: ["KERATINA", "ROMERO", "ALOE VERA"] },
  "cera-brillo": { kind: "tin", name: "CERA BRILLO", sub: "BRILLO MEDIO", accent: "#E52C3B", body: "#141414", ink: "#f4f1ea", size: "150 g", notes: ["KERATINA", "ROMERO", "ALOE VERA"] },
  "pasta": { kind: "tin", name: "PASTA", sub: "FIJACIÓN FUERTE", accent: "#00C8C2", body: "#141414", ink: "#f4f1ea", size: "150 g", notes: ["KERATINA", "ROMERO", "ALOE VERA"] },
  "pomada": { kind: "tin", name: "POMADA", sub: "ACABADO MATE", accent: "#FFD300", body: "#141414", ink: "#f4f1ea", size: "150 g", notes: ["KERATINA", "ROMERO", "ALOE VERA"] },
  "cera-kids": { kind: "tin", name: "CERA KIDS", sub: "FIJACIÓN SUAVE", accent: "#FFD300", body: "#e31b23", ink: "#fff", size: "150 g", notes: ["KERATINA", "ROMERO", "ALOE VERA"] },
  "shampoo-proteccion": { kind: "pump", name: "SHAMPOO", sub: "PROTECCIÓN", accent: "#E52C3B", body: "#f4f4f2", ink: "#161616", size: "500 g", notes: ["ROMERO", "KERATINA", "SIN SAL"] },
  "shampoo-carbon": { kind: "pump", name: "SHAMPOO", sub: "CARBÓN ACTIVO", accent: "#FFD300", body: "#161616", ink: "#f4f1ea", size: "500 ml", notes: ["CARBÓN ACTIVO", "ROMERO", "SIN SAL"] },
  "serum-barba": { kind: "dropper", name: "SERUM", sub: "BARBA Y BIGOTE", accent: "#A4D800", body: "#1a1a1c", ink: "#f4f1ea", size: "65 ml", notes: ["ARGÁN", "JOJOBA", "ALOE VERA"] },
  "tonico": { kind: "spray", name: "TÓNICO", sub: "ORGÁNICO", accent: "#FFD300", body: "#12383a", ink: "#f4f1ea", size: "65 ml", notes: ["ROMERO", "MENTA", "ALOE VERA"] },
  "ducha-intima": { kind: "tube", name: "DUCHA ÍNTIMA", sub: "FOR MEN", accent: "#A4D800", body: "#141414", ink: "#f4f1ea", size: "200 g", notes: ["pH BALANCEADO", "SIN SULFATOS"] },
};

function releaseVolumes() {
  while (volumeViewers.length) volumeViewers.pop().dispose();
}

function mountVolumes() {
  if (!window.THREE) return;
  const job = ++volumeJob;
  releaseVolumes();
  document.querySelectorAll("[data-orbit]").forEach((el) => {
    const img = el.querySelector("img");
    if (!img) return;
    buildVolume(img.getAttribute("src")).then((model) => {
      if (job !== volumeJob || !el.isConnected || !model) return;
      volumeViewers.push(attachVolume(el, model));
      pumpVolumes();
    }).catch((error) => {
      console.error(error);
    });
  });
}

function pumpVolumes() {
  if (pumpVolumes.running) return;
  pumpVolumes.running = true;
  const frame = () => {
    volumeViewers.forEach((viewer) => viewer.draw());
    if (volumeViewers.length) requestAnimationFrame(frame);
    else pumpVolumes.running = false;
  };
  requestAnimationFrame(frame);
}

function loadBitmap(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function packFromSrc(src) {
  const file = String(src).split("/").pop().replace(/\.png.*$/, "");
  return PACKS[file] || PACKS["cera-fibra"];
}

function buildVolume(src) {
  if (!volumeModels.has(src)) {
    const pending = createVolume(src).catch((error) => {
      volumeModels.delete(src);
      throw error;
    });
    volumeModels.set(src, pending);
  }
  return volumeModels.get(src);
}

async function createVolume(src) {
  if (document.fonts && document.fonts.load) await document.fonts.load("700 64px Outfit");
  if (!volumeLogo) {
    try { volumeLogo = await loadBitmap("assets/isotipo-white.png"); } catch (error) { volumeLogo = null; }
  }
  const pack = packFromSrc(src);
  const object = pack.kind === "tin"
    ? makeTin(pack, volumeLogo)
    : pack.kind === "tube"
      ? makeTube(pack, volumeLogo)
      : makeBottle(pack, volumeLogo, pack.kind);
  return { object };
}

function canvasTexture(canvas, offsetX) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.offset.x = offsetX || 0;
  return texture;
}

function drawMark(ctx, logo, x, y, size, color) {
  if (!logo) {
    ctx.fillStyle = color;
    ctx.font = `700 ${Math.round(size)}px Outfit, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("V", x, y);
    return;
  }
  const stamp = document.createElement("canvas");
  stamp.width = stamp.height = 256;
  const g = stamp.getContext("2d");
  g.drawImage(logo, 16, 16, 224, 224);
  g.globalCompositeOperation = "source-in";
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  ctx.drawImage(stamp, x - size / 2, y - size / 2, size, size);
}

function sideLabel(pack, logo) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 236;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 2048, 236);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawMark(ctx, logo, 1024, 78, 92, pack.accent);
  ctx.fillStyle = pack.ink;
  ctx.font = "700 54px Outfit, sans-serif";
  ctx.fillText(pack.name.toUpperCase(), 1024, 150);
  ctx.fillStyle = pack.accent;
  ctx.font = "600 22px Outfit, sans-serif";
  ctx.fillText(pack.sub.toUpperCase() + "   ·   " + pack.size, 1024, 188);
  ctx.fillStyle = pack.ink;
  ctx.globalAlpha = 0.7;
  ctx.font = "600 28px Outfit, sans-serif";
  ctx.fillText("VINICIUS", 180, 118);
  ctx.fillText("VINICIUS", 1868, 118);
  ctx.globalAlpha = 1;
  return canvasTexture(canvas, 0.5);
}

function lidLabel(pack, logo) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = pack.accent;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(256, 256, 210, 0, Math.PI * 2);
  ctx.stroke();
  drawMark(ctx, logo, 256, 210, 210, pack.accent);
  ctx.fillStyle = pack.ink;
  ctx.textAlign = "center";
  ctx.font = "700 36px Outfit, sans-serif";
  ctx.fillText("VINICIUS", 256, 360);
  ctx.fillStyle = pack.accent;
  ctx.font = "500 22px Outfit, sans-serif";
  ctx.fillText(pack.sub, 256, 400);
  return canvasTexture(canvas, 0);
}

function makeTin(pack, logo) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: pack.body, roughness: 0.32, metalness: 0.62 });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.72, 72, 1, true), new THREE.MeshStandardMaterial({
    map: sideLabel(pack, logo),
    roughness: 0.4,
    metalness: 0.28,
  }));
  group.add(shell);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.18, 72), metal);
  lid.position.y = 0.46;
  group.add(lid);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.98, 64), new THREE.MeshStandardMaterial({
    map: lidLabel(pack, logo),
    roughness: 0.42,
    metalness: 0.2,
  }));
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.575;
  group.add(face);
  const base = new THREE.Mesh(new THREE.CircleGeometry(0.98, 48), metal);
  base.rotation.x = Math.PI / 2;
  base.position.y = -0.361;
  group.add(base);
  [0.4, 0.46, 0.52].forEach((y) => {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1.065, 0.016, 8, 72), metal);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = y;
    group.add(rib);
  });
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.03, 8, 72), metal);
  foot.rotation.x = Math.PI / 2;
  foot.position.y = -0.34;
  group.add(foot);
  return group;
}

function bottleLabel(pack, logo) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.fillStyle = pack.accent;
  ctx.fillRect(80, 430, 864, 8);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawMark(ctx, logo, 512, 560, 200, pack.accent);
  ctx.fillStyle = pack.ink;
  ctx.font = "700 68px Outfit, sans-serif";
  ctx.fillText(pack.name, 512, 700);
  ctx.fillStyle = pack.accent;
  ctx.font = "600 30px Outfit, sans-serif";
  ctx.fillText(pack.sub + "  ·  " + pack.size, 512, 760);
  ctx.fillStyle = pack.ink;
  ctx.globalAlpha = 0.85;
  ctx.font = "500 24px Outfit, sans-serif";
  ctx.fillText(pack.notes.join("   ·   "), 512, 820);
  ctx.globalAlpha = 1;
  return canvasTexture(canvas, 0.5);
}

function makeBottle(pack, logo, top) {
  const group = new THREE.Group();
  const points = [
    [0.02, 0], [0.46, 0], [0.56, 0.08], [0.58, 0.22], [0.58, 1.28],
    [0.5, 1.48], [0.34, 1.66], [0.2, 1.78], [0.2, 1.92], [0.02, 1.92],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 64), new THREE.MeshStandardMaterial({
    map: bottleLabel(pack, logo),
    roughness: pack.kind === "dropper" ? 0.22 : 0.36,
    metalness: 0.12,
  }));
  group.add(body);
  const capMat = new THREE.MeshStandardMaterial({
    color: top === "pump" && pack.body === "#f4f4f2" ? "#f7f7f5" : "#2a2a2c",
    roughness: 0.28,
    metalness: 0.45,
  });
  if (top === "pump") {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.12, 32), capMat);
    collar.position.y = 1.98;
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.34, 32), capMat);
    head.position.y = 2.18;
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.34, 16), capMat);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.2, 2.3, 0);
    group.add(collar, head, nozzle);
  } else if (top === "spray") {
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.16, 32), capMat);
    collar.position.y = 2.0;
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 32), capMat);
    head.position.y = 2.16;
    const nozzle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.05), capMat);
    nozzle.position.set(0.12, 2.22, 0);
    group.add(collar, head, nozzle);
  } else {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.28, 32), capMat);
    cap.position.y = 2.04;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 16), capMat);
    bulb.scale.y = 1.25;
    bulb.position.y = 2.26;
    group.add(cap, bulb);
  }
  return group;
}

function makeTube(pack, logo) {
  const group = new THREE.Group();
  const points = [
    [0.02, 0.08], [0.34, 0], [0.42, 0.12], [0.4, 1.35], [0.36, 1.5], [0.22, 1.62], [0.02, 1.62],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 48), new THREE.MeshStandardMaterial({
    map: bottleLabel(pack, logo),
    roughness: 0.4,
    metalness: 0.16,
  }));
  body.scale.x = 0.72;
  group.add(body);
  const capMat = new THREE.MeshStandardMaterial({ color: "#202024", roughness: 0.3, metalness: 0.5 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.28, 32), capMat);
  cap.position.y = 1.72;
  cap.scale.x = 0.85;
  const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 8, 24), capMat);
  ridge.rotation.x = Math.PI / 2;
  ridge.position.y = 1.64;
  ridge.scale.x = 0.85;
  group.add(cap, ridge);
  return group;
}

function attachVolume(el, model) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "vol-view";
  const root = model.object.clone();
  const bounds = new THREE.Box3().setFromObject(root);
  const center = bounds.getCenter(new THREE.Vector3());
  root.children.forEach((child) => child.position.sub(center));
  scene.add(root);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222226, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.2, 4.4, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdde7ff, 0.7);
  fill.position.set(-4, 1.5, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xfff6ee, 1.15);
  rim.position.set(-2, 3, -4);
  scene.add(rim);

  const sphere = new THREE.Box3().setFromObject(root).getBoundingSphere(new THREE.Sphere());
  camera.position.z = sphere.radius / Math.tan(THREE.MathUtils.degToRad(15)) * 1.22;
  camera.lookAt(0, 0, 0);

  const target = { x: -0.62, y: 0 };
  root.rotation.x = target.x;
  root.rotation.y = target.y;
  el.dataset.solid = "1";
  el.querySelector(".orbit-scene").appendChild(renderer.domElement);
  const card = el.querySelector(".orbit-card");
  if (card) card.style.visibility = "hidden";

  const resize = () => {
    const width = el.clientWidth || 300;
    const height = Math.max(1, el.clientHeight - 22);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width > 340 ? 1.6 : 1));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(el);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  el.addEventListener("pointermove", (event) => {
    if (!el.classList.contains("dragging")) return;
    target.y += event.movementX * 0.01;
    target.x = clamp(target.x + event.movementY * 0.008, -1.25, 0.7);
  });
  el.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.08 : 0.18;
    if (event.key === "ArrowLeft") target.y -= step;
    if (event.key === "ArrowRight") target.y += step;
    if (event.key === "ArrowUp") target.x = clamp(target.x - step, -1.25, 0.7);
    if (event.key === "ArrowDown") target.x = clamp(target.x + step, -1.25, 0.7);
  });
  el.addEventListener("dblclick", () => {
    target.x = -0.62;
    target.y = 0;
  });

  const shadow = el.querySelector(".orbit-shadow");
  return {
    draw() {
      if (!el.classList.contains("dragging")) target.y += 0.012;
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
