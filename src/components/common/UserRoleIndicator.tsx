'use client';

import { useState } from 'react';
import { useUser } from './UserContext';
import Icon from '@/components/ui/AppIcon';

interface UserRoleIndicatorProps {
  currentRole: 'Admin' | 'Manager' | 'Associate';
  userName?: string;
  isCollapsed?: boolean;
  onRoleChange?: (role: 'Admin' | 'Manager' | 'Associate') => void;
}

const UserRoleIndicator = (props: Partial<UserRoleIndicatorProps>) => {
  const { user, setUser } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const rawRole = user?.userRole || 'Associate';
  let currentRole: 'Admin' | 'Manager' | 'Associate' = 'Associate';

  if (rawRole === 'Admin') {
    currentRole = 'Admin';
  } else if (rawRole === 'Manager') {
    currentRole = 'Manager';
  } else {
    currentRole = 'Associate';
  }

  const userName = user?.userName || 'User';
  const isCollapsed = props.isCollapsed ?? false;

  const roleColors = {
    Admin: 'bg-error text-error-foreground',
    Manager: 'bg-warning text-warning-foreground',
    Associate: 'bg-success text-success-foreground',
  };

  const roleIcons = {
    Admin: 'ShieldCheckIcon',
    Manager: 'BriefcaseIcon',
    Associate: 'UserIcon',
  };

  const handleRoleSelect = (role: 'Admin' | 'Manager' | 'Associate') => {
    setUser({ userName, userRole: role, userId: user?.userId || '0' });
    setShowDropdown(false);
    if (props.onRoleChange) props.onRoleChange(role);
  };

  return (
    <div className="relative">
      <div
        className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-muted-foreground bg-muted hover:bg-muted/80 cursor-pointer transition-smooth border border-transparent hover:border-border"
        aria-label="User role and settings"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${roleColors[currentRole]}`}
        >
          <Icon name={roleIcons[currentRole] as any} size={18} variant="solid" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 text-left hidden md:block">
            <p className="font-caption font-medium text-sm text-foreground">{userName}</p>
            <p className="font-caption text-xs text-muted-foreground">{currentRole}</p>
          </div>
        )}
        {!isCollapsed && (
          <Icon name="ChevronUpDownIcon" size={16} className="text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2">
          {(['Admin', 'Manager', 'Associate'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelect(role)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-smooth ${
                currentRole === role ? 'bg-primary/5 text-primary' : 'text-foreground'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${roleColors[role]} opacity-80`}
              >
                <Icon name={roleIcons[role] as any} size={14} variant="solid" />
              </div>
              <span className="font-caption font-medium text-sm">{role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRoleIndicator;
