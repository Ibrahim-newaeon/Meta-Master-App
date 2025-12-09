// API Filter Types
export interface Filters {
  country?: string;
  account_id?: string;
  date_from: string;
  date_to: string;
  campaign_goal?: string;
  funnel_stage?: string;
}

// KPI Types
export interface KPIData {
  total_spend: number;
  total_revenue: number;
  total_conversions: number;
  roas: number;
  cpa: number;
  ctr: number;
  cpm?: number;
  total_impressions: number;
  total_reach: number;
  frequency?: number;
}

// Overview Dashboard Types
export interface FunnelSummary {
  funnel_stage: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
}

export interface CountryComparison {
  country: string;
  spend: number;
  revenue: number;
  roas: number;
  cpa: number;
  conversions: number;
}

export interface OverviewData {
  kpis: KPIData;
  funnelSummary: FunnelSummary[];
  countryComparison?: CountryComparison[];
}

// Campaign Types (for TOF, MOF, BOF)
export interface CampaignData {
  campaign_name: string;
  spend: number;
  impressions: number;
  reach: number;
  frequency: number;
  cpm: number;
  ctr: number;
  cpc: number;
  clicks: number;
  landing_page_views?: number;
  cost_per_landing_page_view?: number;
  video_views?: number;
  thruplays?: number;
  conversions?: number;
  cpa?: number;
  revenue?: number;
  roas?: number;
}

export interface CampaignResponse {
  campaigns: CampaignData[];
  totals?: KPIData;
}

// Audience Types
export interface DemographicData {
  age: string;
  gender: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface LocationData {
  location: string;
  city?: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface DeviceData {
  device_platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface PlatformData {
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
  revenue: number;
  roas: number;
}

export interface AudienceResponse<T> {
  data: T[];
}
