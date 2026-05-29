'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import EditUserPanel from './EditUserPanel';
import type { User } from './UserManagementInteractive';

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectUsers: (ids: string[]) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const UserTable = ({
  users,
  selectedUsers,
  onSelectUsers,
  onEditUser,
  onDeleteUser,
}: UserTableProps) => {
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const paginatedUsers = users.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Reset to first page when users list changes (e.g. filters applied)
  useEffect(() => {
    setCurrentPage(0);
  }, [users.length]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectUsers([]);
    } else {
      onSelectUsers(users.map((u) => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      onSelectUsers([...selectedUsers, userId]);
    }
  };

  const handleEditUser = (user: User) => {
    console.log('Edit user triggered for:', user); // Debug log
    setSelectedUser(user);
    setIsEditPanelOpen(true);
    console.log('isEditPanelOpen:', isEditPanelOpen); // Debug log
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Admin':
        return 'text-error bg-error/10';
      case 'Manager':
        return 'text-warning bg-warning/10';
      case 'Associate':
        return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status: User['status']) => {
    return status === 'Active' ? 'text-success bg-success/10' : 'text-muted-foreground bg-muted';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden w-full max-w-full shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  User
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('jobTitle' as keyof User)}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Job Title
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Role
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('team')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Team
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Department
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('reportsTo')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Reports To
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('doj' as keyof User)}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  DOJ
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('empId' as keyof User)}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  EMP_ID
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Status
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-muted-foreground hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Last Activity
                  <Icon name="ChevronUpDownIcon" size={14} variant="outline" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/30 transition-smooth"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-caption font-medium text-sm text-foreground">
                        {user.name}
                      </p>
                      <p className="font-caption text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.jobTitle || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full font-caption text-xs font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-caption text-sm text-foreground">{user.team}</p>
                    <p className="font-caption text-xs text-muted-foreground">{user.department}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.department || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.reportsTo || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.doj || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.empId || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-foreground">{user.status}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="font-caption text-sm text-muted-foreground">{user.lastActivity}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditUser(user)}
                      className="p-2 rounded-md text-primary hover:bg-primary/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Edit user"
                    >
                      <Icon name="PencilIcon" size={16} variant="outline" />
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="p-2 rounded-md text-error hover:bg-error/10 transition-smooth"
                      aria-label="Delete user"
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

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-caption font-bold text-sm text-foreground">{user.name}</p>
                  <p className="font-caption text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full font-caption text-[10px] font-bold uppercase tracking-wider ${getRoleColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Team
                </p>
                <p className="text-xs text-foreground font-medium">{user.team}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Status
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded font-caption text-[10px] font-bold ${getStatusColor(user.status)}`}
                >
                  {user.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Reports To
                </p>
                <p className="text-xs text-foreground font-medium">{user.reportsTo || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  DOJ
                </p>
                <p className="text-xs text-foreground font-medium">{user.doj || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  EMP_ID
                </p>
                <p className="text-xs text-foreground font-medium">{user.empId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  Last Activity
                </p>
                <p className="text-xs text-muted-foreground font-medium">{user.lastActivity}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleEditUser(user)}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold transition-smooth"
              >
                <Icon name="PencilIcon" size={14} variant="outline" />
                Edit
              </button>
              <button
                onClick={() => onDeleteUser(user.id)}
                className="flex items-center gap-2 px-3 py-1.5 bg-error/10 text-error rounded-lg text-xs font-bold transition-smooth"
              >
                <Icon name="TrashIcon" size={14} variant="outline" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="py-12 text-center">
          <Icon
            name="UsersIcon"
            size={48}
            variant="outline"
            className="mx-auto text-muted-foreground mb-4"
          />
          <p className="font-caption text-sm text-muted-foreground">
            No users found matching your filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalRecords > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 gap-4 bg-muted/10 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 >= totalPages}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-caption font-medium text-sm hover:bg-primary/90 transition-smooth disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isEditPanelOpen && selectedUser && (
        <EditUserPanel
          user={selectedUser}
          users={users} // Pass the list of users to the EditUserPanel
          onClose={() => setIsEditPanelOpen(false)}
          onSave={(updatedUser) => {
            console.log('User saved:', updatedUser); // Debug log
            const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
            onSelectUsers(updatedUsers.map((u) => u.id));
            setIsEditPanelOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default UserTable;
