/* Volumen real a partir del recorte: la silueta se extruye y la etiqueta queda al frente. */
const volumeViewers = [];
const volumeModels = new Map();
let volumeJob = 0;

function releaseVolumes() {
  while (volumeViewers.length) {
    const viewer = volumeViewers.pop();
    viewer.dispose();
  }
}

function mountVolumes() {
  if (!window.THREE) return;
  const job = ++volumeJob;
  releaseVolumes();
  const nodes = [...document.querySelectorAll("[data-orbit]")];
  nodes.forEach((el, index) => {
    const img = el.querySelector("img");
    if (!img) return;
    buildVolume(img.getAttribute("src")).then((model) => {
      if (job !== volumeJob || !el.isConnected || !model) return;
      volumeViewers.push(attachVolume(el, model));
      pumpVolumes();
    }).catch(() => {});
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
  const image = await loadBitmap(src);
  const low = drawScaled(image, 220);
  const box = solidBox(low);
  if (!box) return null;
  const face = cropImage(image, box, low.width, low.height, 720);
  const contour = simplify(traceOutline(low, box));
  if (contour.length < 12) return null;
  const shape = new THREE.Shape();
  contour.forEach(([x, y], index) => {
    const px = x - box.w / 2;
    const py = box.h / 2 - y;
    if (index === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  });
  const depth = Math.max(16, box.w * 0.5);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.045,
    bevelSize: Math.min(box.w, box.h) * 0.008,
    bevelSegments: 1,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  mapVolumeUVs(geometry, box.w, box.h, depth);
  geometry.computeVertexNormals();
  const texture = new THREE.CanvasTexture(face);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 8;
  const side = roundSide(edgeColor(low, box));
  const front = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.38,
    metalness: 0.22,
    side: THREE.DoubleSide,
  });
  const wall = new THREE.MeshStandardMaterial({
    map: side,
    roughness: 0.78,
    metalness: 0.06,
    side: THREE.DoubleSide,
  });
  return { geometry, front, wall };
}

function drawScaled(image, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function solidBox(canvas) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = frame.data;
  let minX = canvas.width;
  let minY = canvas.height;
  let maxX = 0;
  let maxY = 0;
  let found = false;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (data[(y * canvas.width + x) * 4 + 3] < 28) continue;
      found = true;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (!found) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1, data, width: canvas.width };
}

function cropImage(image, box, lowW, lowH, maxSize) {
  const sx = image.width / lowW;
  const sy = image.height / lowH;
  const left = Math.max(0, Math.floor(box.x * sx));
  const top = Math.max(0, Math.floor(box.y * sy));
  const width = Math.min(image.width - left, Math.ceil(box.w * sx));
  const height = Math.min(image.height - top, Math.ceil(box.h * sy));
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  canvas.getContext("2d").drawImage(image, left, top, width, height, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function traceOutline(canvas, box) {
  const { data, width } = box;
  const solid = (x, y) => {
    if (x < box.x || y < box.y || x >= box.x + box.w || y >= box.y + box.h) return false;
    return data[(y * width + x) * 4 + 3] > 36;
  };
  let sx = -1;
  let sy = box.y;
  let best = 0;
  for (let y = box.y; y < box.y + box.h; y++) {
    let count = 0;
    let left = -1;
    for (let x = box.x; x < box.x + box.w; x++) {
      if (!solid(x, y)) continue;
      if (left < 0) left = x;
      count++;
    }
    if (count > best && left >= 0) {
      best = count;
      sx = left;
      sy = y;
    }
  }
  if (sx < 0) return [];
  const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const points = [];
  let x = sx;
  let y = sy;
  let from = 4;
  const limit = (box.w + box.h) * 8;
  for (let n = 0; n < limit; n++) {
    points.push([x - box.x, y - box.y]);
    let moved = false;
    for (let i = 0; i < 8; i++) {
      const dir = (from + 1 + i) & 7;
      const nx = x + dirs[dir][0];
      const ny = y + dirs[dir][1];
      if (!solid(nx, ny)) continue;
      x = nx;
      y = ny;
      from = (dir + 4) & 7;
      moved = true;
      break;
    }
    if (!moved || (n > 8 && x === sx && y === sy)) break;
  }
  return points;
}

function simplify(points) {
  const target = 120;
  if (points.length <= target) return points;
  const stride = points.length / target;
  const thinned = [];
  for (let i = 0; i < target; i++) thinned.push(points[Math.floor(i * stride)]);
  return thinned;
}

function mapVolumeUVs(geometry, width, height, depth) {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const index = geometry.index;
  geometry.groups.forEach((group, groupIndex) => {
    const seen = new Set();
    for (let i = group.start; i < group.start + group.count; i++) {
      const vertex = index ? index.getX(i) : i;
      if (seen.has(vertex)) continue;
      seen.add(vertex);
      if (groupIndex === 0) {
        uv.setXY(vertex, (position.getX(vertex) + width / 2) / width, (height / 2 - position.getY(vertex)) / height);
      } else {
        uv.setXY(vertex, 0.5, (position.getZ(vertex) + depth / 2) / depth);
      }
    }
  });
  uv.needsUpdate = true;
}

function edgeColor(canvas, box) {
  const { data, width } = box;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const step = 3;
  for (let y = box.y; y < box.y + box.h; y += step) {
    for (let x = box.x; x < box.x + box.w; x += step) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 40) continue;
      const edge = data[i + 3 - 4] < 28 || data[i + 7] < 28 || data[i + 3 - width * 4] < 28 || data[i + 3 + width * 4] < 28;
      if (!edge) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
  }
  if (!n) return [40, 40, 42];
  return [r / n, g / n, b / n];
}

function roundSide(rgb) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const tone = (scale) => `rgb(${rgb.map((channel) => Math.max(0, Math.min(255, Math.round(channel * scale)))).join(",")})`;
  const gradient = ctx.createLinearGradient(0, 0, 0, 64);
  gradient.addColorStop(0, tone(0.42));
  gradient.addColorStop(0.38, tone(0.92));
  gradient.addColorStop(0.62, tone(1.08));
  gradient.addColorStop(1, tone(0.36));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function attachVolume(el, model) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 2000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: el.clientWidth > 340, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "vol-view";
  const mesh = new THREE.Mesh(model.geometry, [model.front, model.wall]);
  scene.add(mesh);
  scene.add(new THREE.AmbientLight(0xffffff, 0.72));
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1c, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.45);
  key.position.set(2.4, 3.2, 4.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xfff4ea, 0.85);
  rim.position.set(-3.2, 1.4, -2.4);
  scene.add(rim);
  const brand = new THREE.DirectionalLight(0xe52c3b, 0.28);
  brand.position.set(1.5, -2, 2);
  scene.add(brand);

  const sphere = new THREE.Box3().setFromObject(mesh).getBoundingSphere(new THREE.Sphere());
  camera.position.z = sphere.radius / Math.tan(THREE.MathUtils.degToRad(14)) * 1.18;
  camera.lookAt(0, 0, 0);

  const target = { x: 0.22, y: -0.62 };
  mesh.rotation.x = target.x;
  mesh.rotation.y = target.y;
  el.dataset.solid = "1";
  el.querySelector(".orbit-scene").appendChild(renderer.domElement);
  const card = el.querySelector(".orbit-card");
  if (card) card.style.visibility = "hidden";

  const resize = () => {
    const width = el.clientWidth || 300;
    const height = Math.max(1, el.clientHeight - 22);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width > 340 ? 1.5 : 1));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(el);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const drag = (dx, dy) => {
    target.y = clamp(target.y + dx * 0.012, -1.15, 1.15);
    target.x = clamp(target.x + dy * 0.01, -0.75, 0.75);
  };
  el.addEventListener("pointermove", (event) => {
    if (!el.classList.contains("dragging")) return;
    drag(event.movementX, event.movementY);
  });
  el.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 0.06 : 0.12;
    if (event.key === "ArrowLeft") target.y = clamp(target.y - step, -1.15, 1.15);
    if (event.key === "ArrowRight") target.y = clamp(target.y + step, -1.15, 1.15);
    if (event.key === "ArrowUp") target.x = clamp(target.x - step, -0.75, 0.75);
    if (event.key === "ArrowDown") target.x = clamp(target.x + step, -0.75, 0.75);
  });
  el.addEventListener("dblclick", () => {
    target.x = 0.22;
    target.y = -0.62;
  });

  const shadow = el.querySelector(".orbit-shadow");
  return {
    draw() {
      mesh.rotation.x += (target.x - mesh.rotation.x) * 0.16;
      mesh.rotation.y += (target.y - mesh.rotation.y) * 0.16;
      if (shadow) {
        const yaw = mesh.rotation.y;
        shadow.style.transform = `translateX(${yaw * -28}px) scale(${1.05 - Math.abs(yaw) * 0.18}, 0.9)`;
      }
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
