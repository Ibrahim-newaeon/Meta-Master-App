// funnelMapper.js

const FUNNEL_METRICS = {
  TOF: {
    awareness: [
      'reach', 'impressions', 'frequency', 'cpm', 'cpp',
      'estimated_ad_recall_lift', 'ad_recall_lift_rate'
    ],
    engagement: [
      'clicks', 'unique_clicks', 'ctr', 'unique_ctr', 'cpc',
      'cost_per_unique_click', 'outbound_clicks', 'landing_page_views',
      'cost_per_landing_page_view'
    ],
    video: [
      'video_30_sec_watched_actions', 'video_p100_watched_actions',
      'cost_per_thruplay', 'video_plays_at_25', 'video_plays_at_50',
      'video_plays_at_75', 'video_plays_at_95', 'video_plays_at_100',
      'video_3_sec_watched_actions', 'video_avg_time_watched_actions'
    ],
    social: [
      'post_engagement', 'post_reactions', 'post_comments', 'post_shares',
      'post_saves', 'page_likes', 'cost_per_page_like'
    ]
  },
  
  MOF: {
    onsite: [
      'content_views', 'unique_content_views', 'cost_per_content_view'
    ],
    leadgen: [
      'leads', 'unique_leads', 'cost_per_lead', 'onsite_conversion_lead',
      'onsite_conversion_messaging_conversation_started_7d',
      'cost_per_messaging_conversation_started_7d'
    ],
    consideration: [
      'add_to_cart', 'unique_add_to_cart', 'cost_per_add_to_cart',
      'view_content', 'cost_per_view_content', 'search', 'cost_per_search'
    ],
    app: [
      'app_installs', 'cost_per_app_install', 'mobile_app_actions',
      'cost_per_mobile_app_action'
    ]
  },
  
  BOF: {
    conversion: [
      'purchases', 'unique_purchases', 'website_purchases',
      'offline_purchases', 'cost_per_purchase'
    ],
    revenue: [
      'purchase_roas', 'action_values_purchase', 'revenue',
      'average_order_value'
    ],
    checkout: [
      'initiate_checkout', 'cost_per_initiate_checkout',
      'add_payment_info', 'cost_per_add_payment_info'
    ],
    advanced: [
      'complete_registration', 'cost_per_complete_registration',
      'contact', 'cost_per_contact', 'subscribe', 'cost_per_subscribe'
    ],
    offline: [
      'offline_conversion_purchases', 'store_visit_actions',
      'cost_per_store_visit'
    ]
  }
};

const CAMPAIGN_GOAL_MAPPING = {
  'REACH': 'awareness',
  'BRAND_AWARENESS': 'awareness',
  'VIDEO_VIEWS': 'awareness',
  'TRAFFIC': 'traffic',
  'ENGAGEMENT': 'consideration',
  'APP_INSTALLS': 'app_installs',
  'LEAD_GENERATION': 'leads',
  'MESSAGES': 'leads',
  'CONVERSIONS': 'sales',
  'PRODUCT_CATALOG_SALES': 'sales',
  'STORE_VISITS': 'sales'
};

class FunnelMapper {
  
  getFunnelStage(objective, actions = []) {
    // Primary mapping based on objective
    const goal = this.getCampaignGoal(objective);
    
    if (['awareness'].includes(goal)) return 'TOF';
    if (['traffic', 'consideration', 'app_installs'].includes(goal)) return 'MOF';
    if (['leads', 'sales'].includes(goal)) return 'BOF';
    
    // Secondary: infer from action types if objective is generic
    if (actions.length > 0) {
      const hasConversions = actions.some(a => 
        ['purchase', 'lead', 'complete_registration'].includes(a.action_type)
      );
      if (hasConversions) return 'BOF';
      
      const hasConsideration = actions.some(a =>
        ['add_to_cart', 'view_content', 'landing_page_view'].includes(a.action_type)
      );
      if (hasConsideration) return 'MOF';
    }
    
    return 'TOF'; // Default
  }

  getCampaignGoal(objective) {
    return CAMPAIGN_GOAL_MAPPING[objective] || 'traffic';
  }

  getMetricsForFunnel(stage) {
    if (stage === 'All') {
      return this.getAllMetrics();
    }
    return Object.values(FUNNEL_METRICS[stage] || {}).flat();
  }

  getAllMetrics() {
    const all = [];
    ['TOF', 'MOF', 'BOF'].forEach(stage => {
      Object.values(FUNNEL_METRICS[stage]).forEach(metrics => {
        all.push(...metrics);
      });
    });
    return [...new Set(all)]; // Remove duplicates
  }

  categorizeMetricsByFunnel() {
    return FUNNEL_METRICS;
  }

  getCampaignGoals() {
    return {
      'awareness': 'Awareness',
      'traffic': 'Traffic',
      'consideration': 'Consideration',
      'leads': 'Leads',
      'sales': 'Sales',
      'app_installs': 'App Installs'
    };
  }
}

module.exports = new FunnelMapper();