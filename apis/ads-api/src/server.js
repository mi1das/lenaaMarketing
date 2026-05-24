import http from 'node:http';

const PORT = Number(process.env.PORT || 3030);
const HOST = process.env.HOST || '127.0.0.1';
const REQUEST_URL = process.env.TEST_REQUEST_URL || 'https://example.com';
const API_KEY = process.env.ADS_API_KEY || '';

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

function isAuthorized(req) {
  if (!API_KEY) return true;
  return req.headers.authorization === `Bearer ${API_KEY}`;
}

async function sendOutboundRequest() {
  const startedAt = Date.now();
  const response = await fetch(REQUEST_URL, {
    method: 'GET',
    headers: { 'user-agent': 'lenaa-ads-api/0.1.0' }
  });

  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();
  let body = rawBody;

  if (contentType.includes('application/json')) {
    try { body = JSON.parse(rawBody); } catch { body = rawBody; }
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    durationMs: Date.now() - startedAt,
    url: REQUEST_URL,
    contentType,
    body
  };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/health') {
      return sendJson(res, 200, { ok: true, service: 'lenaa-ads-api' });
    }

    if (!isAuthorized(req)) {
      return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    }

    if (url.pathname === '/request-test') {
      const result = await sendOutboundRequest();
      return sendJson(res, result.ok ? 200 : 502, result);
    }

    return sendJson(res, 404, {
      ok: false,
      error: 'not_found',
      availableEndpoints: ['GET /health', 'GET /request-test']
    });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`lenaa-ads-api listening on http://${HOST}:${PORT}`);
  console.log(`request test target: ${REQUEST_URL}`);
});
