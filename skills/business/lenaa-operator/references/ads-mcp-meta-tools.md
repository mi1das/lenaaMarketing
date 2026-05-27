# lenaa Ads API — MCP Meta tools pattern

Use this reference when Sahajit has built or asks to verify an MCP layer for Meta Ads access.

## Expected repo-tracked location

When the API is kept inside the lenaamarketing profile Git repo:

```text
/home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api
```

Common files:

- `src/server.js` — local Node HTTP API
- `src/routes/catalog.js` — endpoint/tool catalog
- `mcp/server.js` — stdio MCP server
- `mcp/tools.js` — MCP tool schemas
- `mcp/client.js` — calls local Ads API
- `hermes-mcp.example.yaml` — config fragment for Hermes
- `.env.example` — non-secret config template
- `.env` — real local secrets, gitignored

## 14 Meta Ads MCP tools seen in this setup

```text
ads_health
ads_catalog
ads_summary
ads_account_insights
ads_campaigns_list
ads_campaign_get
ads_campaign_insights
ads_adsets_list
ads_adset_get
ads_adset_insights
ads_ads_list
ads_ad_get
ads_ad_insights
ads_creative_get
```

Hermes tool names become prefixed after native MCP registration, e.g.:

```text
mcp_lenaa_ads_ads_summary
mcp_lenaa_ads_ads_ad_get
```

## Verification sequence

1. Check dependencies:

```bash
cd /home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api
npm install
```

2. Start the local API:

```bash
npm start
```

3. Verify catalog before trying Meta calls:

```bash
curl -sS http://127.0.0.1:3030/health
curl -sS http://127.0.0.1:3030/
```

Expected catalog count: 14 endpoints/tools.

4. Run MCP proxy test:

```bash
npm run test:mcp
```

If Meta credentials are missing, the MCP plumbing can still be considered partially verified when the catalog works and the tool call reaches the API, but Meta data calls return:

```text
Missing Meta config: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
```

## Hermes activation

Add the fragment from `hermes-mcp.example.yaml` to the active profile config (`/home/hermes/.hermes/profiles/lenaamarketing/config.yaml`) under `mcp_servers`, then restart Hermes/Gateway. `hermes mcp list` should no longer say `No MCP servers configured`.

Example shape:

```yaml
mcp_servers:
  lenaa_ads:
    command: "node"
    args:
      - "--env-file=/home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api/.env"
      - "/home/hermes/.hermes/profiles/lenaamarketing/apis/ads-api/mcp/server.js"
    env:
      ADS_API_BASE_URL: "http://127.0.0.1:3030"
    timeout: 120
    connect_timeout: 60
```

## Pitfalls

- Do not confuse Cursor MCP config with Hermes MCP config. Cursor can see `.cursor/mcp.json`; Hermes needs `mcp_servers` in the active Hermes profile config and a restart.
- Native MCP tool discovery happens at Hermes startup; new MCP tools will not appear mid-session.
- Keep `.env` out of Git. Commit `.env.example` and `hermes-mcp.example.yaml` only.
- For Ads analysis, never claim live performance unless a Meta MCP/API call succeeded or the user provided the data.
