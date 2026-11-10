# Despliegue Vinicius Molding (RackNerd + Cloudflare + Django)

## Qué incluye
- `backend/` Django + Gunicorn (API, WhatsApp inbound, SPA)
- `wa-bridge/` Baileys (WhatsApp vinculado)
- `deploy/docker-compose.yml` Nginx + Postgres + web + bridge
- Perfil `cloudflare` con `cloudflared` (túnel sin abrir puertos)

## Pasos en el VPS (RackNerd)
1. Instala Docker: `bash deploy/bootstrap-vps.sh`
2. Sube el repo a `/opt/vinicius-molding`
3. Copia entorno: `cp .env.example .env` y edita claves/dominio
4. Levanta stack: `docker compose -f deploy/docker-compose.yml up -d --build`
5. En Cloudflare Zero Trust → Tunnels → crea túnel → copia el token a `CLOUDFLARE_TUNNEL_TOKEN`
6. Public hostname: `viniciusmolding.com` → servicio `http://nginx:80`
7. Arranca túnel: `docker compose -f deploy/docker-compose.yml --profile cloudflare up -d cloudflared`
8. Vincula WhatsApp desde el panel (`/#/panel` → QR dispositivos vinculados)

## Local (desarrollo)
- Tienda actual: `python server.py` (puerto 8080) + bridge automático
- Django: `cd backend && python manage.py runserver 8000`
