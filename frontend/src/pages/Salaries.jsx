import { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { Search, Plus, Wallet, UserCircle, X, CheckCircle2, Download, AlertCircle, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { LOGO_BASE64 } from '../utils/logoBase64';
import PaySlipModal from '../components/PaySlipModal';

export default function Salaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingRecord, setViewingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSalary, setNewSalary] = useState({ trainer: '', month: '', base: '', bonus: '0', ded: '0', status: 'Pending' });
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [paySlipSalary, setPaySlipSalary] = useState(null);

  const [salaries, setSalaries] = useState(() => {
    const saved = localStorage.getItem('learnlike_salaries');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'SAL-001', trainer: 'Amit Kumar', month: 'Jul 2026', base: '₹40,000', bonus: '₹5,000', ded: '₹0', net: '₹45,000', status: 'Paid' },
      { id: 'SAL-002', trainer: 'Sneha Gupta', month: 'Jul 2026', base: '₹35,000', bonus: '₹0', ded: '₹2,000', net: '₹33,000', status: 'Pending' },
      { id: 'SAL-003', trainer: 'Vikram Singh', month: 'Jul 2026', base: '₹45,000', bonus: '₹10,000', ded: '₹0', net: '₹55,000', status: 'Paid' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('learnlike_salaries', JSON.stringify(salaries));
  }, [salaries]);

  const handleProcessSalary = () => {
    if (!newSalary.trainer || !newSalary.base) {
      setFormError("Please fill in Trainer Name and Base Salary to proceed.");
      return;
    }
    setFormError('');

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
      category: newSalary.category || 'Salary',
      month: month,
      base: formatCurr(base),
      bonus: formatCurr(bonus),
      ded: formatCurr(ded),
      net: formatCurr(net),
      status: newSalary.status || 'Pending'
    };

    setSalaries([newSal, ...salaries]);
    setNewSalary({ trainer: '', month: '', base: '', bonus: '0', ded: '0', status: 'Pending', category: '' });
    setFormError('');
    setIsModalOpen(false);
  };

  const handleSalaryAction = (salary) => {
    if (salary.status === 'Paid') {
      setPaySlipSalary(salary);
    } else {
      setSalaries(prev => prev.map(s => s.id === salary.id ? { ...s, status: 'Paid' } : s));
    }
  };

  const handleSalaryActionOLD = (salary) => {
    if (false) {
      const doc = new jsPDF();

      const primary = [102, 59, 183]; // Matches the mockup's rich purple
      const lightPurple = [242, 237, 255]; // For table headers
      const textDark = [15, 23, 42];
      const textLight = [100, 116, 139];
      const borderColor = [226, 232, 240];

      const addText = (text, x, y, size = 10, isBold = false, align = "left", color = textDark, baseline = "alphabetic") => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(String(text), x, y, { align, baseline });
      };

      const parseNum = (val) => val ? parseInt(val.toString().replace(/[^0-9]/g, '')) || 0 : 0;
      const formatCurr = (val) => val.toLocaleString('en-IN');

      // Calculate split amounts
      const rawBase = parseNum(salary.base);
      const rawBonus = parseNum(salary.bonus);
      const rawDed = parseNum(salary.ded);
      const rawNet = parseNum(salary.net);

      // Distribute for mockup authenticity
      const basic = Math.floor(rawBase * 0.7);
      const hra = rawBase - basic;
      const conveyance = rawBonus > 2000 ? 2000 : 0;
      const bonus = rawBonus - conveyance;

      const pf = rawDed > 1800 ? 1800 : rawDed;
      const pt = rawDed > pf ? Math.min(200, rawDed - pf) : 0;
      const tds = rawDed - pf - pt;

      // 1. Header (Left)
      doc.addImage(LOGO_BASE64, 'PNG', 15, 12, 60, 16);
      let tY = 35;
      addText("4C & 4D, Haven Radhakrishna Enclave,", 15, tY, 8, false, "left", textDark);
      addText("Trichy Road, Coimbatore - 641045", 15, tY += 4, 8, false, "left", textDark);
      addText("Tel: 0422-3503208, 209", 15, tY += 4, 8, false, "left", textDark);
      addText("Email: support@learnlike.co.in", 15, tY += 4, 8, false, "left", textDark);
      addText("GSTIN: 33AAJFL7696L1ZK", 15, tY += 4, 8, false, "left", textDark);

      // Header (Right)
      addText("SALARY SLIP", 195, 20, 22, true, "right", primary);

      tY = 35;
      const pX = 130;
      addText("Pay Period", pX, tY, 9, false, "left", textDark);
      addText(":", pX + 22, tY, 9, false, "left", textDark);
      addText(`01 ${salary.month} - 31 ${salary.month}`, pX + 26, tY, 9, false, "left", textDark);

      addText("Payslip No", pX, tY += 6, 9, false, "left", textDark);
      addText(":", pX + 22, tY, 9, false, "left", textDark);
      addText(salary.id, pX + 26, tY, 9, false, "left", textDark);

      addText("Generated On", pX, tY += 6, 9, false, "left", textDark);
      addText(":", pX + 22, tY, 9, false, "left", textDark);
      addText(`01 ${salary.month}`, pX + 26, tY, 9, false, "left", textDark);

      // Thick divider
      doc.setDrawColor(primary[0], primary[1], primary[2]);
      doc.setLineWidth(0.8);
      doc.line(15, 58, 195, 58);

      // 2. Employee Details Box
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.3);
      doc.roundedRect(15, 63, 180, 48, 2, 2, "S");

      // Avatar icon (mocked)
      doc.setFillColor(primary[0], primary[1], primary[2]);
      doc.roundedRect(20, 67, 8, 8, 2, 2, "F");
      addText("U", 24, 71.5, 9, true, "center", [255, 255, 255], "middle");

      addText("EMPLOYEE DETAILS", 32, 72.5, 10, true, "left", primary);

      // Details Grid
      tY = 82;
      const c1 = 20, c2 = 55, c3 = 110, c4 = 145;

      // Row 1
      addText("Employee ID", c1, tY, 9, false, "left", textDark);
      addText(":", c1 + 28, tY, 9, false, "left", textDark);
      addText(salary.id.replace('SAL', 'EMP'), c2, tY, 9, false, "left", textDark);

      addText("Month", c3, tY, 9, false, "left", textDark);
      addText(":", c3 + 28, tY, 9, false, "left", textDark);
      addText(salary.month, c4, tY, 9, true, "left", primary);

      // Row 2
      tY += 6;
      addText("Employee Name", c1, tY, 9, false, "left", textDark);
      addText(":", c1 + 28, tY, 9, false, "left", textDark);
      addText(salary.trainer, c2, tY, 9, true, "left", primary);

      addText("Slip ID", c3, tY, 9, false, "left", textDark);
      addText(":", c3 + 28, tY, 9, false, "left", textDark);
      addText(salary.id, c4, tY, 9, false, "left", textDark);

      // Row 3
      tY += 6;
      addText("Department", c1, tY, 9, false, "left", textDark);
      addText(":", c1 + 28, tY, 9, false, "left", textDark);
      addText("Software Development", c2, tY, 9, false, "left", textDark);

      addText("PF Number", c3, tY, 9, false, "left", textDark);
      addText(":", c3 + 28, tY, 9, false, "left", textDark);
      addText("PF12345678", c4, tY, 9, false, "left", textDark);

      // Row 4
      tY += 6;
      addText("Designation", c1, tY, 9, false, "left", textDark);
      addText(":", c1 + 28, tY, 9, false, "left", textDark);
      addText("Software Engineer", c2, tY, 9, false, "left", textDark);

      addText("Payment Date", c3, tY, 9, false, "left", textDark);
      addText(":", c3 + 28, tY, 9, false, "left", textDark);
      addText(`01 ${salary.month}`, c4, tY, 9, false, "left", textDark);

      // Row 5
      tY += 6;
      addText("Bank Account", c1, tY, 9, false, "left", textDark);
      addText(":", c1 + 28, tY, 9, false, "left", textDark);
      addText("XXXX XXXX 5678", c2, tY, 9, false, "left", textDark);

      addText("Payment Mode", c3, tY, 9, false, "left", textDark);
      addText(":", c3 + 28, tY, 9, false, "left", textDark);
      addText("Bank Transfer", c4, tY, 9, false, "left", textDark);


      // 3. Earnings & Deductions Tables
      const tTop = 118;
      doc.roundedRect(15, tTop, 180, 80, 2, 2, "S");
      addText("EARNINGS & DEDUCTIONS", 20, tTop + 6, 9, true, "left", primary);

      // Center dividing line
      doc.line(105, tTop + 10, 105, tTop + 80);

      // Table Headers
      doc.setFillColor(lightPurple[0], lightPurple[1], lightPurple[2]);
      doc.rect(15, tTop + 10, 90, 8, "F");
      doc.rect(105, tTop + 10, 90, 8, "F");

      tY = tTop + 15.5;
      addText("EARNINGS", 20, tY, 8, true, "left", primary);
      addText("AMOUNT (Rs)", 100, tY, 8, true, "right", primary);
      addText("DEDUCTIONS", 110, tY, 8, true, "left", primary);
      addText("AMOUNT (Rs)", 190, tY, 8, true, "right", primary);

      // Table Rows
      let rowY = tTop + 25;

      // Basic / PF
      addText("Basic Salary", 20, rowY, 8, false, "left", textDark);
      addText(formatCurr(basic), 100, rowY, 8, false, "right", textDark);
      addText("Provident Fund (PF)", 110, rowY, 8, false, "left", textDark);
      addText(formatCurr(pf), 190, rowY, 8, false, "right", textDark);

      // HRA / PT
      rowY += 8;
      addText("House Rent Allowance (HRA)", 20, rowY, 8, false, "left", textDark);
      addText(formatCurr(hra), 100, rowY, 8, false, "right", textDark);
      addText("Professional Tax", 110, rowY, 8, false, "left", textDark);
      addText(formatCurr(pt), 190, rowY, 8, false, "right", textDark);

      // Bonus / TDS
      rowY += 8;
      addText("Bonus", 20, rowY, 8, false, "left", textDark);
      addText(formatCurr(bonus), 100, rowY, 8, false, "right", textDark);
      addText("Income Tax (TDS)", 110, rowY, 8, false, "left", textDark);
      addText(formatCurr(tds), 190, rowY, 8, false, "right", textDark);

      // Conveyance / Other
      rowY += 8;
      addText("Conveyance Allowance", 20, rowY, 8, false, "left", textDark);
      addText(formatCurr(conveyance), 100, rowY, 8, false, "right", textDark);
      addText("Other Deductions", 110, rowY, 8, false, "left", textDark);
      addText(formatCurr(0), 190, rowY, 8, false, "right", textDark);

      // Totals Row
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(15, tTop + 70, 195, tTop + 70);

      tY = tTop + 76.5;
      addText("TOTAL EARNINGS", 20, tY, 8, true, "left", primary);
      addText(formatCurr(rawBase + rawBonus), 100, tY, 8, true, "right", primary);
      addText("TOTAL DEDUCTIONS", 110, tY, 8, true, "left", primary);
      addText(formatCurr(rawDed), 190, tY, 8, true, "right", primary);


      // 4. Net Pay block
      const nTop = 205;

      // Draw inner solid purple fill first
      doc.setFillColor(primary[0], primary[1], primary[2]);
      // Draw rounded rect for the left side to perfectly match outer border curves
      doc.roundedRect(15, nTop, 85, 12, 2, 2, "F");
      // Draw a sharp rect to square off the right edge of the purple fill
      doc.rect(80, nTop, 5, 12, "F");

      // Draw the outer bounding box stroke LAST so it overlaps and seals the edges cleanly
      doc.setDrawColor(primary[0], primary[1], primary[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(15, nTop, 180, 12, 2, 2, "S");

      addText("NET PAY", 20, nTop + 8, 10, true, "left", [255, 255, 255]);
      addText(`Rs ${formatCurr(rawNet)}`, 190, nTop + 8.5, 13, true, "right", primary);

      // Amount in words
      const numToWords = (num) => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        if ((num = num.toString()).length > 9) return 'overflow';
        let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) return; let str = '';
        str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
        return str.trim() + ' Only';
      };

      addText(`(Rupees ${numToWords(rawNet)})`, 20, nTop + 18, 8, false, "left", textDark);

      // 5. Signatures and Stamp
      const sTop = 245;

      // Left Signature
      addText("Authorized Signatory", 40, sTop, 8, false, "center", textDark);
      doc.setDrawColor(textLight[0], textLight[1], textLight[2]);
      doc.line(20, sTop + 15, 60, sTop + 15);
      addText("HR Manager", 40, sTop + 20, 8, false, "center", textDark);


      // Right Signature
      addText("Employee Signature", 170, sTop, 8, false, "center", textDark);
      doc.line(150, sTop + 15, 190, sTop + 15);
      addText(salary.trainer, 170, sTop + 20, 8, false, "center", textDark);

      // 6. Disclaimer
      doc.setFillColor(lightPurple[0], lightPurple[1], lightPurple[2]);
      doc.roundedRect(20, 275, 170, 7, 2, 2, "F");
      addText("This is a computer-generated payslip and does not require a physical signature.", 105, 279.5, 7, false, "center", textDark, "middle");

      doc.save(`payslip_${salary.trainer.replace(/\s+/g, '_')}_${salary.month.replace(/\s+/g, '')}.pdf`);
    } else {
      setSalaries(prev => prev.map(s => s.id === salary.id ? { ...s, status: 'Paid' } : s));
    }
  };

  const filteredSalaries = salaries.filter(s =>
    s.trainer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trainer Salaries</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage monthly payroll, bonuses, and deductions.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Process Salary</span>
          </button>
        </div>

        <div className="glass-card p-4 animate-fade-in">
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
            <div
              key={idx}
              className="glass-card p-6 border-t-4 border-t-primary-500 animate-fade-in hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: `${idx * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 rounded-full flex items-center justify-center font-bold text-lg">
                    {salary.trainer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{salary.trainer}</h3>
                    <p className="text-xs text-slate-500">{salary.month}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${salary.status === 'Paid'
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
                className="w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 bg-slate-100 dark:bg-dark-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-dark-700">
                {salary.status === 'Paid' ? (
                  <>
                    <Download size={16} />
                    <span>Download Slip</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Mark as Paid</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirmId(salary.id)}
                className="w-full mt-2 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>

        {/* Process Salary Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
              <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Process New Salary</h2>
                <button onClick={() => { setIsModalOpen(false); setFormError(''); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {formError && (
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-fade-in border border-red-100 dark:border-red-500/20">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newSalary.category || ''}
                    onChange={(e) => setNewSalary({ ...newSalary, category: e.target.value })}
                  />
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

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scale-in">
            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Remove Salary Record?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to remove this salary record? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={() => { setSalaries(salaries.filter(s => s.id !== deleteConfirmId)); setDeleteConfirmId(null); }} className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0">Yes, Remove</button>
            </div>
          </div>
          {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
      )}

      {/* Pay Slip Modal */}
      {paySlipSalary && (
        <PaySlipModal
          salary={paySlipSalary}
          onClose={() => setPaySlipSalary(null)}
        />
      )}
    </>
  );
}
