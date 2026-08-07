import { Menu, ArrowLeft, Search, Sun, Moon, LogOut, User, Settings, Lock, X, Loader2, Upload } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Topbar({ toggleSidebar, openSettings, isDark, toggleTheme }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState({
    email: 'admin@example.com',
    employeeId: 'EMP-0087',
    department: 'Administration',
    position: 'Chief Executive Officer'
  });
  const [editingData, setEditingData] = useState(profileData);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'Overview Dashboard', subtitle: 'Welcome back to your dashboard' };
      case '/students':
        return { title: 'Students', subtitle: 'Manage student records and details' };
      case '/employees':
        return { title: 'Employee Management', subtitle: 'Manage employee records, roles, and salary details' };
      case '/projects':
        return { title: 'Projects Dashboard', subtitle: 'Manage final year, mini projects, and client developments' };
      case '/calendar':
        return { title: 'Holiday Calendar', subtitle: 'View upcoming holidays and events' };
      case '/payments':
        return { title: 'Payments', subtitle: 'Track and manage incoming payments' };
      case '/expenses':
        return { title: 'Expenses', subtitle: 'Monitor and record company expenses' };
      case '/salaries':
        return { title: 'Salaries', subtitle: 'Manage employee payroll and salaries' };
      case '/invoices':
        return { title: 'Invoices', subtitle: 'Generate and manage client invoices' };
      case '/reports':
        return { title: 'Reports', subtitle: 'View financial and operational reports' };
      case '/users':
        return { title: 'Users', subtitle: 'Manage system users and access permissions' };
      case '/hr/registration':
        return { title: 'Employee Registration', subtitle: 'Register and onboard new employees' };
      case '/hr/attendance':
        return { title: 'Attendance Management', subtitle: 'Track employee attendance and working hours' };
      case '/hr/leaves':
        return { title: 'Leave Management', subtitle: 'Review and approve employee leave requests' };
      case '/hr/recruitment':
        return { title: 'Recruitment', subtitle: 'Manage job postings and candidates' };
      case '/hr/documents':
        return { title: 'Employee Documents', subtitle: 'Securely store and manage employee records' };
      case '/hr/performance':
        return { title: 'Performance Reviews', subtitle: 'Evaluate and track employee performance' };
      case '/vendor-pos':
        return { title: 'Vendor POs', subtitle: 'Track and manage purchase orders issued to vendors' };
      default: {
        const path = location.pathname.split('/').pop();
        if (path) {
          const title = path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          return { title: title || 'Dashboard', subtitle: 'Overview of records and management' };
        }
        return { title: 'Dashboard', subtitle: 'Overview of records and management' };
      }
    }
  };

  const { title, subtitle } = getPageInfo();

  const userRole = localStorage.getItem('userRole') || 'Admin';

  // Close profile dropdown when clicking outside (simple implementation by closing on scroll/click can be added, but this covers basic toggle)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-slate-200 dark:border-dark-700 px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="hidden sm:block">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={17} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:text-amber-400 dark:hover:bg-dark-800 rounded-xl transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center pl-4 border-l border-slate-200 dark:border-dark-700">
            <div className="relative profile-dropdown-container flex items-center">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight uppercase">
                    Admin
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-dark-700 overflow-hidden animate-fade-in z-50">
                  <div className="p-5 flex items-center gap-3 border-b border-slate-100 dark:border-dark-800">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white uppercase leading-tight">
                        Admin
                      </p>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setIsEditingProfile(false);
                        setIsProfileOpen(false);
                        setEditingData(profileData);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition-colors"
                    >
                      <User size={18} className="text-slate-400" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => { openSettings(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition-colors"
                    >
                      <Settings size={18} className="text-slate-400" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => { openSettings(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-800 rounded-xl transition-colors"
                    >
                      <Lock size={18} className="text-slate-400" />
                      <span>Change Password</span>
                    </button>
                  </div>

                  <div className="p-2 border-t border-slate-100 dark:border-dark-800">
                    <button
                      onClick={() => {
                        localStorage.removeItem('userRole');
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userRole');
                navigate('/login');
              }}
              className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Profile Modal Overlay */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-dark-800">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full shadow-md bg-slate-100 dark:bg-dark-800 border-[3px] border-white dark:border-zinc-950 flex items-center justify-center text-slate-400">
                  <User size={48} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Admin
              </h3>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left">
                <div className="bg-slate-50 dark:bg-dark-800/50 p-4 rounded-xl border border-slate-100 dark:border-dark-700/50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</p>
                  {isEditingProfile ? (
                    <input type="email" value={editingData.email} onChange={(e) => setEditingData({ ...editingData, email: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{profileData.email}</p>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-dark-800/50 p-4 rounded-xl border border-slate-100 dark:border-dark-700/50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Employee ID</p>
                  {isEditingProfile ? (
                    <input type="text" value={editingData.employeeId} onChange={(e) => setEditingData({ ...editingData, employeeId: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.employeeId}</p>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-dark-800/50 p-4 rounded-xl border border-slate-100 dark:border-dark-700/50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Department</p>
                  {isEditingProfile ? (
                    <input type="text" value={editingData.department} onChange={(e) => setEditingData({ ...editingData, department: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.department}</p>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-dark-800/50 p-4 rounded-xl border border-slate-100 dark:border-dark-700/50">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Position</p>
                  {isEditingProfile ? (
                    <input type="text" value={editingData.position} onChange={(e) => setEditingData({ ...editingData, position: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-1.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow" />
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.position}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 dark:bg-dark-800/30 flex justify-end gap-3">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditingData(profileData);
                    }}
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl font-semibold transition-colors text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-dark-700"
                  >
                    Cancel
                  </button>
                    <button
                      onClick={() => {
                        setIsSavingProfile(true);
                        setTimeout(() => {
                          setProfileData(editingData);
                          if (customAvatar) {
                            localStorage.setItem(`avatar_${userRole}`, customAvatar);
                          }
                          setIsSavingProfile(false);
                          setIsEditingProfile(false);
                        }, 1000);
                      }}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-violet-500/30"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Profile</span>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingData(profileData);
                    setIsEditingProfile(true);
                  }}
                  className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-violet-500/30"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
