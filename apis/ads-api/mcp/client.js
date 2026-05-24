const baseUrl = (process.env.ADS_API_BASE_URL || 'http://127.0.0.1:3030').replace(/\/$/, '');
const apiKey = process.env.ADS_API_KEY || '';

export async function callAdsApi(path) {
  const headers = { accept: 'application/json' };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;

  const response = await fetch(`${baseUrl}${path}`, { headers });
  const text = await response.text();

  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }

  return {
    ok: response.ok && body.ok !== false,
    status: response.status,
    body
  };
}

export function buildPath(template, params = {}) {
  let path = template;

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (path.includes(`:${key}`)) {
      path = path.replace(`:${key}`, encodeURIComponent(String(value)));
    }
  }

  const url = new URL(path, 'http://local');
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    if (!template.includes(`:${key}`)) {
      url.searchParams.set(key, String(value));
    }
  }

  const query = url.searchParams.toString();
  return query ? `${url.pathname}?${query}` : url.pathname;
}
