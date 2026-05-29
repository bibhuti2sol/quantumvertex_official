'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface RecentReportItemProps {
  name: string;
  type: string;
  generatedDate: string;
  size: string;
  status: 'completed' | 'processing' | 'scheduled';
  onDownload: () => void;
  onShare: () => void;
}

const RecentReportItem = ({
  name,
  type,
  generatedDate,
  size,
  status,
  onDownload,
  onShare,
}: RecentReportItemProps) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [showShareSuccess, setShowShareSuccess] = useState(false);

  const statusConfig = {
    completed: {
      label: 'Completed',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    processing: {
      label: 'Processing',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    scheduled: {
      label: 'Scheduled',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  };

  const config = statusConfig[status];

  const handleDownload = async () => {
    setIsDownloading(true);

    // Simulate download
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onDownload();
    setIsDownloading(false);
    setShowDownloadSuccess(true);

    setTimeout(() => setShowDownloadSuccess(false), 3000);
  };

  const handleShare = async () => {
    // Simulate sharing
    await new Promise((resolve) => setTimeout(resolve, 500));

    onShare();
    setShowShareModal(false);
    setShowShareSuccess(true);
    setShareEmail('');
    setShareMessage('');

    setTimeout(() => setShowShareSuccess(false), 3000);
  };

  const handleCopyLink = () => {
    const link = `https://app.example.com/reports/${name.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-smooth">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon name="DocumentTextIcon" size={20} variant="outline" className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-caption font-medium text-sm text-foreground truncate mb-1">{name}</h5>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-caption text-xs text-muted-foreground">{type}</span>
            <span className="font-caption text-xs text-muted-foreground">{generatedDate}</span>
            <span className="font-caption text-xs text-muted-foreground">{size}</span>
            <span
              className={`font-caption text-xs font-medium px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}
            >
              {config.label}
            </span>
          </div>
        </div>
        {status === 'completed' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 rounded-md hover:bg-muted transition-smooth disabled:opacity-50"
              aria-label="Download report"
            >
              {isDownloading ? (
                <div className="w-[18px] h-[18px] border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon
                  name="ArrowDownTrayIcon"
                  size={18}
                  variant="outline"
                  className="text-muted-foreground"
                />
              )}
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-md hover:bg-muted transition-smooth"
              aria-label="Share report"
            >
              <Icon
                name="ShareIcon"
                size={18}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-foreground">Share Report</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-muted rounded-md transition-smooth"
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
                <h4 className="font-caption font-medium text-sm text-foreground mb-1">{name}</h4>
                <p className="font-caption text-xs text-muted-foreground">
                  {type} • {size}
                </p>
              </div>

              <div>
                <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                  Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`https://app.example.com/reports/${name.toLowerCase().replace(/\s+/g, '-')}`}
                    readOnly
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <label className="font-caption text-sm font-medium text-foreground mb-2 block">
                  Send via Email
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-3"
                />
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Add a message (optional)"
                  rows={3}
                  className="w-full px-4 py-2 bg-background border border-border rounded-md font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption text-sm font-medium hover:bg-muted/80 transition-smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={!shareEmail}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption text-sm font-medium hover:bg-primary/90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notifications */}
      {showDownloadSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-success text-white px-6 py-3 rounded-lg shadow-elevation-3 flex items-center gap-3">
          <Icon name="CheckCircleIcon" size={20} variant="solid" />
          <span className="font-caption text-sm font-medium">Report downloaded successfully</span>
        </div>
      )}
      {showShareSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-success text-white px-6 py-3 rounded-lg shadow-elevation-3 flex items-center gap-3">
          <Icon name="CheckCircleIcon" size={20} variant="solid" />
          <span className="font-caption text-sm font-medium">Report shared successfully</span>
        </div>
      )}
    </>
  );
};

export default RecentReportItem;
