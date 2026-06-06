import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore, UserRole } from '../../store/useStore';
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckSquare,
  FileSpreadsheet,
  History,
  TrendingUp,
  LogOut,
  Building2,
  Bell
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);

  if (!currentUser) return null;

  const role = currentUser.role;

  // Define navigation configuration by role
  const getNavLinks = (userRole: UserRole) => {
    const common = [
      { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    ];

    switch (userRole) {
      case 'Admin':
        return [
          ...common,
          { to: '/vendors', label: 'Vendors', icon: <Users className="w-5 h-5" /> },
          { to: '/activity-logs', label: 'Activity Logs', icon: <History className="w-5 h-5" /> },
          { to: '/reports', label: 'Reports', icon: <TrendingUp className="w-5 h-5" /> },
        ];
      case 'Procurement Officer':
        return [
          ...common,
          { to: '/vendors', label: 'Vendors', icon: <Users className="w-5 h-5" /> },
          { to: '/rfqs', label: 'RFQs', icon: <FileText className="w-5 h-5" /> },
          { to: '/approvals', label: 'Approvals', icon: <CheckSquare className="w-5 h-5" /> },
          { to: '/purchase-orders', label: 'Purchase Orders', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { to: '/activity-logs', label: 'Activity Logs', icon: <History className="w-5 h-5" /> },
          { to: '/reports', label: 'Reports & Analytics', icon: <TrendingUp className="w-5 h-5" /> },
        ];
      case 'Vendor':
        return [
          ...common,
          { to: '/rfqs', label: 'RFQs', icon: <FileText className="w-5 h-5" /> },
          { to: '/purchase-orders', label: 'Purchase Orders', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { to: '/invoices', label: 'Invoices', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { to: '/activity-logs', label: 'Activity Logs', icon: <History className="w-5 h-5" /> },
        ];
      case 'Manager':
        return [
          ...common,
          { to: '/approvals', label: 'Approvals', icon: <CheckSquare className="w-5 h-5" /> },
          { to: '/purchase-orders', label: 'Purchase Orders', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { to: '/activity-logs', label: 'Activity Logs', icon: <History className="w-5 h-5" /> },
          { to: '/reports', label: 'Reports', icon: <TrendingUp className="w-5 h-5" /> },
        ];
      default:
        return common;
    }
  };

  const navLinks = getNavLinks(role);

  return (
    <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col h-screen no-print ${className}`}>
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/20">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
          <Building2 className="w-5 h-5 stroke-[2]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-base leading-none tracking-tight">
            VendorBridge
          </span>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">
            ERP System
          </span>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 block">
          Main Menu
        </span>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition ${
                isActive
                  ? 'bg-primary/5 text-primary border-l-3 border-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-3 border-transparent'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer Account Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {currentUser.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-800 truncate leading-none">
              {currentUser.name}
            </span>
            <span className="text-[11px] font-medium text-slate-500 truncate mt-1">
              {role}
            </span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2 border border-slate-200 hover:border-danger hover:bg-rose-50/50 hover:text-danger rounded-lg text-xs font-semibold text-slate-600 transition cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
