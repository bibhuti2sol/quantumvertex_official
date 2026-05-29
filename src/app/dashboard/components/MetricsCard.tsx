interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  variant: 'primary' | 'success' | 'warning' | 'error';
}

const MetricsCard = ({ title, value, change, icon, variant }: MetricsCardProps) => {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${variantClasses[variant]}`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-caption font-medium ${isPositive ? 'text-success' : 'text-error'}`}
        >
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
      <h3 className="text-muted-foreground font-caption text-sm mb-1">{title}</h3>
      <p className="text-foreground font-heading font-bold text-2xl">{value}</p>
    </div>
  );
};

export default MetricsCard;
