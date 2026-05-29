'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  owner: string;
  isLongPending?: boolean;
}

interface Project {
  id: number | string;
  name: string;
  status: string;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  projectManagerName: string;
  totalTasks: number;
  completedTasks: number;
}

interface ResourceMember {
  id: string;
  fullName: string;
  allocationPercentage: number;
}

interface MilestoneTrackerProps {
  milestones?: Milestone[];
  onMilestoneUpdate?: (milestoneId: string, updates: Partial<Milestone>) => void;
}

const MilestoneTracker = ({
  milestones: propMilestones,
  onMilestoneUpdate,
}: MilestoneTrackerProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [dynamicMilestones, setDynamicMilestones] = useState<Milestone[]>([]);
  const [hasLoadedDynamic, setHasLoadedDynamic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resourceAlert, setResourceAlert] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();

        let projects: Project[] = [];
        let resources: ResourceMember[] = [];

        // Fetch Projects with pagination
        try {
          const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            size: pageSize.toString(),
            search: '',
            sort: 'id,desc',
          });

          const projectsRes = await fetch(
            `${API_ENDPOINTS.projects.list()}?${queryParams.toString()}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token,
              },
            }
          );

          if (projectsRes.ok) {
            const data = await projectsRes.json();
            projects = data.content || (Array.isArray(data) ? data : []);

            // Handle total elements and pages
            const totalElems =
              data.totalElements || (Array.isArray(data) ? data.length : projects.length);
            const totalPgs = data.totalPages || Math.ceil(totalElems / pageSize);

            setTotalPages(totalPgs);
            setTotalElements(totalElems);
            console.log('MilestoneTracker: Projects fetched:', projects.length);
          } else {
            const errorText = await projectsRes.text();
            console.error(
              `MilestoneTracker: Projects API failed (${projectsRes.status}):`,
              errorText
            );
            setError(`Failed to fetch projects: ${projectsRes.status}`);
          }
        } catch (err) {
          console.error('MilestoneTracker: Error fetching projects:', err);
          setError('Network error while fetching projects');
        }

        // Fetch Resource Allocation
        try {
          const resourcesRes = await axios.get(API_ENDPOINTS.resources.list(), {
            headers: { Authorization: token },
          });

          if (resourcesRes.status === 200) {
            const data = resourcesRes.data;
            resources = data.content || (Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error('MilestoneTracker: Error fetching resources:', err);
        }

        const now = new Date();
        const computedMilestones: Milestone[] = projects
          .filter((p) => {
            const s = p.status ? p.status.toUpperCase() : '';
            return s === 'COMPLETED' || s === 'IN_PROGRESS' || s === 'ON_HOLD' || s === 'PROGRESS';
          })
          .map((p) => {
            const s = p.status ? p.status.toUpperCase() : '';
            const isCompleted = s === 'COMPLETED';
            const startDate = new Date(p.startDate);
            const endDate = new Date(p.endDate);
            const daysActive = Math.floor(
              (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const isOverdue = now > endDate && !isCompleted;

            const isLongPending =
              (s === 'IN_PROGRESS' || s === 'ON_HOLD' || s === 'PROGRESS') &&
              (isOverdue || daysActive > 30);

            let status: Milestone['status'] = 'upcoming';
            if (isCompleted) status = 'completed';
            else if (isOverdue || s === 'ON_HOLD') status = 'delayed';
            else if (s === 'IN_PROGRESS' || s === 'PROGRESS') status = 'in-progress';

            return {
              id: p.id.toString(),
              name: p.name,
              dueDate: p.endDate,
              status,
              progress: p.progressPercentage || 0,
              tasksCompleted: p.completedTasks || 0,
              totalTasks: p.totalTasks || 0,
              owner: p.projectManagerName || 'Unknown',
              isLongPending,
            };
          });

        setDynamicMilestones(computedMilestones);
        setHasLoadedDynamic(true);

        // Predictive Alert Logic
        const overAllocatedManagers = resources.filter((r) => (r.allocationPercentage || 0) > 90);
        if (overAllocatedManagers.length > 0) {
          const names = overAllocatedManagers.map((m) => m.fullName).join(', ');
          setResourceAlert(
            `Resource Warning: ${names} ${overAllocatedManagers.length > 1 ? 'are' : 'is'} over-allocated (>90%). This may cause delays in pending milestones.`
          );
        } else {
          setResourceAlert(null);
        }
      } catch (globalErr: any) {
        console.error('MilestoneTracker: Global error:', globalErr);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const allMilestones =
    hasLoadedDynamic && dynamicMilestones.length > 0
      ? dynamicMilestones
      : propMilestones && !hasLoadedDynamic
        ? propMilestones
        : dynamicMilestones;

  // Enforce pagination if the API returns more than pageSize
  const milestonesToDisplay =
    allMilestones.length > pageSize
      ? allMilestones.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
      : allMilestones;

  const effectiveTotalElements =
    hasLoadedDynamic && dynamicMilestones.length > 0 ? totalElements : allMilestones.length;
  const effectiveTotalPages =
    totalPages > 0 ? totalPages : Math.ceil(effectiveTotalElements / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < effectiveTotalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-primary text-primary-foreground';
      case 'upcoming':
        return 'bg-muted text-muted-foreground';
      case 'delayed':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'CheckCircleIcon';
      case 'in-progress':
        return 'ClockIcon';
      case 'upcoming':
        return 'CalendarIcon';
      case 'delayed':
        return 'ExclamationTriangleIcon';
      default:
        return 'FlagIcon';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Milestone Tracker
            </h3>
            <p className="text-xs text-muted-foreground">
              Tracking long pending & high-impact completed projects
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">
            <Icon name="PlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="p-6 relative flex-1">
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
            <Icon name="ExclamationCircleIcon" size={20} variant="solid" />
            <p className="font-caption text-sm font-medium">Error: {error}</p>
          </div>
        )}

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          {/* Milestones */}
          <div className="space-y-6">
            {milestonesToDisplay.length > 0 ? (
              milestonesToDisplay.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-16">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(
                      milestone.status
                    )} shadow-sm transition-transform hover:scale-110`}
                  >
                    <Icon name={getStatusIcon(milestone.status) as any} size={24} variant="solid" />
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`bg-background border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 cursor-pointer ${
                      selectedMilestone === milestone.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedMilestone(milestone.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-heading font-semibold text-base text-foreground">
                            {milestone.name}
                          </h4>
                          {milestone.isLongPending && (
                            <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-bold rounded uppercase tracking-tighter border border-warning/20">
                              Long Pending
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="CalendarIcon" size={14} variant="outline" />
                            <span className="font-caption text-xs">
                              Due:{' '}
                              {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="UserIcon" size={14} variant="outline" />
                            <span className="font-caption text-xs">{milestone.owner}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-caption font-medium ${getStatusColor(
                          milestone.status
                        )}`}
                      >
                        {getStatusText(milestone.status)}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-caption text-xs text-muted-foreground">
                          {milestone.tasksCompleted} of {milestone.totalTasks} tasks completed
                        </span>
                        <span className="font-caption text-xs font-medium text-foreground">
                          {milestone.progress.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            milestone.status === 'completed'
                              ? 'bg-success'
                              : milestone.status === 'delayed'
                                ? 'bg-error'
                                : 'bg-primary'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Icon name="FlagIcon" size={48} className="mx-auto text-muted-foreground/20 mb-3" />
                <p className="text-muted-foreground font-caption text-sm">
                  No milestones found matching the criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      {effectiveTotalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
          <p className="font-caption text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min((currentPage + 1) * pageSize, effectiveTotalElements)}
            </span>{' '}
            of <span className="font-medium text-foreground">{effectiveTotalElements}</span>{' '}
            milestones
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(effectiveTotalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                    currentPage === i
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === effectiveTotalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {/* Predictive Alert */}
      <div className="px-6 pb-6 mt-4">
        <div
          className={`${resourceAlert ? 'bg-warning/10 border-warning/20' : 'bg-info/10 border-info/20'} border rounded-lg p-4 transition-all duration-500`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 ${resourceAlert ? 'bg-warning' : 'bg-info'} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <Icon
                name={resourceAlert ? 'BellAlertIcon' : 'LightBulbIcon'}
                size={18}
                variant="solid"
                className={resourceAlert ? 'text-warning-foreground' : 'text-info-foreground'}
              />
            </div>
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-sm text-foreground mb-2">
                {resourceAlert ? 'Resource Velocity Alert' : 'Project Insights'}
              </h4>
              <p className="font-caption text-sm text-muted-foreground leading-relaxed">
                {resourceAlert ||
                  'Based on current team velocity and task completion rates, your project milestones are currently on track. Ensure resource allocation remains balanced to avoid bottlenecks.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTracker;
