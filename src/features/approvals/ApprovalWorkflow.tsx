import React, { useState } from 'react';
import { useStore, Approval } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { ConfirmationDialog } from '../../components/ui/ConfirmationDialog';
import {
  CheckSquare,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CornerDownRight,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const ApprovalWorkflow: React.FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const approvals = useStore((state) => state.approvals);
  const quotations = useStore((state) => state.quotations);
  const processApproval = useStore((state) => state.processApproval);

  const [activeApproval, setActiveApproval] = useState<Approval | null>(null);
  const [remarks, setRemarks] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ type: 'Approve' | 'Reject'; id: string } | null>(null);

  if (!currentUser) return null;

  // Managers see pending approvals. Procurement Officers/Admins see all history.
  const isManager = currentUser.role === 'Manager';
  const displayApprovals = approvals.filter((a) => {
    if (isManager) return a.status === 'Pending';
    return true;
  });

  const handleReview = (app: Approval) => {
    setActiveApproval(app);
    setRemarks(app.remarks || '');
  };

  const executeDecision = (type: 'Approve' | 'Reject') => {
    if (activeApproval) {
      setConfirmAction({ type, id: activeApproval.id });
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction && activeApproval) {
      const status = confirmAction.type === 'Approve' ? 'Approved' : 'Rejected';
      processApproval(activeApproval.id, status, remarks);
      setActiveApproval(null);
      setConfirmAction(null);
      setRemarks('');
    }
  };

  const columns: Column<Approval>[] = [
    {
      header: 'Approval Code',
      accessor: 'id',
      className: 'font-mono text-xs font-bold text-slate-500',
    },
    {
      header: 'Procurement Target',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.title}</span>
          <span className="text-[11px] text-slate-400 font-semibold">{row.vendorName}</span>
        </div>
      ),
      sortable: true,
      sortKey: 'title',
    },
    {
      header: 'Quote Amount',
      accessor: (row) => (
        <span className="font-extrabold text-slate-800">
          ${row.totalAmount.toLocaleString()}
        </span>
      ),
      sortable: true,
      sortKey: 'totalAmount',
    },
    {
      header: 'Approval Stage',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
          Level {row.currentLevel} of {row.totalLevels}
        </span>
      ),
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
          onClick={() => handleReview(row)}
        >
          {isManager && row.status === 'Pending' ? 'Review & Sign' : 'View History'}
        </Button>
      ),
    },
  ];

  // Find quotation details of the selected approval request
  const selectedQuoteDetails = activeApproval
    ? quotations.find((q) => q.id === activeApproval.quotationId)
    : null;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Procurement Approvals Worklist
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          {isManager
            ? 'Review costing summaries, inspect quotes side-by-side, sign authorizations, or decline requests'
            : 'Track status of ongoing multi-level procurement workflows and authorizations'}
        </p>
      </div>

      {/* Datatable */}
      <DataTable
        columns={columns}
        data={displayApprovals}
        searchField={(r) => r.id + ' ' + r.title + ' ' + r.vendorName}
        searchPlaceholder="Search approvals by code, title, or vendor name..."
        emptyTitle="No Approvals Pending"
        emptyDescription="There are no active procurement approvals assigned to your workspace. All clear!"
      />

      {/* Review Modal Dialog */}
      {activeApproval && (
        <Modal
          isOpen={true}
          onClose={() => setActiveApproval(null)}
          title={`Review Procurement Approval Request: ${activeApproval.id}`}
          size="lg"
        >
          <div className="flex flex-col gap-5">
            {/* Header info card */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requested For</span>
                <span className="text-sm font-bold text-slate-800">{activeApproval.title}</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">Vendor: {activeApproval.vendorName}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value Cost</span>
                <span className="text-base font-extrabold text-slate-800">${activeApproval.totalAmount.toLocaleString()}</span>
                <span className="text-[10px] font-semibold text-slate-500 mt-0.5">Level {activeApproval.currentLevel} of {activeApproval.totalLevels}</span>
              </div>
            </div>

            {/* Quotation Item Costs */}
            {selectedQuoteDetails && (
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Cost Breakdown Details
                </span>
                
                <div className="max-h-[160px] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                  {selectedQuoteDetails.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 font-medium mt-0.5">{item.quantity} {item.unit} • ${item.unitPrice} each</span>
                      </div>
                      <span className="font-extrabold text-slate-700">${item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments & Remarks (Zustand timeline audit) */}
            <div className="flex flex-col gap-3.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
                Approval Sign-off History
              </span>

              {activeApproval.history.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {activeApproval.history.map((hist, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs">
                      <div className="flex flex-col items-center">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${hist.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {idx < activeApproval.history.length - 1 && <span className="w-0.5 h-full bg-slate-100 mt-1" />}
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="font-bold text-slate-700">Level {hist.level}: {hist.status} by {hist.approverName}</span>
                        {hist.remarks && (
                          <p className="text-slate-500 italic mt-1 font-medium bg-slate-50 p-2 rounded-lg border border-slate-100">
                            "{hist.remarks}"
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 font-normal mt-1">{hist.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs py-3 font-medium bg-slate-50/20 border border-slate-100 rounded-xl">
                  No historical sign-offs recorded. Level 1 pending.
                </div>
              )}
            </div>

            {/* Approval Decision Panel */}
            {isManager && activeApproval.status === 'Pending' ? (
              <div className="flex flex-col gap-4 border-t border-slate-100 pt-5">
                <Textarea
                  label="Remarks & Decision Comments"
                  placeholder="Input feedback, audit objections, or special terms here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />

                <div className="flex items-center justify-end gap-3.5">
                  <Button variant="outline" onClick={() => setActiveApproval(null)}>
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => executeDecision('Reject')}
                    leftIcon={<ThumbsDown className="w-4 h-4" />}
                  >
                    Decline Request
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => executeDecision('Approve')}
                    leftIcon={<ThumbsUp className="w-4 h-4" />}
                  >
                    Approve & Sign
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end border-t border-slate-100 pt-4 mt-2">
                <Button variant="outline" onClick={() => setActiveApproval(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog Box */}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          title={`${confirmAction.type} Procurement Request?`}
          message={
            confirmAction.type === 'Approve'
              ? 'Are you sure you want to approve this quotation? This will authorize procurement and transition the RFQ stage so officers can issue Purchase Orders.'
              : 'Are you sure you want to decline this request? The RFQ will revert to review status, and the officer will be notified.'
          }
          confirmLabel={confirmAction.type === 'Approve' ? 'Approve Quote' : 'Decline Quote'}
          variant={confirmAction.type === 'Approve' ? 'primary' : 'danger'}
        />
      )}
    </div>
  );
};
export default ApprovalWorkflow;
