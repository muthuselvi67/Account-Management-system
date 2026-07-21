import React from 'react';
import { ClipboardCheck } from 'lucide-react';

export default function ClaimsPlaceholder() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ClipboardCheck className="text-violet-600 dark:text-violet-400" size={28} />
            Claims Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and track all employee claims and expenses.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Claim
        </button>
      </div>

      <div className="glass-card p-12 text-center">
        <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">
          <ClipboardCheck size={40} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No Claims Found</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          There are currently no claims in the system. Click the button above to create a new one.
        </p>
      </div>
    </div>
  );
}
