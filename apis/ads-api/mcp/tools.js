import { z } from 'zod';
import { endpointCatalog } from '../src/routes/catalog.js';

const rangeSchema = z.enum(['7d', '30d', '90d']).optional().describe('Zeitraum: 7d, 30d oder 90d');
const limitSchema = z.number().int().min(1).max(100).optional().describe('Max. Anzahl Ergebnisse (1-100)');
const afterSchema = z.string().optional().describe('Pagination-Cursor aus paging.cursors.after');
const idSchema = z.string().min(1).describe('Meta Object ID');

const toolSchemas = {
  ads_health: z.object({}),
  ads_catalog: z.object({}),
  ads_summary: z.object({ range: rangeSchema }),
  ads_account_insights: z.object({ range: rangeSchema, limit: limitSchema, after: afterSchema }),
  ads_campaigns_list: z.object({ limit: limitSchema, after: afterSchema }),
  ads_campaign_get: z.object({ id: idSchema }),
  ads_campaign_insights: z.object({ id: idSchema, range: rangeSchema }),
  ads_adsets_list: z.object({ limit: limitSchema, after: afterSchema }),
  ads_adset_get: z.object({ id: idSchema }),
  ads_adset_insights: z.object({ id: idSchema, range: rangeSchema }),
  ads_ads_list: z.object({ limit: limitSchema, after: afterSchema }),
  ads_ad_get: z.object({ id: idSchema }),
  ads_ad_insights: z.object({ id: idSchema, range: rangeSchema }),
  ads_creative_get: z.object({ id: idSchema })
};

export const mcpTools = endpointCatalog.map((entry) => ({
  name: entry.tool,
  description: entry.description,
  path: entry.path,
  inputSchema: toolSchemas[entry.tool]
}));
