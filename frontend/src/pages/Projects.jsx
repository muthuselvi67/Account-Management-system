import { useState, useEffect } from 'react';
import { Search, Plus, FolderKanban, FolderCheck, Users, Calendar, ArrowRight, X } from 'lucide-react';

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);
  const [newProject, setNewProject] = useState({ title: '', client: '', cost: '', deadline: '' });

  const initialProjects = [
    { id: 'PRJ-01', title: 'E-commerce App', type: 'Final Year', client: 'NIT Students', cost: '₹25,000', advance: '₹10,000', balance: '₹15,000', status: 'Ongoing', deadline: 'Aug 15, 2026' },
    { id: 'PRJ-02', title: 'Hospital Management', type: 'Mini Project', client: 'BCA Group', cost: '₹10,000', advance: '₹10,000', balance: '₹0', status: 'Completed', deadline: 'Jul 10, 2026' },
    { id: 'PRJ-03', title: 'Corporate Website', type: 'Client', client: 'TechCorp Ltd', cost: '₹80,000', advance: '₹40,000', balance: '₹40,000', status: 'Ongoing', deadline: 'Sep 01, 2026' },
  ];

  const [projectsList, setProjectsList] = useState(() => {
    const saved = localStorage.getItem('projectsList');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  useEffect(() => {
    localStorage.setItem('projectsList', JSON.stringify(projectsList));
  }, [projectsList]);

  const handleSaveProject = () => {
    setProjectsList(projectsList.map(p => p.id === editProjectData.id ? editProjectData : p));
    setSelectedProject(editProjectData);
    setIsEditingProject(false);
  };

  const handleCreateProject = () => {
    if (!newProject.title) return;
    
    let formattedDate = newProject.deadline;
    if (formattedDate) {
      const dateObj = new Date(formattedDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      }
    } else {
      formattedDate = 'Pending';
    }

    const costStr = newProject.cost ? (newProject.cost.toString().startsWith('₹') ? newProject.cost : `₹${newProject.cost}`) : '₹0';

    const newPrj = {
      id: `PRJ-0${projectsList.length + 1}`,
      title: newProject.title,
      type: 'Client',
      client: newProject.client || 'Unknown Client',
      cost: costStr,
      advance: '₹0',
      balance: costStr,
      status: 'Ongoing',
      deadline: formattedDate
    };
    
    setProjectsList([...projectsList, newPrj]);
    setNewProject({ title: '', client: '', cost: '', deadline: '' });
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Accounts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage final year, mini projects, and client developments.</p>
        </div>
        <button onClick={() => setIsNewProjectModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {projectsList.map((project, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className={`p-3 rounded-xl ${
                project.status === 'Completed'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'
                  : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600'
              }`}>
                {project.status === 'Completed' ? <FolderCheck size={24} /> : <FolderKanban size={24} />}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'Completed' 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              }`}>
                {project.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{project.type} • {project.client}</p>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Total Cost</span>
                <span className="font-semibold text-slate-900 dark:text-white">{project.cost}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Advance Paid</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{project.advance}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Balance Due</span>
                <span className={`font-semibold ${project.balance === '₹0' ? 'text-slate-400' : 'text-red-500'}`}>{project.balance}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-dark-700 flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Calendar size={14} />
                <span>{project.deadline}</span>
              </div>
              <button onClick={() => {
                setSelectedProject(project);
                setEditProjectData(project);
                setIsEditingProject(false);
              }} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1">
                Details <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Create New Project</h2>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
                <input type="text" className="input-field" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                <input type="text" className="input-field" value={newProject.client} onChange={(e) => setNewProject({ ...newProject, client: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Cost</label>
                  <input type="text" className="input-field" value={newProject.cost} onChange={(e) => setNewProject({ ...newProject, cost: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deadline</label>
                  <input type="date" className="input-field text-slate-500" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} />
                </div>
              </div>
              <button onClick={handleCreateProject} className="btn-primary w-full mt-2 py-2.5">Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Details/Edit Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {isEditingProject ? 'Edit Project' : 'Project Details'}
              </h2>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isEditingProject ? (
                    <input type="text" className="input-field py-1 px-2 text-lg font-bold" value={editProjectData.title} onChange={(e) => setEditProjectData({...editProjectData, title: e.target.value})} />
                  ) : (
                    selectedProject.title
                  )}
                </h3>
                {!isEditingProject && (
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedProject.status === 'Completed' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                  }`}>
                    {selectedProject.status}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mb-6">{selectedProject.type} • {selectedProject.client}</p>
              
              <div className="bg-slate-50 dark:bg-dark-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-dark-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Cost</span>
                  {isEditingProject ? (
                    <input type="text" className="input-field max-w-[120px] py-1 px-2 text-right text-sm" value={editProjectData.cost} onChange={(e) => setEditProjectData({...editProjectData, cost: e.target.value})} />
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.cost}</span>
                  )}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-dark-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Advance Paid</span>
                  {isEditingProject ? (
                    <input type="text" className="input-field max-w-[120px] py-1 px-2 text-right text-sm" value={editProjectData.advance} onChange={(e) => setEditProjectData({...editProjectData, advance: e.target.value})} />
                  ) : (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedProject.advance}</span>
                  )}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-dark-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Balance Due</span>
                  {isEditingProject ? (
                    <input type="text" className="input-field max-w-[120px] py-1 px-2 text-right text-sm" value={editProjectData.balance} onChange={(e) => setEditProjectData({...editProjectData, balance: e.target.value})} />
                  ) : (
                    <span className={`font-semibold ${selectedProject.balance === '₹0' ? 'text-slate-400' : 'text-red-500'}`}>{selectedProject.balance}</span>
                  )}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-dark-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                  {isEditingProject ? (
                    <select className="input-field max-w-[120px] py-1 px-2 text-sm" value={editProjectData.status} onChange={(e) => setEditProjectData({...editProjectData, status: e.target.value})}>
                      <option>Ongoing</option>
                      <option>Completed</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.status}</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Deadline</span>
                  {isEditingProject ? (
                    <input type="text" className="input-field max-w-[150px] py-1 px-2 text-right text-sm font-semibold text-slate-900 dark:text-white" value={editProjectData.deadline} onChange={(e) => setEditProjectData({...editProjectData, deadline: e.target.value})} />
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.deadline}</span>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                {isEditingProject ? (
                  <>
                    <button onClick={() => setIsEditingProject(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                    <button onClick={handleSaveProject} className="btn-primary flex-1 py-2.5">Save Changes</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setSelectedProject(null)} className="btn-secondary flex-1 py-2.5">Close</button>
                    <button onClick={() => setIsEditingProject(true)} className="btn-primary flex-1 py-2.5">Edit Project</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
