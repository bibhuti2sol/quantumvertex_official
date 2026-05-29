'use client';

import React from 'react';
import axios from 'axios';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onNewTask?: () => void;
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
  currentRole?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export interface FilterState {
  priority: string[];
  assignee: string[];
  assigneeIds: number[];
  project: string[];
  projectIds: number[];
  status: string[];
  dateRange: { start: string; end: string } | null;
}

const FilterToolbar = ({
  filters,
  onFilterChange,
  onNewTask,
  onExport,
  currentRole,
  searchQuery = '',
  onSearchChange,
}: FilterToolbarProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showExportDropdown, setShowExportDropdown] = React.useState(false);

  // Local input value — updates immediately so the field feels instant
  const [inputValue, setInputValue] = React.useState(searchQuery);

  // Debounce: only propagate the search query 300ms after the user stops typing
  React.useEffect(() => {
    if (!onSearchChange) return;
    const timer = setTimeout(() => {
      onSearchChange(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const priorities = ['High', 'Medium', 'Low'];
  const [assignees, setAssignees] = React.useState<{ id: number; fullName: string }[]>([]);
  const [dynamicProjects, setDynamicProjects] = React.useState<{ id: number; name: string }[]>([]);
  const statuses = ['To Do', 'In Progress', 'Review', 'Completed'];

  React.useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        // Use Next.js API proxy to bypass CORS
        try {
          const response = await axios.get('/api/v1/users/assignees', {
            headers: { Authorization: token },
          });
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            setAssignees(response.data.map((u: any) => ({ id: u.id, fullName: u.fullName })));
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
            setAssignees(data.map((u: any) => ({ id: u.id, fullName: u.fullName })));
          }
        }
      } catch (error: any) {
        console.error('FilterToolbar: Failed to fetch assignees:', error.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        console.log('FilterToolbar: Fetching projects for dropdown...');
        const response = await axios.get(API_ENDPOINTS.projects.dropdown(), {
          headers: { Authorization: token },
        });

        if (response.data) {
          setDynamicProjects(
            response.data.map((p: any) => ({ id: p.id, name: p.name || p.title }))
          );
          console.log('FilterToolbar: Projects loaded:', response.data.length);
        }
      } catch (error: any) {
        console.error('FilterToolbar: Failed to fetch projects dropdown:', error.message);
      }
    };

    fetchAssignees();
    fetchProjects();
  }, []);

  const handleFilterToggle = (
    category: 'priority' | 'assignee' | 'project' | 'status',
    value: string
  ) => {
    const newFilters = { ...filters };
    const currentValues = newFilters[category];

    if (currentValues.includes(value)) {
      newFilters[category] = currentValues.filter((v) => v !== value);
    } else {
      newFilters[category] = [...currentValues, value];
    }

    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterState = {
      priority: [],
      assignee: [],
      assigneeIds: [],
      project: [],
      projectIds: [],
      status: [],
      dateRange: null,
    };
    onFilterChange(emptyFilters);
  };

  const activeFilterCount =
    filters.priority.length +
    filters.assignee.length +
    filters.project.length +
    filters.status.length +
    (filters.dateRange ? 1 : 0);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border gap-3 flex-wrap">
        {/* Left: Search + Filters toggle */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Search input */}
          {onSearchChange !== undefined && (
            <div className="relative w-48 shrink-0">
              <Icon
                name="MagnifyingGlassIcon"
                size={16}
                variant="outline"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
          >
            <Icon name="FunnelIcon" size={20} variant="outline" />
            <span className="font-caption font-medium text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <Icon
              name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
              size={16}
              variant="outline"
            />
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-caption text-muted-foreground hover:text-foreground transition-smooth"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onExport && (
            <div className="relative">
              <button
                onClick={() => setShowExportDropdown(!showExportDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth"
              >
                <Icon name="DocumentArrowDownIcon" size={18} variant="outline" />
                <span className="font-caption text-sm hidden sm:inline">Export Report</span>
              </button>
              {showExportDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded shadow-lg z-50">
                  {(['csv', 'pdf', 'xlsx'] as const).map((format) => (
                    <button
                      key={format}
                      className="w-full text-left px-4 py-2 hover:bg-muted font-caption text-sm uppercase"
                      onClick={() => {
                        onExport(format);
                        setShowExportDropdown(false);
                      }}
                    >
                      Download {format}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition-smooth"
            >
              <Icon name="PlusIcon" size={18} variant="outline" />
              <span className="font-caption text-sm hidden sm:inline">New Task</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">
                Priority
              </label>
              <select
                value={filters.priority[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, priority: val ? [val] : [] };
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">
                Assignee
              </label>
              <select
                value={filters.assignee[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const selectedAssignee = assignees.find((a) => a.fullName === val);
                  const newFilters = {
                    ...filters,
                    assignee: val ? [val] : [],
                    assigneeIds: selectedAssignee ? [selectedAssignee.id] : [],
                  };
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Assignees</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.fullName}>
                    {a.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">
                Project
              </label>
              <select
                value={filters.project[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const selectedProject = dynamicProjects.find((p) => p.name === val);
                  const newFilters = {
                    ...filters,
                    project: val ? [val] : [],
                    projectIds: selectedProject ? [selectedProject.id] : [],
                  };
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Projects</option>
                {dynamicProjects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-caption text-sm text-muted-foreground mb-2">
                Status
              </label>
              <select
                value={filters.status[0] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const newFilters = { ...filters, status: val ? [val] : [] };
                  onFilterChange(newFilters);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="pt-2 border-t border-border flex justify-end">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-caption font-semibold border border-error/30 text-error bg-error/5 hover:bg-error/15 transition-smooth"
            >
              <Icon name="XMarkIcon" size={14} variant="outline" />
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;
