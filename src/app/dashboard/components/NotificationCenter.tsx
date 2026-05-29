'use client';

import { useState } from 'react';
// import Icon from '@/components/ui/AppIcon';

interface Notification {
  id: number;
  type: 'escalation' | 'blocker' | 'milestone' | 'deadline';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter = ({ notifications: initialNotifications }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const notificationIcons = {
    escalation: { icon: 'ExclamationTriangleIcon', color: 'text-error' },
    blocker: { icon: 'ShieldExclamationIcon', color: 'text-warning' },
    milestone: { icon: 'TrophyIcon', color: 'text-success' },
    deadline: { icon: 'ClockIcon', color: 'text-primary' },
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
        aria-label="Notifications"
      >
        {/* Icon removed as requested */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-caption font-medium w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevation-4 z-50 max-h-[500px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-heading font-semibold text-lg text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-primary text-sm font-caption font-medium hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  {/* Icon removed as requested */}
                  <p className="text-muted-foreground font-caption">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted transition-smooth cursor-pointer ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon removed as requested */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-caption font-semibold text-sm text-foreground mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground font-caption mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground font-caption">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
