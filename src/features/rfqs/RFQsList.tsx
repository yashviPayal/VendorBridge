import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, RFQ } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Input';
import { Plus, Eye, Clock, Calendar, FileText } from 'lucide-react';

export const RFQsList: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const rfqs = useStore((state) => state.rfqs);

  const [statusFilter, setStatusFilter] = useState('All');

  if (!currentUser) return null;

  // Filter RFQs depending on user type
  // Vendors should only see RFQs that have been assigned to them
  const viewableRFQs = rfqs.filter((rfq) => {
    if (currentUser.role === 'Vendor') {
      const vendorId = currentUser.vendorId || '';
      return rfq.assignedVendors.includes(vendorId) && rfq.status !== 'Draft';
    }
    return true;
  });

  const filteredRFQs = viewableRFQs.filter((rfq) => {
    return statusFilter === 'All' || rfq.status === statusFilter;
  });

  const columns: Column<RFQ>[] = [
    {
      header: 'RFQ Code & Title',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{row.title}</span>
            <span className="text-[11px] text-slate-400 font-bold font-mono uppercase">{row.id}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'title',
    },
    {
      header: 'Items Count',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
          {row.items.length} item(s)
        </span>
      ),
    },
    {
      header: 'Deadline Date',
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{row.deadline}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'deadline',
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="py-1 px-2.5 border-slate-200 text-xs font-semibold"
          leftIcon={<Eye className="w-3.5 h-3.5" />}
          onClick={() => navigate(`/rfqs/${row.id}`)}
        >
          Open Details
        </Button>
      ),
    },
  ];

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Open', label: 'Open' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'PO Generated', label: 'PO Generated' },
    { value: 'Closed', label: 'Closed' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Requests For Quotation (RFQ)
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Create bid packages, assign vendors, receive price proposals, and issue approvals
          </p>
        </div>

        {/* Create RFQ button (Procurement Officer only) */}
        {currentUser.role === 'Procurement Officer' && (
          <Button
            onClick={() => navigate('/rfqs/create')}
            leftIcon={<Plus className="w-4.5 h-4.5" />}
            className="bg-primary hover:bg-primary-hover shadow-sm"
          >
            Create RFQ
          </Button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-premium">
        <Select
          label="Filter Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* RFQ List Table */}
      <DataTable
        columns={columns}
        data={filteredRFQs}
        searchField={(r) => r.id + ' ' + r.title + ' ' + r.status}
        searchPlaceholder="Search RFQ code, title or status..."
        emptyTitle="No RFQs Found"
        emptyDescription={
          currentUser.role === 'Vendor'
            ? 'There are no active procurement RFQ invitations assigned to your vendor profile at this time.'
            : 'No RFQs have been created yet. Create an RFQ to invite vendors to submit quotations.'
        }
      />
    </div>
  );
};
export default RFQsList;
