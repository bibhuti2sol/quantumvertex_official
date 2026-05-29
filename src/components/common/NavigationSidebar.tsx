'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useUser } from './UserContext';
import { removeAuthCookie } from '@/utils/auth';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  iconColor: string;
  notificationCount?: number;
  allowedRoles?: Array<'Admin' | 'Manager' | 'Associate'>;
}

interface NavigationSidebarProps {
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  userRole?: 'Admin' | 'Manager' | 'Associate';
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NavigationSidebar = ({
  isCollapsed = false,
  onCollapsedChange,
  userRole,
  isMobileOpen = false,
  onMobileClose,
}: NavigationSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [mounted, setMounted] = useState(false);

  let currentRole: 'Admin' | 'Manager' | 'Associate' = 'Associate';
  const rawRole = user?.userRole || userRole || 'Associate';

  if (rawRole === 'Admin') {
    currentRole = 'Admin';
  } else if (rawRole === 'Manager') {
    currentRole = 'Manager';
  } else {
    currentRole = 'Associate';
  }

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'HomeIcon',
      iconColor: '#3b82f6', // blue-500
      notificationCount: 0,
    },
    {
      label: 'Organization',
      path: '/organization',
      icon: 'BuildingOfficeIcon',
      iconColor: '#8b5cf6', // violet-500
      notificationCount: 0,
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'UserGroupIcon',
      iconColor: '#f59e0b', // amber-500
      notificationCount: 0,
      allowedRoles: ['Admin'], // Only Admin can access
    },
    {
      label: 'Projects',
      path: '/project-overview',
      icon: 'FolderIcon',
      iconColor: '#10b981', // emerald-500
      notificationCount: 2,
    },
    {
      label: 'Tasks',
      path: '/task-management',
      icon: 'ClipboardDocumentListIcon',
      iconColor: '#ef4444', // red-500
      notificationCount: 5,
    },
    {
      label: 'Team',
      path: '/team-workload',
      icon: 'UsersIcon',
      iconColor: '#06b6d4', // cyan-500
      notificationCount: 0,
    },
    {
      label: 'Analytics',
      path: '/analytics-reports',
      icon: 'ChartBarIcon',
      iconColor: '#f97316', // orange-500
      notificationCount: 0,
    },
    {
      label: 'Profile',
      path: '/user-profile-settings',
      icon: 'UserCircleIcon',
      iconColor: '#ec4899', // pink-500
      notificationCount: 0,
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (!item.allowedRoles) return true; // No role restriction
    return item.allowedRoles.includes(currentRole);
  });

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    onCollapsedChange?.(newState);
  };

  const handleLogout = () => {
    // Clear all stored user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');

    // Clear cookie
    removeAuthCookie();

    // Dispatch storage event to notify UserContext
    window.dispatchEvent(new Event('storage'));

    // Redirect to login page
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] md:hidden transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-card border-r border-border transition-smooth z-[1000] ${
          collapsed ? 'w-[60px]' : 'w-[240px]'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        suppressHydrationWarning
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-[72px] px-4 border-b border-border">
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center gap-3">
                <img
                  src="/assets/images/nextgentask-logo.png"
                  alt="NextGenTask Logo"
                  className="w-12 h-12 rounded-xl shadow-lg"
                  style={{ objectFit: 'cover' }}
                />
                <div className="flex flex-col ml-2">
                  <span className="font-heading font-bold text-xl text-primary">NextGenTask</span>
                  <span className="font-caption text-base text-success">
                    {user?.userRole || 'User'}
                  </span>
                </div>
              </Link>
            )}
            {collapsed && (
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-full flex-shrink-0"
              >
                <img
                  src="/assets/images/nextgentask-logo.png"
                  alt="NextGenTask Logo"
                  className="w-10 h-10 rounded-xl shadow-lg flex-shrink-0"
                  style={{ objectFit: 'cover' }}
                />
              </Link>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {filteredNavigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md transition-smooth group relative ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon
                      name={item.icon as any}
                      size={24}
                      variant="outline"
                      className="flex-shrink-0"
                      style={{ color: isActive(item.path) ? undefined : item.iconColor }}
                    />
                    {!collapsed && (
                      <span className="font-caption font-medium text-sm truncate flex-1">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Toggle Button */}
          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-3 py-3 mb-2 rounded-md text-error hover:bg-error/10 transition-smooth"
              aria-label="Logout"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={24} variant="outline" />
              {!collapsed && <span className="font-caption font-medium text-sm">Logout</span>}
            </button>
            <button
              onClick={handleToggleCollapse}
              className="w-full flex items-center justify-center gap-3 px-3 py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon
                name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
                size={24}
                variant="outline"
              />
              {!collapsed && <span className="font-caption font-medium text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
