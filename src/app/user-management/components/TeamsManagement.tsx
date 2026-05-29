'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { Department } from './DepartmentsManagement';
import { User } from './UserManagementInteractive';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

export interface Team {
  id: string;
  name: string;
  department: string;
  teamLead: string;
  memberCount: number;
  status: 'Active' | 'Inactive';
  description: string;
}

interface TeamsManagementProps {
  onTeamUpdate?: (teams: Team[]) => void;
  departments?: Department[];
  users?: User[];
}

const TeamsManagement = ({ onTeamUpdate, departments = [], users = [] }: TeamsManagementProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState<Omit<Team, 'id'>>({
    name: '',
    department: '',
    teamLead: '',
    memberCount: 0,
    status: 'Active',
    description: '',
  });
  const [fetchedDepartments, setFetchedDepartments] = useState<Department[]>([]);
  const [teamLeads, setTeamLeads] = useState<{ id: string; name: string }[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let filtered = teams;
    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.departments.list()}?search=&status=&page=0&size=1000&sort=id,DESC`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const content = data.content || data;
        const activeDepartments = Array.isArray(content)
          ? content.map((dept: any) => ({ id: dept.id, name: dept.name }) as Department)
          : [];
        setFetchedDepartments(activeDepartments);
      } else {
        console.error('Failed to fetch departments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments(); // Fetch departments on component mount
  }, []);

  const fetchTeamLeads = async (departmentId: string) => {
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
        const leads = data.map((user: any) => ({ id: user.id, name: user.fullName }));
        setTeamLeads(leads);
      } else {
        console.error('Failed to fetch team leads:', response.status);
      }
    } catch (error) {
      console.error('Error fetching team leads:', error);
    }
  };

  useEffect(() => {
    if (formData.department) {
      const selectedDepartment = fetchedDepartments.find(
        (dept) => dept.name === formData.department
      );
      if (selectedDepartment) {
        fetchTeamLeads(selectedDepartment.id);
      }
    }
  }, [formData.department]);

  const handleAddTeam = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      department: '',
      teamLead: '',
      memberCount: 0,
      status: 'Active',
      description: '',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      department: team.department,
      teamLead: team.teamLead,
      memberCount: team.memberCount,
      status: team.status,
      description: team.description,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        const response = await fetch(API_ENDPOINTS.teams.byId(teamId), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after deletion
        } else {
          console.error('Failed to delete team:', response.status);
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const fetchAllTeams = async (search = '', status = '', page = 0, size = 10, sort = 'id,desc') => {
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        page: page.toString(),
        size: size.toString(),
        sort,
      });

      const response = await fetch(`${API_ENDPOINTS.teams.list()}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.content && Array.isArray(data.content)) {
          const formattedTeams = data.content.map((team: any) => {
            const department = team.departmentName || 'Unknown';
            const teamLead = team.teamLeadName || 'Unknown';

            return {
              id: team.id,
              name: team.name,
              department,
              teamLead,
              memberCount: team.memberCount || 0, // Default to 0 if not provided
              status: team.status,
              description: team.description,
            };
          });
          const sortedTeams = formattedTeams.sort(
            (a: any, b: any) => parseInt(b.id) - parseInt(a.id)
          );
          setTeams(sortedTeams);
          setFilteredTeams(sortedTeams);
          setTotalPages(data.totalPages || 0); // Update total pages
          setTotalRecords(data.totalElements || 0); // Update total record count
          onTeamUpdate?.(sortedTeams);
        } else {
          console.error('Unexpected response format: content is missing or not an array', data);
        }
      } else {
        console.error('Failed to fetch teams:', response.status);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAllTeams(searchQuery, '', newPage, 10, 'id,desc'); // Fetch teams for the new page with max 10 records
  };

  useEffect(() => {
    fetchAllTeams(searchQuery, '', currentPage, 10, 'id,desc'); // Fetch teams for the current page with max 10 records
  }, [searchQuery, currentPage]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Team name is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.teamLead) errors.teamLead = 'Team lead is required';
    if (!formData.status) errors.status = 'Status is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTeam = async () => {
    if (!validateForm()) return;

    const updatedTeam = {
      name: formData.name,
      description: formData.description,
      status: formData.status.toUpperCase(), // Ensure status is in uppercase
      departmentId: fetchedDepartments.find((dept) => dept.name === formData.department)?.id,
      teamLeadId: teamLeads.find((lead) => lead.name === formData.teamLead)?.id,
    };

    try {
      if (editingTeam) {
        // Update existing team
        const response = await fetch(API_ENDPOINTS.teams.byId(editingTeam.id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
          body: JSON.stringify(updatedTeam),
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after update
        } else {
          console.error('Failed to update team:', response.status);
        }
      } else {
        // Add new team
        const newTeam = {
          name: formData.name,
          description: formData.description,
          status: formData.status.toUpperCase(), // Ensure status is in uppercase
          departmentId: fetchedDepartments.find((dept) => dept.name === formData.department)?.id,
          teamLeadId: teamLeads.find((lead) => lead.name === formData.teamLead)?.id,
        };

        const response = await fetch(API_ENDPOINTS.teams.create(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
          body: JSON.stringify(newTeam),
        });

        if (response.ok) {
          await fetchAllTeams(); // Refresh teams after adding a new team
        } else {
          const errorText = await response.text();
          console.error('Failed to add team:', response.status, errorText);
        }
      }
    } catch (error) {
      console.error('Error saving team:', error);
    }

    setIsFormOpen(false);
    setEditingTeam(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-xl text-foreground">All Teams</h2>
          <p className="font-caption text-sm text-muted-foreground mt-1">
            {totalRecords} team{totalRecords !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleAddTeam}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl font-caption font-semibold text-sm hover:opacity-95 transition-smooth shadow-sm"
        >
          <Icon name="PlusIcon" size={18} variant="outline" />
          Add Team
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          variant="outline"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search by team name or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Teams Table - Desktop View */}
      <div className="hidden lg:block bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Team Lead
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-caption font-medium text-sm text-foreground">
                        {team.name}
                      </div>
                      <div className="font-caption text-xs text-muted-foreground mt-0.5">
                        {team.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.teamLead}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-caption text-sm text-foreground">{team.memberCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption font-medium text-xs ${
                        team.status === 'Active'
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {team.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-smooth"
                        aria-label="Edit team"
                      >
                        <Icon name="PencilIcon" size={16} variant="outline" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1.5 text-error hover:bg-error/10 rounded transition-smooth"
                        aria-label="Delete team"
                      >
                        <Icon name="TrashIcon" size={16} variant="outline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teams - Mobile View */}
      <div className="lg:hidden space-y-4">
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            className="bg-card border border-border rounded-xl p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h4 className="font-heading font-bold text-sm text-foreground">{team.name}</h4>
                  <p className="font-caption text-[10px] text-muted-foreground uppercase tracking-wider">
                    {team.department}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  team.status === 'Active'
                    ? 'bg-success/10 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {team.status}
              </span>
            </div>

            <p className="font-caption text-xs text-muted-foreground line-clamp-1">
              {team.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Lead
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {team.teamLead.charAt(0)}
                  </div>
                  <span className="text-xs text-foreground font-medium">{team.teamLead}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Members
                </p>
                <span className="text-xs text-foreground font-medium">
                  {team.memberCount} people
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => handleEditTeam(team)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold transition-smooth"
              >
                <Icon name="PencilIcon" size={14} variant="outline" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteTeam(team.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-error/10 text-error rounded-lg text-xs font-bold transition-smooth"
              >
                <Icon name="TrashIcon" size={14} variant="outline" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground font-caption">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex-1 lg:flex-none px-4 py-2 bg-card border border-border text-foreground rounded-lg font-caption font-medium text-sm hover:bg-muted transition-smooth disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 === totalPages}
            className="flex-1 lg:flex-none px-4 py-2 bg-card border border-border text-foreground rounded-lg font-caption font-medium text-sm hover:bg-muted transition-smooth disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl animate-fade-in my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingTeam ? 'Edit Team Details' : 'Create New Team'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
              >
                <Icon name="XMarkIcon" size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Team Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-background border ${formErrors.name ? 'border-error' : 'border-border'} rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth`}
                    placeholder="e.g. Frontend Squad"
                  />
                  {formErrors.name && (
                    <p className="text-error text-xs mt-1 font-medium">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Department <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (formErrors.department) setFormErrors({ ...formErrors, department: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-background border ${formErrors.department ? 'border-error' : 'border-border'} rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth`}
                  >
                    <option value="">Select department</option>
                    {fetchedDepartments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="text-error text-xs mt-1 font-medium">{formErrors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Team Lead <span className="text-error">*</span>
                  </label>
                  <select
                    value={formData.teamLead}
                    onChange={(e) => {
                      setFormData({ ...formData, teamLead: e.target.value });
                      if (formErrors.teamLead) setFormErrors({ ...formErrors, teamLead: '' });
                    }}
                    className={`w-full px-4 py-2.5 bg-background border ${formErrors.teamLead ? 'border-error' : 'border-border'} rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth`}
                  >
                    <option value="">Select team lead</option>
                    {teamLeads.map((lead, index) => (
                      <option key={`${lead.id}-${index}`} value={lead.name}>
                        {lead.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.teamLead && (
                    <p className="text-error text-xs mt-1 font-medium">{formErrors.teamLead}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Status <span className="text-error">*</span>
                  </label>
                  <div className="flex gap-4">
                    {['Active', 'Inactive'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, status: status as 'Active' | 'Inactive' })
                        }
                        className={`flex-1 py-2 rounded-xl border font-caption text-sm font-medium transition-smooth ${
                          formData.status === status
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                    placeholder="Describe the team's core responsibilities..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-muted/20 rounded-b-2xl">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTeam(null);
                }}
                className="px-6 py-2.5 border border-border rounded-xl font-caption font-semibold text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
              >
                Dismiss
              </button>
              <button
                onClick={handleSaveTeam}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-caption font-semibold text-sm hover:opacity-90 shadow-md transition-smooth"
              >
                {editingTeam ? 'Save Changes' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsManagement;
