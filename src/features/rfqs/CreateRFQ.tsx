import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, RFQItem } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Checkbox } from '../../components/ui/Input';
import { ArrowLeft, ArrowRight, Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const rfqFormSchema = zod.object({
  title: zod.string().min(5, 'Title must be at least 5 characters'),
  description: zod.string().min(10, 'Description must be at least 10 characters'),
  deadline: zod.string().refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, 'Deadline must be today or in the future'),
  items: zod.array(zod.object({
    name: zod.string().min(2, 'Item name is required'),
    quantity: zod.number().min(1, 'Quantity must be at least 1'),
    unit: zod.string().min(1, 'Unit is required'),
  })).min(1, 'At least one line item is required'),
  assignedVendors: zod.array(zod.string()).min(1, 'Select at least one vendor to invite'),
  attachments: zod.string(),
});

type RFQFormValues = zod.infer<typeof rfqFormSchema>;

export const CreateRFQ: React.FC = () => {
  const navigate = useNavigate();
  const vendors = useStore((state) => state.vendors).filter((v) => v.status === 'Active');
  const createRFQ = useStore((state) => state.createRFQ);

  const [step, setStep] = useState(1);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RFQFormValues>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues: {
      title: '',
      description: '',
      deadline: new Date().toISOString().split('T')[0],
      items: [{ name: '', quantity: 1, unit: 'Units' }],
      assignedVendors: [],
      attachments: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchAssignedVendors = watch('assignedVendors') || [];

  const handleVendorCheckboxChange = (vendorId: string, checked: boolean) => {
    const current = [...watchAssignedVendors];
    if (checked) {
      setValue('assignedVendors', [...current, vendorId], { shouldValidate: true });
    } else {
      setValue('assignedVendors', current.filter((id) => id !== vendorId), { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: RFQFormValues) => {
    const fileList = data.attachments ? data.attachments.split(',').map((f) => f.trim()) : [];
    createRFQ(
      data.title,
      data.description,
      data.items,
      data.deadline,
      data.assignedVendors,
      fileList
    );
    navigate('/rfqs');
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/rfqs')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="border-slate-200"
        >
          Cancel
        </Button>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Create Request For Quotation
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Step {step} of 3 • Draft details, add specifications, invite verified suppliers
          </p>
        </div>
      </div>

      {/* Visual Step Indicator */}
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-premium">
        {[
          { label: 'General Details', stepNum: 1 },
          { label: 'Line Items Checklist', stepNum: 2 },
          { label: 'Supplier Assignments', stepNum: 3 },
        ].map((indicator) => (
          <div key={indicator.stepNum} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step >= indicator.stepNum
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              {step > indicator.stepNum ? <CheckCircle className="w-4 h-4" /> : indicator.stepNum}
            </div>
            <span
              className={`text-xs font-semibold select-none ${
                step >= indicator.stepNum ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {indicator.label}
            </span>
            {indicator.stepNum < 3 && <div className="w-16 h-px bg-slate-100 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Multi-step Form Body */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6">
          {/* STEP 1: General Details */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <Input
                label="RFQ Document Title"
                type="text"
                placeholder="e.g. IT Upgrades - Software Laptops"
                error={errors.title?.message}
                {...register('title')}
              />
              <Textarea
                label="Procurement Objective & Details"
                placeholder="Provide detailed specifications, context, delivery conditions, and scope of work..."
                error={errors.description?.message}
                {...register('description')}
              />
              <div className="w-full sm:max-w-xs">
                <Input
                  label="Submission Deadline Date"
                  type="date"
                  error={errors.deadline?.message}
                  {...register('deadline')}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Line Items */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Items Checklist
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: '', quantity: 1, unit: 'Units' })}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="py-1.5 px-3"
                >
                  Add Line Item
                </Button>
              </div>

              {errors.items?.message && (
                <p className="text-xs font-medium text-danger">{errors.items.message}</p>
              )}

              <div className="flex flex-col gap-4">
                {fields.map((field, idx) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        label={idx === 0 ? 'Item Description' : undefined}
                        type="text"
                        placeholder="e.g. Laptops, Office chairs"
                        error={errors.items?.[idx]?.name?.message}
                        {...register(`items.${idx}.name`)}
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        label={idx === 0 ? 'Qty' : undefined}
                        type="number"
                        min="1"
                        placeholder="1"
                        error={errors.items?.[idx]?.quantity?.message}
                        {...register(`items.${idx}.quantity`, { valueAsNumber: true })}
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        label={idx === 0 ? 'Unit' : undefined}
                        type="text"
                        placeholder="e.g. Units, Sets"
                        error={errors.items?.[idx]?.unit?.message}
                        {...register(`items.${idx}.unit`)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-slate-200 text-slate-500 hover:text-danger hover:bg-rose-50"
                      onClick={() => fields.length > 1 && remove(idx)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Supplier Assignments */}
          {step === 3 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Assign Verified Suppliers
                </span>
                <p className="text-xs text-slate-400 font-semibold mb-2">
                  Select which active suppliers will receive invitations to bid on this request
                </p>
                {errors.assignedVendors?.message && (
                  <p className="text-xs font-medium text-danger mb-2">{errors.assignedVendors.message}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto border border-slate-100 p-4 rounded-xl bg-slate-50/20">
                  {vendors.map((vendor) => (
                    <label
                      key={vendor.id}
                      className="flex items-center gap-3 p-3 bg-white border border-slate-100 hover:border-primary/30 rounded-xl transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={watchAssignedVendors.includes(vendor.id)}
                        onChange={(e) => handleVendorCheckboxChange(vendor.id, e.target.checked)}
                        className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700">{vendor.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{vendor.category}</span>
                      </div>
                    </label>
                  ))}
                  {vendors.length === 0 && (
                    <div className="col-span-2 text-center text-xs text-slate-400 py-6">
                      No active suppliers registered. Set up verified vendors first.
                    </div>
                  )}
                </div>
              </div>

              <Input
                label="Attachments (Comma separated filenames)"
                type="text"
                placeholder="e.g. DesignSpecs.pdf, BudgetLimits.xlsx"
                error={errors.attachments?.message}
                {...register('attachments')}
              />
            </div>
          )}

          {/* Wizard Controls Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className={`border-slate-200 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous Step
            </Button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="success"
                leftIcon={<Save className="w-4.5 h-4.5" />}
              >
                Submit RFQ Bids
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateRFQ;
