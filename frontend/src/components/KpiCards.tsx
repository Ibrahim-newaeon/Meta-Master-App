import React from 'react';

export interface KpiCardData {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface KpiCardsProps {
  kpis: KpiCardData[];
}

const formatValue = (value: string | number): string => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(2);
  }
  return value;
};

const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg p-5 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-medium">{kpi.label}</p>
            {kpi.icon && (
              <span className="text-2xl">{kpi.icon}</span>
            )}
          </div>
          <p className="text-white text-2xl font-bold mb-1">
            {formatValue(kpi.value)}
          </p>
          {kpi.trend && (
            <div className="flex items-center">
              <span
                className={`text-sm font-semibold ${
                  kpi.trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {kpi.trend.isPositive ? '↑' : '↓'} {Math.abs(kpi.trend.value)}%
              </span>
              <span className="text-gray-500 text-xs ml-2">vs last period</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
