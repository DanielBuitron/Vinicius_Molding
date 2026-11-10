#!/usr/bin/env bash
set -euo pipefail

# Uso en RackNerd (Ubuntu/Debian):
#   curl -fsSL ... | bash   ó   bash deploy/bootstrap-vps.sh

if [[ $EUID -ne 0 ]]; then
  echo "Ejecuta como root: sudo bash deploy/bootstrap-vps.sh"
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl git ufw

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi

systemctl enable --now docker
ufw allow OpenSSH || true
ufw --force enable || true

APP_DIR=/opt/vinicius-molding
mkdir -p "$APP_DIR"
echo "Clona o sube el repo en $APP_DIR"
echo "Luego:"
echo "  cd $APP_DIR"
echo "  cp .env.example .env && nano .env"
echo "  docker compose -f deploy/docker-compose.yml up -d --build"
echo "  docker compose -f deploy/docker-compose.yml --profile cloudflare up -d cloudflared"
echo ""
echo "En Cloudflare Tunnel apunta el hostname a http://nginx:80 (si cloudflared va en compose)"
echo "o a http://127.0.0.1:80 si cloudflared corre en el host."
