import json
import secrets
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
    jid = str(body.get("jid") or "").strip()
    if not phone or not text:
        return JsonResponse({"error": "Falta teléfono o texto."}, status=400)

    from server import (
        load_store,
        now_iso,
        read_config,
        save_store,
        wa_bot_answer,
        wa_cart_total,
        wa_cfg,
        wa_money,
        wa_open_shop,
        wa_push_notification,
    )

    store = load_store()
    cfg = read_config()
    api = wa_cfg(cfg)
    chats = store.setdefault("whatsappChats", {})
    chat = chats.setdefault(phone, {
        "id": phone,
        "name": name,
        "phone": phone,
        "jid": jid,
        "messages": [],
        "cart": [],
        "updatedAt": now_iso(),
    })
    if name:
        chat["name"] = name
    if jid:
        chat["jid"] = jid
    chat.setdefault("messages", []).append({
        "id": str(body.get("messageId") or ("m_" + secrets.token_hex(6))),
        "from": "in",
        "text": text,
        "at": now_iso(),
    })
    is_new_chat = len(chat.get("messages") or []) <= 1
    if is_new_chat:
        wa_push_notification(
            store,
            "chat",
            "Chat nuevo",
            "%s escribió: %s" % (chat.get("name") or phone, text[:120]),
            "#/panel/whatsapp",
            {"phone": phone},
        )

    reply = ""
    media = []
    chat_auto = chat.get("autoReply", True)
    if api.get("autoReply", True) and chat_auto:
        answer = wa_bot_answer(
            text,
            store.get("products") or [],
            getattr(settings, "WHATSAPP_PHONE", None) or api.get("phone") or phone,
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
            token, shop_url = wa_open_shop(store, phone, chat.get("jid") or jid, chat.get("name") or name)
            chat["shopToken"] = token
            reply = (reply + "\n" + shop_url).strip()
            wa_push_notification(
                store,
                "shop",
                "Catálogo abierto",
                "%s abrió la tienda WhatsApp" % (chat.get("name") or phone),
                "#/panel/whatsapp",
                {"phone": phone, "token": token},
            )
        if answer.get("quoteRef"):
            chat["lastQuoteRef"] = answer.get("quoteRef")
            quotes = store.setdefault("whatsappQuotes", [])
            quotes.insert(0, {
                "id": answer.get("quoteRef"),
                "phone": phone,
                "name": chat.get("name") or name,
                "cart": chat.get("cart") or [],
                "total": wa_cart_total(chat.get("cart") or []),
                "at": now_iso(),
            })
            store["whatsappQuotes"] = quotes[:80]
            wa_push_notification(
                store,
                "quote",
                "Nueva cotización",
                "%s · %s · %s" % (
                    answer.get("quoteRef"),
                    chat.get("name") or phone,
                    wa_money(wa_cart_total(chat.get("cart") or [])),
                ),
                "#/panel/notificaciones",
                {"phone": phone, "ref": answer.get("quoteRef")},
            )
        if answer.get("needsAdvisor") or answer.get("pauseBot"):
            chat["autoReply"] = False
            chat["needsAdvisor"] = True
            wa_push_notification(
                store,
                "advisor",
                "Pide hablar con un asesor",
                "%s quiere atención humana" % (chat.get("name") or phone),
                "#/panel/whatsapp",
                {"phone": phone},
            )
        chat.setdefault("messages", []).append({
            "id": "b_" + secrets.token_hex(6),
            "from": "out",
            "text": reply,
            "at": now_iso(),
            "bot": True,
            "hasFile": bool(media),
        })
    elif not api.get("autoReply", True) or not chat_auto:
        wa_push_notification(
            store,
            "advisor",
            "Bot en pausa · responde tú",
            "%s escribió: %s" % (chat.get("name") or phone, text[:100]),
            "#/panel/whatsapp",
            {"phone": phone},
        )

    chat["updatedAt"] = now_iso()
    chat["messages"] = chat["messages"][-80:]
    save_store(store)
    return JsonResponse({"ok": True, "reply": reply, "media": media})
