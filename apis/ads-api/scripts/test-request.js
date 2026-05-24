const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3030';
const apiKey = process.env.ADS_API_KEY || '';
const endpoint = process.env.TEST_ENDPOINT || '/ads/summary?range=7d';

const headers = {};
if (apiKey) headers.authorization = `Bearer ${apiKey}`;

const response = await fetch(`${baseUrl}${endpoint}`, { headers });
const body = await response.json();

console.log(JSON.stringify({
  status: response.status,
  ok: response.ok,
  endpoint,
  serviceOk: body.ok,
  summary: body.summary,
  error: body.error || body.errors?.[0]?.message,
  campaignSample: body.campaigns?.slice?.(0, 2) || body.body?.data?.slice?.(0, 2)
}, null, 2));

if (!response.ok || body.ok === false) process.exit(1);
