import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Vendor } from '../../store/useStore';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Star, Plus, Eye, CheckCircle2, AlertTriangle, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';

const vendorSchema = zod.object({
  name: zod.string().min(3, 'Company name must be at least 3 characters'),
  category: zod.string().min(2, 'Category is required'),
  gstin: zod.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format (e.g., 27AAAAA1111A1Z1)'),
  contactPerson: zod.string().min(3, 'Contact person name is required'),
  email: zod.string().email('Please enter a valid email address'),
  phone: zod.string().min(10, 'Phone number must be at least 10 digits'),
  address: zod.string().min(10, 'Full address is required'),
  status: zod.enum(['Active', 'Pending Approval', 'Suspended'] as const),
});

type VendorForm = zod.infer<typeof vendorSchema>;

export const VendorsList: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const vendors = useStore((state) => state.vendors);
  const addVendor = useStore((state) => state.addVendor);
  const updateVendor = useStore((state) => state.updateVendor);

  const [isOpen, setIsOpen] = useState(false);
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      category: '',
      gstin: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      status: 'Pending Approval',
    },
  });

  const onSubmit = (data: VendorForm) => {
    addVendor(data);
    setIsOpen(false);
    reset();
  };

  const handleApproveStatus = (id: string) => {
    updateVendor(id, { status: 'Active' });
  };

  const handleSuspendStatus = (id: string) => {
    updateVendor(id, { status: 'Suspended' });
  };

  // Filter Logic
  const filteredVendors = vendors.filter((v) => {
    const matchesCat = catFilter === 'All' || v.category === catFilter;
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  // Unique categories for filter panel
  const categories = ['All', ...Array.from(new Set(vendors.map((v) => v.category)))];

  // Render Stars rating helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        <Star className="w-3.5 h-3.5 fill-current" />
        <span className="text-xs font-bold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Columns definition
  const columns: Column<Vendor>[] = [
    {
      header: 'Supplier Name',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 flex items-center justify-center">
            <Building className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{row.name}</span>
            <span className="text-[11px] text-slate-400 font-medium">{row.category}</span>
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'name',
    },
    {
      header: 'GSTIN / ID',
      accessor: 'gstin',
      className: 'font-mono text-xs text-slate-500',
    },
    {
      header: 'Contact Person',
      accessor: (row) => (
        <div className="flex flex-col">
          <span>{row.contactPerson}</span>
          <span className="text-xs text-slate-400 font-normal">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Rating',
      accessor: (row) => renderStars(row.rating),
      sortable: true,
      sortKey: 'rating',
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-slate-100 text-slate-500"
            onClick={() => navigate(`/vendors/${row.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Admin controls to Approve or Suspend */}
          {currentUser?.role === 'Admin' && row.status === 'Pending Approval' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-emerald-600 hover:bg-emerald-50"
              onClick={() => handleApproveStatus(row.id)}
              title="Verify Vendor"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}

          {currentUser?.role === 'Admin' && row.status === 'Active' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-rose-600 hover:bg-rose-50"
              onClick={() => handleSuspendStatus(row.id)}
              title="Suspend Vendor"
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));
  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending Approval', label: 'Pending Approval' },
    { value: 'Suspended', label: 'Suspended' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Vendor Directory
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage partner suppliers, check credit details, and document verifications
          </p>
        </div>

        {/* Create Vendor Trigger */}
        {(currentUser?.role === 'Admin' || currentUser?.role === 'Procurement Officer') && (
          <Button
            onClick={() => setIsOpen(true)}
            leftIcon={<Plus className="w-4.5 h-4.5" />}
            className="bg-primary hover:bg-primary-hover shadow-sm"
          >
            Add Vendor
          </Button>
        )}
      </div>

      {/* Filter Toolbar Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-premium">
        <Select
          label="Filter Category"
          options={categoryOptions}
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        />
        <Select
          label="Filter Verification Status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredVendors}
        searchField={(r) => r.name + ' ' + r.category + ' ' + r.gstin}
        searchPlaceholder="Search by supplier name, categories, GSTIN..."
        emptyTitle="No Vendors Registered"
        emptyDescription="We couldn't find any suppliers. Make sure filters are cleared, or create a brand new vendor profile."
      />

      {/* Registration Modal Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Register Vendor Profile"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              type="text"
              placeholder="e.g. Acme Supplies Ltd."
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Supplier Category"
              type="text"
              placeholder="e.g. IT Equipment, Construction"
              error={errors.category?.message}
              {...register('category')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="GSTIN Number (15 Digits)"
              type="text"
              placeholder="e.g. 27AAAAA1111A1Z1"
              error={errors.gstin?.message}
              {...register('gstin')}
            />
            <Input
              label="Primary Contact Person"
              type="text"
              placeholder="e.g. Jane Smith"
              error={errors.contactPerson?.message}
              {...register('contactPerson')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Business Email"
              type="email"
              placeholder="sales@supplier.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Contact Phone"
              type="text"
              placeholder="+91 99999 88888"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <Textarea
            label="Corporate Registered Address"
            placeholder="Plot No. 4, Industrial Area, Sector 5..."
            error={errors.address?.message}
            {...register('address')}
          />

          <div className="flex items-center justify-end gap-3 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Register Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default VendorsList;
