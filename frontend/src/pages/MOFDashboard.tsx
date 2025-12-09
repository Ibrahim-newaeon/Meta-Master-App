import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCards from '../components/KpiCards';
import DashboardTable from '../components/DashboardTable';
import Loading from '../components/Loading';
import { apiClient } from '../services/apiClient';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import type { Filters, CampaignResponse } from '../types/api';

const MOFDashboard: React.FC = () => {
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
      const result = await apiClient.fetchMOF(filters);
      setData(result);
    } catch (err) {
      setError('Failed to load MOF data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate KPIs from campaign data
  const campaigns = data?.campaigns || [];
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      spend: acc.spend + (campaign.spend || 0),
      clicks: acc.clicks + (campaign.clicks || 0),
      landing_page_views: acc.landing_page_views + (campaign.landing_page_views || 0),
      impressions: acc.impressions + (campaign.impressions || 0),
      cpc: acc.cpc + (campaign.cpc || 0),
      ctr: acc.ctr + (campaign.ctr || 0),
    }),
    { spend: 0, clicks: 0, landing_page_views: 0, impressions: 0, cpc: 0, ctr: 0 }
  );

  const avgCPC = campaigns.length > 0 ? totals.cpc / campaigns.length : 0;
  const avgCTR = campaigns.length > 0 ? totals.ctr / campaigns.length : 0;
  const avgCostPerLPV = totals.landing_page_views > 0 ? totals.spend / totals.landing_page_views : 0;

  const kpis = [
    { label: 'Total Spend', value: formatCurrency(totals.spend), icon: '💰' },
    { label: 'Total Clicks', value: formatNumber(totals.clicks), icon: '👆' },
    { label: 'Landing Page Views', value: formatNumber(totals.landing_page_views), icon: '📄' },
    { label: 'Avg CPC', value: formatCurrency(avgCPC), icon: '💳' },
    { label: 'Avg CTR', value: formatPercentage(avgCTR), icon: '📊' },
    { label: 'Avg Cost per LPV', value: formatCurrency(avgCostPerLPV), icon: '📈' },
  ];

  const columns = [
    { key: 'campaign_name', label: 'Campaign Name', sortable: true },
    { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
    { key: 'clicks', label: 'Clicks', format: formatNumber, sortable: true },
    { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
    { key: 'cpc', label: 'CPC', format: formatCurrency, sortable: true },
    { key: 'landing_page_views', label: 'Landing Page Views', format: formatNumber, sortable: true },
    { key: 'cost_per_landing_page_view', label: 'Cost per LPV', format: formatCurrency, sortable: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Middle of Funnel Dashboard</h2>
        <p className="text-gray-400">Engagement and consideration metrics</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <Loading message="Loading MOF data..." />
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

export default MOFDashboard;
