'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface NotificationSettings {
  emailNotifications: {
    taskAssigned: boolean;
    taskCompleted: boolean;
    deadlineReminders: boolean;
    escalations: boolean;
    weeklyDigest: boolean;
  };
  popupNotifications: {
    taskUpdates: boolean;
    mentions: boolean;
    comments: boolean;
    realTimeCollaboration: boolean;
  };
  frequency: 'instant' | 'hourly' | 'daily';
}

interface NotificationPreferencesProps {
  initialSettings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

const NotificationPreferences = ({ initialSettings, onSave }: NotificationPreferencesProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleEmailToggle = (key: keyof NotificationSettings['emailNotifications']) => {
    if (!isHydrated) return;
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: !prev.emailNotifications[key],
      },
    }));
    setHasChanges(true);
  };

  const handlePopupToggle = (key: keyof NotificationSettings['popupNotifications']) => {
    if (!isHydrated) return;
    setSettings((prev) => ({
      ...prev,
      popupNotifications: {
        ...prev.popupNotifications,
        [key]: !prev.popupNotifications[key],
      },
    }));
    setHasChanges(true);
  };

  const handleFrequencyChange = (frequency: 'instant' | 'hourly' | 'daily') => {
    if (!isHydrated) return;
    setSettings((prev) => ({ ...prev, frequency }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!isHydrated) return;
    onSave(settings);
    setHasChanges(false);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Notification Preferences
        </h2>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-success text-success-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="EnvelopeIcon" size={20} variant="outline" className="text-primary" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-background rounded-md border border-input"
              >
                <div>
                  <p className="font-caption font-medium text-sm text-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    Receive email alerts for this activity
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleEmailToggle(key as keyof NotificationSettings['emailNotifications'])
                  }
                  className={`relative w-12 h-6 rounded-full transition-smooth ${
                    value ? 'bg-success' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-smooth ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popup Notifications */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="BellIcon" size={20} variant="outline" className="text-primary" />
            Popup Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(settings.popupNotifications).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-background rounded-md border border-input"
              >
                <div>
                  <p className="font-caption font-medium text-sm text-foreground">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="font-caption text-xs text-muted-foreground mt-1">
                    Show real-time popup alerts
                  </p>
                </div>
                <button
                  onClick={() =>
                    handlePopupToggle(key as keyof NotificationSettings['popupNotifications'])
                  }
                  className={`relative w-12 h-6 rounded-full transition-smooth ${
                    value ? 'bg-success' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-smooth ${
                      value ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Frequency */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="ClockIcon" size={20} variant="outline" className="text-primary" />
            Notification Frequency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['instant', 'hourly', 'daily'] as const).map((freq) => (
              <button
                key={freq}
                onClick={() => handleFrequencyChange(freq)}
                className={`p-4 rounded-md border-2 transition-smooth ${
                  settings.frequency === freq
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-input bg-background hover:border-muted-foreground'
                }`}
              >
                <p className="font-caption font-medium text-sm text-foreground capitalize">
                  {freq}
                </p>
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  {freq === 'instant' && 'Get notified immediately'}
                  {freq === 'hourly' && 'Digest every hour'}
                  {freq === 'daily' && 'Daily summary'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
