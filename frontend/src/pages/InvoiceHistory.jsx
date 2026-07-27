import React, { useState, useEffect } from 'react';
import { History, Search, Download, Printer, CheckCircle2, Clock, AlertCircle, Edit, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('invoicesData');
    if (saved) {
      setInvoices(JSON.parse(saved));
    }
  }, []);

  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setEditFormData(inv);
  };

  const handleSaveClick = (invId) => {
    if (editingId !== invId) {
      alert("Click the 'Edit' button first to modify this invoice.");
      return;
    }
    const newInvoices = invoices.map(inv => inv.id === editingId ? editFormData : inv);
    setInvoices(newInvoices);
    localStorage.setItem('invoicesData', JSON.stringify(newInvoices));
    setEditingId(null);
  };

  const handleExport = () => {
    const csv = "data:text/csv;charset=utf-8,Invoice ID,Client,Date,Total Amount,Status\n"
      + invoices.map(i => `${i.id},${i.client},${i.date},${i.total},${i.status}`).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'invoice_history.csv';
    link.click();
  };

  const handleDownloadInvoice = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("INVOICE", 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.text(`Invoice ID: ${inv.id}`, 20, 40);
    doc.text(`Client: ${inv.client}`, 20, 50);
    doc.text(`Date: ${inv.date}`, 20, 60);
    doc.text(`Status: ${inv.status}`, 20, 70);
    
    doc.setFontSize(16);
    doc.text(`Total Amount: Rs ${Number(inv.total).toLocaleString('en-IN')}`, 20, 90);
    
    doc.save(`${inv.id}_${inv.client.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrint = (inv) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("INVOICE", 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.text(`Invoice ID: ${inv.id}`, 20, 40);
    doc.text(`Client: ${inv.client}`, 20, 50);
    doc.text(`Date: ${inv.date}`, 20, 60);
    doc.text(`Status: ${inv.status}`, 20, 70);
    
    doc.setFontSize(16);
    doc.text(`Total Amount: Rs ${Number(inv.total).toLocaleString('en-IN')}`, 20, 90);
    
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const filtered = invoices.filter(i =>
    (statusFilter === 'All' || i.status === statusFilter) &&
    (i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );

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

  return (
    <div className="flex-1 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <History className="text-violet-600 dark:text-violet-400" size={28} />
            Invoice History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review past transactions and generated invoices.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={16} /> Export Record
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" className="input-field pl-9" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">No invoices in history.</td></tr>
              ) : filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4 font-semibold text-violet-600 dark:text-violet-400 text-sm">{inv.id}</td>
                  <td className="p-4">
                    {editingId === inv.id ? (
                      <input type="text" className="input-field py-1 px-2 text-sm w-32" value={editFormData.client} onChange={(e) => setEditFormData({...editFormData, client: e.target.value})} />
                    ) : (
                      <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{inv.client}</p>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {editingId === inv.id ? (
                      <input type="date" className="input-field py-1 px-2 text-sm w-32" value={editFormData.date} onChange={(e) => setEditFormData({...editFormData, date: e.target.value})} />
                    ) : (
                      inv.date
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {editingId === inv.id ? (
                      <input type="number" className="input-field py-1 px-2 text-sm w-24" value={editFormData.total} onChange={(e) => setEditFormData({...editFormData, total: e.target.value})} />
                    ) : (
                      `₹${Number(inv.total).toLocaleString('en-IN')}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === inv.id ? (
                      <select className="input-field py-1 px-2 text-sm w-28" value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}>
                        <option>Paid</option>
                        <option>Unpaid</option>
                        <option>Overdue</option>
                      </select>
                    ) : (
                      statusBadge(inv.status)
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditClick(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="Edit">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleSaveClick(inv.id)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Save">
                        <Save size={15} />
                      </button>
                      <button onClick={() => handleDownloadInvoice(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Download">
                        <Download size={15} />
                      </button>
                      <button onClick={() => handlePrint(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors" title="Print">
                        <Printer size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
