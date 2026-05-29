interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ title, value, change, changeLabel, icon, trend }: MetricCardProps) => {
  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted-foreground',
  };

  const trendBgColors = {
    up: 'bg-success/10',
    down: 'bg-error/10',
    neutral: 'bg-muted',
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="font-caption text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-heading font-bold text-foreground">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${trendBgColors[trend]} flex items-center justify-center`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-caption text-sm font-medium ${trendColors[trend]}`}>
          {change > 0 ? '+' : ''}
          {change}%
        </span>
        <span className="font-caption text-xs text-muted-foreground">{changeLabel}</span>
      </div>
    </div>
  );
};

export default MetricCard;
