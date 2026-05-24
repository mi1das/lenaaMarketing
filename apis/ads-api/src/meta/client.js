import config from '../config.js';

function graphBaseUrl() {
  return `https://graph.facebook.com/${config.meta.graphVersion}`;
}

function normalizeAdAccountId(adAccountId) {
  return adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
}

export async function graphGet(path, params = {}) {
  const url = new URL(`${graphBaseUrl()}${path}`);
  url.searchParams.set('access_token', config.meta.accessToken);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const startedAt = Date.now();
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'user-agent': 'lenaa-ads-api/0.1.0' }
  });

  const rawBody = await response.text();
  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    body = { raw: rawBody };
  }

  return {
    ok: response.ok && !body.error,
    status: response.status,
    statusText: response.statusText,
    durationMs: Date.now() - startedAt,
    url: url.toString().replace(config.meta.accessToken, '[REDACTED]'),
    body
  };
}

export function adAccountPath(adAccountId = config.meta.adAccountId) {
  return `/${normalizeAdAccountId(adAccountId)}`;
}
