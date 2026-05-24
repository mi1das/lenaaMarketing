import { adAccountPath, graphGet } from './client.js';
import {
  AD_DETAIL_FIELDS,
  AD_LIST_FIELDS,
  ADSET_DETAIL_FIELDS,
  ADSET_LIST_FIELDS,
  CAMPAIGN_DETAIL_FIELDS,
  CAMPAIGN_LIST_FIELDS,
  CREATIVE_FIELDS,
  INSIGHT_DETAIL_FIELDS,
  INSIGHT_SUMMARY_FIELDS
} from './fields.js';

const RANGE_PRESETS = {
  '7d': 'last_7d',
  '30d': 'last_30d',
  '90d': 'last_90d'
};

export function resolveDatePreset(range = '7d') {
  return RANGE_PRESETS[range] || RANGE_PRESETS['7d'];
}

function listParams({ limit = 25, after } = {}) {
  return after ? { limit, after } : { limit };
}

export async function fetchCampaigns(options = {}) {
  return graphGet(`${adAccountPath()}/campaigns`, {
    fields: CAMPAIGN_LIST_FIELDS,
    ...listParams(options)
  });
}

export async function fetchCampaign(campaignId) {
  return graphGet(`/${campaignId}`, { fields: CAMPAIGN_DETAIL_FIELDS });
}

export async function fetchCampaignInsights(campaignId, { range = '7d' } = {}) {
  return graphGet(`/${campaignId}/insights`, {
    fields: INSIGHT_DETAIL_FIELDS,
    date_preset: resolveDatePreset(range)
  });
}

export async function fetchAdsets(options = {}) {
  return graphGet(`${adAccountPath()}/adsets`, {
    fields: ADSET_LIST_FIELDS,
    ...listParams(options)
  });
}

export async function fetchAdset(adsetId) {
  return graphGet(`/${adsetId}`, { fields: ADSET_DETAIL_FIELDS });
}

export async function fetchAdsetInsights(adsetId, { range = '7d' } = {}) {
  return graphGet(`/${adsetId}/insights`, {
    fields: INSIGHT_DETAIL_FIELDS,
    date_preset: resolveDatePreset(range)
  });
}

export async function fetchAds(options = {}) {
  return graphGet(`${adAccountPath()}/ads`, {
    fields: AD_LIST_FIELDS,
    ...listParams(options)
  });
}

export async function fetchAd(adId) {
  return graphGet(`/${adId}`, { fields: AD_DETAIL_FIELDS });
}

export async function fetchAdInsights(adId, { range = '7d' } = {}) {
  return graphGet(`/${adId}/insights`, {
    fields: INSIGHT_DETAIL_FIELDS,
    date_preset: resolveDatePreset(range)
  });
}

export async function fetchCreative(creativeId) {
  return graphGet(`/${creativeId}`, { fields: CREATIVE_FIELDS });
}

export async function fetchAccountInsights({ range = '7d', limit = 25, after } = {}) {
  return graphGet(`${adAccountPath()}/insights`, {
    fields: INSIGHT_SUMMARY_FIELDS,
    date_preset: resolveDatePreset(range),
    level: 'campaign',
    ...listParams({ limit, after })
  });
}

export function summarizeTargeting(targeting = {}) {
  return {
    age_min: targeting.age_min,
    age_max: targeting.age_max,
    genders: targeting.genders,
    geo_locations: targeting.geo_locations,
    publisher_platforms: targeting.publisher_platforms,
    facebook_positions: targeting.facebook_positions,
    instagram_positions: targeting.instagram_positions,
    flexible_spec: targeting.flexible_spec
  };
}

export async function fetchAdDetail(adId) {
  const adResult = await fetchAd(adId);
  if (!adResult.ok) return { ok: false, error: adResult.body?.error?.message || 'ad_fetch_failed' };

  const ad = adResult.body;
  const creativeId = ad.creative?.id;
  const adsetId = ad.adset_id;

  const [creativeResult, adsetResult, insights7d, insights30d] = await Promise.all([
    creativeId ? fetchCreative(creativeId) : null,
    adsetId ? fetchAdset(adsetId) : null,
    fetchAdInsights(adId, { range: '7d' }),
    fetchAdInsights(adId, { range: '30d' })
  ]);

  const adset = adsetResult?.body;
  return {
    ok: true,
    data: {
      ad: {
        id: ad.id,
        name: ad.name,
        status: ad.status,
        effective_status: ad.effective_status,
        campaign_id: ad.campaign_id,
        adset_id: ad.adset_id,
        created_time: ad.created_time,
        updated_time: ad.updated_time,
        preview_shareable_link: ad.preview_shareable_link
      },
      creative: creativeResult?.body || null,
      adset: adset
        ? {
            ...adset,
            targeting_summary: summarizeTargeting(adset.targeting)
          }
        : null,
      insights: {
        last_7d: insights7d.body?.data?.[0] || null,
        last_30d: insights30d.body?.data?.[0] || null
      }
    },
    durationMs: adResult.durationMs,
    source: 'meta'
  };
}

export async function fetchAdAccountSummary({ range = '7d' } = {}) {
  const [campaigns, ads, insights] = await Promise.all([
    fetchCampaigns({ limit: 10 }),
    fetchAds({ limit: 10 }),
    fetchAccountInsights({ range, limit: 10 })
  ]);

  const campaignItems = campaigns.body?.data || [];
  const adItems = ads.body?.data || [];
  const insightItems = insights.body?.data || [];

  const totals = insightItems.reduce(
    (acc, row) => ({
      impressions: acc.impressions + Number(row.impressions || 0),
      clicks: acc.clicks + Number(row.clicks || 0),
      spend: acc.spend + Number(row.spend || 0),
      reach: acc.reach + Number(row.reach || 0)
    }),
    { impressions: 0, clicks: 0, spend: 0, reach: 0 }
  );

  return {
    ok: campaigns.ok && ads.ok && insights.ok,
    range,
    summary: {
      campaignCount: campaignItems.length,
      adCount: adItems.length,
      totals
    },
    campaigns: campaignItems,
    ads: adItems,
    insights: insightItems,
    errors: [campaigns, ads, insights]
      .map((result) => result.body?.error)
      .filter(Boolean)
  };
}
