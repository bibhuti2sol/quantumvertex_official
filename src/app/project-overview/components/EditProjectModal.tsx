'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

export interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    status: 'planning' | 'in-progress' | 'on-hold' | 'completed';
    progress: number;
    startDate: string;
    endDate: string;
    owner: string;
    budget: string;
    team: number;
    priority: 'High' | 'Medium' | 'Low';
    description: string;
    projectType?: 'normal' | 'budget';
  };
  onSave: (updatedProject: EditProjectModalProps['project']) => void;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState({
    ...project,
    projectType: project.projectType || 'normal',
  });
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.teams.eligibleLeads(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const mappedUsers: User[] = (data || []).map((manager: any) => ({
        id: manager.id.toString(),
        name: manager.fullName,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback data for development purposes
      setUsers([
        { id: '1', name: 'Sarah Johnson' },
        { id: '2', name: 'Michael Chen' },
        { id: '3', name: 'Emily Rodriguez' },
        { id: '4', name: 'David Kim' },
        { id: '5', name: 'Jessica Taylor' },
        { id: '6', name: 'Amanda Wilson' },
      ]);
    }
  };

  useEffect(() => {
    setForm({
      ...project,
      projectType: project.projectType || 'normal',
    });
  }, [project]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'team' || name === 'progress' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] pointer-events-auto mx-auto mt-auto sm:mt-0">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">Edit Project</h2>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                Update project details and settings
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

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto"
          >
            {/* Project Name */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label
                htmlFor="projectName"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="name"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.status}
                onChange={handleChange}
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label
                htmlFor="progress"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Progress (%)
              </label>
              <input
                type="number"
                id="progress"
                name="progress"
                min="0"
                max="100"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.progress}
                onChange={handleChange}
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>

            {/* Project Manager */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Project Manager
              </label>
              <select
                id="owner"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="">Select Project Manager</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Project Type */}
            <div>
              <label
                htmlFor="projectType"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.projectType}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="budget">Budget</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget"
                className="block font-caption text-sm font-medium text-foreground mb-1"
              >
                Budget
              </label>
              <input
                type="text"
                id="budget"
                name="budget"
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                value={form.budget}
                onChange={handleChange}
              />
            </div>

            {/* Action Buttons */}
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
              >
                <Icon name="PencilIcon" size={18} variant="outline" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProjectModal;
