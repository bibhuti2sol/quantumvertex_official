import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
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

interface EditTaskProps {
  task: {
    id: string;
    title: string;
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
    startDate: string;
    endDate: string;
    progress: number;
    project: string;
    description: string;
    comments: string;
  };
  onSave: (updated: any) => void;
  onClose: () => void;
  assigneeOptions: string[];
  projectOptions: string[];
}

const EditTask = ({ task, onSave, onClose, assigneeOptions, projectOptions }: EditTaskProps) => {
  const { user } = useUser();
  const isAssociate = user?.userRole === 'Associate';
  const [title, setTitle] = useState(task?.title || '');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [priority, setPriority] = useState(task?.priority || 'Low');
  const [status, setStatus] = useState(task?.status || 'To Do');
  const [startDate, setStartDate] = useState(task?.startDate || '');
  const [endDate, setEndDate] = useState(task?.endDate || '');
  const [progress, setProgress] = useState(task?.progress || 0);
  const [project, setProject] = useState(task?.project || '');
  const [description, setDescription] = useState(task?.description || '');
  const [taskId, setTaskId] = useState(task?.id || '');

  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      const token = getAuthToken();
      if (!token) return;

      // Fetch projects via dropdown endpoint
      try {
        const projectsRes = await axios.get(API_ENDPOINTS.projects.dropdown(), {
          headers: { Authorization: token },
        });
        if (projectsRes.data) {
          setProjects(projectsRes.data);
        }
      } catch (projErr) {
        console.error('EditTask: Failed to fetch projects dropdown:', projErr);
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
            setLoadingOptions(false);
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
        console.error('EditTask: Failed to fetch assignees.');
        if (user) {
          setAssignees([{ id: parseInt(user.userId) || 0, fullName: user.userName }]);
        }
      }
      setLoadingOptions(false);
    };

    fetchOptions();
  }, [user]);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const token = getAuthToken();

      const foundAssignee = assignees.find((a) => a.fullName === assignee);
      const foundProject = projects.find((p) => p.name === project);

      const payload = {
        title,
        description,
        priority: priority.toUpperCase(),
        status:
          status === 'To Do'
            ? 'TODO'
            : status === 'In Progress'
              ? 'IN_PROGRESS'
              : status === 'Review'
                ? 'REVIEW'
                : 'DONE',
        assigneeId: foundAssignee ? foundAssignee.id : null,
        projectId: foundProject ? foundProject.id : null,
        startDate,
        endDate,
        recurring: false, // Defaulting as not present in simple form
      };

      const response = await axios.put(API_ENDPOINTS.tasks.byId(taskId), payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status === 200) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none sm:p-4 md:p-6">
        <div className="w-full max-w-4xl bg-card border-x sm:border border-border rounded-none sm:rounded-lg shadow-elevation-3 overflow-hidden flex flex-col h-full max-h-full sm:h-auto sm:max-h-[85vh] pointer-events-auto mx-auto relative animate-fade-in">
          <div className="sticky top-0 bg-card border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                Edit Task
              </h2>
              <p className="font-caption text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">
                Update task details and progress
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

          <div className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto">
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task Title"
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              >
                <option value="">Select Assignee</option>
                {assignees.length > 0
                  ? assignees.map((option) => (
                      <option key={option.id} value={option.fullName}>
                        {option.fullName}
                      </option>
                    ))
                  : assigneeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'To Do' | 'In Progress' | 'Review' | 'Completed')
                }
                disabled={task.status === 'Completed'}
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isAssociate}
                title={isAssociate ? 'Associates cannot change the End Date' : ''}
                className={`border border-border rounded-lg px-4 py-2 w-full ${isAssociate ? 'bg-muted cursor-not-allowed opacity-70 text-muted-foreground' : 'bg-background text-foreground'}`}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              >
                <option value="">Select Project</option>
                {projects.length > 0
                  ? projects.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))
                  : projectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="border border-border rounded-lg px-4 py-2 w-full h-20 resize-none bg-background text-foreground"
              />
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
                type="button"
                onClick={handleSave}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Icon name="PencilIcon" size={18} variant="outline" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTask;
