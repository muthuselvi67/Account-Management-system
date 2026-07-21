import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SettingsModal from './SettingsModal';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex transition-colors duration-300 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        openSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          openSettings={() => setIsSettingsOpen(true)}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} isDark={isDark} setIsDark={setIsDark} />
    </div>
  );
}
