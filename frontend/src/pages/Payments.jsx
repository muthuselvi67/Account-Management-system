import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, X, Search, Download, Banknote, Landmark, Smartphone, TrendingUp, Clock, CheckCircle2, IndianRupee } from 'lucide-react';

const INITIAL = [
  { id: 'PAY-001', payer: 'Rahul Sharma', amount: 15000, method: 'UPI', date: '2026-07-20', ref: 'UPI987654321', status: 'Completed', note: 'Course fee - July' },
  { id: 'PAY-002', payer: 'Priya Singh', amount: 20000, method: 'Bank Transfer', date: '2026-07-19', ref: 'IMPS123456', status: 'Completed', note: 'Training batch payment' },
  { id: 'PAY-003', payer: 'Amit Kumar', amount: 10000, method: 'Cash', date: '2026-07-18', ref: 'REC-001', status: 'Completed', note: '' },
  { id: 'PAY-004', payer: 'Sneha Gupta', amount: 45000, method: 'Online', date: '2026-07-18', ref: 'STRIPE-999', status: 'Pending', note: 'Advance payment' },
];

export default function Payments() {
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('paymentsData');
    return saved ? JSON.parse(saved) : INITIAL;
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPay, setNewPay] = useState({ payer: '', amount: '', method: 'UPI', date: '', ref: '', status: 'Completed', note: '' });

  useEffect(() => { localStorage.setItem('paymentsData', JSON.stringify(payments)); }, [payments]);

  const handleSave = () => {
    if (!newPay.payer || !newPay.amount) return;
    const pay = { ...newPay, amount: parseFloat(newPay.amount), id: `PAY-${Math.floor(1000 + Math.random() * 9000)}` };
    setPayments([pay, ...payments]);
    setIsModalOpen(false);
    setNewPay({ payer: '', amount: '', method: 'UPI', date: '', ref: '', status: 'Completed', note: '' });
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,ID,Payer,Amount,Method,Date,Reference,Status,Note\n"
      + payments.map(p => `${p.id},${p.payer},${p.amount},${p.method},${p.date},${p.ref},${p.status},${p.note}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'payments.csv';
    link.click();
  };

  const filtered = payments.filter(p =>
    (statusFilter === 'All' || p.status === statusFilter) &&
    (p.payer.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const completed = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0);

  const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;

  const methodIcon = (m) => {
    if (m === 'Cash') return <Banknote size={14} className="text-emerald-500" />;
    if (m === 'Bank Transfer') return <Landmark size={14} className="text-blue-500" />;
    if (m === 'UPI') return <Smartphone size={14} className="text-purple-500" />;
    return <CreditCard size={14} className="text-slate-500" />;
  };

  const modal = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(30rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Record New Payment</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payer Name</label>
              <input type="text" className="input-field" placeholder="e.g. Rahul Sharma" value={newPay.payer} onChange={(e) => setNewPay({ ...newPay, payer: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newPay.amount} onChange={(e) => setNewPay({ ...newPay, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                <select className="input-field py-2" value={newPay.method} onChange={(e) => setNewPay({ ...newPay, method: e.target.value })}>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Online</option>
                  <option>Cheque</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" className="input-field text-slate-500" value={newPay.date} onChange={(e) => setNewPay({ ...newPay, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select className="input-field py-2" value={newPay.status} onChange={(e) => setNewPay({ ...newPay, status: e.target.value })}>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reference / Transaction ID</label>
              <input type="text" className="input-field" value={newPay.ref} onChange={(e) => setNewPay({ ...newPay, ref: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (optional)</label>
              <textarea className="input-field resize-none h-16" value={newPay.note} onChange={(e) => setNewPay({ ...newPay, note: e.target.value })}></textarea>
            </div>
            <button onClick={handleSave} className="btn-primary w-full mt-2 py-2.5">Save Payment</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <CreditCard className="text-violet-600 dark:text-violet-400" size={28} />
            Payment Tracking
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor and record all incoming payments.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Record Payment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Received</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(total)}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(completed)}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(pending)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" className="input-field pl-9" placeholder="Search by payer or ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Completed', 'Pending', 'Failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Payer</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">No payments found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white text-sm">{p.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{p.payer}</p>
                    {p.note && <p className="text-xs text-slate-400 mt-0.5">{p.note}</p>}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{fmt(p.amount)}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {methodIcon(p.method)} {p.method}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">{p.date}</td>
                  <td className="p-4 text-xs text-slate-500 font-mono">{p.ref || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      p.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                    }`}>
                      {p.status === 'Completed' ? <CheckCircle2 size={11} /> : <Clock size={11} />} {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(modal, document.body)}
    </div>
  );
}
