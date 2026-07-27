import React, { useState } from 'react';
import { FilePlus, Send, Save, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState({
    client: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    gstRate: '18',
    note: ''
  });

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, price: 0 }
  ]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
      if (type === 'success') {
        setTimeout(() => navigate('/invoice-history'), 300); // Redirect after fade out
      }
    }, 2000);
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const baseTotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0)), 0);
  const gstAmount = Math.round(baseTotal * parseFloat(invoice.gstRate || 0) / 100);
  const finalTotal = baseTotal + gstAmount;

  const handleSave = () => {
    if (!invoice.client) {
      showNotification("Please enter a client name.", "error");
      return;
    }
    
    showNotification("Invoice saved successfully!", "success");
  };

  return (
    <div className="flex-1 space-y-6 animate-fade-in pb-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' :
            'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FilePlus className="text-violet-600 dark:text-violet-400" size={28} />
            Create Invoice
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Generate and send a new invoice to a client.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => navigate('/invoices')}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save & Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name / Company</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Acme Corp" 
                  value={invoice.client} 
                  onChange={(e) => setInvoice({ ...invoice, client: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Invoice Date</label>
                <input 
                  type="date" 
                  className="input-field text-slate-500" 
                  value={invoice.date} 
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date" 
                  className="input-field text-slate-500" 
                  value={invoice.dueDate} 
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} 
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 overflow-hidden">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-dark-700">
                    <th className="py-2 text-xs font-semibold text-slate-500 uppercase">Description</th>
                    <th className="py-2 text-xs font-semibold text-slate-500 uppercase w-24">Qty</th>
                    <th className="py-2 text-xs font-semibold text-slate-500 uppercase w-32">Price (₹)</th>
                    <th className="py-2 text-xs font-semibold text-slate-500 uppercase w-32 text-right">Total (₹)</th>
                    <th className="py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-2">
                        <input type="text" className="input-field py-2" placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" min="1" className="input-field py-2" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" min="0" className="input-field py-2" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} />
                      </td>
                      <td className="py-3 pl-2 text-right font-medium text-slate-800 dark:text-slate-200">
                        {((parseFloat(item.quantity || 0)) * (parseFloat(item.price || 0))).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 disabled:opacity-30" disabled={items.length === 1}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem} className="mt-4 flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
              <Plus size={16} /> Add Line Item
            </button>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Summary</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GST Rate (%)</label>
              <input 
                type="number" 
                className="input-field" 
                value={invoice.gstRate} 
                onChange={(e) => setInvoice({ ...invoice, gstRate: e.target.value })}
                placeholder="e.g. 18"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-dark-700">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">₹{baseTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                <span>GST ({invoice.gstRate}%)</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-dark-700">
                <span className="font-bold text-slate-800 dark:text-white">Total Amount</span>
                <span className="text-xl font-bold text-violet-600 dark:text-violet-400">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Additional Notes</label>
            <textarea 
              className="input-field resize-none h-24" 
              placeholder="Thank you for your business..." 
              value={invoice.note} 
              onChange={(e) => setInvoice({ ...invoice, note: e.target.value })}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
