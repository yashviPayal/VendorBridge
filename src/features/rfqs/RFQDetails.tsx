import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Paperclip,
  CheckSquare,
  Building,
  DollarSign,
  FileCheck,
  Eye,
  AlertCircle,
  Plus
} from 'lucide-react';

export const RFQDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const rfqs = useStore((state) => state.rfqs);
  const vendors = useStore((state) => state.vendors);
  const quotations = useStore((state) => state.quotations);
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const generatePO = useStore((state) => state.generatePO);

  const rfq = rfqs.find((r) => r.id === id);

  if (!currentUser) return null;

  if (!rfq) {
    return (
      <EmptyState
        title="RFQ Not Found"
        description="We couldn't locate any Request for Quotation matching this identifier."
        action={
          <Button onClick={() => navigate('/rfqs')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to RFQs
          </Button>
        }
      />
    );
  }

  // Filter quotations matching this RFQ
  const rfqQuotes = quotations.filter((q) => q.rfqId === rfq.id);
  const selectedQuote = rfqQuotes.find((q) => q.status === 'Selected' || q.status === 'Approved');

  // If vendor is logged in, find their quotation if any
  const isVendor = currentUser.role === 'Vendor';
  const myVendorId = currentUser.vendorId || '';
  const myQuote = rfqQuotes.find((q) => q.vendorId === myVendorId);

  // Check if PO is already generated for this RFQ
  const generatedPO = purchaseOrders.find((po) => po.rfqId === rfq.id);

  const handleGeneratePO = () => {
    if (selectedQuote) {
      const poId = generatePO(rfq.id, selectedQuote.id);
      if (poId) {
        navigate('/purchase-orders');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/rfqs')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="border-slate-200"
        >
          Back
        </Button>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            {rfq.title}
            <StatusBadge status={rfq.status} />
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            RFQ Document Reference Code: <span className="font-mono text-slate-500 font-bold">{rfq.id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Columns: Specifications & Line Items */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Objective & Meta info */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
              Procurement Specifications
            </h3>
            
            <p className="text-slate-600 text-sm leading-relaxed">
              {rfq.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-2 pt-4 border-t border-slate-50">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created Date</span>
                  <span className="text-xs font-semibold text-slate-700">{rfq.createdAt}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deadline</span>
                  <span className="text-xs font-bold text-primary">{rfq.deadline}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <User className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Officer Assignee</span>
                  <span className="text-xs font-semibold text-slate-700">{rfq.createdBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Line items checklist */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
              <CheckSquare className="w-4.5 h-4.5 text-primary" />
              Line Items Requested
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                    <th className="py-3 px-2">Line Item Name</th>
                    <th className="py-3 px-2 text-right">Required Quantity</th>
                    <th className="py-3 px-2 text-right">Unit Measure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rfq.items.map((item, idx) => (
                    <tr key={idx} className="text-slate-700">
                      <td className="py-3 px-2 font-semibold">{item.name}</td>
                      <td className="py-3 px-2 text-right font-bold">{item.quantity}</td>
                      <td className="py-3 px-2 text-right text-slate-500">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attachments folder */}
          {rfq.attachments.length > 0 && (
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                <Paperclip className="w-4.5 h-4.5 text-primary" />
                Attachments
              </h3>
              <div className="flex flex-wrap gap-3">
                {rfq.attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer">
                    <FileCheck className="w-4 h-4 text-slate-400" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: User Action context boxes */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Procurement Officer View: Quotations & Comparisons */}
          {!isVendor && (
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building className="w-4.5 h-4.5 text-primary" />
                Vendor Quotations
              </h3>

              {rfqQuotes.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {rfqQuotes.map((q) => {
                    const totalCost = q.items.reduce((sum, item) => sum + item.total, 0);
                    return (
                      <div key={q.id} className="p-4 border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between transition">
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-800 text-xs truncate">{q.vendorName}</span>
                          <span className="text-[10px] text-slate-400 mt-1 font-semibold">
                            Quote: ${totalCost.toLocaleString()} • Score: {q.score}/100
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={q.status} />
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-2.5 mt-4">
                    {/* Quotation Comparison Link */}
                    {rfq.status === 'Open' || rfq.status === 'Under Review' ? (
                      <Button
                        onClick={() => navigate(`/rfqs/${rfq.id}/compare`)}
                        className="w-full bg-gradient-to-r from-primary to-secondary font-bold"
                        leftIcon={<DollarSign className="w-4.5 h-4.5" />}
                      >
                        Compare Quotations Matrix
                      </Button>
                    ) : null}

                    {/* PO Generation flow */}
                    {rfq.status === 'Approved' && selectedQuote && (
                      <Button
                        onClick={handleGeneratePO}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        leftIcon={<FileCheck className="w-4.5 h-4.5" />}
                      >
                        Generate Purchase Order
                      </Button>
                    )}

                    {rfq.status === 'PO Generated' && generatedPO && (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex flex-col gap-3">
                        <div className="flex gap-2 text-xs font-semibold">
                          <CheckSquare className="w-5 h-5 shrink-0 text-emerald-600" />
                          <span>Purchase Order generated successfully!</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/purchase-orders')}
                          className="w-full border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700 py-2 font-bold"
                        >
                          View Purchase Order: {generatedPO.id}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs font-medium">
                  No quotes submitted by assigned vendors yet.
                </div>
              )}
            </div>
          )}

          {/* Vendor View: Quote submissions */}
          {isVendor && (
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileCheck className="w-4.5 h-4.5 text-primary" />
                Your Quote Submission
              </h3>

              {myQuote ? (
                <div className="flex flex-col gap-4.5">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100/50 pb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submitted Proposal</span>
                      <StatusBadge status={myQuote.status} />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Total Price Bid:</span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        ${myQuote.items.reduce((s, i) => s + i.total, 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Delivery Lead Time:</span>
                      <span className="font-bold text-slate-700">{myQuote.deliveryTimelineDays} Days</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-semibold">Price Score Index:</span>
                      <span className="font-bold text-primary">{myQuote.score} / 100</span>
                    </div>
                  </div>

                  {/* Edit submission button */}
                  {rfq.status === 'Open' && myQuote.status === 'Submitted' && (
                    <Button
                      onClick={() => navigate(`/rfqs/${rfq.id}/submit`)}
                      variant="outline"
                      className="w-full border-slate-200"
                    >
                      Edit Submission
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {rfq.status === 'Open' ? (
                    <>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        You are assigned to this RFQ package. Please submit your pricing and delivery proposal before the deadline.
                      </p>
                      <Button
                        onClick={() => navigate(`/rfqs/${rfq.id}/submit`)}
                        className="w-full bg-gradient-to-r from-primary to-secondary font-bold"
                        leftIcon={<Plus className="w-4.5 h-4.5" />}
                      >
                        Submit Quotation
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex gap-2.5 text-xs font-semibold">
                      <AlertCircle className="w-5 h-5 shrink-0 text-danger" />
                      <span>This RFQ has closed or is no longer accepting submissions.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default RFQDetails;
