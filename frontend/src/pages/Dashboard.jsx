import { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';
import api from '../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }) => (
  <div className="glass-card p-6 flex items-start justify-between group hover:shadow-xl transition-shadow duration-300">
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{value}</h3>
      <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{change}</span>
        <span className="text-slate-400 font-normal ml-1">vs last month</span>
      </div>
    </div>
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20 text-current`}>
      <Icon size={24} className="opacity-80 group-hover:scale-110 transition-transform duration-300" />
    </div>
  </div>
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats.php');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError("Could not connect to backend.");
        // Fallback dummy data so UI doesn't break
        setDashboardData({
          stats: {
            totalRevenue: { value: '₹8,45,000', change: '+12.5%', isPositive: true },
            totalStudents: { value: '1,245', change: '+4.2%', isPositive: true },
            pendingPayments: { value: '₹1,24,000', change: '-2.4%', isPositive: false },
            totalExpenses: { value: '₹3,15,000', change: '+8.1%', isPositive: false }
          },
          recentTransactions: [
            { id: 1, name: 'Course Fee - Rahul Sharma', date: 'Jul 20, 2026', amount: '+₹15,000', status: 'Completed', type: 'income' },
            { id: 2, name: 'Trainer Salary - Amit Kumar', date: 'Jul 19, 2026', amount: '-₹45,000', status: 'Completed', type: 'expense' },
            { id: 3, name: 'Project Advance - TechCorp', date: 'Jul 18, 2026', amount: '+₹50,000', status: 'Pending', type: 'income' },
            { id: 4, name: 'Office Rent - July', date: 'Jul 15, 2026', amount: '-₹15,000', status: 'Completed', type: 'expense' },
          ]
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Revenue',
        data: [30000, 45000, 42000, 60000, 55000, 75000, 85000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { border: { display: false }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { border: { display: false }, grid: { display: false } },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const barChartData = {
    labels: ['Rent', 'Salaries', 'Marketing', 'Utilities', 'Software', 'Misc'],
    datasets: [
      {
        label: 'Expenses',
        data: [15000, 45000, 8000, 3000, 2500, 1500],
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { border: { display: false }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { border: { display: false }, grid: { display: false } },
    },
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Here's what's happening with your accounts today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">Download Report</button>
          <button className="btn-primary flex items-center gap-2">
            <TrendingUp size={18} />
            <span>New Payment</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}

      
      {loading ? (
        <div className="flex justify-center py-10">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      ) : dashboardData?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={dashboardData.stats.totalRevenue.value} 
            change={dashboardData.stats.totalRevenue.change} 
            isPositive={dashboardData.stats.totalRevenue.isPositive} 
            icon={Wallet} 
            color="text-primary-500 bg-primary-500" 
          />
          <StatCard 
            title="Total Employee" 
            value={dashboardData.stats.totalStudents.value} 
            change={dashboardData.stats.totalStudents.change} 
            isPositive={dashboardData.stats.totalStudents.isPositive} 
            icon={Users} 
            color="text-emerald-500 bg-emerald-500" 
          />
          <StatCard 
            title="Pending Payments" 
            value={dashboardData.stats.pendingPayments.value} 
            change={dashboardData.stats.pendingPayments.change} 
            isPositive={dashboardData.stats.pendingPayments.isPositive} 
            icon={CreditCard} 
            color="text-amber-500 bg-amber-500" 
          />
          <StatCard 
            title="Total Expenses" 
            value={dashboardData.stats.totalExpenses.value} 
            change={dashboardData.stats.totalExpenses.change} 
            isPositive={dashboardData.stats.totalExpenses.isPositive} 
            icon={TrendingDown} 
            color="text-red-500 bg-red-500" 
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue Overview</h3>
            <select className="bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Expenses Breakdown</h3>
          <div className="h-[300px]">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Transactions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-dark-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
            <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Transaction</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
                {loading ? (
                   <tr><td colSpan="4" className="text-center py-4 text-slate-500">Loading...</td></tr>
                ) : dashboardData?.recentTransactions?.length > 0 ? (
                  dashboardData.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{tx.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{tx.date}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tx.status.toLowerCase() === 'completed' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-4 text-slate-500">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Add New Student', desc: 'Register for courses', icon: Users, color: 'text-primary-500 bg-primary-500' },
              { label: 'Record Payment', desc: 'Process fee or advance', icon: Wallet, color: 'text-emerald-500 bg-emerald-500' },
              { label: 'Create Invoice', desc: 'Generate GST invoice', icon: FileText, color: 'text-purple-500 bg-purple-500' },
              { label: 'Add Expense', desc: 'Log company expenses', icon: TrendingDown, color: 'text-amber-500 bg-amber-500' },
            ].map((action, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors text-left group">
                <div className={`p-3 rounded-lg ${action.color} bg-opacity-10 dark:bg-opacity-20`}>
                  <action.icon size={20} className="group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{action.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}
