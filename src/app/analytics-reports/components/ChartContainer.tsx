interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const ChartContainer = ({ title, subtitle, children, actions }: ChartContainerProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{title}</h3>
          {subtitle && <p className="font-caption text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default ChartContainer;
