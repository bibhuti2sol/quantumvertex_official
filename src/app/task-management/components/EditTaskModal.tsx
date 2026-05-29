import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';
import { useUser } from '@/components/common/UserContext';

export interface EditTaskModalProps {
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
    projectId?: number;
    description: string;
    comments: string;
  };
  onSave: (updated: any) => void;
  onClose: () => void;
}

interface ProjectOption {
  id: number;
  name: string;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onSave, onClose }) => {
  const { user } = useUser();
  const isAssociate = user?.userRole === 'Associate';

  const [form, setForm] = useState({
    ...task,
    projectId: task.projectId || '',
  });
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const token = getAuthToken();
        const response = await axios.get(API_ENDPOINTS.projects.dropdown(), {
          headers: { Authorization: token },
        });
        if (response.data) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('EditTaskModal: Failed to fetch projects dropdown:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure project name is updated based on selected projectId if needed
    const selectedProj = projects.find((p) => p.id.toString() === form.projectId.toString());
    const finalForm = {
      ...form,
      project: selectedProj ? selectedProj.name : form.project,
      projectId: form.projectId === '' ? null : parseInt(form.projectId.toString()),
    };
    onSave(finalForm);
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40">
      <form
        className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar"
        onSubmit={handleSubmit}
      >
        <h2 className="font-heading text-xl font-bold mb-4 text-foreground">Edit Task</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Assignee</label>
            <input
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">End Date</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                disabled={isAssociate}
                title={isAssociate ? 'Associates cannot change the End Date' : ''}
                className={`w-full px-3 py-2 rounded border border-border text-foreground ${isAssociate ? 'bg-muted cursor-not-allowed opacity-70' : 'bg-background'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Progress (%)</label>
            <input
              name="progress"
              type="number"
              min="0"
              max="100"
              value={form.progress}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Project</label>
            <select
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
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
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition-smooth"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskModal;
