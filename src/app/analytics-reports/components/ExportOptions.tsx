'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ExportOptionsProps {
  onExport: (format: string, options: any) => void;
}

const ExportOptions = ({ onExport }: ExportOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeBranding, setIncludeBranding] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onExport(selectedFormat, {
      includeCharts,
      includeBranding,
    });

    setIsExporting(false);
    setIsOpen(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth flex items-center gap-2"
        >
          <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
          Export Report
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 p-4">
              <h4 className="font-heading font-semibold text-base text-foreground mb-4">
                Export Options
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="font-caption text-sm text-foreground mb-2 block">Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['pdf', 'excel', 'csv'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setSelectedFormat(format)}
                        className={`px-3 py-2 rounded-md font-caption text-sm font-medium transition-smooth ${
                          selectedFormat === format
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="font-caption text-sm text-foreground">Include Charts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeBranding}
                      onChange={(e) => setIncludeBranding(e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="font-caption text-sm text-foreground">Include Branding</span>
                  </label>
                </div>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    'Export Now'
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-success text-white px-6 py-3 rounded-lg shadow-elevation-3 flex items-center gap-3 animate-slide-up">
          <Icon name="CheckCircleIcon" size={20} variant="solid" />
          <span className="font-caption text-sm font-medium">
            Report exported successfully as {selectedFormat.toUpperCase()}
          </span>
        </div>
      )}
    </>
  );
};

export default ExportOptions;
