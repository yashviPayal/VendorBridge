import React from 'react';

export interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  children,
  actions,
}) => {
  return (
    <div className="flex flex-col p-6 bg-white border border-slate-100 rounded-xl shadow-premium h-full">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-0.5">
          <h4 className="text-sm font-semibold text-slate-800 tracking-tight">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-slate-400 font-medium">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="flex-1 w-full min-h-[260px] relative">
        {children}
      </div>
    </div>
  );
};
