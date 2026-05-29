import React from 'react';
import { Subtask } from './types';

interface SubtaskViewProps {
  subtasks: Subtask[];
  onEdit: (subtask: Subtask) => void;
}

const SubtaskView = ({ subtasks, onEdit }: SubtaskViewProps) => {
  const getStatusColor = (status: Subtask['status']) => {
    switch (status) {
      case 'To Do':
        return 'text-muted-foreground bg-muted';
      case 'In Progress':
        return 'text-primary bg-primary/10';
      case 'Review':
        return 'text-warning bg-warning/10';
      case 'Completed':
        return 'text-success bg-success/10';
    }
  };

  return (
    <div className="space-y-3">
      {subtasks.length > 0 ? (
        subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="py-3 border-b border-border last:border-0 hover:bg-muted/5 transition-colors px-2 sm:px-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-caption text-sm text-foreground font-semibold truncate">
                    {subtask.title}
                  </span>
                  <span
                    className={`font-caption text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${getStatusColor(subtask.status)} whitespace-nowrap`}
                  >
                    {subtask.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-foreground/70">Assignee:</span>{' '}
                    {subtask.assignee || 'Unassigned'}
                  </span>
                  {subtask.startDate && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground/70">Start:</span>{' '}
                      {new Date(subtask.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {subtask.endDate && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium text-foreground/70">End:</span>{' '}
                      {new Date(subtask.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Edit subtask"
                className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth shrink-0"
                onClick={() => onEdit(subtask)}
                title="Edit Subtask"
              >
                ✏️
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="font-caption text-xs text-muted-foreground">No subtasks available.</div>
      )}
    </div>
  );
};

export default SubtaskView;
