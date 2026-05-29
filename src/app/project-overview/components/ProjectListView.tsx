'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface Project {
  id: string;
  name: string;
  status: 'in-progress' | 'on-hold' | 'completed' | 'planning';
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
  budget: string;
  team: number;
  priority: 'High' | 'Medium' | 'Low';
  projectType?: 'normal' | 'budget';
  totalTasks?: number;
  completedTasks?: number;
}

interface ProjectListViewProps {
  projects?: Project[];
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  onExport?: (filters: { search: string; status: string }) => void;
  currentRole?: 'Admin' | 'Manager' | 'Associate';
}

const ProjectListView = ({
  projects: propProjects,
  onEdit,
  onDelete,
  onExport,
  currentRole = 'Manager',
}: ProjectListViewProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'status' | 'progress' | 'endDate'>('id');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0); // Total number of projects
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const pageSize = 10;

  const fetchProjects = async (search = '', page = 0, size = 10, sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const response = await fetch(`${API_ENDPOINTS.projects.list()}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Log the API response for debugging
        if (data.content && Array.isArray(data.content)) {
          const formattedProjects = data.content.map((project: any) => {
            console.log('Project Data:', project); // Log each project for debugging
            return {
              id: project.id,
              name: project.name,
              status: project.status ? project.status.replace('_', '-').toLowerCase() : 'unknown', // Normalize status to match statusConfig keys
              progress: project.progressPercentage || 0,
              startDate: project.startDate || '',
              endDate: project.endDate || '',
              owner: project.projectManagerName || 'Unknown', // Map projectManagerName to owner
              budget: project.budget || '0',
              priority: project.priority || 'Low',
              projectType: project.type || 'normal', // Map type to projectType
              totalTasks: project.totalTasks || 0,
              completedTasks: project.completedTasks || 0,
            };
          });
          setProjects(formattedProjects); // Replace the current list of projects with the new data
          setTotalElements(data.totalElements); // Update total elements
          setTotalPages(data.totalPages); // Update total pages
        } else {
          console.error('Unexpected response format:', data);
        }
      } else {
        console.error('Failed to fetch projects:', response.status);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    setCurrentPage(0); // Reset to first page on search or filter change
    fetchProjects(searchQuery, 0, pageSize, 'id,desc');
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchProjects(searchQuery, currentPage, pageSize, 'id,desc');
  }, [currentPage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProjects(searchQuery, currentPage, pageSize, 'id,desc');
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [searchQuery, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const statusConfig = {
    'in-progress': {
      label: 'In Progress',
      color: 'bg-primary text-primary-foreground',
      icon: 'PlayIcon',
    },
    'on-hold': { label: 'On Hold', color: 'bg-warning text-warning-foreground', icon: 'PauseIcon' },
    completed: {
      label: 'Completed',
      color: 'bg-success text-success-foreground',
      icon: 'CheckCircleIcon',
    },
    planning: {
      label: 'Planning',
      color: 'bg-info text-info-foreground',
      icon: 'ClipboardDocumentListIcon',
    },
  };

  const priorityConfig = {
    High: 'text-error',
    Medium: 'text-warning',
    Low: 'text-success',
  };

  // Ensure `propProjects` is defined before filtering.
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.owner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'id') return parseInt(b.id) - parseInt(a.id); // Sort by ID descending (newest first)
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'progress') return b.progress - a.progress;
      if (sortBy === 'endDate')
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      return 0;
    });

  console.log('Filtered Projects:', filteredProjects); // Log filtered projects for debugging

  const paginatedProjects = filteredProjects; // Display all projects without slicing for pagination

  const handleEdit = (projectId: string) => {
    if (onEdit) {
      onEdit(projectId);
    } else {
      console.log('Edit project:', projectId);
    }
  };

  const handleDelete = (projectId: string) => {
    if (onDelete) {
      onDelete(projectId);
    } else {
      console.log('Delete project:', projectId);
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-muted/30 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={18}
              variant="outline"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-[220px] bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="planning">Planning</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary hidden sm:block"
          >
            <option value="id">Recently Created</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
            <option value="progress">Sort by Progress</option>
            <option value="endDate">Sort by End Date</option>
          </select>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            disabled={currentRole === 'Associate'}
            className={`flex items-center gap-2 px-4 py-2 border border-border rounded-md transition-smooth ${
              currentRole === 'Associate'
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'bg-background text-muted-foreground hover:text-foreground hover:border-primary'
            }`}
            onClick={() => {
              if (onExport) {
                onExport({
                  search: searchQuery,
                  status: filterStatus === 'all' ? '' : filterStatus,
                });
              } else if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-export-modal'));
              }
            }}
          >
            <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
            <span className="font-caption text-sm hidden sm:inline">Export</span>
          </button>
          <button
            disabled={currentRole === 'Associate'}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-smooth ${
              currentRole === 'Associate'
                ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90'
            }`}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-project-modal'));
              }
            }}
          >
            <Icon name="PlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>

      {/* Table - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Project Name
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Type
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Project Manager
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Budget
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Priority
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Progress
                </span>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Timeline
                </span>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedProjects.map((project, index) => {
              const statusInfo = statusConfig[project.status] || {
                label: 'Unknown',
                color: 'bg-muted text-muted-foreground',
                icon: 'QuestionMarkCircleIcon',
              };
              return (
                <tr key={`${project.id}-${index}`} className="hover:bg-muted/30 transition-smooth">
                  {/* PROJECT NAME */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon
                          name="FolderIcon"
                          size={20}
                          variant="outline"
                          className="text-primary"
                        />
                      </div>
                      <div>
                        <p className="font-caption font-medium text-sm text-foreground">
                          {project.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="font-caption text-[10px] text-primary font-medium whitespace-nowrap">
                            Tasks: <span className="font-bold">{project.completedTasks || 0}</span>/
                            {project.totalTasks || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* TYPE */}
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground capitalize">
                      {project.projectType ? project.projectType : 'normal'}
                    </span>
                  </td>
                  {/* PROJECT MANAGER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="font-caption text-xs font-medium text-accent">
                          {(project.owner || 'Unknown')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <span className="font-caption text-sm text-foreground">
                        {project.owner || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  {/* BUDGET */}
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm font-medium text-foreground">
                      {project.budget}
                    </span>
                  </td>
                  {/* PRIORITY */}
                  <td className="px-6 py-4">
                    <span
                      className={`font-caption text-sm font-medium ${priorityConfig[project.priority]}`}
                    >
                      {project.priority}
                    </span>
                  </td>
                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <Icon name={statusInfo.icon as any} size={14} variant="solid" />
                      {statusInfo.label}
                    </span>
                  </td>
                  {/* PROGRESS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="font-caption text-sm font-medium text-foreground min-w-[40px] text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  {/* TIMELINE */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-caption text-sm text-foreground">
                        {new Date(project.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">
                        to{' '}
                        {new Date(project.endDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </td>
                  {/* ACTIONS */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project.id)}
                        disabled={currentRole === 'Associate'}
                        className={`p-2 rounded-md transition-smooth ${
                          currentRole === 'Associate'
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                        title={currentRole === 'Associate' ? 'Permission denied' : 'Edit project'}
                      >
                        <Icon name="PencilIcon" size={16} variant="outline" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={currentRole === 'Associate'}
                        className={`p-2 rounded-md transition-smooth ${
                          currentRole === 'Associate'
                            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                            : 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground'
                        }`}
                        title={currentRole === 'Associate' ? 'Permission denied' : 'Delete project'}
                      >
                        <Icon name="TrashIcon" size={16} variant="outline" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {paginatedProjects.map((project, index) => {
          const statusInfo = statusConfig[project.status] || {
            label: 'Unknown',
            color: 'bg-muted text-muted-foreground',
            icon: 'QuestionMarkCircleIcon',
          };
          return (
            <div key={`${project.id}-${index}`} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="FolderIcon" size={20} variant="outline" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-caption font-bold text-sm text-foreground">{project.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">
                      {project.projectType || 'normal'}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-caption text-[10px] font-bold uppercase tracking-wider ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Manager
                  </p>
                  <p className="text-xs text-foreground font-medium truncate">{project.owner}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Budget
                  </p>
                  <p className="text-xs text-foreground font-medium">{project.budget}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Progress
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-foreground">
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Timeline
                  </p>
                  <p className="text-[10px] text-foreground font-medium">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <p className="font-caption text-[10px] text-primary font-medium">
                  Tasks: <span className="font-bold">{project.completedTasks || 0}</span>/
                  {project.totalTasks || 0}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onEdit) onEdit(project.id);
                    }}
                    disabled={currentRole === 'Associate'}
                    className={`p-2 rounded-md transition-smooth ${
                      currentRole === 'Associate'
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <Icon name="PencilIcon" size={14} variant="outline" />
                  </button>
                  <button
                    onClick={() => {
                      if (onDelete) onDelete(project.id);
                    }}
                    disabled={currentRole === 'Associate'}
                    className={`p-2 rounded-md transition-smooth ${
                      currentRole === 'Associate'
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <Icon name="TrashIcon" size={14} variant="outline" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-border bg-muted/20 gap-4">
        <p className="font-caption text-xs sm:text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span>{' '}
          to{' '}
          <span className="font-medium text-foreground">
            {Math.min((currentPage + 1) * pageSize, totalElements)}
          </span>{' '}
          of <span className="font-medium text-foreground">{totalElements}</span> projects
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <Icon name="ChevronLeftIcon" size={14} variant="outline" />
            <span className="hidden xs:inline">Previous</span>
          </button>
          <div className="flex items-center gap-1 overflow-x-auto max-w-[120px] xs:max-w-none">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                  currentPage === i
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <span className="hidden xs:inline">Next</span>
            <Icon name="ChevronRightIcon" size={14} variant="outline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectListView;
