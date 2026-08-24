import { useEffect, useState } from 'react';
import {
  Plus,
  FolderKanban,
  FolderCheck,
  Calendar,
  ArrowRight,
  X,
  Trash2,
  Search,
  Loader2,
} from 'lucide-react';

const API_URL =
  'http://localhost/account-management-system/backend/api/projects/index.php';

export default function Projects() {
  const [projectsList, setProjectsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectData, setEditProjectData] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [newProject, setNewProject] = useState({
    title: '',
    client_name: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'planning',
  });


  // =========================================================
  // GET - Load projects from MySQL
  // =========================================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(data.message || 'Invalid server response');
      }

      setProjectsList(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };


  // Load projects when page opens
  useEffect(() => {
    fetchProjects();
  }, []);


  // =========================================================
  // POST - Create project
  // =========================================================

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) {
      alert('Project title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newProject.title.trim(),
          client_name: newProject.client_name.trim(),
          budget: newProject.budget || null,
          start_date: newProject.start_date || null,
          end_date: newProject.end_date || null,
          status: newProject.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      // Add returned project to UI
      if (data.project) {
        setProjectsList((prev) => [data.project, ...prev]);
      } else {
        await fetchProjects();
      }

      setNewProject({
        title: '',
        client_name: '',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'planning',
      });

      setIsNewProjectModalOpen(false);

      alert('Project created successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // PUT - Update project
  // =========================================================

  const handleSaveProject = async () => {
    if (!editProjectData?.title?.trim()) {
      alert('Project title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const response = await fetch(
        `${API_URL}?id=${editProjectData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: editProjectData.title.trim(),
            client_name: editProjectData.client_name || '',
            budget:
              editProjectData.budget === ''
                ? null
                : editProjectData.budget,
            start_date: editProjectData.start_date || null,
            end_date: editProjectData.end_date || null,
            status: editProjectData.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update project');
      }

      const updatedProject = data.project;

      if (updatedProject) {
        setProjectsList((prev) =>
          prev.map((project) =>
            project.id === updatedProject.id
              ? updatedProject
              : project
          )
        );

        setSelectedProject(updatedProject);
      } else {
        await fetchProjects();
      }

      setIsEditingProject(false);

      alert('Project updated successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // DELETE - Delete project
  // =========================================================

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      setSaving(true);
      setError('');

      const response = await fetch(
        `${API_URL}?id=${deleteConfirmId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete project');
      }

      setProjectsList((prev) =>
        prev.filter(
          (project) => project.id !== deleteConfirmId
        )
      );

      if (
        selectedProject &&
        Number(selectedProject.id) === Number(deleteConfirmId)
      ) {
        setSelectedProject(null);
      }

      setDeleteConfirmId(null);

      alert('Project deleted successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete project');
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // Search
  // =========================================================

  const filteredProjects = projectsList.filter((project) => {
    const search = searchTerm.toLowerCase();

    return (
      project.title?.toLowerCase().includes(search) ||
      project.client_name?.toLowerCase().includes(search) ||
      project.status?.toLowerCase().includes(search)
    );
  });


  // =========================================================
  // Format status
  // =========================================================

  const formatStatus = (status) => {
    if (status === 'in-progress') {
      return 'In Progress';
    }

    if (status === 'planning') {
      return 'Planning';
    }

    if (status === 'completed') {
      return 'Completed';
    }

    return status;
  };


  // =========================================================
  // Format date
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return 'Not set';
    }

    const dateObj = new Date(date);

    if (Number.isNaN(dateObj.getTime())) {
      return date;
    }

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };


  // =========================================================
  // Format money
  // =========================================================

  const formatMoney = (amount) => {
    if (amount === null || amount === undefined || amount === '') {
      return '₹0';
    }

    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };


  // =========================================================
  // Open project details
  // =========================================================

  const openProject = (project) => {
    setSelectedProject(project);
    setEditProjectData({
      ...project,
    });
    setIsEditingProject(false);
  };


  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={35}
            className="animate-spin text-violet-600"
          />

          <p className="text-sm text-slate-500">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6 pb-8">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Project Accounts
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage final year, mini projects, and client developments.
          </p>
        </div>


        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>

      </div>


      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}


      {/* =====================================================
          SEARCH
      ====================================================== */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />

      </div>


      {/* =====================================================
          PROJECT COUNT
      ====================================================== */}

      <div className="text-sm text-slate-500 dark:text-slate-400">
        {filteredProjects.length} project
        {filteredProjects.length !== 1 ? 's' : ''}
      </div>


      {/* =====================================================
          PROJECT CARDS
      ====================================================== */}

      {filteredProjects.length === 0 ? (

        <div className="glass-card p-12 text-center">

          <FolderKanban
            size={50}
            className="mx-auto text-slate-300 mb-4"
          />

          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No projects found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Create your first project using the New Project button.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {filteredProjects.map((project) => {

            const isCompleted =
              project.status === 'completed';

            return (
              <div
                key={project.id}
                className="glass-card p-6 flex flex-col hover:shadow-lg transition-shadow duration-300"
              >

                {/* TOP */}

                <div className="flex justify-between items-center mb-4">

                  <div
                    className={`p-3 rounded-xl ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'
                        : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600'
                    }`}
                  >
                    {isCompleted ? (
                      <FolderCheck size={24} />
                    ) : (
                      <FolderKanban size={24} />
                    )}
                  </div>


                  <div className="flex items-center gap-2">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}
                    >
                      {formatStatus(project.status)}
                    </span>


                    <button
                      onClick={() =>
                        setDeleteConfirmId(project.id)
                      }
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                </div>


                {/* TITLE */}

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {project.title}
                </h3>


                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {project.client_name || 'No client'}
                </p>


                {/* PROJECT DETAILS */}

                <div className="space-y-3 mb-6 flex-1">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      Total Budget
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatMoney(project.budget)}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      Start Date
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(project.start_date)}
                    </span>

                  </div>


                  <div className="flex justify-between text-sm">

                    <span className="text-slate-500 dark:text-slate-400">
                      End Date
                    </span>

                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatDate(project.end_date)}
                    </span>

                  </div>

                </div>


                {/* BOTTOM */}

                <div className="pt-4 border-t border-slate-200 dark:border-dark-700 flex justify-between items-center">

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">

                    <Calendar size={14} />

                    <span>
                      {formatDate(project.end_date)}
                    </span>

                  </div>


                  <button
                    onClick={() => openProject(project)}
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1"
                  >
                    Details
                    <ArrowRight size={14} />
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}


      {/* =====================================================
          CREATE PROJECT MODAL
      ====================================================== */}

      {isNewProjectModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

            {/* HEADER */}

            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">

              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Create New Project
              </h2>

              <button
                onClick={() =>
                  setIsNewProjectModalOpen(false)
                }
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>

            </div>


            {/* FORM */}

            <div className="p-6 space-y-4">

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter project title"
                />

              </div>


              {/* CLIENT */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Client Name
                </label>

                <input
                  type="text"
                  className="input-field"
                  value={newProject.client_name}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      client_name: e.target.value,
                    })
                  }
                  placeholder="Enter client name"
                />

              </div>


              {/* BUDGET */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Budget
                </label>

                <input
                  type="number"
                  className="input-field"
                  value={newProject.budget}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      budget: e.target.value,
                    })
                  }
                  placeholder="25000"
                />

              </div>


              {/* DATES */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    className="input-field"
                    value={newProject.start_date}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        start_date: e.target.value,
                      })
                    }
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    End Date
                  </label>

                  <input
                    type="date"
                    className="input-field"
                    value={newProject.end_date}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        end_date: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              {/* STATUS */}

              <div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>

                <select
                  className="input-field"
                  value={newProject.status}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="planning">
                    Planning
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>


              {/* BUTTON */}

              <button
                onClick={handleCreateProject}
                disabled={saving}
                className="btn-primary w-full mt-2 py-2.5 flex items-center justify-center gap-2"
              >

                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? 'Saving...'
                  : 'Save Project'}

              </button>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          DETAILS / EDIT MODAL
      ====================================================== */}

      {selectedProject && editProjectData && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

            {/* HEADER */}

            <div className="p-5 border-b border-slate-100 dark:border-dark-800 flex justify-between items-center">

              <h2 className="text-lg font-bold text-slate-800 dark:text-white">

                {isEditingProject
                  ? 'Edit Project'
                  : 'Project Details'}

              </h2>


              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsEditingProject(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>

            </div>


            {/* CONTENT */}

            <div className="p-6">

              {/* TITLE */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Project Title
                </label>

                {isEditingProject ? (

                  <input
                    type="text"
                    className="input-field"
                    value={editProjectData.title || ''}
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        title: e.target.value,
                      })
                    }
                  />

                ) : (

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedProject.title}
                  </h3>

                )}

              </div>


              {/* CLIENT */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Client Name
                </label>

                {isEditingProject ? (

                  <input
                    type="text"
                    className="input-field"
                    value={
                      editProjectData.client_name || ''
                    }
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        client_name: e.target.value,
                      })
                    }
                  />

                ) : (

                  <p className="text-slate-800 dark:text-white">
                    {selectedProject.client_name ||
                      'No client'}
                  </p>

                )}

              </div>


              {/* BUDGET */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Budget
                </label>

                {isEditingProject ? (

                  <input
                    type="number"
                    className="input-field"
                    value={editProjectData.budget || ''}
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        budget: e.target.value,
                      })
                    }
                  />

                ) : (

                  <p className="font-semibold text-slate-900 dark:text-white">
                    {formatMoney(selectedProject.budget)}
                  </p>

                )}

              </div>


              {/* START DATE */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Start Date
                </label>

                {isEditingProject ? (

                  <input
                    type="date"
                    className="input-field"
                    value={
                      editProjectData.start_date || ''
                    }
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        start_date: e.target.value,
                      })
                    }
                  />

                ) : (

                  <p className="text-slate-800 dark:text-white">
                    {formatDate(
                      selectedProject.start_date
                    )}
                  </p>

                )}

              </div>


              {/* END DATE */}

              <div className="mb-4">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  End Date
                </label>

                {isEditingProject ? (

                  <input
                    type="date"
                    className="input-field"
                    value={
                      editProjectData.end_date || ''
                    }
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        end_date: e.target.value,
                      })
                    }
                  />

                ) : (

                  <p className="text-slate-800 dark:text-white">
                    {formatDate(
                      selectedProject.end_date
                    )}
                  </p>

                )}

              </div>


              {/* STATUS */}

              <div className="mb-6">

                <label className="block text-sm font-medium text-slate-500 mb-1">
                  Status
                </label>

                {isEditingProject ? (

                  <select
                    className="input-field"
                    value={
                      editProjectData.status ||
                      'planning'
                    }
                    onChange={(e) =>
                      setEditProjectData({
                        ...editProjectData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="planning">
                      Planning
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>

                ) : (

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatStatus(
                      selectedProject.status
                    )}
                  </span>

                )}

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3">

                {isEditingProject ? (

                  <>

                    <button
                      onClick={() => {
                        setIsEditingProject(false);
                        setEditProjectData({
                          ...selectedProject,
                        });
                      }}
                      disabled={saving}
                      className="btn-secondary flex-1 py-2.5"
                    >
                      Cancel
                    </button>


                    <button
                      onClick={handleSaveProject}
                      disabled={saving}
                      className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2"
                    >

                      {saving && (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      )}

                      {saving
                        ? 'Saving...'
                        : 'Save Changes'}

                    </button>

                  </>

                ) : (

                  <>

                    <button
                      onClick={() =>
                        setDeleteConfirmId(
                          selectedProject.id
                        )
                      }
                      className="btn-secondary flex-1 py-2.5 text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </button>


                    <button
                      onClick={() =>
                        setIsEditingProject(true)
                      }
                      className="btn-primary flex-1 py-2.5"
                    >
                      Edit Project
                    </button>

                  </>

                )}

              </div>

            </div>

          </div>

        </div>
      )}


      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {deleteConfirmId && (

        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">

          <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">

            <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400">

              <Trash2 size={32} />

            </div>


            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Delete Project?
            </h3>


            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this project?
              This action cannot be undone.
            </p>


            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirmId(null)
                }
                disabled={saving}
                className="flex-1 btn-secondary py-2.5"
              >
                Cancel
              </button>


              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 btn-primary bg-violet-600 hover:bg-violet-700 py-2.5 border-0 flex items-center justify-center gap-2"
              >

                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? 'Deleting...'
                  : 'Yes, Delete'}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}