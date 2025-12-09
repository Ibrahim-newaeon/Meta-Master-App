import React from 'react';

export interface BreakdownItem {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
}

interface AudienceBreakdownProps {
  title: string;
  items: BreakdownItem[];
  metric?: string; // e.g., "Spend", "Impressions", "Conversions"
}

const defaultColors = [
  '#3b82f6', // blue-500
  '#10b981', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
];

const AudienceBreakdown: React.FC<AudienceBreakdownProps> = ({
  title,
  items,
  metric = 'Value',
}) => {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(2);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      
      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No data available</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const percentage = item.percentage || (total > 0 ? (item.value / total) * 100 : 0);
            const color = item.color || defaultColors[index % defaultColors.length];

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300 font-medium">{item.label}</span>
                  <span className="text-gray-400">
                    {formatNumber(item.value)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 font-medium">Total {metric}</span>
            <span className="text-white font-semibold">{formatNumber(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudienceBreakdown;
