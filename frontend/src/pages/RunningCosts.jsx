import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TrendingDown, X, AlertCircle, Trash2, Edit2 } from 'lucide-react';

export default function RunningCosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [costs, setCosts] = useState(() => {
    const saved = localStorage.getItem('learnlike_running_costs');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [newCost, setNewCost] = useState({ id: '', category: '', amount: '', frequency: '', date: '', description: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    localStorage.setItem('learnlike_running_costs', JSON.stringify(costs));
  }, [costs]);

  const handleSubmit = () => {
    const generatedId = newCost.id || `RNC-${Math.floor(1000 + Math.random() * 9000)}`;
    const cost = {
      ...newCost,
      id: generatedId,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    if (editingId) {
      setCosts(costs.map(c => c.id === editingId ? cost : c));
    } else {
      setCosts([cost, ...costs]);
    }
    
    setFormError('');
    setIsModalOpen(false);
    setEditingId(null);
    setNewCost({ id: '', category: '', amount: '', frequency: '', date: '', description: '' });
  };

  const handleEdit = (cost) => {
    setNewCost(cost);
    setEditingId(cost.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setCosts(costs.filter(c => c.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const modal = (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={() => { setIsModalOpen(false); setFormError(''); }}
      />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(28rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingId ? 'Edit Running Cost' : 'Add Running Cost'}</h2>
            <button onClick={() => { setIsModalOpen(false); setFormError(''); setEditingId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            {formError && (
              <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-fade-in border border-red-100 dark:border-red-500/20">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Running Cost ID</label>
              <input type="text" className="input-field" value={newCost.id} onChange={(e) => setNewCost({ ...newCost, id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input 
                type="text" 
                className="input-field" 
                value={newCost.category} 
                onChange={(e) => setNewCost({ ...newCost, category: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newCost.amount} onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newCost.frequency} 
                  onChange={(e) => setNewCost({ ...newCost, frequency: e.target.value })} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input type="date" className="input-field text-slate-500" value={newCost.date} onChange={(e) => setNewCost({ ...newCost, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="input-field resize-none h-20" value={newCost.description} onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Save Cost</button>
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
            <TrendingDown className="text-violet-600 dark:text-violet-400" size={28} />
            Running Costs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Monitor recurring and ongoing business running costs.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setNewCost({ id: '', category: '', amount: '', frequency: '', date: '', description: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Cost
        </button>
      </div>

      {costs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <TrendingDown size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Running Costs Found</h3>
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
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Frequency</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {costs.map((cost) => (
                  <tr key={cost.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{cost.rc_id || cost.id || `RNC-${cost.category?.slice(0,3).toUpperCase()}`}</span>
                      <div className="text-[11px] text-slate-500">Added {cost.submittedAt}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{cost.category}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{cost.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">{cost.frequency}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{cost.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]" title={cost.description}>{cost.description}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(cost)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(cost.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex" title="Delete">
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
      {deleteConfirmId && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Running Cost?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this cost entry? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0">Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
