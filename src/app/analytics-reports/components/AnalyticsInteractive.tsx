'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/common/UserContext';
import NavigationSidebar from '@/components/common/NavigationSidebar';
import FilterBar from './FilterBar';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

// Enterprise Components
import { EnterpriseMetricCard, RiskGauge, ProjectBudgetChart } from './EnterpriseVisuals';
import EnterpriseHeatmap from './EnterpriseHeatmap';
import SubtaskBreakdown from './SubtaskBreakdown';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserRoleIndicator from '@/components/common/UserRoleIndicator';

interface MetricWidget {
  val: string | number;
  label: string;
  secondVal?: string | number;
  secondLabel?: string;
  data?: { value: number }[];
  chartType?: 'line' | 'bar';
}

const safeFetch = async (url: string) => {
  try {
    const token = getAuthToken();
    const res = await fetch(url, { headers: { Authorization: token } });
    if (res.ok) return await res.json();
    return null;
  } catch {
    return null;
  }
};

const AnalyticsInteractive = () => {
  const { user } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [metrics, setMetrics] = useState<{
    projected: MetricWidget;
    cycleTime: MetricWidget;
    velocity: MetricWidget;
    risk: MetricWidget;
  }>({
    projected: {
      val: 0,
      label: 'Active Tasks',
      secondVal: 0,
      secondLabel: 'Completed',
      data: [],
      chartType: 'line',
    },
    cycleTime: { val: '0d', label: 'Average Distribution', data: [], chartType: 'bar' },
    velocity: { val: '0/week', label: 'Weekly trend', data: [], chartType: 'line' },
    risk: { val: 0, label: 'Low' },
  });

  const [budgetData, setBudgetData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [subtaskData, setSubtaskData] = useState({ total: 0, inProgress: 0, closed: 0 });
  const [detailedData, setDetailedData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchEnterpriseData = async (filters: any) => {
    setLoading(true);
    setCurrentPage(1);
    try {
      // Build query params for Dashboard API (accepts projectId)
      const dashboardUrl = filters.project
        ? API_ENDPOINTS.dashboard.byProject(filters.project)
        : API_ENDPOINTS.dashboard.summary();

      // Build query params for Tasks API
      const taskParams = new URLSearchParams({
        page: '0',
        size: '500',
        sort: 'id,desc',
        search: '',
        status: filters.status || '',
      });
      if (filters.project) taskParams.set('projectId', filters.project);
      if (filters.priority) taskParams.set('priority', filters.priority);
      if (filters.assignee) taskParams.set('assigneeId', filters.assignee);

      // Add date range for custom period
      if (filters.period === 'custom') {
        if (filters.startDate) taskParams.set('startDate', filters.startDate);
        if (filters.endDate) taskParams.set('endDate', filters.endDate);
      }

      // Build query params for Projects API
      const projectParams = new URLSearchParams({
        page: '0',
        size: '500',
        sort: 'id,desc',
        search: '',
        status: filters.status || '',
      });

      // Build query params for Users API (for role/dept filtering)
      const userParams = new URLSearchParams({ page: '0', size: '1000' });

      // Fetch all data streams concurrently
      const [dashboardData, tasksData, projectsData, usersData] = await Promise.all([
        safeFetch(dashboardUrl),
        safeFetch(`${API_ENDPOINTS.tasks.list()}?${taskParams.toString()}`),
        safeFetch(`${API_ENDPOINTS.projects.list()}?${projectParams.toString()}`),
        safeFetch(`${API_ENDPOINTS.users.list()}?${userParams.toString()}`),
      ]);

      const tasks = tasksData?.content || [];
      const projects = projectsData?.content || [];
      const users = usersData?.content || [];

      // Filter tasks by user set (when role filter is active)
      let filteredTasks = tasks;

      // ===== 1. METRIC CARD: Projected vs Actual =====
      const weeklyProductivity = dashboardData?.weeklyProductivity || [];
      const dashboardTodo = weeklyProductivity.reduce(
        (acc: number, cur: any) => acc + (cur.todo || 0),
        0
      );
      const dashboardInProgress = weeklyProductivity.reduce(
        (acc: number, cur: any) => acc + (cur.inProgress || 0),
        0
      );
      const dashboardDone = weeklyProductivity.reduce(
        (acc: number, cur: any) => acc + (cur.done || 0),
        0
      );

      const todoCount =
        filteredTasks.length > 0
          ? filteredTasks.filter((t: any) => t.status === 'TODO').length
          : dashboardTodo;
      const inProgressCount =
        filteredTasks.length > 0
          ? filteredTasks.filter((t: any) => t.status === 'IN_PROGRESS').length
          : dashboardInProgress;
      const reviewCount = filteredTasks.filter((t: any) => t.status === 'REVIEW').length;
      const doneCount =
        filteredTasks.length > 0
          ? filteredTasks.filter((t: any) => t.status === 'DONE').length
          : dashboardDone;

      const isFiltered = !!filters.project;

      const activeTasks = isFiltered
        ? todoCount + inProgressCount + reviewCount
        : (dashboardData?.activeTasks?.count ?? todoCount + inProgressCount + reviewCount);

      const completedTasks = isFiltered
        ? doneCount
        : (dashboardData?.completionRate?.completedTasks ?? doneCount);

      // ===== 2. METRIC CARD: Average Cycle Time =====
      const tasksWithDates = filteredTasks.filter(
        (t: any) => t.status === 'DONE' && t.startDate && t.endDate
      );
      let avgCycleTime = 0;
      if (tasksWithDates.length > 0) {
        const totalDays = tasksWithDates.reduce((acc: number, t: any) => {
          const start = new Date(t.startDate).getTime();
          const end = new Date(t.endDate).getTime();
          return acc + Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
        }, 0);
        avgCycleTime = totalDays / tasksWithDates.length;
      }

      // ===== 3. METRIC CARD: Team Velocity =====
      const weeklyDone = weeklyProductivity.map((p: any) => p.done || 0);
      const totalWeeklyDone = weeklyDone.reduce((a: number, b: number) => a + b, 0);
      const velocityPerWeek =
        weeklyDone.length > 0 ? ((totalWeeklyDone / weeklyDone.length) * 7).toFixed(1) : '0';

      // ===== 4. RISK GAUGE =====
      const overdueTasks = filteredTasks.filter(
        (t: any) => t.overdue === true && t.status !== 'DONE'
      );
      const highPriorityPending = filteredTasks.filter(
        (t: any) => t.priority === 'HIGH' && t.status !== 'DONE'
      );
      const riskScore = Math.min(
        Math.round(overdueTasks.length * 15 + highPriorityPending.length * 5),
        100
      );
      const riskLabel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low';

      // ===== 5. LOCAL SUBTASK AGGREGATION =====
      let localSubtaskTotal = 0;
      let localSubtaskInProgress = 0;
      let localSubtaskClosed = 0;

      filteredTasks.forEach((t: any) => {
        const subs = t.subTasks || [];
        localSubtaskTotal += subs.length;
        subs.forEach((s: any) => {
          if (s.status === 'DONE') localSubtaskClosed++;
          else if (s.status === 'IN_PROGRESS') localSubtaskInProgress++;
        });
      });

      // ===== 6. LOCAL TREND AGGREGATION (Last 7 Days) =====
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const localTrendData = last7Days.map((date) => {
        const dayTasks = filteredTasks.filter(
          (t: any) =>
            (t.updatedAt && t.updatedAt.startsWith(date)) || (t.endDate && t.endDate === date)
        );
        return {
          date,
          done: dayTasks.filter((t: any) => t.status === 'DONE').length,
        };
      });

      setMetrics({
        projected: {
          val: activeTasks,
          label: 'Active Tasks',
          secondVal: completedTasks,
          secondLabel: 'Completed',
          data: isFiltered
            ? [
                { value: todoCount },
                { value: inProgressCount },
                { value: reviewCount },
                { value: doneCount },
              ]
            : weeklyProductivity.length > 0
              ? weeklyProductivity.map((p: any) => ({ value: p.done || 0 }))
              : [
                  { value: todoCount },
                  { value: inProgressCount },
                  { value: reviewCount },
                  { value: doneCount },
                ],
          chartType: isFiltered ? 'bar' : 'line',
        },
        cycleTime: {
          val: `${avgCycleTime.toFixed(1)}d`,
          label: 'Average Distribution',
          data: [
            { value: filteredTasks.filter((t: any) => t.priority === 'HIGH').length },
            { value: filteredTasks.filter((t: any) => t.priority === 'MEDIUM').length },
            { value: filteredTasks.filter((t: any) => t.priority === 'LOW').length },
          ],
        },
        velocity: {
          val: isFiltered
            ? `${(filteredTasks.filter((t: any) => t.status === 'DONE').length / 1).toFixed(1)}/per context`
            : `${velocityPerWeek}/week`,
          label: isFiltered ? 'Selected Velocity' : 'Weekly trend',
          data: isFiltered
            ? localTrendData.map((d) => ({ value: d.done }))
            : weeklyProductivity.map((p: any) => ({ value: (p.done || 0) + (p.inProgress || 0) })),
        },
        risk: {
          val: riskScore,
          label: riskLabel,
        },
      });

      // Update Subtask Data locally
      if (isFiltered) {
        setSubtaskData({
          total: localSubtaskTotal,
          inProgress: localSubtaskInProgress,
          closed: localSubtaskClosed,
        });
      } else if (dashboardData?.subtasks) {
        setSubtaskData({
          total: dashboardData.subtasks.total || 0,
          inProgress: dashboardData.subtasks.inProgress || 0,
          closed: dashboardData.subtasks.closed || 0,
        });
      }

      // ===== 5. PROJECT BUDGET CHART =====
      let budgetAnalysis = [] as any[];
      const targetProjects = filters.project
        ? projects.filter((p: any) => String(p.id) === String(filters.project))
        : projects;

      if (targetProjects.length > 0) {
        budgetAnalysis = targetProjects.map((p: any) => {
          const totalBudget = p.budget || 0;
          const isRecovered = p.status === 'COMPLETED' || p.progressPercentage === 100;
          const recovered = isRecovered ? totalBudget : 0;
          const pending = Math.max(0, totalBudget - recovered);

          return {
            name: String(p.name).length > 12 ? String(p.name).slice(0, 12) + '…' : p.name,
            recovered: recovered,
            pending: pending,
          };
        });
      }

      setBudgetData(
        budgetAnalysis.length > 0
          ? budgetAnalysis
          : [{ name: 'Total View', recovered: 0, pending: 0 }]
      );

      // ===== 7. RESOURCE UTILIZATION HEATMAP =====
      const teamWorkload = dashboardData?.teamWorkload || [];

      const targetWorkload = teamWorkload;

      if (targetWorkload.length > 0) {
        setHeatmapData(
          targetWorkload.slice(0, 8).map((m: any) => ({
            name: m.userName,
            weeks: Array.from({ length: 6 }, (_, i) => {
              const base = m.workloadPercentage || 0;
              const variation = Math.sin(i * 1.5 + m.userId) * 15;
              return Math.max(0, Math.min(100, Math.round(base + variation)));
            }),
          }))
        );
      } else {
        setHeatmapData([]);
      }

      // Detailed analytics table updated to reflects filtered tasks correctly below.

      // ===== 8. DETAILED ANALYTICS TABLE =====
      // Show project-level analytics with real data
      const projectAnalytics = projects.map((p: any) => {
        const projTasks = filteredTasks.filter((t: any) => t.projectId === p.id);
        const projDone = projTasks.filter((t: any) => t.status === 'DONE').length;
        const projTotal = projTasks.length;
        const completion =
          projTotal > 0 ? Math.round((projDone / projTotal) * 100) : p.progressPercentage || 0;
        const target = projTotal > 0 ? projTotal : 1;
        const variance = completion - (p.progressPercentage || 0);

        return {
          type: p.priority || 'MEDIUM',
          dimension: p.name,
          value: projTotal,
          completion,
          variance,
          outcome:
            p.status === 'COMPLETED'
              ? 'Achieved'
              : completion >= 80
                ? 'On Track'
                : completion >= 50
                  ? 'At Risk'
                  : 'Delayed',
        };
      });
      setDetailedData(projectAnalytics);
    } catch (err) {
      console.error('Failed to fetch enterprise analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated) {
      fetchEnterpriseData({
        project: '',
        team: '',
        department: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
      });
    }
  }, [isHydrated]);

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-smooth">
      <NavigationSidebar
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        isMobileOpen={isSidebarMobileOpen}
        onMobileClose={() => setIsSidebarMobileOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'}`}
      >
        {/* Top Header */}
        <header className="bg-card border-b border-border px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md"
              onClick={() => setIsSidebarMobileOpen(true)}
            >
              <Icon name="Bars3Icon" size={24} variant="outline" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Icon name="RocketLaunchIcon" size={20} variant="outline" className="text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-heading font-bold text-foreground leading-tight">
                  Analytics
                </h1>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider hidden xs:block">
                  Advanced data insights and reporting
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-px bg-border" />
            <UserRoleIndicator currentRole={user?.userRole} userName={user?.userName} />
          </div>
        </header>

        {/* Filter Toolbar */}
        <FilterBar onApplyFilters={fetchEnterpriseData} />

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-blue-50 border-b border-blue-200 px-8 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium text-blue-700">Loading analytics data...</span>
          </div>
        )}

        {/* Main Content Dashboard */}
        <main className={`p-4 sm:p-6 md:p-8 space-y-6 ${loading ? 'opacity-60' : ''}`}>
          {/* Row 1: Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <EnterpriseMetricCard
              title="Projected vs. Actual Completion"
              primaryValue={metrics.projected.val}
              primaryLabel={metrics.projected.label}
              secondaryValue={metrics.projected.secondVal}
              secondaryLabel={metrics.projected.secondLabel}
              chartData={metrics.projected.data || []}
              chartType={metrics.projected.chartType || 'line'}
            />
            <SubtaskBreakdown
              total={subtaskData.total}
              inProgress={subtaskData.inProgress}
              closed={subtaskData.closed}
            />
            <EnterpriseMetricCard
              title="Average Task Cycle Time"
              primaryValue={metrics.cycleTime.val}
              primaryLabel={metrics.cycleTime.label}
              chartData={metrics.cycleTime.data || []}
              chartType={metrics.cycleTime.chartType || 'bar'}
            />
            <EnterpriseMetricCard
              title="Team Velocity Trend"
              primaryValue={metrics.velocity.val}
              primaryLabel={metrics.velocity.label}
              chartData={metrics.velocity.data || []}
              chartType={metrics.velocity.chartType || 'line'}
            />
            <RiskGauge value={metrics.risk.val as number} label={metrics.risk.label} />
          </div>

          {/* Row 2: Charts Section */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-7">
              <ProjectBudgetChart data={budgetData} />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <EnterpriseHeatmap data={heatmapData} />
            </div>
          </div>

          {/* Row 3: Detailed Table */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-card">
              <h3 className="font-heading font-bold text-base">Project Performance Overview</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/10">
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Priority <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Project Name <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Total Tasks <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Completion % <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Variance <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-muted-foreground uppercase">
                      Status <Icon name="ChevronUpDownIcon" size={12} variant="outline" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {detailedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-xs text-muted-foreground"
                      >
                        No project data available for the selected filters
                      </td>
                    </tr>
                  )}
                  {detailedData
                    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                    .map((row, i) => (
                      <tr key={i} className="hover:bg-muted/5 transition-smooth">
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              row.type === 'HIGH'
                                ? 'bg-red-500/10 text-red-500'
                                : row.type === 'MEDIUM'
                                  ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-green-500/10 text-green-500'
                            }`}
                          >
                            {row.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-blue-600">
                          {row.dimension}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-foreground">{row.value}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-muted/30 rounded-full h-1.5 max-w-[80px]">
                              <div
                                className={`h-1.5 rounded-full ${row.completion >= 80 ? 'bg-green-500' : row.completion >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${Math.min(row.completion, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-foreground">
                              {row.completion}%
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 text-xs font-bold ${row.variance < 0 ? 'text-red-500' : row.variance > 0 ? 'text-green-500' : 'text-muted-foreground'}`}
                        >
                          {row.variance > 0 ? '+' : ''}
                          {row.variance.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              row.outcome === 'Achieved'
                                ? 'bg-green-500/10 text-green-500'
                                : row.outcome === 'On Track'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : row.outcome === 'At Risk'
                                    ? 'bg-yellow-500/10 text-yellow-500'
                                    : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {row.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {detailedData.length > PAGE_SIZE && (
              <div className="px-6 py-3 border-t border-border bg-card flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-bold">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1} to{' '}
                  {Math.min(currentPage * PAGE_SIZE, detailedData.length)} of {detailedData.length}{' '}
                  records
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon name="ChevronLeftIcon" size={14} variant="outline" />
                  </button>
                  {Array.from(
                    { length: Math.ceil(detailedData.length / PAGE_SIZE) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === Math.ceil(detailedData.length / PAGE_SIZE)}
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(Math.ceil(detailedData.length / PAGE_SIZE), prev + 1)
                      )
                    }
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Icon name="ChevronRightIcon" size={14} variant="outline" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsInteractive;
