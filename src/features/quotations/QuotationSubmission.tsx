import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { ArrowLeft, Save, ShoppingCart, DollarSign } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const quoteSchema = zod.object({
  deliveryTimelineDays: zod.number().min(1, 'Timeline must be at least 1 day'),
  notes: zod.string().optional(),
  items: zod.array(
    zod.object({
      name: zod.string(),
      quantity: zod.number(),
      unit: zod.string(),
      unitPrice: zod.number().min(0.01, 'Price must be greater than zero'),
    })
  ),
});

type QuoteFormValues = zod.infer<typeof quoteSchema>;

export const QuotationSubmission: React.FC = () => {
  const { rfqId } = useParams<{ rfqId: string }>();
  const navigate = useNavigate();
  const rfqs = useStore((state) => state.rfqs);
  const submitQuotation = useStore((state) => state.submitQuotation);
  const currentUser = useStore((state) => state.currentUser);

  const rfq = rfqs.find((r) => r.id === rfqId);

  if (!currentUser || currentUser.role !== 'Vendor') return null;

  if (!rfq) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        RFQ package not found.
      </div>
    );
  }

  // Check if vendor has already submitted a quote to prepopulate it
  const existingQuotes = useStore((state) => state.quotations);
  const myQuote = existingQuotes.find((q) => q.rfqId === rfq.id && q.vendorId === currentUser.vendorId);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      deliveryTimelineDays: myQuote ? myQuote.deliveryTimelineDays : 7,
      notes: myQuote ? myQuote.notes : '',
      items: rfq.items.map((item) => {
        const matchingItem = myQuote?.items.find((i) => i.name === item.name);
        return {
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: matchingItem ? matchingItem.unitPrice : 0,
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  // Dynamic cost watch calculations
  const watchItems = watch('items') || [];
  const calculatedSubtotal = watchItems.reduce((sum, item) => {
    const price = Number(item.unitPrice) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const onSubmit = (data: QuoteFormValues) => {
    if (rfqId) {
      submitQuotation(rfqId, data.deliveryTimelineDays, data.items as any, data.notes || '');
      navigate(`/rfqs/${rfqId}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto animate-fade-in">
      {/* Navigation Header */}
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
            Submit Price Quotation
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Fill in delivery lead times and unit rates for RFQ: <span className="font-mono text-slate-500 font-bold">{rfq.id}</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          {/* Bid details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Delivery Timeline (Days)"
              type="number"
              min="1"
              error={errors.deliveryTimelineDays?.message}
              {...register('deliveryTimelineDays', { valueAsNumber: true })}
            />
            <div className="flex flex-col justify-end">
              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex items-center justify-between text-slate-700">
                <span className="text-xs font-semibold text-slate-500">Calculated Subtotal:</span>
                <span className="text-base font-extrabold text-slate-800 flex items-center gap-0.5">
                  <DollarSign className="w-4 h-4 text-slate-500" />
                  {calculatedSubtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quotation Item Unit Rates */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">
              Item Price List
            </span>
            
            <div className="flex flex-col gap-4">
              {fields.map((field, idx) => (
                <div key={field.id} className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Item Description</span>
                    <span className="text-sm font-bold text-slate-800">{field.name}</span>
                  </div>
                  <div className="w-full md:w-32">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Required Qty</span>
                    <span className="text-sm font-semibold text-slate-700">{field.quantity} {field.unit}</span>
                  </div>
                  <div className="w-full md:w-48 shrink-0">
                    <Input
                      label="Unit Price ($)"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      error={errors.items?.[idx]?.unitPrice?.message}
                      {...register(`items.${idx}.unitPrice`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Remarks & Quotation Notes"
            placeholder="Add warranty declarations, installation specifications, or payment terms..."
            error={errors.notes?.message}
            {...register('notes')}
          />

          <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-5">
            <Button variant="outline" type="button" onClick={() => navigate(`/rfqs/${rfqId}`)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Save className="w-4.5 h-4.5" />}>
              Submit Bid Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default QuotationSubmission;
