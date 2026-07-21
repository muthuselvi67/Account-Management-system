import { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit2, Trash2, FileText, Download, RefreshCw, UserX, UserCheck, User, Mail, Building, Briefcase, Shield, Calendar, DollarSign, Phone, Check, X } from 'lucide-react';

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    email: '',
    department: '',
    position: '',
    role: '',
    joined: '',
    salary: '',
    phone: '',
    status: 'Active'
  });

  // Initialize with local storage or empty list
  const [employeesList, setEmployeesList] = useState(() => {
    const saved = localStorage.getItem('employeesList');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Save to local storage whenever employeesList changes
  useEffect(() => {
    localStorage.setItem('employeesList', JSON.stringify(employeesList));
  }, [employeesList]);

  const handleDelete = (id) => {
    setEmployeesList(employeesList.map(emp => {
      if (emp.id === id) {
        return { ...emp, status: emp.status === 'Inactive' ? 'Active' : 'Inactive' };
      }
      return emp;
    }));
  };

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) return;

    let formattedDate = newEmployee.joined;
    if (formattedDate) {
      // Check if it's already in the 'Jan 15, 2026' format to prevent re-formatting if unmodified during edit
      if (formattedDate.includes(',')) {
        // Keep as is
      } else {
        const dateObj = new Date(formattedDate);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
      }
    } else {
      formattedDate = 'Pending';
    }

    if (editingEmployeeId) {
      setEmployeesList(employeesList.map(emp => {
        if (emp.id === editingEmployeeId) {
          return {
            ...emp,
            id: newEmployee.id || emp.id,
            name: newEmployee.name,
            email: newEmployee.email || emp.email,
            department: newEmployee.department,
            position: newEmployee.position || emp.position,
            role: newEmployee.role || emp.role,
            joined: formattedDate !== 'Pending' ? formattedDate : emp.joined,
            salary: newEmployee.salary ? (newEmployee.salary.toString().startsWith('₹') ? newEmployee.salary : `₹${newEmployee.salary}`) : '₹0'
          };
        }
        return emp;
      }));
    } else {
      const newEmp = {
        id: newEmployee.id || `EMP${String(Math.floor(Math.random() * 900) + 100)}`,
        name: newEmployee.name,
        email: newEmployee.email || `${newEmployee.name.toLowerCase().replace(/\s+/g, '.')}@learnlike.co.in`,
        department: newEmployee.department,
        position: newEmployee.position || 'Associate',
        role: newEmployee.role || 'EMPLOYEE',
        joined: formattedDate,
        salary: newEmployee.salary ? (newEmployee.salary.toString().startsWith('₹') ? newEmployee.salary : `₹${newEmployee.salary}`) : '₹0',
        status: 'Active'
      };
      setEmployeesList([...employeesList, newEmp]);

      // Reset filters so the new employee is visible
      setSearchTerm('');
      setDepartmentFilter('all');
      setStatusFilter('all');
    }

    setNewEmployee({ id: '', name: '', department: '', joined: '', salary: '' });
    setEditingEmployeeId(null);
    setIsModalOpen(false);
  };

  const handleEditClick = (emp) => {
    setEditingEmployeeId(emp.id);

    let dateVal = '';
    try {
      const d = new Date(emp.joined);
      if (!isNaN(d.getTime())) {
        dateVal = d.toISOString().split('T')[0];
      }
    } catch (e) { }

    setNewEmployee({
      id: emp.id,
      name: emp.name,
      email: emp.email || '',
      department: emp.department,
      position: emp.position || '',
      role: emp.role || '',
      joined: dateVal || emp.joined,
      salary: emp.salary ? emp.salary.replace('₹', '') : (emp.gross ? emp.gross.replace('₹', '') : '')
    });
    setIsModalOpen(true);
  };

  const handleDownload = (emp) => {
    const slipContent = `
=========================================
          EMPLOYEE SALARY SLIP
=========================================
Employee ID  : ${emp.id}
Full Name    : ${emp.name}
Department   : ${emp.department}
Joining Date : ${emp.joined}
-----------------------------------------
Salary       : ${emp.salary || '₹0'}
Status       : ${emp.status}
=========================================
`;
    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${emp.name.replace(/\s+/g, '_')}_Payslip.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nameOrder = [
    "DEEPAK R",
    "SRI HARI R",
    "THIYAGARAJAN P",
    "JAMUNA DEVI G",
    "PADMESH K A",
    "ROSHAN SRIRAM N",
    "RAJA PANDI N",
    "MUTHUSELVI S",
    "THIRUMOORTHI G",
    "MUTHEESWARI A",
    "KAMALA BHARATHI S",
    "PRIYA DHARSHINI S",
    "ROSHINI K",
    "SRI HARI PRASATH A",
    "PRANAV S",
    "AASWIN J S",
    "SRI NATHI S",
    "SUSMITHA S"
  ];

  const filteredEmployees = employeesList.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  }).sort((a, b) => {
    // First priority: Active status
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    
    // Second priority: Exact custom name order requested by user
    const indexA = nameOrder.indexOf(a.name.toUpperCase());
    const indexB = nameOrder.indexOf(b.name.toUpperCase());
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1; // a is in the list, b is not
    if (indexB !== -1) return 1;  // b is in the list, a is not
    
    // Third priority: Joining date (Oldest first)
    const dateA = new Date(a.joined).getTime();
    const dateB = new Date(b.joined).getTime();
    
    if (!isNaN(dateA) && !isNaN(dateB)) {
      if (dateA !== dateB) return dateA - dateB;
    }
    
    // Fourth priority: Employee ID
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    
    return 0;
  });

  return (
    <div className="space-y-4 pb-8">


      {/* Filters and Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto flex-1">
          <div className="relative w-full sm:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <select className="input-field py-2 w-full sm:w-auto" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="all">All Departments</option>
              <option value="Administration">Administration</option>
              <option value="HR">HR</option>
              <option value="Training">Training</option>
              <option value="Development">Development</option>
            </select>
            <select className="input-field py-2 w-full sm:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-dark-800 dark:border-dark-700 dark:text-slate-300 dark:hover:bg-dark-700 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 font-medium text-sm" onClick={() => {
            setSearchTerm('');
            setDepartmentFilter('all');
            setStatusFilter('all');
          }}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button className="btn-primary flex items-center justify-center gap-2" onClick={() => {
            setEditingEmployeeId(null);
            setNewEmployee({ id: '', name: '', email: '', department: '', position: '', role: '', joined: '', salary: '' });
            setIsModalOpen(true);
          }}>
            <Plus size={18} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border-t-4 border-t-[#8b5cf6] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-dark-700">
                <th className="px-6 py-4 font-bold">Employee</th>
                <th className="px-6 py-4 font-bold">Employee ID</th>
                <th className="px-6 py-4 font-bold">Department</th>
                <th className="px-6 py-4 font-bold">Position</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase">{emp.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 dark:text-slate-400">{emp.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{emp.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 dark:text-slate-300">{emp.position || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md ${
                        (emp.role || '').toUpperCase() === 'ADMIN' ? 'bg-purple-100 text-[#8b5cf6] dark:bg-purple-900/30 dark:text-purple-400' :
                        ((emp.role || '').toUpperCase() === 'EXECUTIVE' || (emp.role || '').toUpperCase() === 'EXECTIVE') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        (emp.role || '').toUpperCase() === 'HR' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                        (emp.role || '').toUpperCase() === 'EMPLOYEE' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {emp.role || 'NOT SET'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 ${emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-slate-50 text-slate-500 dark:bg-slate-900/20 dark:text-slate-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {emp.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="p-2.5 bg-white border border-indigo-100 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:bg-dark-800 dark:border-dark-700 dark:text-slate-300 dark:hover:bg-dark-700 rounded-xl transition-all duration-200 shadow-sm" title="Edit"
                        >
                          <Edit2 size={18} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className={`p-2.5 text-white rounded-xl transition-all duration-200 shadow-md ${emp.status === 'Inactive' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-[#D34037] hover:bg-red-600 shadow-red-500/20'}`}
                          title={emp.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                        >
                          {emp.status === 'Inactive' ? <UserCheck size={18} strokeWidth={2} /> : <UserX size={18} strokeWidth={2} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-dark-800/50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No employees found</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                        {searchTerm || departmentFilter !== 'all' || statusFilter !== 'all'
                          ? "We couldn't find any employees matching your current search or filters. Try adjusting them."
                          : "Your employee list is currently empty. Get started by adding a new employee."}
                      </p>
                      <button className="btn-primary flex items-center gap-2 mx-auto" onClick={() => {
                        setEditingEmployeeId(null);
                        setNewEmployee({ id: '', name: '', email: '', department: '', position: '', role: '', joined: '', salary: '' });
                        setIsModalOpen(true);
                      }}>
                        <Plus size={18} />
                        <span>Add New Employee</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-dark-800 flex justify-between items-start bg-white dark:bg-zinc-950">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingEmployeeId ? 'Edit Employee Profile' : 'Add New Employee'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {editingEmployeeId ? 'Update the details and roles for this employee.' : 'Fill in the details to register a new employee.'}
                </p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setEditingEmployeeId(null); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-950">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User size={16} className="text-violet-500" />
                    Employee ID
                  </label>
                  <input type="text" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.id} onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User size={16} className="text-violet-500" />
                    Full Name
                  </label>
                  <input type="text" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Mail size={16} className="text-violet-500" />
                    Email Address
                  </label>
                  <input type="email" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Building size={16} className="text-violet-500" />
                    Department
                  </label>
                  <div className="relative">
                    <select className={`w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer ${!newEmployee.department ? 'text-slate-400 dark:text-slate-500' : ''}`} value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}>
                      <option value="" disabled>Select Department</option>
                      <option value="Administration">Administration</option>
                      <option value="HR">HR</option>
                      <option value="Training">Training</option>
                      <option value="Development">Development</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Briefcase size={16} className="text-violet-500" />
                    Position
                  </label>
                  <input type="text" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.position} onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Shield size={16} className="text-violet-500" />
                    System Role
                  </label>
                  <input type="text" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar size={16} className="text-violet-500" />
                    Joining Date
                  </label>
                  <input type="date" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all [&::-webkit-calendar-picker-indicator]:dark:invert" value={newEmployee.joined} onChange={(e) => setNewEmployee({ ...newEmployee, joined: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <DollarSign size={16} className="text-violet-500" />
                    Salary (₹)
                  </label>
                  <input type="text" className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all" value={newEmployee.salary} onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <UserCheck size={16} className="text-violet-500" />
                    Employee Status
                  </label>
                  <div className="relative">
                    <select className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-dark-700 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none cursor-pointer" value={newEmployee.status} onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-slate-100 dark:border-dark-800 flex justify-end gap-4 bg-white dark:bg-zinc-950">
              <button className="px-5 py-2.5 rounded-lg font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors bg-white dark:bg-zinc-900" onClick={() => { setIsModalOpen(false); setEditingEmployeeId(null); }}>
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-lg font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 transition-all flex items-center gap-2" onClick={handleSaveEmployee}>
                <Check size={18} />
                {editingEmployeeId ? 'Save Changes' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
