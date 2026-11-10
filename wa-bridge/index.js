"use strict";

const http = require("http");
const path = require("path");
const fs = require("fs");
const qrcode = require("qrcode");
const pino = require("pino");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");

const PORT = Number(process.env.WA_BRIDGE_PORT || 3100);
const API = (process.env.VM_API || "http://127.0.0.1:8080").replace(/\/$/, "");
const AUTH = path.join(__dirname, "auth");
const log = pino({ level: "silent" });

fs.mkdirSync(AUTH, { recursive: true });

const session = {
  status: "starting",
  qr: null,
  qrPng: null,
  qrAt: 0,
  me: null,
  lastError: null,
};

let sock = null;
let restartTimer = null;

function jidPhone(jid) {
  return String(jid || "").split("@")[0].split(":")[0].replace(/\D/g, "");
}

function contactFromMessage(msg) {
  const key = msg.key || {};
  const jid = key.remoteJid || "";
  const alt = key.remoteJidAlt || key.participantAlt || key.senderPn || "";
  const phone = jidPhone(alt) || jidPhone(jid);
  return {
    jid,
    phone,
    name: msg.pushName || phone,
  };
}

function msgText(msg) {
  const m = msg.message || {};
  return (
    m.conversation ||
    (m.extendedTextMessage && m.extendedTextMessage.text) ||
    (m.imageMessage && m.imageMessage.caption) ||
    (m.videoMessage && m.videoMessage.caption) ||
    ""
  ).trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function postJson(url, body, timeoutMs) {
  return new Promise((resolve, reject) => {
    const raw = JSON.stringify(body || {});
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.pathname + u.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(raw),
          "X-VM-Bridge": "1",
        },
        timeout: timeoutMs || 60000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data || "{}"));
          } catch (err) {
            resolve({ raw: data });
          }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.write(raw);
    req.end();
  });
}

async function sendMediaItem(dest, item) {
  const filePath = item && item.path;
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error("Archivo no encontrado: " + filePath);
  }
  const stat = fs.statSync(filePath);
  if (!stat.size) throw new Error("Archivo vacío: " + filePath);
  // Buffer local: en Windows las rutas con espacios fallan con { url: path }.
  const buffer = fs.readFileSync(filePath);
  await sleep(350);
  if (item.type === "image") {
    await sock.sendMessage(dest, {
      image: buffer,
      caption: String(item.caption || "").slice(0, 900),
      mimetype: item.mimetype || "image/jpeg",
    });
    return;
  }
  if (item.type === "document") {
    await sock.sendMessage(dest, {
      document: buffer,
      mimetype: item.mimetype || "application/pdf",
      fileName: item.filename || "Vinicius-Molding.pdf",
    });
    return;
  }
  throw new Error("Tipo de media no soportado");
}

async function setQr(text) {
  session.qr = text;
  session.status = "qr";
  session.qrAt = Date.now();
  session.qrPng = await qrcode.toBuffer(text, {
    type: "png",
    width: 512,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#111b21", light: "#ffffff" },
  });
}

function clearQr() {
  session.qr = null;
  session.qrPng = null;
  session.qrAt = 0;
}

function scheduleRestart(ms) {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(() => {
    restartTimer = null;
    startSock().catch((err) => {
      session.lastError = String(err && err.message ? err.message : err);
      scheduleRestart(5000);
    });
  }, ms);
}

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH);
  const { version } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, log),
    },
    logger: log,
    printQRInTerminal: false,
    syncFullHistory: false,
    markOnlineOnConnect: false,
    browser: ["Vinicius Molding", "Chrome", "120.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      try {
        await setQr(qr);
      } catch (err) {
        session.lastError = String(err && err.message ? err.message : err);
      }
    }
    if (connection === "open") {
      clearQr();
      session.status = "connected";
      session.lastError = null;
      const id = sock.user && sock.user.id;
      session.me = {
        id,
        phone: jidPhone(id),
        name: (sock.user && sock.user.name) || "",
      };
    }
    if (connection === "close") {
      const code =
        lastDisconnect &&
        lastDisconnect.error &&
        lastDisconnect.error.output &&
        lastDisconnect.error.output.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;
      clearQr();
      session.me = null;
      if (loggedOut) {
        session.status = "logged_out";
        try {
          fs.rmSync(AUTH, { recursive: true, force: true });
          fs.mkdirSync(AUTH, { recursive: true });
        } catch (_) {}
        scheduleRestart(1200);
      } else {
        session.status = "reconnecting";
        scheduleRestart(2500);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages || []) {
      try {
        if (!msg || !msg.message || msg.key.fromMe) continue;
        const jid = msg.key.remoteJid || "";
        if (!jid || jid.endsWith("@g.us") || jid === "status@broadcast") continue;
        const text = msgText(msg);
        if (!text) continue;
        const contact = contactFromMessage(msg);
        let answer = "";
        let media = [];
        try {
          const res = await postJson(API + "/api/whatsapp/bridge/inbound", {
            phone: contact.phone,
            name: contact.name,
            jid: contact.jid,
            text,
            messageId: msg.key.id || "",
          });
          answer = (res && res.reply) || "";
          media = (res && res.media) || [];
        } catch (_) {}
        // Primero archivos (foto/PDF), luego texto: si falla la foto el usuario no cree que ya llegó.
        const mediaItems = Array.isArray(media) ? media : [];
        let mediaOk = 0;
        for (const item of mediaItems) {
          try {
            await sendMediaItem(jid, item);
            mediaOk += 1;
            await sleep(400);
          } catch (mediaErr) {
            session.lastError = String(mediaErr && mediaErr.message ? mediaErr.message : mediaErr);
          }
        }
        if (mediaItems.length && !mediaOk) {
          try {
            await sock.sendMessage(jid, {
              text: "No pude adjuntar la foto ahora. ¿Me la pides otra vez en un momento?",
            });
          } catch (_) {}
        }
        if (answer) {
          await sock.sendMessage(jid, { text: String(answer).slice(0, 3500) });
        }
      } catch (err) {
        session.lastError = String(err && err.message ? err.message : err);
      }
    }
  });
}

function resolveDest(to, jid) {
  const target = String(jid || to || "").trim();
  if (!target) throw new Error("Falta destino.");
  if (target.includes("@")) return target;
  const digits = target.replace(/\D/g, "");
  if (!digits) throw new Error("Falta destino.");
  // LIDs de WhatsApp suelen ser largos; celulares reales <= 13 dígitos (con país).
  if (digits.length >= 14) return digits + "@lid";
  return digits + "@s.whatsapp.net";
}

async function sendText(to, text, jid) {
  if (!sock || session.status !== "connected") {
    throw new Error("WhatsApp no está vinculado.");
  }
  if (!text) throw new Error("Falta texto.");
  const dest = resolveDest(to, jid);
  await sock.sendMessage(dest, { text: String(text) });
  return { ok: true };
}

async function deliverOutbound(body) {
  if (!sock || session.status !== "connected") {
    throw new Error("WhatsApp no está vinculado.");
  }
  const dest = resolveDest(body.to, body.jid);
  if (body.text) {
    await sock.sendMessage(dest, { text: String(body.text).slice(0, 3500) });
  }
  for (const item of body.media || []) {
    await sendMediaItem(dest, item);
  }
  return { ok: true };
}

async function logout() {
  try {
    if (sock) await sock.logout();
  } catch (_) {}
  try {
    fs.rmSync(AUTH, { recursive: true, force: true });
    fs.mkdirSync(AUTH, { recursive: true });
  } catch (_) {}
  session.status = "logged_out";
  session.me = null;
  clearQr();
  scheduleRestart(800);
  return { ok: true };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error("payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, code, obj) {
  const body = Buffer.from(JSON.stringify(obj), "utf8");
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, "http://127.0.0.1");
    if (req.method === "GET" && u.pathname === "/health") {
      return sendJson(res, 200, { ok: true, status: session.status });
    }
    if (req.method === "GET" && u.pathname === "/status") {
      return sendJson(res, 200, {
        ok: true,
        status: session.status,
        connected: session.status === "connected",
        hasQr: Boolean(session.qr),
        qrAt: session.qrAt,
        me: session.me,
        lastError: session.lastError,
      });
    }
    if (req.method === "GET" && u.pathname === "/qr.png") {
      if (!session.qrPng) {
        res.writeHead(404, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        return res.end(JSON.stringify({ error: "Sin QR todavía." }));
      }
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": session.qrPng.length,
        "Cache-Control": "no-store",
      });
      return res.end(session.qrPng);
    }
    if (req.method === "POST" && u.pathname === "/send") {
      const body = await readBody(req);
      if (body.media && body.media.length) {
        await deliverOutbound(body);
      } else {
        await sendText(body.to, body.text, body.jid);
      }
      return sendJson(res, 200, { ok: true });
    }
    if (req.method === "POST" && u.pathname === "/logout") {
      await logout();
      return sendJson(res, 200, { ok: true });
    }
    sendJson(res, 404, { error: "not found" });
  } catch (err) {
    sendJson(res, 500, { error: String(err && err.message ? err.message : err) });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Vinicius WA bridge en http://127.0.0.1:" + PORT);
  startSock().catch((err) => {
    session.lastError = String(err && err.message ? err.message : err);
    scheduleRestart(4000);
  });
});
