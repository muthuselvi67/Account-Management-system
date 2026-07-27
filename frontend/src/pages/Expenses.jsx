import { useState } from 'react';
import { Plus, TrendingDown, Receipt, Building, Lightbulb, Wifi, Megaphone, MoreVertical, X } from 'lucide-react';

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: '', amount: '', date: '', desc: '' });
  
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

    const newExp = {
      id: `EXP-${100 + expenses.length + 1}`,
      category: newExpense.category,
      amount: newExpense.amount.toString().startsWith('₹') ? newExpense.amount : `₹${newExpense.amount}`,
      date: formattedDate,
      desc: newExpense.desc || 'No description'
    };
    
    setExpenses([newExp, ...expenses]);
    setNewExpense({ category: '', amount: '', date: '', desc: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track company expenses and overheads.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 bg-red-500 hover:bg-red-600 shadow-red-500/30">
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
                <span className="text-lg font-bold text-red-500">-{exp.amount}</span>
                <button className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                  <MoreVertical size={20} />
                </button>
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
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Add New Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
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
              <button onClick={handleSaveExpense} className="btn-primary bg-red-500 hover:bg-red-600 shadow-red-500/30 w-full mt-2 py-2.5">Save Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
