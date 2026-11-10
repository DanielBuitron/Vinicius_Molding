import json
import sys
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

ROOT = Path(settings.BASE_DIR).parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


@csrf_exempt
@require_POST
def bridge_inbound(request):
    """Recibe mensajes del wa-bridge y responde con el bot entrenado."""
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    phone = "".join(ch for ch in str(body.get("phone") or "") if ch.isdigit())
    text = str(body.get("text") or "").strip()
    name = str(body.get("name") or phone).strip() or phone
    if not phone or not text:
        return JsonResponse({"error": "Falta teléfono o texto."}, status=400)

    from server import load_store, save_store, wa_bot_answer, wa_cart_total, wa_open_shop

    store = load_store()
    chats = store.setdefault("whatsappChats", {})
    chat = chats.setdefault(phone, {
        "id": phone,
        "name": name,
        "phone": phone,
        "jid": str(body.get("jid") or ""),
        "messages": [],
        "cart": [],
    })
    if name:
        chat["name"] = name
    if body.get("jid"):
        chat["jid"] = body.get("jid")
    chat.setdefault("messages", []).append({"from": "in", "text": text})
    answer = wa_bot_answer(
        text,
        store.get("products") or [],
        settings.WHATSAPP_PHONE,
        chat.get("lastProductId"),
        chat.get("cart") or [],
        chat.get("name") or name,
    )
    reply = answer.get("reply") or ""
    media = answer.get("media") or []
    if answer.get("productId"):
        chat["lastProductId"] = answer.get("productId")
    if "cart" in answer:
        chat["cart"] = answer.get("cart") or []
    if answer.get("openShop"):
        token, shop_url = wa_open_shop(store, phone, chat.get("jid") or "", chat.get("name") or name)
        chat["shopToken"] = token
        reply = (reply + "\n" + shop_url).strip()
    if answer.get("quoteRef"):
        chat["lastQuoteRef"] = answer.get("quoteRef")
        quotes = store.setdefault("whatsappQuotes", [])
        quotes.insert(0, {
            "id": answer.get("quoteRef"),
            "phone": phone,
            "name": chat.get("name") or name,
            "cart": chat.get("cart") or [],
            "total": wa_cart_total(chat.get("cart") or []),
        })
        store["whatsappQuotes"] = quotes[:80]
    chat.setdefault("messages", []).append({"from": "out", "text": reply, "bot": True, "hasFile": bool(media)})
    chat["messages"] = chat["messages"][-80:]
    save_store(store)
    return JsonResponse({"ok": True, "reply": reply, "media": media})
