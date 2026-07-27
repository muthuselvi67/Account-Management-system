import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TrendingDown, X } from 'lucide-react';
import api from '../api/axios';

export default function RunningCosts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [costs, setCosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCost, setNewCost] = useState({ id: '', category: '', amount: '', frequency: '', date: '', description: '' });

  const fetchCosts = async () => {
    try {
      const response = await api.get('/running_costs/read.php');
      setCosts(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch running costs", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosts();
  }, []);

  const handleSubmit = async () => {
    if (!newCost.category || !newCost.amount) return;
    const cost = {
      ...newCost,
      rc_id: newCost.id || `RNC-${Math.floor(1000 + Math.random() * 9000)}`
    };
    
    try {
      await api.post('/running_costs/create.php', cost);
      fetchCosts();
      setIsModalOpen(false);
      setNewCost({ id: '', category: '', amount: '', frequency: '', date: '', description: '' });
    } catch (err) {
      console.error("Failed to add cost", err);
      alert("Failed to add cost. Please try again.");
    }
  };

  const modal = (
    <>
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }}
        onClick={() => setIsModalOpen(false)}
      />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(28rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add Running Cost</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Running Cost ID</label>
              <input type="text" className="input-field" value={newCost.id} onChange={(e) => setNewCost({ ...newCost, id: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select className="input-field py-2" value={newCost.category} onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}>
                <option value="" disabled>Select a category...</option>
                <option value="📋 Employee Claims">📋 Employee Claims</option>
                <option value="💰 Allowances">💰 Allowances</option>
                <option value="🎁 Bonus">🎁 Bonus</option>
                <option value="🏦 PF & ESI">🏦 PF &amp; ESI</option>
                <option value="📊 Reports">📊 Reports</option>
                <option value="👥 Employee Running Costs">👥 Employee Running Costs</option>
                <option value="⚙️ Operational Running Costs">⚙️ Operational Running Costs</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newCost.amount} onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                <select className="input-field py-2" value={newCost.frequency} onChange={(e) => setNewCost({ ...newCost, frequency: e.target.value })}>
                  <option value="" disabled>Select...</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="One-time">One-time</option>
                </select>
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
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {costs.map((cost) => (
                  <tr key={cost.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{cost.id}</span>
                      <div className="text-[11px] text-slate-500">Added {cost.submittedAt}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{cost.category}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{cost.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">{cost.frequency}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{cost.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]" title={cost.description}>{cost.description}</td>
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
