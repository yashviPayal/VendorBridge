import React from 'react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColorClass?: string;
  iconBgClass?: string;
  trend?: string; // e.g. "+12%", "-8%"
  trendType?: 'up' | 'down' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconColorClass = 'text-primary',
  iconBgClass = 'bg-primary/5',
  trend,
  trendType = 'neutral',
}) => {
  const getTrendStyles = () => {
    if (trendType === 'up') return 'bg-emerald-50 text-emerald-700';
    if (trendType === 'down') return 'bg-rose-50 text-rose-700';
    return 'bg-slate-50 text-slate-500';
  };

  return (
    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-xl shadow-premium hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase select-none">
          {title}
        </span>
        <span className="text-2xl font-bold text-slate-800 tracking-tight select-all">
          {value}
        </span>
        {trend && (
          <span className={`inline-flex items-center w-fit px-2 py-0.5 text-xs font-semibold rounded-md ${getTrendStyles()}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
};
