import React, { useState } from 'react';
import { useStore, PurchaseOrder } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  FileText,
  Printer,
  FileCheck,
  Send,
  Building,
  ArrowRight,
  Eye,
  CheckCircle,
  TrendingUp,
  Receipt
} from 'lucide-react';

export const PurchaseOrderView: React.FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const invoices = useStore((state) => state.invoices);
  const updateVendor = useStore((state) => state.updateVendor);
  const generateInvoice = useStore((state) => state.generateInvoice);
  const addLog = useStore((state) => state.addLog);

  // Set local state to update PO status
  const [activePO, setActivePO] = useState<PurchaseOrder | null>(null);

  if (!currentUser) return null;

  // Vendors see received POs. Procurement Officers see all issued POs.
  const isVendor = currentUser.role === 'Vendor';
  const displayPOs = purchaseOrders.filter((po) => {
    if (isVendor) return po.vendorId === currentUser.vendorId;
    return true;
  });

  const handleAcknowledgePO = (poId: string) => {
    // Modify PO status locally in store using custom store set
    useStore.setState((state) => {
      const nextPOs = state.purchaseOrders.map((p) =>
        p.id === poId ? { ...p, status: 'Acknowledged' as const } : p
      );
      // Log audit
      const user = state.currentUser;
      const log = {
        id: `log-${Date.now()}`,
        userId: user?.id || '',
        userName: user?.name || '',
        userRole: user?.role || 'Vendor',
        action: `Acknowledged Purchase Order: ${poId}`,
        module: 'PO' as const,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      return {
        purchaseOrders: nextPOs,
        auditLogs: [log, ...state.auditLogs],
      };
    });

    // Notify Officer
    const officerNotif = {
      id: `not-${Date.now()}`,
      forRole: 'Procurement Officer' as const,
      title: 'PO Acknowledged',
      message: `${currentUser.name} has acknowledged Purchase Order ${poId}.`,
      read: false,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    useStore.setState((state) => ({ notifications: [...state.notifications, officerNotif] }));

    // Reset active modal context
    const updated = useStore.getState().purchaseOrders.find((p) => p.id === poId);
    if (updated) setActivePO(updated);
  };

  const handleCreateInvoice = (poId: string) => {
    const invId = generateInvoice(poId);
    if (invId) {
      setActivePO(null);
      // Redirect to invoice viewer
      // For demo, we can just close modal or tell user where to find it
    }
  };

  const handlePrintPO = () => {
    window.print();
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      header: 'PO Number',
      accessor: 'id',
      className: 'font-mono text-xs font-bold text-slate-500',
    },
    {
      header: 'Supplier Name',
      accessor: 'vendorName',
      sortable: true,
    },
    {
      header: 'Issued Date',
      accessor: 'createdAt',
      sortable: true,
    },
    {
      header: 'Grand Total',
      accessor: (row) => (
        <span className="font-extrabold text-slate-800">
          ${row.grandTotal.toLocaleString()}
        </span>
      ),
      sortable: true,
      sortKey: 'grandTotal',
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
          onClick={() => setActivePO(row)}
        >
          View Order
        </Button>
      ),
    },
  ];

  // Check if invoice is already generated for this PO
  const invoiceExists = activePO ? invoices.some((inv) => inv.poId === activePO.id) : false;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
          Purchase Orders (PO)
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          {isVendor
            ? 'Review orders received from organizations, acknowledge receipt, and generate billing invoices'
            : 'Track issued purchase orders, monitor deliveries, and review billing invoices'}
        </p>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={displayPOs}
        searchField={(r) => r.id + ' ' + r.vendorName}
        searchPlaceholder="Search by PO number or vendor..."
        emptyTitle="No Purchase Orders"
        emptyDescription="We couldn't find any active purchase orders in the ERP logs."
      />

      {/* PO View Modal Dialog */}
      {activePO && (
        <Modal
          isOpen={true}
          onClose={() => setActivePO(null)}
          title={`Purchase Order: ${activePO.id}`}
          size="lg"
        >
          {/* Printable Layout Container */}
          <div className="flex flex-col gap-6 print-content">
            
            {/* Top print heading - only visible in printing */}
            <div className="hidden print-only text-center border-b border-slate-200 pb-5 mb-5">
              <h2 className="text-2xl font-bold text-slate-800">PURCHASE ORDER</h2>
              <span className="font-mono text-sm text-slate-500 font-bold">{activePO.id}</span>
            </div>

            {/* Print Header Controls (hidden during print) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Official Document</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrintPO}
                  leftIcon={<Printer className="w-4 h-4" />}
                  className="border-slate-200 py-1.5 px-3"
                >
                  Print Order
                </Button>
              </div>
            </div>

            {/* Vendor & Buyer details */}
            <div className="grid grid-cols-2 gap-8 text-xs leading-relaxed">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Issued By (Buyer)
                </span>
                <strong className="text-sm text-slate-800 font-bold">VendorBridge Corp</strong>
                <p className="text-slate-500 font-medium">
                  Procurement Operations Division<br />
                  100, Financial District, Tech Hub<br />
                  Mumbai, MH - 400051<br />
                  GSTIN: 27BBBBB5555B1Z1
                </p>
              </div>

              <div className="flex flex-col gap-1.5 border-l border-slate-100 pl-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Issued To (Supplier)
                </span>
                <strong className="text-sm text-slate-800 font-bold">{activePO.vendorName}</strong>
                <p className="text-slate-500 font-medium">
                  Primary Contact: {activePO.vendorId}<br />
                  Date of Issue: {activePO.createdAt}<br />
                  Status: {activePO.status}
                </p>
              </div>
            </div>

            {/* PO Line Items table */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Order Items Checklist
              </span>
              
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-semibold">
                      <th className="p-3">#</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activePO.items.map((item, idx) => (
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

            {/* Calculations summaries */}
            <div className="flex justify-end pt-3">
              <div className="w-80 flex flex-col gap-2 bg-slate-50/50 border border-slate-100 rounded-xl p-4.5 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Subtotal Cost:</span>
                  <span>${activePO.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>GST (18% tax):</span>
                  <span>${activePO.gstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-bold text-sm text-slate-800 border-t border-slate-200/60 pt-2 mt-1">
                  <span>Grand Total Cost:</span>
                  <span>${activePO.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action buttons (hidden during print) */}
            <div className="flex items-center justify-end gap-3.5 border-t border-slate-100 pt-5 mt-4 no-print">
              <Button variant="outline" onClick={() => setActivePO(null)}>
                Close Window
              </Button>
              
              {/* Vendor accepts PO receipt */}
              {isVendor && activePO.status === 'Sent' && (
                <Button
                  onClick={() => handleAcknowledgePO(activePO.id)}
                  variant="success"
                  leftIcon={<CheckCircle className="w-4 h-4" />}
                >
                  Acknowledge Order
                </Button>
              )}

              {/* Vendor bills buyer invoice */}
              {isVendor && activePO.status === 'Acknowledged' && !invoiceExists && (
                <Button
                  onClick={() => handleCreateInvoice(activePO.id)}
                  leftIcon={<Receipt className="w-4.5 h-4.5" />}
                  className="bg-gradient-to-r from-primary to-secondary text-white font-bold"
                >
                  Generate Invoice Billing
                </Button>
              )}

              {/* Already Invoiced state indicator */}
              {invoiceExists && (
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Invoice generated</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default PurchaseOrderView;
