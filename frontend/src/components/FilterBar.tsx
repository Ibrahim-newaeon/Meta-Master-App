import React from 'react';
import type { Filters } from '../types/api';

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const handleChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <select
            value={filters.country || 'All'}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Countries</option>
            <option value="KSA">KSA</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Qatar">Qatar</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date From
          </label>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => handleChange('date_from', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date To
          </label>
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => handleChange('date_to', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Campaign Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Campaign Goal
          </label>
          <select
            value={filters.campaign_goal || 'All'}
            onChange={(e) => handleChange('campaign_goal', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Goals</option>
            <option value="BRAND_AWARENESS">Brand Awareness</option>
            <option value="REACH">Reach</option>
            <option value="TRAFFIC">Traffic</option>
            <option value="ENGAGEMENT">Engagement</option>
            <option value="LEAD_GENERATION">Lead Generation</option>
            <option value="CONVERSIONS">Conversions</option>
          </select>
        </div>

        {/* Funnel Stage */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Funnel Stage
          </label>
          <select
            value={filters.funnel_stage || 'All'}
            onChange={(e) => handleChange('funnel_stage', e.target.value)}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Stages</option>
            <option value="TOF">Top of Funnel</option>
            <option value="MOF">Middle of Funnel</option>
            <option value="BOF">Bottom of Funnel</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
