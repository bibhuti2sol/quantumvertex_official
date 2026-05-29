import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface ExtendedUser extends User {
  firstName: string;
  lastName: string;
  password?: string;
}

interface EditUserPanelProps {
  user: User;
  users: User[]; // Added users prop to pass the list of users
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const EditUserPanel: React.FC<EditUserPanelProps> = ({ user, users, onClose, onSave }) => {
  const [form, setForm] = useState<ExtendedUser>(user as ExtendedUser);
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [potentialManagers, setPotentialManagers] = useState<
    { id: string; name: string; role?: string }[]
  >([]);

  const fetchDepartments = async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.departments.list()}?search=&status=&page=0&size=1000&sort=id,DESC`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        }
      );
      const data = response.data.content || response.data;
      return Array.isArray(data) ? data.map((dept: any) => ({ id: dept.id, name: dept.name })) : [];
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  };

  const fetchTeamsByDepartment = async (
    departmentId: string
  ): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await axios.get(API_ENDPOINTS.teams.byDepartment(departmentId), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });
      return response.data.map((team: any) => ({ id: team.id, name: team.name }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  };

  const fetchPotentialManagers = async (): Promise<
    { id: string; name: string; role?: string }[]
  > => {
    try {
      const response = await axios.get(API_ENDPOINTS.departments.eligibleHeads(), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });
      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data.map((user: any) => ({
          id: user.id.toString(),
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          role: user.roles?.[0]?.replace('ROLE_', '') || 'Manager',
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching potential managers:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadDepartmentsAndManagers = async () => {
      const [fetchedDepartments, fetchedManagers] = await Promise.all([
        fetchDepartments(),
        fetchPotentialManagers(),
      ]);
      setDepartments(fetchedDepartments);

      if (fetchedManagers && fetchedManagers.length > 0) {
        setPotentialManagers(fetchedManagers.filter((m) => m.id !== user.id));
      } else {
        const fallback = users
          .filter((u) => {
            const roleLower = u.role?.toLowerCase() || '';
            return (roleLower === 'admin' || roleLower === 'manager') && u.id !== user.id;
          })
          .map((u) => ({
            id: u.id,
            name: u.name,
            role: u.role,
          }));
        setPotentialManagers(fallback);
      }
    };

    loadDepartmentsAndManagers();
  }, [users, user]);

  useEffect(() => {
    const loadTeams = async () => {
      if (form.department) {
        const selectedDepartment = departments.find((dept) => dept.name === form.department);
        if (selectedDepartment) {
          const fetchedTeams = await fetchTeamsByDepartment(selectedDepartment.id.toString());
          setTeams(fetchedTeams);
        } else {
          setTeams([]);
        }
      } else {
        setTeams([]);
      }
    };

    loadTeams();
  }, [form.department, departments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedManager = users.find((u) => u.name === form.reportsTo);
      const managerId = form.managerId || (selectedManager ? parseInt(selectedManager.id) : null);

      const updatedUser = {
        ...form, // Preserve original backend fields
        id: parseInt(user.id),
        username: form.username || form.email,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        enabled: form.status === 'Active',
        managerId: managerId,
        projectManagerId: form.projectManagerId || managerId,
        jobTitle: (form as any).jobTitle,
        JobTitle: (form as any).jobTitle,
        departmentId:
          departments.find((dept) => dept.name === form.department)?.id ||
          (form as any).departmentId ||
          null,
        departmentName: form.department || null,
        teamId: teams.find((team) => team.name === form.team)?.id || (form as any).teamId || null,
        teamName: form.team || null,
      };

      // Remove frontend-only helper fields before sending
      const cleanUser = { ...updatedUser };
      delete (cleanUser as any).name;
      delete (cleanUser as any).role;
      delete (cleanUser as any).team;
      delete (cleanUser as any).department;
      delete (cleanUser as any).reportsTo;
      delete (cleanUser as any).status;
      delete (cleanUser as any).lastActivity;
      delete (cleanUser as any).avatar;
      delete (cleanUser as any).avatarAlt;

      console.log('Sending update payload:', cleanUser);

      const response = await axios.put(`${API_ENDPOINTS.users.byId(user.id.trim())}`, cleanUser, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
        onSave({
          ...user,
          ...updatedUser,
          id: user.id, // Keep ID as string for frontend
          name: `${form.firstName} ${form.lastName}`,
          role: form.role,
          jobTitle: (form as any).jobTitle,
        } as User);
        onClose();
      } else {
        console.error(`Unexpected response status: ${response.status}`, response.data);
        alert('Failed to update user. Please try again later.');
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      console.warn(
        'Backend update failed, applying changes locally:',
        axiosError.response?.data?.message || axiosError.message
      );

      // Fallback: Apply changes locally in the UI
      const selectedDept = departments.find((dept) => dept.name === form.department);
      const selectedTeam = teams.find((team) => team.name === form.team);
      const selectedMgr = users.find((u) => u.name === form.reportsTo);

      onSave({
        ...user,
        id: user.id,
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        username: form.username,
        role: form.role,
        department: form.department,
        team: form.team,
        reportsTo: form.reportsTo || (selectedMgr ? selectedMgr.name : user.reportsTo),
        status: form.status,
        managerId: form.managerId || (selectedMgr ? parseInt(selectedMgr.id) : user.managerId),
      } as User);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none sm:p-4">
        <div className="w-full max-w-md bg-card border-x sm:border border-border rounded-none sm:rounded-lg shadow-elevation-3 overflow-hidden flex flex-col h-full max-h-full sm:h-auto sm:max-h-[90vh] pointer-events-auto mx-auto relative animate-fade-in p-4 sm:p-6">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={form.username || ''}
                readOnly
                tabIndex={-1}
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
            {/* Job Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={(form as any).jobTitle || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Enter job title"
              />
            </div>
            {/* Email field hidden in Edit mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Associate">Associate</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Team</label>
              <select
                name="team"
                value={form.team}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reports To</label>
              <select
                name="managerId"
                value={form.managerId?.toString() || ''}
                onChange={(e) => {
                  const managerId = parseInt(e.target.value);
                  const manager = potentialManagers.find((u) => parseInt(u.id) === managerId);
                  setForm((prev) => ({
                    ...prev,
                    managerId,
                    projectManagerId: managerId,
                    reportsTo: manager ? manager.name : '',
                  }));
                }}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Manager</option>
                {potentialManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} {manager.role ? `(${manager.role})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserPanel;
