'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/common/UserContext';
import TeamMemberCard from './TeamMemberCard';
import WorkloadChart from './WorkloadChart';
import WorkloadFilters from './WorkloadFilters';
import TeamMetrics from './TeamMetrics';
import UpcomingDeadlines from './UpcomingDeadlines';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

import TeamAvailability from './TeamAvailability';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  currentTasks: number;
  capacity: number;
  completionRate: number;
  avgCompletionTime: string;
  status: 'available' | 'busy' | 'overloaded';
}

interface WorkloadData {
  name: string;
  assigned: number;
  completed: number;
  pending: number;
}

interface Metric {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface Deadline {
  id: number;
  taskName: string;
  assignee: string;
  assigneeAvatar: string;
  assigneeAvatarAlt: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'overdue';
}

interface Suggestion {
  id: number;
  type: 'reassign' | 'balance' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface AvailabilitySlot {
  date: string;
  dayName: string;
  members: {
    id: number;
    name: string;
    avatar: string;
    avatarAlt: string;
    status: 'available' | 'busy' | 'off';
  }[];
}

const TeamWorkloadInteractive = () => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [workloadChartData, setWorkloadChartData] = useState<WorkloadData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Senior Developer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png',
      avatarAlt: 'Professional woman with brown hair in business attire smiling at camera',
      currentTasks: 8,
      capacity: 85,
      completionRate: 94,
      avgCompletionTime: '2.3d',
      status: 'busy',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'UI/UX Designer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bfd25f4a-1763293795450.png',
      avatarAlt: 'Asian man with glasses and beard in casual shirt looking confident',
      currentTasks: 5,
      capacity: 62,
      completionRate: 89,
      avgCompletionTime: '1.8d',
      status: 'available',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Project Manager',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_11504e941-1763295994346.png',
      avatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling warmly',
      currentTasks: 12,
      capacity: 95,
      completionRate: 91,
      avgCompletionTime: '3.1d',
      status: 'overloaded',
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Backend Developer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_12effecd7-1763295944134.png',
      avatarAlt: 'Young Asian man in white shirt with friendly smile in office setting',
      currentTasks: 6,
      capacity: 70,
      completionRate: 87,
      avgCompletionTime: '2.5d',
      status: 'busy',
    },
    {
      id: 5,
      name: 'Jessica Taylor',
      role: 'QA Engineer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_152f68e67-1763296472295.png',
      avatarAlt: 'Blonde woman with professional makeup in business attire looking confident',
      currentTasks: 4,
      capacity: 55,
      completionRate: 96,
      avgCompletionTime: '1.5d',
      status: 'available',
    },
    {
      id: 6,
      name: 'Robert Martinez',
      role: 'DevOps Engineer',
      avatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1cfd0c407-1763293996430.png',
      avatarAlt: 'Man with short brown hair in casual blue shirt with friendly expression',
      currentTasks: 7,
      capacity: 78,
      completionRate: 92,
      avgCompletionTime: '2.0d',
      status: 'busy',
    },
  ];

  const mockWorkloadData: WorkloadData[] = [
    { name: 'Sarah J.', assigned: 8, completed: 6, pending: 2 },
    { name: 'Michael C.', assigned: 5, completed: 4, pending: 1 },
    { name: 'Emily R.', assigned: 12, completed: 8, pending: 4 },
    { name: 'David K.', assigned: 6, completed: 4, pending: 2 },
    { name: 'Jessica T.', assigned: 4, completed: 3, pending: 1 },
    { name: 'Robert M.', assigned: 7, completed: 5, pending: 2 },
  ];

  const mockMetrics: Metric[] = [
    {
      label: 'Average Completion Time',
      value: '2.2d',
      change: -8,
      icon: 'ClockIcon',
      color: 'bg-primary',
    },
    {
      label: 'Team Velocity',
      value: '42',
      change: 12,
      icon: 'BoltIcon',
      color: 'bg-accent',
    },
    {
      label: 'Completion Rate',
      value: '91%',
      change: 5,
      icon: 'CheckCircleIcon',
      color: 'bg-success',
    },
    {
      label: 'Overloaded Members',
      value: '1',
      change: -33,
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning',
    },
  ];

  const mockDeadlines: Deadline[] = [
    {
      id: 1,
      taskName: 'Complete API Integration',
      assignee: 'Sarah Johnson',
      assigneeAvatar:
        'https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png',
      assigneeAvatarAlt: 'Professional woman with brown hair in business attire smiling at camera',
      dueDate: 'Jan 28, 2026',
      priority: 'high',
      status: 'at-risk',
    },
    {
      id: 2,
      taskName: 'Design System Update',
      assignee: 'Michael Chen',
      assigneeAvatar:
        'https://img.rocket.new/generatedImages/rocket_gen_img_1bfd25f4a-1763293795450.png',
      assigneeAvatarAlt: 'Asian man with glasses and beard in casual shirt looking confident',
      dueDate: 'Jan 29, 2026',
      priority: 'medium',
      status: 'on-track',
    },
    {
      id: 3,
      taskName: 'Sprint Planning Meeting',
      assignee: 'Emily Rodriguez',
      assigneeAvatar:
        'https://img.rocket.new/generatedImages/rocket_gen_img_11504e941-1763295994346.png',
      assigneeAvatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling warmly',
      dueDate: 'Jan 27, 2026',
      priority: 'high',
      status: 'overdue',
    },
    {
      id: 4,
      taskName: 'Database Optimization',
      assignee: 'David Kim',
      assigneeAvatar:
        'https://img.rocket.new/generatedImages/rocket_gen_img_12effecd7-1763295944134.png',
      assigneeAvatarAlt: 'Young Asian man in white shirt with friendly smile in office setting',
      dueDate: 'Jan 30, 2026',
      priority: 'medium',
      status: 'on-track',
    },
    {
      id: 5,
      taskName: 'Testing Phase 2',
      assignee: 'Jessica Taylor',
      assigneeAvatar:
        'https://img.rocket.new/generatedImages/rocket_gen_img_152f68e67-1763296472295.png',
      assigneeAvatarAlt:
        'Blonde woman with professional makeup in business attire looking confident',
      dueDate: 'Feb 01, 2026',
      priority: 'low',
      status: 'on-track',
    },
  ];

  const mockSuggestions: Suggestion[] = [
    {
      id: 1,
      type: 'reassign',
      title: 'Reassign 2 tasks from Emily to Jessica',
      description:
        'Emily Rodriguez is at 95% capacity while Jessica Taylor has only 55% utilization. Reassigning 2 medium-priority tasks would balance the workload.',
      impact: 'high',
    },
    {
      id: 2,
      type: 'balance',
      title: 'Distribute upcoming tasks evenly',
      description:
        'Next week has 15 new tasks scheduled. Consider distributing them based on current capacity to prevent overload.',
      impact: 'medium',
    },
    {
      id: 3,
      type: 'alert',
      title: 'Sarah Johnson approaching deadline',
      description:
        'Sarah has 2 high-priority tasks due in 24 hours. Consider providing additional support or extending deadlines.',
      impact: 'high',
    },
  ];

  const mockAvailability: AvailabilitySlot[] = [
    {
      date: 'Jan 27, 2026',
      dayName: 'Monday',
      members: [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png',
          avatarAlt: 'Professional woman with brown hair in business attire smiling at camera',
          status: 'busy',
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_1bfd25f4a-1763293795450.png',
          avatarAlt: 'Asian man with glasses and beard in casual shirt looking confident',
          status: 'available',
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_11504e941-1763295994346.png',
          avatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling warmly',
          status: 'busy',
        },
        {
          id: 4,
          name: 'David Kim',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_12effecd7-1763295944134.png',
          avatarAlt: 'Young Asian man in white shirt with friendly smile in office setting',
          status: 'available',
        },
      ],
    },
    {
      date: 'Jan 28, 2026',
      dayName: 'Tuesday',
      members: [
        {
          id: 1,
          name: 'Sarah Johnson',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png',
          avatarAlt: 'Professional woman with brown hair in business attire smiling at camera',
          status: 'available',
        },
        {
          id: 5,
          name: 'Jessica Taylor',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_152f68e67-1763296472295.png',
          avatarAlt: 'Blonde woman with professional makeup in business attire looking confident',
          status: 'available',
        },
        {
          id: 6,
          name: 'Robert Martinez',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_1cfd0c407-1763293996430.png',
          avatarAlt: 'Man with short brown hair in casual blue shirt with friendly expression',
          status: 'busy',
        },
      ],
    },
    {
      date: 'Jan 29, 2026',
      dayName: 'Wednesday',
      members: [
        {
          id: 2,
          name: 'Michael Chen',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_1bfd25f4a-1763293795450.png',
          avatarAlt: 'Asian man with glasses and beard in casual shirt looking confident',
          status: 'off',
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_11504e941-1763295994346.png',
          avatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling warmly',
          status: 'available',
        },
        {
          id: 4,
          name: 'David Kim',
          avatar:
            'https://img.rocket.new/generatedImages/rocket_gen_img_12effecd7-1763295944134.png',
          avatarAlt: 'Young Asian man in white shirt with friendly smile in office setting',
          status: 'busy',
        },
      ],
    },
  ];

  const handleViewDetails = (id: number) => {
    if (!isHydrated) return;
    console.log('View details for member:', id);
  };

  const handleReassignTasks = (id: number) => {
    if (!isHydrated) return;
    console.log('Reassign tasks for member:', id);
  };

  const fetchWorkloadData = async (currentFilters: any) => {
    setLoading(true);
    try {
      const token = getAuthToken();

      let url = `${API_ENDPOINTS.teams.workload()}?`;
      const params = new URLSearchParams();

      if (currentFilters.department && currentFilters.department !== 'all') {
        params.append('departmentId', currentFilters.department);
      }
      if (currentFilters.team && currentFilters.team !== 'all') {
        params.append('teamId', currentFilters.team);
      }
      if (currentFilters.timePeriod) {
        params.append('period', currentFilters.timePeriod);
      }

      const response = await fetch(url + params.toString(), {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const data = await response.json();

        // Map API data to metrics UI
        const newMetrics: Metric[] = [
          {
            label: 'Average Completion Time',
            value: data.averageCompletionTime ? `${data.averageCompletionTime.toFixed(1)}d` : '0d',
            change: data.avgCompletionTimeProgress || 0,
            icon: 'ClockIcon',
            color: 'bg-primary',
          },
          {
            label: 'Team Velocity',
            value: data.teamVelocity?.toString() || '0',
            change: data.velocityProgress || 0,
            icon: 'BoltIcon',
            color: 'bg-accent',
          },
          {
            label: 'Completion Rate',
            value: `${data.completionRate?.toFixed(1) || 0}%`,
            change: data.completionRateProgress || 0,
            icon: 'CheckCircleIcon',
            color: 'bg-success',
          },
          {
            label: 'Overloaded Members',
            value: data.overloadedMembersCount?.toString() || '0',
            change: data.overloadedMembersProgress || 0,
            icon: 'ExclamationTriangleIcon',
            color: 'bg-warning',
          },
        ];
        setMetrics(newMetrics);

        // Map API data to chart UI
        if (data.members) {
          const distributionData = data.members.map((m: any) => ({
            name: m.userName || 'Unknown',
            assigned: m.assignedTaskCount || 0,
            completed: m.completedTaskCount || 0,
            pending: m.pendingTaskCount || 0,
          }));
          setWorkloadChartData(distributionData);
        }

        // Map API data to team members UI
        if (data.members) {
          const membersData = data.members.map((m: any) => ({
            id: m.userId,
            name: m.userName,
            role: m.jobTitle || 'Team Member',
            avatar:
              'https://ui-avatars.com/api/?name=' +
              encodeURIComponent(m.userName) +
              '&background=random',
            avatarAlt: m.userName,
            currentTasks: m.currentTaskCount || 0,
            capacity: m.capacityProgressPercentage || 0,
            completionRate: m.completionRateProgress || 0,
            avgCompletionTime: m.averageCompletionTimeDays
              ? `${m.averageCompletionTimeDays.toFixed(1)}d`
              : '0d',
            status:
              m.capacityProgressPercentage > 90
                ? 'overloaded'
                : m.capacityProgressPercentage > 60
                  ? 'busy'
                  : 'available',
          }));
          setTeamMembers(membersData);

          // Fetch actual profile pictures for each member asynchronously
          data.members.forEach(async (m: any) => {
            if (m.userId) {
              try {
                const picResponse = await fetch(API_ENDPOINTS.users.getProfilePicture(m.userId), {
                  headers: {
                    Authorization: token,
                  },
                });
                if (picResponse.ok) {
                  const blob = await picResponse.blob();
                  const contentType = blob.type || '';
                  if (!contentType.includes('application/json')) {
                    const imageUrl = URL.createObjectURL(blob);

                    // Update team member avatar
                    setTeamMembers((prev) =>
                      prev.map((member) =>
                        member.id === m.userId ? { ...member, avatar: imageUrl } : member
                      )
                    );

                    // Update deadline assignee avatar if name matches
                    setDeadlines((prev) =>
                      prev.map((dl) =>
                        dl.assignee === m.userName ? { ...dl, assigneeAvatar: imageUrl } : dl
                      )
                    );
                  }
                }
              } catch (picErr) {
                console.warn(`Failed to fetch profile picture for member ${m.userId}:`, picErr);
              }
            }
          });
        }

        // Map API data to upcoming deadlines UI
        if (data.upcomingDeadlines) {
          const deadlinesData = data.upcomingDeadlines.map((d: any) => {
            const dueDate = new Date(d.endDate);
            const today = new Date();
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let status: 'on-track' | 'at-risk' | 'overdue' = 'on-track';
            if (diffDays < 0) status = 'overdue';
            else if (diffDays <= 3) status = 'at-risk';

            return {
              id: d.taskId,
              taskName: d.taskTitle,
              assignee: d.assigneeName,
              assigneeAvatar:
                'https://ui-avatars.com/api/?name=' +
                encodeURIComponent(d.assigneeName) +
                '&background=random',
              assigneeAvatarAlt: d.assigneeName,
              dueDate: new Date(d.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              priority: (d.priority?.toLowerCase() || 'medium') as 'high' | 'medium' | 'low',
              status,
            };
          });
          setDeadlines(deadlinesData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch workload data:', error);
    } finally {
      setLoading(false);
    }
  };

  // The initial fetch is now handled by the WorkloadFilters component
  // which auto-selects defaults and triggers handleFilterChange.

  const handleFilterChange = (filters: any) => {
    if (!isHydrated) return;
    console.log('Filters changed:', filters);
    fetchWorkloadData(filters);
  };

  const handleApplySuggestion = (id: number) => {
    if (!isHydrated) return;
    console.log('Apply suggestion:', id);
  };

  const handleDismissSuggestion = (id: number) => {
    if (!isHydrated) return;
    console.log('Dismiss suggestion:', id);
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-muted-foreground">Loading team workload...</div>
      </div>
    );
  }

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
                    Team Workload
                  </h1>
                  <p className="font-caption text-xs sm:text-sm text-muted-foreground hidden xs:block">
                    Monitor and balance team capacity
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

          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            <WorkloadFilters onFilterChange={handleFilterChange} />

            {loading ? (
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-80 bg-muted rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-48 bg-muted rounded-lg" />
                  <div className="h-48 bg-muted rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                <TeamMetrics metrics={metrics} />
                <WorkloadChart data={workloadChartData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {teamMembers.map((member) => (
                        <TeamMemberCard
                          key={member.id}
                          member={member}
                          onViewDetails={handleViewDetails}
                          onReassignTasks={handleReassignTasks}
                        />
                      ))}
                      {teamMembers.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-card border border-dashed border-border rounded-lg">
                          <p className="text-muted-foreground font-caption">
                            No team members found for the selected filters.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <UpcomingDeadlines deadlines={deadlines} />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamWorkloadInteractive;
