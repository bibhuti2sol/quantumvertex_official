'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PredictiveInsightProps {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
  confidence: number;
}

const PredictiveInsight = ({
  title,
  description,
  impact,
  recommendation,
  confidence,
}: PredictiveInsightProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const impactConfig = {
    high: {
      color: 'text-error',
      bgColor: 'bg-error/10',
      icon: 'ExclamationTriangleIcon',
    },
    medium: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      icon: 'ExclamationCircleIcon',
    },
    low: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      icon: 'InformationCircleIcon',
    },
  };

  const config = impactConfig[impact];

  const handleApplyRecommendation = async () => {
    setIsApplying(true);

    // Simulate applying recommendation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsApplying(false);
    setShowApplyModal(false);
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon name={config.icon as any} size={20} variant="solid" className={config.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-heading font-semibold text-base text-foreground">{title}</h4>
              <span className="font-caption text-xs text-muted-foreground whitespace-nowrap">
                {confidence}% confidence
              </span>
            </div>
            <p className="font-caption text-sm text-muted-foreground mb-3">{description}</p>
            <div className="bg-accent/10 rounded-md p-3 border-l-4 border-accent mb-4">
              <p className="font-caption text-sm text-foreground">
                <span className="font-medium">Recommendation:</span> {recommendation}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowApplyModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth flex items-center gap-2"
              >
                <Icon name="CheckIcon" size={16} variant="outline" />
                Apply Recommendation
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Recommendation Modal */}
      {showApplyModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => !isApplying && setShowApplyModal(false)}
        >
          <div
            className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Apply Recommendation
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={isApplying}
                className="p-2 hover:bg-muted rounded-md transition-smooth disabled:opacity-50"
              >
                <Icon
                  name="XMarkIcon"
                  size={20}
                  variant="outline"
                  className="text-muted-foreground"
                />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className={`flex items-start gap-3 p-4 rounded-lg ${config.bgColor}`}>
                <Icon
                  name={config.icon as any}
                  size={20}
                  variant="solid"
                  className={config.color}
                />
                <div>
                  <h4 className="font-caption font-semibold text-sm text-foreground mb-1">
                    {title}
                  </h4>
                  <p className="font-caption text-xs text-muted-foreground">
                    {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact • {confidence}%
                    Confidence
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-caption font-medium text-sm text-foreground mb-2">
                  Recommended Action:
                </h5>
                <p className="font-caption text-sm text-muted-foreground">{recommendation}</p>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
                <p className="font-caption text-xs text-foreground">
                  <span className="font-medium">Note:</span> Applying this recommendation will
                  create tasks and notify relevant team members.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={isApplying}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyRecommendation}
                disabled={isApplying}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 flex items-center gap-2"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Icon name="CheckIcon" size={16} variant="outline" />
                    Apply Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PredictiveInsight;
