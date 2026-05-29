'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './UserTable';
import UserFilters from './UserFilters';
import UserFormPanel from './UserFormPanel';
import DeleteConfirmModal from './DeleteConfirmModal';
import TeamsManagement from './TeamsManagement';
import DepartmentsManagement from './DepartmentsManagement';
import Icon from '@/components/ui/AppIcon';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  username?: string;
  role: 'Admin' | 'Manager' | 'Associate';
  team: string;
  department: string;
  reportsTo: string;
  managerId?: number | null;
  projectManagerId?: number | null;
  jobTitle?: string;
  status: 'Active' | 'Inactive';
  lastActivity: string;
  avatar: string;
  avatarAlt: string;
  doj?: string;
  empId?: string;
}

// Update the `Department` interface to include `head` and `teamCount`.
export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: string; // Existing property
  head: string; // Added property
  teamCount: number; // Added property
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

type TabType = 'users' | 'teams' | 'departments';

const UserManagementInteractive = () => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('departments');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const fetchUsers = async (page = 0, size = 100) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: 'id,desc',
      });

      const apiUrl = `${API_ENDPOINTS.users.list()}?${queryParams.toString()}`;
      console.log(`Fetching users from ${apiUrl}...`);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken(),
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result.content || result;

        if (Array.isArray(data)) {
          const apiUsers: User[] = data.map((user: any) => ({
            ...user,
            id: user.id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            username: user.username,
            role:
              user.roles?.[0]?.replace('ROLE_', '') === 'ADMIN'
                ? 'Admin'
                : user.roles?.[0]?.replace('ROLE_', '') === 'MANAGER'
                  ? 'Manager'
                  : 'Associate',
            team: user.teamName || 'General',
            department: user.departmentName || 'General',
            reportsTo: user.managerName || 'None',
            managerId: user.managerId || null,
            projectManagerId: user.projectManagerId || user.managerId || null,
            jobTitle: user.jobTitle || '',
            status: user.enabled ? 'Active' : 'Inactive',
            lastActivity: user.lastActivity || 'Unknown',
            avatar: 'https://via.placeholder.com/150',
            avatarAlt: `${user.firstName} ${user.lastName} profile picture`,
            doj: user.doj || 'N/A',
            empId: user.employeeId || user.empId || 'N/A',
          }));

          const sortedUsers = apiUsers.sort((a, b) => parseInt(b.id) - parseInt(a.id));
          setUsers(sortedUsers);
          setFilteredUsers(sortedUsers);
          console.log(`Successfully loaded ${apiUsers.length} users.`);
        } else if (result.content && Array.isArray(result.content)) {
          // Handle paginated response if it's nested differently
          const contentUsers = result.content.map((user: any) => ({
            ...user,
            id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            role:
              user.roles?.[0]?.replace('ROLE_', '') === 'ADMIN'
                ? 'Admin'
                : user.roles?.[0]?.replace('ROLE_', '') === 'MANAGER'
                  ? 'Manager'
                  : 'Associate',
            status: user.enabled ? 'Active' : 'Inactive',
            jobTitle: user.jobTitle || '',
            lastActivity: user.lastActivity || 'Unknown',
            doj: user.doj || 'N/A',
            empId: user.employeeId || user.empId || 'N/A',
          }));
          setUsers(contentUsers as any);
          setFilteredUsers(contentUsers as any);
        } else {
          console.error('Unexpected response format:', result);
        }
      } else {
        console.error(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: '',
        status: '',
        page: '0',
        size: '1000',
        sort: 'id,DESC',
      });
      const response = await axios.get(
        `${API_ENDPOINTS.departments.list()}?${queryParams.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        }
      );
      if (response.status === 200) {
        const data = response.data;
        if (data.content && Array.isArray(data.content)) {
          setDepartments(data.content);
        } else if (Array.isArray(data)) {
          setDepartments(data);
        }
      }
    } catch (error) {
      console.error('Error fetching departments in UserManagementInteractive:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  // Global UI Override - Disabled temporarily for debugging
  /*
  useEffect(() => {
    const applyFieldRestrictions = () => {
      const modalTitles = document.querySelectorAll('h2');
      const isEditMode = Array.from(modalTitles).some(h2 => h2.textContent?.includes('Edit User'));
      
      if (isEditMode) {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
          const label = input.parentElement?.querySelector('label')?.textContent?.toLowerCase() || '';
          const name = input.getAttribute('name')?.toLowerCase() || '';
          const placeholder = input.getAttribute('placeholder')?.toLowerCase() || '';
          
          const isUsername = name === 'username' || label.includes('username');
          const isEmail = name === 'email' || label.includes('email') || placeholder.includes('@');

          if (isUsername || isEmail) {
            (input as any).readOnly = true;
            input.style.backgroundColor = '#f3f4f6';
            input.style.color = '#6b7280';
            input.style.cursor = 'not-allowed';
            input.setAttribute('tabindex', '-1');
            
            if (isUsername) {
              const creationTitle = Array.from(modalTitles).some(h2 => h2.textContent?.includes('Add New User'));
              if (creationTitle) {
                const container = input.closest('div');
                if (container) container.style.display = 'none';
              }
            }
          }
        });
      }
    };

    const observer = new MutationObserver(applyFieldRestrictions);
    observer.observe(document.body, { childList: true, subtree: true });
    applyFieldRestrictions();
    return () => observer.disconnect();
  }, []);
  */

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'All') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply team filter
    if (teamFilter !== 'All') {
      filtered = filtered.filter((user) => user.team === teamFilter);
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, teamFilter, statusFilter, users]);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(API_ENDPOINTS.users.byId(userId), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        });

        if (response.ok) {
          setUsers(users.filter((u) => u.id !== userId)); // Remove user from state
          setFilteredUsers(filteredUsers.filter((u) => u.id !== userId)); // Update filtered users
        } else {
          const errorData = await response.json();
          console.error('Failed to delete user:', response.status, errorData);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete));
      setSelectedUsers(selectedUsers.filter((id) => id !== userToDelete));
    }
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length > 0) {
      setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
    }
  };

  const handleBulkStatusChange = (newStatus: 'Active' | 'Inactive') => {
    setUsers(users.map((u) => (selectedUsers.includes(u.id) ? { ...u, status: newStatus } : u)));
    setSelectedUsers([]);
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'lastActivity' | 'avatar' | 'avatarAlt'>) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...userData, lastActivity: 'Just now' } : u
        )
      );
    } else {
      // Add new user
      const newUser: User = {
        ...userData,
        id: (userData as any).id || Date.now().toString(), // Use backend provided ID if available
        lastActivity: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        avatarAlt: `${userData.name} profile picture`,
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
    fetchUsers(); // Auto Reload
  };

  const tabs = [
    { id: 'departments' as TabType, label: 'Departments', icon: 'BuildingOfficeIcon' },
    { id: 'teams' as TabType, label: 'Teams', icon: 'UsersIcon' },
    { id: 'users' as TabType, label: 'Users', icon: 'UserIcon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div className={`transition-smooth ${sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'}`}>
        <main className="flex-1 transition-smooth">
          <div className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="flex items-center justify-between h-[72px] px-4 sm:px-6 md:px-8">
              <div className="flex items-center gap-4">
                <button
                  className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsSidebarMobileOpen(true)}
                >
                  <Icon name="Bars3Icon" size={24} variant="outline" />
                </button>
                <div>
                  <h1 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    User Management
                  </h1>
                  <p className="font-caption text-xs sm:text-sm text-muted-foreground hidden xs:block">
                    Manage users, teams, and organizational hierarchy
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="h-8 w-px bg-border" />
                <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6" suppressHydrationWarning>
            {/* Tab Navigation */}
            <div className="border-b border-border overflow-x-auto custom-scrollbar">
              <div className="flex gap-1 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-caption font-medium text-sm transition-smooth relative ${
                      activeTab === tab.id
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon as any} size={18} variant="outline" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && (
              <>
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading font-semibold text-xl text-foreground">
                      All Users
                    </h2>
                    <p className="font-caption text-sm text-muted-foreground mt-1">
                      {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  <button
                    onClick={handleAddUser}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl font-caption font-semibold text-sm hover:opacity-95 transition-smooth shadow-sm"
                  >
                    <Icon name="PlusIcon" size={18} variant="outline" />
                    Add User
                  </button>
                </div>

                {/* Filters */}
                <UserFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  roleFilter={roleFilter}
                  onRoleFilterChange={setRoleFilter}
                  teamFilter={teamFilter}
                  onTeamFilterChange={setTeamFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                />

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <span className="font-caption text-sm text-foreground">
                      {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBulkStatusChange('Active')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md text-xs font-caption font-medium text-success hover:bg-success/20 transition-smooth"
                      >
                        <Icon name="CheckCircleIcon" size={14} variant="outline" />
                        Activate
                      </button>
                      <button
                        onClick={() => handleBulkStatusChange('Inactive')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-md text-xs font-caption font-medium text-warning hover:bg-warning/20 transition-smooth"
                      >
                        <Icon name="XCircleIcon" size={14} variant="outline" />
                        Deactivate
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth"
                      >
                        <Icon name="TrashIcon" size={14} variant="outline" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* User Table */}
                <UserTable
                  users={filteredUsers}
                  selectedUsers={selectedUsers}
                  onSelectUsers={setSelectedUsers}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                />

                {/* User Form Panel */}
                <UserFormPanel
                  isOpen={isFormOpen}
                  onClose={() => {
                    setIsFormOpen(false);
                    setEditingUser(null);
                  }}
                  onSave={handleSaveUser}
                  editingUser={editingUser}
                  existingUsers={users}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmModal
                  isOpen={deleteModalOpen}
                  onClose={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                  }}
                  onConfirm={confirmDelete}
                  userName={users.find((u) => u.id === userToDelete)?.name || ''}
                />
              </>
            )}

            {/* Teams Tab */}
            {activeTab === 'teams' && <TeamsManagement departments={departments} users={users} />}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <DepartmentsManagement onDepartmentUpdate={setDepartments} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagementInteractive;
