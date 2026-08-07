import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Search, Calendar, Hash, Building2, Briefcase, DollarSign, Clock, Activity, AlignLeft, Check, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientPOs() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('clientPOs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    poNumber: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
    clientName: '',
    subject: '',
    amount: '',
    deliveryDate: '',
    status: 'Pending',
    notes: ''
  });

  // Save to local storage whenever records change
  useEffect(() => {
    localStorage.setItem('clientPOs', JSON.stringify(records));
  }, [records]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      poNumber: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
      clientName: '',
      subject: '',
      amount: '',
      deliveryDate: '',
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
    if (!formData.clientName || !formData.amount) return;

    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r));
    } else {
      const newRecord = {
        id: Date.now().toString(),
        ...formData
      };
      setRecords(prev => [newRecord, ...prev]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      poNumber: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
      clientName: '',
      subject: '',
      amount: '',
      deliveryDate: '',
      status: 'Pending',
      notes: ''
    });
  };

  const deleteRecord = (id) => {
    if(window.confirm('Are you sure you want to delete this purchase order?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(r => 
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>;
      case 'Accepted': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Accepted</span>;
      case 'In Progress': return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider">In Progress</span>;
      case 'Fulfilled': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Fulfilled</span>;
      case 'Cancelled': return <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">Cancelled</span>;
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
              <ShoppingCart className="text-violet-600 dark:text-violet-400" size={28} />
            </div>
            Purchase Orders Received
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xl">
            Track and manage all purchase orders received from your clients.
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
            placeholder="Search by client, subject or PO Number..."
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
            <ShoppingCart size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No purchase orders found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery ? "No records match your search criteria." : "You haven't logged any purchase orders yet. Click the button above to add one."}
          </p>
          {!searchQuery && (
            <button 
              onClick={openAddModal}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Plus size={16} /> Log your first PO
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PO Number / Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client & Subject</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">{record.poNumber}</div>
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
                      <div className="font-semibold text-slate-800 dark:text-white">
                        ₹{parseFloat(record.amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </div>
                      {record.deliveryDate && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                          <Clock size={12} /> Due: {new Date(record.deliveryDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1"
                        title="Edit Purchase Order"
                      >
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                        title="Delete Purchase Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
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
                  {editingId ? 'Edit Purchase Order' : 'Log Purchase Order'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {editingId ? 'Update the details for this purchase order.' : 'Fill in the details to log a new purchase order received.'}
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
                    <span>Received Date</span>
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
                    <span>PO Number</span>
                  </label>
                  <input 
                    type="text" 
                    name="poNumber"
                    value={formData.poNumber}
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
                
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign size={16} className="text-violet-500" />
                    <span>Total Value (₹)</span>
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
                    <Clock size={16} className="text-violet-500" />
                    <span>Expected Delivery</span>
                  </label>
                  <input 
                    type="date" 
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white [&::-webkit-calendar-picker-indicator]:dark:invert"
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
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5 mt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <AlignLeft size={16} className="text-violet-500" />
                    <span>Notes / Item Details</span>
                  </label>
                  <textarea 
                    name="notes"
                    rows={4}
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
                <span>{editingId ? 'Update Purchase Order' : 'Save Purchase Order'}</span>
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
