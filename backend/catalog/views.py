import json
import sys
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET

ROOT = Path(settings.ROOT_DIR if hasattr(settings, "ROOT_DIR") else Path(settings.BASE_DIR).parent)
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def _load_products():
    store_path = Path(settings.VM_STORE_PATH)
    if store_path.exists():
        data = json.loads(store_path.read_text(encoding="utf-8"))
        return [p for p in (data.get("products") or []) if p.get("active", True)]
    from server import SEED_PRODUCTS

    return list(SEED_PRODUCTS)


@require_GET
def products(request):
    items = []
    for item in _load_products():
        items.append({
            "id": item.get("id"),
            "sku": item.get("sku"),
            "name": item.get("name"),
            "line": item.get("line"),
            "finish": item.get("finish"),
            "category": item.get("category"),
            "size": item.get("size"),
            "price": item.get("price"),
            "stock": item.get("stock"),
            "accent": item.get("accent"),
            "image": item.get("image"),
            "summary": item.get("summary"),
            "description": item.get("description"),
            "ingredients": item.get("ingredients") or [],
            "hold": item.get("hold"),
            "featured": item.get("featured"),
            "active": item.get("active", True),
        })
    return JsonResponse({"products": items})


@require_GET
def config(request):
    return JsonResponse({
        "city": "Cali, Valle del Cauca",
        "whatsapp": settings.WHATSAPP_PHONE,
        "siteBase": settings.VM_SITE_BASE,
        "apiBase": settings.VM_API_BASE or request.build_absolute_uri("/").rstrip("/"),
        "usdRate": 4000,
    })


@require_GET
def spa_index(request):
    index = Path(settings.VM_WEB_ROOT) / "index.html"
    if not index.exists():
        raise Http404("Falta web/index.html")
    return FileResponse(index.open("rb"), content_type="text/html; charset=utf-8")


@csrf_exempt
@require_GET
def health(request):
    return JsonResponse({"ok": True, "service": "vinicius-django"})
