'use client';

import Icon from '@/components/ui/AppIcon';

interface HealthMetric {
  label: string;
  value: number;
  target: number;
  status: 'on-track' | 'at-risk' | 'critical';
  icon: string;
  unit: string;
}

interface ProjectHealthDashboardProps {
  projectName: string;
  overallHealth: number;
  metrics: HealthMetric[];
}

const ProjectHealthDashboard = ({
  projectName,
  overallHealth,
  metrics,
}: ProjectHealthDashboardProps) => {
  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-success';
    if (health >= 60) return 'text-warning';
    return 'text-error';
  };

  const getHealthBgColor = (health: number) => {
    if (health >= 80) return 'bg-success/10';
    if (health >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-success text-success-foreground';
      case 'at-risk':
        return 'bg-warning text-warning-foreground';
      case 'critical':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">{projectName}</h3>
            <p className="font-caption text-sm text-muted-foreground mt-1">
              Project Health Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg ${getHealthBgColor(overallHealth)}`}
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted opacity-20"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallHealth / 100)}`}
                    className={getHealthColor(overallHealth)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`font-heading font-bold text-lg ${getHealthColor(overallHealth)}`}
                  >
                    {overallHealth}%
                  </span>
                </div>
              </div>
              <div>
                <p className="font-caption text-xs text-muted-foreground">Overall Health</p>
                <p
                  className={`font-heading font-semibold text-sm ${getHealthColor(overallHealth)}`}
                >
                  {overallHealth >= 80
                    ? 'Excellent'
                    : overallHealth >= 60
                      ? 'Good'
                      : 'Needs Attention'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(metric.status)}`}
                >
                  <Icon name={metric.icon as any} size={20} variant="outline" />
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-caption font-medium ${getStatusColor(metric.status)}`}
                >
                  {metric.status === 'on-track'
                    ? 'On Track'
                    : metric.status === 'at-risk'
                      ? 'At Risk'
                      : 'Critical'}
                </span>
              </div>
              <p className="font-caption text-sm text-muted-foreground mb-2">{metric.label}</p>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-heading font-bold text-2xl text-foreground">
                  {metric.value}
                  {metric.unit}
                </span>
                <span className="font-caption text-xs text-muted-foreground">
                  / {metric.target}
                  {metric.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    metric.status === 'on-track'
                      ? 'bg-success'
                      : metric.status === 'at-risk'
                        ? 'bg-warning'
                        : 'bg-error'
                  }`}
                  style={{ width: `${(metric.value / metric.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectHealthDashboard;
