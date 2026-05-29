'use client';

import Icon from '@/components/ui/AppIcon';

interface Metric {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface TeamMetricsProps {
  metrics: Metric[];
}

const TeamMetrics = ({ metrics }: TeamMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 transition-smooth hover:shadow-elevation-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}
            >
              <Icon name={metric.icon as any} size={24} variant="outline" className="text-white" />
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                metric.change >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}
            >
              <Icon
                name={metric.change >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'}
                size={14}
                variant="solid"
              />
              <span className="font-caption text-xs font-medium">
                {Math.abs(metric.change).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="font-caption text-sm text-muted-foreground mb-1">{metric.label}</p>
          <p className="font-heading font-bold text-2xl text-foreground">{metric.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TeamMetrics;
