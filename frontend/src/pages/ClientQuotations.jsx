import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, X, Plus, Search, Calendar, Hash, Building2, Briefcase, DollarSign, Percent, Activity, AlignLeft, Check, Trash2, Tag, Eye, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ClientQuotations() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('clientQuotations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const defaultForm = () => ({
    date: new Date().toISOString().split('T')[0],
    quoteNumber: `QT-${Math.floor(Math.random() * 9000) + 1000}`,
    clientName: '',
    subject: '',
    amount: '',
    gst: '18%',
    category: 'CAPEX',
    status: 'Draft',
    notes: ''
  });

  const [formData, setFormData] = useState(defaultForm());

  useEffect(() => {
    localStorage.setItem('clientQuotations', JSON.stringify(records));
  }, [records]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultForm());
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setFormData({ ...defaultForm(), ...record });
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.amount) return;

    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...formData, total: calculateTotal(formData.amount, formData.gst) } : r));
    } else {
      const newRecord = {
        id: Date.now().toString(),
        ...formData,
        total: calculateTotal(formData.amount, formData.gst)
      };
      setRecords(prev => [newRecord, ...prev]);
    }

    setIsModalOpen(false);
    setEditingId(null);
    setFormData(defaultForm());
  };

  const calculateTotal = (amount, gst) => {
    const numAmount = parseFloat(String(amount).replace(/[^0-9.-]+/g, "")) || 0;
    const numGst = parseFloat(String(gst).replace('%', '')) || 0;
    return numAmount + (numAmount * (numGst / 100));
  };

  const deleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(r =>
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateQuotationPDF = (rec) => {
    const doc = new jsPDF();
    const gstNum = parseFloat(String(rec.gst).replace('%', '')) || 0;
    const base = parseFloat(rec.amount || 0);
    const gstAmt = base * gstNum / 100;
    const total = base + gstAmt;
    const rightX = 195;

    // Logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 15, 12, 45, 12);
    } else {
      doc.setFontSize(20); doc.setFont('helvetica', 'bold');
      doc.setTextColor(124, 58, 237);
      doc.text('Learnlike', 15, 22);
      doc.setTextColor(0, 0, 0);
    }

    // Company address (right)
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('4C&4D,', rightX, 20, { align: 'right' });
    doc.text('Haven Radhakrishna Enclave,', rightX, 25, { align: 'right' });
    doc.text('Trichy Road, Coimbatore - 641045', rightX, 30, { align: 'right' });
    doc.text('0422-3503208, 209', rightX, 35, { align: 'right' });
    doc.text('support@learnlike.co.in', rightX, 40, { align: 'right' });
    doc.text('GSTIN: 33AAJFL7696L1ZK', rightX, 45, { align: 'right' });
    doc.text('PAN: AAJFL7696L', rightX, 50, { align: 'right' });

    // To section (left)
    let cyLeft = 35;
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('To', 15, cyLeft);
    cyLeft += 6;
    doc.setFontSize(11);
    doc.text(rec.clientName || 'Client Name', 15, cyLeft);
    cyLeft += 5;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    if (rec.subject) {
      const subjLines = doc.splitTextToSize(rec.subject, 90);
      doc.text(subjLines, 15, cyLeft);
      cyLeft += subjLines.length * 5 + 1;
    }

    // Quote No & Date (right)
    let cyRight = 60;
    doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text('Quote No: ' + rec.quoteNumber, rightX, cyRight, { align: 'right' });
    cyRight += 6;
    doc.text('Date: ' + (rec.date || ''), rightX, cyRight, { align: 'right' });
    cyRight += 6;
    doc.text('Status: ' + (rec.status || 'Draft'), rightX, cyRight, { align: 'right' });

    // Salutation
    let cy = Math.max(cyLeft, cyRight) + 10;
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.text('Dear Sir / Madam,', 15, cy);

    // Title
    cy += 12;
    doc.setFontSize(24); doc.setFont('helvetica', 'bold');
    doc.text('Quotation', 105, cy, { align: 'center' });
    doc.setLineWidth(0.5);
    const titleW = doc.getTextWidth('Quotation');
    doc.line(105 - titleW / 2, cy + 1, 105 + titleW / 2, cy + 1);

    // Table header
    cy += 8;
    doc.setFontSize(11); doc.setLineWidth(0.2);
    doc.rect(15, cy, 180, 8);
    doc.line(30, cy, 30, cy + 8);
    doc.line(145, cy, 145, cy + 8);
    doc.setFont('helvetica', 'bold');
    doc.text('S. No', 22.5, cy + 5.5, { align: 'center' });
    doc.text('Description', 87.5, cy + 5.5, { align: 'center' });
    doc.text('Amount', 170, cy + 5.5, { align: 'center' });
    cy += 8;

    // Row 1 - base
    const descLines = doc.splitTextToSize(rec.subject || 'Services', 110);
    const rowH = Math.max(12, descLines.length * 5 + 6);
    doc.line(15, cy, 15, cy + rowH); doc.line(195, cy, 195, cy + rowH);
    doc.line(30, cy, 30, cy + rowH); doc.line(145, cy, 145, cy + rowH);
    doc.setFont('helvetica', 'normal');
    doc.text('1.', 22.5, cy + 6, { align: 'center' });
    doc.text(descLines, 32, cy + 6);
    doc.text('Rs. ' + base.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 170, cy + 6, { align: 'center' });
    cy += rowH;

    // GST row
    doc.line(15, cy, 15, cy + 8); doc.line(195, cy, 195, cy + 8);
    doc.line(30, cy, 30, cy + 8); doc.line(145, cy, 145, cy + 8);
    doc.text('2.', 22.5, cy + 5.5, { align: 'center' });
    doc.text(`GST @ ${rec.gst}`, 32, cy + 5.5);
    doc.text('Rs. ' + gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 170, cy + 5.5, { align: 'center' });
    cy += 8;

    // Total row
    doc.rect(15, cy, 180, 8);
    doc.line(30, cy, 30, cy + 8); doc.line(145, cy, 145, cy + 8);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount', 87.5, cy + 5.5, { align: 'center' });
    doc.text('Rs. ' + total.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 170, cy + 5.5, { align: 'center' });
    cy += 12;

    // Notes
    if (rec.notes) {
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('Notes:', 15, cy);
      cy += 5;
      doc.setFont('helvetica', 'normal');
      const noteLines = doc.splitTextToSize(rec.notes, 175);
      doc.text(noteLines, 15, cy);
      cy += noteLines.length * 5 + 5;
    }

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

    // Footer
    const footerY = 285;
    doc.setDrawColor(0); doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Registered Office: 15 A, B, C, Aalayam Imperial, Kuniyamuthur, Coimbatore - 641 008. Contact No: 0422-3597246', 105, footerY + 4, { align: 'center' });

    return doc;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Draft': return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">Draft</span>;
      case 'Sent': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Sent</span>;
      case 'Accepted': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Accepted</span>;
      case 'Rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  const getCategoryBadge = (category) => {
    if (category === 'CAPEX') {
      return <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md text-xs font-bold uppercase tracking-wider">CAPEX</span>;
    }
    return null;
  };

  // Totals by category
  const capexTotal = records.filter(r => r.category === 'CAPEX').reduce((sum, r) => sum + (r.total || 0), 0);

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <FileText className="text-violet-600 dark:text-violet-400" size={28} />
            </div>
            Client Quotations
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
            Create, track, and manage all quotations and estimates sent to clients.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add Record</span>
        </button>
      </div>

      {/* CAPEX Summary Card */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-[16px] p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
            <Tag className="text-indigo-600 dark:text-indigo-400" size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-0.5">CAPEX</p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
              ₹{capexTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-indigo-400 mt-0.5">{records.filter(r => r.category === 'CAPEX').length} quotation(s)</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-dark-900 p-4 rounded-[16px] border border-slate-200 dark:border-dark-800 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by client, subject or Quote ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
          />
        </div>
      </div>

      {/* Data View */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-5 text-violet-500">
            <FileText size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No quotations found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery ? "No records match your search criteria." : "You haven't created any client quotations yet. Click the button above to draft one."}
          </p>
          {!searchQuery && (
            <button
              onClick={openAddModal}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Plus size={16} /> Create your first quotation
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quote ID / Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client & Subject</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount (+ GST)</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">{record.quoteNumber}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 dark:text-white">{record.clientName}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{record.subject}</div>
                    </td>
                    <td className="py-4 px-6">
                      {getCategoryBadge(record.category)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">
                        ₹{(record.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Base: ₹{parseFloat(record.amount || 0).toLocaleString()} | GST: {record.gst}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            const doc = generateQuotationPDF(record);
                            const url = doc.output('bloburl');
                            setViewingRecord(record);
                            setPreviewUrl(url);
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors inline-flex"
                          title="View Quotation"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex"
                          title="Edit Quotation"
                        >
                          <span className="text-sm font-medium">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                          title="Delete Quotation"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 rounded-[24px] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-dark-800 flex flex-col max-h-[90vh]">

            <div className="flex items-start justify-between p-6 pb-2 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Quotation' : 'Create Quotation'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {editingId ? 'Update the details for this quotation.' : 'Fill in the details to draft a new client quotation.'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={16} className="text-violet-500" />
                    <span>Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Hash size={16} className="text-violet-500" />
                    <span>Quotation Number</span>
                  </label>
                  <input
                    type="text"
                    name="quoteNumber"
                    value={formData.quoteNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Building2 size={16} className="text-violet-500" />
                    <span>Client Name</span>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Briefcase size={16} className="text-violet-500" />
                    <span>Subject / Project</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                {/* CAPEX (fixed) */}
                <input type="hidden" name="category" value="CAPEX" />

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign size={16} className="text-violet-500" />
                    <span>Amount (Base)</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Percent size={16} className="text-violet-500" />
                    <span>GST Rate</span>
                  </label>
                  <input
                    type="text"
                    name="gst"
                    placeholder="e.g. 18%"
                    value={formData.gst}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Activity size={16} className="text-violet-500" />
                    <span>Status</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5 mt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <AlignLeft size={16} className="text-violet-500" />
                    <span>Notes / Terms</span>
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white resize-none"
                  ></textarea>
                </div>

              </div>
            </form>

            <div className="p-6 pt-2 shrink-0 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.clientName || !formData.amount}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-violet-600/20"
              >
                <Check size={18} />
                <span>{editingId ? 'Update Quotation' : 'Save Quotation'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
      {/* Quotation Preview Modal */}
      {previewUrl && viewingRecord && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={() => { setPreviewUrl(null); setViewingRecord(null); }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-violet-600" />
                Quotation Preview
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const doc = generateQuotationPDF(viewingRecord);
                    const safe = (viewingRecord.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
                    doc.save(`${viewingRecord.quoteNumber}_${safe}.pdf`);
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
              <iframe src={previewUrl + '#toolbar=0&navpanes=0&scrollbar=0&view=FitH'} className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white" title="Quotation Preview" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
