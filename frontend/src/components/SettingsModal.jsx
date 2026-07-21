import { X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, isDark, setIsDark }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center bg-white dark:bg-zinc-950 z-10">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings & Preferences</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {/* Appearance Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Appearance</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsDark(false)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-colors ${
                  !isDark 
                    ? 'border-violet-200 bg-violet-50 text-violet-700' 
                    : 'border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700'
                }`}
              >
                <span>🌞</span> Light Theme
              </button>
              <button 
                onClick={() => setIsDark(true)}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-medium transition-colors ${
                  isDark 
                    ? 'border-violet-200 bg-violet-500/20 text-violet-400' 
                    : 'border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-700'
                }`}
              >
                <span>🌙</span> Dark Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
