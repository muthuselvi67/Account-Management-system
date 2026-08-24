import React, { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  ShoppingCart, 
  Package, 
  FileCheck, 
  CreditCard, 
  Percent, 
  Scissors,
  ArrowRight
} from 'lucide-react';

const clientModules = [
  {
    title: 'Communication',
    description: 'Manage incoming communications and client enquiries.',
    icon: MessageSquare,
    path: '/client-communications',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    borderColor: 'border-purple-100',
    buttonBg: 'bg-purple-50 hover:bg-purple-100',
    buttonText: 'text-purple-700',
    shadowColor: 'hover:shadow-purple-500/10'
  },
  {
    title: 'Quotations',
    description: 'Create and track quotations sent to clients.',
    icon: FileText,
    path: '/client-quotations',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    borderColor: 'border-orange-100',
    buttonBg: 'bg-orange-50 hover:bg-orange-100',
    buttonText: 'text-orange-700',
    shadowColor: 'hover:shadow-orange-500/10'
  },
  {
    title: 'Purchase Orders',
    description: 'Track purchase orders received from your clients.',
    icon: ShoppingCart,
    path: '/client-pos',
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50',
    borderColor: 'border-pink-100',
    buttonBg: 'bg-pink-50 hover:bg-pink-100',
    buttonText: 'text-pink-700',
    shadowColor: 'hover:shadow-pink-500/10'
  },
  {
    title: 'Services / Products',
    description: 'Log and monitor products or services supplied.',
    icon: Package,
    path: '/client-deliveries',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    borderColor: 'border-teal-100',
    buttonBg: 'bg-teal-50 hover:bg-teal-100',
    buttonText: 'text-teal-700',
    shadowColor: 'hover:shadow-teal-500/10'
  },
  {
    title: 'Sales Invoices (GST)',
    description: 'Manage sales invoices issued to clients.',
    icon: FileCheck,
    path: '/create-invoice',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-100',
    buttonBg: 'bg-blue-50 hover:bg-blue-100',
    buttonText: 'text-blue-700',
    shadowColor: 'hover:shadow-blue-500/10'
  },
  {
    title: 'Payments Received',
    description: 'Track all payments received from clients.',
    icon: CreditCard,
    path: '/client-payments',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    buttonBg: 'bg-emerald-50 hover:bg-emerald-100',
    buttonText: 'text-emerald-700',
    shadowColor: 'hover:shadow-emerald-500/10'
  },
  {
    title: 'GST',
    description: 'Manage Output GST collected from clients.',
    icon: Percent,
    path: '/output-gst',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    borderColor: 'border-violet-100',
    buttonBg: 'bg-violet-50 hover:bg-violet-100',
    buttonText: 'text-violet-700',
    shadowColor: 'hover:shadow-violet-500/10'
  },
  {
    title: 'TDS',
    description: 'Track TDS deducted by clients.',
    icon: Scissors,
    path: '/client-tds',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    borderColor: 'border-amber-100',
    buttonBg: 'bg-amber-50 hover:bg-amber-100',
    buttonText: 'text-amber-700',
    shadowColor: 'hover:shadow-amber-500/10'
  }
];

export default function ClientsHub() {
  const [transactions, setTransactions] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);

  useEffect(() => {
    let allTx = [];
    const getRecords = (key) => {
      try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
    };
    
    // Invoices
    getRecords('clientInvoices').forEach(inv => {
      let numAmt = parseFloat((inv.amount || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
      let numGst = parseFloat((inv.gst || '0%').replace('%','')) || 0;
      let totalAmt = numAmt + (numAmt * (numGst / 100));
      allTx.push({ id: `inv_${inv.id || inv.invoiceNumber}`, date: inv.date, type: 'Invoice', reference: inv.invoiceNumber, client: inv.clientName, amount: totalAmt, status: inv.status });
    });
    
    // Payments
    getRecords('clientPayments').forEach(pay => {
      allTx.push({ id: `pay_${pay.id || pay.paymentRef}`, date: pay.date, type: 'Payment', reference: pay.paymentRef, client: pay.clientName, amount: parseFloat((pay.amount||'').toString().replace(/[^0-9.-]+/g,"")) || 0, status: pay.status });
    });
    
    // Quotations
    getRecords('clientQuotations').forEach(q => {
      allTx.push({ id: `quo_${q.id || q.quoteNumber}`, date: q.date, type: 'Quotation', reference: q.quoteNumber, client: q.clientName, amount: parseFloat((q.amount||'').toString().replace(/[^0-9.-]+/g,"")) || 0, status: q.status });
    });
    
    // POs
    getRecords('clientPOs').forEach(po => {
      allTx.push({ id: `po_${po.id || po.poNumber}`, date: po.date, type: 'Purchase Order', reference: po.poNumber, client: po.clientName, amount: parseFloat((po.amount||'').toString().replace(/[^0-9.-]+/g,"")) || 0, status: po.status });
    });

    allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(allTx.slice(0, 15)); // Take top 15 recent
  }, []);

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {clientModules.map((module, idx) => (
          <div 
            key={idx}
            className={`bg-white dark:bg-dark-900 rounded-[16px] border ${module.borderColor} dark:border-dark-800 p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${module.shadowColor} hover:-translate-y-1 group animate-scale-in`}
            style={{ animationFillMode: 'both', animationDelay: `${idx * 75}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${module.iconBg} dark:bg-opacity-20`}>
              <module.icon className={`${module.iconColor} dark:text-opacity-90`} size={28} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              {module.title}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
              {module.description}
            </p>
            
            <Link 
              to={module.path}
              className={`inline-flex items-center justify-center w-full gap-2 py-2.5 px-4 ${module.buttonBg} dark:bg-opacity-10 ${module.buttonText} font-medium text-sm rounded-xl transition-colors duration-200`}
            >
              Open Module
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Master Transactions Table */}
      <div className="mt-8 bg-white dark:bg-dark-900 rounded-[16px] border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm animate-fade-in">
        <div className="p-6 border-b border-slate-200 dark:border-dark-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Master Client Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-dark-800">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                        tx.type === 'Invoice' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        tx.type === 'Payment' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        tx.type === 'Quotation' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' :
                        'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{tx.reference}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{tx.client}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        ['paid', 'completed', 'approved', 'received'].includes(tx.status?.toLowerCase()) 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : ['pending', 'unpaid', 'sent'].includes(tx.status?.toLowerCase())
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-dark-700 dark:text-slate-300'
                      }`}>
                        {tx.status || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}
