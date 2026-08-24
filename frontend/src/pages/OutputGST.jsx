import React, { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { Percent, X, Plus, Search, Calendar, Hash, Building2, FileCheck, DollarSign, Activity, AlignLeft, Check, Eye, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OutputGST() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('outputGst');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingRecord, setViewingRecord] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    clientName: '',
    clientGstin: '',
    taxableValue: '',
    gstRate: '18%',
    returnPeriod: '',
    status: 'Pending',
    notes: ''
  });

  // Save to local storage whenever records change
  useEffect(() => {
    localStorage.setItem('outputGst', JSON.stringify(records));
  }, [records]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateGstAmount = (taxableValue, gstRate) => {
    const numAmount = parseFloat(taxableValue) || 0;
    const rate = parseFloat(gstRate.replace('%', '')) || 0;
    return numAmount * (rate / 100);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      clientName: '',
      clientGstin: '',
      taxableValue: '',
      gstRate: '18%',
      returnPeriod: '',
      status: 'Pending',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.taxableValue) return;

    const gstAmount = calculateGstAmount(formData.taxableValue, formData.gstRate);
    
    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...formData, gstAmount: gstAmount, totalValue: (parseFloat(formData.taxableValue) || 0) + gstAmount } : r));
    } else {
      const newRecord = {
        id: Date.now().toString(),
        ...formData,
        gstAmount: gstAmount,
        totalValue: (parseFloat(formData.taxableValue) || 0) + gstAmount
      };
      setRecords(prev => [newRecord, ...prev]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
      clientName: '',
      clientGstin: '',
      taxableValue: '',
      gstRate: '18%',
      returnPeriod: '',
      status: 'Pending',
      notes: ''
    });
  };

  const deleteRecord = (id) => {
    if(window.confirm('Are you sure you want to delete this GST record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(r => 
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.clientGstin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'Filed': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Filed</span>;
      case 'Reconciled': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Reconciled</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <Percent className="text-violet-600 dark:text-violet-400" size={28} />
            </div>
            Output GST
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
            Manage Output GST collected from clients and track filing status.
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

      {/* Toolbar */}
      <div className="bg-white dark:bg-dark-900 p-4 rounded-[16px] border border-slate-200 dark:border-dark-800 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by client, invoice or GSTIN..."
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
            <Percent size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Output GST records found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery ? "No records match your search criteria." : "You haven't logged any Output GST yet. Click the button above to log one."}
          </p>
          {!searchQuery && (
            <button 
              onClick={openAddModal}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Plus size={16} /> Log your first GST record
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Invoice & Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client & GSTIN</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Taxable Value</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">GST Collected</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status & Period</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">{record.invoiceNumber}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 dark:text-white">{record.clientName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                         {record.clientGstin ? `GSTIN: ${record.clientGstin}` : 'Unregistered'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 dark:text-white">
                        ₹{parseFloat(record.taxableValue || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-violet-600 dark:text-violet-400">
                        ₹{parseFloat(record.gstAmount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Rate: {record.gstRate}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="mb-1">{getStatusBadge(record.status)}</div>
                      {record.returnPeriod && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                          Period: {record.returnPeriod}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right"><div className="flex items-center justify-end gap-1">
                        <button 
                        onClick={() => handleEdit(record)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1"
                        title="Edit GST Record"
                      >
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                        title="Delete GST Record"
                      >
                        <Trash2 size={18} />
                      </button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 rounded-[24px] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-dark-800 flex flex-col max-h-[90vh]">
            
            <div className="flex items-start justify-between p-6 pb-2 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Output GST' : 'Log Output GST'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {editingId ? 'Update the details for this GST record.' : 'Fill in the details to record Output GST collected on sales.'}
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
                    <span>Invoice Date</span>
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
                    <span>Invoice Number</span>
                  </label>
                  <input 
                    type="text" 
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
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
                    placeholder="e.g. Acme Corp"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <FileCheck size={16} className="text-violet-500" />
                    <span>Client GSTIN</span>
                  </label>
                  <input 
                    type="text" 
                    name="clientGstin"
                    placeholder="e.g. 27AADCB2230M1Z2"
                    value={formData.clientGstin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white uppercase"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign size={16} className="text-violet-500" />
                    <span>Taxable Value (Base)</span>
                  </label>
                  <input 
                    type="number" 
                    name="taxableValue"
                    placeholder="0.00"
                    value={formData.taxableValue}
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
                    name="gstRate"
                    placeholder="e.g. 18%"
                    value={formData.gstRate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={16} className="text-violet-500" />
                    <span>Return Period</span>
                  </label>
                  <input 
                    type="month" 
                    name="returnPeriod"
                    value={formData.returnPeriod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Activity size={16} className="text-violet-500" />
                    <span>Filing Status</span>
                  </label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Filed">Filed</option>
                    <option value="Reconciled">Reconciled</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5 mt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <AlignLeft size={16} className="text-violet-500" />
                    <span>Notes</span>
                  </label>
                  <textarea 
                    name="notes"
                    placeholder="Enter any additional GST filing remarks..."
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
                disabled={!formData.clientName || !formData.taxableValue}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-violet-600/20"
              >
                <Check size={18} />
                <span>{editingId ? 'Update GST Record' : 'Save GST Record'}</span>
              </button>
            </div>
            
          </div>
        </div>
      )}
    
      
  {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}