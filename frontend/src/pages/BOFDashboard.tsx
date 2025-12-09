import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCards from '../components/KpiCards';
import DashboardTable from '../components/DashboardTable';
import Loading from '../components/Loading';
import { apiClient } from '../services/apiClient';
import { formatCurrency, formatNumber, formatMultiplier } from '../utils/formatters';
import type { Filters, CampaignResponse } from '../types/api';

const BOFDashboard: React.FC = () => {
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
      const result = await apiClient.fetchBOF(filters);
      setData(result);
    } catch (err) {
      setError('Failed to load BOF data. Please check your connection.');
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
      conversions: acc.conversions + (campaign.conversions || 0),
      revenue: acc.revenue + (campaign.revenue || 0),
      cpa: acc.cpa + (campaign.cpa || 0),
      roas: acc.roas + (campaign.roas || 0),
    }),
    { spend: 0, conversions: 0, revenue: 0, cpa: 0, roas: 0 }
  );

  const avgCPA = campaigns.length > 0 ? totals.cpa / campaigns.length : 0;
  const overallROAS = totals.spend > 0 ? totals.revenue / totals.spend : 0;

  const kpis = [
    { label: 'Total Spend', value: formatCurrency(totals.spend), icon: '💰' },
    { label: 'Total Revenue', value: formatCurrency(totals.revenue), icon: '💵' },
    { label: 'Total Conversions', value: formatNumber(totals.conversions), icon: '🎯' },
    { label: 'Avg CPA', value: formatCurrency(avgCPA), icon: '💳' },
    { label: 'Overall ROAS', value: formatMultiplier(overallROAS), icon: '📈' },
  ];

  const columns = [
    { key: 'campaign_name', label: 'Campaign Name', sortable: true },
    { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
    { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
    { key: 'cpa', label: 'CPA', format: formatCurrency, sortable: true },
    { key: 'revenue', label: 'Revenue', format: formatCurrency, sortable: true },
    { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Bottom of Funnel Dashboard</h2>
        <p className="text-gray-400">Conversion and revenue metrics</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <Loading message="Loading BOF data..." />
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

export default BOFDashboard;
