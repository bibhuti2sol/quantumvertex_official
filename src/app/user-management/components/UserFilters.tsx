'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  teamFilter: string;
  onTeamFilterChange: (team: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const UserFilters = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  teamFilter,
  onTeamFilterChange,
  statusFilter,
  onStatusFilterChange,
}: UserFiltersProps) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      // Replace the API call with a placeholder or mock data
      const response = { data: [] }; // Mocked empty data
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Icon
              name="MagnifyingGlassIcon"
              size={18}
              variant="outline"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Associate">Associate</option>
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <select
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="All">All Teams</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Support">Support</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <span className="font-caption text-xs text-muted-foreground">Status:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStatusFilterChange('All')}
              className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium transition-smooth ${
                statusFilter === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusFilterChange('Active')}
              className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium transition-smooth ${
                statusFilter === 'Active'
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onStatusFilterChange('Inactive')}
              className={`px-3 py-1.5 rounded-md font-caption text-xs font-medium transition-smooth ${
                statusFilter === 'Inactive'
                  ? 'bg-error text-error-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
