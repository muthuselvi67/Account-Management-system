import React, { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { createPortal } from 'react-dom';
import { Cog, X, Eye, Trash2, Edit2 } from 'lucide-react';

export default function OperationalRunningCosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('operationalRunningCosts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newRecord, setNewRecord] = useState({ customId: '', item: '', amount: '', date: '', description: '' });

  useEffect(() => {
    localStorage.setItem('operationalRunningCosts', JSON.stringify(records));
  }, [records]);

  const handleSubmit = () => {
    if (editingId) {
      setRecords(records.map(r => r.id === editingId ? { ...r, ...newRecord, id: newRecord.customId || r.id } : r));
    } else {
      const record = {
        ...newRecord,
        id: newRecord.customId || `ORC-${Math.floor(1000 + Math.random() * 9000)}`,
        addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setRecords([record, ...records]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setNewRecord({ customId: '', item: '', amount: '', date: '', description: '' });
  };

  const handleEdit = (r) => {
    setNewRecord({ customId: r.id, item: r.item, amount: r.amount, date: r.date, description: r.description });
    setEditingId(r.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => setDeleteConfirmId(id);

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setRecords(records.filter(r => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const modal = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(28rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingId ? 'Edit Operational Running Cost' : 'Add Operational Running Cost'}</h2>
            <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost ID (Optional)</label>
              <input type="text" className="input-field" value={newRecord.customId} onChange={(e) => setNewRecord({ ...newRecord, customId: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost Item</label>
              <input type="text" className="input-field" value={newRecord.item} onChange={(e) => setNewRecord({ ...newRecord, item: e.target.value })} />
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
            <Cog className="text-violet-600 dark:text-violet-400" size={28} />
            Operational Running Costs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track all recurring operational and infrastructure costs.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setNewRecord({ customId: '', item: '', amount: '', date: '', description: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add Cost
        </button>
      </div>

      {records.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Cog size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Records Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No operational running costs yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost Item</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4"><span className="font-semibold text-slate-900 dark:text-white">{r.id}</span><div className="text-[11px] text-slate-500">Added {r.addedAt}</div></td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{r.item}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{r.amount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[180px]" title={r.description}>{r.description}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleEdit(r)} className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex" title="Delete">
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
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Record?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this cost record? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0">Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    
      
  {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}