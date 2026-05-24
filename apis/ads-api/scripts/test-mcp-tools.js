import { buildPath, callAdsApi } from '../mcp/client.js';
import { mcpTools } from '../mcp/tools.js';

async function runTool(name, args = {}) {
  const tool = mcpTools.find((entry) => entry.name === name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);

  const path = buildPath(tool.path, args);
  const result = await callAdsApi(path);
  return { tool: name, path, ok: result.ok, status: result.status, body: result.body };
}

const summary = await runTool('ads_summary', { range: '7d' });
const ad = await runTool('ads_ad_get', { id: '120246154998080636' });
const catalog = await runTool('ads_catalog');

console.log(JSON.stringify({ summary, adId: ad.body?.data?.ad?.id, catalogCount: catalog.body?.endpoints?.length }, null, 2));

if (!summary.ok || !ad.ok || !catalog.ok) process.exit(1);
