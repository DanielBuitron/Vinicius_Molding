# -*- coding: utf-8 -*-
"""Sitio comercial Vinicius Molding. Sirve la web y la API local."""

import base64
import hashlib
import io
import json
import os
import re
import secrets
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

try:
    import qrcode
except Exception:
    qrcode = None

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "web"
DATA = ROOT / "data" / "store.json"
LOCK = threading.Lock()
BRIDGE_PORT = 3100
BRIDGE_URL = "http://127.0.0.1:%s" % BRIDGE_PORT
SERVER_PORT = 8080
_bridge_proc = None
_bridge_lock = threading.Lock()

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

SEED_PRODUCTS = [
    {
        "id": "cera-fibra",
        "sku": "VM-CF-150",
        "name": "Cera de fibra",
        "line": "Línea Molding",
        "finish": "Acabado firme",
        "category": "molding",
        "size": "150 g",
        "price": 44000,
        "stock": 48,
        "minStock": 12,
        "accent": "#6D4AFF",
        "image": "assets/products/cera-fibra.jpg",
        "summary": "Estructura el peinado y lo sostiene con fijación firme.",
        "description": "Cera de fibra para quien pide control. Separa, define y mantiene la forma sin apelmazar el cabello.",
        "ingredients": ["Keratina", "Romero", "Aloe vera", "Cera de abeja"],
        "hold": 5,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "cera-brillo",
        "sku": "VM-CB-150",
        "name": "Cera brillo medio",
        "line": "Línea Molding",
        "finish": "Brillo medio",
        "category": "molding",
        "size": "150 g",
        "price": 42000,
        "stock": 56,
        "minStock": 12,
        "accent": "#E52C3B",
        "image": "assets/products/cera-brillo.jpg",
        "summary": "Moldea con brillo medio y una fijación que se ve, no que pesa.",
        "description": "La cera de uso diario. Controla el peinado, aporta brillo medio y deja un acabado limpio.",
        "ingredients": ["Keratina", "Romero", "Aloe vera", "Cera de abeja"],
        "hold": 4,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "pasta",
        "sku": "VM-PA-150",
        "name": "Pasta fijadora",
        "line": "Línea Molding",
        "finish": "Acabado brillante",
        "category": "molding",
        "size": "150 g",
        "price": 46000,
        "stock": 34,
        "minStock": 10,
        "accent": "#00C8C2",
        "image": "assets/products/pasta.jpg",
        "summary": "Fijación fuerte y brillo marcado para peinados con presencia.",
        "description": "Pasta de fijación fuerte. Construye volumen, sella la forma y deja un acabado brillante.",
        "ingredients": ["Keratina", "Romero", "Aloe vera", "Cera de abeja"],
        "hold": 5,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "pomada",
        "sku": "VM-PM-150",
        "name": "Pomada mate",
        "line": "Línea Molding",
        "finish": "Acabado mate",
        "category": "molding",
        "size": "150 g",
        "price": 38000,
        "stock": 40,
        "minStock": 10,
        "accent": "#FFD300",
        "image": "assets/products/pomada.jpg",
        "summary": "Textura maleable y acabado mate. Control sin brillo.",
        "description": "Pomada moldeadora de acabado mate. Define con naturalidad y se retrabaja durante el día.",
        "ingredients": ["Keratina", "Romero", "Aloe vera", "Cera de abeja"],
        "hold": 3,
        "featured": False,
        "views": 0,
        "active": True,
    },
    {
        "id": "cera-kids",
        "sku": "VM-KD-150",
        "name": "Cera de fibra Kids",
        "line": "Línea Molding",
        "finish": "Fijación suave",
        "category": "kids",
        "size": "150 g",
        "price": 32000,
        "stock": 8,
        "minStock": 12,
        "accent": "#E52C3B",
        "image": "assets/products/cera-kids.jpg",
        "summary": "La misma cera de fibra, en una edición pensada para los más jóvenes.",
        "description": "Cera de fibra de la línea Kids. Fija el peinado con una fórmula de keratina, romero y aloe vera.",
        "ingredients": ["Keratina", "Romero", "Aloe vera", "Cera de abeja"],
        "hold": 3,
        "featured": False,
        "views": 0,
        "active": True,
    },
    {
        "id": "shampoo-proteccion",
        "sku": "VM-SH-500",
        "name": "Shampoo protección capilar",
        "line": "Línea Cuidado personal",
        "finish": "Uso diario",
        "category": "limpieza",
        "size": "500 g",
        "price": 36000,
        "stock": 62,
        "minStock": 15,
        "accent": "#A4D800",
        "image": "assets/products/shampoo-proteccion.jpg",
        "summary": "Limpia y protege. Sin sal.",
        "description": "Shampoo de protección capilar con extracto de romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico. Fórmula sin sal.",
        "ingredients": ["Romero", "Keratina", "Cebolla", "Aloe vera", "Zanahoria", "Ácido hialurónico"],
        "hold": None,
        "featured": False,
        "views": 0,
        "active": True,
    },
    {
        "id": "shampoo-carbon",
        "sku": "VM-SC-500",
        "name": "Shampoo carbón activo",
        "line": "Línea Cuidado personal",
        "finish": "Caspa y picazón",
        "category": "limpieza",
        "size": "500 ml",
        "price": 39000,
        "stock": 44,
        "minStock": 12,
        "accent": "#585E65",
        "image": "assets/products/shampoo-carbon.jpg",
        "summary": "Carbón activo para cuero cabelludo con caspa y picazón. Sin sal.",
        "description": "Shampoo de carbón activo. La etiqueta lo dice claro: adiós caspa y picazón. Fórmula sin sal, con romero, keratina, cebolla, aloe vera, zanahoria y ácido hialurónico.",
        "ingredients": ["Carbón activo", "Romero", "Keratina", "Cebolla", "Aloe vera", "Ácido hialurónico"],
        "hold": None,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "serum-barba",
        "sku": "VM-SB-065",
        "name": "Serum barba y bigote",
        "line": "Línea Cuidado personal",
        "finish": "Acondiciona",
        "category": "tratamiento",
        "size": "65 ml",
        "price": 49000,
        "stock": 27,
        "minStock": 8,
        "accent": "#A4D800",
        "image": "assets/products/serum-barba.jpg",
        "summary": "Ordena la barba y el bigote. Argán, jojoba y aloe vera.",
        "description": "Serum para barba y bigote. Aporta suavidad y control con aceite de argán, jojoba y aloe vera.",
        "ingredients": ["Aceite de argán", "Jojoba", "Aloe vera"],
        "hold": None,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "tonico",
        "sku": "VM-TO-065",
        "name": "Tónico orgánico",
        "line": "Línea Cuidado personal",
        "finish": "Cuero cabelludo",
        "category": "tratamiento",
        "size": "65 ml",
        "price": 54000,
        "stock": 31,
        "minStock": 8,
        "accent": "#00C8C2",
        "image": "assets/products/tonico.jpg",
        "summary": "Tónico de extractos naturales para la rutina del cuero cabelludo.",
        "description": "Tónico orgánico con romero, menta, queratina, ácido hialurónico y aloe vera. Se aplica en la rutina, directo al cuero cabelludo.",
        "ingredients": ["Romero", "Menta", "Queratina", "Ácido hialurónico", "Aloe vera"],
        "hold": None,
        "featured": True,
        "views": 0,
        "active": True,
    },
    {
        "id": "ducha-intima",
        "sku": "VM-DI-200",
        "name": "Ducha íntima",
        "line": "Línea Cuidado personal",
        "finish": "For men",
        "category": "limpieza",
        "size": "180 g",
        "price": 28000,
        "stock": 38,
        "minStock": 10,
        "accent": "#00C8C2",
        "image": "assets/products/ducha-intima.jpg",
        "summary": "Higiene masculina. pH balanceado, sin sulfatos y sin parabenos.",
        "description": "Ducha íntima para hombre. Fórmula con pH balanceado, sin sulfatos y sin parabenos.",
        "ingredients": ["pH balanceado", "Sin sulfatos", "Sin parabenos"],
        "hold": None,
        "featured": False,
        "views": 0,
        "active": True,
    },
]

PRESERVE = {"price", "stock", "minStock", "views", "active"}
MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
}


def now_iso():
    return datetime.now().replace(microsecond=0).isoformat()


def today_key():
    return datetime.now().date().isoformat()


def read_config():
    path = ROOT / "config.json"
    if not path.exists():
        path = ROOT / "config.example.json"
    if not path.exists():
        return {"company": {}, "wompi": {}, "admin": {}, "publicBaseUrl": ""}
    return json.loads(path.read_text(encoding="utf-8"))


def write_config(cfg):
    path = ROOT / "config.json"
    path.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def hash_pw(password, salt_hex):
    salt = bytes.fromhex(salt_hex)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return digest.hex()


def fresh_store():
    cfg = read_config()
    admin = cfg.get("admin") or {}
    salt = secrets.token_hex(16)
    password = admin.get("password") or "admin123"
    return {
        "users": [
            {
                "id": "usr_admin",
                "username": admin.get("username") or "admin",
                "name": admin.get("name") or "Administración",
                "salt": salt,
                "passwordHash": hash_pw(password, salt),
                "role": "admin",
            }
        ],
        "sessions": {},
        "products": json.loads(json.dumps(SEED_PRODUCTS)),
        "leads": [],
        "comments": [],
        "orders": [],
        "movements": [],
        "analytics": {"days": {}, "events": []},
        "whatsappChats": {},
    }


def load_store():
    DATA.parent.mkdir(parents=True, exist_ok=True)
    if not DATA.exists():
        store = fresh_store()
        save_store(store)
        return store
    store = json.loads(DATA.read_text(encoding="utf-8"))
    store.setdefault("users", [])
    store.setdefault("sessions", {})
    store.setdefault("products", [])
    store.setdefault("leads", [])
    store.setdefault("comments", [])
    store.setdefault("orders", [])
    store.setdefault("movements", [])
    store.setdefault("analytics", {"days": {}, "events": []})
    store.setdefault("whatsappChats", {})
    by_id = {item["id"]: item for item in store["products"]}
    for seed in SEED_PRODUCTS:
        current = by_id.get(seed["id"])
        if current is None:
            store["products"].append(json.loads(json.dumps(seed)))
            continue
        for key, value in seed.items():
            if key not in PRESERVE:
                current[key] = value
        for key in PRESERVE:
            current.setdefault(key, seed[key])
    if not store["users"]:
        store["users"] = fresh_store()["users"]
    return store


def save_store(store):
    DATA.parent.mkdir(parents=True, exist_ok=True)
    tmp = DATA.with_suffix(".tmp")
    tmp.write_text(json.dumps(store, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(DATA)


def public_product(product):
    keys = (
        "id", "sku", "name", "line", "finish", "category", "size", "price",
        "stock", "accent", "image", "summary", "description", "ingredients",
        "hold", "featured", "active",
    )
    return {key: product.get(key) for key in keys}


def wompi_ready(cfg):
    wompi = cfg.get("wompi") or {}
    return bool(wompi.get("publicKey") and wompi.get("integritySecret"))


def wa_cfg(cfg=None):
    cfg = cfg or read_config()
    company = cfg.get("company") or {}
    wa = cfg.get("whatsappApi") or {}
    phone = "".join(ch for ch in str(company.get("whatsapp") or wa.get("displayPhone") or "573235835137") if ch.isdigit())
    return {
        "phone": phone,
        "token": str(wa.get("token") or "").strip(),
        "phoneNumberId": str(wa.get("phoneNumberId") or "").strip(),
        "verifyToken": str(wa.get("verifyToken") or "vinicius-wa").strip() or "vinicius-wa",
        "autoReply": bool(wa.get("autoReply", True)),
    }


def wa_ready(cfg=None):
    data = wa_cfg(cfg)
    return bool(data["token"] and data["phoneNumberId"])


def wa_send_link(phone, text=""):
    digits = "".join(ch for ch in str(phone or "") if ch.isdigit())
    q = urllib.parse.urlencode({"phone": digits, "text": text or "", "type": "phone_number", "app_absent": "0"})
    return "https://api.whatsapp.com/send/?" + q


def wa_qr_png(phone):
    if qrcode is None:
        return None
    link = wa_send_link(phone)
    img = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=8, border=2)
    img.add_data(link)
    img.make(fit=True)
    picture = img.make_image(fill_color="#111b21", back_color="white")
    buf = io.BytesIO()
    picture.save(buf, format="PNG")
    return buf.getvalue()


def node_bin():
    portable = ROOT / ".tools" / "node" / ("node.exe" if os.name == "nt" else "node")
    if portable.exists():
        return str(portable)
    return "node"


def bridge_request(path, method="GET", body=None, timeout=3):
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        BRIDGE_URL + path,
        data=data,
        method=method,
        headers={"Content-Type": "application/json"} if data is not None else {},
    )
    with urllib.request.urlopen(req, timeout=timeout) as response:
        raw = response.read()
        ctype = response.headers.get("Content-Type") or ""
        if "image/" in ctype:
            return raw
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))


def bridge_status():
    try:
        data = bridge_request("/status", timeout=2)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    return {"ok": False, "status": "offline", "connected": False, "hasQr": False}


def bridge_qr_png():
    try:
        data = bridge_request("/qr.png", timeout=2)
        if isinstance(data, (bytes, bytearray)) and data:
            return bytes(data)
    except Exception:
        pass
    return None


def ensure_wa_bridge():
    global _bridge_proc
    with _bridge_lock:
        status = bridge_status()
        if status.get("status") and status.get("status") != "offline":
            return True
        if _bridge_proc is not None and _bridge_proc.poll() is None:
            return True
        bridge_dir = ROOT / "wa-bridge"
        entry = bridge_dir / "index.js"
        if not entry.exists():
            return False
        node = node_bin()
        modules = bridge_dir / "node_modules" / "@whiskeysockets" / "baileys"
        if not modules.exists():
            return False
        creationflags = 0
        if os.name == "nt":
            creationflags = getattr(subprocess, "CREATE_NO_WINDOW", 0)
        env = os.environ.copy()
        env["WA_BRIDGE_PORT"] = str(BRIDGE_PORT)
        env["VM_API"] = "http://127.0.0.1:%s" % SERVER_PORT
        try:
            _bridge_proc = subprocess.Popen(
                [node, str(entry)],
                cwd=str(bridge_dir),
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                creationflags=creationflags,
            )
        except Exception:
            _bridge_proc = None
            return False
        return True


def wa_norm(text):
    import unicodedata
    raw = unicodedata.normalize("NFD", str(text or "").lower())
    raw = "".join(ch for ch in raw if unicodedata.category(ch) != "Mn")
    raw = re.sub(r"[^a-z0-9\s]", " ", raw)
    return re.sub(r"\s+", " ", raw).strip()


def wa_money(value):
    try:
        n = int(value or 0)
    except Exception:
        n = 0
    return "$" + f"{n:,}".replace(",", ".")


def wa_product_file(product):
    raw = str((product or {}).get("image") or "").replace("\\", "/").lstrip("/")
    if not raw:
        return None
    path = WEB / raw
    if path.exists():
        return path
    stem = path.with_suffix("")
    for ext in (".jpg", ".jpeg", ".png", ".webp"):
        alt = Path(str(stem) + ext)
        if alt.exists():
            return alt
    return None


def wa_find_product(q, products, last_id=None):
    best, score = None, 0
    for item in products or []:
        bag = wa_norm(" ".join([
            str(item.get("name") or ""),
            str(item.get("sku") or ""),
            str(item.get("summary") or ""),
            str(item.get("description") or ""),
            " ".join(item.get("ingredients") or []),
            str(item.get("line") or ""),
            str(item.get("category") or ""),
        ]))
        s = 0
        for word in q.split():
            if len(word) > 2 and word in bag:
                s += 3 if len(word) > 4 else 1
        for key in ("cera", "fibra", "brillo", "pasta", "pomada", "shampoo", "tonico", "serum", "splash", "shaving", "ducha", "kids", "minoxidil", "canas", "carbon", "barba"):
            if key in q and key in bag:
                s += 4
        if last_id and item.get("id") == last_id:
            s += 1
        if s > score:
            best, score = item, s
    if best and score >= 3:
        return best, score
    if last_id:
        hit = next((item for item in (products or []) if item.get("id") == last_id), None)
        if hit:
            return hit, 2
    return None, 0


def wa_product_caption(product):
    bits = [
        product.get("name") or "",
        product.get("summary") or product.get("description") or "",
        "Presentación: " + str(product.get("size") or "—"),
        "Precio: " + wa_money(product.get("price")),
    ]
    if product.get("sku"):
        bits.append("Referencia: " + str(product["sku"]))
    return "\n".join(bits)


def wa_catalog_pdf(products):
    from reportlab.lib.colors import HexColor, Color
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader

    out = ROOT / "data" / "catalogo-vinicius.pdf"
    out.parent.mkdir(parents=True, exist_ok=True)
    width, height = A4
    black = HexColor("#000000")
    red = HexColor("#E52C3B")
    cyan = HexColor("#00C8C2")
    yellow = HexColor("#FFD300")
    gray = HexColor("#585E65")
    lime = HexColor("#A4D800")
    white = HexColor("#FFFFFF")
    soft = HexColor("#141414")

    c = canvas.Canvas(str(out), pagesize=A4)
    items = list(products or [])[:14]

    def paint_header(page_title="Catálogo"):
        c.setFillColor(black)
        c.rect(0, 0, width, height, fill=1, stroke=0)
        c.setFillColor(red)
        c.rect(0, height - 8, width, 8, fill=1, stroke=0)
        c.setFillColor(cyan)
        c.rect(0, height - 11, width * 0.34, 3, fill=1, stroke=0)
        c.setFillColor(yellow)
        c.rect(width * 0.34, height - 11, width * 0.22, 3, fill=1, stroke=0)
        c.setFillColor(lime)
        c.rect(width * 0.56, height - 11, width * 0.44, 3, fill=1, stroke=0)
        logo = WEB / "assets" / "logo-white.png"
        if not logo.exists():
            logo = WEB / "assets" / "logo.png"
        y_logo = height - 48
        if logo.exists():
            try:
                c.drawImage(ImageReader(str(logo)), 22 * mm, y_logo - 4, width=42 * mm, height=14 * mm, mask="auto", preserveAspectRatio=True, anchor="sw")
            except Exception:
                pass
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 16)
        c.drawRightString(width - 18 * mm, height - 28, "VINICIUS MOLDING")
        c.setFillColor(gray)
        c.setFont("Helvetica", 9)
        c.drawRightString(width - 18 * mm, height - 40, "Somos la solución, no el problema.")
        c.setFillColor(red)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(18 * mm, height - 58, page_title.upper())
        c.setStrokeColor(HexColor("#222222"))
        c.setLineWidth(0.6)
        c.line(18 * mm, height - 64, width - 18 * mm, height - 64)

    def product_card(item, x, y, card_w, card_h):
        c.setFillColor(soft)
        c.roundRect(x, y, card_w, card_h, 8, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#2A2A2A"))
        c.setLineWidth(0.8)
        c.roundRect(x, y, card_w, card_h, 8, fill=0, stroke=1)
        accent = HexColor(str(item.get("accent") or "#E52C3B"))
        c.setFillColor(accent)
        c.rect(x, y + card_h - 4, card_w, 4, fill=1, stroke=0)
        img_path = wa_product_file(item)
        img_box = 28 * mm
        img_x = x + 6 * mm
        img_y = y + card_h - img_box - 10 * mm
        c.setFillColor(black)
        c.roundRect(img_x, img_y, img_box, img_box, 6, fill=1, stroke=0)
        if img_path is not None:
            try:
                c.drawImage(
                    ImageReader(str(img_path)),
                    img_x + 1.5 * mm,
                    img_y + 1.5 * mm,
                    width=img_box - 3 * mm,
                    height=img_box - 3 * mm,
                    preserveAspectRatio=True,
                    mask="auto",
                    anchor="c",
                )
            except Exception:
                pass
        text_x = img_x + img_box + 5 * mm
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 11)
        name = str(item.get("name") or "")[:34]
        c.drawString(text_x, y + card_h - 14 * mm, name)
        c.setFillColor(gray)
        c.setFont("Helvetica", 8)
        c.drawString(text_x, y + card_h - 19 * mm, str(item.get("line") or item.get("category") or "Vinicius"))
        c.setFillColor(cyan)
        c.setFont("Helvetica", 8)
        c.drawString(text_x, y + card_h - 24 * mm, str(item.get("size") or "—"))
        summary = str(item.get("summary") or item.get("description") or "")
        c.setFillColor(HexColor("#C9CDD1"))
        c.setFont("Helvetica", 8)
        words = summary.split()
        line = ""
        lines = []
        for word in words:
            trial = (line + " " + word).strip()
            if c.stringWidth(trial, "Helvetica", 8) > card_w - img_box - 14 * mm:
                lines.append(line)
                line = word
            else:
                line = trial
        if line:
            lines.append(line)
        ty = y + card_h - 30 * mm
        for row in lines[:3]:
            c.drawString(text_x, ty, row)
            ty -= 10
        c.setFillColor(yellow)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(text_x, y + 8 * mm, wa_money(item.get("price")))
        if item.get("sku"):
            c.setFillColor(gray)
            c.setFont("Helvetica", 7)
            c.drawRightString(x + card_w - 6 * mm, y + 8 * mm, str(item.get("sku")))

    paint_header("Catálogo oficial")
    c.setFillColor(white)
    c.setFont("Helvetica", 10)
    c.drawString(18 * mm, height - 78, "Cuidado capilar masculino · Cali, Valle del Cauca")
    c.setFillColor(gray)
    c.setFont("Helvetica", 8)
    c.drawString(18 * mm, height - 90, "Molding · Kids · Limpieza · Tratamiento · Cuerpo")

    card_w = width - 36 * mm
    card_h = 42 * mm
    y = height - 108 * mm
    page = 1
    for index, item in enumerate(items):
        if y < 30 * mm:
            c.setFillColor(gray)
            c.setFont("Helvetica", 8)
            c.drawCentredString(width / 2, 14 * mm, "Vinicius Molding · Página %s" % page)
            c.showPage()
            page += 1
            paint_header("Catálogo oficial")
            y = height - 78 * mm
        product_card(item, 18 * mm, y - card_h, card_w, card_h)
        y -= card_h + 6 * mm

    c.setFillColor(gray)
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2, 14 * mm, "Vinicius Molding · Página %s · Pedidos por WhatsApp" % page)
    c.save()
    return out


def wa_bot_answer(text, products, phone, last_product_id=None):
    q = wa_norm(text)
    phone = phone or "573235835137"
    result = {"reply": "", "media": [], "productId": last_product_id}
    wants_image = any(k in q for k in ("foto", "fotos", "imagen", "image", "picture", "muestra", "muestrame", "enseñame", "ensename", "verla", "verlo"))
    wants_catalog = any(k in q for k in ("catalogo", "pdf", "lista", "que tienen", "productos")) and not wants_image

    if not q or re.match(r"^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|hi)\b", q):
        result["reply"] = "Hola, bienvenido a Vinicius Molding. Somos cuidado capilar masculino. ¿Qué producto te interesa?"
        return result
    if re.match(r"^(gracias|perfecto|listo|ok|dale)\b", q) and len(q) < 40:
        result["reply"] = "Con gusto. Si quieres pedir, dime el producto y la cantidad, o escribe al +" + phone + "."
        return result

    if wants_catalog:
        pdf = wa_catalog_pdf(products)
        result["reply"] = "Te comparto el catálogo oficial de Vinicius Molding en PDF."
        result["media"].append({
            "type": "document",
            "path": str(pdf),
            "filename": "Catalogo-Vinicius-Molding.pdf",
            "caption": "Catálogo Vinicius Molding · Somos la solución, no el problema.",
            "mimetype": "application/pdf",
        })
        return result

    best, score = wa_find_product(q, products, last_product_id)
    if wants_image:
        target = best if score >= 2 else None
        if target is None and last_product_id:
            target = next((item for item in (products or []) if item.get("id") == last_product_id), None)
        if target is None:
            result["reply"] = "Claro. Dime el producto y te mando la foto, por ejemplo “foto cera de fibra”."
            return result
        image = wa_product_file(target)
        result["productId"] = target.get("id")
        caption = wa_product_caption(target)
        if image is None:
            result["reply"] = caption + "\n(Aún no tengo la imagen de ese producto.)"
            return result
        result["reply"] = "Aquí tienes la foto de %s." % (target.get("name") or "producto")
        result["media"].append({
            "type": "image",
            "path": str(image),
            "caption": caption,
            "mimetype": "image/jpeg" if image.suffix.lower() in (".jpg", ".jpeg") else "image/png",
        })
        return result

    if best and score >= 3:
        result["productId"] = best.get("id")
        result["reply"] = wa_product_caption(best)
        if any(k in q for k in ("foto", "imagen", "ver", "muestra")):
            image = wa_product_file(best)
            if image is not None:
                result["media"].append({
                    "type": "image",
                    "path": str(image),
                    "caption": result["reply"],
                    "mimetype": "image/jpeg" if image.suffix.lower() in (".jpg", ".jpeg") else "image/png",
                })
                result["reply"] = "Te mando la foto de %s." % (best.get("name") or "producto")
        return result

    if any(k in q for k in ("precio", "cuesta", "cuanto")):
        result["reply"] = "Precios Vinicius:\n" + "\n".join(
            ["• %s %s" % (item.get("name"), wa_money(item.get("price"))) for item in (products or [])[:14]]
        )
        return result
    if any(k in q for k in ("whatsapp", "asesor", "contacto", "telefono", "celular")):
        result["reply"] = "Puedes escribirnos por WhatsApp al +" + phone + "."
        return result
    if any(k in q for k in ("envio", "entrega", "domicilio", "cali")):
        result["reply"] = "Coordinamos la entrega desde Cali, Valle del Cauca. Dime tu ciudad y te orientamos."
        return result
    result["reply"] = "Puedo ayudarte con productos, precios, fotos, el catálogo en PDF o pedidos. Di “catálogo” o el nombre de un producto."
    return result


def wa_bot_reply(text, products, phone, last_product_id=None):
    return wa_bot_answer(text, products, phone, last_product_id).get("reply") or ""


def wa_graph_send(phone_number_id, token, to_phone, body):
    url = "https://graph.facebook.com/v21.0/%s/messages" % urllib.parse.quote(phone_number_id)
    payload = json.dumps({
        "messaging_product": "whatsapp",
        "to": "".join(ch for ch in str(to_phone) if ch.isdigit()),
        "type": "text",
        "text": {"preview_url": False, "body": body},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST", headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def wompi_base(public_key):
    if str(public_key).startswith("pub_prod_"):
        return "https://production.wompi.co/v1"
    return "https://sandbox.wompi.co/v1"


def integrity_signature(reference, amount_cents, currency, secret):
    raw = f"{reference}{amount_cents}{currency}{secret}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def dig(obj, path):
    current = obj
    for part in path.split("."):
        if not isinstance(current, dict) or part not in current:
            return None
        current = current[part]
    return current


def verify_wompi_event(payload, secret):
    signature = payload.get("signature") or {}
    props = signature.get("properties") or []
    checksum = str(signature.get("checksum") or "")
    timestamp = str(payload.get("timestamp") or "")
    if not secret or not checksum or not props:
        return False
    chunks = []
    data = payload.get("data") or {}
    for prop in props:
        value = dig(data, prop)
        chunks.append("" if value is None else str(value))
    raw = "".join(chunks) + timestamp + secret
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return hmac_compare(digest, checksum)


def hmac_compare(left, right):
    try:
        return secrets.compare_digest(left, right)
    except Exception:
        return False


def device_from_ua(ua):
    low = (ua or "").lower()
    if any(token in low for token in ("mobile", "android", "iphone", "ipad")):
        return "Móvil"
    return "Escritorio"


def day_bucket(store, key=None):
    key = key or today_key()
    days = store["analytics"]["days"]
    bucket = days.get(key)
    if bucket is None:
        bucket = {"visits": 0, "sessions": [], "pages": {}, "products": {}, "devices": {}}
        days[key] = bucket
    bucket.setdefault("sessions", [])
    bucket.setdefault("pages", {})
    bucket.setdefault("products", {})
    bucket.setdefault("devices", {})
    return bucket


def apply_payment(store, order, status, transaction_id=None):
    status = (status or "").upper()
    order["status"] = {
        "APPROVED": "aprobado",
        "DECLINED": "rechazado",
        "VOIDED": "anulado",
        "ERROR": "error",
        "PENDING": "pendiente_pago",
    }.get(status, status.lower() or order.get("status"))
    if transaction_id:
        order["transactionId"] = transaction_id
    order["updatedAt"] = now_iso()
    if order["status"] == "aprobado" and not order.get("stockApplied"):
        short = []
        for item in order.get("items") or []:
            product = next((p for p in store["products"] if p["id"] == item["id"]), None)
            if product is None:
                continue
            qty = int(item.get("qty") or 0)
            previous = int(product.get("stock") or 0)
            product["stock"] = max(0, previous - qty)
            if previous < qty:
                short.append(item["id"])
            store["movements"].append({
                "id": "mov_" + secrets.token_hex(4),
                "productId": product["id"],
                "name": product["name"],
                "before": previous,
                "after": product["stock"],
                "reason": "venta " + order["reference"],
                "at": now_iso(),
            })
        order["stockApplied"] = True
        order["stockShort"] = short
        store["movements"] = store["movements"][-200:]


def fetch_transaction(transaction_id, public_key):
    url = f"{wompi_base(public_key)}/transactions/{urllib.parse.quote(transaction_id)}"
    request = urllib.request.Request(url, headers={"Authorization": "Bearer " + public_key})
    with urllib.request.urlopen(request, timeout=12) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return (payload.get("data") or payload)


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        self.route("GET")

    def do_POST(self):
        self.route("POST")

    def do_PUT(self):
        self.route("PUT")

    def do_PATCH(self):
        self.route("PATCH")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS")
        self.end_headers()

    def log_message(self, fmt, *args):
        message = fmt % args
        if "GET /assets/" in message or "GET /favicon" in message:
            return
        sys.stdout.write("%s  %s\n" % (self.log_date_time_string(), message))

    def route(self, method):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(parsed.path)
        if path == "/favicon.ico":
            path = "/assets/favicon.png"
        query = urllib.parse.parse_qs(parsed.query)
        try:
            if path.startswith("/api/"):
                self.handle_api(method, path, query)
                return
            self.serve_static(path)
        except Exception as exc:
            self.send_json(500, {"error": "Error interno", "detail": str(exc)})

    def read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def send_json(self, code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def send_bytes(self, code, body, content_type, extra_headers=None):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        for key, value in (extra_headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def base_url(self):
        cfg = read_config()
        configured = (cfg.get("publicBaseUrl") or "").rstrip("/")
        if configured:
            return configured
        host = self.headers.get("Host") or "127.0.0.1:8080"
        forwarded = (self.headers.get("X-Forwarded-Proto") or "").split(",")[0].strip().lower()
        if forwarded in ("http", "https"):
            proto = forwarded
        elif "trycloudflare.com" in host or host.endswith("github.io"):
            proto = "https"
        else:
            proto = "http"
        return proto + "://" + host

    def current_user(self, store):
        header = self.headers.get("Authorization") or ""
        token = header[7:].strip() if header.startswith("Bearer ") else ""
        if not token:
            return None, None
        session = (store.get("sessions") or {}).get(token)
        if not session:
            return None, None
        if session.get("exp", "") < now_iso():
            store["sessions"].pop(token, None)
            return None, None
        user = next((item for item in store["users"] if item["id"] == session.get("userId")), None)
        return user, token

    def require_user(self, store):
        user, token = self.current_user(store)
        if not user:
            self.send_json(401, {"error": "Inicia sesión para entrar al panel."})
            return None
        return user

    def handle_api(self, method, path, query):
        if path == "/api/config" and method == "GET":
            cfg = read_config()
            company = cfg.get("company") or {}
            self.send_json(200, {
                "wompiReady": wompi_ready(cfg),
                "currency": (cfg.get("wompi") or {}).get("currency") or "COP",
                "city": company.get("city") or "Cali, Valle del Cauca",
                "whatsapp": company.get("whatsapp") or "",
                "email": company.get("email") or "",
                "webhookUrl": self.base_url() + "/api/wompi/events",
            })
            return

        if path == "/api/products" and method == "GET":
            with LOCK:
                store = load_store()
            products = [public_product(item) for item in store["products"] if item.get("active", True)]
            self.send_json(200, {"products": products})
            return

        if path == "/api/track" and method == "POST":
            body = self.read_json()
            session_id = str(body.get("sessionId") or "")[:80] or "anon"
            page = str(body.get("path") or "/")[:160]
            product_id = str(body.get("productId") or "")[:80]
            ua = (self.headers.get("User-Agent") or "")[:180]
            device = device_from_ua(ua)
            with LOCK:
                store = load_store()
                bucket = day_bucket(store)
                bucket["visits"] += 1
                if session_id not in bucket["sessions"]:
                    if len(bucket["sessions"]) < 8000:
                        bucket["sessions"].append(session_id)
                bucket["pages"][page] = bucket["pages"].get(page, 0) + 1
                bucket["devices"][device] = bucket["devices"].get(device, 0) + 1
                product_name = ""
                if product_id:
                    bucket["products"][product_id] = bucket["products"].get(product_id, 0) + 1
                    product = next((item for item in store["products"] if item["id"] == product_id), None)
                    if product:
                        product["views"] = int(product.get("views") or 0) + 1
                        product_name = product["name"]
                store["analytics"]["events"].append({
                    "at": now_iso(),
                    "sessionId": session_id,
                    "path": page,
                    "productId": product_id,
                    "productName": product_name,
                    "device": device,
                })
                store["analytics"]["events"] = store["analytics"]["events"][-400:]
                save_store(store)
            self.send_json(200, {"ok": True})
            return

        if path == "/api/leads" and method == "POST":
            body = self.read_json()
            phone = "".join(ch for ch in str(body.get("phone") or "") if ch.isdigit())
            name = str(body.get("name") or "Cliente").strip()[:80] or "Cliente"
            if len(phone) < 7 or len(phone) > 15:
                self.send_json(400, {"error": "Escribe un celular válido."})
                return
            lead = {
                "id": "lead_" + secrets.token_hex(4),
                "name": name,
                "phone": phone,
                "city": str(body.get("city") or "").strip()[:60],
                "interest": str(body.get("interest") or "").strip()[:80],
                "schedule": str(body.get("schedule") or "").strip()[:40],
                "note": str(body.get("note") or "").strip()[:400],
                "status": "nuevo",
                "at": now_iso(),
            }
            with LOCK:
                store = load_store()
                store["leads"].insert(0, lead)
                store["leads"] = store["leads"][:500]
                save_store(store)
            self.send_json(201, {"ok": True, "lead": {"id": lead["id"]}})
            return

        if path == "/api/comments" and method == "GET":
            with LOCK:
                store = load_store()
                notes = store.get("comments") or []
            self.send_json(200, {"comments": notes[:40]})
            return

        if path == "/api/comments" and method == "POST":
            body = self.read_json()
            name = str(body.get("name") or "").strip()[:40]
            text = str(body.get("text") or "").strip()[:280]
            if len(name) < 2 or len(text) < 8:
                self.send_json(400, {"error": "Escribe tu nombre y el comentario."})
                return
            note = {
                "id": "cmt_" + secrets.token_hex(4),
                "name": name,
                "text": text,
                "at": now_iso(),
            }
            with LOCK:
                store = load_store()
                store.setdefault("comments", [])
                store["comments"].insert(0, note)
                store["comments"] = store["comments"][:80]
                save_store(store)
            self.send_json(201, {"ok": True, "comment": note})
            return

        if path == "/api/checkout" and method == "POST":
            self.checkout()
            return

        if path == "/api/checkout/simulate" and method == "POST":
            self.simulate_payment()
            return

        if path == "/api/orders/status" and method == "GET":
            reference = (query.get("reference") or [""])[0]
            token = (query.get("token") or [""])[0]
            with LOCK:
                store = load_store()
            order = next((item for item in store["orders"] if item["reference"] == reference), None)
            if not order or not token or not secrets.compare_digest(order.get("publicToken", ""), token):
                self.send_json(404, {"error": "No encontramos ese pedido."})
                return
            self.send_json(200, {"order": public_order(order)})
            return

        if path == "/api/wompi/return" and method == "GET":
            self.wompi_return(query)
            return

        if path == "/api/wompi/events" and method == "POST":
            self.wompi_event()
            return

        if path == "/api/whatsapp/qr" and method == "GET":
            self.whatsapp_qr(query)
            return

        if path == "/api/whatsapp/session" and method == "GET":
            ensure_wa_bridge()
            session = bridge_status()
            self.send_json(200, {
                "ok": True,
                "sessionReady": bool(session.get("connected")),
                "sessionStatus": session.get("status") or "offline",
                "hasQr": bool(session.get("hasQr")),
                "qrAt": session.get("qrAt") or 0,
                "qrUrl": self.base_url() + "/api/whatsapp/qr?mode=session&t=" + str(int(time.time() * 1000)),
                "bridgeError": session.get("lastError") or "",
            })
            return

        if path == "/api/whatsapp/bridge/inbound" and method == "POST":
            self.whatsapp_bridge_inbound()
            return

        if path == "/api/whatsapp/webhook" and method == "GET":
            self.whatsapp_webhook_verify(query)
            return

        if path == "/api/whatsapp/webhook" and method == "POST":
            self.whatsapp_webhook_event()
            return

        if path == "/api/admin/whatsapp" and method == "GET":
            self.whatsapp_admin_get()
            return

        if path == "/api/admin/whatsapp" and method == "POST":
            self.whatsapp_admin_save()
            return

        if path == "/api/admin/whatsapp/send" and method == "POST":
            self.whatsapp_admin_send()
            return

        if path == "/api/admin/whatsapp/logout" and method == "POST":
            self.whatsapp_admin_logout()
            return

        if path == "/api/auth/login" and method == "POST":
            self.login()
            return

        if path == "/api/auth/logout" and method == "POST":
            with LOCK:
                store = load_store()
                user, token = self.current_user(store)
                if token:
                    store["sessions"].pop(token, None)
                    save_store(store)
            self.send_json(200, {"ok": True})
            return

        if path == "/api/auth/password" and method == "POST":
            self.change_password()
            return

        if path == "/api/me" and method == "GET":
            with LOCK:
                store = load_store()
                user, _token = self.current_user(store)
            if not user:
                self.send_json(200, {"user": None})
                return
            self.send_json(200, {"user": {"name": user["name"], "username": user["username"]}})
            return

        if path == "/api/dashboard" and method == "GET":
            self.dashboard()
            return

        if path == "/api/analytics" and method == "GET":
            self.analytics()
            return

        if path == "/api/admin/products" and method == "GET":
            with LOCK:
                store = load_store()
                if not self.require_user(store):
                    return
                products = store["products"]
                movements = store["movements"][-30:]
            self.send_json(200, {"products": products, "movements": list(reversed(movements))})
            return

        if path.startswith("/api/admin/products/") and method == "PUT":
            product_id = path.rsplit("/", 1)[-1]
            self.update_product(product_id)
            return

        if path == "/api/admin/settings" and method == "GET":
            with LOCK:
                store = load_store()
                if not self.require_user(store):
                    return
            cfg = read_config()
            wompi = cfg.get("wompi") or {}
            company = cfg.get("company") or {}
            api = wa_cfg(cfg)
            self.send_json(200, {
                "whatsapp": company.get("whatsapp") or api["phone"] or "",
                "publicKey": wompi.get("publicKey") or "",
                "integritySecret": wompi.get("integritySecret") or "",
                "eventsSecret": wompi.get("eventsSecret") or "",
                "currency": wompi.get("currency") or "COP",
                "wompiReady": wompi_ready(cfg),
                "webhookUrl": self.base_url() + "/api/wompi/events",
                "whatsappReady": wa_ready(cfg),
                "whatsappWebhook": self.base_url() + "/api/whatsapp/webhook",
                "whatsappPhoneNumberId": api["phoneNumberId"],
                "whatsappVerifyToken": api["verifyToken"],
                "whatsappAutoReply": api["autoReply"],
                "whatsappHasToken": bool(api["token"]),
            })
            return

        if path == "/api/admin/settings" and method == "POST":
            self.update_settings()
            return

        if path == "/api/leads" and method == "GET":
            with LOCK:
                store = load_store()
                if not self.require_user(store):
                    return
                leads = store["leads"]
            self.send_json(200, {"leads": leads})
            return

        if path.startswith("/api/leads/") and method == "PATCH":
            lead_id = path.rsplit("/", 1)[-1]
            self.update_lead(lead_id)
            return

        if path == "/api/orders" and method == "GET":
            with LOCK:
                store = load_store()
                if not self.require_user(store):
                    return
                orders = [
                    {key: value for key, value in order.items() if key != "publicToken"}
                    for order in store["orders"]
                ]
            self.send_json(200, {"orders": orders})
            return

        self.send_json(404, {"error": "Ruta no encontrada."})

    def login(self):
        body = self.read_json()
        username = str(body.get("username") or "").strip()
        password = str(body.get("password") or "")
        with LOCK:
            store = load_store()
            user = next((item for item in store["users"] if item["username"] == username), None)
            valid = False
            if user:
                valid = hmac_compare(hash_pw(password, user["salt"]), user["passwordHash"])
            if not valid:
                self.send_json(401, {"error": "Usuario o clave incorrectos."})
                return
            token = secrets.token_urlsafe(32)
            store["sessions"][token] = {
                "userId": user["id"],
                "exp": (datetime.now() + timedelta(hours=14)).replace(microsecond=0).isoformat(),
            }
            # Limpia sesiones vencidas.
            alive = {}
            current = now_iso()
            for key, session in store["sessions"].items():
                if session.get("exp", "") >= current:
                    alive[key] = session
            store["sessions"] = alive
            save_store(store)
        self.send_json(200, {"token": token, "user": {"name": user["name"], "username": user["username"]}})

    def change_password(self):
        body = self.read_json()
        current = str(body.get("current") or "")
        nxt = str(body.get("next") or "")
        if len(nxt) < 8:
            self.send_json(400, {"error": "La clave nueva debe tener al menos 8 caracteres."})
            return
        with LOCK:
            store = load_store()
            user, _token = self.current_user(store)
            if not user:
                self.send_json(401, {"error": "Inicia sesión."})
                return
            if not hmac_compare(hash_pw(current, user["salt"]), user["passwordHash"]):
                self.send_json(400, {"error": "La clave actual no coincide."})
                return
            salt = secrets.token_hex(16)
            user["salt"] = salt
            user["passwordHash"] = hash_pw(nxt, salt)
            save_store(store)
        self.send_json(200, {"ok": True})

    def update_settings(self):
        body = self.read_json()
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            cfg = read_config()
            company = cfg.setdefault("company", {})
            wompi = cfg.setdefault("wompi", {})
            if "whatsapp" in body:
                company["whatsapp"] = "".join(ch for ch in str(body.get("whatsapp") or "") if ch.isdigit())[:15]
            if "publicKey" in body:
                wompi["publicKey"] = str(body.get("publicKey") or "").strip()[:160]
            if "integritySecret" in body:
                wompi["integritySecret"] = str(body.get("integritySecret") or "").strip()[:160]
            if "eventsSecret" in body:
                wompi["eventsSecret"] = str(body.get("eventsSecret") or "").strip()[:160]
            if not wompi.get("currency"):
                wompi["currency"] = "COP"
            write_config(cfg)
        self.send_json(200, {"ok": True, "wompiReady": wompi_ready(cfg)})

    def whatsapp_qr(self, query):
        ensure_wa_bridge()
        mode = (query.get("mode") or [""])[0].strip().lower()
        if mode != "link":
            for _ in range(20):
                png = bridge_qr_png()
                if png:
                    self.send_bytes(200, png, "image/png", {"Cache-Control": "no-store"})
                    return
                status = bridge_status()
                if status.get("connected"):
                    self.send_json(409, {"error": "Ya está vinculado.", "connected": True})
                    return
                time.sleep(0.35)
            if mode == "session":
                self.send_json(404, {"error": "Esperando QR de vinculación.", "status": bridge_status().get("status")})
                return
        phone = (query.get("phone") or [""])[0]
        cfg = wa_cfg()
        digits = "".join(ch for ch in str(phone or cfg["phone"]) if ch.isdigit()) or cfg["phone"]
        png = wa_qr_png(digits)
        if not png:
            self.send_json(500, {"error": "No se pudo generar el QR."})
            return
        self.send_bytes(200, png, "image/png", {"Cache-Control": "no-store"})

    def whatsapp_bridge_inbound(self):
        if self.client_address and self.client_address[0] not in ("127.0.0.1", "::1"):
            self.send_json(403, {"error": "Solo local."})
            return
        body = self.read_json()
        phone = "".join(ch for ch in str(body.get("phone") or "") if ch.isdigit())
        jid = str(body.get("jid") or "").strip()
        text = str(body.get("text") or "").strip()
        name = str(body.get("name") or phone).strip() or phone
        if not phone or not text:
            self.send_json(400, {"error": "Falta teléfono o texto."})
            return
        reply = ""
        media = []
        with LOCK:
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
                "updatedAt": now_iso(),
            })
            if name:
                chat["name"] = name
            if jid:
                chat["jid"] = jid
            if phone and phone != chat.get("phone"):
                chat["phone"] = phone
            chat["messages"].append({
                "id": str(body.get("messageId") or ("m_" + secrets.token_hex(6))),
                "from": "in",
                "text": text,
                "at": now_iso(),
            })
            if api["autoReply"]:
                answer = wa_bot_answer(
                    text,
                    store.get("products") or [],
                    api["phone"],
                    chat.get("lastProductId"),
                )
                reply = answer.get("reply") or ""
                media = answer.get("media") or []
                if answer.get("productId"):
                    chat["lastProductId"] = answer.get("productId")
                note = reply
                if any(item.get("type") == "image" for item in media):
                    note = (reply + "\n[foto]").strip()
                if any(item.get("type") == "document" for item in media):
                    note = (reply + "\n[PDF catálogo]").strip()
                chat["messages"].append({
                    "id": "b_" + secrets.token_hex(6),
                    "from": "out",
                    "text": note,
                    "at": now_iso(),
                    "bot": True,
                })
            chat["updatedAt"] = now_iso()
            chat["messages"] = chat["messages"][-80:]
            save_store(store)
        self.send_json(200, {"ok": True, "reply": reply, "media": media})

    def whatsapp_webhook_verify(self, query):
        mode = (query.get("hub.mode") or [""])[0]
        token = (query.get("hub.verify_token") or [""])[0]
        challenge = (query.get("hub.challenge") or [""])[0]
        expected = wa_cfg()["verifyToken"]
        if mode == "subscribe" and token and secrets.compare_digest(token, expected):
            body = challenge.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        self.send_json(403, {"error": "Verify token inválido."})

    def whatsapp_webhook_event(self):
        body = self.read_json()
        cfg = read_config()
        api = wa_cfg(cfg)
        replies = []
        with LOCK:
            store = load_store()
            chats = store.setdefault("whatsappChats", {})
            for entry in body.get("entry") or []:
                for change in entry.get("changes") or []:
                    value = change.get("value") or {}
                    for msg in value.get("messages") or []:
                        if msg.get("type") != "text":
                            continue
                        sender = str(msg.get("from") or "")
                        text = ((msg.get("text") or {}).get("body") or "").strip()
                        if not sender or not text:
                            continue
                        chat = chats.setdefault(sender, {
                            "id": sender,
                            "name": sender,
                            "phone": sender,
                            "messages": [],
                            "updatedAt": now_iso(),
                        })
                        contacts = {c.get("wa_id"): c for c in (value.get("contacts") or [])}
                        profile = ((contacts.get(sender) or {}).get("profile") or {}).get("name")
                        if profile:
                            chat["name"] = profile
                        chat["messages"].append({
                            "id": msg.get("id") or ("m_" + secrets.token_hex(6)),
                            "from": "in",
                            "text": text,
                            "at": now_iso(),
                        })
                        chat["updatedAt"] = now_iso()
                        chat["messages"] = chat["messages"][-80:]
                        if api["autoReply"]:
                            answer = wa_bot_answer(
                                text,
                                store.get("products") or [],
                                api["phone"],
                                chat.get("lastProductId"),
                            )
                            if answer.get("productId"):
                                chat["lastProductId"] = answer.get("productId")
                            note = answer.get("reply") or ""
                            media = answer.get("media") or []
                            if any(item.get("type") == "image" for item in media):
                                note = (note + "\n[foto]").strip()
                            if any(item.get("type") == "document" for item in media):
                                note = (note + "\n[PDF catálogo]").strip()
                            chat["messages"].append({
                                "id": "b_" + secrets.token_hex(6),
                                "from": "out",
                                "text": note,
                                "at": now_iso(),
                                "bot": True,
                            })
                            replies.append((sender, answer.get("reply") or note))
            save_store(store)
        if api["autoReply"] and api["token"] and api["phoneNumberId"]:
            for to_phone, answer in replies:
                try:
                    wa_graph_send(api["phoneNumberId"], api["token"], to_phone, answer)
                except Exception:
                    pass
        self.send_json(200, {"ok": True})

    def whatsapp_admin_get(self):
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            chats = list((store.get("whatsappChats") or {}).values())
        chats.sort(key=lambda item: item.get("updatedAt") or "", reverse=True)
        cfg = read_config()
        api = wa_cfg(cfg)
        ensure_wa_bridge()
        session = bridge_status()
        session_ready = bool(session.get("connected"))
        has_qr = bool(session.get("hasQr"))
        qr_url = self.base_url() + "/api/whatsapp/qr?mode=session&t=" + str(int(time.time() * 1000))
        if not has_qr and not session_ready:
            qr_url = self.base_url() + "/api/whatsapp/qr?mode=session&wait=1&t=" + str(int(time.time() * 1000))
        me = session.get("me") or {}
        phone = me.get("phone") or api["phone"]
        self.send_json(200, {
            "ready": wa_ready(cfg),
            "sessionReady": session_ready,
            "sessionStatus": session.get("status") or "offline",
            "hasQr": has_qr,
            "qrAt": session.get("qrAt") or 0,
            "bridgeError": session.get("lastError") or "",
            "phone": phone,
            "phoneNumberId": api["phoneNumberId"],
            "verifyToken": api["verifyToken"],
            "autoReply": api["autoReply"],
            "hasToken": bool(api["token"]),
            "webhookUrl": self.base_url() + "/api/whatsapp/webhook",
            "qrUrl": qr_url,
            "openUrl": wa_send_link(api["phone"], "Hola, quiero información de Vinicius Molding"),
            "chats": chats,
        })

    def whatsapp_admin_save(self):
        body = self.read_json()
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            cfg = read_config()
            company = cfg.setdefault("company", {})
            wa = cfg.setdefault("whatsappApi", {})
            if "phone" in body:
                company["whatsapp"] = "".join(ch for ch in str(body.get("phone") or "") if ch.isdigit())[:15]
            if "token" in body:
                token = str(body.get("token") or "").strip()
                if token and token != "********":
                    wa["token"] = token[:500]
            if "phoneNumberId" in body:
                wa["phoneNumberId"] = str(body.get("phoneNumberId") or "").strip()[:80]
            if "verifyToken" in body:
                wa["verifyToken"] = str(body.get("verifyToken") or "vinicius-wa").strip()[:80] or "vinicius-wa"
            if "autoReply" in body:
                wa["autoReply"] = str(body.get("autoReply")).lower() in ("1", "true", "yes", "on", "si", "sí")
            write_config(cfg)
        self.send_json(200, {"ok": True, "ready": wa_ready(cfg)})

    def whatsapp_admin_send(self):
        body = self.read_json()
        to_phone = "".join(ch for ch in str(body.get("to") or "") if ch.isdigit())
        text = str(body.get("text") or "").strip()
        if not to_phone or not text:
            self.send_json(400, {"error": "Falta el número o el mensaje."})
            return
        chat_jid = ""
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            cfg = read_config()
            api = wa_cfg(cfg)
            chats = store.setdefault("whatsappChats", {})
            chat = chats.setdefault(to_phone, {
                "id": to_phone,
                "name": to_phone,
                "phone": to_phone,
                "messages": [],
                "updatedAt": now_iso(),
            })
            chat_jid = chat.get("jid") or ""
            chat["messages"].append({
                "id": "o_" + secrets.token_hex(6),
                "from": "out",
                "text": text,
                "at": now_iso(),
            })
            chat["updatedAt"] = now_iso()
            chat["messages"] = chat["messages"][-80:]
            save_store(store)
        session = bridge_status()
        if session.get("connected"):
            try:
                bridge_request("/send", method="POST", body={"to": to_phone, "jid": chat_jid, "text": text}, timeout=12)
                self.send_json(200, {"ok": True, "via": "session"})
                return
            except Exception as exc:
                self.send_json(502, {"error": "No se pudo enviar por la sesión vinculada.", "detail": str(exc)})
                return
        if api["token"] and api["phoneNumberId"]:
            try:
                wa_graph_send(api["phoneNumberId"], api["token"], to_phone, text)
            except urllib.error.HTTPError as err:
                detail = err.read().decode("utf-8", errors="ignore")
                self.send_json(502, {"error": "WhatsApp API rechazó el envío.", "detail": detail[:400]})
                return
            except Exception as exc:
                self.send_json(502, {"error": "No se pudo enviar por la API.", "detail": str(exc)})
                return
        self.send_json(200, {"ok": True, "via": "local"})

    def whatsapp_admin_logout(self):
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
        ensure_wa_bridge()
        try:
            bridge_request("/logout", method="POST", body={}, timeout=8)
        except Exception as exc:
            self.send_json(502, {"error": "No se pudo cerrar la sesión.", "detail": str(exc)})
            return
        self.send_json(200, {"ok": True})

    def update_product(self, product_id):
        body = self.read_json()
        with LOCK:
            store = load_store()
            user = self.require_user(store)
            if not user:
                return
            product = next((item for item in store["products"] if item["id"] == product_id), None)
            if product is None:
                self.send_json(404, {"error": "Producto no encontrado."})
                return
            before = int(product.get("stock") or 0)
            if "price" in body:
                price = int(body.get("price") or 0)
                if price < 0:
                    self.send_json(400, {"error": "El precio no puede ser negativo."})
                    return
                product["price"] = price
            for key in ("name", "line", "finish", "size", "summary", "description", "sku"):
                if key in body:
                    product[key] = str(body.get(key) or "").strip()[:800]
            if "ingredients" in body:
                raw = body.get("ingredients")
                if isinstance(raw, list):
                    parts = [str(item).strip() for item in raw]
                else:
                    parts = str(raw or "").replace("·", ",").split(",")
                product["ingredients"] = [part[:80] for part in parts if part.strip()][:16]
            image = str(body.get("image") or "")
            if image.startswith("data:image"):
                payload = image.split(",", 1)[1]
                blob = base64.b64decode(payload)
                dest = WEB / "assets" / "products" / f"{product_id}.jpg"
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(blob)
                product["image"] = f"assets/products/{product_id}.jpg"
            if "active" in body:
                product["active"] = bool(body.get("active"))
            if product["stock"] != before:
                store["movements"].append({
                    "id": "mov_" + secrets.token_hex(4),
                    "productId": product["id"],
                    "name": product["name"],
                    "before": before,
                    "after": product["stock"],
                    "reason": "ajuste de inventario",
                    "at": now_iso(),
                })
                store["movements"] = store["movements"][-200:]
            save_store(store)
            saved = dict(product)
        self.send_json(200, {"product": saved})

    def update_lead(self, lead_id):
        body = self.read_json()
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            lead = next((item for item in store["leads"] if item["id"] == lead_id), None)
            if lead is None:
                self.send_json(404, {"error": "Contacto no encontrado."})
                return
            status = str(body.get("status") or lead["status"])
            if status not in ("nuevo", "contactado", "cerrado"):
                self.send_json(400, {"error": "Estado no válido."})
                return
            lead["status"] = status
            if "note" in body:
                lead["note"] = str(body.get("note") or "")[:400]
            save_store(store)
            saved = dict(lead)
        self.send_json(200, {"lead": saved})

    def checkout(self):
        body = self.read_json()
        customer = body.get("customer") or {}
        name = str(customer.get("name") or "").strip()[:80]
        phone = "".join(ch for ch in str(customer.get("phone") or "") if ch.isdigit())
        email = str(customer.get("email") or "").strip()[:120]
        city = str(customer.get("city") or "").strip()[:60]
        address = str(customer.get("address") or "").strip()[:160]
        note = str(customer.get("note") or "").strip()[:300]
        if len(name) < 2 or len(phone) < 7:
            self.send_json(400, {"error": "Nombre y celular son obligatorios para el pago."})
            return
        requested = body.get("items") or []
        if not isinstance(requested, list) or not requested:
            self.send_json(400, {"error": "El carrito está vacío."})
            return
        cfg = read_config()
        wompi = cfg.get("wompi") or {}
        currency = wompi.get("currency") or "COP"
        with LOCK:
            store = load_store()
            items = []
            for raw in requested:
                product = next((item for item in store["products"] if item["id"] == raw.get("id")), None)
                if product is None or not product.get("active", True):
                    self.send_json(400, {"error": "Hay un producto que ya no está disponible."})
                    return
                qty = int(raw.get("qty") or 0)
                if qty < 1 or qty > 20:
                    self.send_json(400, {"error": "Revisa las cantidades del carrito."})
                    return
                if qty > int(product.get("stock") or 0):
                    self.send_json(400, {"error": f"No hay stock suficiente de {product['name']}."})
                    return
                items.append({
                    "id": product["id"],
                    "name": product["name"],
                    "sku": product["sku"],
                    "price": int(product["price"]),
                    "qty": qty,
                    "image": product["image"],
                })
            total = sum(item["price"] * item["qty"] for item in items)
            reference = "VM" + datetime.now().strftime("%y%m%d%H%M%S") + secrets.token_hex(2).upper()
            order = {
                "id": "ord_" + secrets.token_hex(4),
                "reference": reference,
                "publicToken": secrets.token_urlsafe(18),
                "items": items,
                "total": total,
                "currency": currency,
                "customer": {
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "city": city,
                    "address": address,
                    "note": note,
                },
                "status": "pendiente_pago",
                "stockApplied": False,
                "at": now_iso(),
                "updatedAt": now_iso(),
            }
            store["orders"].insert(0, order)
            store["orders"] = store["orders"][:400]
            save_store(store)

        amount_cents = total * 100
        ready = wompi_ready(cfg)
        checkout_url = ""
        if ready:
            signature = integrity_signature(reference, amount_cents, currency, wompi["integritySecret"])
            redirect = self.base_url() + "/api/wompi/return"
            params = {
                "public-key": wompi["publicKey"],
                "currency": currency,
                "amount-in-cents": str(amount_cents),
                "reference": reference,
                "signature:integrity": signature,
                "redirect-url": redirect,
                "customer-data:full-name": name,
                "customer-data:phone-number": phone,
            }
            if email:
                params["customer-data:email"] = email
            if address:
                params["shipping-address:address-line-1"] = address
            if city:
                params["shipping-address:city"] = city
                params["shipping-address:region"] = city
                params["shipping-address:country"] = "CO"
            checkout_url = "https://checkout.wompi.co/p/?" + urllib.parse.urlencode(params)
            with LOCK:
                store = load_store()
                current = next(item for item in store["orders"] if item["reference"] == reference)
                current["amountInCents"] = amount_cents
                current["integrity"] = signature
                save_store(store)

        self.send_json(201, {
            "order": public_order(order),
            "wompiReady": ready,
            "checkoutUrl": checkout_url,
            "amountInCents": amount_cents,
            "currency": currency,
            "reference": reference,
        })

    def simulate_payment(self):
        cfg = read_config()
        if wompi_ready(cfg):
            self.send_json(403, {"error": "Wompi ya está configurado. El pago se confirma con la pasarela."})
            return
        body = self.read_json()
        reference = str(body.get("reference") or "")
        token = str(body.get("token") or "")
        status = str(body.get("status") or "APPROVED").upper()
        if status not in ("APPROVED", "DECLINED"):
            self.send_json(400, {"error": "Estado de simulación no válido."})
            return
        with LOCK:
            store = load_store()
            order = next((item for item in store["orders"] if item["reference"] == reference), None)
            if not order or not token or not secrets.compare_digest(order.get("publicToken", ""), token):
                self.send_json(404, {"error": "No encontramos ese pedido."})
                return
            apply_payment(store, order, status, transaction_id="SIMULADO")
            order["simulated"] = True
            save_store(store)
            saved = public_order(order)
        self.send_json(200, {"order": saved})

    def wompi_return(self, query):
        transaction_id = (query.get("id") or [""])[0]
        cfg = read_config()
        wompi = cfg.get("wompi") or {}
        reference = ""
        token = ""
        if transaction_id and wompi.get("publicKey"):
            try:
                data = fetch_transaction(transaction_id, wompi["publicKey"])
            except Exception:
                data = None
            if data:
                reference = str(data.get("reference") or "")
                status = str(data.get("status") or "")
                with LOCK:
                    store = load_store()
                    order = next((item for item in store["orders"] if item["reference"] == reference), None)
                    if order:
                        apply_payment(store, order, status, transaction_id)
                        token = order.get("publicToken") or ""
                        save_store(store)
        location = self.base_url() + f"/?pedido=1&ref={urllib.parse.quote(reference)}&token={urllib.parse.quote(token)}"
        self.send_response(302)
        self.send_header("Location", location)
        self.send_header("Content-Length", "0")
        self.end_headers()

    def wompi_event(self):
        payload = self.read_json()
        cfg = read_config()
        secret = (cfg.get("wompi") or {}).get("eventsSecret") or ""
        if not secret:
            self.send_json(200, {"ok": False, "reason": "events_secret_missing"})
            return
        if not verify_wompi_event(payload, secret):
            self.send_json(400, {"error": "Firma de evento inválida."})
            return
        data = payload.get("data") or {}
        transaction = data.get("transaction") or data
        reference = str(transaction.get("reference") or "")
        status = str(transaction.get("status") or "")
        transaction_id = str(transaction.get("id") or "")
        with LOCK:
            store = load_store()
            order = next((item for item in store["orders"] if item["reference"] == reference), None)
            if order:
                apply_payment(store, order, status, transaction_id)
                save_store(store)
        self.send_json(200, {"ok": True})

    def dashboard(self):
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            snapshot = build_metrics(store)
        self.send_json(200, snapshot)

    def analytics(self):
        with LOCK:
            store = load_store()
            if not self.require_user(store):
                return
            metrics = build_metrics(store)
            events = list(reversed(store["analytics"]["events"][-80:]))
        self.send_json(200, {"metrics": metrics, "events": events})

    def serve_static(self, path):
        relative = path.lstrip("/") or "index.html"
        target = (WEB / relative).resolve()
        if not str(target).startswith(str(WEB.resolve())):
            self.send_json(403, {"error": "Ruta bloqueada."})
            return
        if target.is_dir():
            target = target / "index.html"
        if not target.exists() or not target.is_file():
            target = WEB / "index.html"
        body = target.read_bytes()
        content_type = MIME.get(target.suffix.lower(), "application/octet-stream")
        self.send_bytes(200, body, content_type, {"Cache-Control": "no-cache"})


def public_order(order):
    return {
        "reference": order["reference"],
        "token": order.get("publicToken"),
        "items": order.get("items"),
        "total": order.get("total"),
        "currency": order.get("currency"),
        "status": order.get("status"),
        "customer": {"name": (order.get("customer") or {}).get("name", "")},
        "at": order.get("at"),
        "simulated": bool(order.get("simulated")),
    }


def build_metrics(store):
    days = []
    product_week = {}
    page_week = {}
    device_week = {}
    visits_week = 0
    sessions_week = set()
    for offset in range(13, -1, -1):
        key = (datetime.now().date() - timedelta(days=offset)).isoformat()
        bucket = store["analytics"]["days"].get(key) or {}
        visits = int(bucket.get("visits") or 0)
        sessions = bucket.get("sessions") or []
        days.append({
            "date": key,
            "label": key[8:10] + "/" + key[5:7],
            "visits": visits,
            "sessions": len(sessions),
        })
        if offset <= 6:
            visits_week += visits
            sessions_week.update(sessions)
            for pid, count in (bucket.get("products") or {}).items():
                product_week[pid] = product_week.get(pid, 0) + int(count)
            for page, count in (bucket.get("pages") or {}).items():
                page_week[page] = page_week.get(page, 0) + int(count)
            for device, count in (bucket.get("devices") or {}).items():
                device_week[device] = device_week.get(device, 0) + int(count)
    today = store["analytics"]["days"].get(today_key()) or {}
    products = store["products"]
    names = {item["id"]: item["name"] for item in products}
    top_week = sorted(product_week.items(), key=lambda pair: pair[1], reverse=True)
    top_all = sorted(products, key=lambda item: int(item.get("views") or 0), reverse=True)
    low = [
        {"id": item["id"], "name": item["name"], "stock": item["stock"], "minStock": item["minStock"], "sku": item["sku"]}
        for item in products
        if int(item.get("stock") or 0) <= int(item.get("minStock") or 0)
    ]
    approved = [order for order in store["orders"] if order.get("status") == "aprobado"]
    revenue = sum(int(order.get("total") or 0) for order in approved)
    units = sum(int(item.get("stock") or 0) for item in products)
    inventory_value = sum(int(item.get("stock") or 0) * int(item.get("price") or 0) for item in products)
    top_product = None
    if top_all and int(top_all[0].get("views") or 0) > 0:
        leader = top_all[0]
        top_product = {"id": leader["id"], "name": leader["name"], "views": leader["views"], "image": leader["image"]}
    return {
        "today": {
            "visits": int(today.get("visits") or 0),
            "sessions": len(today.get("sessions") or []),
        },
        "week": {
            "visits": visits_week,
            "sessions": len(sessions_week),
        },
        "days": days,
        "topProduct": top_product,
        "topWeek": [
            {"id": pid, "name": names.get(pid, pid), "views": count}
            for pid, count in top_week[:6]
        ],
        "topAll": [
            {"id": item["id"], "name": item["name"], "views": int(item.get("views") or 0), "image": item["image"]}
            for item in top_all[:6]
        ],
        "pages": [
            {"path": page, "views": count}
            for page, count in sorted(page_week.items(), key=lambda pair: pair[1], reverse=True)[:8]
        ],
        "devices": device_week,
        "lowStock": low,
        "leadsNew": sum(1 for lead in store["leads"] if lead.get("status") == "nuevo"),
        "leadsTotal": len(store["leads"]),
        "orders": len(store["orders"]),
        "ordersPending": sum(1 for order in store["orders"] if order.get("status") == "pendiente_pago"),
        "revenue": revenue,
        "units": units,
        "inventoryValue": inventory_value,
        "recentOrders": [
            {
                "reference": order["reference"],
                "total": order["total"],
                "status": order["status"],
                "name": (order.get("customer") or {}).get("name", ""),
                "at": order.get("at"),
            }
            for order in store["orders"][:5]
        ],
        "recentLeads": store["leads"][:5],
    }


def main():
    global SERVER_PORT, _bridge_proc
    load_store()
    server = None
    port = 8080
    for candidate in range(8080, 8090):
        try:
            server = ThreadingHTTPServer(("127.0.0.1", candidate), Handler)
            port = candidate
            break
        except OSError:
            continue
    if server is None:
        print("No hay un puerto libre entre 8080 y 8089.")
        return
    SERVER_PORT = port
    ensure_wa_bridge()
    print("")
    print("  Vinicius Molding")
    print(f"  Tienda    http://127.0.0.1:{port}")
    print(f"  Panel     http://127.0.0.1:{port}/#/login")
    print("  Usuario   admin")
    print("  Clave     admin123")
    print("  WhatsApp  vinculación local (QR dispositivos vinculados)")
    print("")
    print("  Detener: Ctrl+C")
    print("", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        server.shutdown()
        if _bridge_proc is not None and _bridge_proc.poll() is None:
            _bridge_proc.terminate()


if __name__ == "__main__":
    main()
