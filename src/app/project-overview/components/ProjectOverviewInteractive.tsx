'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/components/common/UserContext';
import ProjectListView from './ProjectListView';
import EditProjectModal from './EditProjectModal';
import ProjectHealthDashboard from './ProjectHealthDashboard';
import ResourceAllocation from './ResourceAllocation';
import MilestoneTracker from './MilestoneTracker';
import ProjectCreationPanel, { ProjectFormData } from './ProjectCreationPanel';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  isMilestone: boolean;
  isCriticalPath: boolean;
}

interface HealthMetric {
  label: string;
  value: number;
  target: number;
  status: 'on-track' | 'at-risk' | 'critical';
  icon: string;
  unit: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  allocation: number;
  availability: 'available' | 'busy' | 'unavailable';
  currentTasks: number;
  capacity: number;
}

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  owner: string;
}

const ProjectOverviewInteractive = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const { user } = useUser();
  const currentRole = user?.userRole || 'Associate';
  const [activeTab, setActiveTab] = useState<'list' | 'resources' | 'milestones'>('list');
  const [isProjectPanelOpen, setIsProjectPanelOpen] = useState(false);
  // Listen for Add Project button event
  useEffect(() => {
    const projectHandler = () => setIsProjectPanelOpen(true);
    const exportHandler = () => setIsExportModalOpen(true);

    window.addEventListener('open-project-modal', projectHandler);
    window.addEventListener('open-export-modal', exportHandler);

    return () => {
      window.removeEventListener('open-project-modal', projectHandler);
      window.removeEventListener('open-export-modal', exportHandler);
    };
  }, []);
  const [projects, setProjects] = useState<ProjectFormData[]>([]);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFilters, setExportFilters] = useState({ search: '', status: '' });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const mockTasks: Task[] = [
    {
      id: 'task-1',
      name: 'Project Planning & Requirements',
      startDate: '2026-01-15',
      endDate: '2026-01-28',
      progress: 100,
      dependencies: [],
      assignee: 'Sarah Johnson',
      priority: 'High',
      isMilestone: true,
      isCriticalPath: true,
    },
    {
      id: 'task-2',
      name: 'UI/UX Design Phase',
      startDate: '2026-01-29',
      endDate: '2026-02-18',
      progress: 75,
      dependencies: ['task-1'],
      assignee: 'Michael Chen',
      priority: 'High',
      isMilestone: false,
      isCriticalPath: true,
    },
    {
      id: 'task-3',
      name: 'Frontend Development',
      startDate: '2026-02-19',
      endDate: '2026-03-25',
      progress: 45,
      dependencies: ['task-2'],
      assignee: 'Emily Rodriguez',
      priority: 'High',
      isMilestone: false,
      isCriticalPath: true,
    },
    {
      id: 'task-4',
      name: 'Backend API Development',
      startDate: '2026-02-12',
      endDate: '2026-03-18',
      progress: 60,
      dependencies: ['task-1'],
      assignee: 'David Kim',
      priority: 'Medium',
      isMilestone: false,
      isCriticalPath: false,
    },
    {
      id: 'task-5',
      name: 'Database Setup & Migration',
      startDate: '2026-02-05',
      endDate: '2026-02-25',
      progress: 85,
      dependencies: ['task-1'],
      assignee: 'Jessica Taylor',
      priority: 'Medium',
      isMilestone: false,
      isCriticalPath: false,
    },
    {
      id: 'task-6',
      name: 'Integration Testing',
      startDate: '2026-03-26',
      endDate: '2026-04-08',
      progress: 20,
      dependencies: ['task-3', 'task-4'],
      assignee: 'Robert Martinez',
      priority: 'High',
      isMilestone: false,
      isCriticalPath: true,
    },
    {
      id: 'task-7',
      name: 'Beta Testing & QA',
      startDate: '2026-04-09',
      endDate: '2026-04-22',
      progress: 0,
      dependencies: ['task-6'],
      assignee: 'Amanda Wilson',
      priority: 'High',
      isMilestone: true,
      isCriticalPath: true,
    },
    {
      id: 'task-8',
      name: 'Production Deployment',
      startDate: '2026-04-23',
      endDate: '2026-04-30',
      progress: 0,
      dependencies: ['task-7'],
      assignee: 'Christopher Lee',
      priority: 'High',
      isMilestone: true,
      isCriticalPath: true,
    },
  ];

  const mockHealthMetrics: HealthMetric[] = [
    {
      label: 'Tasks Completed',
      value: 42,
      target: 68,
      status: 'on-track',
      icon: 'CheckCircleIcon',
      unit: '',
    },
    {
      label: 'Budget Utilized',
      value: 68,
      target: 100,
      status: 'on-track',
      icon: 'CurrencyDollarIcon',
      unit: '%',
    },
    {
      label: 'Team Velocity',
      value: 7.8,
      target: 10,
      status: 'at-risk',
      icon: 'BoltIcon',
      unit: '',
    },
    {
      label: 'Risk Score',
      value: 3,
      target: 10,
      status: 'on-track',
      icon: 'ShieldExclamationIcon',
      unit: '',
    },
  ];

  const mockTeamMembers: TeamMember[] = [
    {
      id: 'member-1',
      name: 'Sarah Johnson',
      role: 'Project Manager',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png',
      alt: 'Professional woman with brown hair in business attire smiling at camera',
      allocation: 95,
      availability: 'busy',
      currentTasks: 8,
      capacity: 10,
    },
    {
      id: 'member-2',
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cd09ec58-1763296862264.png',
      alt: 'Asian man with glasses in casual blue shirt smiling outdoors',
      allocation: 85,
      availability: 'busy',
      currentTasks: 6,
      capacity: 8,
    },
    {
      id: 'member-3',
      name: 'Emily Rodriguez',
      role: 'Frontend Developer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_19dc372df-1763294269106.png',
      alt: 'Hispanic woman with long dark hair in professional attire',
      allocation: 78,
      availability: 'available',
      currentTasks: 5,
      capacity: 8,
    },
    {
      id: 'member-4',
      name: 'David Kim',
      role: 'Backend Developer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cf9d07e2-1763295152029.png',
      alt: 'Young man with short black hair in casual attire smiling',
      allocation: 60,
      availability: 'available',
      currentTasks: 4,
      capacity: 8,
    },
    {
      id: 'member-5',
      name: 'Jessica Taylor',
      role: 'Database Administrator',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_152c5c9f3-1763296503496.png',
      alt: 'Woman with blonde hair in professional white blouse',
      allocation: 72,
      availability: 'available',
      currentTasks: 5,
      capacity: 8,
    },
  ];

  const mockMilestones: Milestone[] = [];

  const tabs = [
    { id: 'list', label: 'List View', icon: 'TableCellsIcon' },
    ...(currentRole !== 'Associate'
      ? [{ id: 'resources', label: 'Resource Management', icon: 'UsersIcon' }]
      : []),
    { id: 'milestones', label: 'Milestone Tracking', icon: 'FlagIcon' },
  ];

  const handleExportSubmit = async (format: string) => {
    try {
      const token = getAuthToken();
      // Map 'excel' format from UI to 'xlsx' expected by API
      const apiFormat = format === 'excel' ? 'xlsx' : format;

      // Map status to uppercase/underscore format if needed
      const apiStatus = exportFilters.status
        ? exportFilters.status.replace('-', '_').toUpperCase()
        : '';

      const url = API_ENDPOINTS.projects.export(apiFormat, exportFilters.search, apiStatus);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Trigger file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `project_report_${new Date().getTime()}.${apiFormat}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setIsExportModalOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings);
    setIsSettingsModalOpen(false);
    // Show success notification (optional)
  };

  const handleReportGenerate = (reportType: string) => {
    console.log(`Generating ${reportType} report`);
    setIsReportModalOpen(false);
    // Show success notification (optional)
  };

  const handleMeetingSchedule = (meetingData: any) => {
    console.log('Meeting scheduled:', meetingData);
    setIsMeetingModalOpen(false);
    // Show success notification (optional)
  };

  const mapProjectManager = (projectManagerId: string) => {
    const manager = mockTeamMembers.find((member) => member.id === projectManagerId);
    return manager ? manager.name : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div className={`transition-smooth ${isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <div>
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  Project Overview
                </h1>
                <p className="font-caption text-xs sm:text-sm text-muted-foreground mt-1 hidden xs:block">
                  Comprehensive project tracking
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-px bg-border" />
              <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6">
          {/* Tabbed Content */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-4 border-b border-border bg-muted/30 overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-smooth ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab.icon as any} size={18} variant="outline" />
                    <span className="font-caption text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'list' && (
                <ProjectListView
                  projects={projects.map((project) => ({
                    ...project,
                    owner: project.projectManager, // Map projectManager to owner for ProjectListView
                    status:
                      project.status === 'In Progress'
                        ? 'in-progress'
                        : project.status === 'Completed'
                          ? 'completed'
                          : project.status === 'On Hold'
                            ? 'on-hold'
                            : 'planning', // Default mapping for unmatched statuses
                    projectManager: mapProjectManager(project.projectManager), // Map projectManagerId to fullName
                  }))}
                  onEdit={async (id) => {
                    const idStr = id.toString();
                    const numericId =
                      idStr.includes('-') && !isNaN(parseInt(idStr.split('-')[1]))
                        ? parseInt(idStr.split('-')[1])
                        : parseInt(idStr);

                    if (isNaN(numericId)) {
                      console.error('Invalid project ID for editing:', id);
                      setEditProjectId(id);
                      return;
                    }

                    try {
                      const response = await fetch(API_ENDPOINTS.projects.byId(numericId), {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: getAuthToken(),
                        },
                      });

                      if (response.ok) {
                        const projectData = await response.json();

                        // Map backend data to local state structure
                        const updatedProject: ProjectFormData = {
                          id: projectData.id.toString(),
                          name: projectData.name,
                          projectName: projectData.name,
                          description: projectData.description || '',
                          startDate: projectData.startDate || '',
                          endDate: projectData.endDate || '',
                          budget: projectData.budget?.toString() || '',
                          priority:
                            ((projectData.priority?.charAt(0) +
                              projectData.priority?.slice(1).toLowerCase()) as any) || 'Medium',
                          projectManager: projectData.projectManagerId?.toString() || '',
                          status:
                            projectData.status === 'IN_PROGRESS' ||
                            projectData.status === 'PROGRESS'
                              ? 'In Progress'
                              : projectData.status === 'ON_HOLD'
                                ? 'On Hold'
                                : projectData.status === 'COMPLETED'
                                  ? 'Completed'
                                  : 'Planning',
                          progress: projectData.progressPercentage || 0,
                          team: projectData.teamSize || 0,
                          teamMembers: [],
                        };

                        setProjects((prev) => {
                          const exists = prev.some((p) => p.id === updatedProject.id);
                          if (exists) {
                            return prev.map((p) =>
                              p.id === updatedProject.id ? updatedProject : p
                            );
                          }
                          return [...prev, updatedProject];
                        });
                        setEditProjectId(updatedProject.id);
                      } else {
                        console.error('Failed to fetch project details:', response.status);
                        setEditProjectId(id);
                      }
                    } catch (error) {
                      console.error('Error fetching project details:', error);
                      setEditProjectId(id);
                    }
                  }}
                  onDelete={async (id) => {
                    if (!window.confirm('Are you sure you want to delete this project?')) return;

                    const idStr = id.toString();
                    const numericId =
                      idStr.includes('-') && !isNaN(parseInt(idStr.split('-')[1]))
                        ? parseInt(idStr.split('-')[1])
                        : parseInt(idStr);

                    if (isNaN(numericId)) {
                      console.log('Skipping backend delete for mock ID:', id);
                      setProjects(projects.filter((p) => p.id !== id));
                      return;
                    }

                    try {
                      const response = await fetch(API_ENDPOINTS.projects.byId(numericId), {
                        method: 'DELETE',
                        headers: {
                          Authorization: getAuthToken(),
                        },
                      });

                      if (response.ok) {
                        console.log('Project deleted successfully:', id);
                        setProjects(projects.filter((p) => p.id !== id));
                      } else {
                        console.error('Failed to delete project:', response.status);
                        // Optionally alert user
                      }
                    } catch (error) {
                      console.error('Error deleting project:', error);
                    }
                  }}
                  onExport={(filters) => {
                    setExportFilters(filters);
                    setIsExportModalOpen(true);
                  }}
                  currentRole={currentRole}
                />
              )}
              {activeTab === 'resources' && <ResourceAllocation currentRole={currentRole} />}
              {activeTab === 'milestones' && <MilestoneTracker milestones={mockMilestones} />}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon
                  name="DocumentChartBarIcon"
                  size={24}
                  variant="outline"
                  className="text-primary"
                />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">
                  Generate Report
                </h4>
                <p className="font-caption text-xs text-muted-foreground">
                  Create detailed project report
                </p>
              </div>
              <Icon
                name="ChevronRightIcon"
                size={20}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>

            <button
              onClick={() => setIsMeetingModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth"
            >
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name="CalendarDaysIcon" size={24} variant="outline" className="text-accent" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">
                  Schedule Meeting
                </h4>
                <p className="font-caption text-xs text-muted-foreground">
                  Coordinate with team members
                </p>
              </div>
              <Icon
                name="ChevronRightIcon"
                size={20}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>

            <button
              onClick={() => setIsAlertsModalOpen(true)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-elevation-2 transition-smooth"
            >
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon name="BellAlertIcon" size={24} variant="outline" className="text-warning" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-caption font-semibold text-sm text-foreground">View Alerts</h4>
                <p className="font-caption text-xs text-muted-foreground">
                  Check critical notifications
                </p>
              </div>
              <Icon
                name="ChevronRightIcon"
                size={20}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>
          </div>
        </main>
      </div>

      {/* Project Creation Panel */}
      <ProjectCreationPanel
        isOpen={isProjectPanelOpen}
        onClose={() => setIsProjectPanelOpen(false)}
        onSubmit={(projectData) => {
          setProjects((prev) => [...prev, projectData]);
          setIsProjectPanelOpen(false);
          // Show success notification (optional)
          console.log('Project created:', projectData);
        }}
      />

      {editProjectId && (
        <EditProjectModal
          project={(() => {
            const p = projects.find((p) => p.id === editProjectId) || {
              id: '',
              name: '',
              projectName: '',
              description: '',
              status: 'Planning' as const,
              progress: 0,
              startDate: '',
              endDate: '',
              budget: '0',
              priority: 'Medium' as const,
              projectManager: '',
              teamMembers: [],
              team: 0,
            };
            return {
              ...p,
              status:
                p.status === 'In Progress'
                  ? ('in-progress' as const)
                  : p.status === 'Completed'
                    ? ('completed' as const)
                    : p.status === 'On Hold'
                      ? ('on-hold' as const)
                      : ('planning' as const),
              owner: p.projectManager,
              description: p.description,
            };
          })()}
          onSave={async (updatedProject) => {
            const statusMapping: Record<string, string> = {
              'in-progress': 'IN_PROGRESS',
              'on-hold': 'ON_HOLD',
              completed: 'COMPLETED',
              planning: 'PLANNING',
            };

            const parsedBudget = parseFloat(
              (updatedProject.budget || '0').toString().replace(/[^0-9.]/g, '')
            );
            const parsedOwnerId = parseInt(updatedProject.owner);
            const today = new Date().toISOString().split('T')[0];
            const adjustedStartDate =
              updatedProject.startDate < today ? today : updatedProject.startDate;

            const projectPayload = {
              name: updatedProject.name,
              description: updatedProject.description || '',
              type: (updatedProject.projectType || 'normal').toUpperCase(),
              budget: isNaN(parsedBudget) ? 0 : parsedBudget,
              startDate: adjustedStartDate,
              endDate: updatedProject.endDate,
              priority: (updatedProject.priority || 'MEDIUM').toUpperCase(),
              progressPercentage: updatedProject.progress || 0,
              projectManagerId: isNaN(parsedOwnerId) ? 0 : parsedOwnerId,
              status: statusMapping[updatedProject.status] || 'PLANNING',
            };

            const numericId =
              updatedProject.id.includes('-') && !isNaN(parseInt(updatedProject.id.split('-')[1]))
                ? parseInt(updatedProject.id.split('-')[1])
                : parseInt(updatedProject.id);

            if (isNaN(numericId)) {
              console.error('Invalid numeric ID for update:', updatedProject.id);
              // Fallback to local update if ID is not numeric (mock data)
              updateLocalProjects(updatedProject);
              setEditProjectId(null);
              return;
            }

            try {
              const response = await fetch(API_ENDPOINTS.projects.byId(numericId), {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: getAuthToken(),
                },
                body: JSON.stringify(projectPayload),
              });

              if (response.ok) {
                const result = await response.json();
                console.log('Project updated successfully:', result);
                updateLocalProjects(updatedProject);
              } else {
                console.error('Failed to update project:', response.status, await response.text());
                // Optionally show error to user
              }
            } catch (error) {
              console.error('Error updating project:', error);
            } finally {
              setEditProjectId(null);
            }

            function updateLocalProjects(updated: any) {
              setProjects((prevProjects) =>
                prevProjects.map((project) =>
                  project.id === updated.id
                    ? {
                        ...project,
                        ...updated,
                        projectName: updated.name,
                        projectManager: updated.owner,
                        status:
                          updated.status === 'in-progress'
                            ? 'In Progress'
                            : updated.status === 'completed'
                              ? 'Completed'
                              : updated.status === 'on-hold'
                                ? 'On Hold'
                                : updated.status === 'planning'
                                  ? 'Planning'
                                  : 'Planning', // Fallback to Planning if At Risk was somehow present
                      }
                    : project
                )
              );
            }
          }}
          onClose={() => setEditProjectId(null)}
        />
      )}

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Export Report</h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Select the format for your project report
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleExportSubmit('pdf')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon
                  name="DocumentTextIcon"
                  size={24}
                  variant="outline"
                  className="text-primary"
                />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">PDF Document</p>
                  <p className="font-caption text-xs text-muted-foreground">
                    Portable document format
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleExportSubmit('excel')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="TableCellsIcon" size={24} variant="outline" className="text-accent" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Excel Spreadsheet
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">Data analysis format</p>
                </div>
              </button>
              <button
                onClick={() => handleExportSubmit('csv')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon
                  name="DocumentIcon"
                  size={24}
                  variant="outline"
                  className="text-muted-foreground"
                />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">CSV File</p>
                  <p className="font-caption text-xs text-muted-foreground">
                    Comma-separated values
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Project Settings
              </h3>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">
                  Default View
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>List View</option>
                  {currentRole !== 'Associate' && <option>Resource Management</option>}
                  <option>Milestone Tracking</option>
                </select>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">
                  Notification Frequency
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>Real-time</option>
                  <option>Daily Digest</option>
                  <option>Weekly Summary</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-foreground">Show Critical Path</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-sm text-foreground">Auto-save Changes</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSettingsSave({})}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Generate Report
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Choose the type of report to generate
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleReportGenerate('Progress Summary')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon name="ChartBarIcon" size={24} variant="outline" className="text-primary" />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Progress Summary
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">
                    Overall project progress
                  </p>
                </div>
              </button>
              {currentRole !== 'Associate' && (
                <button
                  onClick={() => handleReportGenerate('Resource Utilization')}
                  className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
                >
                  <Icon name="UsersIcon" size={24} variant="outline" className="text-accent" />
                  <div className="text-left">
                    <p className="font-caption font-medium text-sm text-foreground">
                      Resource Utilization
                    </p>
                    <p className="font-caption text-xs text-muted-foreground">
                      Team allocation analysis
                    </p>
                  </div>
                </button>
              )}
              <button
                onClick={() => handleReportGenerate('Budget Analysis')}
                className="w-full flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-smooth"
              >
                <Icon
                  name="CurrencyDollarIcon"
                  size={24}
                  variant="outline"
                  className="text-warning"
                />
                <div className="text-left">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Budget Analysis
                  </p>
                  <p className="font-caption text-xs text-muted-foreground">Financial overview</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {isMeetingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Schedule Meeting
              </h3>
              <button
                onClick={() => setIsMeetingModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sprint Planning Meeting"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-caption text-sm font-medium text-foreground mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block font-caption text-sm font-medium text-foreground mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">
                  Duration
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>1.5 hours</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div>
                <label className="block font-caption text-sm font-medium text-foreground mb-2">
                  Participants
                </label>
                <input
                  type="text"
                  placeholder="Select team members..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsMeetingModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={() => handleMeetingSchedule({})}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Alerts Modal */}
      {isAlertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-lg text-foreground">Project Alerts</h3>
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 border border-warning/30 bg-warning/5 rounded-lg">
                <Icon
                  name="ExclamationTriangleIcon"
                  size={20}
                  variant="outline"
                  className="text-warning mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Budget Threshold Warning
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    Project has utilized 68% of allocated budget. Consider reviewing expenses.
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                <Icon
                  name="XCircleIcon"
                  size={20}
                  variant="outline"
                  className="text-destructive mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Critical Path Delay
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    Task "Frontend Development" is behind schedule and may impact project timeline.
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-accent/30 bg-accent/5 rounded-lg">
                <Icon
                  name="InformationCircleIcon"
                  size={20}
                  variant="outline"
                  className="text-accent mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Milestone Approaching
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    "Design Phase Completion" milestone is due in 3 days. Current progress: 75%
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 border border-primary/30 bg-primary/5 rounded-lg">
                <Icon
                  name="CheckCircleIcon"
                  size={20}
                  variant="outline"
                  className="text-primary mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-caption font-medium text-sm text-foreground">
                    Resource Availability
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    David Kim has 40% capacity available for new task assignments.
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-2">2 days ago</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setIsAlertsModalOpen(false)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOverviewInteractive;
