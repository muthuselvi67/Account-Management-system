import { useState } from 'react';
import { Search, Plus, Wallet, UserCircle, X } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Salaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSalary, setNewSalary] = useState({ trainer: '', month: '', base: '', bonus: '0', ded: '0', status: 'Pending' });

  const [salaries, setSalaries] = useState([
    { id: 'SAL-001', trainer: 'Amit Kumar', month: 'Jul 2026', base: '₹40,000', bonus: '₹5,000', ded: '₹0', net: '₹45,000', status: 'Paid' },
    { id: 'SAL-002', trainer: 'Sneha Gupta', month: 'Jul 2026', base: '₹35,000', bonus: '₹0', ded: '₹2,000', net: '₹33,000', status: 'Pending' },
    { id: 'SAL-003', trainer: 'Vikram Singh', month: 'Jul 2026', base: '₹45,000', bonus: '₹10,000', ded: '₹0', net: '₹55,000', status: 'Paid' },
  ]);

  const handleProcessSalary = () => {
    if (!newSalary.trainer || !newSalary.base) return;

    const parseNum = (val) => {
      if (!val) return 0;
      return parseInt(val.toString().replace(/[^0-9]/g, '')) || 0;
    };

    const base = parseNum(newSalary.base);
    const bonus = parseNum(newSalary.bonus);
    const ded = parseNum(newSalary.ded);
    const net = base + bonus - ded;

    const formatCurr = (val) => `₹${val.toLocaleString('en-IN')}`;

    let month = newSalary.month || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const newSal = {
      id: `SAL-00${salaries.length + 1}`,
      trainer: newSalary.trainer,
      month: month,
      base: formatCurr(base),
      bonus: formatCurr(bonus),
      ded: formatCurr(ded),
      net: formatCurr(net),
      status: newSalary.status || 'Pending'
    };

    setSalaries([newSal, ...salaries]);
    setNewSalary({ trainer: '', month: '', base: '', bonus: '0', ded: '0', status: 'Pending' });
    setIsModalOpen(false);
  };

  const handleSalaryAction = (salary) => {
    if (salary.status === 'Paid') {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Salary Slip", 105, 20, null, null, "center");
      
      doc.setFontSize(14);
      doc.text(`Employee: ${salary.trainer}`, 20, 40);
      doc.text(`Month: ${salary.month}`, 20, 50);
      
      doc.text("Earnings & Deductions", 20, 70);
      doc.setFontSize(12);
      doc.text(`Base Salary: ${salary.base}`, 20, 80);
      doc.text(`Bonus: +${salary.bonus}`, 20, 90);
      doc.text(`Deductions: -${salary.ded}`, 20, 100);
      
      doc.setFontSize(16);
      doc.text(`Net Pay: ${salary.net}`, 20, 120);
      
      doc.save(`payslip_${salary.trainer.replace(/\s+/g, '_')}.pdf`);
    } else {
      setSalaries(salaries.map(s => s.id === salary.id ? { ...s, status: 'Paid' } : s));
    }
  };

  const filteredSalaries = salaries.filter(s => 
    s.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trainer Salaries</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage monthly payroll, bonuses, and deductions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Process Salary</span>
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by trainer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSalaries.map((salary, idx) => (
          <div key={idx} className="glass-card p-6 border-t-4 border-t-primary-500">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-dark-800 rounded-full flex items-center justify-center text-slate-500">
                  <UserCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{salary.trainer}</h3>
                  <p className="text-xs text-slate-500">{salary.month}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                salary.status === 'Paid' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              }`}>
                {salary.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4 bg-slate-50 dark:bg-dark-800 p-4 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Base Salary</span>
                <span className="font-medium text-slate-900 dark:text-white">{salary.base}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Bonus</span>
                <span className="font-medium text-emerald-500">+{salary.bonus}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Deductions</span>
                <span className="font-medium text-red-500">-{salary.ded}</span>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 dark:border-dark-700 flex justify-between text-base font-bold">
                <span className="text-slate-900 dark:text-white">Net Pay</span>
                <span className="text-primary-600 dark:text-primary-400">{salary.net}</span>
              </div>
            </div>

            <button 
              onClick={() => handleSalaryAction(salary)}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
              salary.status === 'Paid'
                ? 'bg-slate-100 dark:bg-dark-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-700'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}>
              {salary.status === 'Paid' ? 'Download Slip' : 'Mark as Paid'}
            </button>
          </div>
        ))}
      </div>

      {/* Process Salary Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Process New Salary</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select className="input-field py-2" value={newSalary.category || ''} onChange={(e) => setNewSalary({ ...newSalary, category: e.target.value })}>
                  <option value="" disabled>Select a category...</option>
                  <option value="Employee Claims">📋 Employee Claims</option>
                  <option value="Allowances">💰 Allowances</option>
                  <option value="Bonus">🎁 Bonus</option>
                  <option value="PF & ESI">🏦 PF &amp; ESI</option>
                  <option value="Reports">📊 Reports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trainer Name</label>
                <input type="text" className="input-field" value={newSalary.trainer} onChange={(e) => setNewSalary({ ...newSalary, trainer: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month & Year</label>
                  <input type="text" className="input-field" value={newSalary.month} onChange={(e) => setNewSalary({ ...newSalary, month: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Salary (₹)</label>
                  <input type="text" className="input-field" value={newSalary.base} onChange={(e) => setNewSalary({ ...newSalary, base: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bonus (₹)</label>
                  <input type="text" className="input-field" value={newSalary.bonus} onChange={(e) => setNewSalary({ ...newSalary, bonus: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deductions (₹)</label>
                  <input type="text" className="input-field" value={newSalary.ded} onChange={(e) => setNewSalary({ ...newSalary, ded: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select className="input-field py-2" value={newSalary.status} onChange={(e) => setNewSalary({ ...newSalary, status: e.target.value })}>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <button onClick={handleProcessSalary} className="btn-primary w-full mt-2 py-2.5">Process Salary</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
