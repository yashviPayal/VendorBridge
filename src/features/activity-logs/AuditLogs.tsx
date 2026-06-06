import React, { useState } from 'react';
import { useStore, AuditLog } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Select } from '../../components/ui/Input';
import { History, Shield, Calendar, User } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const auditLogs = useStore((state) => state.auditLogs);
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    return moduleFilter === 'All' || log.module === moduleFilter;
  });

  const columns: Column<AuditLog>[] = [
    {
      header: 'Timestamp',
      accessor: (row) => (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.timestamp}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'timestamp',
    },
    {
      header: 'Category',
      accessor: (row) => (
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-100 uppercase tracking-wide">
          {row.module}
        </span>
      ),
      sortable: true,
      sortKey: 'module',
    },
    {
      header: 'Action / Description',
      accessor: (row) => (
        <div className="flex items-start gap-2 max-w-md">
          <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-slate-700 font-semibold leading-relaxed break-words">{row.action}</span>
        </div>
      ),
    },
    {
      header: 'Executed By',
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {row.userName} <strong className="text-slate-400 font-bold font-mono">({row.userRole})</strong>
          </span>
        </div>
      ),
      sortable: true,
      sortKey: 'userName',
    },
  ];

  const moduleOptions = [
    { value: 'All', label: 'All Categories' },
    { value: 'Auth', label: 'Authentication' },
    { value: 'Vendor', label: 'Vendor Directory' },
    { value: 'RFQ', label: 'RFQ Management' },
    { value: 'Quotation', label: 'Quotations' },
    { value: 'Approval', label: 'Approvals' },
    { value: 'PO', label: 'Purchase Orders' },
    { value: 'Invoice', label: 'Invoices' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          System Audit Logs
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          Read-only cryptographic audit logs capturing security events, quotation approvals, and invoice settlements
        </p>
      </div>

      {/* Filter panel toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-premium">
        <Select
          label="Filter Module"
          options={moduleOptions}
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchField={(r) => r.action + ' ' + r.userName + ' ' + r.module}
        searchPlaceholder="Search audit trails by user or action details..."
        emptyTitle="No Audit Logs"
        emptyDescription="We couldn't locate any audit trails matching the selected module category."
      />
    </div>
  );
};
export default AuditLogs;
