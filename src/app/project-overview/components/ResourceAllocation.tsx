'use client';

import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  allocation: number;
  availability: 'available' | 'busy' | 'unavailable';
  currentTasks: number;
  capacity: number;
}

interface ResourceAllocationProps {
  onReallocation?: (memberId: string, newAllocation: number) => void;
  currentRole?: 'Admin' | 'Manager' | 'Associate';
}

interface DepartmentData {
  id: number;
  name: string;
}

interface TeamData {
  id: number;
  name: string;
}

const ResourceAllocation = ({
  onReallocation,
  currentRole = 'Manager',
}: ResourceAllocationProps) => {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [realTeamMembers, setRealTeamMembers] = useState<TeamMember[]>([]);
  const [assignees, setAssignees] = useState<{ id: string; name: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [newMemberCapacity, setNewMemberCapacity] = useState('10');

  // Filter States
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Select Department' },
  ]);
  const [teams, setTeams] = useState<{ value: string; label: string }[]>([
    { value: '', label: 'Select Team' },
  ]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Deduplicated Fetch Function with Pagination
  const fetchResourceAllocationData = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });
      if (selectedDept) queryParams.append('departmentId', selectedDept);
      if (selectedTeam) queryParams.append('teamId', selectedTeam);

      const token = getAuthToken();
      const response = await fetch(
        `${API_ENDPOINTS.resourceAllocation.list()}?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.content || (Array.isArray(data) ? data : []);

        // Handle total pages and elements
        const totalElems = data.totalElements || content.length;
        const totalPgs = data.totalPages || Math.ceil(totalElems / pageSize);

        setTotalPages(totalPgs);
        setTotalElements(totalElems);

        const members: TeamMember[] = content.map((item: any) => ({
          id: item.userId?.toString() || item.id?.toString() || Math.random().toString(),
          name: item.fullName || item.userName || item.name || 'Unknown User',
          role: item.jobTitle || item.role || 'Team Member',
          avatar:
            item.profilePictureUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(item.fullName || 'User')}&background=random`,
          alt: item.fullName || 'User avatar',
          allocation: item.allocationPercentage || item.utilization || 0,
          availability: (item.allocationPercentage || 0) >= 90 ? 'busy' : 'available',
          currentTasks: item.assignedTaskCount || item.activeTasksCount || item.taskCount || 0,
          capacity: item.capacity || 10,
        }));
        setRealTeamMembers(members);
      } else {
        console.error('ResourceAllocation: API failed with status:', response.status);
      }
    } catch (error) {
      console.error('ResourceAllocation: Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDept, selectedTeam, currentPage]);

  // Fetch Departments for Dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.departments.dropdown(), {
          headers: { Authorization: getAuthToken() },
        });

        if (response.status === 200 && response.data) {
          const deptsArray = response.data;
          const options = deptsArray.map((d: any) => ({ value: d.id.toString(), label: d.name }));
          setDepartments([{ value: '', label: 'Select Department' }, ...options]);
        }
      } catch (error) {
        console.error('Failed to fetch department dropdown:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Teams when department changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedDept) {
        setTeams([{ value: '', label: 'Select Team' }]);
        setSelectedTeam('');
        return;
      }

      try {
        const response = await axios.get(API_ENDPOINTS.teams.byDepartment(selectedDept), {
          headers: { Authorization: getAuthToken() },
        });

        let teamsArray: TeamData[] = [];
        if (response.status === 200) {
          if (Array.isArray(response.data)) teamsArray = response.data;
          else if (response.data?.content) teamsArray = response.data.content;

          const options = teamsArray.map((t) => ({ value: t.id.toString(), label: t.name }));
          setTeams([{ value: '', label: 'Select Team' }, ...options]);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    };
    fetchTeams();
  }, [selectedDept]);

  // Fetch Resource Allocation Data based on filters/pagination
  useEffect(() => {
    fetchResourceAllocationData();
  }, [fetchResourceAllocationData]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Fetch assignees for the Add Member modal
  useEffect(() => {
    const fetchAssignees = async () => {
      if (!showAddMember) return;

      try {
        const response = await axios.get(API_ENDPOINTS.users.assigneesDropdown(), {
          headers: { Authorization: getAuthToken() },
        });

        if (response.status === 200) {
          const data = response.data;
          const content = Array.isArray(data) ? data : data.content || [];
          const assigneeList = content.map((item: any) => ({
            id: item.id?.toString() || item.userId?.toString() || Math.random().toString(),
            name: item.fullName || item.name || item.userName || 'Unknown Assignee',
          }));
          setAssignees(assigneeList);
        }
      } catch (error) {
        console.error('Failed to fetch assignees:', error);
      }
    };

    fetchAssignees();
  }, [showAddMember]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId || !newMemberCapacity) return;

    setIsAdding(true);
    try {
      const response = await axios.put(
        API_ENDPOINTS.users.updateCapacity(),
        {
          assigneeId: parseInt(newMemberId),
          capacity: parseInt(newMemberCapacity),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setShowAddMember(false);
        setNewMemberId('');
        setNewMemberCapacity('10');
        fetchResourceAllocationData();
      }
    } catch (error) {
      console.error('Failed to add member capacity:', error);
      alert('Failed to update capacity. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'unavailable':
        return 'bg-error';
      default:
        return 'bg-muted';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  const allMembers = realTeamMembers;
  const membersToDisplay = allMembers;

  const effectiveTotalElements = totalElements;
  const effectiveTotalPages = totalPages;

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Resource Allocation
          </h3>
          {(currentRole === 'Admin' || currentRole === 'Manager') && (
            <button
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth"
              onClick={() => setShowAddMember(true)}
            >
              <Icon name="UserPlusIcon" size={18} variant="outline" />
              <span className="font-caption text-sm">Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-6 border-b border-border bg-muted/10">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="FunnelIcon" size={18} variant="outline" className="text-primary" />
          <span className="font-caption font-semibold text-sm text-foreground">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-caption text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-bold">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-caption text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-bold">
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth"
            >
              {teams.map((team) => (
                <option key={team.value} value={team.value}>
                  {team.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="p-6 relative min-h-[200px] flex-1">
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="space-y-4">
          {membersToDisplay.length > 0 ? (
            membersToDisplay.map((member) => (
              <div
                key={member.id}
                className={`bg-background border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 cursor-pointer ${
                  selectedMember === member.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMember(member.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <AppImage
                        src={member.avatar}
                        alt={member.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getAvailabilityColor(
                        member.availability
                      )}`}
                    />
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-caption font-semibold text-sm text-foreground">
                        {member.name}
                      </h4>
                      <span className="font-caption text-xs text-muted-foreground">•</span>
                      <span className="font-caption text-xs text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Icon
                          name="ClipboardDocumentListIcon"
                          size={14}
                          variant="outline"
                          className="text-muted-foreground"
                        />
                        <span className="font-caption text-xs text-muted-foreground">
                          {member.currentTasks} / {member.capacity} tasks
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-caption font-medium ${getAvailabilityColor(
                          member.availability
                        )} text-white`}
                      >
                        {getAvailabilityText(member.availability)}
                      </span>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-heading font-bold text-lg text-foreground">
                        {member.allocation.toFixed(1)}%
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">Allocated</p>
                    </div>
                    {(currentRole === 'Admin' || currentRole === 'Manager') && (
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-smooth"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMemberId(member.id);
                        }}
                      >
                        <Icon
                          name="PencilIcon"
                          size={16}
                          variant="outline"
                          className="text-muted-foreground"
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Allocation Bar */}
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        member.allocation >= 90
                          ? 'bg-error'
                          : member.allocation >= 70
                            ? 'bg-warning'
                            : 'bg-success'
                      }`}
                      style={{ width: `${member.allocation}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Icon
                name="UserGroupIcon"
                size={48}
                className="mx-auto text-muted-foreground/20 mb-3"
              />
              <p className="text-muted-foreground font-caption text-sm">
                No members found matching the filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {effectiveTotalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <p className="font-caption text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min((currentPage + 1) * pageSize, effectiveTotalElements)}
            </span>{' '}
            of <span className="font-medium text-foreground">{effectiveTotalElements}</span> members
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(effectiveTotalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                    currentPage === i
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === effectiveTotalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {(currentRole === 'Admin' || currentRole === 'Manager') && showAddMember && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40">
          <form
            className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md"
            onSubmit={handleAddMember}
          >
            <h2 className="font-heading text-xl font-bold mb-4 text-foreground">Add Team Member</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-foreground">Member Name</label>
              <select
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                required
              >
                <option value="">Select member</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-foreground">Capacity</label>
              <input
                type="number"
                min="1"
                value={newMemberCapacity}
                onChange={(e) => setNewMemberCapacity(e.target.value)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                disabled={isAdding}
                className="px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAdding}
                className="px-4 py-2 rounded bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth disabled:opacity-50 flex items-center gap-2"
              >
                {isAdding && (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                )}
                {isAdding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Smart Workload Balancing */}
      <div className="px-6 pb-6 mt-4">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon
                name="LightBulbIcon"
                size={18}
                variant="solid"
                className="text-accent-foreground"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2">
                Smart Workload Balancing Recommendation
              </h4>
              <p className="font-caption text-sm text-muted-foreground leading-relaxed mb-3">
                Ensure resources are balanced to optimize team workload and prevent burnout.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-smooth">
                <Icon name="ArrowPathIcon" size={16} variant="outline" />
                <span className="font-caption text-sm font-medium">Apply Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
