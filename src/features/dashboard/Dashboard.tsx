import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, UserRole } from '../../store/useStore';
import {
  FileText,
  Clock,
  CheckCircle,
  ShoppingBag,
  FileSpreadsheet,
  Plus,
  Users,
  Search,
  ArrowUpRight,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { StatsCard } from '../../components/ui/StatsCard';
import { ChartCard } from '../../components/ui/ChartCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const rfqs = useStore((state) => state.rfqs);
  const vendors = useStore((state) => state.vendors);
  const quotations = useStore((state) => state.quotations);
  const approvals = useStore((state) => state.approvals);
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const invoices = useStore((state) => state.invoices);
  const auditLogs = useStore((state) => state.auditLogs);

  if (!currentUser) return null;
  const role = currentUser.role;

  // Chart Mock Data
  const monthlySpendData = [
    { month: 'Jan', spend: 4000 },
    { month: 'Feb', spend: 3000 },
    { month: 'Mar', spend: 2000 },
    { month: 'Apr', spend: 2780 },
    { month: 'May', spend: 1890 },
    { month: 'Jun', spend: 2390 },
  ];

  // Logic to compute specific KPIs by role
  const getKPIs = (userRole: UserRole) => {
    switch (userRole) {
      case 'Procurement Officer':
      case 'Admin':
        return [
          {
            title: 'Total RFQs',
            value: rfqs.length,
            trend: '+12%',
            trendType: 'up' as const,
            icon: <FileText className="w-5 h-5" />,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
          },
          {
            title: 'Open RFQs',
            value: rfqs.filter((r) => r.status === 'Open').length,
            trend: '+5%',
            trendType: 'up' as const,
            icon: <Clock className="w-5 h-5" />,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
          },
          {
            title: 'Pending Approvals',
            value: approvals.filter((a) => a.status === 'Pending').length,
            trend: '-8%',
            trendType: 'down' as const,
            icon: <CheckCircle className="w-5 h-5" />,
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-50',
          },
          {
            title: 'Purchase Orders',
            value: purchaseOrders.length,
            trend: '+18%',
            trendType: 'up' as const,
            icon: <ShoppingBag className="w-5 h-5" />,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
          },
          {
            title: 'Invoices Generated',
            value: invoices.length,
            trend: '+23%',
            trendType: 'up' as const,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50',
          },
        ];

      case 'Vendor':
        const vendorId = currentUser.vendorId || '';
        const myRFQs = rfqs.filter((r) => r.assignedVendors.includes(vendorId)).length;
        const myQuotes = quotations.filter((q) => q.vendorId === vendorId).length;
        const myPOs = purchaseOrders.filter((po) => po.vendorId === vendorId).length;
        const myUnpaidInvs = invoices.filter((i) => i.vendorId === vendorId && i.status === 'Unpaid').length;

        return [
          {
            title: 'Assigned RFQs',
            value: myRFQs,
            icon: <FileText className="w-5 h-5" />,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
          },
          {
            title: 'Submitted Bids',
            value: myQuotes,
            icon: <Clock className="w-5 h-5" />,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
          },
          {
            title: 'Received Purchase Orders',
            value: myPOs,
            icon: <ShoppingBag className="w-5 h-5" />,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
          },
          {
            title: 'Unpaid Invoices',
            value: myUnpaidInvs,
            icon: <FileSpreadsheet className="w-5 h-5" />,
            iconColor: 'text-rose-600',
            iconBg: 'bg-rose-50',
          },
        ];

      case 'Manager':
        const pending = approvals.filter((a) => a.status === 'Pending');
        const approvedCount = approvals.filter((a) => a.status === 'Approved').length;
        const totalApprovedAmount = approvals
          .filter((a) => a.status === 'Approved')
          .reduce((sum, a) => sum + a.totalAmount, 0);

        return [
          {
            title: 'Pending Approvals',
            value: pending.length,
            trend: `${pending.length} pending review`,
            icon: <Clock className="w-5 h-5" />,
            iconColor: 'text-amber-600',
            iconBg: 'bg-amber-50',
          },
          {
            title: 'Approved RFQs',
            value: approvedCount,
            trend: 'Direct PO ready',
            icon: <CheckCircle className="w-5 h-5" />,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50',
          },
          {
            title: 'Active Orders',
            value: purchaseOrders.filter((p) => p.status === 'Sent' || p.status === 'Acknowledged').length,
            icon: <ShoppingBag className="w-5 h-5" />,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
          },
          {
            title: 'Total Spend Approved',
            value: `$${totalApprovedAmount.toLocaleString()}`,
            trend: '+15.4% YoY',
            trendType: 'up' as const,
            icon: <DollarSign className="w-5 h-5" />,
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50',
          },
        ];

      default:
        return [];
    }
  };

  // Logic to render Quick Actions by role
  const getQuickActions = (userRole: UserRole) => {
    switch (userRole) {
      case 'Procurement Officer':
        return [
          {
            title: 'Create RFQ',
            desc: 'Start new procurement request',
            icon: <Plus className="w-5 h-5" />,
            iconBg: 'bg-blue-500 text-white',
            action: () => navigate('/rfqs'),
          },
          {
            title: 'Manage Vendors',
            desc: 'View and update vendors',
            icon: <Users className="w-5 h-5" />,
            iconBg: 'bg-emerald-500 text-white',
            action: () => navigate('/vendors'),
          },
          {
            title: 'View RFQs',
            desc: 'See all RFQs and quotations',
            icon: <FileText className="w-5 h-5" />,
            iconBg: 'bg-purple-500 text-white',
            action: () => navigate('/rfqs'),
          },
        ];
      case 'Manager':
        return [
          {
            title: 'Review Approvals',
            desc: 'Review pending bid submissions',
            icon: <CheckCircle className="w-5 h-5" />,
            iconBg: 'bg-amber-500 text-white',
            action: () => navigate('/approvals'),
          },
          {
            title: 'Purchase Orders',
            desc: 'Monitor company expenditures',
            icon: <ShoppingBag className="w-5 h-5" />,
            iconBg: 'bg-indigo-500 text-white',
            action: () => navigate('/purchase-orders'),
          },
          {
            title: 'Spend Analytics',
            desc: 'Review procurement summaries',
            icon: <TrendingUp className="w-5 h-5" />,
            iconBg: 'bg-purple-500 text-white',
            action: () => navigate('/reports'),
          },
        ];
      case 'Vendor':
        return [
          {
            title: 'Review Invitations',
            desc: 'Bidding requests assigned to you',
            icon: <Search className="w-5 h-5" />,
            iconBg: 'bg-blue-500 text-white',
            action: () => navigate('/rfqs'),
          },
          {
            title: 'Received Orders',
            desc: 'Monitor incoming Purchase Orders',
            icon: <ShoppingBag className="w-5 h-5" />,
            iconBg: 'bg-emerald-500 text-white',
            action: () => navigate('/purchase-orders'),
          },
          {
            title: 'Invoices Listing',
            desc: 'Submit and check payment status',
            icon: <FileSpreadsheet className="w-5 h-5" />,
            iconBg: 'bg-purple-500 text-white',
            action: () => navigate('/invoices'),
          },
        ];
      case 'Admin':
        return [
          {
            title: 'Manage Vendors',
            desc: 'Verify and register vendor accounts',
            icon: <Users className="w-5 h-5" />,
            iconBg: 'bg-purple-500 text-white',
            action: () => navigate('/vendors'),
          },
          {
            title: 'Activity Audit Logs',
            desc: 'Trace platform transactions',
            icon: <Activity className="w-5 h-5" />,
            iconBg: 'bg-slate-700 text-white',
            action: () => navigate('/activity-logs'),
          },
          {
            title: 'Platform Reports',
            desc: 'Access analytics and spreadsheets',
            icon: <TrendingUp className="w-5 h-5" />,
            iconBg: 'bg-indigo-500 text-white',
            action: () => navigate('/reports'),
          },
        ];
      default:
        return [];
    }
  };

  const kpis = getKPIs(role);
  const quickActions = getQuickActions(role);

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in">
      {/* Welcome Header banner */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
            Welcome back, {currentUser.name}!
          </h2>
          <p className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            Here's what's happening with your procurement activities today
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {kpis.map((kpi, idx) => (
          <StatsCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            trend={kpi.trend}
            trendType={kpi.trendType}
            icon={kpi.icon}
            iconColorClass={kpi.iconColor}
            iconBgClass={kpi.iconBg}
          />
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest select-none">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              onClick={action.action}
              className="p-5 bg-white border border-slate-100 rounded-xl shadow-premium hover:shadow-lg transition duration-200 cursor-pointer flex items-center gap-4 group"
            >
              <div className={`p-3 rounded-lg ${action.iconBg} flex items-center justify-center shrink-0`}>
                {action.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition">
                  {action.title}
                </span>
                <span className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                  {action.desc}
                </span>
              </div>
              <ArrowUpRight className="w-4.5 h-4.5 text-slate-300 ml-auto group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>
          ))}
        </div>
      </div>

      {/* Mid Section Graphs & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Spend Trends Graph */}
        <div className="lg:col-span-8">
          <ChartCard
            title={role === 'Vendor' ? 'Sales Revenue Trend' : 'Monthly Procurement Spend'}
            description="Comparison of total expenditures and purchase volume"
          >
            <ResponsiveContainer width="100%" height={260}>
              {role === 'Vendor' ? (
                <AreaChart data={monthlySpendData}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #f1f5f9',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#2563EB" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={monthlySpendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #f1f5f9',
                      borderRadius: '8px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="spend" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Side: Audit Logs Timeline / Pending Approvals */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-premium flex-1 flex flex-col">
            <h4 className="text-sm font-semibold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </h4>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4 max-h-[260px] pr-1">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex gap-3 text-xs leading-relaxed">
                  <div className="flex flex-col items-center">
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
                    <span className="w-0.5 h-full bg-slate-100 mt-1" />
                  </div>
                  <div className="flex flex-col pb-2 border-b border-slate-50 w-full min-w-0">
                    <span className="font-semibold text-slate-700 truncate">
                      {log.action}
                    </span>
                    <div className="flex items-center justify-between text-slate-400 text-[10px] mt-1 font-medium">
                      <span>{log.userName} ({log.userRole})</span>
                      <span>{log.timestamp.split(' ')[1] || log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 py-10 text-slate-400 gap-2">
                  <Clock className="w-8 h-8 opacity-45 stroke-[1.5]" />
                  <span>No recent activity</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
