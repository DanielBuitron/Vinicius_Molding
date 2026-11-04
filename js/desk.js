/* Home Vinicius: escena 3D WebGL tipo lamplit (mesa + libro + luz). */
(function (global) {
  let raf = 0;
  let bound = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let book = null;
  let coverPivot = null;
  let pages = [];
  let lamp = null;
  let targetProg = 0;
  let currentProg = 0;
  let mx = 0;
  let my = 0;
  let pageCount = 6;
  let textures = [];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function destroyDesk() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (bound) {
      window.removeEventListener("scroll", bound.onScroll, { passive: true });
      window.removeEventListener("resize", bound.onResize);
      if (bound.pin) {
        bound.pin.removeEventListener("pointermove", bound.onMove);
        bound.pin.removeEventListener("pointerleave", bound.onLeave);
      }
      bound = null;
    }
    if (renderer) {
      try {
        renderer.dispose();
        const el = renderer.domElement;
        if (el && el.parentNode) el.parentNode.removeChild(el);
      } catch (err) { /* ignore */ }
      renderer = null;
    }
    textures.forEach((t) => { try { t.dispose(); } catch (e) { /* */ } });
    textures = [];
    scene = null;
    camera = null;
    book = null;
    coverPivot = null;
    pages = [];
    lamp = null;
  }

  function readProgress(rail) {
    if (!rail) return 0;
    const total = Math.max(1, rail.offsetHeight - window.innerHeight);
    const scrolled = clamp(window.scrollY || document.documentElement.scrollTop || 0, 0, total);
    return scrolled / total;
  }

  function loadTexture(url) {
    return new Promise((resolve) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          textures.push(tex);
          resolve(tex);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  function makePageCanvas(spec) {
    const w = 1024;
    const h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const light = !!spec.light;
    ctx.fillStyle = light ? "#eceae4" : "#0c0c0e";
    ctx.fillRect(0, 0, w, h);
    // paper grain noise
    const img = ctx.getImageData(0, 0, w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (Math.random() * 18) | 0;
      img.data[i] = clamp(img.data[i] + n - 9, 0, 255);
      img.data[i + 1] = clamp(img.data[i + 1] + n - 9, 0, 255);
      img.data[i + 2] = clamp(img.data[i + 2] + n - 9, 0, 255);
    }
    ctx.putImageData(img, 0, 0);

    const accent = spec.accent || "#E52C3B";
    ctx.fillStyle = accent;
    ctx.font = "600 28px Outfit, Poppins, sans-serif";
    ctx.fillText((spec.kicker || "").toUpperCase(), 72, 88);

    ctx.fillStyle = light ? "#111114" : "#f4f1ea";
    ctx.font = "600 78px Outfit, Poppins, sans-serif";
    const lines = String(spec.title || "").split("\n");
    lines.forEach((line, i) => ctx.fillText(line, 72, 190 + i * 88));

    ctx.fillStyle = light ? "rgba(17,17,20,0.62)" : "rgba(244,241,234,0.62)";
    ctx.font = "400 30px Poppins, sans-serif";
    wrapText(ctx, spec.text || "", 72, 190 + lines.length * 88 + 28, 520, 40);

    if (spec.note) {
      ctx.fillStyle = light ? "rgba(17,17,20,0.4)" : "rgba(244,241,234,0.4)";
      ctx.font = "500 22px Poppins, sans-serif";
      ctx.fillText(String(spec.note).toUpperCase(), 72, h - 56);
    }
    return c;
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(" ");
    let line = "";
    let yy = y;
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW) {
        ctx.fillText(line, x, yy);
        line = word;
        yy += lineH;
      } else line = test;
    });
    if (line) ctx.fillText(line, x, yy);
  }

  function canvasTex(canvas) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    textures.push(tex);
    return tex;
  }

  function deskPages() {
    const products = (global.VM && VM.products) || [];
    const by = (id) => products.find((p) => p.id === id);
    const n = products.length || 14;
    return [
      { kicker: "La casa", title: "Somos la\nsoluci\u00f3n.", text: "No el problema. Cuidado capilar masculino hecho en Cali.", light: true, accent: "#E52C3B", note: `${n} piezas` },
      { kicker: "Línea Molding", title: "Cada capa\ncuenta.", text: "Ceras, pasta y pomada para armar el peinado.", accent: "#E52C3B", item: by("cera-brillo") },
      { kicker: "Fibra", title: "Textura\nviva.", text: "Agarre y volumen sin peso.", accent: "#7B2CBF", item: by("cera-fibra") },
      { kicker: "Pasta", title: "Mate\ndefinido.", text: "Acabado seco para peinados diarios.", light: true, accent: "#00C8C2", item: by("pasta") },
      { kicker: "Ingeniería", title: "Una pieza\nde oficio.", text: "Minoxidil, pantenol y romero a base de cera de abeja.", accent: "#00C8C2", item: by("pasta-minoxidil") },
      { kicker: "Acabado", title: "Canas bajo\ncontrol.", text: "Acabado h\u00famedo brillante.", light: true, accent: "#E52C3B", item: by("gel-cubre-canas") },
      { kicker: "Tratamiento", title: "T\u00f3nico\norg\u00e1nico.", text: "19 activos para el cuero cabelludo.", accent: "#00C8C2", item: by("tonico") },
      { kicker: "Barba", title: "Serum vivo\nen la mesa.", text: "Arg\u00e1n, jojoba y aloe vera.", light: true, accent: "#A4D800", item: by("serum-barba") },
      { kicker: "Limpieza", title: "Sin sal.\nCon oficio.", text: "Protecci\u00f3n capilar diaria.", accent: "#E52C3B", item: by("shampoo-proteccion") },
      { kicker: "Cuerpo", title: "Ducha \u00edntima\nfor men.", text: "Sin fragancia ni parabenos.", light: true, accent: "#FFD300", item: by("ducha-intima") },
      { kicker: "Splash", title: "Body splash\nfor men.", text: "Eucalipto y mentol. 250 ml.", accent: "#A4D800", item: by("splash") },
      { kicker: "Cat\u00e1logo", title: "Toda la l\u00ednea\nen un clic.", text: "Abre el cat\u00e1logo y elige la pieza.", light: true, accent: "#E52C3B", note: "Ver cat\u00e1logo" },
    ];
  }

  function makeBook(pageSpecs) {
    const group = new THREE.Group();
    const bw = 2.55;
    const bh = 1.62;
    const thick = 0.045;

    // block / pages stack
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(bw * 0.98, thick, bh * 0.98),
      new THREE.MeshStandardMaterial({ color: "#d8d4cc", roughness: 0.85, metalness: 0.02 })
    );
    block.position.y = thick / 2;
    group.add(block);

    // back cover
    const back = new THREE.Mesh(
      new THREE.BoxGeometry(bw, 0.02, bh),
      new THREE.MeshStandardMaterial({ color: "#0a0a0c", roughness: 0.55, metalness: 0.08 })
    );
    back.position.y = 0.008;
    group.add(back);

    // cover pivot at spine (left edge); opens by rotating around Z
    coverPivot = new THREE.Group();
    coverPivot.position.set(-bw / 2, thick + 0.014, 0);
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(bw, 0.03, bh),
      new THREE.MeshStandardMaterial({ color: "#101012", roughness: 0.48, metalness: 0.12 })
    );
    cover.position.x = bw / 2;
    coverPivot.add(cover);

    const logoCanvas = document.createElement("canvas");
    logoCanvas.width = 1024;
    logoCanvas.height = 640;
    const lctx = logoCanvas.getContext("2d");
    lctx.fillStyle = "#0e0e10";
    lctx.fillRect(0, 0, 1024, 640);
    lctx.fillStyle = "#E52C3B";
    lctx.beginPath();
    lctx.moveTo(512, 200);
    lctx.lineTo(560, 280);
    lctx.lineTo(464, 280);
    lctx.closePath();
    lctx.fill();
    lctx.fillStyle = "#f4f1ea";
    lctx.font = "600 54px Outfit, Poppins, sans-serif";
    lctx.textAlign = "center";
    lctx.fillText("VINICIUS", 512, 340);
    lctx.font = "400 28px Poppins, sans-serif";
    lctx.fillStyle = "rgba(244,241,234,0.72)";
    lctx.fillText("MOLDING", 512, 386);
    const logoFlat = new THREE.Mesh(
      new THREE.PlaneGeometry(bw * 0.88, bh * 0.78),
      new THREE.MeshStandardMaterial({ map: canvasTex(logoCanvas), roughness: 0.55, metalness: 0.04 })
    );
    logoFlat.rotation.x = -Math.PI / 2;
    logoFlat.position.set(bw / 2, 0.017, 0);
    coverPivot.add(logoFlat);
    group.add(coverPivot);

    // pages as left/right spreads that turn
    pages = [];
    const spreads = [];
    for (let i = 0; i < pageSpecs.length; i += 2) {
      spreads.push([pageSpecs[i], pageSpecs[i + 1] || pageSpecs[i]]);
    }
    pageCount = spreads.length;

    spreads.forEach((pair, idx) => {
      const pivot = new THREE.Group();
      pivot.position.set(0, thick + 0.014 + idx * 0.0004, 0);

      const leftCanvas = makePageCanvas(pair[0]);
      const rightCanvas = makePageCanvas(pair[1]);
      const leftTex = canvasTex(leftCanvas);
      const rightTex = canvasTex(rightCanvas);

      const left = new THREE.Mesh(
        new THREE.PlaneGeometry(bw / 2 - 0.02, bh - 0.04),
        new THREE.MeshStandardMaterial({ map: leftTex, roughness: 0.78, metalness: 0, side: THREE.DoubleSide })
      );
      left.rotation.x = -Math.PI / 2;
      left.position.set(-bw / 4, 0, 0);

      const right = new THREE.Mesh(
        new THREE.PlaneGeometry(bw / 2 - 0.02, bh - 0.04),
        new THREE.MeshStandardMaterial({ map: rightTex, roughness: 0.78, metalness: 0, side: THREE.DoubleSide })
      );
      right.rotation.x = -Math.PI / 2;
      right.position.set(bw / 4, 0, 0);

      // turning leaf (right half of previous / left of next) — we flip whole spread as one leaf from right
      const leafPivot = new THREE.Group();
      leafPivot.position.set(0, 0.001, 0);
      const leaf = new THREE.Mesh(
        new THREE.PlaneGeometry(bw / 2 - 0.02, bh - 0.04),
        new THREE.MeshStandardMaterial({
          map: rightTex,
          roughness: 0.78,
          metalness: 0,
          side: THREE.DoubleSide,
        })
      );
      leaf.rotation.x = -Math.PI / 2;
      leaf.position.set(bw / 4, 0, 0);
      leafPivot.add(leaf);

      pivot.add(left);
      pivot.add(right);
      pivot.add(leafPivot);
      pivot.visible = idx === 0;
      pages.push({ pivot, leafPivot, left, right });
      group.add(pivot);
    });

    // soft contact shadow
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(bw * 1.15, bh * 1.2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    group.add(shadow);

    group.rotation.y = -0.06;
    group.position.set(0.05, 0, 0.05);
    return group;
  }

  function makeBillboard(tex, w, h, x, z, rotY) {
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      roughness: 0.7,
      metalness: 0,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotY || 0;
    mesh.position.set(x, 0.03, z);
    return mesh;
  }

  async function makeCoffee() {
    const tex = await loadTexture("assets/prop-coffee.png?v=200");
    if (!tex) return new THREE.Group();
    return makeBillboard(tex, 0.95, 0.95, 1.9, -0.55, 0.12);
  }

  async function makePencil() {
    const tex = await loadTexture("assets/prop-stylus.png?v=200");
    if (!tex) return new THREE.Group();
    const mesh = makeBillboard(tex, 0.22, 0.75, -1.75, 0.9, -0.9);
    return mesh;
  }

  function makePlant() {
    const g = new THREE.Group();
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.1, 0.14, 24),
      new THREE.MeshStandardMaterial({ color: "#1c1c1e", roughness: 0.6 })
    );
    pot.position.y = 0.07;
    const soil = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 24),
      new THREE.MeshStandardMaterial({ color: "#2a1a12", roughness: 1 })
    );
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.14;
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 10),
        new THREE.MeshStandardMaterial({ color: "#3d7a4a", roughness: 0.65 })
      );
      const a = (i / 7) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.06, 0.22 + (i % 3) * 0.03, Math.sin(a) * 0.06);
      leaf.scale.set(1, 0.55, 0.8);
      g.add(leaf);
    }
    g.add(pot, soil);
    g.position.set(-1.9, 0.02, -0.7);
    return g;
  }

  async function buildScene(canvas, woodUrl) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#050302");
    scene.fog = new THREE.FogExp2(0x050302, 0.045);

    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.set(0, 4.6, 3.4);
    camera.lookAt(0, 0, 0.1);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const amb = new THREE.AmbientLight(0x3a2e24, 0.35);
    scene.add(amb);
    const hemi = new THREE.HemisphereLight(0xffe6c8, 0x0a0806, 0.55);
    scene.add(hemi);

    lamp = new THREE.SpotLight(0xffd7a8, 28, 18, Math.PI / 5.2, 0.55, 1.2);
    lamp.position.set(0.2, 5.2, 0.4);
    lamp.target.position.set(0.05, 0, 0.05);
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(2048, 2048);
    lamp.shadow.bias = -0.0002;
    scene.add(lamp);
    scene.add(lamp.target);

    const fill = new THREE.DirectionalLight(0x6a7a9a, 0.25);
    fill.position.set(-4, 3, -2);
    scene.add(fill);

    const woodTex = await loadTexture(woodUrl);
    if (woodTex) {
      woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
      woodTex.repeat.set(2.2, 2.2);
    }
    const deskMat = new THREE.MeshStandardMaterial({
      map: woodTex || null,
      color: woodTex ? 0xffffff : 0x2a1a12,
      roughness: 0.55,
      metalness: 0.04,
    });
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.receiveShadow = true;
    scene.add(desk);

    book = makeBook(deskPages());
    book.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    scene.add(book);

    const coffee = await makeCoffee();
    coffee.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(coffee);

    const pencil = await makePencil();
    pencil.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
    scene.add(pencil);

    const plant = makePlant();
    plant.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    scene.add(plant);

    // business cards
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.01, 0.32),
      new THREE.MeshStandardMaterial({ color: "#111114", roughness: 0.5 })
    );
    card.position.set(1.65, 0.02, 0.55);
    card.rotation.y = 0.2;
    card.castShadow = true;
    scene.add(card);
    const card2 = card.clone();
    card2.position.set(1.72, 0.025, 0.62);
    card2.rotation.y = 0.35;
    scene.add(card2);

    return true;
  }

  function resize() {
    if (!renderer || !camera || !bound) return;
    const pin = bound.pin;
    const w = pin.clientWidth || window.innerWidth;
    const h = pin.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function applyProgress(p) {
    const openT = clamp(p / 0.16, 0, 1);
    const ease = openT < 0.5 ? 2 * openT * openT : 1 - Math.pow(-2 * openT + 2, 2) / 2;
    if (coverPivot) coverPivot.rotation.z = Math.PI * 0.98 * ease;

    const pageT = clamp((p - 0.18) / 0.78, 0, 1);
    const idx = clamp(Math.floor(pageT * pageCount), 0, Math.max(0, pageCount - 1));
    const local = clamp(pageT * pageCount - idx, 0, 1);

    pages.forEach((pg, i) => {
      pg.pivot.visible = i === idx || (i === idx - 1 && local < 0.02);
      if (i === idx) {
        pg.pivot.visible = true;
        pg.leafPivot.rotation.z = Math.PI * local * 0.92;
        pg.right.visible = local < 0.55;
      } else if (i < idx) {
        pg.pivot.visible = false;
        pg.leafPivot.rotation.z = Math.PI * 0.92;
      } else {
        pg.pivot.visible = false;
        pg.leafPivot.rotation.z = 0;
      }
    });
    if (pages[idx]) pages[idx].pivot.visible = true;

    if (bound && bound.intro) {
      const fade = 1 - clamp(p / 0.12, 0, 1);
      bound.intro.style.opacity = fade.toFixed(3);
      bound.intro.style.transform = `translate3d(0, ${(1 - fade) * -20}px, 0)`;
    }
    if (bound && bound.hint) {
      bound.hint.style.opacity = (p < 0.08 ? 1 : clamp(1 - (p - 0.08) / 0.12, 0, 1)).toFixed(3);
      bound.hint.textContent = openT < 0.55 ? "Desliza para abrir" : "Sigue deslizando";
    }
  }

  function tick() {
    currentProg += (targetProg - currentProg) * 0.12;
    if (Math.abs(targetProg - currentProg) < 0.0003) currentProg = targetProg;
    applyProgress(currentProg);

    if (camera) {
      const base = new THREE.Vector3(0.05 + mx * 0.22, 4.55 + my * -0.12, 3.35 + my * 0.15);
      camera.position.lerp(base, 0.08);
      camera.lookAt(0.05 + mx * 0.08, 0.05, 0.05 + my * 0.05);
    }
    if (lamp) {
      lamp.intensity = 26 + Math.sin(performance.now() * 0.0012) * 0.8;
    }
    if (renderer && scene && camera) renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function mountDesk() {
    destroyDesk();
    if (!global.THREE) return;
    const pin = document.querySelector("[data-desk3d]");
    const rail = document.querySelector(".desk3d-rail");
    const canvasHost = document.querySelector("[data-desk3d-canvas]");
    if (!pin || !rail || !canvasHost) return;

    const canvas = document.createElement("canvas");
    canvasHost.appendChild(canvas);

    const intro = pin.querySelector("[data-desk-intro]");
    const hint = pin.querySelector("[data-desk-hint]");

    const onScroll = () => { targetProg = readProgress(rail); };
    const onResize = () => { resize(); onScroll(); };
    const onMove = (e) => {
      const rect = pin.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => { mx = 0; my = 0; };

    bound = { pin, rail, intro, hint, onScroll, onResize, onMove, onLeave };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    pin.addEventListener("pointermove", onMove);
    pin.addEventListener("pointerleave", onLeave);

    buildScene(canvas, "assets/desk-wood.jpg?v=200").then(() => {
      resize();
      targetProg = readProgress(rail);
      currentProg = targetProg;
      applyProgress(currentProg);
      raf = requestAnimationFrame(tick);
    });
  }

  global.mountDesk = mountDesk;
  global.destroyDesk = destroyDesk;
})(window);
