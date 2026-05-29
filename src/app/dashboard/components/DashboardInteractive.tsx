'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import NotificationCenter from './NotificationCenter';
import MetricsCard from './MetricsCard';
import TaskPriorityChart from './TaskPriorityChart';
import ProjectHealthChart from './ProjectHealthChart';
import ProductivityChart from './ProductivityChart';
import SubtaskChart from './SubtaskChart';
import { BellIcon } from '@heroicons/react/24/outline';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

import TeamWorkloadOverview from './TeamWorkloadOverview';
import Icon from '@/components/ui/AppIcon';
import ProjectSelector from './ProjectSelector';

interface DashboardData {
  activeTasks: { count: number; progressPercentage: number };
  upcomingDeadlines: { count: number; progressPercentage: number };
  team: { memberCount: number; activePercentage: number };
  completionRate: { percentage: number; completedTasks: number; totalTasks: number };
  priorityOverview: { high: number; medium: number; low: number };
  weeklyProductivity: { date: string; todo: number; inProgress: number; done: number }[];
  teamWorkload: {
    userId: number;
    userName: string;
    assignedTaskCount: number;
    workloadPercentage: number;
  }[];
  subtasks: { total: number; inProgress: number; closed: number };
  personalStats: {
    projects: { active: number; done: number; overdue: number; total: number };
    subtasks: { active: number; done: number; overdue: number; total: number };
    tasks: { active: number; done: number; overdue: number; total: number };
  };
}

interface Project {
  id: number;
  name: string;
  endDate?: string;
  startDate?: string;
}

interface DashboardInteractiveProps {
  userRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
}

const DashboardInteractive = ({
  userRole: initialRole,
  userName = 'User',
}: DashboardInteractiveProps) => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [projects, setProjects] = useState<(Project & { status?: string })[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; type: string; time: string }[]
  >([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const API_AUTH = getAuthToken();

  // Load seen and dismissed notifications from localStorage
  useEffect(() => {
    const storedSeen = localStorage.getItem('seen_notifications');
    if (storedSeen) {
      setSeenIds(JSON.parse(storedSeen));
    }
    const storedDismissed = localStorage.getItem('dismissed_notifications');
    if (storedDismissed) {
      setDismissedIds(JSON.parse(storedDismissed));
    }
  }, []);

  // Fetch Projects for Dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(API_ENDPOINTS.projects.dropdown(), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });

        if (response.data) {
          // The dropdown API likely returns a simple array of {id, name}
          setProjects(
            response.data.map((p: any) => ({
              id: p.id,
              name: p.name,
            }))
          );
        }
      } catch (error: any) {
        console.error(
          'Error fetching project dropdown:',
          error.response?.status,
          error.response?.data || error.message
        );
      }
    };
    fetchProjects();
  }, []);

  // Fetch Tasks List
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.tasks.list()}?search=&status=&page=0&size=100&sort=id,desc`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: API_AUTH,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.content) {
            setTasks(data.content);
          }
        } else {
          console.error('Failed to fetch tasks (fetch):', response.status);
        }
      } catch (error) {
        console.error('Error fetching tasks (fetch):', error);
      }
    };
    fetchTasks();
  }, []);

  // Process Notifications
  useEffect(() => {
    const today = new Date();
    const newNotifications: { id: string; title: string; type: string; time: string }[] = [];

    // Completed Projects
    projects.forEach((project) => {
      if (project.status === 'COMPLETED' || project.status === 'DONE') {
        newNotifications.push({
          id: `proj-comp-${project.id}`,
          title: `Project Completed: ${project.name}`,
          type: 'Project',
          time: 'Just now',
        });
      }
    });

    // Tasks
    tasks.forEach((task) => {
      const dueDate = task.endDate ? new Date(task.endDate) : null;
      const isOverdue = dueDate && dueDate < today && task.status !== 'DONE';
      const isCompleted = task.status === 'DONE';

      if (isCompleted) {
        newNotifications.push({
          id: `task-comp-${task.id}`,
          title: `Task Completed: ${task.title}`,
          type: 'Task',
          time: 'Just now',
        });
      } else if (isOverdue) {
        newNotifications.push({
          id: `task-ovrd-${task.id}`,
          title: `Task Overdue: ${task.title}`,
          type: 'Overdue',
          time: dueDate ? dueDate.toLocaleDateString() : 'Expired',
        });
      }
    });

    setNotifications(newNotifications);

    // Only count as unread if ID is not in seenIds AND not in dismissedIds
    const unread = newNotifications.filter(
      (n) => !seenIds.includes(n.id) && !dismissedIds.includes(n.id)
    ).length;
    setUnreadCount(unread);
  }, [projects, tasks, seenIds, dismissedIds]);

  // Fetch Dashboard Stats
  const fetchDashboardData = async (projectId: number | null) => {
    setLoading(true);
    try {
      const url = projectId
        ? API_ENDPOINTS.dashboard.byProject(projectId)
        : API_ENDPOINTS.dashboard.summary();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: API_AUTH,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data (fetch):', response.status);
      }
    } catch (error) {
      console.error('Error fetching dashboard data (fetch):', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedProjectId);
  }, [selectedProjectId]);

  // Derived Metrics from API Data
  const metrics = dashboardData
    ? [
        {
          title: 'Active Tasks',
          value: String(dashboardData.activeTasks.count),
          change: dashboardData.activeTasks.progressPercentage,
          icon: '📋',
          variant: 'primary' as const,
        },
        {
          title: 'Upcoming Deadlines',
          value: String(dashboardData.upcomingDeadlines.count),
          change: dashboardData.upcomingDeadlines.progressPercentage,
          icon: '⏰',
          variant: 'warning' as const,
        },
        {
          title: 'Team Members',
          value: String(dashboardData.team.memberCount),
          change: dashboardData.team.activePercentage,
          icon: '👥',
          variant: 'success' as const,
        },
        {
          title: 'Completion Rate',
          value: `${Math.round(dashboardData.completionRate.percentage)}%`,
          change: 0,
          icon: '✅',
          variant: 'success' as const,
        },
      ]
    : [];

  // Derived Chart Data
  const priorityDistribution = dashboardData
    ? [
        { name: 'High', value: dashboardData.priorityOverview.high, color: '#F87171' },
        { name: 'Medium', value: dashboardData.priorityOverview.medium, color: '#FBBF24' },
        { name: 'Low', value: dashboardData.priorityOverview.low, color: '#4ADE80' },
      ]
    : [];

  const productivityChartData =
    dashboardData?.weeklyProductivity?.map((day) => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      completed: day.done,
      inProgress: day.inProgress,
      todo: day.todo,
    })) || [];

  const teamWorkload =
    dashboardData?.teamWorkload?.map((member) => ({
      id: member.userId,
      name: member.userName,
      role: (member as any).jobTitle || 'Team Member',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userName)}&background=random`,
      alt: `${member.userName} profile picture`,
      activeTasks: member.assignedTaskCount,
      workloadPercentage: member.workloadPercentage,
    })) || [];

  // Dynamic project health data based on API response
  const currentProjectsData = dashboardData
    ? [
        {
          id: selectedProjectId || 0,
          name: projects.find((p) => p.id === selectedProjectId)?.name || 'All Projects Portfolio',
          healthScore: Math.round(dashboardData.completionRate.percentage),
          tasksCompleted: dashboardData.completionRate.completedTasks,
          totalTasks: dashboardData.completionRate.totalTasks,
          status:
            dashboardData.completionRate.percentage >= 80
              ? ('On Track' as const)
              : dashboardData.completionRate.percentage >= 50
                ? ('At Risk' as const)
                : dashboardData.activeTasks.count > 0
                  ? ('Delayed' as const)
                  : ('On Track' as const),
        },
      ]
    : [];

  // --- My Stats from API ---
  const myTasksStats = dashboardData?.personalStats?.tasks || {
    total: 0,
    active: 0,
    done: 0,
    overdue: 0,
  };
  const mySubtasksStats = dashboardData?.personalStats?.subtasks || {
    total: 0,
    active: 0,
    done: 0,
    overdue: 0,
  };
  const myProjectsStats = dashboardData?.personalStats?.projects || {
    total: 0,
    active: 0,
    done: 0,
    overdue: 0,
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && notifications.length > 0) {
      // Mark all current notifications as seen when opening
      const currentIds = notifications.map((n) => n.id);
      const updatedSeenIds = Array.from(new Set([...seenIds, ...currentIds]));
      setSeenIds(updatedSeenIds);
      localStorage.setItem('seen_notifications', JSON.stringify(updatedSeenIds));
      setUnreadCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div className={`transition-smooth ${sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          {/* Header Row 1: Title + Actions */}
          <div className="flex items-center justify-between h-[60px] sm:h-[72px] px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <div>
                <h1 className="font-heading font-bold text-lg sm:text-2xl text-foreground">
                  Dashboard
                </h1>
                <p className="text-xs text-muted-foreground font-caption hidden sm:block">
                  Welcome back! Here's your overview for today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* ProjectSelector: hidden on mobile (shown in row 2 below) */}
              <div className="hidden sm:block">
                <ProjectSelector
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onProjectChange={setSelectedProjectId}
                />
              </div>
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="relative focus:outline-none p-2 hover:bg-muted rounded-full transition-smooth"
                >
                  <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground cursor-pointer" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-card">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-card border border-border rounded-xl shadow-elevation-4 z-50 overflow-hidden transform transition-all duration-200 ease-out origin-top-right scale-100 opacity-100">
                    <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-sm text-foreground">
                          Notifications
                        </h4>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                            {unreadCount} New
                          </span>
                        )}
                      </div>
                      {notifications.some((n) => !dismissedIds.includes(n.id)) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const allIds = notifications.map((n) => n.id);
                            const updatedDismissedIds = Array.from(
                              new Set([...dismissedIds, ...allIds])
                            );
                            setDismissedIds(updatedDismissedIds);
                            localStorage.setItem(
                              'dismissed_notifications',
                              JSON.stringify(updatedDismissedIds)
                            );
                            setUnreadCount(0);
                          }}
                          className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.filter((n) => !dismissedIds.includes(n.id)).length > 0 ? (
                        <ul className="divide-y divide-border">
                          {notifications
                            .filter((n) => !dismissedIds.includes(n.id))
                            .map((notif) => (
                              <li
                                key={notif.id}
                                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                                onClick={() => {
                                  const updatedDismissedIds = Array.from(
                                    new Set([...dismissedIds, notif.id])
                                  );
                                  setDismissedIds(updatedDismissedIds);
                                  localStorage.setItem(
                                    'dismissed_notifications',
                                    JSON.stringify(updatedDismissedIds)
                                  );
                                }}
                              >
                                <div className="flex gap-3">
                                  <div
                                    className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                      notif.type === 'Overdue'
                                        ? 'bg-error'
                                        : notif.type === 'Project'
                                          ? 'bg-primary'
                                          : 'bg-success'
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <span
                                        className={`text-[10px] font-bold uppercase tracking-wider ${
                                          notif.type === 'Overdue'
                                            ? 'text-error'
                                            : notif.type === 'Project'
                                              ? 'text-primary'
                                              : 'text-success'
                                        }`}
                                      >
                                        {notif.type}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {notif.time}
                                      </span>
                                    </div>
                                    <p className="text-sm text-foreground font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                      {notif.title}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                            <BellIcon className="h-6 w-6 text-muted-foreground opacity-50" />
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">
                            All caught up!
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            No new notifications at the moment.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 border-t border-border bg-muted/10">
                      <button className="w-full py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <ThemeToggle />
              <div className="hidden sm:block h-8 w-px bg-border" />
              <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
            </div>
          </div>
          {/* Header Row 2 (mobile only): Project Selector */}
          <div className="sm:hidden px-4 pb-2">
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectChange={setSelectedProjectId}
            />
          </div>
        </header>

        {/* Main Content */}
        <main
          className={`p-4 sm:p-6 transition-all duration-300 ${loading ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}
        >
          {/* My Stats Box */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-elevation-2 mb-6 bg-gradient-to-br from-card to-muted/20">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="ChartBarIcon" size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg text-foreground">My Stats</h2>
                  <p className="text-[10px] text-muted-foreground font-caption">
                    Your personalized performance overview
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                {selectedProjectId ? 'Project Specific' : 'Overall Portfolio'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* My Projects */}
              <div className="bg-background/60 backdrop-blur-sm p-5 rounded-2xl border border-border/50 shadow-sm hover:border-primary/30 transition-smooth group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      My Projects
                    </p>
                    <p className="text-3xl font-heading font-black text-foreground">
                      {myProjectsStats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="FolderIcon" size={24} className="text-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Active
                    </p>
                    <p className="text-sm font-bold text-blue-500">{myProjectsStats.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Done
                    </p>
                    <p className="text-sm font-bold text-green-500">{myProjectsStats.done}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Overdue
                    </p>
                    <p className="text-sm font-bold text-error">{myProjectsStats.overdue}</p>
                  </div>
                </div>
              </div>

              {/* My Tasks */}
              <div className="bg-background/60 backdrop-blur-sm p-5 rounded-2xl border border-border/50 shadow-sm hover:border-primary/30 transition-smooth group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      My Tasks
                    </p>
                    <p className="text-3xl font-heading font-black text-foreground">
                      {myTasksStats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="CheckIcon" size={24} className="text-green-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Active
                    </p>
                    <p className="text-sm font-bold text-blue-500">{myTasksStats.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Done
                    </p>
                    <p className="text-sm font-bold text-green-500">{myTasksStats.done}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Overdue
                    </p>
                    <p className="text-sm font-bold text-error">{myTasksStats.overdue}</p>
                  </div>
                </div>
              </div>

              {/* My Subtasks */}
              <div className="bg-background/60 backdrop-blur-sm p-5 rounded-2xl border border-border/50 shadow-sm hover:border-primary/30 transition-smooth group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      My Subtasks
                    </p>
                    <p className="text-3xl font-heading font-black text-foreground">
                      {mySubtasksStats.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="ListBulletIcon" size={24} className="text-purple-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Active
                    </p>
                    <p className="text-sm font-bold text-blue-500">{mySubtasksStats.active}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Done
                    </p>
                    <p className="text-sm font-bold text-green-500">{mySubtasksStats.done}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground mb-1">
                      Overdue
                    </p>
                    <p className="text-sm font-bold text-error">{mySubtasksStats.overdue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6">
            {metrics.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
            {dashboardData && (
              <SubtaskChart
                total={dashboardData.subtasks?.total || 0}
                inProgress={dashboardData.subtasks?.inProgress || 0}
                closed={dashboardData.subtasks?.closed || 0}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-elevation-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-xl text-foreground">
                    Priority Tasks
                  </h2>
                </div>
                <TaskPriorityChart data={priorityDistribution} />
              </div>

              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Weekly Productivity
                </h2>
                <ProductivityChart data={productivityChartData} />
              </div>

              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Team Workload
                </h2>
                <TeamWorkloadOverview teamMembers={teamWorkload} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-elevation-1">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
                  Project Health
                </h2>
                <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  <ProjectHealthChart projects={currentProjectsData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardInteractive;
