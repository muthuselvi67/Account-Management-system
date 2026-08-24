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
    email: '',
    employeeId: '',
    department: '',
    position: '',
    avatar: ''
  });
  const [editingData, setEditingData] = useState(profileData);
  const [isFetchingProfile, setIsFetchingProfile] = useState(false);
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (showProfileModal) {
      setIsFetchingProfile(true);
      fetch('http://localhost/LEARNLIKE/account management system/backend/api/users/profile.php')
        .then(res => res.json())
        .then(data => {
          if (!data.message) {
            setProfileData(data);
            setEditingData(data);
          }
        })
        .catch(console.error)
        .finally(() => setIsFetchingProfile(false));
    }
  }, [showProfileModal]);

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
      case '/create-invoice':
        return { title: 'Create Invoice', subtitle: 'Generate and send a new invoice to a client' };
      case '/invoice-history':
        return { title: 'Invoice History', subtitle: 'View and manage previously generated invoices' };
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
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            title="Go Back"
          >
            <ArrowLeft size={24} />
          </button>
          
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
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-slate-500 flex-shrink-0 overflow-hidden">
                  {profileData.avatar ? (
                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
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
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-slate-500 flex-shrink-0 overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} />
                      )}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-950 rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-white/20 dark:border-white/5 transform transition-all animate-in zoom-in-95 duration-300">
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-r from-violet-500 to-fuchsia-500">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 pt-0 flex flex-col items-center relative">
              {/* Avatar overlapping header */}
              <div className="relative -mt-16 mb-4 group">
                <div className="w-32 h-32 rounded-full shadow-xl bg-white dark:bg-zinc-900 border-4 border-white dark:border-zinc-950 flex items-center justify-center text-violet-500 overflow-hidden relative">
                  {(isEditingProfile ? editingData.avatar : profileData.avatar) ? (
                    <img 
                      src={isEditingProfile ? editingData.avatar : profileData.avatar} 
                      alt="Profile Avatar" 
                      className={`w-full h-full object-cover transition-all ${isEditingProfile ? 'group-hover:brightness-75' : ''}`} 
                    />
                  ) : (
                    <User size={64} className={`opacity-80 transition-all ${isEditingProfile ? 'group-hover:opacity-40' : ''}`} />
                  )}
                  
                  {isEditingProfile && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Admin
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 mb-8">
                {profileData.position || 'Chief Executive Officer'}
              </p>

              {isFetchingProfile ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-violet-500 mb-4" />
                  <p className="text-sm text-slate-500">Loading profile...</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                  <div className="group bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <User size={12} /> Email Address
                    </p>
                    {isEditingProfile ? (
                      <input type="email" value={editingData.email} onChange={(e) => setEditingData({ ...editingData, email: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-shadow" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{profileData.email}</p>
                    )}
                  </div>
                  
                  <div className="group bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Settings size={12} /> Employee ID
                    </p>
                    {isEditingProfile ? (
                      <input type="text" value={editingData.employeeId} onChange={(e) => setEditingData({ ...editingData, employeeId: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-shadow" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.employeeId}</p>
                    )}
                  </div>
                  
                  <div className="group bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Lock size={12} /> Department
                    </p>
                    {isEditingProfile ? (
                      <input type="text" value={editingData.department} onChange={(e) => setEditingData({ ...editingData, department: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-shadow" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.department}</p>
                    )}
                  </div>
                  
                  <div className="group bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Upload size={12} /> Position
                    </p>
                    {isEditingProfile ? (
                      <input type="text" value={editingData.position} onChange={(e) => setEditingData({ ...editingData, position: e.target.value })} className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-shadow" />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{profileData.position}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-sm border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 rounded-b-[2rem]">
              {isEditingProfile ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditingProfile(false);
                      setEditingData(profileData);
                    }}
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl font-semibold transition-colors text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsSavingProfile(true);
                      fetch('http://localhost/LEARNLIKE/account management system/backend/api/users/profile.php', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editingData)
                      })
                      .then(() => {
                        setProfileData(editingData);
                        setIsSavingProfile(false);
                        setIsEditingProfile(false);
                      })
                      .catch(err => {
                        console.error(err);
                        setIsSavingProfile(false);
                      });
                    }}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditingData(profileData);
                    setIsEditingProfile(true);
                  }}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
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
