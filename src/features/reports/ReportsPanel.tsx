import React from 'react';
import { useStore } from '../../store/useStore';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  DollarSign,
  Star,
  ShoppingBag,
  Award,
  Download,
  Calendar,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const ReportsPanel: React.FC = () => {
  const vendors = useStore((state) => state.vendors);
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const invoices = useStore((state) => state.invoices);
  const approvals = useStore((state) => state.approvals);

  // Compute stats
  const totalApprovedSpend = approvals
    .filter((a) => a.status === 'Approved')
    .reduce((sum, a) => sum + a.totalAmount, 0);

  const totalFulfilledSpend = purchaseOrders
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.grandTotal, 0);

  const averageRating = vendors.reduce((sum, v) => sum + v.rating, 0) / (vendors.length || 1);

  // Chart data 1: Category Spend
  const categorySpendData = [
    { name: 'IT Hardware', value: 15000, color: '#2563EB' },
    { name: 'Office Furniture', value: 11150, color: '#4F46E5' },
    { name: 'Logistics Contract', value: 7000, color: '#22C55E' },
    { name: 'Maintenance Services', value: 3900, color: '#F59E0B' },
  ];

  // Chart data 2: Monthly trend (comparison of PO value vs Invoices value)
  const monthlyProcureData = [
    { month: 'Jan', orders: 4000, billing: 3800 },
    { month: 'Feb', orders: 4500, billing: 4200 },
    { month: 'Mar', orders: 5000, billing: 4900 },
    { month: 'Apr', orders: 6000, billing: 5500 },
    { month: 'May', orders: 8500, billing: 7800 },
    { month: 'Jun', orders: 11000, billing: 10200 },
  ];

  // Export report simulation
  const handleExportCSV = () => {
    // Generate simulated CSV content
    const headers = 'Month,Orders Cost,Billing Billed\n';
    const rows = monthlyProcureData.map((d) => `${d.month},${d.orders},${d.billing}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Procurement_Spend_Report_2026.csv`);
    a.click();

    // Log action
    useStore.getState().addLog('Exported spend analytics report to CSV spreadsheet', 'Reports');
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            Procurement Reports & Analytics
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Audit monthly operational summaries, vendor trust scores, and logistics spend allocations
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4.5 h-4.5" />}
          className="bg-primary hover:bg-primary-hover shadow-sm"
        >
          Export CSV Spreadsheet
        </Button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Approved Spend"
          value={`$${totalApprovedSpend.toLocaleString()}`}
          trend="Authorizations signed"
          icon={<DollarSign className="w-5 h-5" />}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <StatsCard
          title="Completed Deliverables"
          value={`$${totalFulfilledSpend.toLocaleString()}`}
          trend="PO cycles completed"
          icon={<ShoppingBag className="w-5 h-5" />}
          iconColorClass="text-emerald-600"
          iconBgClass="bg-emerald-50"
        />
        <StatsCard
          title="Average Vendor Rating"
          value={`${averageRating.toFixed(2)} / 5.0`}
          trend="Supplier trust rating"
          icon={<Star className="w-5 h-5" />}
          iconColorClass="text-amber-600"
          iconBgClass="bg-amber-50"
        />
        <StatsCard
          title="Active Vendors"
          value={vendors.filter((v) => v.status === 'Active').length}
          trend="Contracted partners"
          icon={<Award className="w-5 h-5" />}
          iconColorClass="text-purple-600"
          iconBgClass="bg-purple-50"
        />
      </div>

      {/* Recharts Graphical Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Monthly Spend trends */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Operational Expenditure Trends"
            description="Comparison of monthly Purchase Order issued values vs Invoice billings settled ($)"
          >
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={monthlyProcureData}>
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
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Line type="monotone" dataKey="orders" name="Issued Orders" stroke="#2563EB" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="billing" name="Settled Billings" stroke="#22C55E" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Card: Pie chart of spend categories */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Spend Distribution by Category"
            description="Proportionate breakdown of procurement budget allocations"
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categorySpendData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySpendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #f1f5f9',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
export default ReportsPanel;
