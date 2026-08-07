import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Search, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

export default function ClientData() {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoicesData');
    
    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices);
      
      const flattenedItems = [];
      
      parsedInvoices.forEach(inv => {
        // Handle invoices that might not have the new fields yet
        const items = inv.items && inv.items.length > 0 
          ? inv.items 
          : [{ description: inv.note || 'General Services', quantity: 1, price: inv.baseTotal || inv.total }];
        
        items.forEach((item, index) => {
          const itemSubtotal = (parseFloat(item.quantity || 0) * parseFloat(item.price || 0));
          const gstRate = parseFloat(inv.gstRate || 18);
          const itemGst = Math.round(itemSubtotal * gstRate / 100);
          
          flattenedItems.push({
            rowId: `${inv.id}-${index}`,
            invoiceNumber: inv.id,
            invoiceDate: inv.date,
            dueDate: inv.dueDate || '-',
            poNumber: inv.poNumber || '-',
            description: item.description || '-',
            quantity: item.quantity || 0,
            unitPrice: item.price || 0,
            subtotal: itemSubtotal,
            tax: itemGst,
            totalAmount: itemSubtotal + itemGst,
            paymentTerms: inv.paymentTerms || '-',
            bankDetails: inv.bankDetails || '-'
          });
        });
      });
      
      setInvoiceItems(flattenedItems);
    }
  }, []);

  const handleExport = () => {
    const headers = [
      "Invoice Number", "Invoice Date", "Due Date", "PO Number", 
      "Description", "Quantity", "Unit Price", "Subtotal", 
      "Tax", "Total Amount", "Payment Terms", "Bank Details"
    ];
    
    const csvRows = [headers.join(",")];
    
    invoiceItems.forEach(item => {
      const row = [
        item.invoiceNumber, item.invoiceDate, item.dueDate, 
        `"${item.poNumber.replace(/"/g, '""')}"`, 
        `"${item.description.replace(/"/g, '""')}"`, 
        item.quantity, item.unitPrice, item.subtotal, 
        item.tax, item.totalAmount, 
        `"${item.paymentTerms.replace(/"/g, '""')}"`, 
        `"${item.bankDetails.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });
    
    const csv = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invoice_detailed_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp size={14} className="text-violet-600" />
      : <ChevronDown size={14} className="text-violet-600" />;
  };

  const filtered = invoiceItems.filter(item => 
    item.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.poNumber.toLowerCase().includes(search.toLowerCase())
  );

  const sortedAndFiltered = useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const Th = ({ label, sortKey }) => (
    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer group whitespace-nowrap bg-slate-50/50 dark:bg-dark-800/50 sticky top-0" onClick={() => requestSort(sortKey)}>
      <div className="flex items-center gap-2 hover:text-slate-700 dark:hover:text-slate-200">
        {label} {getSortIcon(sortKey)}
      </div>
    </th>
  );

  return (
    <div className="flex-1 space-y-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FileText className="text-violet-600 dark:text-violet-400" size={28} />
            Invoice Details Report
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Detailed line-by-line breakdown of all generated invoices.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-slate-200">
            <Download size={16} /> Export Record
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by Invoice, PO, or Description..."
            className="input-field pl-10 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse min-w-[1500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-700">
                <Th label="Invoice Number" sortKey="invoiceNumber" />
                <Th label="Invoice Date" sortKey="invoiceDate" />
                <Th label="Due Date" sortKey="dueDate" />
                <Th label="PO Number" sortKey="poNumber" />
                <Th label="Description" sortKey="description" />
                <Th label="Quantity" sortKey="quantity" />
                <Th label="Unit Price" sortKey="unitPrice" />
                <Th label="Subtotal" sortKey="subtotal" />
                <Th label="Tax" sortKey="tax" />
                <Th label="Total Amount" sortKey="totalAmount" />
                <Th label="Payment Terms" sortKey="paymentTerms" />
                <Th label="Bank Details" sortKey="bankDetails" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-700/50">
              {sortedAndFiltered.length === 0 ? (
                <tr>
                  <td colSpan="12" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No invoice details found. Create a detailed invoice to see data here.
                  </td>
                </tr>
              ) : sortedAndFiltered.map((item) => (
                <tr key={item.rowId} className="hover:bg-slate-50 dark:hover:bg-dark-800/50 transition-colors group">
                  <td className="p-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{item.invoiceNumber}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.invoiceDate}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.dueDate}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.poNumber}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[250px] truncate" title={item.description}>{item.description}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.quantity}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">₹{Number(item.subtotal).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">₹{Number(item.tax).toLocaleString('en-IN')}</td>
                  <td className="p-4 font-bold text-violet-600 dark:text-violet-400 whitespace-nowrap">₹{Number(item.totalAmount).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.paymentTerms}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={item.bankDetails}>{item.bankDetails}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
