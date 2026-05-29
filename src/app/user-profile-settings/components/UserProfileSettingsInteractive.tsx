'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import ThemeToggle from '@/components/common/ThemeToggle';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import PersonalInfoSection from './PersonalInfoSection';
import NotificationPreferences from './NotificationPreferences';
import SecuritySettings from './SecuritySettings';
import AppearanceSettings from './AppearanceSettings';
import PrivacyDataSettings from './PrivacyDataSettings';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  departmentId?: number;
  jobTitle: string;
  location: string;
  timezone: string;
  profileImage?: string;
}

interface NotificationSettings {
  emailNotifications: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    deadlineReminders: boolean;
    escalations: boolean;
    weeklyDigest: boolean;
  };
  popupNotifications: {
    taskUpdates: boolean;
    mentions: boolean;
    comments: boolean;
    realTimeCollaboration: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily';
}

const sanitizeProfileImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('ui-avatars.com') || url.startsWith('data:')) {
    return url;
  }
  try {
    const apiHost = new URL(API_BASE_URL).host;
    let sanitized = url;

    // Replace localhost and IP hosts
    sanitized = sanitized.replace('localhost:8080', apiHost);
    sanitized = sanitized.replace('43.205.137.114:8080', apiHost);
    sanitized = sanitized.replace('43.205.137.114', apiHost);

    // Force HTTPS if it is an external URL pointing to our API host
    if (sanitized.includes(apiHost) && sanitized.startsWith('http://')) {
      sanitized = sanitized.replace('http://', 'https://');
    }

    // Prepend base URL for relative paths
    if (sanitized.startsWith('/')) {
      const baseWithoutSuffix = API_BASE_URL.replace('/api/v1', '');
      sanitized = `${baseWithoutSuffix}${sanitized}`;
    }

    return sanitized;
  } catch (e) {
    return url;
  }
};

const UserProfileSettingsInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'security' | 'appearance' | 'privacy'
  >('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const profileFileRef = useRef<File | null>(null);

  const { user, setUser } = useUser();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobTitle: '',
    location: '',
    timezone: 'Asia/Kolkata',
    profileImage: '',
    departmentId: 1,
  });

  const [notificationSettings] = useState<NotificationSettings>({
    emailNotifications: {
      taskAssigned: true,
      taskCompleted: true,
      deadlineReminders: true,
      escalations: true,
      weeklyDigest: false,
    },
    popupNotifications: {
      taskUpdates: true,
      mentions: true,
      comments: false,
      realTimeCollaboration: true,
    },
    frequency: 'instant',
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [density, setDensity] = useState<'comfortable' | 'compact' | 'spacious'>('comfortable');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.users.profile(), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        });

        if (response.data) {
          const userData = response.data;

          let profileImg = sanitizeProfileImageUrl(userData.profilePictureUrl || '');

          if (userData.id) {
            try {
              const picResponse = await axios.get(
                API_ENDPOINTS.users.getProfilePicture(userData.id),
                {
                  headers: {
                    Authorization: getAuthToken(),
                  },
                  responseType: 'blob',
                }
              );

              const contentType =
                picResponse.headers['content-type'] || picResponse.data?.type || '';
              if (contentType.includes('application/json')) {
                const jsonText = await picResponse.data.text();
                const jsonData = JSON.parse(jsonText);
                let fetchedImg = jsonData.profilePictureUrl || jsonData.url || jsonText;
                if (fetchedImg) {
                  profileImg = sanitizeProfileImageUrl(fetchedImg);
                }
              } else {
                const imageUrl = URL.createObjectURL(picResponse.data);
                profileImg = imageUrl;
              }
            } catch (picErr) {
              console.warn('Error fetching profile picture from getProfilePicture API:', picErr);
            }
          }

          setPersonalInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phoneNumber || '+91 98765 43210',
            department: userData.departmentName || 'Engineering',
            departmentId: userData.departmentId || 1,
            jobTitle: userData.jobTitle || 'Team Member',
            location: userData.address || 'New Delhi, India',
            timezone: userData.timezone || 'Asia/Kolkata',
            profileImage:
              profileImg ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName || 'User')}&background=random`,
          });

          // Sync role and name in context if needed
          const userName =
            userData.fullName || user?.userName || localStorage.getItem('userName') || 'User';
          const userId =
            userData.id?.toString() || user?.userId || localStorage.getItem('userId') || '0';

          // Determine role: prioritize API response, then fallback to current context/localStorage
          let detectedRoleRaw =
            userData.role ||
            (userData.roles && userData.roles[0]) ||
            (userData.authorities && userData.authorities[0]?.authority);

          // Initial value from context or storage
          const storedRole = localStorage.getItem('userRole');
          let userRole: 'Admin' | 'Manager' | 'Associate' =
            (user?.userRole as any) || (storedRole as any) || 'Associate';

          if (detectedRoleRaw) {
            const roleStr = String(detectedRoleRaw).toUpperCase();
            if (roleStr === 'ROLE_ADMIN' || roleStr === 'ADMIN') userRole = 'Admin';
            else if (roleStr === 'ROLE_MANAGER' || roleStr === 'MANAGER') userRole = 'Manager';
            else if (roleStr === 'ROLE_USER' || roleStr === 'ASSOCIATE' || roleStr === 'USER')
              userRole = 'Associate';
          }

          // Only update if there's a change or if context was empty
          setUser({ userName, userRole, userId });

          // Persist to storage just in case to keep everything in sync
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userId', userId);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    setIsHydrated(true);
  }, []);

  const handleImageUpload = (file: File) => {
    console.log('handleImageUpload: File selected:', file.name);
    profileFileRef.current = file;
    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    setPersonalInfo((prev) => ({ ...prev, profileImage: previewUrl }));
  };

  const handlePersonalInfoSave = async (data: PersonalInfo) => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);
    console.log('Starting profile save process...');
    const currentFile = profileFileRef.current;
    console.log('profileFile present:', !!currentFile);

    try {
      let currentImageUrl = data.profileImage;

      // 1. Upload profile picture if a new file is selected
      if (currentFile) {
        console.log('Uploading profile picture to API...');
        const formData = new FormData();
        formData.append('file', currentFile);

        try {
          const uploadResponse = await axios.post(API_ENDPOINTS.users.profilePicture(), formData, {
            headers: {
              Authorization: getAuthToken(),
            },
          });

          console.log('Upload response:', uploadResponse.status, uploadResponse.data);

          // Extract URL from response — handle different possible response shapes
          let newUrl = '';
          if (typeof uploadResponse.data === 'string') {
            newUrl = uploadResponse.data;
          } else if (uploadResponse.data?.profilePictureUrl) {
            newUrl = uploadResponse.data.profilePictureUrl;
          } else if (uploadResponse.data?.url) {
            newUrl = uploadResponse.data.url;
          }

          if (newUrl) {
            currentImageUrl = sanitizeProfileImageUrl(newUrl);
            console.log('New image URL:', currentImageUrl);
          } else {
            // Re-fetch profile picture using getProfilePicture API
            console.log('No URL in upload response, re-fetching profile picture...');
            try {
              const userId = user?.userId || localStorage.getItem('userId') || '0';
              const picRes = await axios.get(API_ENDPOINTS.users.getProfilePicture(userId), {
                headers: { Authorization: getAuthToken() },
                responseType: 'blob',
              });

              const contentType = picRes.headers['content-type'] || picRes.data?.type || '';
              if (contentType.includes('application/json')) {
                const jsonText = await picRes.data.text();
                const jsonData = JSON.parse(jsonText);
                let fetchedImg = jsonData.profilePictureUrl || jsonData.url || jsonText;
                if (fetchedImg) {
                  currentImageUrl = sanitizeProfileImageUrl(fetchedImg);
                }
              } else {
                const imageUrl = URL.createObjectURL(picRes.data);
                currentImageUrl = imageUrl;
                console.log('Created Object URL for profile picture:', currentImageUrl);
              }
            } catch (picErr) {
              console.warn('Failed to refetch profile picture after upload:', picErr);
            }
          }
        } catch (uploadErr: any) {
          console.error('Error uploading profile picture:', uploadErr);
          if (uploadErr.response) {
            console.warn('Upload Error response data:', JSON.stringify(uploadErr.response.data));
            console.warn('Upload Error status:', uploadErr.response.status);
          }
        }
      }

      console.log('Updating profile info...');
      // 2. Update profile information
      const response = await axios.put(
        API_ENDPOINTS.users.profile(),
        {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          jobTitle: data.jobTitle,
          phoneNumber: data.phone,
          address: data.location,
          departmentId: data.departmentId || 1,
          departmentName: data.department,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setSuccess('Profile updated successfully!');
        setPersonalInfo({ ...data, profileImage: currentImageUrl });
        profileFileRef.current = null; // Clear pending file

        // Sync context
        setUser({
          userName: `${data.firstName} ${data.lastName}`,
          userRole: user?.userRole || 'Associate',
          userId: user?.userId || '0',
        });
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSave = (settings: NotificationSettings) => {
    console.log('Notification settings saved:', settings);
  };

  const handlePasswordChange = () => {
    console.log('Password changed successfully');
  };

  const handleToggle2FA = (enabled: boolean) => {
    console.log('2FA toggled:', enabled);
  };

  const handleViewSessions = () => {
    console.log('Viewing active sessions');
  };

  const handleViewAuditLog = () => {
    console.log('Viewing audit log');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleDensityChange = (newDensity: 'comfortable' | 'compact' | 'spacious') => {
    setDensity(newDensity);
  };

  const handleExportData = () => {
    console.log('Exporting user data');
  };

  const handleDeleteAccount = () => {
    console.log('Account deletion requested');
  };

  if (!isHydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-caption animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="XCircleIcon" size={32} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Failed to load profile
          </h2>
          <p className="text-muted-foreground font-caption text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: 'UserCircleIcon' },
    { id: 'notifications' as const, label: 'Notifications', icon: 'BellIcon' },
    { id: 'security' as const, label: 'Security', icon: 'ShieldCheckIcon' },
    { id: 'appearance' as const, label: 'Appearance', icon: 'PaintBrushIcon' },
    { id: 'privacy' as const, label: 'Privacy & Data', icon: 'LockClosedIcon' },
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
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => setIsSidebarMobileOpen(true)}
            >
              <Icon name="Bars3Icon" size={24} variant="outline" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-1 sm:mb-2">
                Account Settings
              </h1>
              <p className="text-xs sm:text-sm font-caption text-muted-foreground hidden xs:block">
                Manage your profile, preferences, and security settings
              </p>
            </div>
          </div>

          <ProfileHeader
            userName={
              personalInfo.firstName && personalInfo.lastName
                ? `${personalInfo.firstName} ${personalInfo.lastName}`
                : user?.userName || 'Loading...'
            }
            userEmail={personalInfo.email}
            userRole={user?.userRole || 'Associate'}
            profileImage={personalInfo.profileImage}
            profileImageAlt={`${personalInfo.firstName} ${personalInfo.lastName}`}
            onImageUpload={handleImageUpload}
            onSave={() => handlePersonalInfoSave(personalInfo)}
            isSaving={isSaving}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 shadow-elevation-1 sticky top-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-smooth ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon
                        name={tab.icon as any}
                        size={20}
                        variant="outline"
                        className={
                          activeTab === tab.id ? 'text-primary-foreground' : 'text-current'
                        }
                      />
                      <span className="font-caption font-medium text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <ThemeToggle isCollapsed={false} />
                  <UserRoleIndicator userName={personalInfo.firstName} isCollapsed={false} />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-500 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Icon name="CheckCircleIcon" size={20} />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Icon name="XCircleIcon" size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              {activeTab === 'profile' && (
                <PersonalInfoSection
                  initialData={personalInfo}
                  onSave={handlePersonalInfoSave}
                  onDataChange={setPersonalInfo}
                  isSavingExternal={isSaving}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationPreferences
                  initialSettings={notificationSettings}
                  onSave={handleNotificationSave}
                />
              )}

              {activeTab === 'security' && (
                <SecuritySettings
                  twoFactorEnabled={false}
                  lastPasswordChange="Never"
                  activeSessions={1}
                  onPasswordChange={handlePasswordChange}
                  onToggle2FA={handleToggle2FA}
                  onViewSessions={handleViewSessions}
                  onViewAuditLog={handleViewAuditLog}
                />
              )}

              {activeTab === 'appearance' && (
                <AppearanceSettings
                  currentTheme={theme}
                  currentDensity={density}
                  onThemeChange={handleThemeChange}
                  onDensityChange={handleDensityChange}
                />
              )}

              {activeTab === 'privacy' && (
                <PrivacyDataSettings
                  onExportData={handleExportData}
                  onDeleteAccount={handleDeleteAccount}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfileSettingsInteractive;
