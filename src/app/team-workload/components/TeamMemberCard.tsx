'use client';

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  currentTasks: number;
  capacity: number;
  completionRate: number;
  avgCompletionTime: string;
  status: 'available' | 'busy' | 'overloaded';
}

interface TeamMemberCardProps {
  member: TeamMember;
  onViewDetails: (id: number) => void;
  onReassignTasks: (id: number) => void;
}

const TeamMemberCard = ({ member, onViewDetails, onReassignTasks }: TeamMemberCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'busy':
        return 'bg-warning text-warning-foreground';
      case 'overloaded':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return 'bg-error';
    if (capacity >= 70) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-smooth hover:shadow-elevation-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <AppImage
              src={member.avatar}
              alt={member.avatarAlt}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(
                member.status
              )}`}
            />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">{member.name}</h3>
            <p className="font-caption text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-md hover:bg-muted transition-smooth"
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <Icon
            name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
            size={20}
            variant="outline"
          />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-caption text-sm text-muted-foreground">Capacity</span>
            <span className="font-caption font-semibold text-sm text-foreground">
              {member.capacity.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-smooth ${getCapacityColor(member.capacity)}`}
              style={{ width: `${member.capacity}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="font-caption text-xs text-muted-foreground mb-1">Current Tasks</p>
            <p className="font-heading font-semibold text-xl text-foreground">
              {member.currentTasks}
            </p>
          </div>
          <div>
            <p className="font-caption text-xs text-muted-foreground mb-1">Completion Rate</p>
            <p className="font-heading font-semibold text-xl text-success">
              {member.completionRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="font-caption text-xs text-muted-foreground mb-1">Avg. Time</p>
            <p className="font-heading font-semibold text-xl text-foreground">
              {member.avgCompletionTime}
            </p>
          </div>
        </div>

        {isExpanded && (
          <div className="pt-4 border-t border-border space-y-3">
            <button
              onClick={() => onViewDetails(member.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-smooth"
            >
              <Icon name="UserIcon" size={18} variant="outline" />
              <span className="font-caption font-medium text-sm">View Details</span>
            </button>
            <button
              onClick={() => onReassignTasks(member.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-smooth"
            >
              <Icon name="ArrowsRightLeftIcon" size={18} variant="outline" />
              <span className="font-caption font-medium text-sm">Reassign Tasks</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
