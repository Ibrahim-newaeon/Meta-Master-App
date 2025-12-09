import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar';
import DashboardTable from '../components/DashboardTable';
import AudienceBreakdown from '../components/AudienceBreakdown';
import Loading from '../components/Loading';
import { apiClient } from '../services/apiClient';
import type { Filters, AudienceResponse, DemographicData, LocationData, DeviceData, PlatformData } from '../types/api';

type TabType = 'demographics' | 'location' | 'device' | 'platform';

const AudienceInsightsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    country: 'All',
    date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    date_to: new Date().toISOString().split('T')[0],
    campaign_goal: 'All',
    funnel_stage: 'All',
  });

  const [activeTab, setActiveTab] = useState<TabType>('demographics');
  const [demographics, setDemographics] = useState<AudienceResponse<DemographicData> | null>(null);
  const [location, setLocation] = useState<AudienceResponse<LocationData> | null>(null);
  const [device, setDevice] = useState<AudienceResponse<DeviceData> | null>(null);
  const [platform, setPlatform] = useState<AudienceResponse<PlatformData> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filters, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'demographics':
          const demo = await apiClient.fetchAudienceDemographics(filters);
          setDemographics(demo);
          break;
        case 'location':
          const loc = await apiClient.fetchAudienceLocation(filters);
          setLocation(loc);
          break;
        case 'device':
          const dev = await apiClient.fetchAudienceDevice(filters);
          setDevice(dev);
          break;
        case 'platform':
          const plat = await apiClient.fetchAudiencePlatform(filters);
          setPlatform(plat);
          break;
      }
    } catch (err) {
      setError('Failed to load audience data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (value: number) => value.toLocaleString();
  const formatPercentage = (value: number) => `${value.toFixed(2)}%`;
  const formatMultiplier = (value: number) => `${value.toFixed(2)}x`;

  const tabs = [
    { id: 'demographics', label: 'Demographics', icon: '👥' },
    { id: 'location', label: 'Location', icon: '🌍' },
    { id: 'device', label: 'Device', icon: '📱' },
    { id: 'platform', label: 'Platform', icon: '💻' },
  ];

  const renderContent = () => {
    if (loading) {
      return <Loading message="Loading audience data..." />;
    }

    if (error) {
      return (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'demographics':
        if (!demographics || demographics.data.length === 0) {
          return <p className="text-gray-400 text-center py-8">No demographics data available</p>;
        }
        const demoColumns = [
          { key: 'age', label: 'Age', sortable: true },
          { key: 'gender', label: 'Gender', sortable: true },
          { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
          { key: 'impressions', label: 'Impressions', format: formatNumber, sortable: true },
          { key: 'clicks', label: 'Clicks', format: formatNumber, sortable: true },
          { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
          { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
          { key: 'cpa', label: 'CPA', format: formatCurrency, sortable: true },
          { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
        ];
        const ageBreakdown = demographics.data.reduce((acc, row) => {
          const existing = acc.find(item => item.label === row.age);
          if (existing) {
            existing.value += row.spend;
          } else {
            acc.push({ label: row.age, value: row.spend });
          }
          return acc;
        }, [] as { label: string; value: number }[]);
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudienceBreakdown title="Spend by Age" items={ageBreakdown} metric="Spend" />
            </div>
            <DashboardTable title="Demographics Breakdown" columns={demoColumns} data={demographics.data} />
          </div>
        );

      case 'location':
        if (!location || location.data.length === 0) {
          return <p className="text-gray-400 text-center py-8">No location data available</p>;
        }
        const locColumns = [
          { key: 'location', label: 'Location', sortable: true },
          { key: 'city', label: 'City', sortable: true },
          { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
          { key: 'impressions', label: 'Impressions', format: formatNumber, sortable: true },
          { key: 'clicks', label: 'Clicks', format: formatNumber, sortable: true },
          { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
          { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
          { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
        ];
        const locationBreakdown = location.data.map(row => ({
          label: row.location,
          value: row.spend,
        }));
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudienceBreakdown title="Spend by Location" items={locationBreakdown} metric="Spend" />
            </div>
            <DashboardTable title="Location Breakdown" columns={locColumns} data={location.data} />
          </div>
        );

      case 'device':
        if (!device || device.data.length === 0) {
          return <p className="text-gray-400 text-center py-8">No device data available</p>;
        }
        const devColumns = [
          { key: 'device_platform', label: 'Device', sortable: true },
          { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
          { key: 'impressions', label: 'Impressions', format: formatNumber, sortable: true },
          { key: 'clicks', label: 'Clicks', format: formatNumber, sortable: true },
          { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
          { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
          { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
        ];
        const deviceBreakdown = device.data.map(row => ({
          label: row.device_platform,
          value: row.spend,
        }));
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudienceBreakdown title="Spend by Device" items={deviceBreakdown} metric="Spend" />
            </div>
            <DashboardTable title="Device Breakdown" columns={devColumns} data={device.data} />
          </div>
        );

      case 'platform':
        if (!platform || platform.data.length === 0) {
          return <p className="text-gray-400 text-center py-8">No platform data available</p>;
        }
        const platColumns = [
          { key: 'platform', label: 'Platform', sortable: true },
          { key: 'spend', label: 'Spend', format: formatCurrency, sortable: true },
          { key: 'impressions', label: 'Impressions', format: formatNumber, sortable: true },
          { key: 'clicks', label: 'Clicks', format: formatNumber, sortable: true },
          { key: 'ctr', label: 'CTR', format: formatPercentage, sortable: true },
          { key: 'conversions', label: 'Conversions', format: formatNumber, sortable: true },
          { key: 'roas', label: 'ROAS', format: formatMultiplier, sortable: true },
        ];
        const platformBreakdown = platform.data.map(row => ({
          label: row.platform,
          value: row.spend,
        }));
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AudienceBreakdown title="Spend by Platform" items={platformBreakdown} metric="Spend" />
            </div>
            <DashboardTable title="Platform Breakdown" columns={platColumns} data={platform.data} />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Audience Insights Dashboard</h2>
        <p className="text-gray-400">Detailed audience breakdown and analysis</p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Sub-tabs */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default AudienceInsightsDashboard;
