'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PrivacyDataSettingsProps {
  onExportData: () => void;
  onDeleteAccount: () => void;
}

const PrivacyDataSettings = ({ onExportData, onDeleteAccount }: PrivacyDataSettingsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleDeleteAccount = () => {
    if (!isHydrated) return;
    if (deleteConfirmation.toLowerCase() === 'delete my account') {
      onDeleteAccount();
      setShowDeleteModal(false);
    } else {
      alert('Please type the confirmation text exactly as shown');
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
          <Icon name="LockClosedIcon" size={24} variant="outline" className="text-primary" />
          Privacy & Data
        </h2>

        <div className="space-y-4">
          {/* Data Export */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1">
                  Export Your Data
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  Download a copy of all your data including tasks, projects, and activity history
                </p>
              </div>
              <button
                onClick={onExportData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth flex items-center gap-2"
              >
                <Icon name="ArrowDownTrayIcon" size={16} variant="outline" />
                Export
              </button>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1">
                  Privacy Settings
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  Control who can see your profile and activity
                </p>
              </div>
              <button className="px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth">
                Manage
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-error bg-opacity-10 rounded-md border border-error">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-error mb-1 flex items-center gap-2">
                  <Icon name="ExclamationTriangleIcon" size={16} variant="outline" />
                  Delete Account
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-error text-error-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-elevation-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-error bg-opacity-10 rounded-full flex items-center justify-center">
                <Icon
                  name="ExclamationTriangleIcon"
                  size={24}
                  variant="outline"
                  className="text-error"
                />
              </div>
              <h3 className="text-lg font-heading font-semibold text-foreground">Delete Account</h3>
            </div>

            <p className="font-caption text-sm text-muted-foreground mb-4">
              This action is permanent and cannot be undone. All your data, including tasks,
              projects, and activity history will be permanently deleted.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-caption font-medium text-foreground mb-2">
                Type "delete my account" to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-error"
                placeholder="delete my account"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation.toLowerCase() !== 'delete my account'}
                className="flex-1 px-4 py-2 bg-error text-error-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyDataSettings;
