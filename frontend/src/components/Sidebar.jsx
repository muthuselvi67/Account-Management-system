import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/logo.png';
import LogoDark from '../assets/logo_dark.png';

import {
  LayoutDashboard,
  Users,
  CreditCard,
  FolderKanban,
  Receipt,
  Wallet,
  FileText,
  FilePlus,
  History,
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
  Percent,
  MessageSquare,
  HelpCircle,
  ShoppingCart,
  Scissors
} from 'lucide-react';

const mainNavItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employee', path: '/employees', icon: Users },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Client', path: '/clients-hub', icon: Briefcase },
  { name: 'Companies (Vendors)', path: '/companies-hub', icon: Building2 },
  { name: 'Quotations', path: '/client-quotations', icon: FileText },
];

const financialItems = [
  { name: 'Claims', path: '/claims', icon: ClipboardCheck },
  { name: 'Payments', path: '/payments', icon: CreditCard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Operational Expenses', path: '/operational-expenses', icon: Building2 },
  { name: 'Running Costs', path: '/running-costs', icon: TrendingDown },
  { name: 'Employee Costs', path: '/employee-running-costs', icon: Users2 },
  { name: 'Operational Costs', path: '/operational-running-costs', icon: Cog },
  { name: 'Create Invoice', path: '/create-invoice', icon: FilePlus },
  { name: 'Invoice History', path: '/invoice-history', icon: History },
  { name: 'Company Profile', path: '/company-profile', icon: Building2 },
  { name: 'GST', path: '/gst', icon: Percent },
  { name: 'Salaries', path: '/salaries', icon: Wallet },
  { name: 'Client Data', path: '/client-data', icon: Users },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, toggleSidebar, openSettings, isSettingsOpen }) {
  const handleNavClick = () => {
    // Close sidebar on mobile (when it's open as an overlay)
    if (window.innerWidth < 640 && isOpen) {
      toggleSidebar();
    }
  };
  const userRole = localStorage.getItem('userRole') || 'Admin';
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/50 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-dark-700 transform transition-all duration-300 ease-in-out sm:relative sm:z-50 sm:inset-auto flex flex-col h-screen ${isOpen ? 'translate-x-0 w-72' : '-translate-x-[120%] w-72 sm:translate-x-0 sm:w-20'}`}>

        <div className="relative flex items-center justify-center h-20 px-6 border-b border-slate-200 dark:border-dark-700/50 shrink-0">
          <div
            className="flex items-center text-slate-800 dark:text-white overflow-hidden cursor-pointer h-8"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            <img
              src={Logo}
              alt="Learnlike Logo"
              className={`h-8 transition-all duration-300 object-left dark:hidden ${!isOpen ? 'w-8 object-cover' : 'w-auto object-contain'}`}
            />
            <img
              src={LogoDark}
              alt="Learnlike Logo"
              className={`h-8 transition-all duration-300 object-left hidden dark:block ${!isOpen ? 'w-8 object-cover' : 'w-auto object-contain'}`}
            />
          </div>
          <button onClick={toggleSidebar} className={`absolute right-4 sm:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ${!isOpen ? 'hidden' : ''}`}>
            <X size={24} />
          </button>
        </div>

        <nav className={`p-4 space-y-1 flex-1 overflow-y-auto no-scrollbar overflow-x-hidden ${!isOpen ? 'sm:px-3' : ''}`}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap overflow-hidden ${!isOpen ? 'sm:px-0 sm:justify-center' : ''} ${isActive && !isSettingsOpen
                  ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
              title={!isOpen ? item.name : ''}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`truncate transition-opacity duration-300 ${!isOpen ? 'sm:opacity-0 sm:hidden' : 'opacity-100'}`}>{item.name}</span>
            </NavLink>
          ))}




          <div className="py-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-dark-700/50"></div>
            </div>
            <div className={`relative flex justify-center ${!isOpen ? 'sm:hidden' : ''}`}>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden ${!isOpen ? 'sm:px-0 sm:justify-center' : ''} ${isSettingsOpen
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                title={!isOpen ? item.name : ''}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${!isOpen ? 'sm:opacity-0 sm:hidden' : 'opacity-100'}`}>{item.name}</span>
              </button>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden ${!isOpen ? 'sm:px-0 sm:justify-center' : ''} ${isActive && !isSettingsOpen
                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
                title={!isOpen ? item.name : ''}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={`truncate transition-opacity duration-300 ${!isOpen ? 'sm:opacity-0 sm:hidden' : 'opacity-100'}`}>{item.name}</span>
              </NavLink>
            )
          ))}



        </nav>

        {/* Powered by Footer */}
        <div className={`p-4 border-t border-slate-200 dark:border-dark-700/50 flex flex-col items-center justify-center shrink-0 transition-opacity duration-300 ${!isOpen ? 'sm:opacity-0 sm:hidden' : 'opacity-100'}`}>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-1">Powered by</span>
          <img src={Logo} alt="Learnlike Logo" className="h-6 w-auto object-contain dark:hidden" />
          <img src={LogoDark} alt="Learnlike Logo" className="h-6 w-auto object-contain hidden dark:block" />
        </div>

      </aside>
    </>
  );
}
