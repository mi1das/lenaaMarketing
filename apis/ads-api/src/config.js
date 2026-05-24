const config = {
  port: Number(process.env.PORT || 3030),
  host: process.env.HOST || '127.0.0.1',
  apiKey: process.env.ADS_API_KEY || '',
  meta: {
    accessToken: process.env.META_ACCESS_TOKEN || '',
    adAccountId: process.env.META_AD_ACCOUNT_ID || '',
    graphVersion: process.env.META_GRAPH_VERSION || 'v21.0'
  }
};

export function requireMetaConfig() {
  const missing = [];
  if (!config.meta.accessToken) missing.push('META_ACCESS_TOKEN');
  if (!config.meta.adAccountId) missing.push('META_AD_ACCOUNT_ID');
  if (missing.length) {
    throw new Error(`Missing Meta config: ${missing.join(', ')}`);
  }
}

export default config;
