import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Building2, X, Trash2, Edit2 } from 'lucide-react';

export default function OperationalExpenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('operationalExpenses');
    const parsed = saved ? JSON.parse(saved) : null;
    
    // If we have saved data and it's not empty, use it. Otherwise, populate with default data.
    if (parsed && parsed.length > 0) return parsed;

    return [
      { id: 'OPX-8432', category: '🏢 Rent / Lease', amount: '50,000', date: '2026-07-01', description: 'Office Rent', submittedAt: 'Jul 1, 2026' },
      { id: 'OPX-9123', category: '⚡ Utilities', amount: '12,500', date: '2026-07-05', description: 'Electricity Bill', submittedAt: 'Jul 5, 2026' },
      { id: 'OPX-4421', category: '🌐 Internet & Software', amount: '2,000', date: '2026-07-10', description: 'Internet Charges', submittedAt: 'Jul 10, 2026' },
      { id: 'OPX-5122', category: '⚡ Utilities', amount: '1,500', date: '2026-07-12', description: 'Water Bill', submittedAt: 'Jul 12, 2026' },
      { id: 'OPX-8891', category: '🏢 Rent / Lease', amount: '3,50,000', date: '2026-07-15', description: 'Employee Salaries', submittedAt: 'Jul 15, 2026' },
      { id: 'OPX-3312', category: '🧹 Maintenance', amount: '8,000', date: '2026-07-18', description: 'Office Maintenance', submittedAt: 'Jul 18, 2026' },
      { id: 'OPX-7421', category: '🚚 Logistics & Transport', amount: '15,000', date: '2026-07-20', description: 'Fuel & Transportation', submittedAt: 'Jul 20, 2026' },
      { id: 'OPX-9982', category: '🌐 Internet & Software', amount: '5,000', date: '2026-07-21', description: 'Software Subscription', submittedAt: 'Jul 21, 2026' },
      { id: 'OPX-1123', category: '🏢 Rent / Lease', amount: '3,500', date: '2026-07-22', description: 'Stationery', submittedAt: 'Jul 22, 2026' },
      { id: 'OPX-4231', category: '🧹 Maintenance', amount: '6,000', date: '2026-07-25', description: 'Housekeeping', submittedAt: 'Jul 25, 2026' },
      { id: 'OPX-8931', category: '🛡️ Security', amount: '18,000', date: '2026-07-26', description: 'Security Services', submittedAt: 'Jul 26, 2026' },
      { id: 'OPX-5532', category: '🏢 Rent / Lease', amount: '4,200', date: '2026-07-28', description: 'Office Supplies', submittedAt: 'Jul 28, 2026' }
    ];
  });
  const [newExpense, setNewExpense] = useState({ id: '', category: '', amount: '', date: '', description: '' });

  useEffect(() => {
    localStorage.setItem('operationalExpenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSubmit = () => {
    if (editingId) {
      setExpenses(expenses.map(e => e.id === editingId ? { ...newExpense } : e));
    } else {
      const expense = {
        ...newExpense,
        id: newExpense.id || `OPX-${Math.floor(1000 + Math.random() * 9000)}`,
        submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setExpenses([expense, ...expenses]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setNewExpense({ id: '', category: '', amount: '', date: '', description: '' });
  };

  const handleEdit = (exp) => {
    setNewExpense(exp);
    setEditingId(exp.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setExpenses(expenses.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const modal = (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={() => setIsModalOpen(false)}
      />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(28rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingId ? 'Edit Operational Expense' : 'Add Operational Expense'}</h2>
            <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expense ID</label>
              <input type="text" className="input-field" value={newExpense.id} onChange={(e) => setNewExpense({ ...newExpense, id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input 
                type="text" 
                className="input-field" 
                value={newExpense.category} 
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" className="input-field text-slate-500" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="input-field resize-none h-20" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Save Expense</button>
          </div>
        </div>
      </div>
    </>
  );

  const deleteModal = (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={() => setDeleteConfirmId(null)}
      />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(24rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full p-6 text-center animate-scale-in">
          <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Expense?</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this expense? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirmId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
            <button onClick={confirmDelete} className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0">Yes, Delete</button>
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
            <Building2 className="text-violet-600 dark:text-violet-400" size={28} />
            Operational Expenses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage all business operational expenses.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setNewExpense({ id: '', category: '', amount: '', date: '', description: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Building2 size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Operational Expenses Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No entries yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{exp.id}</span>
                      <div className="text-[11px] text-slate-500">Added {exp.submittedAt}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{exp.category}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{exp.amount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{exp.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[180px]" title={exp.description}>{exp.description}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(exp)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && createPortal(modal, document.body)}
      {deleteConfirmId && createPortal(deleteModal, document.body)}
    </div>
  );
}
