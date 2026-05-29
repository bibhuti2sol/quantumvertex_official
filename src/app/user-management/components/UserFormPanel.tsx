'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { User } from './UserManagementInteractive';
import axios, { AxiosError } from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

import SuccessModal from '@/components/common/SuccessModal';

interface UserFormPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>) => void;
  editingUser: User | null;
  existingUsers: User[];
}

const UserFormPanel = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
  existingUsers,
}: UserFormPanelProps) => {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Associate';
    team: string;
    department: string;
    reportsTo: string;
    managerId?: number | null;
    projectManagerId?: number | null;
    status: 'Active' | 'Inactive';
    username: string; // Added username field
  }>({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    role: 'Associate',
    team: '',
    department: '',
    reportsTo: '',
    managerId: null,
    projectManagerId: null,
    status: 'Active',
    username: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]>(
    []
  );
  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [potentialManagers, setPotentialManagers] = useState<
    { id: string; name: string; role?: string }[]
  >([]);

  // Success Modal States
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tempSavedUser, setTempSavedUser] = useState<any>(null);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        jobTitle: editingUser.jobTitle || '',
        email: editingUser.email,
        role: (editingUser.role as 'Admin' | 'Manager' | 'Associate') || 'Associate',
        team: editingUser.team,
        department: editingUser.department,
        reportsTo: editingUser.reportsTo,
        managerId: editingUser.managerId,
        projectManagerId: editingUser.projectManagerId,
        status: editingUser.status,
        username: editingUser.email, // Or editingUser.username if available
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        jobTitle: '',
        email: '',
        role: 'Associate',
        team: '',
        department: '',
        reportsTo: '',
        managerId: null,
        projectManagerId: null,
        status: 'Active',
        username: '',
      });
    }
    setErrors({});
    setShowSuccessModal(false);
  }, [editingUser, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    /* Username hidden as per user request */

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.team) {
      newErrors.team = 'Team is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.reportsTo) {
      newErrors.reportsTo = 'Reporting manager is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (tempSavedUser) {
      onSave(tempSavedUser);
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const userData = {
          username: formData.username || formData.email, // Use explicit username or fallback to email
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roles: [formData.role].map((role) => {
            // "Associate" maps to ROLE_USER as the backend does not have ROLE_ASSOCIATE
            if (role === 'Associate') return 'ROLE_USER';
            return `ROLE_${role.toUpperCase()}`;
          }),
          departmentId: parseInt(formData.department),
          teamId: parseInt(formData.team),
          managerId: formData.managerId,
          projectManagerId: formData.projectManagerId || formData.managerId,
          jobTitle: formData.jobTitle,
          organizationId: 1, // Updated to 1 as per typical organization ID in response
        };

        console.log('Sending save user data:', userData);

        let response;
        if (editingUser) {
          // Edit user via PUT request
          response = await axios.put(API_ENDPOINTS.users.byId(editingUser.id), userData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: getAuthToken(),
            },
          });
        } else {
          // Create new user via POST request
          response = await axios.post(API_ENDPOINTS.users.create(), userData, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: getAuthToken(),
            },
          });
        }

        if (response.status === 200 || response.status === 201) {
          console.log('User saved successfully:', response.data);
          const savedUser = response.data.data || response.data;

          const finalUserData = {
            ...userData,
            id: savedUser.id?.toString() || editingUser?.id,
            name: `${formData.firstName} ${formData.lastName}`,
            role: formData.role,
          };

          // Trigger Success Modal
          if (response.data.message) {
            setSuccessMessage(response.data.message);
            setTempSavedUser(finalUserData);
            setShowSuccessModal(true);
          } else {
            onSave(finalUserData as any);
            onClose();
          }
        } else {
          console.error(`Unexpected response status: ${response.status}`, response.data);
          alert('Failed to save user. Please try again later.');
        }
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        console.error('Error saving user:', axiosError);

        if (axiosError.response) {
          console.error('Server responded with:', axiosError.response.data);
          const serverMessage =
            axiosError.response.data?.message || `Server error: ${axiosError.response.status}`;
          alert(`Failed to save user: ${serverMessage}`);
        } else {
          console.error('No response received from server:', axiosError.message);
          alert('Failed to save user. Please check your network connection.');
        }
      }
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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

  const fetchUsers = async (): Promise<
    Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]
  > => {
    try {
      // Replace the API call with a placeholder or mock data
      const response = { data: [] }; // Mocked empty data
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

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
      return Array.isArray(data) ? data : [];
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [depts, managers] = await Promise.all([fetchDepartments(), fetchPotentialManagers()]);
        setDepartments(depts);
        if (managers && managers.length > 0) {
          setPotentialManagers(managers.filter((m) => m.id !== editingUser?.id));
        } else {
          // Fallback to filtering existingUsers
          const fallback = existingUsers
            .filter((u) => {
              const roleLower = u.role?.toLowerCase() || '';
              return (roleLower === 'admin' || roleLower === 'manager') && u.id !== editingUser?.id;
            })
            .map((u) => ({
              id: u.id,
              name: u.name,
              role: u.role,
            }));
          setPotentialManagers(fallback);
        }
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, existingUsers, editingUser]);

  useEffect(() => {
    const loadTeams = async () => {
      if (formData.department) {
        try {
          const fetchedTeams = await fetchTeamsByDepartment(formData.department);
          setTeams(fetchedTeams);
        } catch (error) {
          console.error('Error loading teams:', error);
        }
      } else {
        setTeams([]);
      }
    };

    loadTeams();
  }, [formData.department]);

  const handleSave = (users: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>[]) => {
    // Update the existingUsers state with the fetched users
    setUsers((prevUsers) => [...prevUsers, ...users]);
  };

  const handleSaveUsers = async () => {
    const users = await fetchUsers();
    handleSave(users); // Pass the entire array to handleSave
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2001] pointer-events-none sm:p-4 md:p-6">
        <div
          className="w-full max-w-4xl bg-card border-x sm:border border-border rounded-none sm:rounded-lg shadow-elevation-3 overflow-hidden flex flex-col h-full max-h-full sm:h-auto sm:max-h-[90vh] pointer-events-auto mx-auto relative animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="font-caption text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">
                {editingUser
                  ? 'Update user details and permissions'
                  : 'Fill in the details to create a new user'}
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
            className="p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto"
          >
            {/* First Name */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                First Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.firstName ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter first name"
                required
              />
              {errors.firstName && (
                <p className="mt-1 font-caption text-xs text-error">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Last Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.lastName ? 'border-error' : 'border-border'
                }`}
                placeholder="Enter last name"
                required
              />
              {errors.lastName && (
                <p className="mt-1 font-caption text-xs text-error">{errors.lastName}</p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
                placeholder="Enter job title"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="user@nextgentask.com"
              />
              {errors.email && (
                <p className="mt-1 font-caption text-xs text-error">{errors.email}</p>
              )}
            </div>

            {/* Role (Radio Buttons) */}
            <div className="sm:col-span-2">
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Role <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-6 px-4 py-2 bg-background border border-border rounded-md h-[38px]">
                <label className="flex items-center gap-2 font-caption text-sm cursor-pointer text-foreground">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    checked={formData.role === 'Admin'}
                    onChange={() => handleInputChange('role', 'Admin')}
                    className="form-radio text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  />
                  Admin
                </label>
                <label className="flex items-center gap-2 font-caption text-sm cursor-pointer text-foreground">
                  <input
                    type="radio"
                    name="role"
                    value="Manager"
                    checked={formData.role === 'Manager'}
                    onChange={() => handleInputChange('role', 'Manager')}
                    className="form-radio text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  />
                  Manager
                </label>
                <label className="flex items-center gap-2 font-caption text-sm cursor-pointer text-foreground">
                  <input
                    type="radio"
                    name="role"
                    value="Associate"
                    checked={formData.role === 'Associate'}
                    onChange={() => handleInputChange('role', 'Associate')}
                    className="form-radio text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  />
                  Associate
                </label>
              </div>
              {errors.role && <p className="mt-1 font-caption text-xs text-error">{errors.role}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Status <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Reports To */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Reports To <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.managerId?.toString() || ''}
                onChange={(e) => {
                  const managerId = parseInt(e.target.value);
                  const manager = potentialManagers.find((m) => parseInt(m.id) === managerId);
                  setFormData({
                    ...formData,
                    managerId: managerId,
                    projectManagerId: managerId,
                    reportsTo: manager ? manager.name : '',
                  });
                  if (errors.reportsTo) setErrors({ ...errors, reportsTo: '' });
                }}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.reportsTo ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select manager</option>
                {potentialManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} {manager.role ? `(${manager.role})` : ''}
                  </option>
                ))}
              </select>
              {errors.reportsTo && (
                <p className="mt-1 font-caption text-xs text-error">{errors.reportsTo}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Department <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.department ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 font-caption text-xs text-error">{errors.department}</p>
              )}
            </div>

            {/* Team */}
            <div>
              <label className="block font-caption font-medium text-sm text-foreground mb-1">
                Team <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                className={`w-full px-4 py-2 bg-background border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
                  errors.team ? 'border-error' : 'border-border'
                }`}
              >
                <option value="">Select team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.team && <p className="mt-1 font-caption text-xs text-error">{errors.team}</p>}
            </div>

            {/* Info Box */}
            <div className="sm:col-span-2 lg:col-span-4 flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <Icon
                name="InformationCircleIcon"
                size={20}
                variant="outline"
                className="text-primary flex-shrink-0 mt-0.5"
              />
              <div>
                <p className="font-caption text-sm text-foreground font-medium mb-0.5">
                  User Hierarchy
                </p>
                <p className="font-caption text-xs text-muted-foreground">
                  Associates report to Managers or Admins. Managers report to Admins. This hierarchy
                  determines access levels and approval workflows.
                </p>
              </div>
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
                <Icon name={editingUser ? 'PencilIcon' : 'PlusIcon'} size={18} variant="outline" />
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Registration successful!"
        subtitle="Final Action Required"
        message={successMessage}
        buttonText="Confirm completion"
      />
    </>
  );
};

export default UserFormPanel;
