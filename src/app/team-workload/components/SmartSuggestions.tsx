'use client';

import Icon from '@/components/ui/AppIcon';

interface Suggestion {
  id: number;
  type: 'reassign' | 'balance' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

interface SmartSuggestionsProps {
  suggestions: Suggestion[];
  onApplySuggestion: (id: number) => void;
  onDismissSuggestion: (id: number) => void;
}

const SmartSuggestions = ({
  suggestions,
  onApplySuggestion,
  onDismissSuggestion,
}: SmartSuggestionsProps) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reassign':
        return 'ArrowsRightLeftIcon';
      case 'balance':
        return 'ScaleIcon';
      case 'alert':
        return 'BellAlertIcon';
      default:
        return 'LightBulbIcon';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="SparklesIcon" size={20} variant="solid" className="text-accent" />
        <h3 className="font-heading font-semibold text-lg text-foreground">
          AI-Powered Suggestions
        </h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 rounded-lg border transition-smooth ${getImpactColor(
              suggestion.impact
            )}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <Icon
                name={getTypeIcon(suggestion.type) as any}
                size={20}
                variant="outline"
                className="flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-caption font-semibold text-sm mb-1">{suggestion.title}</h4>
                <p className="font-caption text-xs opacity-80">{suggestion.description}</p>
              </div>
              <span className="px-2 py-1 rounded-full font-caption text-xs font-medium bg-background/50 flex-shrink-0">
                {suggestion.impact} impact
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApplySuggestion(suggestion.id)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:opacity-90 transition-smooth"
              >
                Apply
              </button>
              <button
                onClick={() => onDismissSuggestion(suggestion.id)}
                className="px-4 py-2 bg-background text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted transition-smooth"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
