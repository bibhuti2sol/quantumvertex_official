'use client';

import Icon from '@/components/ui/AppIcon';

interface ViewModeToggleProps {
  currentView: 'list' | 'kanban' | 'focus';
  onViewChange: (view: 'list' | 'kanban' | 'focus') => void;
}

const ViewModeToggle = ({ currentView, onViewChange }: ViewModeToggleProps) => {
  const views = [
    { id: 'list' as const, label: 'List', icon: 'ListBulletIcon' },
    { id: 'kanban' as const, label: 'Kanban', icon: 'ViewColumnsIcon' },
    { id: 'focus' as const, label: 'Focus', icon: 'EyeIcon' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-muted rounded-lg p-1">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-caption font-medium text-sm transition-smooth ${
            currentView === view.id
              ? 'bg-primary text-primary-foreground shadow-elevation-1'
              : 'text-muted-foreground hover:text-foreground hover:bg-background'
          }`}
          aria-label={`Switch to ${view.label} view`}
        >
          <Icon
            name={view.icon as any}
            size={18}
            variant={currentView === view.id ? 'solid' : 'outline'}
          />
          <span className="hidden sm:inline">{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewModeToggle;
