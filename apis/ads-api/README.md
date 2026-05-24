# lenaa Ads API

Lokale Node-API als deterministischer Zwischenlayer für Meta Ads-Daten. Jeder Meta-Request ist ein eigener GET-Endpoint — gedacht für MCP-Tools.

## Start

```bash
cd apis/ads-api
cp .env.example .env
npm start
```

## Tool-Discovery

```bash
curl http://127.0.0.1:3030/
```

Liefert alle Endpoints inkl. `tool`-Name für MCP-Registrierung.

## Endpoints

| Tool-Name | Endpoint | Beschreibung |
|---|---|---|
| `ads_health` | `GET /health` | Service-Status |
| `ads_catalog` | `GET /` | Endpoint-Katalog |
| `ads_summary` | `GET /ads/summary?range=7d` | Aggregierter Überblick |
| `ads_account_insights` | `GET /ads/insights?range=7d` | Account-Insights |
| `ads_campaigns_list` | `GET /ads/campaigns?limit=25&after=` | Kampagnenliste |
| `ads_campaign_get` | `GET /ads/campaigns/:id` | Kampagne Detail |
| `ads_campaign_insights` | `GET /ads/campaigns/:id/insights?range=7d` | Kampagnen-Performance |
| `ads_adsets_list` | `GET /ads/adsets?limit=25&after=` | Ad-Set-Liste |
| `ads_adset_get` | `GET /ads/adsets/:id` | Ad-Set inkl. Targeting |
| `ads_adset_insights` | `GET /ads/adsets/:id/insights?range=7d` | Ad-Set-Performance |
| `ads_ads_list` | `GET /ads/ads?limit=25&after=` | Ads-Liste |
| `ads_ad_get` | `GET /ads/ads/:id` | Ad + Creative + AdSet + Insights |
| `ads_ad_insights` | `GET /ads/ads/:id/insights?range=7d` | Ad-Performance |
| `ads_creative_get` | `GET /ads/creatives/:id` | Creative-Details |

Query-Parameter:
- `range`: `7d`, `30d`, `90d`
- `limit`: 1–100 (Default 25)
- `after`: Pagination-Cursor aus `paging.cursors.after`

Optional: `Authorization: Bearer <ADS_API_KEY>` wenn gesetzt.

## Test

```bash
npm run test:request
node --env-file=.env scripts/inspect-ad.js
```

## MCP (Agent-Tools)

Der MCP-Server proxyt alle Endpoints als Tools. **Voraussetzung:** `npm start` läuft parallel.

```bash
npm run mcp
```

### Cursor

Projekt-Config: `.cursor/mcp.json` — Server `lenaa-ads` mit 14 Tools (`ads_summary`, `ads_ad_get`, …).

Nach MCP-Reload in Cursor stehen die Tools dem Agent zur Verfügung.

### Hermes (VPS)

Siehe `hermes-mcp.example.yaml` für den Eintrag in `~/.hermes/config.yaml`.
Tools erscheinen als `mcp_lenaa_ads_ads_summary` etc.

## Config

Siehe `.env.example`. Keine Secrets committen.
