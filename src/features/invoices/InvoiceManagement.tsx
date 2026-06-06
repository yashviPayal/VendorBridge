import React, { useState } from 'react';
import { useStore, Invoice } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Printer,
  Mail,
  CheckCircle,
  Building,
  CreditCard,
  Eye,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const InvoiceManagement: React.FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const invoices = useStore((state) => state.invoices);
  const updateInvoiceStatus = useStore((state) => state.updateInvoiceStatus);

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  if (!currentUser) return null;

  // Vendors see invoices they generated. Procurement Officers/Admins see all invoices.
  const isVendor = currentUser.role === 'Vendor';
  const displayInvoices = invoices.filter((inv) => {
    if (isVendor) return inv.vendorId === currentUser.vendorId;
    return true;
  });

  const handlePayInvoice = (invoiceId: string) => {
    updateInvoiceStatus(invoiceId, 'Paid');
    // Notify vendor
    const target = invoices.find((i) => i.id === invoiceId);
    if (target) {
      const vendorNotif = {
        id: `not-${Date.now()}`,
        forRole: 'Vendor' as const,
        forVendorId: target.vendorId,
        title: 'Invoice Paid',
        message: `Your Invoice ${invoiceId} has been marked as PAID by buyers.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      useStore.setState((state) => ({ notifications: [...state.notifications, vendorNotif] }));
      
      // Update local state instance
      const updated = useStore.getState().invoices.find((i) => i.id === invoiceId);
      if (updated) setActiveInvoice(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openEmailModal = (inv: Invoice) => {
    setEmailTo(isVendor ? 'procurement@buyer.company.com' : 'accounts@vendor.company.com');
    setEmailSubject(`Invoice Attachment - ID: ${inv.id} (PO Ref: ${inv.poId})`);
    setEmailBody(
      `Hello team,\n\nPlease find attached the invoice statement ${inv.id} totaling $${inv.total.toLocaleString()} for the deliverables related to Purchase Order ${inv.poId}.\n\nBest regards,\n${currentUser.name}\nVendorBridge ERP`
    );
    setEmailSuccess(false);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending email
    setEmailSuccess(true);
    setTimeout(() => {
      setIsEmailModalOpen(false);
      setEmailSuccess(false);
    }, 1500);

    // Add activity log in state
    useStore.setState((state) => {
      const log = {
        id: `log-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: `Sent Invoice ${activeInvoice?.id} via email to ${emailTo}`,
        module: 'Invoice' as const,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      return { auditLogs: [log, ...state.auditLogs] };
    });
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice Code',
      accessor: 'id',
      className: 'font-mono text-xs font-bold text-slate-500',
    },
    {
      header: 'PO Ref',
      accessor: 'poId',
      className: 'font-mono text-xs text-slate-400',
    },
    {
      header: 'Supplier Partner',
      accessor: 'vendorName',
      sortable: true,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      sortable: true,
    },
    {
      header: 'Invoice Total',
      accessor: (row) => (
        <span className="font-extrabold text-slate-800">
          ${row.total.toLocaleString()}
        </span>
      ),
      sortable: true,
      sortKey: 'total',
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
          onClick={() => setActiveInvoice(row)}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Invoices & Payments
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          {isVendor
            ? 'Monitor generated billings, follow up payment deadlines, and email invoice attachments'
            : 'Review incoming supplier invoices, check tax calculations, and manage payment settlements'}
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={displayInvoices}
        searchField={(r) => r.id + ' ' + r.poId + ' ' + r.vendorName}
        searchPlaceholder="Search by invoice code, PO ref, or vendor name..."
        emptyTitle="No Invoices Issued"
        emptyDescription="We couldn't locate any invoices registered in the ERP ledger database."
      />

      {/* Invoice Details Sheet Modal */}
      {activeInvoice && (
        <Modal
          isOpen={true}
          onClose={() => setActiveInvoice(null)}
          title={`Supplier Invoice: ${activeInvoice.id}`}
          size="lg"
        >
          <div className="flex flex-col gap-6 print-content">
            
            {/* Top print heading - only visible in printing */}
            <div className="hidden print-only text-center border-b border-slate-200 pb-5 mb-5">
              <h2 className="text-2xl font-bold text-slate-800">INVOICE BILL STATEMENT</h2>
              <span className="font-mono text-sm text-slate-500 font-bold">{activeInvoice.id}</span>
            </div>

            {/* Print Header Controls (hidden during print) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Financial Statement</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEmailModal(activeInvoice)}
                  leftIcon={<Mail className="w-4.5 h-4.5" />}
                  className="border-slate-200 py-1.5 px-3 text-xs"
                >
                  Email Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  leftIcon={<Printer className="w-4 h-4" />}
                  className="border-slate-200 py-1.5 px-3 text-xs"
                >
                  Print Invoice
                </Button>
              </div>
            </div>

            {/* Vendor & Buyer details */}
            <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Supplier (Billed From)
                </span>
                <strong className="text-sm text-slate-800 font-bold">{activeInvoice.vendorName}</strong>
                <p className="text-slate-500 font-medium">
                  GSTIN: 27AAAAA1111A1Z1<br />
                  Invoice Date: {activeInvoice.createdAt}<br />
                  Credit Period: Net 30 Days<br />
                  Due Date: <span className="font-bold text-rose-600">{activeInvoice.dueDate}</span>
                </p>
              </div>

              <div className="flex flex-col gap-1.5 border-l border-slate-100 pl-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Billed To (Buyer)
                </span>
                <strong className="text-sm text-slate-800 font-bold">VendorBridge Corp</strong>
                <p className="text-slate-500 font-medium">
                  Accounts Payable Division<br />
                  PO Reference Code: <span className="font-mono font-bold text-slate-700">{activeInvoice.poId}</span><br />
                  Payment Status: {activeInvoice.status}
                </p>
              </div>
            </div>

            {/* Invoice Line Items table */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Deliverables Cost Breakdown
              </span>
              
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold">
                      <th className="p-3">#</th>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Unit Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800">{item.name}</td>
                        <td className="p-3 text-right font-semibold">{item.quantity} {item.unit}</td>
                        <td className="p-3 text-right font-medium">${item.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right font-extrabold">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Taxes and total calculations summaries */}
            <div className="flex justify-end pt-3">
              <div className="w-80 flex flex-col gap-2 bg-slate-50/50 border border-slate-100 rounded-xl p-4.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Subtotal Amount:</span>
                  <span>${activeInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>CGST SGST Taxes (9% + 9%):</span>
                  <span>${(activeInvoice.cgst + activeInvoice.sgst).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm text-slate-800 border-t border-slate-200/60 pt-2 mt-1">
                  <span>Grand Billing Total:</span>
                  <span>${activeInvoice.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action controls footer (hidden in print) */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 mt-4 no-print">
              <Button variant="outline" onClick={() => setActiveInvoice(null)}>
                Close Window
              </Button>

              {/* Settlement Button (Officers / Admins pay invoice) */}
              {!isVendor && activeInvoice.status === 'Unpaid' && (
                <Button
                  onClick={() => handlePayInvoice(activeInvoice.id)}
                  leftIcon={<CreditCard className="w-4 h-4" />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Settle Payment
                </Button>
              )}

              {activeInvoice.status === 'Paid' && (
                <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Settle Complete</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Simulated Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Invoice Statement"
        size="sm"
      >
        {emailSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-6 gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Email Sent Successfully!</h4>
            <p className="text-xs text-slate-500">
              The invoice PDF attachment and statements have been delivered.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
            <Input
              label="Recipient Address"
              type="email"
              required
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
            />
            <Input
              label="Subject Header"
              type="text"
              required
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <Textarea
              label="Email Body Content"
              required
              rows={5}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-2 border-t border-slate-50 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" leftIcon={<Send className="w-4 h-4" />}>
                Send Email
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default InvoiceManagement;
