import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, X, Search, Download, Printer, CheckCircle2, Clock, AlertCircle, IndianRupee } from 'lucide-react';

const INITIAL = [
  { id: 'INV-2026-001', client: 'Rahul Sharma', date: '2026-07-20', dueDate: '2026-08-20', base: 15000, gst: 2700, total: 17700, status: 'Paid', note: 'Course fee - July' },
  { id: 'INV-2026-002', client: 'Priya Singh', date: '2026-07-19', dueDate: '2026-08-19', base: 20000, gst: 3600, total: 23600, status: 'Paid', note: 'Training batch' },
  { id: 'INV-2026-003', client: 'Amit Kumar', date: '2026-07-15', dueDate: '2026-08-15', base: 10000, gst: 0, total: 10000, status: 'Unpaid', note: '' },
  { id: 'INV-2026-004', client: 'Sneha Gupta', date: '2026-07-10', dueDate: '2026-07-25', base: 45000, gst: 8100, total: 53100, status: 'Overdue', note: 'Enterprise plan' },
];

export default function Invoices() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoicesData');
    return saved ? JSON.parse(saved) : INITIAL;
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newInv, setNewInv] = useState({ client: '', base: '', gstRate: '18', date: '', dueDate: '', status: 'Unpaid', note: '' });

  useEffect(() => { localStorage.setItem('invoicesData', JSON.stringify(invoices)); }, [invoices]);

  const handleCreate = () => {
    if (!newInv.client || !newInv.base) return;
    const base = parseFloat(newInv.base) || 0;
    const gst = Math.round(base * parseFloat(newInv.gstRate) / 100);
    const total = base + gst;
    const inv = {
      ...newInv, base, gst, total,
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
    };
    setInvoices([inv, ...invoices]);
    setIsModalOpen(false);
    setNewInv({ client: '', base: '', gstRate: '18', date: '', dueDate: '', status: 'Unpaid', note: '' });
  };

  const handlePrint = (inv) => {
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Invoice ${inv.id}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}h2{color:#7c3aed}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{padding:10px;border:1px solid #e2e8f0;text-align:left}.total{font-weight:bold;font-size:18px}</style>
      </head><body>
      <h2>Invoice</h2>
      <p><strong>${inv.id}</strong></p>
      <p>Client: ${inv.client}</p>
      <p>Date: ${inv.date} | Due: ${inv.dueDate}</p>
      <table>
        <tr><th>Description</th><th>Amount</th></tr>
        <tr><td>Base Amount</td><td>₹${inv.base.toLocaleString('en-IN')}</td></tr>
        <tr><td>GST (${newInv.gstRate || 18}%)</td><td>₹${inv.gst.toLocaleString('en-IN')}</td></tr>
        <tr class="total"><td>Total</td><td>₹${inv.total.toLocaleString('en-IN')}</td></tr>
      </table>
      ${inv.note ? `<p>Note: ${inv.note}</p>` : ''}
      </body></html>`);
    w.print();
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,ID,Client,Date,Due Date,Base,GST,Total,Status\n"
      + invoices.map(i => `${i.id},${i.client},${i.date},${i.dueDate},${i.base},${i.gst},${i.total},${i.status}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'invoices.csv';
    link.click();
  };

  const filtered = invoices.filter(i =>
    (statusFilter === 'All' || i.status === statusFilter) &&
    (i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalUnpaid = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.total, 0);

  const statusBadge = (status) => {
    const map = {
      Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
      Unpaid: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
      Overdue: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    };
    const icons = { Paid: <CheckCircle2 size={11} />, Unpaid: <Clock size={11} />, Overdue: <AlertCircle size={11} /> };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] || map.Unpaid}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const modal = (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(15,15,30,0.65)', backdropFilter: 'blur(4px)' }} onClick={() => setIsModalOpen(false)} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(30rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create New Invoice</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slateink-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
              <input type="text" className="input-field" placeholder="e.g. Rahul Sharma" value={newInv.client} onChange={(e) => setNewInv({ ...newInv, client: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Amount (₹)</label>
                <input type="number" className="input-field" value={newInv.base} onChange={(e) => setNewInv({ ...newInv, base: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Rate (%)</label>
                <select className="input-field py-2" value={newInv.gstRate} onChange={(e) => setNewInv({ ...newInv, gstRate: e.target.value })}>
                  <option value="0">0% (Exempt)</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            </div>
            {newInv.base && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Base</span><span>₹{parseFloat(newInv.base || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>GST ({newInv.gstRate}%)</span><span>₹{Math.round((parseFloat(newInv.base) || 0) * parseFloat(newInv.gstRate) / 100).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-bold text-violet-700 dark:text-violet-300 border-t border-violet-200 dark:border-violet-700 pt-1"><span>Total</span><span>₹{(Math.round((parseFloat(newInv.base) || 0) * (1 + parseFloat(newInv.gstRate) / 100))).toLocaleString('en-IN')}</span></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice Date</label>
                <input type="date" className="input-field text-slate-500" value={newInv.date} onChange={(e) => setNewInv({ ...newInv, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input type="date" className="input-field text-slate-500" value={newInv.dueDate} onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select className="input-field py-2" value={newInv.status} onChange={(e) => setNewInv({ ...newInv, status: e.target.value })}>
                <option>Unpaid</option>
                <option>Paid</option>
                <option>Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (optional)</label>
              <textarea className="input-field resize-none h-16" value={newInv.note} onChange={(e) => setNewInv({ ...newInv, note: e.target.value })}></textarea>
            </div>
            <button onClick={handleCreate} className="btn-primary w-full mt-2 py-2.5">Create Invoice</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex-1 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FileText className="text-violet-600 dark:text-violet-400" size={28} />
            Invoices
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create, manage, and track all client invoices.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> New Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400">
            <IndianRupee size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Invoiced</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(totalInvoiced)}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Paid</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(totalPaid)}</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Outstanding</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{fmt(totalUnpaid)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" className="input-field pl-9" placeholder="Search by client or invoice ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {['All', 'Paid', 'Unpaid', 'Overdue'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${statusFilter === s ? 'bg-violet-600 border-violet-600 text-white shadow-sm' : 'bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-800/80'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Base</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-slate-400">No invoices found.</td></tr>
              ) : filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4 font-semibold text-violet-600 dark:text-violet-400 text-sm">{inv.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{inv.client}</p>
                    {inv.note && <p className="text-xs text-slate-400 mt-0.5">{inv.note}</p>}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{inv.date}</td>
                  <td className="p-4 text-sm text-slate-500">{inv.dueDate}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{fmt(inv.base)}</td>
                  <td className="p-4 text-sm text-slate-500">{fmt(inv.gst)}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{fmt(inv.total)}</td>
                  <td className="p-4">{statusBadge(inv.status)}</td>
                  <td className="p-4">
                    <button onClick={() => handlePrint(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                      <Printer size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(modal, document.body)}
    </div>
  );
}
