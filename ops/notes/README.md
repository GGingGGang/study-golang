# nginx Markdown Viewer for Obsidian Tutorials

## Path assumptions
- `VAULT_ROOT=/srv/vault` if `/srv/vault/study-golang/tutorials` exists
- Fallback in this environment: `VAULT_ROOT=/home/ubuntu`
- Markdown source: `${VAULT_ROOT}/study-golang/tutorials`

## Deploy commands
```bash
sudo -n install -d -m 755 /var/www/notes
sudo -n install -m 644 ops/notes/index.html /var/www/notes/index.html
sudo -n install -m 644 ops/notes/app.js /var/www/notes/app.js
sudo -n install -m 644 ops/notes/style.css /var/www/notes/style.css
sudo -n install -m 644 ops/notes/README.md /var/www/notes/README.md
sudo -n rm -rf /var/www/notes/content
sudo -n ln -s /home/ubuntu/study-golang/tutorials /var/www/notes/content
```

## nginx integration
`/etc/nginx/sites-available/default` server block must include:
```nginx
include /etc/nginx/snippets/notes_locations.conf;
```

Install snippet:
```bash
sudo -n install -m 644 ops/notes/nginx-notes.conf /etc/nginx/snippets/notes_locations.conf
sudo -n nginx -t
sudo -n systemctl reload nginx
```

## Minimum verification
Localhost allow:
```bash
curl -i http://127.0.0.1/notes/content/00-index.md | sed -n '1,20p'
curl -i http://127.0.0.1/notes/ | sed -n '1,20p'
```

Tailscale allow:
```bash
TS_IP="$(tailscale ip -4 | head -n1)"
curl -i "http://${TS_IP}/notes/content/00-index.md" | sed -n '1,20p'
```

Public network deny (run from non-tailscale client):
```bash
curl -i http://<PUBLIC_IP>/notes/
curl -i http://<PUBLIC_IP>/notes/content/00-index.md
```
Expected: `HTTP/1.1 403 Forbidden`

Browser render check:
```text
http://<SERVER_OR_TAILSCALE_IP>/notes/#00-index.md
http://<SERVER_OR_TAILSCALE_IP>/notes/#01_start/01_%ED%99%98%EA%B2%BD%EC%84%A4%EC%A0%95/README.md
```
