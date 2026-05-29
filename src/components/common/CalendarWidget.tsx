'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CalendarWidgetProps {
  isCollapsed?: boolean;
}

const CalendarWidget = ({ isCollapsed = false }: CalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      days.push(
        <div
          key={day}
          className={`text-center text-[10px] py-0.5 rounded ${
            isToday
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="px-3 py-3 border-t border-border">
      <div className="bg-muted/30 rounded-lg p-2">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handlePrevMonth}
            className="p-0.5 hover:bg-muted rounded transition-smooth"
            aria-label="Previous month"
          >
            <Icon name="ChevronLeftIcon" size={14} variant="outline" />
          </button>
          <span className="text-xs font-medium text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-0.5 hover:bg-muted rounded transition-smooth"
            aria-label="Next month"
          >
            <Icon name="ChevronRightIcon" size={14} variant="outline" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-0.5 mb-1.5">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-[10px] font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5">{renderCalendarDays()}</div>
      </div>
    </div>
  );
};

export default CalendarWidget;
