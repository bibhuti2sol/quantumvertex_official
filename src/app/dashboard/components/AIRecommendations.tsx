import Icon from '@/components/ui/AppIcon';

interface Recommendation {
  id: number;
  type: 'priority' | 'workload' | 'deadline' | 'automation';
  title: string;
  description: string;
  action: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

const AIRecommendations = ({ recommendations }: AIRecommendationsProps) => {
  const typeIcons = {
    priority: { icon: 'SparklesIcon', color: 'text-primary' },
    workload: { icon: 'ScaleIcon', color: 'text-warning' },
    deadline: { icon: 'ClockIcon', color: 'text-error' },
    automation: { icon: 'BoltIcon', color: 'text-success' },
  };

  return (
    <div className="space-y-3">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
        >
          <div className="flex items-start gap-3">
            {/* Icon removed as requested */}
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-base text-foreground mb-1">
                {rec.title}
              </h4>
              <p className="text-sm text-muted-foreground font-caption mb-3">{rec.description}</p>
              <button className="text-primary text-sm font-caption font-medium hover:underline flex items-center gap-1">
                {rec.action}
                <Icon name="ArrowRightIcon" size={16} variant="outline" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIRecommendations;
