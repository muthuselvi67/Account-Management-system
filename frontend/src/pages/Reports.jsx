import { useState } from 'react';
import { FileText, Download, TrendingUp, PieChart, Users, DollarSign, Calendar } from 'lucide-react';
import UniversalReportModal from '../components/UniversalReportModal';

const reportConfigs = {
  'Financial Summary': {
    title: 'Financial Summary',
    description: 'Overview of revenue, expenses, and net profit.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Jul 01, 2026 - Jul 29, 2026',
      m1Val: '1,25,80,000', m1Chg: '+12.45%',
      m2Val: '78,45,000', m2Chg: '+8.32%',
      m3Val: '47,35,000', m3Chg: '+18.67%',
      m4Val: '37.68%', m4Chg: '+4.12%',
      leg1Lbl: 'Operating Expenses', leg1: '25,10,000',
      leg2Lbl: 'Marketing Expenses', leg2: '19,60,000',
      leg3Lbl: 'Employee Costs', leg3: '14,15,000',
      leg4Lbl: 'Administrative', leg4: '11,75,000',
      leg5Lbl: 'Other Expenses', leg5: '7,85,000',
      r1c: '1,25,80,000', r1p: '1,11,85,000', r1d: '13,95,000', r1dp: '12.45%',
      r2c: '78,45,000', r2p: '72,45,000', r2d: '6,00,000', r2dp: '8.32%',
      r3c: '47,35,000', r3p: '39,40,000', r3d: '7,95,000', r3dp: '18.67%',
      r4c: '37.68%', r4p: '35.20%', r4d: '2.48%', r4dp: '4.12%',
      r5c: '1,248', r5p: '1,084', r5d: '164', r5dp: '15.13%',
      r6c: '10,089', r6p: '9,256', r6d: '833', r6dp: '9.00%',
      approvedDate: '07/12/2026'
    },
    metrics: [
      { label: "TOTAL REVENUE", valKey: 'm1Val', chgKey: 'm1Chg', color: [34, 197, 94], icon: "IndianRupee", pdfIcon: "R", prefix: "Rs " },
      { label: "TOTAL EXPENSES", valKey: 'm2Val', chgKey: 'm2Chg', color: [59, 130, 246], icon: "Minus", pdfIcon: "-", prefix: "Rs " },
      { label: "NET PROFIT", valKey: 'm3Val', chgKey: 'm3Chg', color: [249, 115, 22], icon: "Plus", pdfIcon: "+", prefix: "Rs " },
      { label: "PROFIT MARGIN", valKey: 'm4Val', chgKey: 'm4Chg', color: [124, 58, 237], icon: "Percent", pdfIcon: "%" }
    ],
    charts: {
      barTitle: 'Revenue vs Expenses',
      donutTitle: 'Expense Breakdown',
      legPrefix: 'Rs '
    },
    table: {
      title: 'Summary Overview',
      rows: [
        { p: "Total Revenue", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "Total Expenses", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Net Profit", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Profit Margin (%)", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Total Transactions", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "Average Order Value", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  },
  'Employee Attendance': {
    title: 'Employee Attendance',
    description: 'Monthly attendance records and employee stats.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Jul 01, 2026 - Jul 29, 2026',
      m1Val: '142', m1Chg: '+5',
      m2Val: '95.2%', m2Chg: '+1.4%',
      m3Val: '18', m3Chg: '-3',
      m4Val: '320', m4Chg: '+45',
      leg1Lbl: 'Present', leg1: '120',
      leg2Lbl: 'Absent', leg2: '15',
      leg3Lbl: 'Leave', leg3: '5',
      leg4Lbl: 'Half Day', leg4: '2',
      leg5Lbl: 'Holiday', leg5: '0',
      r1c: '142', r1p: '137', r1d: '5', r1dp: '3.6%',
      r2c: '95.2%', r2p: '93.8%', r2d: '1.4%', r2dp: '1.5%',
      r3c: '18', r3p: '21', r3d: '-3', r3dp: '-14.2%',
      r4c: '320', r4p: '275', r4d: '45', r4dp: '16.3%',
      r5c: '1.2', r5p: '1.5', r5d: '-0.3', r5dp: '-20.0%',
      r6c: '42', r6p: '38', r6d: '4', r6dp: '10.5%',
      approvedDate: '07/12/2026'
    },
    metrics: [
      { label: "TOTAL EMPLOYEES", valKey: 'm1Val', chgKey: 'm1Chg', color: [34, 197, 94], icon: "Users", pdfIcon: "U" },
      { label: "AVG ATTENDANCE", valKey: 'm2Val', chgKey: 'm2Chg', color: [59, 130, 246], icon: "Percent", pdfIcon: "%" },
      { label: "LEAVES TAKEN", valKey: 'm3Val', chgKey: 'm3Chg', color: [249, 115, 22], icon: "Minus", pdfIcon: "-" },
      { label: "OVERTIME HOURS", valKey: 'm4Val', chgKey: 'm4Chg', color: [124, 58, 237], icon: "TrendingUp", pdfIcon: "^" }
    ],
    charts: {
      barTitle: 'Attendance Trends',
      donutTitle: 'Status Breakdown',
      legPrefix: ''
    },
    table: {
      title: 'Attendance Overview',
      rows: [
        { p: "Total Employees", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "Avg Attendance (%)", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Leaves Taken", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Overtime Hours", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Late Arrivals (Avg)", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "New Hires", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  },
  'Payroll & Salaries': {
    title: 'Payroll & Salaries',
    description: 'Trainer salaries, bonuses, and tax deductions.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Jul 01, 2026 - Jul 29, 2026',
      m1Val: '28,45,000', m1Chg: '+5.45%',
      m2Val: '3,20,000', m2Chg: '+2.32%',
      m3Val: '4,15,000', m3Chg: '-1.67%',
      m4Val: '21,10,000', m4Chg: '+8.12%',
      leg1Lbl: 'Base Salary', leg1: '21,10,000',
      leg2Lbl: 'Bonuses', leg2: '3,20,000',
      leg3Lbl: 'Allowances', leg3: '2,15,000',
      leg4Lbl: 'Overtime', leg4: '2,00,000',
      leg5Lbl: 'Other', leg5: '0',
      r1c: '28,45,000', r1p: '26,97,000', r1d: '1,48,000', r1dp: '5.45%',
      r2c: '3,20,000', r2p: '3,12,000', r2d: '8,000', r2dp: '2.32%',
      r3c: '4,15,000', r3p: '4,22,000', r3d: '-7,000', r3dp: '-1.67%',
      r4c: '21,10,000', r4p: '19,51,000', r4d: '1,59,000', r4dp: '8.12%',
      r5c: '142', r5p: '137', r5d: '5', r5dp: '3.6%',
      r6c: '14,859', r6p: '14,240', r6d: '619', r6dp: '4.3%',
      approvedDate: '07/12/2026'
    },
    metrics: [
      { label: "TOTAL PAYROLL", valKey: 'm1Val', chgKey: 'm1Chg', color: [34, 197, 94], icon: "FileText", pdfIcon: "P", prefix: "Rs " },
      { label: "TOTAL BONUSES", valKey: 'm2Val', chgKey: 'm2Chg', color: [59, 130, 246], icon: "Plus", pdfIcon: "+", prefix: "Rs " },
      { label: "TAX DEDUCTED", valKey: 'm3Val', chgKey: 'm3Chg', color: [249, 115, 22], icon: "Minus", pdfIcon: "-", prefix: "Rs " },
      { label: "NET DISBURSED", valKey: 'm4Val', chgKey: 'm4Chg', color: [124, 58, 237], icon: "IndianRupee", pdfIcon: "R", prefix: "Rs " }
    ],
    charts: {
      barTitle: 'Payroll Trends',
      donutTitle: 'Component Breakdown',
      legPrefix: 'Rs '
    },
    table: {
      title: 'Payroll Overview',
      rows: [
        { p: "Total Payroll", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "Total Bonuses", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Tax Deducted (TDS)", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Net Disbursed", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Employees Paid", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "Avg Net Pay", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  },
  'Expense Breakdown': {
    title: 'Expense Breakdown',
    description: 'Categorized breakdown of all operational costs.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Jul 01, 2026 - Jul 29, 2026',
      m1Val: '78,45,000', m1Chg: '+8.32%',
      m2Val: '25,10,000', m2Chg: '+12.4%',
      m3Val: '19,60,000', m3Chg: '-3.2%',
      m4Val: '32.0%', m4Chg: '+1.5%',
      leg1Lbl: 'Operations', leg1: '25,10,000',
      leg2Lbl: 'Marketing', leg2: '19,60,000',
      leg3Lbl: 'Staffing', leg3: '14,15,000',
      leg4Lbl: 'Admin', leg4: '11,75,000',
      leg5Lbl: 'Other', leg5: '7,85,000',
      r1c: '78,45,000', r1p: '72,45,000', r1d: '6,00,000', r1dp: '8.32%',
      r2c: '25,10,000', r2p: '22,33,000', r2d: '2,77,000', r2dp: '12.4%',
      r3c: '19,60,000', r3p: '20,25,000', r3d: '-65,000', r3dp: '-3.2%',
      r4c: '14,15,000', r4p: '13,50,000', r4d: '65,000', r4dp: '4.8%',
      r5c: '11,75,000', r5p: '10,95,000', r5d: '80,000', r5dp: '7.3%',
      r6c: '7,85,000', r6p: '5,42,000', r6d: '2,43,000', r6dp: '44.8%',
      approvedDate: '07/12/2026'
    },
    metrics: [
      { label: "TOTAL EXPENSES", valKey: 'm1Val', chgKey: 'm1Chg', color: [249, 115, 22], icon: "Minus", pdfIcon: "-", prefix: "Rs " },
      { label: "TOP CATEGORY (OPS)", valKey: 'm2Val', chgKey: 'm2Chg', color: [124, 58, 237], icon: "PieChart", pdfIcon: "O", prefix: "Rs " },
      { label: "MARKETING SPEND", valKey: 'm3Val', chgKey: 'm3Chg', color: [59, 130, 246], icon: "TrendingUp", pdfIcon: "M", prefix: "Rs " },
      { label: "OPS % OF TOTAL", valKey: 'm4Val', chgKey: 'm4Chg', color: [34, 197, 94], icon: "Percent", pdfIcon: "%" }
    ],
    charts: {
      barTitle: 'Expense Trends',
      donutTitle: 'Expense Categories',
      legPrefix: 'Rs '
    },
    table: {
      title: 'Expense Categories Overview',
      rows: [
        { p: "Total Expenses", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "Operations", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Marketing", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Staffing", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Administrative", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "Other", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  },
  'Growth Analytics': {
    title: 'Growth Analytics',
    description: 'Month-over-month growth patterns and forecasting.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Jul 01, 2026 - Jul 29, 2026',
      m1Val: '18.5%', m1Chg: '+2.1%',
      m2Val: '420', m2Chg: '+85',
      m3Val: '92.4%', m3Chg: '+4.2%',
      m4Val: '3.12M', m4Chg: '+0.4M',
      leg1Lbl: 'Organic', leg1: '210',
      leg2Lbl: 'Paid Ads', leg2: '120',
      leg3Lbl: 'Referrals', leg3: '65',
      leg4Lbl: 'Direct', leg4: '20',
      leg5Lbl: 'Other', leg5: '5',
      r1c: '18.5%', r1p: '16.4%', r1d: '2.1%', r1dp: '12.8%',
      r2c: '420', r2p: '335', r2d: '85', r2dp: '25.3%',
      r3c: '92.4%', r3p: '88.2%', r3d: '4.2%', r3dp: '4.7%',
      r4c: '3.12M', r4p: '2.72M', r4d: '0.4M', r4dp: '14.7%',
      r5c: '2.4%', r5p: '3.1%', r5d: '-0.7%', r5dp: '-22.5%',
      r6c: '4.8x', r6p: '4.2x', r6d: '0.6x', r6dp: '14.2%',
      approvedDate: '07/12/2026'
    },
    metrics: [
      { label: "MOM GROWTH", valKey: 'm1Val', chgKey: 'm1Chg', color: [34, 197, 94], icon: "TrendingUp", pdfIcon: "^" },
      { label: "NEW ACQUISITIONS", valKey: 'm2Val', chgKey: 'm2Chg', color: [59, 130, 246], icon: "Users", pdfIcon: "U" },
      { label: "RETENTION RATE", valKey: 'm3Val', chgKey: 'm3Chg', color: [124, 58, 237], icon: "Percent", pdfIcon: "%" },
      { label: "LIFETIME VALUE", valKey: 'm4Val', chgKey: 'm4Chg', color: [249, 115, 22], icon: "IndianRupee", pdfIcon: "R", prefix: "Rs " }
    ],
    charts: {
      barTitle: 'Acquisition Trends',
      donutTitle: 'Acquisition Channels',
      legPrefix: ''
    },
    table: {
      title: 'Growth Overview',
      rows: [
        { p: "MoM Revenue Growth", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "New Acquisitions", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Retention Rate", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Estimated LTV", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Churn Rate", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "ROI on Marketing", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  },
  'Annual Tax Report': {
    title: 'Annual Tax Report',
    description: 'Yearly GST and income tax report for filing.',
    initialState: {
      generatedOn: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
      period: 'Apr 01, 2025 - Mar 31, 2026',
      m1Val: '14,35,000', m1Chg: '+1.45%',
      m2Val: '1,20,000', m2Chg: '-0.5%',
      m3Val: '12,80,000', m3Chg: '+4.2%',
      m4Val: '35,000', m4Chg: '-10.5%',
      leg1Lbl: 'Income Tax', leg1: '8,50,000',
      leg2Lbl: 'Output GST', leg2: '3,10,000',
      leg3Lbl: 'TDS Payable', leg3: '1,80,000',
      leg4Lbl: 'Profession Tax', leg4: '75,000',
      leg5Lbl: 'Other CESS', leg5: '20,000',
      r1c: '14,35,000', r1p: '14,14,500', r1d: '20,500', r1dp: '1.45%',
      r2c: '1,20,000', r2p: '1,20,600', r2d: '-600', r2dp: '-0.5%',
      r3c: '12,80,000', r3p: '12,28,400', r3d: '51,600', r3dp: '4.2%',
      r4c: '35,000', r4p: '39,100', r4d: '-4,100', r4dp: '-10.5%',
      r5c: '8,50,000', r5p: '8,30,000', r5d: '20,000', r5dp: '2.4%',
      r6c: '0', r6p: '15,000', r6d: '-15,000', r6dp: '-100%',
      approvedDate: '31/03/2026'
    },
    metrics: [
      { label: "TOTAL TAX LIABILITY", valKey: 'm1Val', chgKey: 'm1Chg', color: [249, 115, 22], icon: "FileText", pdfIcon: "T", prefix: "Rs " },
      { label: "INPUT TAX CREDIT", valKey: 'm2Val', chgKey: 'm2Chg', color: [34, 197, 94], icon: "Plus", pdfIcon: "+", prefix: "Rs " },
      { label: "TAX DEPOSITED", valKey: 'm3Val', chgKey: 'm3Chg', color: [59, 130, 246], icon: "IndianRupee", pdfIcon: "R", prefix: "Rs " },
      { label: "NET PAYABLE", valKey: 'm4Val', chgKey: 'm4Chg', color: [124, 58, 237], icon: "Minus", pdfIcon: "-", prefix: "Rs " }
    ],
    charts: {
      barTitle: 'Tax Deposit History',
      donutTitle: 'Tax Breakdown',
      legPrefix: 'Rs '
    },
    table: {
      title: 'Taxation Overview',
      rows: [
        { p: "Total Tax Liability", kc: 'r1c', kp: 'r1p', kd: 'r1d', kdp: 'r1dp' },
        { p: "Input Tax Credit (ITC)", kc: 'r2c', kp: 'r2p', kd: 'r2d', kdp: 'r2dp' },
        { p: "Total Tax Deposited", kc: 'r3c', kp: 'r3p', kd: 'r3d', kdp: 'r3dp' },
        { p: "Net Tax Payable", kc: 'r4c', kp: 'r4p', kd: 'r4d', kdp: 'r4dp' },
        { p: "Corporate Income Tax", kc: 'r5c', kp: 'r5p', kd: 'r5d', kdp: 'r5dp' },
        { p: "Late Payment Penalties", kc: 'r6c', kp: 'r6p', kd: 'r6d', kdp: 'r6dp' },
      ]
    }
  }
};

export default function Reports() {
  const [selectedReportConfig, setSelectedReportConfig] = useState(null);

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

  const handleOpenReport = (title) => {
    setSelectedReportConfig(reportConfigs[title]);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate, view, and download detailed business reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div 
            key={idx} 
            className={`glass-card p-6 border-t-4 ${report.color} hover:-translate-y-1 transition-transform duration-300 animate-fade-in`}
            style={{ animationDelay: `${idx * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
          >
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
                  <button onClick={() => handleOpenReport(report.title)} className="flex-1 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors">
                    View
                  </button>
                  <button onClick={() => handleOpenReport(report.title)} className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Report Modal for all reports */}
      {selectedReportConfig && (
        <UniversalReportModal 
          config={selectedReportConfig} 
          onClose={() => setSelectedReportConfig(null)} 
        />
      )}
    </div>
  );
}
