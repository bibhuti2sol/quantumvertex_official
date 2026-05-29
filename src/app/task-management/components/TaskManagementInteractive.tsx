'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import ViewModeToggle from './ViewModeToggle';
import FilterToolbar, { FilterState } from './FilterToolbar';
import TaskListView from './TaskListView';
import EditTaskModal from './EditTaskModal';
import TaskKanbanView from './TaskKanbanView';
import TaskFocusView from './TaskFocusView';
import TaskCreationPanel from './TaskCreationPanel';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface Task {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
    alt: string;
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number;
  project: string;
  subtasks: number;
  completedSubtasks: number;
  description: string;
  timeTracked: string;
  estimatedTime: string;
  subtaskList?: {
    id: string;
    title: string;
    status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
    assignee?: string;
    assigneeId?: number;
    description?: string;
    startDate?: string;
    endDate?: string;
  }[];
  comments: string;
  assigneeId?: number;
  projectId?: number;
}

const TaskManagementInteractive = () => {
  const { user } = useUser();
  const handleExport = async (type: 'csv' | 'pdf' | 'xlsx') => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const priorityMap: Record<string, string> = {
        High: 'HIGH',
        Medium: 'MEDIUM',
        Low: 'LOW',
      };

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        Review: 'REVIEW',
        Completed: 'DONE',
      };

      const apiStatus = filters.status.length > 0 ? statusMap[filters.status[0]] || '' : '';
      const apiPriority = filters.priority.length > 0 ? priorityMap[filters.priority[0]] || '' : '';
      const apiAssigneeId = filters.assigneeIds.length > 0 ? filters.assigneeIds[0].toString() : '';
      const apiProjectId = filters.projectIds.length > 0 ? filters.projectIds[0].toString() : '';

      // Construct URL with filters
      const url = API_ENDPOINTS.tasks.export(
        type,
        searchQuery,
        apiStatus,
        apiPriority,
        apiAssigneeId,
        apiProjectId
      );

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `tasks_report_${new Date().getTime()}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Task export error:', error);
      alert('Failed to export report. Please try again.');
    }
  };
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'kanban' | 'focus'>('list');
  const [isCreationPanelOpen, setIsCreationPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priority: [],
    assignee: [],
    assigneeIds: [],
    project: [],
    projectIds: [],
    status: [],
    dateRange: null,
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref in sync with latest filters to avoid triggering fetchTasks recreations
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(task.priority);
    const matchesAssignee =
      filters.assignee.length === 0 || filters.assignee.includes(task.assignee.name);
    const matchesProject = filters.project.length === 0 || filters.project.includes(task.project);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(task.status);

    return matchesSearch && matchesPriority && matchesAssignee && matchesProject && matchesStatus;
  });

  const fetchTasks = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
    }
    setError(null);
    try {
      const priorityMap: Record<string, string> = {
        High: 'HIGH',
        Medium: 'MEDIUM',
        Low: 'LOW',
      };

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        Review: 'REVIEW',
        Completed: 'DONE',
      };

      const params = new URLSearchParams({
        search: '', // required by backend; client-side filtering handles the actual search
        page: '0',
        size: '100',
        sort: 'id,desc',
      });

      const currentFilters = filtersRef.current;

      if (currentFilters.priority.length > 0) {
        params.append('priority', priorityMap[currentFilters.priority[0]] || '');
      }
      if (currentFilters.status.length > 0) {
        params.append('status', statusMap[currentFilters.status[0]] || '');
      }
      // Note: projectId and assigneeId can be added here if available in FilterState

      const baseUrl = API_ENDPOINTS.tasks.list();
      const response = await axios.get(`${baseUrl}?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      const data = response.data.content || response.data.data || [];

      const mappedTasks: Task[] = data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        assignee: {
          name: item.assigneeName || 'Unassigned',
          avatar: 'https://via.placeholder.com/150',
          alt: item.assigneeName || 'Unassigned',
        },
        priority:
          ((item.priority?.charAt(0) + item.priority?.slice(1).toLowerCase()) as any) || 'Medium',
        status:
          item.status === 'TODO'
            ? 'To Do'
            : item.status === 'IN_PROGRESS'
              ? 'In Progress'
              : item.status === 'REVIEW'
                ? 'Review'
                : 'Completed',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        progress: item.progressPercentage || 0,
        project: item.projectName || 'General',
        subtasks: item.subTasks?.length || 0,
        completedSubtasks: item.subTasks?.filter((st: any) => st.status === 'DONE').length || 0,
        description: item.description || '',
        timeTracked: '0h', // Not in API yet
        estimatedTime: '0h', // Not in API yet
        comments: '', // Summary of comments if needed
        subtaskList:
          item.subTasks?.map((st: any) => ({
            id: st.id.toString(),
            title: st.name,
            status:
              st.status === 'TODO'
                ? 'To Do'
                : st.status === 'IN_PROGRESS'
                  ? 'In Progress'
                  : st.status === 'REVIEW'
                    ? 'Review'
                    : 'Completed',
            assignee: st.assigneeName || '',
            assigneeId: st.assigneeId,
            description: st.description || '',
            startDate: st.startDate || '',
            endDate: st.endDate || '',
          })) || [],
        assigneeId: item.assigneeId,
        projectId: item.projectId,
      }));

      setTasks(mappedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    fetchTasks(false);
    setIsHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Background refresh when filters change
  useEffect(() => {
    if (isHydrated) {
      fetchTasks(true); // background fetch
    }
  }, [filters, isHydrated, fetchTasks]);

  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const handleTaskClick = (taskId: string) => {
    // Optionally: open details, not edit
  };
  const handleEditTask = (taskId: string) => {
    setEditTaskId(taskId);
  };
  const handleSaveTask = (updatedTask: Task) => {
    // Optimistic update
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setEditTaskId(null);
    // Persist from backend
    fetchTasks();
  };
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = getAuthToken();
      await axios.delete(API_ENDPOINTS.tasks.byId(taskId), {
        headers: { Authorization: token },
      });
      setTasks(tasks.filter((t) => t.id !== taskId));
      console.log(`Successfully deleted task ${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task on the server.');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    // Find the task to update
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    // Prevent moving task back from Completed status
    if (taskToUpdate.status === 'Completed' && newStatus !== 'Completed') {
      console.warn(`Prevented moving task ${taskId} from Completed to ${newStatus}`);
      return;
    }

    // Save previous state for rollback if needed
    const previousTasks = [...tasks];

    // Optimistic update
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));

    try {
      const token = getAuthToken();

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        Review: 'REVIEW',
        Completed: 'DONE',
      };

      const payload = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        priority: taskToUpdate.priority.toUpperCase(),
        status: statusMap[newStatus],
        assigneeId: taskToUpdate.assigneeId || null,
        projectId: taskToUpdate.projectId || null,
        startDate: taskToUpdate.startDate,
        endDate: taskToUpdate.endDate,
        recurring: false,
        subTasks:
          taskToUpdate.subtaskList?.map((st) => ({
            name: st.title,
            status:
              st.status === 'To Do'
                ? 'TODO'
                : st.status === 'In Progress'
                  ? 'IN_PROGRESS'
                  : st.status === 'Review'
                    ? 'REVIEW'
                    : 'DONE',
          })) || [],
      };

      await axios.put(API_ENDPOINTS.tasks.byId(taskId), payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      console.log(`Successfully updated task ${taskId} status to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Revert on error
      setTasks(previousTasks);
      alert('Failed to update task status on the server. Change has been reverted.');
    }
  };

  const handleTaskAddSubtask = async (taskId: string, title: string) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate) return;

    if (taskToUpdate.status === 'Completed') {
      console.warn(`Prevented adding subtask to completed task ${taskId}`);
      return;
    }

    const previousTasks = [...tasks];
    const newSubtask = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      status: 'To Do' as const,
    };

    const updatedSubtaskList = [...(taskToUpdate.subtaskList || []), newSubtask];

    // Optimistic update
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtaskList: updatedSubtaskList,
              subtasks: updatedSubtaskList.length,
            }
          : t
      )
    );

    try {
      const token = getAuthToken();

      const payload = {
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        priority: taskToUpdate.priority.toUpperCase(),
        status:
          taskToUpdate.status === 'To Do'
            ? 'TODO'
            : taskToUpdate.status === 'In Progress'
              ? 'IN_PROGRESS'
              : taskToUpdate.status === 'Review'
                ? 'REVIEW'
                : 'DONE',
        assigneeId: taskToUpdate.assigneeId,
        projectId: taskToUpdate.projectId,
        startDate: taskToUpdate.startDate,
        endDate: taskToUpdate.endDate,
        recurring: false,
        subTasks: updatedSubtaskList.map((st) => ({
          name: st.title,
          status:
            st.status === 'To Do'
              ? 'TODO'
              : st.status === 'In Progress'
                ? 'IN_PROGRESS'
                : st.status === 'Review'
                  ? 'REVIEW'
                  : 'DONE',
        })),
      };

      await axios.put(API_ENDPOINTS.tasks.byId(taskId), payload, {
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to add subtask:', err);
      setTasks(previousTasks);
      alert('Failed to add subtask on the server.');
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskId: string, completed: boolean) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate || !taskToUpdate.subtaskList) return;

    if (taskToUpdate.status === 'Completed') {
      console.warn(`Prevented toggling subtask in completed task ${taskId}`);
      return;
    }

    const previousTasks = [...tasks];
    const updatedSubtaskList = taskToUpdate.subtaskList.map((st) =>
      st.id === subtaskId
        ? { ...st, status: completed ? ('Completed' as const) : ('To Do' as const) }
        : st
    );

    // Optimistic update
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtaskList: updatedSubtaskList,
              completedSubtasks: updatedSubtaskList.filter((st) => st.status === 'Completed')
                .length,
            }
          : t
      )
    );

    try {
      const token = getAuthToken();

      const targetSubtask = updatedSubtaskList.find((st) => st.id === subtaskId);
      if (!targetSubtask) return;

      const payload = {
        name: targetSubtask.title,
        status: completed ? 'DONE' : 'TODO',
      };

      await axios.put(API_ENDPOINTS.subtasks.byId(taskId, subtaskId), payload, {
        headers: { 'Content-Type': 'application/json', Authorization: token },
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
      // Revert on error
      setTasks(previousTasks);
    }
  };

  const handleSubtaskDelete = async (taskId: string, subtaskId: string) => {
    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate || !taskToUpdate.subtaskList) return;

    if (taskToUpdate.status === 'Completed') {
      console.warn(`Prevented deleting subtask in completed task ${taskId}`);
      return;
    }

    const previousTasks = [...tasks];
    const updatedSubtaskList = taskToUpdate.subtaskList.filter((st) => st.id !== subtaskId);

    // Optimistic update
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtaskList: updatedSubtaskList,
              subtasks: updatedSubtaskList.length,
              completedSubtasks: updatedSubtaskList.filter((st) => st.status === 'Completed')
                .length,
            }
          : t
      )
    );

    try {
      const token = getAuthToken();

      await axios.delete(API_ENDPOINTS.subtasks.byId(taskId, subtaskId), {
        headers: { Authorization: token },
      });
      console.log(`Successfully deleted subtask ${subtaskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete subtask:', err);
      // Revert on error
      setTasks(previousTasks);
      alert('Failed to delete subtask on the server.');
    }
  };

  const handleTaskCreate = (newTask: any) => {
    console.log('New task created:', newTask);
    fetchTasks();
  };

  if (!isHydrated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircleIcon" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Failed to load tasks</h2>
          <p className="text-muted-foreground font-caption text-sm mb-6">{error}</p>
          <button
            onClick={() => fetchTasks()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div
        className={`transition-smooth min-h-screen ${isSidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'} 
        ml-0`}
      >
        <header className="sticky top-0 z-[50] bg-card border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4 flex-1">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>
              <h1 className="font-heading text-xl sm:text-2xl font-semibold text-foreground truncate">
                Task Management
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-px bg-border" />
              <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
            </div>
          </div>

          <div className="px-4 sm:px-6 pb-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <ViewModeToggle currentView={currentView} onViewChange={setCurrentView} />

              <div className="flex items-center gap-3">
                <span className="font-caption text-sm text-muted-foreground">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 space-y-6">
          <FilterToolbar
            filters={filters}
            onFilterChange={setFilters}
            onNewTask={() => setIsCreationPanelOpen(true)}
            onExport={handleExport}
            currentRole={user?.userRole}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground font-caption animate-pulse">Loading tasks...</p>
            </div>
          ) : (
            <div className={`transition-opacity duration-200 opacity-100`}>
              {currentView === 'list' && (
                <TaskListView
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onStatusChange={handleStatusChange}
                  onEditTask={handleEditTask}
                  onTaskUpdate={handleSaveTask}
                  onDeleteTask={handleDeleteTask}
                  onRefresh={fetchTasks}
                />
              )}

              {currentView === 'kanban' && (
                <TaskKanbanView
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onStatusChange={handleStatusChange}
                  currentRole={user?.userRole}
                />
              )}

              {currentView === 'focus' && (
                <TaskFocusView
                  tasks={filteredTasks}
                  onTaskClick={handleTaskClick}
                  onAddSubtask={handleTaskAddSubtask}
                  onSubtaskToggle={handleSubtaskToggle}
                  onSubtaskDelete={handleSubtaskDelete}
                />
              )}
            </div>
          )}
        </main>
      </div>

      <TaskCreationPanel
        isOpen={isCreationPanelOpen}
        onClose={() => setIsCreationPanelOpen(false)}
        onTaskCreate={handleTaskCreate}
      />

      {editTaskId && (
        <EditTaskModal
          task={{
            ...tasks.find((t) => t.id === editTaskId)!,
            assignee: tasks.find((t) => t.id === editTaskId)?.assignee.name || '', // Convert `assignee` object to `name` string
          }}
          onSave={handleSaveTask}
          onClose={() => setEditTaskId(null)}
        />
      )}
    </div>
  );
};

export default TaskManagementInteractive;
