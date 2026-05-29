'use client';

import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Deadline {
  id: number;
  taskName: string;
  assignee: string;
  assigneeAvatar: string;
  assigneeAvatarAlt: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'overdue';
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'CheckCircleIcon';
      case 'at-risk':
        return 'ExclamationTriangleIcon';
      case 'overdue':
        return 'XCircleIcon';
      default:
        return 'ClockIcon';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-success';
      case 'at-risk':
        return 'text-warning';
      case 'overdue':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">Upcoming Deadlines</h3>
        <Icon name="CalendarIcon" size={20} variant="outline" className="text-primary" />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border transition-smooth hover:shadow-elevation-1"
          >
            <AppImage
              src={deadline.assigneeAvatar}
              alt={deadline.assigneeAvatarAlt}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-caption font-medium text-sm text-foreground truncate">
                {deadline.taskName}
              </p>
              <p className="font-caption text-xs text-muted-foreground">{deadline.assignee}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`px-2 py-1 rounded-full font-caption text-xs font-medium ${getPriorityColor(
                  deadline.priority
                )}`}
              >
                {deadline.priority}
              </span>
              <Icon
                name={getStatusIcon(deadline.status) as any}
                size={18}
                variant="solid"
                className={getStatusColor(deadline.status)}
              />
            </div>
            <p className="font-caption text-xs text-muted-foreground flex-shrink-0">
              {deadline.dueDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
