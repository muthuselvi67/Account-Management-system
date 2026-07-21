export default function HRPlaceholder({ title, description }) {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{description}</p>
      </div>
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in border-t-4 border-violet-500">
        <div className="w-16 h-16 bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400 rounded-full flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Module Under Construction</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          The <strong>{title}</strong> module is currently being developed and will be available in an upcoming update. Stay tuned!
        </p>
      </div>
    </div>
  );
}
