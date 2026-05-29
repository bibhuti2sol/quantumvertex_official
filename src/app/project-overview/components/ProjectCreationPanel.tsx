'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import ErrorModal from './ErrorModal';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface ProjectCreationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
}

export interface ProjectFormData {
  id: string; // Added `id` property
  name: string; // Added `name` property
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
  priority: 'High' | 'Medium' | 'Low';
  projectManager: string;
  teamMembers: string[];
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  progress: number; // Added `progress` property
  team: number; // Added `team` property
}

const ProjectCreationPanel = ({ isOpen, onClose, onSubmit }: ProjectCreationPanelProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    id: '',
    name: '',
    projectName: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    priority: 'Medium',
    projectManager: '',
    teamMembers: [],
    status: 'Planning',
    progress: 0, // Initialize progress
    team: 0, // Initialize team
  });
  const [projectType, setProjectType] = useState<'normal' | 'budget'>('normal');
  const [projectManagers, setProjectManagers] = useState<{ id: number; fullName: string }[]>([]); // Store both id and fullName
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProjectManagers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.teams.eligibleLeads(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Project Managers:', data); // Log the API response for debugging

        if (Array.isArray(data) && data.length > 0) {
          const managers = data
            .filter((manager: any) => manager.id && manager.fullName) // Filter out invalid data
            .map((manager: any) => ({ id: manager.id, fullName: manager.fullName }));

          setProjectManagers(managers);
        } else {
          console.warn('No valid project managers found in the response:', data);
        }
      } else {
        console.error('Failed to fetch project managers:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching project managers:', error);
    }
  };

  useEffect(() => {
    fetchProjectManagers();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (projectType === 'budget' && !formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }

    if (!formData.projectManager.trim()) {
      newErrors.projectManager = 'Project manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const statusMapping: Record<string, string> = {
        Planning: 'PLANNING',
        'In Progress': 'IN_PROGRESS', // Required by Backend Enum
        'On Hold': 'ON_HOLD',
        Completed: 'COMPLETED',
      };

      const projectData = {
        name: formData.projectName,
        description: formData.description,
        type: projectType.toUpperCase(),
        budget: parseFloat(formData.budget.toString().replace(/[^0-9.]/g, '')),
        startDate: formData.startDate,
        endDate: formData.endDate,
        priority: formData.priority.toUpperCase(),
        projectManagerId: parseInt(formData.projectManager),
        status: statusMapping[formData.status] || 'PLANNING',
      };

      try {
        const response = await fetch(API_ENDPOINTS.projects.create(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
          body: JSON.stringify(projectData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Project created successfully:', result);
          onSubmit(formData);
          handleReset();
        } else {
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              setErrorMessage(errorData.message);
            } else {
              setErrorMessage('Failed to create project. Please try again.');
            }
          } catch (e) {
            setErrorMessage('Failed to create project. An unexpected error occurred.');
          }
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Error creating project:', error);
        setErrorMessage('Failed to create project. An unexpected error occurred.');
        setShowErrorModal(true);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      id: '',
      name: '',
      projectName: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      priority: 'Medium',
      projectManager: '',
      teamMembers: [],
      status: 'Planning',
      progress: 0, // Reset progress
      team: 0, // Reset team
    });
    setErrors({});
  };

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] pointer-events-auto mx-auto mt-auto sm:mt-0">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">Create New Project</h2>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                Fill in the details to create a new project
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-smooth"
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
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Project Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.projectName ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter project name"
              />
              {errors.projectName && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.projectName}</p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Project Type <span className="text-destructive">*</span>
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as 'normal' | 'budget')}
                className="w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth border-border"
              >
                <option value="normal">Normal</option>
                <option value="budget">Budget</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  handleChange('status', e.target.value as ProjectFormData['status'])
                }
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth resize-none ${
                  errors.description ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Describe the project objectives and scope"
              />
              {errors.description && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Start Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.startDate ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.startDate}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                End Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.endDate ? 'border-destructive' : 'border-border'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 font-caption text-xs text-destructive">{errors.endDate}</p>
              )}
            </div>

            {/* Project Manager */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Project Manager <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.projectManager}
                onChange={(e) => handleChange('projectManager', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.projectManager ? 'border-destructive' : 'border-border'
                }`}
              >
                <option value="">Select project manager</option>
                {projectManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.fullName}
                  </option>
                ))}
              </select>
              {errors.projectManager && (
                <p className="mt-1 font-caption text-xs text-destructive">
                  {errors.projectManager}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block font-caption text-sm font-medium text-foreground mb-1">
                Priority
              </label>
              <div className="flex gap-2">
                {(['High', 'Medium', 'Low'] as const).map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleChange('priority', priority)}
                    className={`flex-1 px-3 py-2 rounded-md font-caption text-sm font-medium transition-smooth ${
                      formData.priority === priority
                        ? priority === 'High'
                          ? 'bg-destructive text-destructive-foreground'
                          : priority === 'Medium'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget (only for Budget type) */}
            {projectType === 'budget' && (
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block font-caption text-sm font-medium text-foreground mb-1">
                  Budget <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-caption text-sm">
                    INR
                  </span>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    className={`w-full pl-8 pr-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                      errors.budget ? 'border-destructive' : 'border-border'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 font-caption text-xs text-destructive">{errors.budget}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm font-medium text-foreground hover:bg-muted transition-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
              >
                <Icon name="PlusIcon" size={18} variant="outline" />
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Project Creation Failed"
        message={errorMessage}
      />
    </>
  );
};

export default ProjectCreationPanel;
