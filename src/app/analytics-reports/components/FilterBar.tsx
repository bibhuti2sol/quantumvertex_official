'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface FilterBarProps {
  onApplyFilters: (filters: any) => void;
}

const FilterBar = ({ onApplyFilters }: FilterBarProps) => {
  const [filters, setFilters] = useState({
    project: '',
    period: 'last-30-days',
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const [options, setOptions] = useState({
    projects: [] as any[],
    allProjects: [] as any[],
    priorities: ['HIGH', 'MEDIUM', 'LOW'],
    statuses: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
    userMap: {} as Record<number, { departmentId: number; teamId: number }>,
  });

  const isInitialLoad = useRef(true);

  // Status display labels
  const statusLabels: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Review',
    DONE: 'Done',
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        console.log('FilterBar: Fetching projects and users...');

        // Fetch projects via dropdown endpoint
        try {
          const projectsRes = await axios.get(API_ENDPOINTS.projects.dropdown(), {
            headers: { Authorization: token },
          });
          if (projectsRes.data) {
            setOptions((prev) => ({
              ...prev,
              projects: projectsRes.data,
              allProjects: projectsRes.data,
            }));
            console.log('FilterBar: Projects loaded successfully:', projectsRes.data.length);
          }
        } catch (projErr) {
          console.error('FilterBar: Failed to fetch projects dropdown:', projErr);
        }

        // Fetch users via Next.js API proxy to bypass CORS
        try {
          const usersRes = await axios.get('/api/v1/users?page=0&size=500&sort=id,desc', {
            headers: { Authorization: token },
          });
          if (usersRes.data && usersRes.data.content) {
            const content = usersRes.data.content;
            const userMap: Record<number, { departmentId: number; teamId: number }> = {};
            content.forEach((u: any) => {
              if (u.id) {
                userMap[u.id] = { departmentId: u.departmentId || 0, teamId: u.teamId || 0 };
              }
            });

            setOptions((prev) => ({
              ...prev,
              userMap,
            }));
            console.log('FilterBar: Users loaded successfully');
          }
        } catch (userErr) {
          console.warn('FilterBar: Failed to fetch users (expected for non-admin):', userErr);
        }
      } catch (err) {
        console.error('FilterBar: Unexpected error in fetchInitialData:', err);
      }
    };
    fetchInitialData();
  }, []);

  // Initial load complete
  useEffect(() => {
    if (options.allProjects.length > 0 && isInitialLoad.current) {
      isInitialLoad.current = false;
      const initialProject = String(options.allProjects[0].id);
      const initialFilters = { ...filters, project: initialProject };
      setFilters(initialFilters);
      onApplyFilters(initialFilters);
    }
  }, [options.allProjects]);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // If it's not the period changing to custom, we can apply immediately
    // If period is custom, we wait for dates to be picked
    if (key !== 'period' || value !== 'custom') {
      onApplyFilters(newFilters);
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      project: '',
      period: 'last-30-days',
      priority: '',
      status: '',
      startDate: '',
      endDate: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="bg-card border-b border-border px-4 sm:px-6 md:px-8 py-3 flex flex-wrap items-center gap-x-4 gap-y-3">
      {/* Project */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">
          Project
        </label>
        <select
          value={filters.project}
          onChange={(e) => handleChange('project', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary min-w-[140px]"
        >
          <option value="">All Projects</option>
          {options.allProjects.map((p) => (
            <option key={p.id} value={String(p.id)}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Time Period */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">
          Time Period
        </label>
        <div className="flex items-center bg-background border border-border rounded-md px-2 py-1.5 min-w-[140px]">
          <select
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="bg-transparent text-xs font-medium outline-none flex-1"
          >
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-90-days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <Icon
            name="CalendarIcon"
            size={14}
            variant="outline"
            className="text-muted-foreground ml-2"
          />
        </div>
      </div>

      {/* Custom Date Picker */}
      {filters.period === 'custom' && (
        <>
          <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
            <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary h-[34px]"
            />
          </div>
          <div className="flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
            <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary h-[34px]"
            />
          </div>
        </>
      )}

      {/* Task Priority */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">
          Priority
        </label>
        <select
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary"
        >
          <option value="">All Priorities</option>
          {options.priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Task Status */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase px-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary"
        >
          <option value="">All Statuses</option>
          {options.statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s] || s}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="ml-auto mt-auto mb-1 flex items-center gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-1.5 bg-muted text-muted-foreground rounded-md text-xs font-bold hover:bg-muted/80 transition-smooth border border-border"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-5 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-bold hover:bg-primary/90 transition-smooth shadow-sm flex items-center gap-2"
        >
          <Icon name="FunnelIcon" size={14} variant="outline" />
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
