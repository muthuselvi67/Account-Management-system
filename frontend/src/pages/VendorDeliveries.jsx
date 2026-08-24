import React, { useState, useEffect } from 'react';
import ViewModal from '../components/ViewModal';
import { createPortal } from 'react-dom';
import { Package, Plus, Search, Calendar, Hash, Building2, ShoppingCart, AlignLeft, Check, Eye, Trash2, X, Activity } from 'lucide-react';

export default function VendorDeliveries() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('vendorDeliveries');
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
    deliveryId: `DEL-${Math.floor(Math.random() * 9000) + 1000}`,
    vendorName: '',
    poReference: '',
    items: '',
    status: 'Received',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('vendorDeliveries', JSON.stringify(records));
  }, [records]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      deliveryId: `DEL-${Math.floor(Math.random() * 9000) + 1000}`,
      vendorName: '',
      poReference: '',
      items: '',
      status: 'Received',
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
    if (!formData.vendorName || !formData.items) return;

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
  };

  const deleteRecord = (id) => {
    if(window.confirm('Are you sure you want to delete this delivery record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(r => 
    r.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.deliveryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.poReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Received': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Received</span>;
      case 'Partial': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">Partial</span>;
      case 'Pending Inspection': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">Pending Inspect</span>;
      case 'Rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
              <Package className="text-violet-600 dark:text-violet-400" size={28} />
            </div>
            Vendor Deliveries
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xl">
            Track products or services received from vendors and manage delivery statuses.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm shadow-violet-600/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-900 p-4 rounded-[16px] border border-slate-200 dark:border-dark-800 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search deliveries by vendor, ID, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-violet-50 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-5 text-violet-500">
            <Package size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Records Found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery ? "No deliveries match your search criteria." : "There are currently no records for Vendor Deliveries. Click the button above to log one."}
          </p>
          {!searchQuery && (
            <button 
              onClick={openAddModal}
              className="text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1 mx-auto"
            >
              <Plus size={16} /> Log your first delivery
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-900 rounded-[20px] border border-slate-200 dark:border-dark-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-dark-800/50 border-b border-slate-200 dark:border-dark-700">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivery ID / Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vendor & PO Ref</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items / Description</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-800">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">{record.deliveryId}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-800 dark:text-white">{record.vendorName}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <ShoppingCart size={12} />
                        {record.poReference || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {record.items}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-4 px-6 text-right"><div className="flex items-center justify-end gap-1">
                        <button 
                        onClick={() => handleEdit(record)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors inline-flex mr-1"
                        title="Edit Delivery"
                      >
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                      <button 
                        onClick={() => deleteRecord(record.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                        title="Delete Delivery"
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

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-dark-900 rounded-[24px] w-full max-w-3xl shadow-2xl border border-slate-200 dark:border-dark-800 flex flex-col max-h-[90vh]">
            
            <div className="flex items-start justify-between p-6 pb-2 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Edit Delivery Record' : 'Log Vendor Delivery'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {editingId ? 'Update the details for this delivery.' : 'Log a new delivery received from a vendor.'}
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
                    <span>Date Received</span>
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
                    <span>Delivery / Receipt ID</span>
                  </label>
                  <input 
                    type="text" 
                    name="deliveryId"
                    value={formData.deliveryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Building2 size={16} className="text-violet-500" />
                    <span>Vendor Name</span>
                  </label>
                  <input 
                    type="text" 
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <ShoppingCart size={16} className="text-violet-500" />
                    <span>PO Reference (Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    name="poReference"
                    value={formData.poReference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Package size={16} className="text-violet-500" />
                    <span>Items Delivered</span>
                  </label>
                  <input 
                    type="text" 
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    required
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
                    <option value="Received">Received (Full)</option>
                    <option value="Partial">Partial Delivery</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Rejected">Rejected / Returned</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1.5 mt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <AlignLeft size={16} className="text-violet-500" />
                    <span>Notes / Comments</span>
                  </label>
                  <textarea 
                    name="notes"
                    rows={4}
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any issues with the delivery?"
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
                disabled={!formData.vendorName || !formData.items}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-violet-600/20"
              >
                <Check size={18} />
                <span>{editingId ? 'Update Delivery' : 'Log Delivery'}</span>
              </button>
            </div>
            
          </div>
        </div>
      , document.body)}
    
      
  {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}