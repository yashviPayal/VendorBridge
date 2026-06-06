import React from 'react';

export interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (val: string) => {
    const s = val.toLowerCase().trim();
    
    // Success / Completed
    if (['active', 'approved', 'selected', 'paid', 'completed'].includes(s)) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        dot: 'bg-emerald-500',
      };
    }
    
    // Warning / Pending / Review
    if (['pending', 'pending approval', 'under review'].includes(s)) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-100',
        dot: 'bg-amber-500',
      };
    }
    
    // Info / Draft / Process
    if (['draft', 'sent', 'unpaid', 'acknowledged', 'open'].includes(s)) {
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-100',
        dot: 'bg-blue-500',
      };
    }
    
    // Danger / Suspended / Rejected / Overdue
    if (['suspended', 'rejected', 'overdue', 'closed'].includes(s)) {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-100',
        dot: 'bg-rose-500',
      };
    }
    
    // Default Fallback
    return {
      bg: 'bg-slate-50 text-slate-700 border-slate-100',
      dot: 'bg-slate-500',
    };
  };

  const styles = getBadgeStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${styles.bg} select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
};
