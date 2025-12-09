import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCards from '../components/KpiCards';
import DashboardTable from '../components/DashboardTable';
import Loading from '../components/Loading';
import { apiClient } from '../services/apiClient';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import type { Filters, CampaignResponse } from '../types/api';

const TOFDashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    country: 'All',
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    campaign_goal: 'All',
  });

  const [data, setData] = useState<CampaignResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchTOF(filters);
      setData(result);
    } catch (err) {
      setError('Failed to load TOF data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs from campaign data
  const campaigns = data?.campaigns || [];
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      reach: acc.reach + (campaign.reach || 0),
      impressions: acc.impressions + (campaign.impressions || 0),
      spend: acc.spend + (campaign.spend || 0),
      video_views: acc.video_views + (campaign.video_views || 0),
      clicks: acc.clicks + (campaign.clicks || 0),
      frequency: acc.frequency + (campaign.frequency || 0),
      cpm: acc.cpm + (campaign.cpm || 0),
      ctr: acc.ctr + (campaign.ctr || 0),
    }),
    { reach: 0, impressions: 0, spend: 0, video_views: 0, clicks: 0, frequency: 0, cpm: 0, ctr: 0 }
  );

  const avgFrequency = campaigns.length > 0 ? totals.frequency / campaigns.length : 0;
  const avgCPM = campaigns.length > 0 ? totals.cpm / campaigns.length : 0;
  const avgCTR = campaigns.length > 0 ? totals.ctr / campaigns.length : 0;

  const kpis = [
    { label: 'Total Reach', value: formatNumber(totals.reach), icon: '📡' },
    { label: 'Total Impressions', value: formatNumber(totals.impressions), icon: '👁️' },
    { label: 'Avg Frequency', value: avgFrequency.toFixed(2), icon: '🔄' },
    { label: 'Avg CPM', value: formatCurrency(avgCPM), icon: '💰' },
    { label: 'Avg CTR', value: formatPercentage(avgCTR), icon: '👆' },
    { label: 'Total Video Views', value: formatNumber(totals.video_views), icon: '🎬' },
  ];

  const columns = [
    { key: 'campaign_name', label: 'Campaign Name', sortable: true },
    { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
    { key: 'impressions', label: 'Impressions', format: formatNumber, sortable: true },
    { key: 'reach', label: 'Reach', format: formatNumber, sortable: true },
    { key: 'cpm', label: 'CPM', format: formatCurrency, sortable: true },
    { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
    { key: 'landing_page_views', label: 'Landing Page Views', format: formatNumber, sortable: true },
    { key: 'thruplays', label: 'ThruPlays', format: formatNumber, sortable: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Top of Funnel Dashboard</h2>
        <p className="text-gray-400">Awareness and reach metrics</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <Loading message="Loading TOF data..." />
      ) : error ? (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          <KpiCards kpis={kpis} />
          
          <DashboardTable
            title="Campaign Performance"
            columns={columns}
            data={campaigns}
          />
        </>
      )}
    </div>
  );
};

export default TOFDashboard;
