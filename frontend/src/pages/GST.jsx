import React, { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { createPortal } from 'react-dom';
import { Percent, X, CheckCircle, Clock, Eye, Trash2, Edit2, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function GST() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    try {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = '/src/assets/logo.png';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        setLogoBase64(canvas.toDataURL('image/png'));
      };
    } catch (e) { /* logo load failed */ }
  }, []);

  const generateGSTPDF = (rec) => {
    const doc = new jsPDF();
    const rightX = 195;

    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 15, 12, 45, 12);
    } else {
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.setTextColor(124, 58, 237);
      doc.text('Learnlike', 15, 22);
      doc.setTextColor(0, 0, 0);
    }

    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('4C&4D,', rightX, 20, { align: 'right' });
    doc.text('Haven Radhakrishna Enclave,', rightX, 25, { align: 'right' });
    doc.text('Trichy Road, Coimbatore - 641045', rightX, 30, { align: 'right' });
    doc.text('0422-3503208, 209', rightX, 35, { align: 'right' });
    doc.text('support@learnlike.co.in', rightX, 40, { align: 'right' });
    doc.text('GSTIN: 33AAJFL7696L1ZK', rightX, 45, { align: 'right' });
    doc.text('PAN: AAJFL7696L', rightX, 50, { align: 'right' });

    let cyRight = 65;
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Record ID: ' + rec.id, rightX, cyRight, { align: 'right' });
    cyRight += 6;
    doc.text('Date: ' + (rec.date || ''), rightX, cyRight, { align: 'right' });

    let cyLeft = 65;
    doc.text('Transaction Details', 15, cyLeft);
    cyLeft += 6;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text(`Type: ${rec.type || '-'}`, 15, cyLeft);
    cyLeft += 6;
    doc.text(`GSTIN: ${rec.gstin || '-'}`, 15, cyLeft);
    cyLeft += 6;
    doc.text(`Invoice No: ${rec.invoiceNo || '-'}`, 15, cyLeft);

    let cy = Math.max(cyLeft, cyRight) + 15;
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('GST Record', 105, cy, { align: 'center' });
    doc.setLineWidth(0.5);
    const titleW = doc.getTextWidth('GST Record');
    doc.line(105 - titleW / 2, cy + 1, 105 + titleW / 2, cy + 1);

    cy += 10;
    doc.setFontSize(11); doc.setLineWidth(0.2);
    doc.rect(15, cy, 180, 10);
    doc.line(100, cy, 100, cy + 10);
    doc.line(150, cy, 150, cy + 10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, cy + 6.5);
    doc.text('GST Rate', 125, cy + 6.5, { align: 'center' });
    doc.text('Amount', 172.5, cy + 6.5, { align: 'center' });
    cy += 10;

    const desc = rec.description || 'Taxable Value';
    const descLines = doc.splitTextToSize(desc, 80);
    const rowH = Math.max(12, descLines.length * 6 + 6);
    doc.line(15, cy, 15, cy + rowH); doc.line(195, cy, 195, cy + rowH);
    doc.line(100, cy, 100, cy + rowH); doc.line(150, cy, 150, cy + rowH);
    doc.setFont('helvetica', 'normal');
    doc.text(descLines, 20, cy + 8);
    doc.text(`${rec.gstRate}%`, 125, cy + 8, { align: 'center' });
    doc.text('Rs. ' + parseFloat(rec.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 172.5, cy + 8, { align: 'center' });
    cy += rowH;

    doc.rect(15, cy, 180, 10);
    doc.line(150, cy, 150, cy + 10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total GST Amount', 145, cy + 6.5, { align: 'right' });
    doc.text('Rs. ' + parseFloat(rec.gstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 }), 172.5, cy + 6.5, { align: 'center' });
    cy += 15;

    // Signature Block
    const sigX = 135;
    const sigY = cy + 10;

    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Approved:', sigX, sigY);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 150, 170);
    doc.text('Signature', sigX + 28, sigY);

    doc.setDrawColor(200, 210, 220); doc.setLineWidth(0.5);
    doc.line(sigX, sigY + 5, sigX + 60, sigY + 5);

    const dateStr = rec.date || new Date().toISOString().split('T')[0];
    const formattedDate = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Date:    ${formattedDate}`, sigX, sigY + 12);

    const footerY = 285;
    doc.setDrawColor(0); doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Registered Office: 15 A, B, C, Aalayam Imperial, Kuniyamuthur, Coimbatore - 641 008. Contact No: 0422-3597246', 105, footerY + 4, { align: 'center' });

    return doc;
  };
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('gstRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [newRecord, setNewRecord] = useState({
    customId: '',
    type: '',
    gstin: '',
    invoiceNo: '',
    amount: '',
    gstRate: '',
    date: '',
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('gstRecords', JSON.stringify(records));
  }, [records]);

  const handleSubmit = () => {
    const gstAmount = ((parseFloat(newRecord.amount) || 0) * (parseFloat(newRecord.gstRate) || 0) / 100).toFixed(2);

    if (editingId) {
      setRecords(records.map(r => r.id === editingId ? { ...r, ...newRecord, id: newRecord.customId || r.id, gstAmount } : r));
    } else {
      const record = {
        ...newRecord,
        gstAmount,
        id: newRecord.customId || `GST-${Math.floor(1000 + Math.random() * 9000)}`,
        addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setRecords([record, ...records]);
    }
    setIsModalOpen(false);
    setEditingId(null);
    setNewRecord({ customId: '', type: '', gstin: '', invoiceNo: '', amount: '', gstRate: '', date: '', description: '' });
  };

  const handleEdit = (r) => {
    setNewRecord({ customId: r.id, type: r.type, gstin: r.gstin, invoiceNo: r.invoiceNo, amount: r.amount, gstRate: r.gstRate, date: r.date, description: r.description });
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
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: 'min(30rem, calc(100vw - 2rem))' }}>
        <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{editingId ? 'Edit GST Record' : 'Add GST Record'}</h2>
            <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Record ID (Optional)</label>
              <input type="text" className="input-field" value={newRecord.customId} onChange={(e) => setNewRecord({ ...newRecord, customId: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
              <input 
                type="text" 
                className="input-field" 
                value={newRecord.type} 
                onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GSTIN</label>
                <input type="text" className="input-field" value={newRecord.gstin} onChange={(e) => setNewRecord({ ...newRecord, gstin: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice No.</label>
                <input type="text" className="input-field" value={newRecord.invoiceNo} onChange={(e) => setNewRecord({ ...newRecord, invoiceNo: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Taxable Amount (₹)</label>
                <input type="number" className="input-field" value={newRecord.amount} onChange={(e) => setNewRecord({ ...newRecord, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Rate (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={newRecord.gstRate} 
                  onChange={(e) => setNewRecord({ ...newRecord, gstRate: e.target.value })} 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input type="date" className="input-field text-slate-500" value={newRecord.date} onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea className="input-field resize-none h-16" value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}></textarea>
            </div>
            <button onClick={handleSubmit} className="btn-primary w-full mt-2 py-2.5">Save GST Record</button>
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
            <Percent className="text-violet-600 dark:text-violet-400" size={28} />
            GST Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track GST collected, paid, and filing records.</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setNewRecord({ type: '', gstin: '', invoiceNo: '', amount: '', gstRate: '', date: '', description: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Add GST Record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
            <Percent size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No GST Records Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">No GST entries yet. Click the button above to add one.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GSTIN</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice No.</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxable Amt</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Rate</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">GST Amt</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-slate-900 dark:text-white">{r.id}</span>
                      <div className="text-[11px] text-slate-500">Added {r.addedAt}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">{r.type}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.gstin || '-'}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.invoiceNo || '-'}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{r.amount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">{r.gstRate}%</span>
                    </td>
                    <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">₹{r.gstAmount}</td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{r.date}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => {
                        const doc = generateGSTPDF(r);
                        const url = doc.output('bloburl');
                        setViewingRecord(r);
                        setPreviewUrl(url);
                      }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors inline-flex mr-1" title="View PDF"><Eye size={16} /></button>
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
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete GST Record?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Are you sure you want to delete this GST record? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 btn-secondary py-2.5">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0">Yes, Delete</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    
      {previewUrl && viewingRecord && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={() => { setPreviewUrl(null); setViewingRecord(null); }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-violet-600" />
                GST Record Preview
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const doc = generateGSTPDF(viewingRecord);
                    const safe = (viewingRecord.id || 'GST_Record').replace(/[^a-zA-Z0-9]/g, '_');
                    doc.save(`${safe}.pdf`);
                  }}
                  className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium text-sm"
                >
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => { setPreviewUrl(null); setViewingRecord(null); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 p-2 sm:p-6 overflow-hidden">
              <iframe src={previewUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH'} className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white" title="GST Record Preview" />
            </div>
          </div>
        </div>,
        document.body
      )}
</div>
  );
}