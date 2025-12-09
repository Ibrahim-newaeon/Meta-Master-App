import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import KpiCards from '../components/KpiCards';
import DashboardTable from '../components/DashboardTable';
import Loading from '../components/Loading';
import { apiClient } from '../services/apiClient';
import type { Filters, OverviewData } from '../types/api';

const Dashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    country: 'All',
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    campaign_goal: 'All',
    funnel_stage: 'All',
  });

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.fetchOverview(filters);
      setData(result);
    } catch (err) {
      setError('Failed to load overview data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  const formatMultiplier = (value: number) => `${value.toFixed(2)}x`;

  const kpis = data ? [
    { label: 'Total Spend', value: formatCurrency(data.kpis.total_spend), icon: '💰' },
    { label: 'Total Revenue', value: formatCurrency(data.kpis.total_revenue), icon: '💵' },
    { label: 'ROAS', value: formatMultiplier(data.kpis.roas), icon: '📈' },
    { label: 'Conversions', value: formatNumber(data.kpis.total_conversions), icon: '🎯' },
    { label: 'CPA', value: formatCurrency(data.kpis.cpa), icon: '💳' },
    { label: 'CTR', value: formatPercentage(data.kpis.ctr), icon: '👆' },
    { label: 'Impressions', value: formatNumber(data.kpis.total_impressions), icon: '👁️' },
    { label: 'Reach', value: formatNumber(data.kpis.total_reach), icon: '📡' },
  ] : [];

  const funnelColumns = [
    { key: 'funnel_stage', label: 'Funnel Stage', sortable: true },
    { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
    { key: 'revenue', label: 'Revenue', format: formatCurrency, sortable: true },
    { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
    { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
  ];

  const countryColumns = [
    { key: 'country', label: 'Country', sortable: true },
    { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
    { key: 'revenue', label: 'Revenue', format: formatCurrency, sortable: true },
    { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
    { key: 'cpa', label: 'CPA', format: formatCurrency, sortable: true },
    { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Overview Dashboard</h2>
        <p className="text-gray-400">Comprehensive view of your marketing performance</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <Loading message="Loading overview data..." />
      ) : error ? (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : data ? (
        <>
          <KpiCards kpis={kpis} />

          {data.funnelSummary && data.funnelSummary.length > 0 && (
            <div className="mb-6">
              <DashboardTable
                title="Funnel Performance Summary"
                columns={funnelColumns}
                data={data.funnelSummary}
              />
            </div>
          )}

          {data.countryComparison && data.countryComparison.length > 0 && (
            <div className="mb-6">
              <DashboardTable
                title="Country Comparison"
                columns={countryColumns}
                data={data.countryComparison}
              />
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;
