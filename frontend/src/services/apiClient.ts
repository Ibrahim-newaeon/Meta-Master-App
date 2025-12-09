import type {
  Filters,
  OverviewData,
  CampaignResponse,
  AudienceResponse,
  DemographicData,
  LocationData,
  DeviceData,
  PlatformData,
} from '../types/api';

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(endpoint: string, filters: Filters): Promise<T> {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.account_id) queryParams.append('account_id', filters.account_id);
    if (filters.date_from) queryParams.append('date_from', filters.date_from);
    if (filters.date_to) queryParams.append('date_to', filters.date_to);
    if (filters.campaign_goal) queryParams.append('campaign_goal', filters.campaign_goal);
    if (filters.funnel_stage) queryParams.append('funnel_stage', filters.funnel_stage);

    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchOverview(filters: Filters): Promise<OverviewData> {
    return this.request<OverviewData>('/insights/overview', filters);
  }

  async fetchTOF(filters: Filters): Promise<CampaignResponse> {
    return this.request<CampaignResponse>('/insights/tof', filters);
  }

  async fetchMOF(filters: Filters): Promise<CampaignResponse> {
    return this.request<CampaignResponse>('/insights/mof', filters);
  }

  async fetchBOF(filters: Filters): Promise<CampaignResponse> {
    return this.request<CampaignResponse>('/insights/bof', filters);
  }

  async fetchAudienceDemographics(filters: Filters): Promise<AudienceResponse<DemographicData>> {
    return this.request<AudienceResponse<DemographicData>>('/audience/demographics', filters);
  }

  async fetchAudienceLocation(filters: Filters): Promise<AudienceResponse<LocationData>> {
    return this.request<AudienceResponse<LocationData>>('/audience/location', filters);
  }

  async fetchAudienceDevice(filters: Filters): Promise<AudienceResponse<DeviceData>> {
    return this.request<AudienceResponse<DeviceData>>('/audience/device', filters);
  }

  async fetchAudiencePlatform(filters: Filters): Promise<AudienceResponse<PlatformData>> {
    return this.request<AudienceResponse<PlatformData>>('/audience/platform', filters);
  }
}

export const apiClient = new ApiClient();
