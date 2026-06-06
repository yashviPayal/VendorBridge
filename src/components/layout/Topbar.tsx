import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Check, Wifi, AlertCircle, Menu } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const currentUser = useStore((state) => state.currentUser);
  const notifications = useStore((state) => state.notifications);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const markAllNotificationsRead = useStore((state) => state.markAllNotificationsRead);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications for the current user/role
  const filteredNotifications = notifications.filter((notif) => {
    if (!currentUser) return false;
    if (notif.forRole === 'All') return true;
    if (notif.forRole === currentUser.role) {
      if (currentUser.role === 'Vendor') {
        return notif.forVendorId === currentUser.vendorId;
      }
      return true;
    }
    return false;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/vendors')) return 'Vendors';
    if (path.startsWith('/rfqs')) return 'RFQs';
    if (path.startsWith('/approvals')) return 'Approvals';
    if (path.startsWith('/purchase-orders')) return 'Purchase Orders';
    if (path.startsWith('/invoices')) return 'Invoices';
    if (path.startsWith('/activity-logs')) return 'Activity Logs';
    if (path.startsWith('/reports')) return 'Reports & Analytics';
    return 'Procurement ERP';
  };

  return (
    <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-100 flex items-center justify-between no-print">
      {/* Page Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg lg:hidden cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 select-none">
            Portal
          </span>
          <span className="text-xs font-semibold text-slate-300 select-none">
            /
          </span>
          <span className="text-sm font-semibold text-slate-700 select-none">
            {getBreadcrumb()}
          </span>
        </div>
        <span className="sm:hidden text-sm font-bold text-slate-700 select-none">
          {getBreadcrumb()}
        </span>
      </div>

      {/* Right Side Utility Controls */}
      <div className="flex items-center gap-6">
        {/* System Active Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-700 text-xs font-semibold select-none">
          <Wifi className="w-3.5 h-3.5" />
          <span>System Active</span>
        </div>

        {/* Notifications Center Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-danger border-2 border-white rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2.5 z-50 flex flex-col max-h-[350px]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-800">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-primary hover:text-primary-hover flex items-center gap-0.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`px-4 py-3 flex gap-3 cursor-pointer hover:bg-slate-50 transition ${
                        !notif.read ? 'bg-primary/2' : ''
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg h-fit ${!notif.read ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs ${!notif.read ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                          {notif.title}
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-1">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 gap-2">
                    <Bell className="w-8 h-8 opacity-40 stroke-[1.5]" />
                    <span className="text-xs">No notifications yet</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
