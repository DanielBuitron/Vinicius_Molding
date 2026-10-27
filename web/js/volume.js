/* Envase en 3D con la etiqueta real de cada producto. */
const volumeViewers = [];
const volumeModels = new Map();
let volumeJob = 0;
let volumeLogo = null;
let volumeWord = null;

const PACKS = {
  "cera-fibra": { kind: "tin", accent: "#7A5CFF", body: "#121214", ink: "#f6f3ec", title: "CERA DE FIBRA", lidLines: ["ACABADO HÚMEDO"], size: "150 g", hold: 4 },
  "cera-brillo": { kind: "tin", accent: "#E52C3B", body: "#121214", ink: "#f6f3ec", title: "CERA", lidLines: ["MOLDEADORA", "BRILLO MEDIO"], size: "150 g", hold: 3 },
  "pasta": { kind: "tin", accent: "#00C8C2", body: "#121214", ink: "#f6f3ec", title: "PASTA", lidLines: ["MOLDEADORA", "BRILLANTE"], size: "150 g", hold: 4 },
  "pomada": { kind: "tin", accent: "#FFD300", body: "#121214", ink: "#f6f3ec", title: "POMADA", lidLines: ["MOLDEADORA", "MATE"], size: "150 g", hold: 3 },
  "cera-kids": { kind: "tin", accent: "#FFD300", body: "#e10600", ink: "#ffffff", title: "CERA DE FIBRA", lidSub: "KIDS", size: "150 g", hold: 3, kids: true },
  "shampoo-proteccion": { kind: "pump", accent: "#E10600", body: "#f4f2ee", ink: "#171717", title: "SHAMPOO", lidSub: "PROTECCIÓN CAPILAR", size: "500 g", face: "white" },
  "shampoo-carbon": { kind: "pump", accent: "#FFD300", body: "#171717", ink: "#f4f1ea", title: "SHAMPOO", lidSub: "CARBÓN ACTIVO", size: "500 ml", face: "carbon", v: "#6a6a70" },
  "serum-barba": { kind: "dropper", accent: "#A4D800", body: "#1a1a1c", ink: "#f4f1ea", title: "SERUM", lidSub: "BARBA · BIGOTE", size: "65 ml", face: "serum" },
  "tonico": { kind: "spray", accent: "#E4C84A", body: "#101012", ink: "#f7f4ea", title: "TÓNICO", lidSub: "ORGÁNICO", size: "65 ml", face: "tonico" },
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
  return { object, tilt: pack.kind === "tin" ? 0.62 : pack.kind === "pump" ? 0.04 : 0.08 };
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

function lidLabel(pack, art) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = pack.body;
  ctx.fillRect(0, 0, 1024, 1024);
  const mark = pack.kids ? "#ffffff" : pack.accent;
  lidRays(ctx, mark);
  if (pack.kids) {
    ctx.fillStyle = "#2f6fe8";
    ctx.beginPath();
    ctx.moveTo(30, 60);
    ctx.lineTo(300, 60);
    ctx.lineTo(30, 330);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3ecf6e";
    ctx.beginPath();
    ctx.moveTo(994, 964);
    ctx.lineTo(720, 964);
    ctx.lineTo(994, 690);
    ctx.closePath();
    ctx.fill();
  }
  if (art.word) ctx.drawImage(art.word, 262, 108, 500, 82);
  if (art.logo) ctx.drawImage(stripedMark(art.logo, mark, 900, 550), 120, 188, 784, 478);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.font = pack.title.length > 8 ? "800 64px Outfit, sans-serif" : "800 96px Outfit, sans-serif";
  ctx.fillText(pack.title, 512, 520);
  if (pack.kids) {
    const letters = [["K", "#FFD300"], ["I", "#B6E000"], ["D", "#3DB7FF"], ["S", "#7CFF6B"]];
    ctx.font = "800 84px Outfit, sans-serif";
    letters.forEach(([ch, color], index) => {
      ctx.fillStyle = color;
      ctx.fillText(ch, 348 + index * 110, 640);
    });
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "600 22px Outfit, sans-serif";
    ctx.fillText(pack.size, 512, 730);
  } else {
    ctx.textAlign = "left";
    ctx.fillStyle = pack.accent;
    ctx.font = "700 24px Outfit, sans-serif";
    (pack.lidLines || []).forEach((line, index) => ctx.fillText(line, 548, 590 + index * 30));
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 20px Outfit, sans-serif";
    ctx.fillText(pack.size, 300, 600);
  }
  return canvasTexture(canvas, 0);
}

function drawSideBlock(ctx, cx, pack, art) {
  const color = pack.kids ? "#ffffff" : pack.accent;
  if (art.logo) ctx.drawImage(stripedMark(art.logo, color, 360, 220), cx - 500, 30, 210, 128);
  ctx.fillStyle = color;
  ctx.fillRect(cx - 270, 48, 4, 184);
  ctx.fillStyle = pack.ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "700 28px Outfit, sans-serif";
  ["KERATINA", "ROMERO", "ALOE VERA"].forEach((line, index) => {
    ctx.fillText(line, cx - 246, 86 + index * 40);
  });
  const bx = cx + 70;
  ctx.fillStyle = color;
  ctx.fillRect(bx, 46, 176, 176);
  ctx.save();
  ctx.translate(bx + 88, 78);
  ctx.strokeStyle = "#141414";
  ctx.fillStyle = "#141414";
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
  ctx.fillStyle = "#141414";
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
  const skirt = flutedCollar(1.045, 0.2, 48, 0.014, metal);
  skirt.position.y = 0.42;
  group.add(skirt);
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
  const h = Math.round(w * 0.61);
  if (art.logo) ctx.drawImage(stripedMark(art.logo, color, 900, 550), x, y, w, h);
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
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(360, 1025, 18, 0, Math.PI * 2);
    ctx.moveTo(348, 1013);
    ctx.lineTo(372, 1037);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 32px Outfit, sans-serif";
    ctx.fillText("SIN SAL", 490, 1028);
    ctx.fillStyle = pack.ink;
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText(pack.size, 450, 1160);
  } else if (pack.face === "carbon") {
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 96px Outfit, sans-serif";
    ctx.fillText("SHAMPOO", 450, 150);
    ctx.fillStyle = "#b7b7be";
    ctx.font = "650 36px Outfit, sans-serif";
    ctx.fillText("CARBÓN ACTIVO", 450, 210);
    paintMark(ctx, art, pack, 130, 250, 640);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 30px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ADIÓS CASPA", 120, 820);
    ctx.fillText("Y PICAZÓN", 120, 858);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(520, 790, 250, 90);
    ctx.strokeStyle = "#141414";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(575, 835, 16, 0, Math.PI * 2);
    ctx.moveTo(564, 824);
    ctx.lineTo(586, 846);
    ctx.stroke();
    ctx.fillStyle = "#141414";
    ctx.font = "800 26px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SIN SAL", 680, 838);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 24px Outfit, sans-serif";
    ctx.textAlign = "left";
    ["CONTIENE EXTRACTO", "ROMERO  ·  KERATINA", "CEBOLLA  ·  ALOE VERA", "ZANAHORIA", "ÁCIDO HIALURÓNICO"].forEach((line, index) => {
      ctx.fillText(line, 140, 960 + index * 34);
    });
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText(pack.size, 450, 1180);
  } else if (pack.face === "tube") {
    if (art.word) ctx.drawImage(art.word, 210, 36, 480, 78);
    paintMark(ctx, art, pack, 120, 120, 660);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 84px Outfit, sans-serif";
    ctx.fillText("DUCHA", 450, 640);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 72px Outfit, sans-serif";
    ctx.fillText("ÍNTIMA", 450, 716);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 28px Outfit, sans-serif";
    ctx.fillText("FOR MEN", 450, 770);
    ctx.fillStyle = pack.accent;
    ctx.font = "800 88px Outfit, sans-serif";
    ctx.fillText("0", 230, 980);
    ctx.font = "700 22px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Z", 290, 930);
    ctx.fillText("H", 290, 962);
    ctx.fillStyle = "#ffffff";
    ctx.font = "650 28px Outfit, sans-serif";
    ["FRAGANCIA", "COLORANTES", "PARABENOS"].forEach((line, index) => ctx.fillText(line, 360, 910 + index * 38));
    ctx.textAlign = "center";
    ctx.font = "600 26px Outfit, sans-serif";
    ctx.fillText("| 180 g |", 450, 1120);
  } else if (pack.face === "tonico") {
    ctx.fillStyle = "#0e3f42";
    ctx.fillRect(0, 0, 900, 1400);
    if (art.word) ctx.drawImage(art.word, 200, 80, 500, 82);
    paintMark(ctx, art, pack, 175, 200, 550);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 92px Outfit, sans-serif";
    ctx.fillText("TÓNICO", 450, 620);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 42px Outfit, sans-serif";
    ctx.fillText("ORGÁNICO", 450, 680);
    ctx.font = "600 20px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("CONTIENE", 150, 760);
    ["ROMERO", "ÁCIDO", "HIALURÓNICO"].forEach((line, index) => ctx.fillText(line, 150, 800 + index * 32));
    ctx.fillStyle = pack.accent;
    ["BIOTINA", "RUIBARBO", "KERATINA", "ALOE VERA"].forEach((line, index) => ctx.fillText(line, 500, 760 + index * 32));
    ctx.fillStyle = pack.accent;
    ctx.fillRect(120, 960, 660, 78);
    ctx.fillStyle = "#142018";
    ctx.textAlign = "center";
    ctx.font = "800 26px Outfit, sans-serif";
    ctx.fillText("ESTIMULANTE CON 19 ACTIVOS", 450, 1000);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 24px Outfit, sans-serif";
    ctx.fillText("2.3 FL Oz  /  65 mL", 450, 1100);
  } else {
    if (art.word) ctx.drawImage(art.word, 200, 70, 500, 82);
    paintMark(ctx, art, pack, 160, 180, 580);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 100px Outfit, sans-serif";
    ctx.fillText("SERUM", 450, 660);
    ctx.fillStyle = pack.accent;
    ctx.font = "700 30px Outfit, sans-serif";
    ctx.fillText("BARBA  ·  BIGOTE", 450, 720);
    ctx.fillStyle = pack.accent;
    ctx.fillRect(145, 780, 610, 130);
    ctx.fillStyle = "#141414";
    ctx.font = "700 26px Outfit, sans-serif";
    ctx.fillText("CONTIENE ARGÁN,", 450, 824);
    ctx.fillText("JOJOBA, ALOE VERA", 450, 862);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "600 24px Outfit, sans-serif";
    ctx.fillText("2.3 FL Oz  /  65 mL", 450, 980);
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

function addPump(group, mat) {
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.06, 48), mat);
  lip.position.y = 3.66;
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.34, 56), mat);
  collar.position.y = 3.84;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.175, 0.46, 40), mat);
  head.position.y = 4.22;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.155, 0.07, 32), mat);
  crown.position.y = 4.46;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.068, 0.7, 24), mat);
  nozzle.scale.z = 0.48;
  nozzle.rotation.z = -Math.PI / 2 - 0.38;
  nozzle.position.set(0.32, 4.36, 0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), mat);
  tip.scale.set(1.15, 0.5, 0.48);
  tip.position.set(0.62, 4.18, 0);
  const joint = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), mat);
  joint.scale.set(1, 0.55, 0.6);
  joint.position.set(0.08, 4.46, 0);
  group.add(lip, collar, head, crown, nozzle, tip, joint);
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

function addSpray(group, mat) {
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.12, 48), mat);
  neck.position.y = 2.24;
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.04, 40), mat);
  seat.position.y = 2.32;
  const collar = flutedCollar(0.2, 0.5, 24, 0.016, mat);
  collar.position.y = 2.58;
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.06, 32), mat);
  crown.position.y = 2.84;
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.2, 28), mat);
  head.position.y = 2.96;
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.038, 0.26, 16), mat);
  nozzle.rotation.z = -Math.PI / 2 - 0.42;
  nozzle.position.set(0.1, 2.94, 0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), mat);
  tip.scale.set(1.5, 0.65, 0.65);
  tip.position.set(0.2, 2.84, 0);
  group.add(neck, seat, collar, crown, head, nozzle, tip);
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#f7f8fb",
    roughness: 0.02,
    metalness: 0,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const shroud = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.162, 0.7, 40, 1, true), glass);
  shroud.position.y = 3.12;
  shroud.renderOrder = 2;
  const lid = new THREE.Mesh(new THREE.CircleGeometry(0.155, 40), glass);
  lid.rotation.x = -Math.PI / 2;
  lid.position.y = 3.47;
  lid.renderOrder = 2;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.012, 8, 40), glass);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.78;
  rim.renderOrder = 2;
  const rimTop = rim.clone();
  rimTop.position.y = 3.47;
  group.add(shroud, lid, rim, rimTop);
}

function addDropper(group) {
  const metal = new THREE.MeshPhysicalMaterial({
    color: "#3a3c42",
    roughness: 0.32,
    metalness: 0.72,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
  });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.1, 36), metal);
  neck.position.y = 2.46;
  const cap = flutedCollar(0.17, 0.5, 22, 0.013, metal);
  cap.position.y = 2.76;
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.17, 0.04, 32), metal);
  lip.position.y = 3.02;
  const rubber = new THREE.MeshPhysicalMaterial({
    color: "#101012",
    roughness: 0.48,
    metalness: 0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  });
  const bulb = new THREE.Mesh(new THREE.LatheGeometry([
    [0.055, 0], [0.1, 0.04], [0.145, 0.14], [0.16, 0.26], [0.14, 0.38], [0.09, 0.46], [0.04, 0.5], [0.012, 0.52],
  ].map(([x, y]) => new THREE.Vector2(x, y)), 40), rubber);
  bulb.position.y = 3.0;
  const shine = new THREE.Mesh(
    new THREE.TorusGeometry(0.6, 0.012, 8, 48),
    new THREE.MeshPhysicalMaterial({ color: "#9aa0aa", roughness: 0.15, metalness: 0.6 })
  );
  shine.rotation.x = Math.PI / 2;
  shine.position.y = 2.18;
  group.add(neck, cap, lip, bulb, shine);
}

function makeBottle(pack, art, top) {
  const group = new THREE.Group();
  const pump = top === "pump";
  const points = (pump
    ? [
      [0.02, 0], [0.18, 0], [0.52, 0.05], [0.62, 0.14], [0.66, 0.3], [0.66, 2.35],
      [0.63, 2.62], [0.56, 2.9], [0.46, 3.16], [0.34, 3.38], [0.26, 3.54], [0.24, 3.64], [0.02, 3.64],
    ]
    : top === "spray"
      ? [
        [0.02, 0], [0.5, 0], [0.62, 0.04], [0.66, 0.12], [0.66, 1.7],
        [0.62, 1.86], [0.5, 2.0], [0.34, 2.12], [0.26, 2.18], [0.02, 2.18],
      ]
      : top === "dropper"
        ? [
          [0.02, 0], [0.48, 0], [0.58, 0.03], [0.6, 0.1], [0.6, 2.05],
          [0.55, 2.16], [0.38, 2.26], [0.2, 2.36], [0.14, 2.42], [0.02, 2.42],
        ]
        : [
          [0.02, 0], [0.46, 0], [0.56, 0.08], [0.58, 0.22], [0.58, 1.28],
          [0.5, 1.48], [0.34, 1.66], [0.2, 1.78], [0.2, 1.92], [0.02, 1.92],
        ]
  ).map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 80), top === "dropper"
    ? new THREE.MeshPhysicalMaterial({
      color: "#16181e",
      roughness: 0.02,
      metalness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.8,
    })
    : new THREE.MeshPhysicalMaterial({
      color: pack.body,
      roughness: pump && pack.face === "white" ? 0.16 : top === "spray" ? 0.16 : 0.28,
      metalness: top === "spray" ? 0.08 : 0,
      clearcoat: top === "spray" ? 0.85 : 0.3,
      clearcoatRoughness: top === "spray" ? 0.08 : 0.22,
    }));
  group.add(body);
  if (pump) labelBand(pack, art, 0.685, 1.85, 1.28).forEach((mesh) => group.add(mesh));
  else if (top === "spray") labelBand(pack, art, 0.685, 1.38, 0.92).forEach((mesh) => group.add(mesh));
  else if (top === "dropper") labelBand(pack, art, 0.625, 1.55, 1.12).forEach((mesh) => group.add(mesh));
  else labelBand(pack, art, 0.608, 0.96, 0.74).forEach((mesh) => group.add(mesh));
  const capMat = new THREE.MeshPhysicalMaterial({
    color: pump && pack.face === "white" ? "#f7f6f3" : "#161618",
    roughness: pump && pack.face === "white" ? 0.18 : 0.3,
    metalness: pump && pack.face === "white" ? 0 : 0.2,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
  });
  if (pump) {
    addPump(group, capMat);
  } else if (top === "spray") {
    addSpray(group, capMat);
  } else {
    addDropper(group);
  }
  return group;
}

function makeTube(pack, art) {
  const group = new THREE.Group();
  const points = [
    [0.02, 0.26], [0.2, 0.2], [0.32, 0.34], [0.38, 0.55],
    [0.38, 1.52], [0.28, 1.66], [0.08, 1.76], [0.02, 1.76],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const body = new THREE.Mesh(new THREE.LatheGeometry(points, 48), new THREE.MeshPhysicalMaterial({
    color: "#16161a",
    roughness: 0.2,
    metalness: 0.4,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
  }));
  body.scale.x = 0.58;
  group.add(body);
  labelBand(pack, art, 0.4, 1.2, 1.02).forEach((mesh) => {
    mesh.scale.x = 0.58;
    group.add(mesh);
  });
  const capMat = new THREE.MeshStandardMaterial({ color: "#101012", roughness: 0.32, metalness: 0.45 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.28, 28), capMat);
  cap.position.y = 0.1;
  cap.scale.x = 0.72;
  const crimp = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.1), capMat);
  crimp.position.y = 1.78;
  group.add(cap, crimp);
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
