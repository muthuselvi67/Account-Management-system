import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, X } from 'lucide-react';

export default function Calendar() {
  const [holidays, setHolidays] = useState([
    { id: 1, name: 'New Year Day', date: '01 Jan 2026', day: 'Thursday', type: 'NATIONAL', description: 'First day of the year' },
    { id: 2, name: 'Republic Day', date: '26 Jan 2026', day: 'Monday', type: 'GOVERNMENT', description: 'Celebration of Indian Republic (Govt Holiday)' },
    { id: 3, name: 'Holi', date: '14 Mar 2026', day: 'Saturday', type: 'FLOATING LEAVE', description: 'Festival of colors (Optional/Floating Leave)' },
    { id: 4, name: 'Annual Bank Closing', date: '01 Apr 2026', day: 'Wednesday', type: 'BANK', description: 'Bank Holiday' },
    { id: 5, name: 'Good Friday', date: '03 Apr 2026', day: 'Friday', type: 'NATIONAL', description: 'Religious holiday' },
    { id: 6, name: 'May Day', date: '01 May 2026', day: 'Friday', type: 'GOVERNMENT', description: 'Labor Day' },
    { id: 7, name: 'Independence Day', date: '15 Aug 2026', day: 'Saturday', type: 'GOVERNMENT', description: 'Indian Independence Day (Govt Holiday)' },
    { id: 8, name: 'Gandhi Jayanti', date: '02 Oct 2026', day: 'Friday', type: 'NATIONAL', description: 'Mahatma Gandhi Birthday' },
    { id: 9, name: 'Diwali', date: '08 Nov 2026', day: 'Sunday', type: 'GOVERNMENT', description: 'Festival of Lights' },
    { id: 10, name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'GOVERNMENT', description: 'Christmas' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'GOVERNMENT',
    description: ''
  });

  const handleSaveHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) return;
    
    const dateObj = new Date(newHoliday.date);
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // e.g. 02 Oct 2026

    if (editingHolidayId) {
      setHolidays(holidays.map(h => {
        if (h.id === editingHolidayId) {
          return {
            ...h,
            name: newHoliday.name,
            date: formattedDate,
            day: day,
            type: newHoliday.type,
            description: newHoliday.description
          };
        }
        return h;
      }));
    } else {
      const holidayEntry = {
        id: Date.now(),
        name: newHoliday.name,
        date: formattedDate,
        day: day,
        type: newHoliday.type,
        description: newHoliday.description
      };
      
      setHolidays([...holidays, holidayEntry]);
    }
    
    setNewHoliday({ name: '', date: '', type: 'GOVERNMENT', description: '' });
    setEditingHolidayId(null);
    setIsModalOpen(false);
  };
  
  const handleEditClick = (holiday) => {
    setEditingHolidayId(holiday.id);
    let dateVal = '';
    try {
      const d = new Date(holiday.date);
      if (!isNaN(d.getTime())) {
        dateVal = d.toISOString().split('T')[0];
      }
    } catch (e) {}

    setNewHoliday({
      name: holiday.name,
      date: dateVal,
      type: holiday.type,
      description: holiday.description || ''
    });
    setIsModalOpen(true);
  };
  
  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'NATIONAL':
        return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold';
      case 'GOVERNMENT':
        return 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 font-bold';
      case 'FLOATING LEAVE':
        return 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 font-bold';
      case 'BANK':
        return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400 font-bold';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 font-bold';
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Holiday Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage upcoming national, government, and floating holidays.</p>
        </div>
        <button onClick={() => {
          setEditingHolidayId(null);
          setNewHoliday({ name: '', date: '', type: 'GOVERNMENT', description: '' });
          setIsModalOpen(true);
        }} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-200 dark:border-dark-700">
                <th className="px-6 py-4">Holiday Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
              {holidays.map((holiday) => (
                <tr key={holiday.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <CalendarIcon size={18} className="text-primary-400 dark:text-primary-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">{holiday.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{holiday.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{holiday.day}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider ${getTypeStyle(holiday.type)}`}>
                      {holiday.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-400 dark:text-slate-500 truncate block max-w-[250px]">
                      {holiday.description}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEditClick(holiday)} className="p-1.5 text-slate-500 hover:text-slate-700 border border-slate-200 dark:border-dark-600 rounded-md transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteHoliday(holiday.id)} className="p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md shadow-sm transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Holiday Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingHolidayId ? 'Edit Holiday' : 'Add New Holiday'}
              </h2>
              <button onClick={() => { setIsModalOpen(false); setEditingHolidayId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Holiday Name</label>
                <input type="text" className="input-field" placeholder="e.g. Diwali" value={newHoliday.name} onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" className="input-field text-slate-500" value={newHoliday.date} onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select className="input-field" value={newHoliday.type} onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}>
                  <option value="NATIONAL">NATIONAL</option>
                  <option value="GOVERNMENT">GOVERNMENT</option>
                  <option value="FLOATING LEAVE">FLOATING LEAVE</option>
                  <option value="BANK">BANK</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input type="text" className="input-field" placeholder="Optional description..." value={newHoliday.description} onChange={(e) => setNewHoliday({...newHoliday, description: e.target.value})} />
              </div>
              
              <div className="pt-2 flex gap-3">
                <button onClick={() => { setIsModalOpen(false); setEditingHolidayId(null); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
                <button onClick={handleSaveHoliday} className="btn-primary flex-1 py-2.5">
                  {editingHolidayId ? 'Update Holiday' : 'Save Holiday'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
