'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ReportTemplateProps {
  title: string;
  description: string;
  icon: string;
  lastGenerated: string;
  onGenerate: () => void;
}

const ReportTemplate = ({
  title,
  description,
  icon,
  lastGenerated,
  onGenerate,
}: ReportTemplateProps) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    format: 'pdf',
    includeCharts: true,
    includeRawData: false,
    emailRecipients: '',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    onGenerate();
    setIsGenerating(false);
    setShowGenerateModal(false);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-5 hover:shadow-elevation-2 transition-smooth">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name={icon as any} size={24} variant="outline" className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-base text-foreground mb-1">{title}</h4>
            <p className="font-caption text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-caption text-xs text-muted-foreground">
                Last: {lastGenerated}
              </span>
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => !isGenerating && setShowGenerateModal(false)}
        >
          <div
            className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Generate Report
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
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
              <div>
                <h4 className="font-caption font-medium text-sm text-foreground mb-2">{title}</h4>
                <p className="font-caption text-xs text-muted-foreground">{description}</p>
              </div>

              <div>
                <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                  Export Format
                </label>
                <select
                  value={reportOptions.format}
                  onChange={(e) => setReportOptions({ ...reportOptions, format: e.target.value })}
                  disabled={isGenerating}
                  className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportOptions.includeCharts}
                    onChange={(e) =>
                      setReportOptions({ ...reportOptions, includeCharts: e.target.checked })
                    }
                    disabled={isGenerating}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <span className="font-caption text-sm text-foreground">
                    Include Charts & Visualizations
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportOptions.includeRawData}
                    onChange={(e) =>
                      setReportOptions({ ...reportOptions, includeRawData: e.target.checked })
                    }
                    disabled={isGenerating}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary disabled:opacity-50"
                  />
                  <span className="font-caption text-sm text-foreground">
                    Include Raw Data Tables
                  </span>
                </label>
              </div>

              <div>
                <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                  Email Recipients (Optional)
                </label>
                <input
                  type="text"
                  value={reportOptions.emailRecipients}
                  onChange={(e) =>
                    setReportOptions({ ...reportOptions, emailRecipients: e.target.value })
                  }
                  disabled={isGenerating}
                  placeholder="email1@example.com, email2@example.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportTemplate;
