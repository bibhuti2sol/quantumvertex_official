'use client';

import { useState } from 'react';
// import Icon from '@/components/ui/AppIcon';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  type: 'meeting' | 'deadline' | 'milestone';
}

interface CalendarPreviewProps {
  events: CalendarEvent[];
}

const CalendarPreview = ({ events }: CalendarPreviewProps) => {
  const [selectedDate] = useState('January 27, 2026');

  const eventColors = {
    meeting: 'bg-primary/10 text-primary border-primary/20',
    deadline: 'bg-error/10 text-error border-error/20',
    milestone: 'bg-success/10 text-success border-success/20',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-lg text-foreground">{selectedDate}</h3>
        <button className="text-primary text-sm font-caption font-medium hover:underline flex items-center gap-1">
          View Calendar
        </button>
      </div>
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-caption">No events scheduled</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className={`border rounded-lg p-3 ${eventColors[event.type]}`}>
              <div className="flex items-center gap-3">
                {/* Icon removed as requested */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-caption font-semibold text-sm">{event.title}</h4>
                  <p className="text-xs font-caption opacity-80">{event.time}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarPreview;
