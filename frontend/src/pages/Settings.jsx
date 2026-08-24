import { useState } from 'react';
import ViewModal from '../components/ViewModal';
import { User, Lock, Bell, Shield, Camera, Save, Check, Loader2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [viewingRecord, setViewingRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account preferences and settings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 transition-all ${
            showSuccess ? 'bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-green-500/30' : 'btn-primary'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : showSuccess ? (
            <>
              <Check size={18} />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation for Settings */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-700 p-2 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User size={18} />
              <span>Profile Information</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'security'
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Lock size={18} />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === 'notifications'
                  ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white dark:bg-dark-900 rounded-2xl shadow-sm border border-slate-200 dark:border-dark-700 p-6 md:p-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your account's profile information and email address.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-900 overflow-hidden border-4 border-white dark:border-dark-800 shadow-lg">
                    <img
                      src="https://api.dicebear.com/7.x/initials/svg?seed=DR&backgroundColor=0f172a&textColor=ffffff"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <button className="btn-secondary text-sm">Change Photo</button>
                  <button className="text-slate-400 hover:text-red-500 text-sm ml-4 font-medium transition-colors">Remove</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input type="text" defaultValue="Admin" className="input-field" />
                </div>
                <div>
                  <input type="email" defaultValue="admin@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <input type="text" defaultValue="Admin" disabled className="input-field bg-slate-50 dark:bg-dark-800 text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Password</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <div className="max-w-md space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
              </div>


            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose what notifications you want to receive and how.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-dark-700 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Email Notifications</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive emails about your account activity and security.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-dark-700 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Push Notifications</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications for quick updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {viewingRecord && <ViewModal record={viewingRecord} onClose={() => setViewingRecord(null)} />}
</div>
  );
}
