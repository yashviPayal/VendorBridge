import { create } from 'zustand';

// Types & Interfaces
export type UserRole = 'Admin' | 'Procurement Officer' | 'Vendor' | 'Manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  vendorId?: string; // If role is Vendor, link to their vendor profile
}

export interface VendorDocument {
  name: string;
  type: string;
  uploadedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  gstin: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  rating: number; // 1-5
  documents: VendorDocument[];
}

export interface RFQItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  items: RFQItem[];
  deadline: string;
  status: 'Draft' | 'Open' | 'Under Review' | 'Approved' | 'PO Generated' | 'Closed';
  assignedVendors: string[]; // Vendor IDs
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

export interface QuotationItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  items: QuotationItem[];
  deliveryTimelineDays: number;
  notes: string;
  score: number; // calculated rating out of 100
  submittedAt: string;
  status: 'Submitted' | 'Selected' | 'Rejected' | 'Approved';
}

export interface ApprovalHistoryItem {
  level: number;
  approverName: string;
  status: 'Approved' | 'Rejected';
  remarks: string;
  timestamp: string;
}

export interface Approval {
  id: string;
  rfqId: string;
  quotationId: string;
  vendorName: string;
  title: string;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks: string;
  currentLevel: number;
  totalLevels: number;
  history: ApprovalHistoryItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  rfqId: string;
  quotationId: string;
  vendorId: string;
  vendorName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  status: 'Draft' | 'Sent' | 'Acknowledged' | 'Completed';
  createdAt: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  poId: string;
  vendorId: string;
  vendorName: string;
  items: InvoiceItem[];
  subtotal: number;
  cgst: number; // 9%
  sgst: number; // 9%
  igst: number; // 0%
  total: number;
  status: 'Draft' | 'Unpaid' | 'Paid' | 'Overdue';
  createdAt: string;
  dueDate: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: 'Auth' | 'Vendor' | 'RFQ' | 'Quotation' | 'Approval' | 'PO' | 'Invoice' | 'Reports';
  timestamp: string;
}

export interface Notification {
  id: string;
  forRole: UserRole | 'All';
  forVendorId?: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

// Initial Database Seeds
const defaultUsers: User[] = [
  { id: 'usr-1', name: 'Devin Admin', email: 'admin@vendorbridge.com', role: 'Admin' },
  { id: 'usr-2', name: 'Sarah Officer', email: 'officer@vendorbridge.com', role: 'Procurement Officer' },
  { id: 'usr-3', name: 'John Vendor', email: 'vendor@vendorbridge.com', role: 'Vendor', vendorId: 'VND-001' },
  { id: 'usr-4', name: 'Robert Manager', email: 'manager@vendorbridge.com', role: 'Manager' },
];

const defaultVendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'Acme Supplies Co.',
    category: 'Office Stationery & Furniture',
    gstin: '27AAAAA1111A1Z1',
    contactPerson: 'John Smith',
    email: 'john@acme.com',
    phone: '+91 98765 43210',
    address: '102, Business Hub, Sector 15, Mumbai, MH - 400001',
    status: 'Active',
    rating: 4.5,
    documents: [
      { name: 'GST_Certificate.pdf', type: 'Tax Registration', uploadedAt: '2026-01-15' },
      { name: 'PAN_Card.pdf', type: 'Company ID', uploadedAt: '2026-01-15' }
    ]
  },
  {
    id: 'VND-002',
    name: 'Global Tech Solutions',
    category: 'IT Hardware & Networking',
    gstin: '27BBBBB2222B2Z2',
    contactPerson: 'Sarah Connor',
    email: 'sarah@globaltech.com',
    phone: '+91 98765 12345',
    address: '404, Tech Park, Phase 2, Pune, MH - 411008',
    status: 'Active',
    rating: 4.8,
    documents: [
      { name: 'GST_Certificate.pdf', type: 'Tax Registration', uploadedAt: '2026-02-10' },
      { name: 'ISO_9001.pdf', type: 'Quality Cert', uploadedAt: '2026-02-10' }
    ]
  },
  {
    id: 'VND-003',
    name: 'BuildCorp Enterprises',
    category: 'Construction Material & Maintenance',
    gstin: '27CCCCC3333C3Z3',
    contactPerson: 'Bob Builder',
    email: 'bob@buildcorp.com',
    phone: '+91 91234 56789',
    address: 'Ground Floor, Industrial Estate, Bengaluru, KA - 560048',
    status: 'Active',
    rating: 4.2,
    documents: [
      { name: 'GST_Certificate.pdf', type: 'Tax Registration', uploadedAt: '2026-03-05' }
    ]
  },
  {
    id: 'VND-004',
    name: 'Prime Logistics Ltd.',
    category: 'Supply Chain & Logistics',
    gstin: '27DDDDD4444D4Z4',
    contactPerson: 'Alice Green',
    email: 'alice@prime.com',
    phone: '+91 99999 88888',
    address: 'Plot 45, Logistics Corridor, Nhava Sheva, Navi Mumbai, MH - 410206',
    status: 'Active',
    rating: 4.6,
    documents: [
      { name: 'Logistics_License.pdf', type: 'Operating Permit', uploadedAt: '2026-04-20' }
    ]
  },
  {
    id: 'VND-005',
    name: 'Apex Maintenance Services',
    category: 'Facility Management & Maintenance',
    gstin: '27EEEEE5555E5Z5',
    contactPerson: 'Mark Ruffalo',
    email: 'mark@apex.com',
    phone: '+91 92222 33333',
    address: 'Building 14, Commercial Plaza, Gurugram, HR - 122001',
    status: 'Pending Approval',
    rating: 3.9,
    documents: []
  }
];

const defaultRFQs: RFQ[] = [
  {
    id: 'RFQ-2026-001',
    title: 'IT Hardware Upgrades 2026',
    description: 'Procurement of brand new developer laptops, 4K monitors, and wireless office peripheral packages to accommodate engineering team expansion.',
    items: [
      { name: 'Developer Laptops (32GB RAM, 1TB SSD)', quantity: 10, unit: 'Units' },
      { name: '27" 4K USB-C Professional Monitors', quantity: 20, unit: 'Units' },
      { name: 'Wireless Ergonomic Keyboard & Mouse Combos', quantity: 15, unit: 'Sets' }
    ],
    deadline: '2026-06-25',
    status: 'Open',
    assignedVendors: ['VND-002'],
    attachments: ['Hardware_Spec_Sheet.pdf'],
    createdBy: 'Sarah Officer',
    createdAt: '2026-06-01'
  },
  {
    id: 'RFQ-2026-002',
    title: 'Office Renovations & Furniture Supplies',
    description: 'Comprehensive procurement of workspace furnishing items including high back ergonomic chairs, modular cubicle desks, and digital display whiteboards.',
    items: [
      { name: 'High-back Ergonomic Task Chairs (Mesh)', quantity: 30, unit: 'Units' },
      { name: 'Modular Cluster Desk Systems (4-Seater)', quantity: 8, unit: 'Units' },
      { name: '85" Smart Interactive Whiteboards', quantity: 3, unit: 'Units' }
    ],
    deadline: '2026-06-30',
    status: 'Open',
    assignedVendors: ['VND-001', 'VND-003'],
    attachments: ['Office_Floorplan.pdf', 'Furniture_Dimensions.pdf'],
    createdBy: 'Sarah Officer',
    createdAt: '2026-06-02'
  },
  {
    id: 'RFQ-2026-003',
    title: 'Corporate Logistics & Warehousing Services',
    description: 'Contracting local freight transport services for weekly interstate transfer of product assemblies between manufacturing facility and regional distribution hub.',
    items: [
      { name: 'Weekly Dedicated Cargo Truck Service (10 Tons)', quantity: 4, unit: 'Weeks' },
      { name: 'Same-day Priority Document Couriers', quantity: 50, unit: 'Shipments' }
    ],
    deadline: '2026-06-12',
    status: 'Under Review',
    assignedVendors: ['VND-004'],
    attachments: ['Logistics_Schedule.xlsx'],
    createdBy: 'Sarah Officer',
    createdAt: '2026-06-03'
  }
];

const defaultQuotations: Quotation[] = [
  // Quotations for RFQ-2026-002 (Furniture)
  {
    id: 'QTN-2026-001',
    rfqId: 'RFQ-2026-002',
    vendorId: 'VND-001',
    vendorName: 'Acme Supplies Co.',
    items: [
      { name: 'High-back Ergonomic Task Chairs (Mesh)', quantity: 30, unit: 'Units', unitPrice: 150, total: 4500 },
      { name: 'Modular Cluster Desk Systems (4-Seater)', quantity: 8, unit: 'Units', unitPrice: 800, total: 6400 },
      { name: '85" Smart Interactive Whiteboards', quantity: 3, unit: 'Units', unitPrice: 1200, total: 3600 }
    ],
    deliveryTimelineDays: 12,
    notes: 'Acme is offering an institutional discount. All items carry a 3-year replacement warranty. Delivery is inclusive of assembly.',
    score: 88,
    submittedAt: '2026-06-04',
    status: 'Submitted'
  },
  {
    id: 'QTN-2026-002',
    rfqId: 'RFQ-2026-002',
    vendorId: 'VND-003',
    vendorName: 'BuildCorp Enterprises',
    items: [
      { name: 'High-back Ergonomic Task Chairs (Mesh)', quantity: 30, unit: 'Units', unitPrice: 175, total: 5250 },
      { name: 'Modular Cluster Desk Systems (4-Seater)', quantity: 8, unit: 'Units', unitPrice: 750, total: 6000 },
      { name: '85" Smart Interactive Whiteboards', quantity: 3, unit: 'Units', unitPrice: 1400, total: 4200 }
    ],
    deliveryTimelineDays: 18,
    notes: 'Premium commercial grade furniture. Installation will take 2 working days post-delivery. Pricing holds for 45 days.',
    score: 81,
    submittedAt: '2026-06-05',
    status: 'Submitted'
  },
  // Quotation for RFQ-2026-003 (Logistics)
  {
    id: 'QTN-2026-003',
    rfqId: 'RFQ-2026-003',
    vendorId: 'VND-004',
    vendorName: 'Prime Logistics Ltd.',
    items: [
      { name: 'Weekly Dedicated Cargo Truck Service (10 Tons)', quantity: 4, unit: 'Weeks', unitPrice: 1500, total: 6000 },
      { name: 'Same-day Priority Document Couriers', quantity: 50, unit: 'Shipments', unitPrice: 20, total: 1000 }
    ],
    deliveryTimelineDays: 3, // fast response
    notes: 'Fully insured transport vehicles equipped with real-time GPS tracking. Couriers dispatch daily at 10 AM.',
    score: 93,
    submittedAt: '2026-06-04',
    status: 'Selected' // Procurement Officer selected it, creating the approval workflow
  }
];

const defaultApprovals: Approval[] = [
  {
    id: 'APR-2026-001',
    rfqId: 'RFQ-2026-003',
    quotationId: 'QTN-2026-003',
    vendorName: 'Prime Logistics Ltd.',
    title: 'Corporate Logistics & Warehousing Services',
    totalAmount: 7000,
    status: 'Pending',
    remarks: '',
    currentLevel: 1,
    totalLevels: 2,
    history: [],
    createdAt: '2026-06-04'
  }
];

const defaultPOs: PurchaseOrder[] = [
  {
    id: 'PO-2026-001',
    rfqId: 'RFQ-2026-001',
    quotationId: 'QTN-MOCK-001',
    vendorId: 'VND-002',
    vendorName: 'Global Tech Solutions',
    items: [
      { name: 'Developer Laptops (32GB RAM, 1TB SSD)', quantity: 5, unit: 'Units', unitPrice: 2000, total: 10000 },
      { name: '27" 4K USB-C Professional Monitors', quantity: 10, unit: 'Units', unitPrice: 500, total: 5000 }
    ],
    subtotal: 15000,
    gstAmount: 2700,
    grandTotal: 17700,
    status: 'Completed',
    createdAt: '2026-05-15'
  },
  {
    id: 'PO-2026-002',
    rfqId: 'RFQ-MOCK-002',
    quotationId: 'QTN-MOCK-002',
    vendorId: 'VND-001',
    vendorName: 'Acme Supplies Co.',
    items: [
      { name: 'Office Ergonomic Task Chairs (Mesh)', quantity: 20, unit: 'Units', unitPrice: 150, total: 3000 },
      { name: 'Modular Cluster Desk Systems (4-Seater)', quantity: 2, unit: 'Units', unitPrice: 750, total: 1500 }
    ],
    subtotal: 4500,
    gstAmount: 810,
    grandTotal: 5310,
    status: 'Acknowledged',
    createdAt: '2026-05-20'
  }
];

const defaultInvoices: Invoice[] = [
  {
    id: 'INV-2026-001',
    poId: 'PO-2026-001',
    vendorId: 'VND-002',
    vendorName: 'Global Tech Solutions',
    items: [
      { name: 'Developer Laptops (32GB RAM, 1TB SSD)', quantity: 5, unit: 'Units', unitPrice: 2000, total: 10000 },
      { name: '27" 4K USB-C Professional Monitors', quantity: 10, unit: 'Units', unitPrice: 500, total: 5000 }
    ],
    subtotal: 15000,
    cgst: 1350,
    sgst: 1350,
    igst: 0,
    total: 17700,
    status: 'Paid',
    createdAt: '2026-05-18',
    dueDate: '2026-06-18'
  },
  {
    id: 'INV-2026-002',
    poId: 'PO-2026-002',
    vendorId: 'VND-001',
    vendorName: 'Acme Supplies Co.',
    items: [
      { name: 'Office Ergonomic Task Chairs (Mesh)', quantity: 20, unit: 'Units', unitPrice: 150, total: 3000 },
      { name: 'Modular Cluster Desk Systems (4-Seater)', quantity: 2, unit: 'Units', unitPrice: 750, total: 1500 }
    ],
    subtotal: 4500,
    cgst: 405,
    sgst: 405,
    igst: 0,
    total: 5310,
    status: 'Unpaid',
    createdAt: '2026-05-22',
    dueDate: '2026-06-22'
  }
];

const defaultLogs: AuditLog[] = [
  { id: 'log-1', userId: 'usr-2', userName: 'Sarah Officer', userRole: 'Procurement Officer', action: 'Created RFQ IT Hardware Upgrades 2026 (RFQ-2026-001)', module: 'RFQ', timestamp: '2026-06-01 10:15' },
  { id: 'log-2', userId: 'usr-2', userName: 'Sarah Officer', userRole: 'Procurement Officer', action: 'Created RFQ Office Renovations (RFQ-2026-002)', module: 'RFQ', timestamp: '2026-06-02 11:30' },
  { id: 'log-3', userId: 'usr-3', userName: 'John Vendor', userRole: 'Vendor', action: 'Submitted Quotation for RFQ-2026-002 (QTN-2026-001)', module: 'Quotation', timestamp: '2026-06-04 14:20' },
  { id: 'log-4', userId: 'usr-2', userName: 'Sarah Officer', userRole: 'Procurement Officer', action: 'Initiated Approval Workflow for QTN-2026-003', module: 'Approval', timestamp: '2026-06-04 16:45' },
  { id: 'log-5', userId: 'usr-4', userName: 'Robert Manager', userRole: 'Manager', action: 'Approved Purchase Order PO-2026-001', module: 'PO', timestamp: '2026-05-16 09:00' },
  { id: 'log-6', userId: 'usr-1', userName: 'Devin Admin', email: 'admin@vendorbridge.com', role: 'Admin', action: 'Updated status for Acme Supplies to Active', module: 'Vendor', timestamp: '2026-06-05 08:30' } as any
];

const defaultNotifications: Notification[] = [
  { id: 'not-1', forRole: 'Vendor', forVendorId: 'VND-001', title: 'New RFQ Assignment', message: 'You have been assigned to RFQ-2026-002: Office Renovations & Furniture Supplies. Please submit your quotation.', read: false, timestamp: '2026-06-02 11:35' },
  { id: 'not-2', forRole: 'Manager', title: 'RFQ Approval Required', message: 'Corporate Logistics & Warehousing Services (RFQ-2026-003) quotation from Prime Logistics requires your approval.', read: false, timestamp: '2026-06-04 16:48' },
  { id: 'not-3', forRole: 'Procurement Officer', title: 'Quotation Received', message: 'Acme Supplies Co. submitted a quotation for RFQ-2026-002.', read: false, timestamp: '2026-06-04 14:22' }
];

// Zustand Store State Interface
interface ERPState {
  currentUser: User | null;
  users: User[];
  vendors: Vendor[];
  rfqs: RFQ[];
  quotations: Quotation[];
  approvals: Approval[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  notifications: Notification[];

  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  registerUser: (name: string, email: string, role: UserRole, vendorId?: string) => Promise<boolean>;
  
  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id' | 'rating' | 'documents'>) => void;
  updateVendor: (id: string, updatedFields: Partial<Vendor>) => void;
  uploadVendorDocument: (vendorId: string, doc: VendorDocument) => void;
  
  // RFQs
  createRFQ: (title: string, description: string, items: RFQItem[], deadline: string, assignedVendors: string[], attachments: string[]) => string;
  updateRFQStatus: (id: string, status: RFQ['status']) => void;
  
  // Quotations
  submitQuotation: (rfqId: string, deliveryDays: number, items: { name: string; quantity: number; unit: string; unitPrice: number }[], notes: string) => void;
  selectQuotationForApproval: (quotationId: string) => void;
  
  // Approvals
  processApproval: (approvalId: string, status: 'Approved' | 'Rejected', remarks: string) => void;
  
  // PO & Invoices
  generatePO: (rfqId: string, quotationId: string) => string;
  generateInvoice: (poId: string) => string;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status']) => void;
  
  // Audit Logs Helper
  addLog: (action: string, module: AuditLog['module']) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

// Load state from localStorage or use defaults
const getLocalStorageState = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('vendorbridge_db');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
  }
  return null;
};

const saveLocalStorageState = (state: Partial<ERPState>) => {
  try {
    const dataToSave = {
      users: state.users,
      vendors: state.vendors,
      rfqs: state.rfqs,
      quotations: state.quotations,
      approvals: state.approvals,
      purchaseOrders: state.purchaseOrders,
      invoices: state.invoices,
      auditLogs: state.auditLogs,
      notifications: state.notifications,
    };
    localStorage.setItem('vendorbridge_db', JSON.stringify(dataToSave));
  } catch (e) {
    console.error('Error saving state to localStorage:', e);
  }
};

export const useStore = create<ERPState>((set, get) => {
  const localDb = getLocalStorageState() || {};

  return {
    currentUser: null,
    users: localDb.users || defaultUsers,
    vendors: localDb.vendors || defaultVendors,
    rfqs: localDb.rfqs || defaultRFQs,
    quotations: localDb.quotations || defaultQuotations,
    approvals: localDb.approvals || defaultApprovals,
    purchaseOrders: localDb.purchaseOrders || defaultPOs,
    invoices: localDb.invoices || defaultInvoices,
    auditLogs: localDb.auditLogs || defaultLogs,
    notifications: localDb.notifications || defaultNotifications,

    login: async (email: string) => {
      const user = get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        set({ currentUser: user });
        get().addLog(`User signed in as ${user.name} (${user.role})`, 'Auth');
        return true;
      }
      return false;
    },

    logout: () => {
      const user = get().currentUser;
      if (user) {
        get().addLog(`User signed out: ${user.name}`, 'Auth');
      }
      set({ currentUser: null });
    },

    registerUser: async (name: string, email: string, role: UserRole, vendorId?: string) => {
      const exists = get().users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return false;

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        vendorId: role === 'Vendor' ? vendorId || `VND-${Math.floor(Math.random() * 900 + 100)}` : undefined,
      };

      const updatedUsers = [...get().users, newUser];
      set({ users: updatedUsers });
      saveLocalStorageState({ ...get(), users: updatedUsers });
      get().addLog(`Registered new user account: ${name} (${role})`, 'Auth');
      return true;
    },

    addVendor: (vendor) => {
      const newVendor: Vendor = {
        ...vendor,
        id: `VND-${Math.floor(Math.random() * 900 + 100)}`,
        rating: 5.0,
        documents: [],
      };
      const updated = [...get().vendors, newVendor];
      set({ vendors: updated });
      saveLocalStorageState({ ...get(), vendors: updated });
      get().addLog(`Registered vendor profile: ${newVendor.name}`, 'Vendor');

      // Notify Admins
      const newNotif: Notification = {
        id: `not-${Date.now()}`,
        forRole: 'Admin',
        title: 'New Vendor Registration',
        message: `${newVendor.name} registered under category ${newVendor.category}. Pending verification.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      set({ notifications: [...get().notifications, newNotif] });
    },

    updateVendor: (id, updatedFields) => {
      const updated = get().vendors.map((v) => (v.id === id ? { ...v, ...updatedFields } : v));
      set({ vendors: updated });
      saveLocalStorageState({ ...get(), vendors: updated });
      const vendorName = get().vendors.find((v) => v.id === id)?.name || id;
      get().addLog(`Updated vendor profile settings for ${vendorName}`, 'Vendor');
    },

    uploadVendorDocument: (vendorId, doc) => {
      const updated = get().vendors.map((v) => {
        if (v.id === vendorId) {
          return { ...v, documents: [...v.documents, doc] };
        }
        return v;
      });
      set({ vendors: updated });
      saveLocalStorageState({ ...get(), vendors: updated });
      get().addLog(`Uploaded vendor documentation: ${doc.name}`, 'Vendor');
    },

    createRFQ: (title, description, items, deadline, assignedVendors, attachments) => {
      const rfqId = `RFQ-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const officerName = get().currentUser?.name || 'Sarah Officer';
      const newRFQ: RFQ = {
        id: rfqId,
        title,
        description,
        items,
        deadline,
        status: 'Open',
        assignedVendors,
        attachments,
        createdBy: officerName,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedRFQs = [...get().rfqs, newRFQ];
      set({ rfqs: updatedRFQs });
      saveLocalStorageState({ ...get(), rfqs: updatedRFQs });
      get().addLog(`Created RFQ Request: ${title} (${rfqId})`, 'RFQ');

      // Notify Assigned Vendors
      const vendorNotifications: Notification[] = assignedVendors.map((vId) => ({
        id: `not-${Date.now()}-${vId}`,
        forRole: 'Vendor',
        forVendorId: vId,
        title: 'New RFQ Invite',
        message: `You are invited to bid on: ${title} (${rfqId}). Submission deadline: ${deadline}.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }));

      set({ notifications: [...get().notifications, ...vendorNotifications] });
      return rfqId;
    },

    updateRFQStatus: (id, status) => {
      const updated = get().rfqs.map((r) => (r.id === id ? { ...r, status } : r));
      set({ rfqs: updated });
      saveLocalStorageState({ ...get(), rfqs: updated });
      get().addLog(`Changed status of RFQ ${id} to ${status}`, 'RFQ');
    },

    submitQuotation: (rfqId, deliveryDays, items, notes) => {
      const vendorId = get().currentUser?.vendorId || 'VND-001';
      const vendorName = get().vendors.find((v) => v.id === vendorId)?.name || 'Acme Supplies Co.';
      
      // Calculate a score out of 100 based on price, delivery time, and vendor rating.
      // E.g., lower prices and faster delivery yield higher score.
      const totalCost = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      const deliveryPenalty = Math.max(0, deliveryDays - 3) * 2; // Subtract points for longer delivery times
      const vendorRating = get().vendors.find((v) => v.id === vendorId)?.rating || 4.0;
      
      let score = Math.round((80 - totalCost / 1000 - deliveryPenalty) + (vendorRating * 4));
      score = Math.max(50, Math.min(99, score)); // Keep score between 50 and 99

      const newQuotation: Quotation = {
        id: `QTN-2026-${Math.floor(Math.random() * 900 + 100)}`,
        rfqId,
        vendorId,
        vendorName,
        items: items.map((itm) => ({ ...itm, total: itm.unitPrice * itm.quantity })),
        deliveryTimelineDays: deliveryDays,
        notes,
        score,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Submitted',
      };

      const updatedQuotations = [...get().quotations, newQuotation];
      
      // Update RFQ status to Under Review if it is still Open
      const updatedRFQs = get().rfqs.map((rfq) => {
        if (rfq.id === rfqId && rfq.status === 'Open') {
          return { ...rfq, status: 'Under Review' as const };
        }
        return rfq;
      });

      set({
        quotations: updatedQuotations,
        rfqs: updatedRFQs,
      });

      saveLocalStorageState({
        ...get(),
        quotations: updatedQuotations,
        rfqs: updatedRFQs,
      });

      get().addLog(`${vendorName} submitted quotation for ${rfqId}`, 'Quotation');

      // Notify Procurement Officers
      const newNotif: Notification = {
        id: `not-${Date.now()}`,
        forRole: 'Procurement Officer',
        title: 'New Bid Received',
        message: `${vendorName} submitted a bid of $${totalCost.toLocaleString()} for ${rfqId}.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      set({ notifications: [...get().notifications, newNotif] });
    },

    selectQuotationForApproval: (quotationId) => {
      const qtn = get().quotations.find((q) => q.id === quotationId);
      if (!qtn) return;

      const rfq = get().rfqs.find((r) => r.id === qtn.rfqId);
      if (!rfq) return;

      const totalCost = qtn.items.reduce((sum, i) => sum + i.total, 0);

      const newApproval: Approval = {
        id: `APR-2026-${Math.floor(Math.random() * 900 + 100)}`,
        rfqId: rfq.id,
        quotationId: qtn.id,
        vendorName: qtn.vendorName,
        title: rfq.title,
        totalAmount: totalCost,
        status: 'Pending',
        remarks: '',
        currentLevel: 1,
        totalLevels: 2,
        history: [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedQtns = get().quotations.map((q) => {
        if (q.id === qtn.id) return { ...q, status: 'Selected' as const };
        if (q.rfqId === qtn.rfqId) return { ...q, status: 'Rejected' as const };
        return q;
      });

      const updatedRFQs = get().rfqs.map((r) => {
        if (r.id === rfq.id) return { ...r, status: 'Under Review' as const };
        return r;
      });

      const updatedApprovals = [...get().approvals, newApproval];

      set({
        quotations: updatedQtns,
        rfqs: updatedRFQs,
        approvals: updatedApprovals,
      });

      saveLocalStorageState({
        ...get(),
        quotations: updatedQtns,
        rfqs: updatedRFQs,
        approvals: updatedApprovals,
      });

      get().addLog(`Selected bid ${qtn.id} for RFQ ${rfq.id}. Approval workflow generated.`, 'Approval');

      // Notify Managers
      const newNotif: Notification = {
        id: `not-${Date.now()}`,
        forRole: 'Manager',
        title: 'Approval Requested',
        message: `Quotation approval request from ${qtn.vendorName} ($${totalCost.toLocaleString()}) for RFQ ${rfq.id}.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      set({ notifications: [...get().notifications, newNotif] });
    },

    processApproval: (approvalId, status, remarks) => {
      const approverName = get().currentUser?.name || 'Robert Manager';
      
      const updatedApprovals = get().approvals.map((app) => {
        if (app.id === approvalId) {
          const isL2Approve = app.currentLevel === 2 && status === 'Approved';
          const isFinal = isL2Approve || status === 'Rejected';

          const newHistoryItem: ApprovalHistoryItem = {
            level: app.currentLevel,
            approverName,
            status,
            remarks,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          };

          return {
            ...app,
            status: isFinal ? status : 'Pending' as const,
            currentLevel: isFinal ? app.currentLevel : 2,
            remarks: remarks,
            history: [...app.history, newHistoryItem],
          };
        }
        return app;
      });

      // Find the modified approval
      const appRecord = updatedApprovals.find((a) => a.id === approvalId);
      if (!appRecord) return;

      const quotationId = appRecord.quotationId;
      const rfqId = appRecord.rfqId;

      let nextQuotations = get().quotations;
      let nextRFQs = get().rfqs;

      if (appRecord.status === 'Approved') {
        // Mark quotation as approved
        nextQuotations = get().quotations.map((q) => (q.id === quotationId ? { ...q, status: 'Approved' as const } : q));
        
        // Mark RFQ as Approved
        nextRFQs = get().rfqs.map((r) => (r.id === rfqId ? { ...r, status: 'Approved' as const } : r));
        
        get().addLog(`Manager approved procurement request ${approvalId} (Quotation ${quotationId})`, 'Approval');

        // Automatically Generate PO!
        // We will do this during the flow, but in Odoo style we can let Procurement Officer click 'Generate PO' or generate automatically
        // Let's allow the Officer to generate it via button in our PO module.
        
        // Notify Procurement Officer
        const newNotif: Notification = {
          id: `not-${Date.now()}`,
          forRole: 'Procurement Officer',
          title: 'RFQ Approved',
          message: `RFQ ${rfqId} has been APPROVED by ${approverName}. You can now generate the Purchase Order.`,
          read: false,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        };
        set({ notifications: [...get().notifications, newNotif] });

      } else if (appRecord.status === 'Rejected') {
        // Mark quotation back to submitted or rejected
        nextQuotations = get().quotations.map((q) => (q.id === quotationId ? { ...q, status: 'Rejected' as const } : q));
        
        // Mark RFQ back to open or closed
        nextRFQs = get().rfqs.map((r) => (r.id === rfqId ? { ...r, status: 'Open' as const } : r));

        get().addLog(`Manager REJECTED procurement request ${approvalId} with remarks: ${remarks}`, 'Approval');

        // Notify Procurement Officer
        const newNotif: Notification = {
          id: `not-${Date.now()}`,
          forRole: 'Procurement Officer',
          title: 'RFQ Approval Rejected',
          message: `RFQ ${rfqId} approval was rejected. Remarks: "${remarks}"`,
          read: false,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        };
        set({ notifications: [...get().notifications, newNotif] });
      }

      set({
        approvals: updatedApprovals,
        quotations: nextQuotations,
        rfqs: nextRFQs,
      });

      saveLocalStorageState({
        ...get(),
        approvals: updatedApprovals,
        quotations: nextQuotations,
        rfqs: nextRFQs,
      });
    },

    generatePO: (rfqId, quotationId) => {
      const qtn = get().quotations.find((q) => q.id === quotationId);
      if (!qtn) return '';

      const poId = `PO-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const subtotal = qtn.items.reduce((sum, item) => sum + item.total, 0);
      const gstAmount = parseFloat((subtotal * 0.18).toFixed(2));
      const grandTotal = parseFloat((subtotal + gstAmount).toFixed(2));

      const newPO: PurchaseOrder = {
        id: poId,
        rfqId,
        quotationId,
        vendorId: qtn.vendorId,
        vendorName: qtn.vendorName,
        items: qtn.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
        subtotal,
        gstAmount,
        grandTotal,
        status: 'Sent',
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedPOs = [...get().purchaseOrders, newPO];
      const updatedRFQs = get().rfqs.map((r) => (r.id === rfqId ? { ...r, status: 'PO Generated' as const } : r));

      set({
        purchaseOrders: updatedPOs,
        rfqs: updatedRFQs,
      });

      saveLocalStorageState({
        ...get(),
        purchaseOrders: updatedPOs,
        rfqs: updatedRFQs,
      });

      get().addLog(`Generated Purchase Order: ${poId} for ${qtn.vendorName}`, 'PO');

      // Notify Vendor about the PO
      const newNotif: Notification = {
        id: `not-${Date.now()}`,
        forRole: 'Vendor',
        forVendorId: qtn.vendorId,
        title: 'New Purchase Order Received',
        message: `You have received Purchase Order ${poId} for $${grandTotal.toLocaleString()}. Please acknowledge.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      set({ notifications: [...get().notifications, newNotif] });

      return poId;
    },

    generateInvoice: (poId) => {
      const po = get().purchaseOrders.find((p) => p.id === poId);
      if (!po) return '';

      const invoiceId = `INV-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const subtotal = po.subtotal;
      const cgst = parseFloat((subtotal * 0.09).toFixed(2));
      const sgst = parseFloat((subtotal * 0.09).toFixed(2));
      const total = parseFloat((subtotal + cgst + sgst).toFixed(2));

      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 30); // 30 days credit

      const newInvoice: Invoice = {
        id: invoiceId,
        poId: po.id,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        items: po.items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
          unitPrice: i.unitPrice,
          total: i.total,
        })),
        subtotal,
        cgst,
        sgst,
        igst: 0,
        total,
        status: 'Unpaid',
        createdAt: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
      };

      const updatedInvoices = [...get().invoices, newInvoice];
      const updatedPOs = get().purchaseOrders.map((p) => (p.id === poId ? { ...p, status: 'Completed' as const } : p));

      set({
        invoices: updatedInvoices,
        purchaseOrders: updatedPOs,
      });

      saveLocalStorageState({
        ...get(),
        invoices: updatedInvoices,
        purchaseOrders: updatedPOs,
      });

      get().addLog(`Generated Invoice ${invoiceId} for Purchase Order ${poId}`, 'Invoice');

      // Notify Admin and Procurement Officer
      const officerNotif: Notification = {
        id: `not-${Date.now()}-officer`,
        forRole: 'Procurement Officer',
        title: 'New Invoice Issued',
        message: `Vendor ${po.vendorName} issued Invoice ${invoiceId} for PO ${poId}. Total: $${total.toLocaleString()}.`,
        read: false,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      set({ notifications: [...get().notifications, officerNotif] });

      return invoiceId;
    },

    updateInvoiceStatus: (invoiceId, status) => {
      const updated = get().invoices.map((inv) => (inv.id === invoiceId ? { ...inv, status } : inv));
      set({ invoices: updated });
      saveLocalStorageState({ ...get(), invoices: updated });
      get().addLog(`Updated Invoice ${invoiceId} status to ${status}`, 'Invoice');
    },

    addLog: (action, module) => {
      const user = get().currentUser;
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        userId: user?.id || 'sys-agent',
        userName: user?.name || 'System Auto',
        userRole: user?.role || 'Procurement Officer',
        action,
        module,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      const updatedLogs = [newLog, ...get().auditLogs].slice(0, 100); // limit to 100 logs
      set({ auditLogs: updatedLogs });
      // Don't auto-save state here, it will be saved by the parent actions calling addLog
    },

    markNotificationRead: (id) => {
      const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      set({ notifications: updated });
      saveLocalStorageState({ ...get(), notifications: updated });
    },

    markAllNotificationsRead: () => {
      const role = get().currentUser?.role;
      if (!role) return;
      const updated = get().notifications.map((n) => (n.forRole === role || n.forRole === 'All' ? { ...n, read: true } : n));
      set({ notifications: updated });
      saveLocalStorageState({ ...get(), notifications: updated });
    },
  };
});
