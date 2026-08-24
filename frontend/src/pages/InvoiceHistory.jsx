import React, { useState, useEffect, useMemo } from 'react';
import ViewModal from '../components/ViewModal';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { History, Search, Download, Printer, CheckCircle2, Clock, AlertCircle, Edit, Save, X, ArrowUpDown, ChevronUp, ChevronDown, Mail, Phone, MapPin, Building2, FilePlus, Eye } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function InvoiceHistory() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ email: '', phone: '', address: '' });
  const [logoBase64, setLogoBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewInv, setPreviewInv] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('invoicesData');
    if (saved) {
      setInvoices(JSON.parse(saved));
    }

    // Pre-load logo for PDF generation
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = '/src/assets/logo.png';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        setLogoBase64(canvas.toDataURL('image/png'));
      };
    } catch (err) {
      console.error("Error loading logo", err);
    }
  }, []);

  const handleEditClick = (inv) => {
    setEditingId(inv.id);
    setEditFormData(inv);
  };

  const handleSaveClick = (invId) => {
    if (editingId !== invId) return;
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

  const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    let n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str.trim();
  };

  const generatePDFDoc = (inv) => {
    const doc = new jsPDF();

    // 1. Logo Lockup
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 15, 12, 45, 12);
    } else {
      doc.setFontSize(25);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0); // black
      doc.text("Learnlike", 15, 20);
      doc.setTextColor(0, 0, 0); // reset to black
    }

    // 2. Address (Right aligned)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const rightX = 195;
    doc.text("4C&4D,", rightX, 20, { align: "right" });
    doc.text("Haven Radhakrishna Enclave,", rightX, 25, { align: "right" });
    doc.text("Trichy Road, Coimbatore - 641045", rightX, 30, { align: "right" });
    doc.text("0422-3503208, 209", rightX, 35, { align: "right" });
    doc.text("support@learnlike.co.in", rightX, 40, { align: "right" });
    doc.text("GSTIN: 33AAJFL7696L1ZK", rightX, 45, { align: "right" });
    doc.text("PAN: AAJFL7696L", rightX, 50, { align: "right" });

    // 3. Client Info (Left aligned, shifted up to fill space)
    let cyLeft = 35;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("To", 15, cyLeft);

    cyLeft += 6;
    doc.setFontSize(11);
    doc.text(inv.client || "Client Name", 15, cyLeft);

    cyLeft += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const addressLines = doc.splitTextToSize(inv.address || "Client Address", 90);
    doc.text(addressLines, 15, cyLeft);
    cyLeft += (addressLines.length * 5) + 1;

    if (inv.gstNumber) {
      doc.text("GSTIN: " + inv.gstNumber, 15, cyLeft);
      cyLeft += 5;
    }
    if (inv.panNumber) {
      doc.text("PAN No: " + inv.panNumber, 15, cyLeft);
      cyLeft += 5;
    }

    // 4. Invoice No & Date (Right aligned, below company address)
    let cyRight = 60;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice No: " + (inv.id || "INV-2025-001"), rightX, cyRight, { align: "right" });
    cyRight += 6;
    doc.text("Date: " + (inv.date || new Date().toISOString().split('T')[0]), rightX, cyRight, { align: "right" });

    // 5. Salutation
    let cy = Math.max(cyLeft, cyRight) + 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Dear Sir / Madam,", 15, cy);

    // 7. Title
    cy += 12;
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Tax Invoice", 105, cy, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(85, cy + 1, 125, cy + 1);

    // 8. Table
    cy += 6;
    doc.setFontSize(11);

    // Headers
    doc.setLineWidth(0.2);
    doc.rect(15, cy, 180, 8); // outer box
    doc.line(30, cy, 30, cy + 8); // S.No
    doc.line(145, cy, 145, cy + 8); // Desc

    doc.setFont("helvetica", "bold");
    doc.text("S. No", 22.5, cy + 5.5, { align: "center" });
    doc.text("Description", 87.5, cy + 5.5, { align: "center" });
    doc.text("Amount", 170, cy + 5.5, { align: "center" });

    cy += 8;

    const items = inv.items && inv.items.length > 0 ? inv.items : [{ description: inv.note || 'Sublease Rent for August 2025\n(Half Month Rent only)', quantity: 1, price: inv.total || 11500 }];

    let baseTotal = 0;
    let totalGstAmount = 0;

    doc.setFont("helvetica", "normal");
    items.forEach((item, index) => {
      const descLines = doc.splitTextToSize(item.description || '-', 110);
      const itemH = Math.max(12, descLines.length * 5 + 6);

      // Draw only vertical lines for items (professional look)
      doc.line(15, cy, 15, cy + itemH); // Left border
      doc.line(195, cy, 195, cy + itemH); // Right border
      doc.line(30, cy, 30, cy + itemH); // S.No sep
      doc.line(145, cy, 145, cy + itemH); // Desc sep

      doc.text(String(index + 1) + ".", 22.5, cy + 6, { align: "center" });

      // Left-aligned description
      doc.text(descLines, 32, cy + 6, { align: "left" });

      const itemPrice = Number(item.price || 0) * Number(item.quantity || 1);
      const itemGst = itemPrice * 0.09;
      baseTotal += itemPrice;
      totalGstAmount += itemGst * 2;

      doc.text("Rs. " + itemPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 }), 170, cy + 6, { align: "center" });

      cy += itemH;
    });

    // No empty space filler
    // CGST row
    doc.rect(15, cy, 180, 8);
    doc.line(145, cy, 145, cy + 8);
    doc.text("CGST @ 9%", 142, cy + 5.5, { align: "right" });
    doc.text("Rs. " + (baseTotal * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 0 }), 170, cy + 5.5, { align: "center" });
    cy += 8;

    // SGST row
    doc.rect(15, cy, 180, 8);
    doc.line(145, cy, 145, cy + 8);
    doc.text("SGST @ 9%", 142, cy + 5.5, { align: "right" });
    doc.text("Rs. " + (baseTotal * 0.09).toLocaleString('en-IN', { minimumFractionDigits: 0 }), 170, cy + 5.5, { align: "center" });
    cy += 8;

    // Total row
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.rect(15, cy, 180, 8);
    doc.line(145, cy, 145, cy + 8);
    doc.text("Total Amount", 142, cy + 5.5, { align: "right" });
    doc.text("Rs. " + (baseTotal + totalGstAmount).toLocaleString('en-IN', { minimumFractionDigits: 0 }), 170, cy + 5.5, { align: "center" });
    cy += 8;

    // 9. Amount in Words
    cy += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const grandTotal = Math.round(baseTotal + totalGstAmount);
    const words = numberToWords(grandTotal) + " Rupees Only";
    doc.text("Amount in Words: " + words, 15, cy);

    // 10. Net Banking Details Heading
    // 10. Net Banking Details Heading
    cy += 10;
    const bankStartY = cy;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    const bankH = 7;
    const colW1 = 40;
    const colW2 = 55;
    const tblW = colW1 + colW2;

    doc.rect(15, cy, tblW, bankH);
    doc.text("Net Banking Details", 15 + tblW / 2, cy + 5, { align: "center" });
    cy += bankH;

    const bRows = [
      { k: "A/C Number", v: "510909010148090" },
      { k: "IFSC Code", v: "CIUB0000034" },
      { k: "Name", v: "LEARNLIKE" },
      { k: "Bank", v: "City Union Bank,\nRamnagar, Coimbatore" },
      { k: "MICR Code", v: "625054202" }
    ];

    doc.setFontSize(11);
    bRows.forEach(r => {
      let vLines = doc.splitTextToSize(r.v, colW2 - 4);
      let rH = Math.max(bankH, vLines.length * 4.5 + 2.5);
      doc.rect(15, cy, colW1, rH);
      doc.rect(15 + colW1, cy, colW2, rH);

      doc.setFont("helvetica", "normal");
      doc.text(r.k, 17, cy + 5);
      doc.text(vLines, 17 + colW1, cy + 5);

      cy += rH;
    });

    // Signature Block (Aligned with bank details)
    const sigX = 135;
    const sigY = bankStartY + 25;

    // "Approved:"
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Approved:", sigX, sigY);

    // "Signature"
    doc.setFont("helvetica", "italic");
    doc.setTextColor(130, 150, 170); // lighter blue-grey
    doc.text("Signature", sigX + 25, sigY);

    // Line
    doc.setDrawColor(200, 210, 220);
    doc.setLineWidth(0.5);
    doc.line(sigX, sigY + 5, sigX + 60, sigY + 5);

    // Date
    doc.setFont("helvetica", "normal");
    const dateStr = inv.date || new Date().toISOString().split('T')[0];
    const formattedDate = dateStr.includes('-') ? dateStr.split('-').reverse().join('/') : dateStr;
    doc.text(`Date:    ${formattedDate}`, sigX, sigY + 12);

    // Reset colors
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    // 11. Footer
    // Anchor the footer at the bottom of the page for a professional look
    const footerY = 285;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, footerY, 195, footerY);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const part1 = "Registered Office: 15 A, B, C, Aalayam Imperial, Kuniyamuthur, Coimbatore - 641 008. ";
    const w1 = doc.getTextWidth(part1);

    doc.setFont("helvetica", "bold");
    const part2 = "Contact No: ";
    const w2 = doc.getTextWidth(part2);

    doc.setFont("helvetica", "normal");
    const part3 = "0422-3597246";
    const w3 = doc.getTextWidth(part3);

    const totalW = w1 + w2 + w3;
    let startX = (210 - totalW) / 2;

    doc.setFont("helvetica", "normal");
    doc.text(part1, startX, footerY + 4);
    startX += w1;

    doc.setFont("helvetica", "bold");
    doc.text(part2, startX, footerY + 4);
    startX += w2;

    doc.setFont("helvetica", "normal");
    doc.text(part3, startX, footerY + 4);

    return doc;
  };

  const handleDownloadInvoice = (inv) => {
    const doc = generatePDFDoc(inv);
    const safeClientName = (inv.client || 'Client').replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/_$/, '');
    doc.save(`${inv.id}_${safeClientName}.pdf`);
  };

  const handlePreviewInvoice = (inv) => {
    const doc = generatePDFDoc(inv);
    const blobUrl = doc.output('bloburl');
    setPreviewUrl(blobUrl);
    setPreviewInv(inv);
  };

  const handlePrint = (inv) => {
    const doc = generatePDFDoc(inv);
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filtered = invoices.filter(i =>
    (statusFilter === 'All' || i.status === statusFilter) &&
    (i.client.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedAndFiltered = useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'total') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else if (sortConfig.key === 'date' || sortConfig.key === 'month') {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

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
          <div className="flex items-center gap-4">

            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Invoice History
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review past transactions and generated invoices.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/create-invoice')} className="btn-primary flex items-center gap-2 text-sm bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all">
            <FilePlus size={16} /> Create Invoice
          </button>
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-slate-200">
            <Download size={16} /> Export Record
          </button>
        </div>
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
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">S.No</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-700" onClick={() => requestSort('date')}>
                  <div className="flex items-center gap-1">Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}</div>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-700" onClick={() => requestSort('month')}>
                  <div className="flex items-center gap-1">Month {sortConfig.key === 'month' ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}</div>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-700" onClick={() => requestSort('id')}>
                  <div className="flex items-center gap-1">Invoice ID {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}</div>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-700" onClick={() => requestSort('client')}>
                  <div className="flex items-center gap-1">Client Name {sortConfig.key === 'client' ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}</div>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-700" onClick={() => requestSort('total')}>
                  <div className="flex items-center gap-1">Total Amount {sortConfig.key === 'total' ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={14} className="opacity-50" />}</div>
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
              {sortedAndFiltered.length === 0 ? (
                <tr><td colSpan={8} className="p-8 text-center text-slate-400">No invoices in history.</td></tr>
              ) : sortedAndFiltered.map((inv, index) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="p-4 text-sm text-slate-500 font-medium">{index + 1}</td>
                  <td className="p-4 text-sm text-slate-500">
                    {editingId === inv.id ? (
                      <input type="date" className="input-field py-1 px-2 text-sm w-32" value={editFormData.date} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} />
                    ) : (
                      inv.date
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-500 font-medium">
                    {inv.date ? new Date(inv.date).toLocaleString('default', { month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="p-4 font-semibold text-violet-600 dark:text-violet-400 text-sm">{inv.id}</td>
                  <td className="p-4">
                    {editingId === inv.id ? (
                      <input type="text" className="input-field py-1 px-2 text-sm w-32" value={editFormData.client} onChange={(e) => setEditFormData({ ...editFormData, client: e.target.value })} />
                    ) : (
                      <button
                        onClick={() => navigate('/client-data')}
                        className="font-medium text-violet-600 dark:text-violet-400 text-sm hover:underline hover:text-violet-700 transition-colors text-left focus:outline-none"
                      >
                        {inv.client}
                      </button>
                    )}
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">
                    {editingId === inv.id ? (
                      <input type="number" className="input-field py-1 px-2 text-sm w-24" value={editFormData.total} onChange={(e) => setEditFormData({ ...editFormData, total: e.target.value })} />
                    ) : (
                      `₹${Number(inv.total).toLocaleString('en-IN')}`
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === inv.id ? (
                      <select className="input-field py-1 px-2 text-sm w-28" value={editFormData.status} onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}>
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
                      {editingId === inv.id ? (
                        <>
                          <button onClick={() => handleSaveClick(inv.id)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Save">
                            <Save size={15} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Cancel">
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handlePreviewInvoice(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" title="View & Download">
                            <Eye size={15} />
                          </button>
                          <button onClick={() => handleEditClick(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors" title="Edit">
                            <Edit size={15} />
                          </button>
                          <button onClick={() => handlePrint(inv)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors" title="Print">
                            <Printer size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 dark:border-dark-700" onClick={e => e.stopPropagation()}>
            {/* Header with Pattern/Gradient */}
            <div className="relative h-32 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-2 rounded-full backdrop-blur-md transition-all z-10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 pt-0 relative">
              {/* Avatar */}
              <div className="absolute -top-14 left-8 flex items-end justify-between w-[calc(100%-4rem)]">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-white dark:bg-dark-800 p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-violet-100 to-indigo-50 dark:from-violet-900/50 dark:to-indigo-900/30 flex items-center justify-center text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 text-5xl font-extrabold">
                      {selectedClient.client.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-dark-800 rounded-full shadow-sm"></div>
                </div>

                <div className="pb-2 flex items-center gap-2">
                  {isEditingProfile ? (
                    <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                      <Save size={16} /> Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => {
                        setProfileForm({
                          email: profileForm.email || `${selectedClient.client.toLowerCase().split(' ')[0]}@company.com`,
                          phone: profileForm.phone || '+91 98765 43210',
                          address: profileForm.address || '123 Business Park, Tech City, Innovation District, 400001'
                        });
                        setIsEditingProfile(true);
                      }} className="px-4 py-2 bg-white/80 dark:bg-dark-700/80 hover:bg-white dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl backdrop-blur-md shadow-sm transition-all flex items-center gap-2">
                        <Edit size={16} /> Edit
                      </button>
                      <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2">
                        <Mail size={16} /> Contact
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-20 space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedClient.client}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2 mt-1">
                    <Building2 size={16} className="text-violet-500" /> Premium Client
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const clientInvoices = invoices.filter(inv => inv.client === selectedClient.client);
                    const clientTotal = clientInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
                    const paidCount = clientInvoices.filter(inv => inv.status === 'Paid').length;
                    return (
                      <>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-700">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Invoices</p>
                          <p className="text-xl font-black text-slate-800 dark:text-white">{clientInvoices.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-700">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Total Value</p>
                          <p className="text-xl font-black text-violet-600 dark:text-violet-400">₹{(clientTotal / 1000).toFixed(1)}k</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-700">
                          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Paid</p>
                          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">{paidCount}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700 hover:shadow-md transition-shadow group">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Mail size={20} />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                      {isEditingProfile ? (
                        <input type="email" className="input-field py-1 px-2 text-sm w-full mt-1" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {profileForm.email || `${selectedClient.client.toLowerCase().split(' ')[0]}@company.com`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700 hover:shadow-md transition-shadow group">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:emerald-400 group-hover:scale-110 transition-transform">
                      <Phone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                      {isEditingProfile ? (
                        <input type="text" className="input-field py-1 px-2 text-sm w-full mt-1" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {profileForm.phone || '+91 98765 43210'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark-800 border border-slate-100 dark:border-dark-700 hover:shadow-md transition-shadow group">
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
                      <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Billing Address</p>
                      {isEditingProfile ? (
                        <input type="text" className="input-field py-1 px-2 text-sm w-full mt-1" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {profileForm.address || '123 Business Park, Tech City, Innovation District, 400001'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Invoice Preview Modal */}
      {previewUrl && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FilePlus size={20} className="text-violet-600" /> 
                Invoice Preview
              </h2>
              <div className="flex items-center gap-3">
                <button onClick={() => { handleDownloadInvoice(previewInv); setPreviewUrl(null); }} className="btn-primary flex items-center gap-2 text-sm bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium">
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => setPreviewUrl(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-950 p-2 sm:p-6 overflow-hidden">
              <iframe src={previewUrl + "#toolbar=0&navpanes=0&scrollbar=0&view=FitH"} className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white" title="Invoice Preview" />
            </div>
          </div>
        </div>,
        document.body
      )}
    
      
  {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}