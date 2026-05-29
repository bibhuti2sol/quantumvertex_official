'use client';

import { useState, useEffect } from 'react';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import Icon from '@/components/ui/AppIcon';
import { useUser } from '@/components/common/UserContext';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

// Import our custom widgets
import OrgHierarchyTree from './OrgHierarchyTree';
import RevenueWidget from './RevenueWidget';
import CareerProgressionTable from './CareerProgressionTable';

export default function OrganizationInteractive() {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [orgLogo, setOrgLogo] = useState<string | null>(null);
  const [orgAddress, setOrgAddress] = useState('123 Innovation Drive, Tech City, TC 90210');
  const [orgContact, setOrgContact] = useState('+1 (555) 123-4567');
  const [isEditingOrgDetails, setIsEditingOrgDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setSidebarCollapsed(savedState === 'true');
    }
    const savedLogo = localStorage.getItem('org_logo_data');
    if (savedLogo) {
      setOrgLogo(savedLogo);
    }

    const savedAddress = localStorage.getItem('org_address');
    if (savedAddress) setOrgAddress(savedAddress);

    const savedContact = localStorage.getItem('org_contact');
    if (savedContact) setOrgContact(savedContact);

    const fetchOrgName = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;
        const res = await axios.get(`${API_ENDPOINTS.users.list()}?page=0&size=100&sort=id,desc`, {
          headers: { Authorization: token },
        });
        const usersList = res.data?.data || res.data?.content || res.data;
        if (Array.isArray(usersList) && usersList.length > 0) {
          // If we have the current user's ID, try to find them, otherwise use the first user's org
          const me = usersList.find((u: any) => u.id.toString() === user?.userId) || usersList[0];
          if (me && me.organizationName) {
            setOrgName(me.organizationName);
          }
        }
      } catch (err) {
        console.error('Failed to fetch organization name:', err);
      }
    };

    fetchOrgName();
  }, [user?.userId]);

  const [orgName, setOrgName] = useState('Organization');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOrgLogo(base64);
        localStorage.setItem('org_logo_data', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        userRole={user?.userRole}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Page Content Wrapper */}
      <div className={`transition-smooth ${sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'}`}>
        {/* Sticky Dashboard Page Header */}
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between h-[72px] px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
                onClick={() => setIsSidebarMobileOpen(true)}
                aria-label="Toggle Sidebar"
              >
                <Icon name="Bars3Icon" size={24} variant="outline" />
              </button>

              {/* Interactive Organization Logo Uploader */}
              <div
                className="relative group cursor-pointer w-12 h-12 rounded-xl overflow-hidden border border-border flex items-center justify-center bg-muted/40 hover:border-primary/50 transition-smooth shadow-sm flex-shrink-0"
                title="Click to Upload Organization Logo"
              >
                {orgLogo ? (
                  <img
                    src={orgLogo}
                    alt="Organization Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon
                    name="BuildingOfficeIcon"
                    size={24}
                    className="text-muted-foreground group-hover:text-primary transition-smooth"
                  />
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Icon name="CameraIcon" size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                    {orgName}
                  </h1>
                  <button
                    onClick={() => setIsEditingOrgDetails(!isEditingOrgDetails)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground transition-smooth"
                    title="Edit Organization Details"
                  >
                    <Icon name="PencilIcon" size={16} />
                  </button>
                </div>

                {!isEditingOrgDetails ? (
                  <div className="flex items-center gap-4 mt-0.5">
                    <p className="font-caption text-xs sm:text-sm text-muted-foreground hidden xs:flex items-center gap-1.5">
                      <Icon name="MapPinIcon" size={14} /> {orgAddress}
                    </p>
                    <p className="font-caption text-xs sm:text-sm text-muted-foreground hidden xs:flex items-center gap-1.5">
                      <Icon name="PhoneIcon" size={14} /> {orgContact}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      className="text-xs sm:text-sm bg-background border border-border rounded px-2 py-1 min-w-[200px]"
                      placeholder="Organization Address"
                    />
                    <input
                      value={orgContact}
                      onChange={(e) => setOrgContact(e.target.value)}
                      className="text-xs sm:text-sm bg-background border border-border rounded px-2 py-1"
                      placeholder="Contact Number"
                    />
                    <button
                      onClick={() => {
                        setIsEditingOrgDetails(false);
                        localStorage.setItem('org_address', orgAddress);
                        localStorage.setItem('org_contact', orgContact);
                      }}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-xs font-semibold transition-smooth"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Global Actions Bar */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-8 w-px bg-border" />
              <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Action Boxes - Row 1 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Action Box 1: Organization Hierarchy Tree Widget */}
            <div className="h-full">
              <OrgHierarchyTree />
            </div>

            {/* Action Box 2: Financial Metrics Milestone Gauge */}
            <div className="h-full">
              <RevenueWidget />
            </div>
          </div>

          {/* Table Spacing - Row 2 Full Width */}
          <div className="pt-2">
            <CareerProgressionTable />
          </div>
        </main>
      </div>
    </div>
  );
}
