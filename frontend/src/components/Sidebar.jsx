import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FolderKanban,
  Receipt,
  Wallet,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  X,
  Calendar,
  UserPlus,
  ClipboardCheck,
  CalendarOff,
  Briefcase,
  FileCheck,
  Star,
  Plane,
  Utensils,
  Fuel,
  Package,
  Building2,
  TrendingDown,
  Users2,
  Cog,
  Percent
} from 'lucide-react';

const mainNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employee', path: '/students', icon: Users },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
];

const financialItems = [
  { name: 'Claims', path: '/claims', icon: ClipboardCheck },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Operational Expenses', path: '/operational-expenses', icon: Building2 },
  { name: 'Running Costs', path: '/running-costs', icon: TrendingDown },
  { name: 'Employee Costs', path: '/employee-running-costs', icon: Users2 },
  { name: 'Operational Costs', path: '/operational-running-costs', icon: Cog },
  { name: 'GST', path: '/gst', icon: Percent },
  { name: 'Salaries', path: '/salaries', icon: Wallet },
  { name: 'Invoices', path: '/invoices', icon: FileText },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar, openSettings }) {
  const userRole = localStorage.getItem('userRole') || 'Admin';
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-dark-700 transform transition-all duration-300 ease-in-out lg:static lg:inset-auto flex flex-col h-screen ${isOpen ? 'translate-x-0 w-64' : '-translate-x-[120%] w-64 lg:translate-x-0 lg:w-20'}`}>

        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 dark:border-dark-700/50 shrink-0">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white overflow-hidden">
            <div className="w-8 h-8 shrink-0 bg-violet-600 rounded-lg shadow-sm flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M8 6v9a2 2 0 0 0 2 2" />
                <path d="M14 6v9a2 2 0 0 0 2 2" />
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-300 ${!isOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>Learnlike<sup className="font-normal text-sm">&reg;</sup></span>
          </div>
          <button onClick={toggleSidebar} className={`lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ${!isOpen ? 'hidden' : ''}`}>
            <X size={24} />
          </button>
        </div>

        <nav className={`p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden ${!isOpen ? 'lg:px-3' : ''}`}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden ${!isOpen ? 'lg:px-0 lg:justify-center' : ''} ${isActive
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              title={!isOpen ? item.name : ''}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`transition-opacity duration-300 ${!isOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
            </NavLink>
          ))}



              <div className="py-4 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-dark-700/50"></div>
                </div>
                <div className={`relative flex justify-center ${!isOpen ? 'lg:hidden' : ''}`}>
                  <span className="bg-white dark:bg-zinc-950 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Financials & More
                  </span>
                </div>
              </div>

              {financialItems.map((item) => (
                item.name === 'Settings' ? (
                  <button
                    key={item.name}
                    onClick={openSettings}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden ${!isOpen ? 'lg:px-0 lg:justify-center' : ''} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200`}
                    title={!isOpen ? item.name : ''}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className={`transition-opacity duration-300 ${!isOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
                  </button>
                ) : (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden ${!isOpen ? 'lg:px-0 lg:justify-center' : ''} ${isActive
                        ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    }
                    title={!isOpen ? item.name : ''}
                  >
                    <item.icon size={20} className="shrink-0" />
                    <span className={`transition-opacity duration-300 ${!isOpen ? 'lg:opacity-0 lg:hidden' : 'opacity-100'}`}>{item.name}</span>
                  </NavLink>
                )
              ))}



        </nav>

        <div className={`shrink-0 p-4 border-t border-slate-200 dark:border-dark-700/50 flex flex-col items-center ${!isOpen ? 'lg:hidden' : ''}`}>


          <div className="text-center w-full flex flex-col items-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">Powered by</span>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div className="w-5 h-5 bg-violet-600 rounded flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M9 6v9c0 1.5 1 2.5 2.5 3" />
                  <path d="M15 6v9c0 1.5 1 2.5 2.5 3" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">Learnlike<sup className="font-normal text-[8px]">&reg;</sup></span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
