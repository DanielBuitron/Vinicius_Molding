/* Envase en 3D con la etiqueta real de cada producto. */
const volumeViewers = [];
const volumeModels = new Map();
let volumeJob = 0;
let volumeLogo = null;
let volumeWord = null;

const PACKS = {
  "cera-fibra": { kind: "tin", accent: "#7A5CFF", body: "#121214", ink: "#f6f3ec", title: "CERA DE FIBRA", lidSub: "ACABADO FIRME", size: "150 g", hold: 4 },
  "cera-brillo": { kind: "tin", accent: "#E52C3B", body: "#121214", ink: "#f6f3ec", title: "CERA", lidSub: "MOLDEADORA  ·  BRILLO MEDIO", size: "150 g", hold: 3 },
  "pasta": { kind: "tin", accent: "#00C8C2", body: "#121214", ink: "#f6f3ec", title: "PASTA", lidSub: "MOLDEADORA  ·  BRILLANTE", size: "150 g", hold: 4 },
  "pomada": { kind: "tin", accent: "#FFD300", body: "#121214", ink: "#f6f3ec", title: "POMADA", lidSub: "MOLDEADORA  ·  MATE", size: "150 g", hold: 3 },
  "cera-kids": { kind: "tin", accent: "#FFD300", body: "#e10600", ink: "#ffffff", title: "CERA DE FIBRA", lidSub: "KIDS", size: "150 g", hold: 3, kids: true },
  "shampoo-proteccion": { kind: "pump", accent: "#E10600", body: "#f4f2ee", ink: "#171717", title: "SHAMPOO", lidSub: "PROTECCIÓN CAPILAR", size: "500 g", face: "white" },
  "shampoo-carbon": { kind: "pump", accent: "#FFD300", body: "#171717", ink: "#f4f1ea", title: "SHAMPOO", lidSub: "CARBÓN ACTIVO", size: "500 ml", face: "carbon", v: "#6a6a70" },
  "serum-barba": { kind: "dropper", accent: "#A4D800", body: "#1a1a1c", ink: "#f4f1ea", title: "SERUM", lidSub: "BARBA · BIGOTE", size: "65 ml", face: "serum" },
  "tonico": { kind: "spray", accent: "#E4C84A", body: "#12383a", ink: "#f7f4ea", title: "TÓNICO", lidSub: "ORGÁNICO", size: "65 ml", face: "tonico" },
  "ducha-intima": { kind: "tube", accent: "#8ED400", body: "#141416", ink: "#f4f1ea", title: "DUCHA ÍNTIMA", lidSub: "FOR MEN", size: "180 g", face: "tube" },
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
  const file = String(src).split("/").pop().replace(/\.(png|jpg).*$/, "");
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
  if (!volumeWord) {
    try { volumeWord = await loadBitmap("assets/logotipo-white.png"); } catch (error) { volumeWord = null; }
  }
  const pack = packFromSrc(src);
  const art = { logo: volumeLogo, word: volumeWord };
  const object = pack.kind === "tin"
    ? makeTin(pack, art)
    : pack.kind === "tube"
      ? makeTube(pack, art)
      : makeBottle(pack, art, pack.kind);
  return { object, tilt: pack.kind === "tin" ? 0.62 : 0.18 };
}

function canvasTexture(canvas, offsetX) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
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

function stripes(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 3;
  for (let i = -h; i < w + h; i += 16) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i - h * 0.55, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function lidLabel(pack, art) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 1024, 1024);
  if (pack.kids) {
    ctx.fillStyle = "#2f6fe8";
    ctx.beginPath();
    ctx.moveTo(70, 90);
    ctx.lineTo(250, 90);
    ctx.lineTo(90, 250);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(954, 934);
    ctx.lineTo(774, 934);
    ctx.lineTo(934, 774);
    ctx.closePath();
    ctx.fill();
  }
  stripes(ctx, 70, 120, 250, 780, pack.kids ? "rgba(255,255,255,0.45)" : pack.accent);
  stripes(ctx, 704, 120, 250, 780, pack.kids ? "rgba(255,255,255,0.45)" : pack.accent);
  if (art.word) ctx.drawImage(art.word, 262, 168, 500, 82);
  if (art.logo) ctx.drawImage(tinted(art.logo, pack.kids ? "#ffffff" : pack.accent, 620, 380), 202, 300, 620, 380);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 64px Outfit, sans-serif";
  ctx.fillText(pack.title, 512, 690);
  if (pack.kids) {
    const letters = [["K", "#FFD300"], ["I", "#B6E000"], ["D", "#3DB7FF"], ["S", "#7CFF6B"]];
    ctx.font = "800 78px Outfit, sans-serif";
    letters.forEach(([ch, color], index) => {
      ctx.fillStyle = color;
      ctx.fillText(ch, 360 + index * 102, 785);
    });
  } else {
    ctx.fillStyle = pack.accent;
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText(pack.lidSub, 512, 758);
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "500 22px Outfit, sans-serif";
    ctx.fillText(pack.size, 512, 804);
  }
  return canvasTexture(canvas, 0);
}

function drawSideBlock(ctx, cx, pack, art) {
  stripes(ctx, cx - 470, 18, 160, 244, pack.kids ? "rgba(255,255,255,0.55)" : pack.accent);
  if (art.logo) ctx.drawImage(tinted(art.logo, pack.kids ? "#ffffff" : pack.accent, 180, 110), cx - 430, 78, 150, 92);
  ctx.fillStyle = pack.accent;
  ctx.fillRect(cx - 250, 48, 4, 184);
  ctx.fillStyle = pack.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "600 30px Outfit, sans-serif";
  ["KERATINA", "ROMERO", "ALOE VERA"].forEach((line, index) => {
    ctx.fillText(line, cx - 220, 78 + index * 42);
  });
  const bx = cx + 90;
  ctx.fillStyle = pack.accent;
  ctx.fillRect(bx, 58, 168, 150);
  ctx.fillStyle = "#141414";
  ctx.textAlign = "center";
  ctx.font = "700 18px Outfit, sans-serif";
  ctx.fillText("A BASE", bx + 84, 100);
  ctx.fillText("DE CERA", bx + 84, 126);
  ctx.fillText("DE ABEJA", bx + 84, 152);
  ctx.textAlign = "left";
  ctx.fillStyle = pack.ink;
  ctx.font = "500 16px Outfit, sans-serif";
  ctx.fillText("Rigidez", bx + 186, 86);
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = i < pack.hold ? pack.accent : "rgba(255,255,255,0.35)";
    ctx.arc(bx + 198 + i * 24, 118, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = pack.ink;
  ctx.globalAlpha = 0.8;
  ctx.font = "500 15px Outfit, sans-serif";
  ctx.fillText("Usar en pelo", bx + 186, 156);
  ctx.fillText("seco/semi seco", bx + 186, 178);
  ctx.globalAlpha = 1;
}

function sideLabel(pack, art) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 280;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 2048, 280);
  [0, 1024, 2048].forEach((cx) => drawSideBlock(ctx, cx, pack, art));
  return canvasTexture(canvas, 0.5);
}

function makeTin(pack, art) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: "#2c2c30", roughness: 0.28, metalness: 0.72 });
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.72, 72, 1, true), new THREE.MeshStandardMaterial({
    map: sideLabel(pack, art),
    roughness: 0.46,
    metalness: 0.12,
  }));
  group.add(shell);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.16, 72, 1, true), metal);
  lid.position.y = 0.44;
  group.add(lid);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.99, 64), new THREE.MeshStandardMaterial({
    map: lidLabel(pack, art),
    roughness: 0.45,
    metalness: 0.02,
    side: THREE.DoubleSide,
  }));
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.525;
  group.add(face);
  const base = new THREE.Mesh(new THREE.CircleGeometry(0.98, 48), metal);
  base.rotation.x = Math.PI / 2;
  base.position.y = -0.361;
  group.add(base);
  [0.39, 0.44, 0.49].forEach((y) => {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1.07, 0.015, 8, 72), metal);
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
  const color = pack.v || pack.accent;
  stripes(ctx, x - w * 0.15, y, w * 1.3, w * 0.7, color);
  if (art.logo) ctx.drawImage(tinted(art.logo, color, 640, 390), x, y, w, w * 0.62);
}

function frontLabel(pack, art) {
  const { canvas, ctx } = panel(pack);
  if (pack.face === "white") {
    ctx.fillStyle = pack.ink;
    ctx.font = "800 92px Outfit, sans-serif";
    ctx.fillText("SHAMPOO", 450, 180);
    ctx.font = "600 32px Outfit, sans-serif";
    ctx.fillText("PROTECCIÓN CAPILAR", 450, 240);
    paintMark(ctx, art, pack, 175, 300, 550);
    ctx.fillStyle = pack.ink;
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText("CONTIENE EXTRACTO", 450, 760);
    ctx.font = "500 24px Outfit, sans-serif";
    ["ROMERO  ·  KERATINA", "CEBOLLA  ·  ALOE VERA", "ZANAHORIA", "ÁCIDO HIALURÓNICO"].forEach((line, index) => {
      ctx.fillText(line, 450, 810 + index * 36);
    });
    ctx.fillStyle = pack.accent;
    ctx.fillRect(300, 980, 300, 90);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 32px Outfit, sans-serif";
    ctx.fillText("SIN SAL", 450, 1025);
    ctx.fillStyle = pack.ink;
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText(pack.size, 450, 1160);
  } else if (pack.face === "carbon") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 92px Outfit, sans-serif";
    ctx.fillText("SHAMPOO", 450, 170);
    ctx.fillStyle = "#c8c8cc";
    ctx.font = "600 34px Outfit, sans-serif";
    ctx.fillText("CARBÓN ACTIVO", 450, 230);
    paintMark(ctx, art, pack, 175, 290, 550);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 32px Outfit, sans-serif";
    ctx.fillText("ADIÓS CASPA", 320, 760);
    ctx.fillText("Y PICAZÓN", 320, 800);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(520, 730, 210, 90);
    ctx.fillStyle = "#141414";
    ctx.font = "800 28px Outfit, sans-serif";
    ctx.fillText("SIN SAL", 625, 775);
    ctx.fillStyle = pack.accent;
    ctx.font = "600 24px Outfit, sans-serif";
    ctx.textAlign = "left";
    ["CONTIENE EXTRACTO", "ROMERO  ·  KERATINA", "CEBOLLA  ·  ALOE VERA", "ZANAHORIA", "ÁCIDO HIALURÓNICO"].forEach((line, index) => {
      ctx.fillText(line, 150, 900 + index * 36);
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText(pack.size, 450, 1160);
  } else if (pack.face === "tonico") {
    if (art.word) ctx.drawImage(art.word, 200, 80, 500, 82);
    paintMark(ctx, art, pack, 175, 200, 550);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 84px Outfit, sans-serif";
    ctx.fillText("TÓNICO", 450, 640);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 40px Outfit, sans-serif";
    ctx.fillText("ORGÁNICO", 450, 700);
    ctx.font = "500 22px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ["ROMERO", "ÁCIDO", "HIALURÓNICO"].forEach((line, index) => ctx.fillText(line, 180, 800 + index * 34));
    ctx.fillStyle = pack.accent;
    ["BIOTINA", "RUIBARBO", "KERATINA", "ALOE VERA"].forEach((line, index) => ctx.fillText(line, 500, 800 + index * 34));
    ctx.fillStyle = pack.accent;
    ctx.fillRect(150, 980, 600, 80);
    ctx.fillStyle = "#141414";
    ctx.textAlign = "center";
    ctx.font = "700 26px Outfit, sans-serif";
    ctx.fillText("ESTIMULANTE CON 19 ACTIVOS", 450, 1020);
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 24px Outfit, sans-serif";
    ctx.fillText("65 ml", 450, 1120);
  } else if (pack.face === "tube") {
    if (art.word) ctx.drawImage(art.word, 200, 70, 500, 82);
    paintMark(ctx, art, pack, 175, 190, 550);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 72px Outfit, sans-serif";
    ctx.fillText("DUCHA", 450, 640);
    ctx.fillText("ÍNTIMA", 450, 720);
    ctx.fillStyle = pack.accent;
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText("FOR MEN", 450, 780);
    ctx.textAlign = "left";
    ctx.font = "600 26px Outfit, sans-serif";
    ["SIN", "FRAGANCIA", "COLORANTES", "PARABENOS"].forEach((line, index) => {
      ctx.fillText(line, 250, 880 + index * 36);
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText(pack.size, 450, 1120);
  } else {
    if (art.word) ctx.drawImage(art.word, 200, 70, 500, 82);
    paintMark(ctx, art, pack, 160, 180, 580);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Outfit, sans-serif";
    ctx.fillText("SERUM", 450, 680);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 32px Outfit, sans-serif";
    ctx.fillText("BARBA  ·  BIGOTE", 450, 750);
    ctx.strokeStyle = pack.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(170, 820, 560, 120);
    ctx.font = "600 24px Outfit, sans-serif";
    ctx.fillText("CONTIENE ARGÁN,", 450, 860);
    ctx.fillText("JOJOBA, ALOE VERA", 450, 896);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "500 24px Outfit, sans-serif";
    ctx.fillText("65 ml", 450, 1020);
  }
  const texture = canvasTexture(canvas, 0);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function labelBand(pack, art, radius, height, y) {
  const arc = 2.2;
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, 64, 1, true, -arc / 2, arc),
    new THREE.MeshStandardMaterial({
      map: frontLabel(pack, art),
      roughness: 0.42,
      metalness: 0.04,
    })
  );
  mesh.position.y = y;
  const back = mesh.clone();
  back.rotation.y = Math.PI;
  return [mesh, back];
}

function makeBottle(pack, art, top) {
  const group = new THREE.Group();
  const points = [
    [0.02, 0], [0.46, 0], [0.56, 0.08], [0.58, 0.22], [0.58, 1.28],
    [0.5, 1.48], [0.34, 1.66], [0.2, 1.78], [0.2, 1.92], [0.02, 1.92],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 64), new THREE.MeshStandardMaterial({
    color: pack.body,
    roughness: pack.kind === "dropper" ? 0.2 : 0.38,
    metalness: pack.kind === "dropper" ? 0.35 : 0.08,
  }));
  group.add(body);
  labelBand(pack, art, 0.608, 0.96, 0.74).forEach((mesh) => group.add(mesh));
  const capMat = new THREE.MeshStandardMaterial({
    color: top === "pump" && pack.face === "white" ? "#f7f7f5" : "#2a2a2c",
    roughness: 0.28,
    metalness: 0.5,
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
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.28, 32), capMat);
    head.position.y = 2.2;
    group.add(collar, head);
  } else {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.32, 32), capMat);
    cap.position.y = 2.06;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), capMat);
    bulb.scale.y = 1.35;
    bulb.position.y = 2.3;
    group.add(cap, bulb);
    for (let i = 0; i < 4; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 6, 24), capMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 1.96 + i * 0.06;
      group.add(ring);
    }
  }
  return group;
}

function makeTube(pack, art) {
  const group = new THREE.Group();
  const points = [
    [0.02, 0.08], [0.34, 0], [0.42, 0.12], [0.4, 1.35], [0.36, 1.5], [0.22, 1.62], [0.02, 1.62],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 48), new THREE.MeshStandardMaterial({
    color: pack.body,
    roughness: 0.34,
    metalness: 0.22,
  }));
  body.scale.x = 0.72;
  group.add(body);
  labelBand(pack, art, 0.43, 1.05, 0.78).forEach((mesh) => {
    mesh.scale.x = 0.72;
    group.add(mesh);
  });
  const capMat = new THREE.MeshStandardMaterial({ color: "#202024", roughness: 0.3, metalness: 0.55 });
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
  camera.position.z = sphere.radius / Math.tan(THREE.MathUtils.degToRad(15)) * 1.18;
  camera.lookAt(0, 0, 0);

  const home = { x: model.tilt, y: 0 };
  const target = { x: home.x, y: home.y };
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
    target.x = home.x;
    target.y = home.y;
  });

  const shadow = el.querySelector(".orbit-shadow");
  return {
    draw() {
      if (!el.classList.contains("dragging")) target.y += 0.008;
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
