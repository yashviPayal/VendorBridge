import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ArrowLeft, Check, CheckSquare, Award, Star, Truck, AwardIcon } from 'lucide-react';

export const QuotationComparison: React.FC = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const rfqs = useStore((state) => state.rfqs);
  const quotations = useStore((state) => state.quotations);
  const vendors = useStore((state) => state.vendors);
  const selectQuotationForApproval = useStore((state) => state.selectQuotationForApproval);

  const rfq = rfqs.find((r) => r.id === rfqId);
  const rfqQuotes = quotations.filter((q) => q.rfqId === rfqId);

  if (!rfq) {
    return (
      <EmptyState
        title="RFQ Package Not Found"
        description="We couldn't locate this RFQ details."
        action={
          <Button onClick={() => navigate('/rfqs')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to RFQs
          </Button>
        }
      />
    );
  }

  if (rfqQuotes.length === 0) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/rfqs/${rfqId}`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="border-slate-200"
          >
            Back
          </Button>
          <h2 className="text-xl font-extrabold text-slate-800">Compare Quotations</h2>
        </div>
        <EmptyState
          title="No Quotes Submitted"
          description="There are no vendor bids submitted for this RFQ yet. Send invitations or wait for responses."
        />
      </div>
    );
  }

  // Calculate the lowest price to highlight it
  const quotesWithTotal = rfqQuotes.map((q) => {
    const total = q.items.reduce((sum, item) => sum + item.total, 0);
    return { ...q, grandTotal: total };
  });

  const lowestPrice = Math.min(...quotesWithTotal.map((q) => q.grandTotal));

  const handleSelectBid = (quoteId: string) => {
    selectQuotationForApproval(quoteId);
    navigate(`/rfqs/${rfqId}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/rfqs/${rfqId}`)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="border-slate-200"
          >
            Back
          </Button>
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Quotation Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Side-by-side analysis of vendor bids for RFQ: <span className="font-mono text-slate-500 font-bold">{rfq.id}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid Comparison Layout */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-6 font-bold text-slate-500 w-64 uppercase tracking-wider text-xs">Comparison Criteria</th>
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  return (
                    <th
                      key={q.id}
                      className={`p-6 text-center border-l border-slate-100 w-80 relative ${
                        isLowest ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      {isLowest && (
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[10px] font-bold shadow-sm uppercase tracking-wider animate-pulse">
                          <Award className="w-3 h-3" />
                          Lowest Quote
                        </span>
                      )}
                      <div className="flex flex-col items-center gap-1.5 pt-2">
                        <span className="font-bold text-slate-800 text-sm leading-tight">{q.vendorName}</span>
                        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">{q.id}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Row: Vendor Trust Score */}
              <tr className="hover:bg-slate-50/20">
                <td className="p-6 font-bold text-slate-700">Vendor Rating</td>
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  const rating = vendors.find((v) => v.id === q.vendorId)?.rating || 4.0;
                  return (
                    <td key={q.id} className={`p-6 text-center border-l border-slate-100 ${isLowest ? 'bg-emerald-50/40' : ''}`}>
                      <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rating.toFixed(1)} / 5.0</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Delivery Timeline */}
              <tr className="hover:bg-slate-50/20">
                <td className="p-6 font-bold text-slate-700">Delivery Lead Time</td>
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  return (
                    <td key={q.id} className={`p-6 text-center border-l border-slate-100 ${isLowest ? 'bg-emerald-50/40' : ''}`}>
                      <div className="flex items-center justify-center gap-1.5 text-slate-600 font-semibold">
                        <Truck className="w-4.5 h-4.5 text-slate-400" />
                        <span>{q.deliveryTimelineDays} Days</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Item Price Comparisons */}
              {rfq.items.map((rfqItem, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20">
                  <td className="p-6 font-bold text-slate-700">
                    <div className="flex flex-col">
                      <span>{rfqItem.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Required: {rfqItem.quantity} {rfqItem.unit}</span>
                    </div>
                  </td>
                  {quotesWithTotal.map((q) => {
                    const isLowest = q.grandTotal === lowestPrice;
                    const itemQuote = q.items.find((i) => i.name === rfqItem.name);
                    return (
                      <td key={q.id} className={`p-6 text-center border-l border-slate-100 ${isLowest ? 'bg-emerald-50/40' : ''}`}>
                        {itemQuote ? (
                          <div className="flex flex-col items-center">
                            <span className="font-extrabold text-slate-800 text-sm">${itemQuote.unitPrice} / {rfqItem.unit}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1">Line total: ${itemQuote.total.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">No Bid</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Row: Total Price */}
              <tr className="hover:bg-slate-50/20 font-bold border-t border-slate-200">
                <td className="p-6 font-bold text-slate-800">Total Quoted Bid Price</td>
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  return (
                    <td
                      key={q.id}
                      className={`p-6 text-center border-l border-slate-100 ${
                        isLowest ? 'bg-emerald-50 text-emerald-800 font-extrabold text-base' : 'text-slate-800'
                      }`}
                    >
                      ${q.grandTotal.toLocaleString()}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Performance Score Index */}
              <tr className="hover:bg-slate-50/20">
                <td className="p-6 font-bold text-slate-700">Price Score Index</td>
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  return (
                    <td key={q.id} className={`p-6 text-center border-l border-slate-100 ${isLowest ? 'bg-emerald-50/40' : ''}`}>
                      <div className="flex items-center justify-center gap-1">
                        <AwardIcon className={`w-4.5 h-4.5 ${isLowest ? 'text-emerald-600' : 'text-primary'}`} />
                        <span className="font-extrabold">{q.score} / 100</span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Quick actions to submit for approval */}
              <tr>
                <td className="p-6 bg-slate-50/5 border-t border-slate-100" />
                {quotesWithTotal.map((q) => {
                  const isLowest = q.grandTotal === lowestPrice;
                  const canSelect = rfq.status === 'Open' || rfq.status === 'Under Review';
                  return (
                    <td
                      key={q.id}
                      className={`p-6 text-center border-l border-t border-slate-100 bg-slate-50/5 ${
                        isLowest ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      {canSelect ? (
                        <Button
                          onClick={() => handleSelectBid(q.id)}
                          size="sm"
                          variant={isLowest ? 'success' : 'outline'}
                          className="w-full py-2 font-bold select-none cursor-pointer"
                          leftIcon={<Check className="w-4 h-4" />}
                        >
                          Select Bid
                        </Button>
                      ) : (
                        <StatusBadge status={q.status} />
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default QuotationComparison;
