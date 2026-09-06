# Docker Deployment

The production-shaped stack runs the two web applications behind one Nginx
container. The public host mapping is:

| Host                           | Application | Internal port |
| ------------------------------ | ----------- | ------------: |
| `client-view.<base-domain>`    | `apps/web`  |        `3003` |
| `operation-view.<base-domain>` | `apps/team` |        `3004` |

The containers listen on port `3000` internally. Nginx exposes port `80` and
routes by the `Host` header. The API is available to the browser at `/api` and
is routed internally to the API container on port `4040`.

## DNS

Create these A records at the DNS provider, replacing `example.com` with the
actual parent domain:

```text
client-view.example.com     A    134.185.84.235
operation-view.example.com  A    134.185.84.235
```

No AAAA records should be added until an IPv6 address is assigned. The current
domain records intentionally leave IPv6 empty.

## Start

On the server, install Docker and Corepack, then run:

```bash
cp .env.example .env
```

Set `DEPLOY_BASE_DOMAIN` to the real parent domain and replace
`AUTH_SECRET`, database credentials, and admin email settings before starting
the stack:

```bash
corepack pnpm install --frozen-lockfile
docker compose --env-file .env -f infrastructure/docker-compose.yml up -d --build
docker compose --env-file .env -f infrastructure/docker-compose.yml ps
```

If another reverse proxy already owns port `80`, set `NGINX_HTTP_PORT=8080` in
`.env` and place that existing proxy in front of Virtus, or stop it before
starting this Nginx service. Public DNS traffic must ultimately reach the
Virtus Nginx listener on port `80`.

On the current host, the existing Caddy instance owns ports `80` and `443`.
Its `/home/ubuntu/ai/Caddyfile` now forwards matching
`client-view.*` and `operation-view.*` hosts to the Virtus Nginx listener on
`host.docker.internal:8080`. This keeps the existing AI, portfolio, and n8n
routes intact.

Verify host routing from the server before DNS propagation:

```bash
curl -H 'Host: client-view.example.com' http://127.0.0.1/
curl -H 'Host: operation-view.example.com' http://127.0.0.1/
```

## HTTPS

The included Nginx configuration is HTTP-only so it can start without
certificates. Before exposing the stack to real users, terminate HTTPS at this
Nginx instance using certificates issued for both hostnames, or put a
trusted TLS load balancer in front of it. Port `443` is intentionally not
published until certificates and renewal are configured.
