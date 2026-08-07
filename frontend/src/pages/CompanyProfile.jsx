import React, { useState } from 'react';
import { Building2, Save, MapPin, Mail, Phone, Hash, CheckCircle2 } from 'lucide-react';

export default function CompanyProfile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('learnlike_company_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      registration: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    };
  });
  const [toast, setToast] = useState({ show: false, message: '' });

  const showNotification = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 2000);
  };

  const handleSave = () => {
    localStorage.setItem('learnlike_company_profile', JSON.stringify(profile));
    showNotification("Company Profile saved successfully!");
  };

  return (
    <div className="flex-1 space-y-6 animate-fade-in pb-8 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 size={20} />
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Building2 className="text-violet-600 dark:text-violet-400" size={28} />
            Company Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage official company details used across the system.</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Building2 size={20} className="text-violet-500" />
            General Information
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
            <input type="text" className="input-field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration / Tax ID</label>
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" className="input-field pl-9" value={profile.registration} onChange={(e) => setProfile({ ...profile, registration: e.target.value })} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" className="input-field pl-9" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" className="input-field pl-9" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin size={20} className="text-violet-500" />
            Address Details
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Street Address</label>
            <input type="text" className="input-field" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
              <input type="text" className="input-field" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">State / Province</label>
              <input type="text" className="input-field" value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ZIP / Postal Code</label>
            <input type="text" className="input-field" value={profile.zip} onChange={(e) => setProfile({ ...profile, zip: e.target.value })} />
          </div>
        </div>
      </div>
    </div>
  );
}
