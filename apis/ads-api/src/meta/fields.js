export const CAMPAIGN_LIST_FIELDS =
  'id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time';

export const CAMPAIGN_DETAIL_FIELDS =
  'id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time,buying_type,special_ad_categories';

export const ADSET_LIST_FIELDS =
  'id,name,status,campaign_id,daily_budget,lifetime_budget,optimization_goal,billing_event,start_time,end_time';

export const ADSET_DETAIL_FIELDS =
  'id,name,status,campaign_id,daily_budget,lifetime_budget,optimization_goal,billing_event,targeting,start_time,end_time';

export const AD_LIST_FIELDS =
  'id,name,status,effective_status,campaign_id,adset_id,creative{id,name,title,body}';

export const AD_DETAIL_FIELDS =
  'id,name,status,effective_status,configured_status,campaign_id,adset_id,creative,created_time,updated_time,preview_shareable_link';

export const CREATIVE_FIELDS =
  'id,name,title,body,call_to_action_type,thumbnail_url,image_url,object_story_spec';

export const INSIGHT_SUMMARY_FIELDS =
  'impressions,clicks,spend,reach,cpc,cpm,ctr,campaign_name,campaign_id';

export const INSIGHT_DETAIL_FIELDS =
  'impressions,clicks,spend,reach,cpc,cpm,ctr,frequency,actions,cost_per_action_type';
