'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';
import { useUser } from '@/components/common/UserContext';

interface Assignee {
  id: number;
  fullName: string;
}

interface Project {
  id: number;
  name: string;
}

interface TaskCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreate: (task: any) => void;
}

const TaskCreationPanel = ({ isOpen, onClose, onTaskCreate }: TaskCreationPanelProps) => {
  const { user } = useUser();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: '',
    project: '',
    startDate: '',
    endDate: '',
    status: 'To Do',
    isRecurring: false,
    recurringPattern: 'daily',
  });

  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) return;

        console.log('TaskCreationPanel: Fetching dropdown data...');

        // Fetch projects for dropdown
        try {
          const response = await axios.get(API_ENDPOINTS.projects.dropdown(), {
            headers: { Authorization: token },
          });
          if (response.data) {
            setProjects(response.data);
            console.log('TaskCreationPanel: Projects loaded:', response.data.length);
          }
        } catch (projErr) {
          console.error('TaskCreationPanel: Failed to fetch projects dropdown:', projErr);
        }

        // Fetch assignees via Next.js API proxy to bypass CORS
        try {
          // Try assignees endpoint first via proxy
          try {
            const assigneesRes = await axios.get('/api/v1/users/assignees', {
              headers: { Authorization: token },
            });
            if (
              assigneesRes.data &&
              Array.isArray(assigneesRes.data) &&
              assigneesRes.data.length > 0
            ) {
              setAssignees(assigneesRes.data);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Assignees endpoint failed, try general users
          }

          // Fallback to general users list via proxy
          const fallbackRes = await axios.get('/api/v1/users?page=0&size=100&sort=id,desc', {
            headers: { Authorization: token },
          });
          if (fallbackRes.data) {
            const data = fallbackRes.data.data || fallbackRes.data.content || fallbackRes.data;
            if (Array.isArray(data) && data.length > 0) {
              setAssignees(data);
            }
          }
        } catch (err) {
          console.error('TaskCreationPanel: Failed to fetch assignees.');
          if (user) {
            setAssignees([{ id: parseInt(user.userId) || 0, fullName: user.userName + ' (You)' }]);
          }
        }
      } catch (error) {
        console.error('TaskCreationPanel: Unexpected error fetching dropdown data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, user]);

  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getAuthToken();

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        Review: 'REVIEW',
        Completed: 'DONE',
      };

      const payload = {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority.toUpperCase(),
        status: statusMap[taskData.status] || 'TODO',
        assigneeId: parseInt(taskData.assignee),
        projectId: parseInt(taskData.project),
        startDate: taskData.startDate,
        endDate: taskData.endDate,
        recurring: taskData.isRecurring,
        recurrencePattern: taskData.isRecurring ? taskData.recurringPattern : null,
        subTasks: subtasks
          .filter((s) => s.trim() !== '')
          .map((s) => ({
            name: s, // Backend requires 'name' for subtasks
            status: 'TODO',
          })),
      };

      const response = await axios.post(API_ENDPOINTS.tasks.create(), payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status === 200 || response.status === 201) {
        onTaskCreate(response.data);
        onClose();
        // Reset form
        setTaskData({
          title: '',
          description: '',
          priority: 'Medium',
          assignee: '',
          project: '',
          startDate: '',
          endDate: '',
          status: 'To Do',
          isRecurring: false,
          recurringPattern: 'daily',
        });
        setSubtasks(['']);
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      const errorMsg = error.response?.data?.message || 'Failed to create task. Please try again.';
      setErrorMessage(errorMsg);
      setErrorModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none sm:p-4">
        <div className="w-full max-w-4xl bg-card border-x sm:border border-border rounded-none sm:rounded-lg shadow-elevation-3 overflow-hidden flex flex-col h-full max-h-full sm:h-auto sm:max-h-[90vh] pointer-events-auto mx-auto relative animate-fade-in flex flex-col overflow-hidden">
          <div className="sticky top-0 bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                Create New Task
              </h2>
              <p className="font-caption text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">
                Fill in the details to create a new task
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
              aria-label="Close panel"
            >
              <Icon
                name="XMarkIcon"
                size={20}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto"
          >
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Task Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Assignee <span className="text-destructive">*</span>
              </label>
              <select
                value={taskData.assignee}
                onChange={(e) => setTaskData({ ...taskData, assignee: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select assignee</option>
                {assignees.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Priority <span className="text-destructive">*</span>
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
              <select
                value={taskData.status}
                onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={taskData.startDate}
                onChange={(e) => setTaskData({ ...taskData, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={taskData.endDate}
                onChange={(e) => setTaskData({ ...taskData, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Project <span className="text-destructive">*</span>
              </label>
              <select
                value={taskData.project}
                onChange={(e) => setTaskData({ ...taskData, project: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select project</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Description
              </label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe the task in detail"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-muted-foreground">Subtasks</label>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="flex items-center gap-2 text-xs font-caption font-medium text-primary hover:text-primary/80 transition-smooth"
                >
                  <Icon name="PlusIcon" size={14} variant="outline" />
                  Add Subtask
                </button>
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subtask}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Subtask ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(index)}
                      className="p-1.5 rounded-md text-error hover:bg-error/10 transition-smooth"
                      aria-label="Remove subtask"
                    >
                      <Icon name="TrashIcon" size={16} variant="outline" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={taskData.isRecurring}
                  onChange={(e) => setTaskData({ ...taskData, isRecurring: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <label
                  htmlFor="recurring"
                  className="flex-1 font-caption text-sm text-foreground cursor-pointer"
                >
                  Make this a recurring task
                </label>
                {taskData.isRecurring && (
                  <select
                    value={taskData.recurringPattern}
                    onChange={(e) => setTaskData({ ...taskData, recurringPattern: e.target.value })}
                    className="px-3 py-1.5 bg-background border border-border rounded-md font-caption text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-border shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm font-medium text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Icon name="PlusIcon" size={18} variant="outline" />
                    Create Task
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {errorModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setErrorModalOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-elevation-3 w-full max-w-md overflow-hidden animate-scale-up z-[3001]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                  <Icon
                    name="ExclamationTriangleIcon"
                    size={24}
                    variant="outline"
                    className="text-warning"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    Task Creation Failed
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Action Rejected</p>
                </div>
              </div>

              <p className="font-caption text-sm text-muted-foreground leading-relaxed mb-8">
                {errorMessage}
              </p>

              <div className="flex justify-end gap-3 flex-col sm:flex-row">
                <button
                  type="button"
                  onClick={() => setErrorModalOpen(false)}
                  className="flex-1 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 font-caption text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-smooth"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCreationPanel;
