import { useState } from 'react';
import { FileText, Download, TrendingUp, PieChart, Users, DollarSign, Calendar, X } from 'lucide-react';
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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const getChartData = () => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: selectedReport || 'Data',
          data: [12, 19, 15, 25, 22, 30].map(v => v * 1000 + Math.floor(Math.random() * 5000)),
          backgroundColor: 'rgba(124, 58, 237, 0.5)',
          borderColor: 'rgb(124, 58, 237)',
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  const reports = [
    {
      title: 'Financial Summary',
      description: 'Overview of revenue, expenses, and net profit.',
      icon: <DollarSign size={24} className="text-emerald-500" />,
      color: 'border-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
      title: 'Employee Attendance',
      description: 'Monthly attendance records and employee stats.',
      icon: <Users size={24} className="text-blue-500" />,
      color: 'border-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10'
    },
    {
      title: 'Payroll & Salaries',
      description: 'Trainer salaries, bonuses, and tax deductions.',
      icon: <FileText size={24} className="text-purple-500" />,
      color: 'border-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10'
    },
    {
      title: 'Expense Breakdown',
      description: 'Categorized breakdown of all operational costs.',
      icon: <PieChart size={24} className="text-orange-500" />,
      color: 'border-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/10'
    },
    {
      title: 'Growth Analytics',
      description: 'Month-over-month growth patterns and forecasting.',
      icon: <TrendingUp size={24} className="text-pink-500" />,
      color: 'border-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-500/10'
    },
    {
      title: 'Annual Tax Report',
      description: 'Yearly GST and income tax report for filing.',
      icon: <Calendar size={24} className="text-indigo-500" />,
      color: 'border-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-500/10'
    }
  ];

  const handleViewReport = (title) => {
    setSelectedReport(title);
    setViewModalOpen(true);
  };

  const handleDownloadPDF = (title) => {
    const reportContent = `data:text/plain;charset=utf-8,${title}\n======================\n\nThis is a mock PDF export for the ${title} report.\nGenerated on: ${new Date().toLocaleDateString()}`;
    const encodedUri = encodeURI(reportContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Report.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate, view, and download detailed business reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className={`glass-card p-6 border-t-4 ${report.color} hover:-translate-y-1 transition-transform duration-300`}>
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${report.bg}`}>
                {report.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{report.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 h-10">
                  {report.description}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleViewReport(report.title)} className="flex-1 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors">
                    View
                  </button>
                  <button onClick={() => handleDownloadPDF(report.title)} className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Report Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{selectedReport} Dashboard</h2>
              <button onClick={() => setViewModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="h-[300px] w-full">
                {viewModalOpen && <Bar data={getChartData()} options={chartOptions} />}
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => setViewModalOpen(false)} className="btn-primary px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 border-none shadow-none">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
