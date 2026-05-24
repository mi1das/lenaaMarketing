import config, { requireMetaConfig } from '../config.js';
import { readPaging, readRange, sendJson, wrapGraphResult } from '../http/response.js';
import {
  fetchAd,
  fetchAdAccountSummary,
  fetchAdDetail,
  fetchAdInsights,
  fetchAds,
  fetchAdset,
  fetchAdsetInsights,
  fetchAdsets,
  fetchAccountInsights,
  fetchCampaign,
  fetchCampaignInsights,
  fetchCampaigns,
  fetchCreative
} from '../meta/ads.js';
import { endpointCatalog } from './catalog.js';

function isAuthorized(req) {
  if (!config.apiKey) return true;
  return req.headers.authorization === `Bearer ${config.apiKey}`;
}

function parsePath(pathname) {
  return pathname.split('/').filter(Boolean);
}

function matchRoute(pathname) {
  const parts = parsePath(pathname);
  if (parts.length === 0) return { name: 'catalog' };
  if (parts.length === 1 && parts[0] === 'health') return { name: 'health' };
  if (parts[0] !== 'ads') return null;

  if (parts.length === 2) {
    if (parts[1] === 'summary') return { name: 'summary' };
    if (parts[1] === 'insights') return { name: 'accountInsights' };
    if (parts[1] === 'campaigns') return { name: 'campaignsList' };
    if (parts[1] === 'adsets') return { name: 'adsetsList' };
    if (parts[1] === 'ads') return { name: 'adsList' };
  }

  if (parts.length === 3) {
    if (parts[1] === 'campaigns') return { name: 'campaignGet', id: parts[2] };
    if (parts[1] === 'adsets') return { name: 'adsetGet', id: parts[2] };
    if (parts[1] === 'ads') return { name: 'adGet', id: parts[2] };
    if (parts[1] === 'creatives') return { name: 'creativeGet', id: parts[2] };
  }

  if (parts.length === 4 && parts[3] === 'insights') {
    if (parts[1] === 'campaigns') return { name: 'campaignInsights', id: parts[2] };
    if (parts[1] === 'adsets') return { name: 'adsetInsights', id: parts[2] };
    if (parts[1] === 'ads') return { name: 'adInsights', id: parts[2] };
  }

  return null;
}

async function handleGraph(res, promise) {
  const result = await promise;
  const payload = wrapGraphResult(result);
  return sendJson(res, payload.ok ? 200 : 502, payload);
}

export async function handleRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = matchRoute(url.pathname);

    if (!route) {
      return sendJson(res, 404, {
        ok: false,
        error: 'not_found',
        endpoints: endpointCatalog.map(({ tool, method, path }) => ({ tool, method, path }))
      });
    }

    if (route.name === 'health') {
      return sendJson(res, 200, {
        ok: true,
        service: 'lenaa-ads-api',
        metaConfigured: Boolean(config.meta.accessToken && config.meta.adAccountId)
      });
    }

    if (!isAuthorized(req)) {
      return sendJson(res, 401, { ok: false, error: 'unauthorized' });
    }

    if (route.name === 'catalog') {
      return sendJson(res, 200, {
        ok: true,
        service: 'lenaa-ads-api',
        endpoints: endpointCatalog
      });
    }

    if (req.method !== 'GET') {
      return sendJson(res, 405, { ok: false, error: 'method_not_allowed' });
    }

    requireMetaConfig();
    const paging = readPaging(url);
    const range = readRange(url);

    switch (route.name) {
      case 'summary': {
        const result = await fetchAdAccountSummary({ range });
        return sendJson(res, result.ok ? 200 : 502, { ok: result.ok, ...result });
      }
      case 'accountInsights':
        return handleGraph(res, fetchAccountInsights({ range, ...paging }));
      case 'campaignsList':
        return handleGraph(res, fetchCampaigns(paging));
      case 'campaignGet':
        return handleGraph(res, fetchCampaign(route.id));
      case 'campaignInsights':
        return handleGraph(res, fetchCampaignInsights(route.id, { range }));
      case 'adsetsList':
        return handleGraph(res, fetchAdsets(paging));
      case 'adsetGet':
        return handleGraph(res, fetchAdset(route.id));
      case 'adsetInsights':
        return handleGraph(res, fetchAdsetInsights(route.id, { range }));
      case 'adsList':
        return handleGraph(res, fetchAds(paging));
      case 'adGet': {
        const result = await fetchAdDetail(route.id);
        return sendJson(res, result.ok ? 200 : 502, result);
      }
      case 'adInsights':
        return handleGraph(res, fetchAdInsights(route.id, { range }));
      case 'creativeGet':
        return handleGraph(res, fetchCreative(route.id));
      default:
        return sendJson(res, 404, { ok: false, error: 'not_found' });
    }
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message });
  }
}
