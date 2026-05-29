'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface Project {
  id: number;
  name: string;
  healthScore: number;
  tasksCompleted: number;
  totalTasks: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
}

interface ProjectHealthChartProps {
  projects: Project[];
}

const ProjectHealthChart = ({ projects }: ProjectHealthChartProps) => {
  // 1. Sanitize input: Filter out null/undefined and ensure valid shape
  const validProjects = (projects || []).filter(
    (p) => p && typeof p === 'object' && 'id' in p && 'status' in p
  );

  // 2. Display empty state if no valid projects
  if (validProjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-muted-foreground font-caption text-sm border-2 border-dashed border-border rounded-xl p-6 text-center">
        <div>
          <Icon name="InformationCircleIcon" size={24} className="mx-auto mb-2 opacity-50" />
          <p>No project health data available.</p>
          <p className="text-xs opacity-70">Select a project to see details.</p>
        </div>
      </div>
    );
  }

  const isAggregated = validProjects.length > 1;

  if (isAggregated) {
    // Aggregated Dashboard Logic
    const statusCounts = {
      'On Track': validProjects.filter((p) => p.status === 'On Track').length,
      'At Risk': validProjects.filter((p) => p.status === 'At Risk').length,
      Delayed: validProjects.filter((p) => p.status === 'Delayed').length,
    };

    const statusData = [
      { name: 'On Track', value: statusCounts['On Track'], color: '#6366F1' },
      { name: 'At Risk', value: statusCounts['At Risk'], color: '#F59E0B' },
      { name: 'Delayed', value: statusCounts['Delayed'], color: '#E11D48' },
    ];

    const healthBrackets = [
      {
        name: '80-100',
        count: validProjects.filter((p) => p.healthScore >= 80).length,
        color: '#6366F1',
      },
      {
        name: '60-80',
        count: validProjects.filter((p) => p.healthScore >= 60 && p.healthScore < 80).length,
        color: '#818CF8',
      },
      {
        name: '40-60',
        count: validProjects.filter((p) => p.healthScore >= 40 && p.healthScore < 60).length,
        color: '#F59E0B',
      },
      {
        name: '<40',
        count: validProjects.filter((p) => p.healthScore < 40).length,
        color: '#E11D48',
      },
    ];

    const averageHealth = Math.round(
      validProjects.reduce((acc, p) => acc + (p.healthScore || 0), 0) / validProjects.length
    );

    return (
      <div className="space-y-6" aria-label="Aggregated Project Health Overview">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Avg. Health
            </p>
            <p className="text-xl font-black text-primary">{averageHealth}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Projects
            </p>
            <p className="text-xl font-black text-foreground">{validProjects.length}</p>
          </div>
        </div>

        {/* Status Distribution (Pie) */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Portfolio Status
          </h4>
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(var(--color-card-rgb), 0.9)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Healthy</span>
              <span className="text-lg font-black text-indigo-500">
                {Math.round((statusCounts['On Track'] / validProjects.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Health Distribution (Bar) */}
        <div>
          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
            Health Distribution
          </h4>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthBrackets} margin={{ top: 5, right: 10, left: -30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-muted)', opacity: 0.1 }}
                  contentStyle={{
                    backgroundColor: 'rgba(var(--color-card-rgb), 0.9)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={24}>
                  {healthBrackets.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // 3. Single Project Detailed View
  const project = validProjects[0];
  const styles = getStatusStyles(project.status);
  const completionPercentage = Math.round(
    ((project.tasksCompleted || 0) / (project.totalTasks || 1)) * 100
  );

  return (
    <div className="space-y-4" aria-label="Detailed Project Health View">
      <div className="group relative bg-card/50 hover:bg-card border border-border/50 hover:border-border p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-elevation-2 overflow-hidden">
        {/* Project Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 pr-4">
            <h3 className="font-heading font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.bg} ${styles.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
                {project.status}
              </span>
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-muted opacity-10"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - (project.healthScore || 0) / 100)}
                className={styles.text}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-black ${styles.text}`}>
                {project.healthScore || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Insights List */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Tasks Done
            </p>
            <p className="text-sm font-black text-foreground">{project.tasksCompleted || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Target
            </p>
            <p className="text-sm font-black text-foreground">{project.totalTasks || 0}</p>
          </div>
        </div>

        {/* Task Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Overall Completion
            </span>
            <span className={`text-xs font-black ${styles.text}`}>{completionPercentage}%</span>
          </div>

          <div className="relative h-2.5 w-full bg-muted/30 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${styles.gradient} transition-all duration-1000 ease-in-out`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusStyles = (status: Project['status']) => {
  switch (status) {
    case 'On Track':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-500/10',
        text: 'text-indigo-600 dark:text-indigo-400',
        dot: 'bg-indigo-500',
        gradient: 'from-indigo-500 to-blue-500',
      };
    case 'At Risk':
      return {
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        dot: 'bg-amber-500',
        gradient: 'from-amber-500 to-orange-500',
      };
    case 'Delayed':
      return {
        bg: 'bg-rose-50 dark:bg-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        dot: 'bg-rose-500',
        gradient: 'from-rose-500 to-pink-500',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-500/10',
        text: 'text-slate-600 dark:text-slate-400',
        dot: 'bg-slate-500',
        gradient: 'from-slate-500 to-slate-400',
      };
  }
};

export default ProjectHealthChart;
