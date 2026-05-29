'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface FilterOptions {
  team: string;
  department: string;
  timePeriod: string;
}

interface WorkloadFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface TeamData {
  id: number;
  name: string;
}

interface DepartmentData {
  id: number;
  name: string;
}

const WorkloadFilters = ({ onFilterChange }: WorkloadFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    team: '',
    department: '',
    timePeriod: 'week',
  });

  const [teams, setTeams] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Select Team' },
  ]);
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Select Department' },
  ]);

  useEffect(() => {
    const fetchTeamsByDepartment = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      };

      try {
        if (!filters.department) {
          setTeams([{ value: '', label: 'Select Team' }]);
          return;
        }

        const url = API_ENDPOINTS.teams.byDepartment(filters.department);
        const response = await axios.get(url, { headers });
        let teamsArray: TeamData[] = [];

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            teamsArray = response.data;
          } else if (response.data?.content && Array.isArray(response.data.content)) {
            teamsArray = response.data.content;
          }
          const teamsOptions = teamsArray.map((t: TeamData) => ({
            value: t.id.toString(),
            label: t.name,
          }));
          const finalTeams = [{ value: '', label: 'Select Team' }, ...teamsOptions];
          setTeams(finalTeams);

          // Auto-select first team if currently empty/Select Team
          if (teamsOptions.length > 0 && (!filters.team || filters.team === '')) {
            handleFilterChange('team', teamsOptions[0].value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
        setTeams([{ value: '', label: 'Select Team' }]);
      }
    };

    fetchTeamsByDepartment();
  }, [filters.department]);

  // Fetch Departments for Dropdown
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: getAuthToken(),
      };

      try {
        const response = await axios.get(API_ENDPOINTS.departments.dropdown(), { headers });

        if (response.status === 200 && response.data) {
          const deptsArray = response.data;
          const departmentsOptions = deptsArray.map((d: any) => ({
            value: d.id.toString(),
            label: d.name,
          }));
          const finalDepts = [{ value: '', label: 'Select Department' }, ...departmentsOptions];
          setDepartments(finalDepts);

          // Auto-select first department if currently empty
          if (departmentsOptions.length > 0 && (!filters.department || filters.department === '')) {
            handleFilterChange('department', departmentsOptions[0].value);
          }
        }
      } catch (error) {
        console.error('Failed to fetch department dropdown:', error);
      }
    };

    fetchDepartmentsData();
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    let newFilters = { ...filters, [key]: value };

    // If department changes, reset team to empty
    if (key === 'department') {
      newFilters.team = '';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const timePeriods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FunnelIcon" size={20} variant="outline" className="text-primary" />
        <h3 className="font-heading font-semibold text-lg text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {departments.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">Team</label>
          <select
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {teams.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-caption text-sm text-muted-foreground mb-2">
            Time Period
          </label>
          <select
            value={filters.timePeriod}
            onChange={(e) => handleFilterChange('timePeriod', e.target.value)}
            className="w-full px-4 py-2 bg-background border border-input rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
          >
            {timePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorkloadFilters;
