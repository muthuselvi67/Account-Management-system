import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ClipboardCheck, X, CheckCircle, Clock } from 'lucide-react';

export default function ClaimsPlaceholder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('mockClaims');
    return saved ? JSON.parse(saved) : [];
  });

  const [newClaim, setNewClaim] = useState({
    type: '',
    amount: '',
    date: '',
    description: '',
    status: 'Pending'
  });

  useEffect(() => {
    localStorage.setItem('mockClaims', JSON.stringify(claims));
  }, [claims]);

  const handleSubmit = () => {
    if (!newClaim.type || !newClaim.amount) return;
    const claim = {
      ...newClaim,
      id: `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setClaims([claim, ...claims]);
    setIsModalOpen(false);
    setNewClaim({ type: '', amount: '', date: '', description: '', status: 'Pending' });
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
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Submit New Claim</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Claim Type</label>
              <select
                className="input-field py-2"
                value={newClaim.type}
                onChange={(e) => setNewClaim({ ...newClaim, type: e.target.value })}
              >
                <option value="" disabled>Select a type...</option>
                <option value="🚗 Travel Claim">🚗 Travel Claim</option>
                <option value="🍽️ Food / Meal Claim">🍽️ Food / Meal Claim</option>
                <option value="🏨 Accommodation Claim">🏨 Accommodation Claim</option>
                <option value="⛽ Fuel Claim">⛽ Fuel Claim</option>
                <option value="📱 Mobile Bill Claim">📱 Mobile Bill Claim</option>
                <option value="🌐 Internet Bill Claim">🌐 Internet Bill Claim</option>
                <option value="🏥 Medical Claim">🏥 Medical Claim</option>
                <option value="🎓 Training / Certification Claim">🎓 Training / Certification Claim</option>
                <option value="🛒 Office Purchase Claim">🛒 Office Purchase Claim</option>
                <option value="📦 Other Expenses">📦 Other Expenses</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" className="input-field" value={newClaim.amount} onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Incurred</label>
                <input type="date" className="input-field text-slate-500" value={newClaim.date} onChange={(e) => setNewClaim({ ...newClaim, date: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description / Notes</label>
              <textarea className="input-field resize-none h-20" value={newClaim.description} onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Submit Claim</button>
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
            <ClipboardCheck className="text-violet-600 dark:text-violet-400" size={28} />
            Claims Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and track all employee claims and expenses.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Claim
        </button>
      </div>

      {claims.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <ClipboardCheck size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Claims Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            There are currently no claims in the system. Click the button above to create a new one.
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Claim ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Incurred</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{claim.id}</span>
                      <div className="text-[11px] text-slate-500">Submitted {claim.submittedAt}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{claim.type}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{claim.amount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{claim.date}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]" title={claim.description}>{claim.description}</td>
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
