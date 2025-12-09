// metaClient.js
const axios = require('axios');

class MetaClient {
  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN;
    this.apiVersion = process.env.META_API_VERSION || 'v21.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  async fetchCampaigns(accountId, params = {}) {
    const url = `${this.baseUrl}/${accountId}/campaigns`;
    const response = await axios.get(url, {
      params: {
        access_token: this.accessToken,
        fields: 'id,name,objective,status,effective_status,daily_budget,lifetime_budget',
        limit: 500,
        ...params
      }
    });
    return response.data;
  }

  async fetchInsights(accountId, params = {}) {
    const url = `${this.baseUrl}/${accountId}/insights`;
    
    const defaultParams = {
      access_token: this.accessToken,
      level: 'campaign',
      time_range: params.time_range || {
        since: params.date_from || '2024-01-01',
        until: params.date_to || '2024-12-31'
      },
      fields: this._getInsightsFields(params.funnel_stage),
      limit: 500
    };

    const response = await axios.get(url, {
      params: { ...defaultParams, ...params }
    });

    return response.data;
  }

  async fetchAudienceInsights(accountId, breakdownType, params = {}) {
    const breakdowns = this._getBreakdownsForType(breakdownType);
    
    const url = `${this.baseUrl}/${accountId}/insights`;
    const response = await axios.get(url, {
      params: {
        access_token: this.accessToken,
        level: 'account',
        breakdowns: breakdowns.join(','),
        time_range: {
          since: params.date_from,
          until: params.date_to
        },
        fields: this._getAudienceFields(),
        limit: 1000,
        ...params
      }
    });

    return response.data;
  }

  _getInsightsFields(funnelStage = 'All') {
    const baseFields = [
      'campaign_id', 'campaign_name', 'objective',
      'spend', 'impressions', 'reach', 'frequency',
      'clicks', 'unique_clicks', 'ctr', 'unique_ctr', 'cpc',
      'cpm', 'cpp', 'actions', 'action_values', 'cost_per_action_type',
      'conversions', 'cost_per_conversion'
    ];

    const tofFields = [
      'estimated_ad_recall_lift', 'cost_per_estimated_ad_recalled',
      'video_30_sec_watched_actions', 'video_p100_watched_actions',
      'cost_per_thruplay', 'post_engagement'
    ];

    const mofFields = [
      'landing_page_views', 'cost_per_landing_page_view',
      'onsite_conversion_post_save', 'onsite_conversion_view_content',
      'cost_per_action_type'
    ];

    const bofFields = [
      'purchase_roas', 'website_purchase_roas'
    ];

    if (funnelStage === 'TOF') return [...baseFields, ...tofFields];
    if (funnelStage === 'MOF') return [...baseFields, ...mofFields];
    if (funnelStage === 'BOF') return [...baseFields, ...bofFields];
    
    return [...baseFields, ...tofFields, ...mofFields, ...bofFields];
  }

  _getAudienceFields() {
    return [
      'spend', 'impressions', 'reach', 'frequency',
      'clicks', 'ctr', 'cpc', 'cpm',
      'actions', 'action_values', 'conversions',
      'cost_per_conversion', 'purchase_roas'
    ].join(',');
  }

  _getBreakdownsForType(type) {
    const breakdownMap = {
      'demographics': ['age', 'gender'],
      'location': ['country', 'region', 'dma'],
      'device': ['device_platform', 'impression_device'],
      'platform': ['publisher_platform', 'platform_position'],
      'placement': ['publisher_platform', 'platform_position']
    };

    return breakdownMap[type] || ['age', 'gender'];
  }

  async fetchAdSets(accountId, campaignId) {
    const url = `${this.baseUrl}/${campaignId}/adsets`;
    const response = await axios.get(url, {
      params: {
        access_token: this.accessToken,
        fields: 'id,name,status,effective_status,targeting,daily_budget',
        limit: 500
      }
    });
    return response.data;
  }

  async fetchAds(accountId, adSetId) {
    const url = `${this.baseUrl}/${adSetId}/ads`;
    const response = await axios.get(url, {
      params: {
        access_token: this.accessToken,
        fields: 'id,name,status,effective_status,creative',
        limit: 500
      }
    });
    return response.data;
  }
}

module.exports = new MetaClient();