import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Percent, X, CheckCircle, Clock } from 'lucide-react';

export default function GST() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('gstRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [newRecord, setNewRecord] = useState({
    type: '',
    gstin: '',
    invoiceNo: '',
    amount: '',
    gstRate: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('gstRecords', JSON.stringify(records));
  }, [records]);

  const handleSubmit = () => {
    if (!newRecord.type || !newRecord.amount) return;
    const gstAmount = ((parseFloat(newRecord.amount) || 0) * (parseFloat(newRecord.gstRate) || 0) / 100).toFixed(2);
    const record = {
      ...newRecord,
      gstAmount,
      id: `GST-${Math.floor(1000 + Math.random() * 9000)}`,
      addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setRecords([record, ...records]);
    setIsModalOpen(false);
    setNewRecord({ type: '', gstin: '', invoiceNo: '', amount: '', gstRate: '', date: '', description: '' });
  };

  const modal = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(30rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add GST Record</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
              <select className="input-field py-2" value={newRecord.type} onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}>
                <option value="" disabled>Select type...</option>
                <option value="🟢 GST Collected (Sales)">🟢 GST Collected (Sales)</option>
                <option value="🔵 GST Paid (Purchase)">🔵 GST Paid (Purchase)</option>
                <option value="🔁 GST Refund">🔁 GST Refund</option>
                <option value="📋 GST Adjustment">📋 GST Adjustment</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GSTIN</label>
                <input type="text" className="input-field" value={newRecord.gstin} onChange={(e) => setNewRecord({ ...newRecord, gstin: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice No.</label>
                <input type="text" className="input-field" value={newRecord.invoiceNo} onChange={(e) => setNewRecord({ ...newRecord, invoiceNo: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Taxable Amount (₹)</label>
                <input type="number" className="input-field" value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Rate (%)</label>
                <select className="input-field py-2" value={newRecord.gstRate} onChange={(e) => setNewRecord({ ...newRecord, gstRate: e.target.value })}>
                  <option value="" disabled>Select...</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input type="date" className="input-field text-slate-500" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="input-field resize-none h-16" value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Save GST Record</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Percent className="text-violet-600 dark:text-violet-400" size={28} />
            GST Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track GST collected, paid, and filing records.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add GST Record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Percent size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No GST Records Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No GST entries yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GSTIN</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice No.</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxable Amt</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Rate</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Amt</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{r.id}</span>
                      <div className="text-[11px] text-slate-500">Added {r.addedAt}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{r.type}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.gstin || '—'}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.invoiceNo || '—'}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{r.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">{r.gstRate}%</span>
                    </td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">₹{r.gstAmount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isModalOpen && createPortal(modal, document.body)}
    </div>
  );
}
