'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { useUser } from '@/components/common/UserContext';
import { API_ENDPOINTS } from '@/config/api';

interface SecuritySettingsProps {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
  onPasswordChange: () => void;
  onToggle2FA: (enabled: boolean) => void;
  onViewSessions: () => void;
  onViewAuditLog: () => void;
}

const SecuritySettings = ({
  twoFactorEnabled,
  lastPasswordChange,
  activeSessions,
  onPasswordChange,
  onToggle2FA,
  onViewSessions,
  onViewAuditLog,
}: SecuritySettingsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const { user } = useUser();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handlePasswordSubmit = async () => {
    if (!isHydrated) return;

    if (!passwordForm.currentPassword.trim()) {
      alert('Current password is required');
      return;
    }
    if (!passwordForm.newPassword.trim()) {
      alert('New password is required');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userId = user?.userId;
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await axios.post(
        API_ENDPOINTS.users.changePassword(userId),
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert('Password updated successfully!');
        onPasswordChange();
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(response.data?.message || 'Failed to update password.');
      }
    } catch (err: any) {
      console.error('Error updating password:', err);
      const errMsg =
        err.response?.data?.message ||
        'Failed to change password. Please check your current password and try again.';
      alert(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
          <Icon name="ShieldCheckIcon" size={24} variant="outline" className="text-primary" />
          Security Settings
        </h2>

        <div className="space-y-4">
          {/* Password Management */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1">
                  Password
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  Last changed: {lastPasswordChange}
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1 flex items-center gap-2">
                  Two-Factor Authentication
                  {twoFactorEnabled && (
                    <span className="px-2 py-0.5 bg-success text-success-foreground text-xs rounded-full">
                      Enabled
                    </span>
                  )}
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() => onToggle2FA(!twoFactorEnabled)}
                className={`relative w-12 h-6 rounded-full transition-smooth ${
                  twoFactorEnabled ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-smooth ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1">
                  Active Sessions
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  {activeSessions} active session{activeSessions !== 1 ? 's' : ''} detected
                </p>
              </div>
              <button
                onClick={onViewSessions}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth"
              >
                View All
              </button>
            </div>
          </div>

          {/* Audit Log */}
          <div className="p-4 bg-background rounded-md border border-input">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-caption font-semibold text-sm text-foreground mb-1">
                  Audit Log
                </h3>
                <p className="font-caption text-xs text-muted-foreground">
                  View your account activity history
                </p>
              </div>
              <button
                onClick={onViewAuditLog}
                className="px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth"
              >
                View Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000] p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-elevation-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Change Password
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="XMarkIcon" size={24} variant="outline" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-caption font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handlePasswordSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-success text-success-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Update Password'
                )}
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth disabled:opacity-50"
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

export default SecuritySettings;
