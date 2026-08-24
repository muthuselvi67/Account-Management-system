import { useState } from 'react';
import ViewModal from '../components/ViewModal';
import { Plus, TrendingDown, Receipt, Building, Lightbulb, Wifi, Megaphone, MoreVertical, X, Trash2, Edit2 } from 'lucide-react';

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: '', desc: '' });
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const [expenses, setExpenses] = useState([
    { id: 'EXP-101', category: 'Office Rent', amount: '₹15,000', date: 'Jul 01, 2026', desc: 'July Month Rent' },
    { id: 'EXP-102', category: 'Electricity', amount: '₹3,500', date: 'Jul 05, 2026', desc: 'June Bill' },
    { id: 'EXP-103', category: 'Internet', amount: '₹1,500', date: 'Jul 05, 2026', desc: 'Airtel Fiber' },
    { id: 'EXP-104', category: 'Marketing', amount: '₹8,000', date: 'Jul 10, 2026', desc: 'Facebook Ads' },
  ]);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Office Rent': return <Building size={20} className="text-blue-500" />;
      case 'Electricity': return <Lightbulb size={20} className="text-amber-500" />;
      case 'Internet': return <Wifi size={20} className="text-indigo-500" />;
      case 'Marketing': return <Megaphone size={20} className="text-pink-500" />;
      default: return <Receipt size={20} className="text-slate-500" />;
    }
  };

  const handleSaveExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;
    
    let formattedDate = newExpense.date;
    if (formattedDate) {
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
    } else {
      formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    }

    const expAmount = newExpense.amount.toString().startsWith('₹') ? newExpense.amount : `₹${newExpense.amount}`;

    if (editingExpenseId) {
      setExpenses(expenses.map(exp => exp.id === editingExpenseId ? {
        ...exp,
        category: newExpense.category,
        amount: expAmount,
        date: formattedDate !== 'Invalid Date' ? formattedDate : exp.date,
        desc: newExpense.desc || 'No description'
      } : exp));
    } else {
      const newExp = {
        id: `EXP-${100 + expenses.length + 1}`,
        category: newExpense.category,
        amount: expAmount,
        date: formattedDate,
        desc: newExpense.desc || 'No description'
      };
      setExpenses([newExp, ...expenses]);
    }
    
    setNewExpense({ category: '', amount: '', date: '', desc: '' });
    setEditingExpenseId(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (exp) => {
    setEditingExpenseId(exp.id);
    let inputDate = '';
    try {
      const d = new Date(exp.date);
      if (!isNaN(d.getTime())) {
        inputDate = d.toISOString().split('T')[0];
      }
    } catch (e) {}

    setNewExpense({
      category: exp.category,
      amount: exp.amount.replace('₹', ''),
      date: inputDate || exp.date,
      desc: exp.desc === 'No description' ? '' : exp.desc
    });
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setExpenses(expenses.filter(e => e.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track company expenses and overheads.</p>
        </div>
        <button onClick={() => {
          setEditingExpenseId(null);
          setNewExpense({ category: '', amount: '', date: '', desc: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <TrendingDown size={18} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-dark-700 flex justify-between items-center bg-slate-50/50 dark:bg-dark-800/50">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Receipt size={20} className="text-slate-400" />
            Recent Expenses
          </h3>
          <select className="input-field py-1.5 text-sm w-auto">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-dark-700/50">
          {expenses.map((exp, idx) => (
            <div key={idx} className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-dark-800 flex items-center justify-center">
                  {getCategoryIcon(exp.category)}
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">{exp.category}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{exp.desc} • {exp.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-slate-900 dark:text-white">{exp.amount}</span>
                <div className="relative">
                  <button onClick={() => setActiveMenu(activeMenu === exp.id ? null : exp.id)} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                    <MoreVertical size={20} />
                  </button>
                  {activeMenu === exp.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-slate-100 dark:border-dark-700 overflow-hidden z-10 animate-fade-in">
                      <button 
                        onClick={() => handleEditClick(exp)}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors flex items-center gap-2 font-medium border-b border-slate-100 dark:border-dark-700"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          setDeleteConfirmId(exp.id);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingExpenseId ? 'Edit Expense' : 'Add New Expense'}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditingExpenseId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input type="text" className="input-field" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                  <input type="text" className="input-field" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input type="date" className="input-field text-slate-500" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input type="text" className="input-field" value={newExpense.desc} onChange={(e) => setNewExpense({ ...newExpense, desc: e.target.value })} />
              </div>
              <button onClick={handleSaveExpense} className="btn-primary w-full mt-2 py-2.5">Save Expense</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in">
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
      )}
      {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}
