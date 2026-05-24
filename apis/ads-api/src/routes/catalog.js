export const endpointCatalog = [
  {
    tool: 'ads_health',
    method: 'GET',
    path: '/health',
    description: 'Service-Status und ob Meta-Credentials gesetzt sind.',
    auth: false
  },
  {
    tool: 'ads_catalog',
    method: 'GET',
    path: '/',
    description: 'Liste aller verfügbaren Ads-API Endpoints (Tool-Discovery).',
    auth: true
  },
  {
    tool: 'ads_summary',
    method: 'GET',
    path: '/ads/summary',
    query: { range: '7d | 30d | 90d' },
    description: 'Aggregierter Überblick: Kampagnen, Ads und Insights-Totals.'
  },
  {
    tool: 'ads_account_insights',
    method: 'GET',
    path: '/ads/insights',
    query: { range: '7d | 30d | 90d', limit: 'number', after: 'cursor' },
    description: 'Account-Insights auf Kampagnen-Ebene.'
  },
  {
    tool: 'ads_campaigns_list',
    method: 'GET',
    path: '/ads/campaigns',
    query: { limit: 'number', after: 'cursor' },
    description: 'Alle Kampagnen im Ad Account.'
  },
  {
    tool: 'ads_campaign_get',
    method: 'GET',
    path: '/ads/campaigns/:id',
    description: 'Details einer einzelnen Kampagne.'
  },
  {
    tool: 'ads_campaign_insights',
    method: 'GET',
    path: '/ads/campaigns/:id/insights',
    query: { range: '7d | 30d | 90d' },
    description: 'Performance-Insights für eine Kampagne.'
  },
  {
    tool: 'ads_adsets_list',
    method: 'GET',
    path: '/ads/adsets',
    query: { limit: 'number', after: 'cursor' },
    description: 'Alle Ad Sets im Ad Account.'
  },
  {
    tool: 'ads_adset_get',
    method: 'GET',
    path: '/ads/adsets/:id',
    description: 'Ad-Set Details inkl. Targeting.'
  },
  {
    tool: 'ads_adset_insights',
    method: 'GET',
    path: '/ads/adsets/:id/insights',
    query: { range: '7d | 30d | 90d' },
    description: 'Performance-Insights für ein Ad Set.'
  },
  {
    tool: 'ads_ads_list',
    method: 'GET',
    path: '/ads/ads',
    query: { limit: 'number', after: 'cursor' },
    description: 'Alle Ads inkl. Creative-Text.'
  },
  {
    tool: 'ads_ad_get',
    method: 'GET',
    path: '/ads/ads/:id',
    description: 'Vollständige Ad-Ansicht: Ad, Creative, Ad Set und Insights (7d + 30d).'
  },
  {
    tool: 'ads_ad_insights',
    method: 'GET',
    path: '/ads/ads/:id/insights',
    query: { range: '7d | 30d | 90d' },
    description: 'Performance-Insights für eine einzelne Ad.'
  },
  {
    tool: 'ads_creative_get',
    method: 'GET',
    path: '/ads/creatives/:id',
    description: 'Creative-Details inkl. Text, CTA und Thumbnail.'
  }
];
