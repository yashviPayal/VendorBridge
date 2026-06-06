import React from 'react';

// Single pulse line
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2.5 w-full ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <div
          key={idx}
          className="h-3.5 bg-slate-100 rounded-md animate-pulse w-full"
          style={{ width: idx === lines - 1 && lines > 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-5 bg-white border border-slate-100 rounded-xl flex flex-col gap-4 shadow-premium ${className}`}>
      <div className="flex justify-between items-center w-full">
        <div className="h-4 bg-slate-100 rounded-md animate-pulse w-1/3" />
        <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse" />
      </div>
      <div className="h-6 bg-slate-100 rounded-md animate-pulse w-1/2" />
      <div className="h-3 bg-slate-100 rounded-md animate-pulse w-1/4" />
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => {
  return (
    <div className={`w-full bg-white rounded-xl border border-slate-100 shadow-premium overflow-hidden ${className}`}>
      <div className="px-6 py-4.5 bg-slate-50/50 border-b border-slate-100 flex gap-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <div key={idx} className="h-3.5 bg-slate-100 rounded animate-pulse flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-6 py-5 flex gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="h-3.5 bg-slate-100/75 rounded animate-pulse flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
