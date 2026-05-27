# Local API-backed MCP checklist

Use this when a Hermes MCP server exposes tools by proxying a local HTTP API, such as a small Node service on `127.0.0.1`.

## Configuration pattern

```yaml
mcp_servers:
  example_api:
    command: "node"
    args:
      - "--env-file=/absolute/path/to/api/.env"
      - "/absolute/path/to/api/mcp/server.js"
    env:
      EXAMPLE_API_BASE_URL: "http://127.0.0.1:3030"
    timeout: 120
    connect_timeout: 60
```

Keep secrets in the API `.env`; do not echo values into chat/logs. It is fine to list key names only.

## Verification sequence

1. Confirm the backing API is reachable:
   ```bash
   curl -sS --max-time 5 http://127.0.0.1:3030/health
   ```
2. Confirm Hermes sees the MCP server:
   ```bash
   hermes mcp list
   hermes mcp test <server_name>
   ```
3. Restart the same profile's gateway/agent; tools are loaded at startup, not hot-reloaded.
4. Call the MCP health tool first, then a real data tool.

## Named profile + system gateway gotcha

If `sudo hermes --profile <profile> gateway restart --system` says the profile does not exist, root is resolving a different Hermes home. Prefer restarting the already-installed systemd unit directly:

```bash
sudo systemctl restart hermes-gateway-<profile>
systemctl status hermes-gateway-<profile> --no-pager
```

The service file usually already contains the correct `User=...`, `ExecStart=... --profile <profile> gateway run --replace`, and `HERMES_HOME=.../profiles/<profile>`.

If a restart hangs at `Gateway Starting...` and prints `No messaging platforms enabled`, stop it with Ctrl+C; it likely used the default profile instead of the named profile.

## Daemonize the backing API

Create a separate systemd service for the local API so MCP tools survive gateway/server restarts:

```ini
[Unit]
Description=Example local API for MCP
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=hermes
Group=hermes
WorkingDirectory=/absolute/path/to/api
Environment=HOME=/home/hermes
Environment=NODE_ENV=production
Environment=PATH=/home/hermes/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
ExecStart=/home/hermes/.local/bin/node --env-file=/absolute/path/to/api/.env /absolute/path/to/api/src/server.js
Restart=always
RestartSec=5
TimeoutStopSec=30
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Install and verify:

```bash
sudo install -o root -g root -m 0644 systemd/example-api.service /etc/systemd/system/example-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now example-api.service
systemctl is-enabled example-api.service
systemctl is-active example-api.service
curl -sS --max-time 5 http://127.0.0.1:3030/health
```

If the service fails immediately while `/health` still works, an old manual process is probably holding the port. Stop the manual process, then restart the service.
