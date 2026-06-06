import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, VendorDocument } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
  Plus,
  Briefcase,
  History,
  CheckCircle,
  FileUp
} from 'lucide-react';

export const VendorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vendors = useStore((state) => state.vendors);
  const quotations = useStore((state) => state.quotations);
  const uploadVendorDocument = useStore((state) => state.uploadVendorDocument);

  const vendor = vendors.find((v) => v.id === id);

  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Compliance Certificate');

  if (!vendor) {
    return (
      <EmptyState
        title="Supplier Not Found"
        description="We couldn't locate any supplier matching this identifier in the ERP system."
        action={
          <Button onClick={() => navigate('/vendors')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Directory
          </Button>
        }
      />
    );
  }

  // Find quotation submissions for this vendor
  const vendorQuotes = quotations.filter((q) => q.vendorId === vendor.id);

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    const newDoc: VendorDocument = {
      name: docName,
      type: docType,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    uploadVendorDocument(vendor.id, newDoc);
    setIsDocModalOpen(false);
    setDocName('');
  };

  const docTypeOptions = [
    { value: 'Compliance Certificate', label: 'Compliance Certificate' },
    { value: 'Tax Registration', label: 'Tax Registration' },
    { value: 'ISO Certificate', label: 'ISO Certificate' },
    { value: 'Financial Statement', label: 'Financial Statement' },
    { value: 'Company ID', label: 'Company ID' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/vendors')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="border-slate-200"
        >
          Back
        </Button>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            {vendor.name}
            <StatusBadge status={vendor.status} />
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Vendor Portal ID: <span className="font-mono text-slate-500 font-bold">{vendor.id}</span>
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: General Info Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3">
              Corporate Details
            </h3>

            {/* Profile fields */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-slate-600">
                <Building className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
                  <span className="text-sm font-semibold text-slate-700">{vendor.category}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GSTIN Identifier</span>
                  <span className="text-sm font-mono font-semibold text-slate-700">{vendor.gstin}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <span className="text-sm font-semibold text-slate-700 select-all">{vendor.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</span>
                  <span className="text-sm font-semibold text-slate-700 select-all">{vendor.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headquarters</span>
                  <span className="text-xs font-semibold text-slate-700 leading-normal">{vendor.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-600">
                <Star className="w-5 h-5 text-amber-500 mt-0.5 shrink-0 fill-amber-500/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplier Trust Score</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-lg font-extrabold text-slate-800 leading-none">{vendor.rating.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">/ 5.0 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Documents & Historical quotes */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section: Documents Folder */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-primary" />
                Compliance Documents
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDocModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="py-1.5 px-3 border-slate-200"
              >
                Add Document
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendor.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-700 truncate">{doc.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">
                      {doc.type} • Uploaded {doc.uploadedAt}
                    </span>
                  </div>
                </div>
              ))}
              {vendor.documents.length === 0 && (
                <div className="col-span-2 py-8 text-center text-slate-400 text-xs font-medium bg-slate-50/20 rounded-xl border border-dashed border-slate-100">
                  No documents uploaded yet. Upload GST certificates or Iso compliance files.
                </div>
              )}
            </div>
          </div>

          {/* Section: Bidding & Quotation History */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-premium flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3">
              <History className="w-4.5 h-4.5 text-primary" />
              RFQ Bid Submissions
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                    <th className="py-3 px-2">Quotation ID</th>
                    <th className="py-3 px-2">RFQ Target</th>
                    <th className="py-3 px-2">Submitted Date</th>
                    <th className="py-3 px-2">Price Score</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {vendorQuotes.map((q) => {
                    const totalCost = q.items.reduce((sum, item) => sum + item.total, 0);

                    return (
                      <tr key={q.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-2 font-mono text-xs text-slate-500 font-bold">{q.id}</td>
                        <td className="py-3 px-2">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700">{q.rfqId}</span>
                            <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[180px]">Total Quote: ${totalCost.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-slate-500">{q.submittedAt}</td>
                        <td className="py-3 px-2 font-bold text-xs">{q.score} / 100</td>
                        <td className="py-3 px-2">
                          <StatusBadge status={q.status} />
                        </td>
                      </tr>
                    );
                  })}
                  {vendorQuotes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs font-medium">
                        This supplier has not submitted any quotations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title="Upload Compliance Document"
        size="sm"
      >
        <form onSubmit={handleUploadDoc} className="flex flex-col gap-4">
          <Input
            label="Document Name"
            type="text"
            required
            placeholder="e.g. GST_Registration.pdf"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
          <Select
            label="Document Type"
            options={docTypeOptions}
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsDocModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<FileUp className="w-4 h-4" />}>
              Save Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default VendorProfile;
