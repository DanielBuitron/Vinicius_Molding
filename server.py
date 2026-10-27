# -*- coding: utf-8 -*-
"""Sitio comercial Vinicius Molding. Sirve la web y la API local."""

import hashlib
import json
import secrets
import sys
import threading
import urllib.parse
import urllib.request
from datetime import datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
WEB = ROOT / "web"
DATA = ROOT / "data" / "store.json"
LOCK = threading.Lock()

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

SEED_PRODUCTS = [
    {
        "id": "cera-fibra",
        "sku": "VM-CF-150",
        "name": "Cera de fibra",
        "line": "Moldeadora",
        "finish": "Acabado firme",
        "category": "fijacion",
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
        "line": "Moldeadora",
        "finish": "Brillo medio",
        "category": "fijacion",
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
        "line": "Fijación fuerte",
        "finish": "Acabado brillante",
        "category": "fijacion",
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
        "line": "Moldeadora",
        "finish": "Acabado mate",
        "category": "fijacion",
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
        "line": "Vinicius Kids",
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
        "line": "Limpieza",
        "finish": "Uso diario",
        "category": "cuidado",
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
        "line": "Limpieza",
        "finish": "Caspa y picazón",
        "category": "cuidado",
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
        "line": "Tratamiento",
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
        "line": "Tratamiento",
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
        "line": "Higiene",
        "finish": "For men",
        "category": "cuidado",
        "size": "200 g",
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


def hash_pw(password, salt_hex):
    salt = bytes.fromhex(salt_hex)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120_000)
    return digest.hex()


def fresh_store():
    cfg = read_config()
    admin = cfg.get("admin") or {}
    salt = secrets.token_hex(16)
    password = admin.get("password") or "Vinicius.2026"
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
        "orders": [],
        "movements": [],
        "analytics": {"days": {}, "events": []},
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
    store.setdefault("orders", [])
    store.setdefault("movements", [])
    store.setdefault("analytics", {"days": {}, "events": []})
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
        return "http://" + host

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
            if "minStock" in body:
                product["minStock"] = max(0, int(body.get("minStock") or 0))
            if "stock" in body:
                product["stock"] = max(0, int(body.get("stock") or 0))
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
    print("")
    print("  Vinicius Molding")
    print(f"  Tienda    http://127.0.0.1:{port}")
    print(f"  Panel     http://127.0.0.1:{port}/#/login")
    print("  Usuario   admin")
    print("  Clave     la de config.json  (inicial: Vinicius.2026)")
    print("")
    print("  Detener: Ctrl+C")
    print("", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido.")
        server.shutdown()


if __name__ == "__main__":
    main()
