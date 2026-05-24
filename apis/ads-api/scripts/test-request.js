const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3030';

const response = await fetch(`${baseUrl}/request-test`);
const body = await response.json();

console.log(JSON.stringify({
  status: response.status,
  ok: response.ok,
  outboundStatus: body.status,
  outboundOk: body.ok,
  target: body.url,
  durationMs: body.durationMs
}, null, 2));

if (!response.ok || !body.ok) process.exit(1);
