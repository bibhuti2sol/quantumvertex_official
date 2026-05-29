import Icon from '@/components/ui/AppIcon';

const BrandingSection = () => {
  const features = [
    {
      icon: 'SparklesIcon',
      title: 'AI-Powered Insights',
      description: 'Smart task prioritization and workload balancing with predictive analytics',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: 'ChartBarIcon',
      title: 'Real-Time Analytics',
      description: 'Track productivity, project health, and team performance instantly',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: 'UsersIcon',
      title: 'Team Collaboration',
      description:
        'Seamless coordination with role-based access for admins, managers, and associates',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: 'ShieldCheckIcon',
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, SOC 2 compliance, and GDPR-ready infrastructure',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: 'CalendarIcon',
      title: 'Smart Scheduling',
      description: 'Intelligent deadline tracking with Gantt charts and milestone management',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      icon: 'BoltIcon',
      title: 'Productivity Boost',
      description: 'Kanban boards, focus mode, and AI recommendations to maximize efficiency',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50M+', label: 'Tasks Completed' },
  ];

  return (
    <div className="flex flex-col justify-center h-full py-8">
      {/* Brand Header with Gradient */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-3 mb-6 group">
          <div className="w-14 h-14 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-105">
            <span className="text-primary-foreground font-heading font-bold text-3xl">N</span>
          </div>
          <div>
            <h2 className="text-4xl font-heading font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NextGenTask
            </h2>
            <p className="text-base font-caption text-accent font-semibold tracking-wide">
              Manager
            </p>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-10 pt-8 border-t border-border">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheckIcon" size={18} variant="solid" className="text-success" />
            </div>
            <span className="text-sm font-caption font-medium text-foreground">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckBadgeIcon" size={18} variant="solid" className="text-success" />
            </div>
            <span className="text-sm font-caption font-medium text-foreground">
              SOC 2 Compliant
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="LockClosedIcon" size={18} variant="solid" className="text-success" />
            </div>
            <span className="text-sm font-caption font-medium text-foreground">GDPR Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingSection;
