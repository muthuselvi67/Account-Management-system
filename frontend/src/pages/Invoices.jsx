import { useState } from 'react';
import { FileText, Search, Plus, Download, Printer, X } from 'lucide-react';

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ student: '', amount: '', date: '', status: 'Unpaid' });

  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', student: 'Rahul Sharma', date: 'Jul 20, 2026', amount: '₹15,000', gst: '₹2,700', total: '₹17,700', status: 'Paid' },
    { id: 'INV-2026-002', student: 'Priya Singh', date: 'Jul 19, 2026', amount: '₹20,000', gst: '₹3,600', total: '₹23,600', status: 'Paid' },
    { id: 'INV-2026-003', student: 'Amit Kumar', date: 'Jul 15, 2026', amount: '₹10,000', gst: '₹0', total: '₹10,000', status: 'Unpaid' },
  ]);

  const handleCreateInvoice = () => {
    if (!newInvoice.student || !newInvoice.amount) return;

    const parseNum = (val) => {
      if (!val) return 0;
      return parseInt(val.toString().replace(/[^0-9]/g, '')) || 0;
    };

    const baseAmount = parseNum(newInvoice.amount);
    const gstAmount = Math.round(baseAmount * 0.18);
    const totalAmount = baseAmount + gstAmount;

    const formatCurr = (val) => `₹${val.toLocaleString('en-IN')}`;

    let formattedDate = newInvoice.date;
    if (formattedDate) {
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
    } else {
      formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    const newInv = {
      id: `INV-2026-00${invoices.length + 1}`,
      student: newInvoice.student,
      date: formattedDate,
      amount: formatCurr(baseAmount),
      gst: formatCurr(gstAmount),
      total: formatCurr(totalAmount),
      status: newInvoice.status || 'Unpaid'
    };

    setInvoices([newInv, ...invoices]);
    setNewInvoice({ student: '', amount: '', date: '', status: 'Unpaid' });
    setIsModalOpen(false);
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate and manage student GST invoices.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 bg-purple-600 hover:bg-purple-700 shadow-purple-500/30">
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>

      <div className="glass-card p-4 flex justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by invoice number or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-dark-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-dark-700">
                <th className="px-6 py-4 font-medium">Invoice #</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Base Amount</th>
                <th className="px-6 py-4 font-medium">Total (Inc. GST)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
              {filteredInvoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-purple-500" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{inv.student}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{inv.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{inv.amount} <span className="text-xs text-slate-400">(+{inv.gst} GST)</span></td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{inv.total}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inv.status === 'Paid' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors" title="Download PDF">
                        <Download size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Print">
                        <Printer size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create New Invoice</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Student Name</label>
                <input type="text" className="input-field" placeholder="e.g. Rahul Sharma" value={newInvoice.student} onChange={(e) => setNewInvoice({ ...newInvoice, student: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Amount (₹)</label>
                  <input type="text" className="input-field" placeholder="₹0" value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input type="date" className="input-field text-slate-500" value={newInvoice.date} onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select className="input-field py-2" value={newInvoice.status} onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <button onClick={handleCreateInvoice} className="btn-primary w-full mt-2 py-2.5 bg-purple-600 hover:bg-purple-700">Create Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
