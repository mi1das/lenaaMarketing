export function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

export function wrapGraphResult(result) {
  const error = result.body?.error;
  return {
    ok: result.ok,
    data: result.body?.data ?? result.body ?? null,
    paging: result.body?.paging ?? null,
    error: error?.message || error || null,
    durationMs: result.durationMs,
    source: 'meta'
  };
}

export function readPaging(url) {
  const limit = Number(url.searchParams.get('limit') || 25);
  const after = url.searchParams.get('after') || undefined;
  return {
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 25,
    after
  };
}

export function readRange(url, fallback = '7d') {
  return url.searchParams.get('range') || fallback;
}
