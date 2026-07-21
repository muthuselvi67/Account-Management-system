import { useState } from 'react';
import { Search, Plus, Filter, Download, CreditCard, Banknote, Landmark, Smartphone, X } from 'lucide-react';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ student: '', amount: '', method: '', date: '', ref: '', status: 'Completed' });

  const [payments, setPayments] = useState([
    { id: 'PAY-001', student: 'Rahul Sharma', amount: '₹15,000', method: 'UPI', date: 'Jul 20, 2026', ref: 'UPI987654321', status: 'Completed' },
    { id: 'PAY-002', student: 'Priya Singh', amount: '₹20,000', method: 'Bank Transfer', date: 'Jul 19, 2026', ref: 'IMPS123456', status: 'Completed' },
    { id: 'PAY-003', student: 'Amit Kumar', amount: '₹10,000', method: 'Cash', date: 'Jul 18, 2026', ref: 'REC-001', status: 'Completed' },
    { id: 'PAY-004', student: 'Sneha Gupta', amount: '₹45,000', method: 'Online', date: 'Jul 18, 2026', ref: 'STRIPE-999', status: 'Pending' },
  ]);

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Cash': return <Banknote size={16} className="text-emerald-500" />;
      case 'Bank Transfer': return <Landmark size={16} className="text-blue-500" />;
      case 'UPI': return <Smartphone size={16} className="text-purple-500" />;
      default: return <CreditCard size={16} className="text-slate-500" />;
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Employee ID,Employee Name,Amount,Method,Date,Reference,Status\n"
      + payments.map(p => `${p.id},${p.student},${p.amount.replace(/,/g, '')},${p.method},${p.date},${p.ref},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilter = () => {
    alert('Advanced filter functionality coming soon!');
  };

  const handleSavePayment = () => {
    if (!newPayment.student || !newPayment.amount) return;
    
    let formattedDate = newPayment.date;
    if (formattedDate) {
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
    } else {
      formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    const newPay = {
      id: `PAY-00${payments.length + 1}`,
      student: newPayment.student,
      amount: newPayment.amount.toString().startsWith('₹') ? newPayment.amount : `₹${newPayment.amount}`,
      method: newPayment.method || 'Online',
      date: formattedDate,
      ref: newPayment.ref || `REF-${Math.floor(Math.random() * 10000)}`,
      status: newPayment.status || 'Completed'
    };
    
    setPayments([...payments, newPay]);
    setNewPayment({ student: '', amount: '', method: '', date: '', ref: '', status: 'Completed' });
    setIsModalOpen(false);
  };

  const filteredPayments = payments.filter(p => 
    p.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ref.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Record and track student fee payments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Record Payment</span>
        </button>
      </div>



      <div className="glass-card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by student, ID or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">

          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-dark-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-dark-700">
                <th className="px-6 py-4 font-medium">Employee ID</th>
                <th className="px-6 py-4 font-medium">Employee Name</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
              {filteredPayments.map((payment, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{payment.student}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.method)}
                      <span className="text-sm text-slate-600 dark:text-slate-300">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'Completed' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Record New Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name</label>
                <input type="text" className="input-field" value={newPayment.student} onChange={(e) => setNewPayment({ ...newPayment, student: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                  <input type="text" className="input-field" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Method</label>
                  <select className="input-field py-2" value={newPayment.method} onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}>
                    <option value="" disabled>Select</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input type="date" className="input-field text-slate-500" value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reference ID</label>
                  <input type="text" className="input-field" value={newPayment.ref} onChange={(e) => setNewPayment({ ...newPayment, ref: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select className="input-field py-2" value={newPayment.status} onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <button onClick={handleSavePayment} className="btn-primary w-full mt-2 py-2.5">Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
