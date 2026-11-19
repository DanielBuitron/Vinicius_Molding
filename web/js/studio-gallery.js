const STUDIO_GALLERY_VIEWS = {
  dermaroller: [["dermaroller-reverso", "rear"], ["dermaroller-caja", "pack"], ["dermaroller-perfil", "side"]],
  "lapiz-para-barba": [["lapiz-contenido", "contents"], ["lapiz-caja", "pack"]],
  "patillera-amarilla": [["patillera-amarilla-lateral", "side"], ["patillera-amarilla-frente", "detail"], ["patillera-accesorios", "contents"]],
  "patillera-azul": [["patillera-azul-lateral", "side"], ["patillera-azul-reverso", "rear"], ["patillera-accesorios", "contents"]],
  "patillera-plateada": [["patillera-plateada-lateral", "side"], ["patillera-plateada-reverso", "rear"], ["patillera-accesorios", "contents"]],
  "soplador-200w": [["soplador-accesorios", "contents"], ["soplador-estuche", "pack"], ["soplador-perfil", "rear"]],
  "tapete-con-iman-tijeras": [["tapete-tijeras-real", "original"], ["tapete-tijeras-detalle", "detail"]],
  "tapete-con-iman-barber": [["tapete-barber-real", "original"], ["tapete-barber-detalle", "detail"]],
  "tapete-sin-iman-barbershop": [["tapete-barbershop-real", "original"], ["tapete-barbershop-detalle", "detail"]],
  "porta-cuallero": [["porta-cuallero-cerrado", "detail"], ["porta-cuallero-inclinado", "side"]],
  "cuadro-redondo-barbershop": [["cuadro-barbershop-real", "original"], ["cuadro-barbershop-detalle", "detail"]],
  "cuadro-redondo-closed": [["cuadro-closed-real", "original"], ["cuadro-closed-detalle", "detail"]],
  "kit-12-5": [["kit-12-5-original", "original"], ["minoxidil-12-5-caja", "pack"], ["dermaroller-perfil", "detail"]],
  "kit-capilar": [["kit-capilar-original", "original"], ["shampoo-proteccion-caja", "pack"], ["minoxidil-12-5-caja", "detail"]],
  "kit-capilar-avanzado": [["kit-capilar-avanzado-original", "original"], ["minoxidil-23-caja", "pack"], ["dermaroller-perfil", "detail"]],
  "kit-capilar-avanzado-plus": [["kit-capilar-avanzado-plus-original", "original"], ["shampoo-proteccion-caja", "pack"], ["minoxidil-23-caja", "detail"]],
  "kit-capilar-completo": [["kit-capilar-completo-original", "original"], ["shampoo-proteccion-caja", "pack"], ["minoxidil-12-5-caja", "detail"]],
  "kit-crecimiento-23": [["kit-crecimiento-23-original", "original"], ["shampoo-proteccion-caja", "pack"], ["minoxidil-23-caja", "detail"]],
  "kit-organico": [["kit-organico-original", "original"], ["tonico-organico-caja", "pack"], ["dermaroller-perfil", "detail"]],
  "kit-organico-avanzado": [["kit-organico-avanzado-original", "original"], ["tonico-organico-caja", "pack"], ["tonico-organico-reverso", "rear"]],
  "kit-restaurador": [["kit-restaurador-original", "original"], ["shampoo-proteccion-caja", "pack"], ["tonico-organico-caja", "detail"]],
  "coleccion-moldeadores": [["coleccion-moldeadores-original", "original"], ["coleccion-moldeadores-lateral", "side"]],
  "ducha-intima-y-cera-fibra": [["ducha-intima-y-cera-fibra-original", "original"], ["cera-fibra-envase", "detail"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-cera-kids": [["ducha-intima-y-cera-kids-original", "original"], ["kids-caja", "pack"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-cera-moldeadora": [["ducha-intima-y-cera-moldeadora-original", "original"], ["cera-moldeadora-envase", "detail"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-pasta-en-caja": [["ducha-intima-y-pasta-en-caja-original", "original"], ["pasta-moldeadora-caja", "pack"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-patillera-amarilla": [["ducha-intima-y-patillera-amarilla-original", "original"], ["patillera-amarilla-lateral", "side"], ["patillera-accesorios", "contents"]],
  "ducha-intima-y-patillera-plateada": [["ducha-intima-y-patillera-plateada-original", "original"], ["patillera-plateada-lateral", "side"], ["patillera-accesorios", "contents"]],
  "ducha-intima-y-pomada": [["ducha-intima-y-pomada-original", "original"], ["pomada-envase", "detail"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-pomada-en-caja": [["ducha-intima-y-pomada-en-caja-original", "original"], ["pomada-caja", "pack"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-shampoo-carbon": [["ducha-intima-y-shampoo-carbon-original", "original"], ["shampoo-carbon-caja", "pack"], ["ducha-intima-reverso", "rear"]],
  "ducha-intima-y-shampoo-proteccion": [["ducha-intima-y-shampoo-proteccion-original", "original"], ["shampoo-proteccion-caja", "pack"], ["ducha-intima-reverso", "rear"]],
  "shampoo-y-minoxidil-12-5": [["shampoo-y-minoxidil-12-5-original", "original"], ["shampoo-proteccion-caja", "pack"], ["minoxidil-12-5-caja", "detail"]],
};

function studioCover(id) {
  return Object.hasOwn(STUDIO_GALLERY_VIEWS, id) ? `assets/estudio/principales/${id}.webp` : "";
}

function studioPhotoChoices(id) {
  const cover = studioCover(id);
  if (!cover) return [];
  const slide = (src, label) => ({
    src,
    small: src.replace(/\.webp$/, "-480.webp"),
    label: t("gallery." + label),
  });
  return [
    slide(cover, "front"),
    ...STUDIO_GALLERY_VIEWS[id].map(([file, label]) => slide(`assets/estudio/detalles/${file}.webp`, label)),
  ];
}

function selectStudioPhoto(gallery, index) {
  const photos = JSON.parse(gallery.dataset.photos);
  const current = (index + photos.length) % photos.length;
  const photo = photos[current];
  gallery.dataset.photoIndex = current;
  const alt = gallery.dataset.photoName + " · " + photo.label;
  const image = gallery.querySelector("[data-photo-image]");
  image.src = gallery.classList.contains("photo-carousel-card") ? photo.small : photo.src;
  image.alt = alt;
  gallery.querySelector("[data-photo-count]").textContent = `${current + 1} / ${photos.length}`;
  gallery.querySelectorAll("[data-photo-select]").forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.photoSelect) === current));
  });
  const enlarged = gallery.querySelector("dialog[open] img");
  if (enlarged) {
    enlarged.src = photo.src;
    enlarged.alt = alt;
  }
}

const studioSwipes = new WeakMap();
const studioSwipedAt = new WeakMap();

document.addEventListener("pointerdown", (event) => {
  const stage = event.target.closest("[data-photo-stage]");
  if (!stage || !event.isPrimary || event.pointerType === "mouse" || event.target.closest("[data-photo-step]")) return;
  studioSwipes.set(stage, { id: event.pointerId, x: event.clientX, y: event.clientY });
});

document.addEventListener("pointercancel", (event) => {
  const stage = event.target.closest("[data-photo-stage]");
  if (stage && studioSwipes.get(stage)?.id === event.pointerId) studioSwipes.delete(stage);
});

document.addEventListener("pointerup", (event) => {
  const stage = event.target.closest("[data-photo-stage]");
  const start = stage && studioSwipes.get(stage);
  if (!start || start.id !== event.pointerId) return;
  studioSwipes.delete(stage);
  const delta = event.clientX - start.x;
  if (Math.abs(delta) < 35 || Math.abs(delta) <= Math.abs(event.clientY - start.y) * 1.35) return;
  const gallery = stage.closest("[data-photo-gallery]");
  selectStudioPhoto(gallery, Number(gallery.dataset.photoIndex) + (delta < 0 ? 1 : -1));
  studioSwipedAt.set(stage, performance.now());
});

document.addEventListener("click", (event) => {
  const stage = event.target.closest("[data-photo-stage]");
  if (stage && performance.now() - (studioSwipedAt.get(stage) ?? -1000) < 330) {
    event.preventDefault();
    event.stopPropagation();
    studioSwipedAt.delete(stage);
    return;
  }
  const button = event.target.closest("[data-photo-step], [data-photo-select], [data-studio-zoom]");
  const gallery = button?.closest("[data-photo-gallery]");
  if (!gallery) return;
  const current = Number(gallery.dataset.photoIndex);
  if (button.hasAttribute("data-photo-step")) selectStudioPhoto(gallery, current + Number(button.dataset.photoStep));
  if (button.hasAttribute("data-photo-select")) selectStudioPhoto(gallery, Number(button.dataset.photoSelect));
  if (button.hasAttribute("data-studio-zoom")) {
    const dialog = gallery.querySelector("dialog");
    const photo = JSON.parse(gallery.dataset.photos)[current];
    const target = dialog.querySelector("img");
    target.src = photo.src;
    target.alt = gallery.querySelector("[data-photo-image]").alt;
    dialog.showModal();
  }
}, true);

document.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const gallery = event.target.closest("[data-photo-gallery]");
  if (!gallery) return;
  event.preventDefault();
  selectStudioPhoto(gallery, Number(gallery.dataset.photoIndex) + (event.key === "ArrowLeft" ? -1 : 1));
});
