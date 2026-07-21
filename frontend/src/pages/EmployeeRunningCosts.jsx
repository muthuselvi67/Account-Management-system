import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users2, X } from 'lucide-react';

export default function EmployeeRunningCosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('employeeRunningCosts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newRecord, setNewRecord] = useState({ name: '', amount: '', date: '', description: '' });

  useEffect(() => {
    localStorage.setItem('employeeRunningCosts', JSON.stringify(records));
  }, [records]);

  const handleSubmit = () => {
    if (!newRecord.name || !newRecord.amount) return;
    const record = {
      ...newRecord,
      id: `ERC-${Math.floor(1000 + Math.random() * 9000)}`,
      addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setRecords([record, ...records]);
    setIsModalOpen(false);
    setNewRecord({ name: '', amount: '', date: '', description: '' });
  };

  const modal = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(28rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Employee Running Cost</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Name</label>
              <input type="text" className="input-field" value={newRecord.name} onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" className="input-field text-slate-500" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="input-field resize-none h-20" value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Save</button>
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
            <Users2 className="text-violet-600 dark:text-violet-400" size={28} />
            Employee Running Costs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track all recurring costs related to employees.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Cost
        </button>
      </div>

      {records.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Users2 size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Records Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No employee running costs yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee Name</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4"><span className="font-semibold text-slate-900 dark:text-white">{r.id}</span><div className="text-[11px] text-slate-500">Added {r.addedAt}</div></td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{r.name}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{r.amount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[180px]" title={r.description}>{r.description}</td>
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
