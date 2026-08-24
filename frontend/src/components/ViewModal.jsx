import React from 'react';
import { X, Info } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function ViewModal({ record, onClose, title = "Record Details" }) {
  if (!record) return null;

  // Filter out internal/hidden fields if needed, or just display them all nicely
  const displayEntries = Object.entries(record).filter(([key, value]) => {
    // Hide empty strings, nulls, undefined, and complex objects/arrays
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'object') return false;
    // Hide generic ids if desired, but they can be useful
    return true;
  });

  const formatKey = (key) => {
    // Convert camelCase to Title Case
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-dark-900 rounded-[24px] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-dark-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-dark-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <Info className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">View information</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="bg-slate-50 dark:bg-dark-800/50 rounded-2xl p-5 border border-slate-100 dark:border-dark-700/50 space-y-4">
            {displayEntries.map(([key, value]) => (
              <div key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-slate-200/60 dark:border-dark-700/60 last:border-0 pb-3 last:pb-0">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 w-1/3 shrink-0">
                  {formatKey(key)}
                </span>
                <span className="text-sm text-slate-800 dark:text-slate-200 font-medium break-words">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 shrink-0 border-t border-slate-100 dark:border-dark-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
