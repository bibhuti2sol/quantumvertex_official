'use client';

import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface AvailabilitySlot {
  date: string;
  dayName: string;
  members: {
    id: number;
    name: string;
    avatar: string;
    avatarAlt: string;
    status: 'available' | 'busy' | 'off';
  }[];
}

interface TeamAvailabilityProps {
  availability: AvailabilitySlot[];
}

const TeamAvailability = ({ availability }: TeamAvailabilityProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-success';
      case 'busy':
        return 'border-warning';
      case 'off':
        return 'border-muted';
      default:
        return 'border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-lg text-foreground">Team Availability</h3>
        <Icon name="CalendarDaysIcon" size={20} variant="outline" className="text-primary" />
      </div>

      <div className="space-y-4">
        {availability.map((slot, index) => (
          <div key={index} className="pb-4 border-b border-border last:border-b-0 last:pb-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-caption font-semibold text-sm text-foreground">{slot.dayName}</p>
                <p className="font-caption text-xs text-muted-foreground">{slot.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  name="UserGroupIcon"
                  size={16}
                  variant="outline"
                  className="text-muted-foreground"
                />
                <span className="font-caption text-xs text-muted-foreground">
                  {slot.members.filter((m) => m.status === 'available').length} available
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {slot.members.map((member) => (
                <div
                  key={member.id}
                  className="relative group"
                  title={`${member.name} - ${member.status}`}
                >
                  <AppImage
                    src={member.avatar}
                    alt={member.avatarAlt}
                    className={`w-10 h-10 rounded-full object-cover border-2 ${getStatusColor(
                      member.status
                    )}`}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded-md shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap z-10">
                    <p className="font-caption text-xs text-foreground">{member.name}</p>
                    <p className="font-caption text-xs text-muted-foreground capitalize">
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamAvailability;
