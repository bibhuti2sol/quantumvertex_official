'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  isMilestone: boolean;
  isCriticalPath: boolean;
}

interface GanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDependencyCreate?: (fromTaskId: string, toTaskId: string) => void;
}

const GanttChart = ({ tasks, onTaskUpdate, onDependencyCreate }: GanttChartProps) => {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('weeks');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getDateRange = () => {
    const allDates = tasks.flatMap((task) => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getDateRange();
  const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  const getTaskPosition = (task: Task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    const startOffset = Math.ceil((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const handleTaskDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleTaskDragEnd = () => {
    setDraggedTask(null);
  };

  const priorityColors = {
    High: 'bg-error',
    Medium: 'bg-warning',
    Low: 'bg-success',
  };

  return (
    <div className="w-full bg-card rounded-lg border border-border overflow-hidden">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">Project Timeline</h3>
          <div className="flex items-center gap-2 bg-background rounded-md p-1">
            {(['days', 'weeks', 'months'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded font-caption text-sm transition-smooth ${
                  viewMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-primary transition-smooth">
            <Icon name="FunnelIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-smooth">
            <Icon name="PlusIcon" size={18} variant="outline" />
            <span className="font-caption text-sm">Add Task</span>
          </button>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex items-center border-b border-border bg-muted/20">
            <div className="w-[240px] px-6 py-3 border-r border-border">
              <span className="font-caption font-medium text-sm text-muted-foreground">
                Task Name
              </span>
            </div>
            <div className="flex-1 px-4 py-3 flex items-center justify-between">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(minDate);
                date.setDate(date.getDate() + (i * totalDays) / 12);
                return (
                  <div key={i} className="flex flex-col items-center">
                    <span className="font-caption text-xs text-muted-foreground">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Rows */}
          <div className="relative">
            {tasks.map((task, index) => {
              const position = getTaskPosition(task);
              return (
                <div
                  key={task.id}
                  className={`flex items-center border-b border-border hover:bg-muted/30 transition-smooth ${
                    selectedTask === task.id ? 'bg-muted/50' : ''
                  }`}
                  onClick={() => setSelectedTask(task.id)}
                >
                  <div className="w-[240px] px-6 py-4 border-r border-border">
                    <div className="flex items-center gap-3">
                      {task.isMilestone && (
                        <Icon name="FlagIcon" size={16} variant="solid" className="text-accent" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-caption text-sm text-foreground truncate">{task.name}</p>
                        <p className="font-caption text-xs text-muted-foreground">
                          {task.assignee}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 px-4 py-4 relative h-[60px]">
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-md cursor-move transition-smooth ${
                        task.isCriticalPath ? 'ring-2 ring-error ring-offset-2' : ''
                      } ${priorityColors[task.priority]} ${
                        draggedTask === task.id ? 'opacity-50' : 'opacity-100'
                      }`}
                      style={position}
                      draggable
                      onDragStart={() => handleTaskDragStart(task.id)}
                      onDragEnd={handleTaskDragEnd}
                    >
                      <div className="h-full flex items-center justify-between px-3">
                        <span className="font-caption text-xs text-white font-medium">
                          {task.progress}%
                        </span>
                        {task.isCriticalPath && (
                          <Icon
                            name="ExclamationTriangleIcon"
                            size={14}
                            variant="solid"
                            className="text-white"
                          />
                        )}
                      </div>
                      <div
                        className="absolute top-0 left-0 h-full bg-white/30 rounded-l-md transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-6 py-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-error" />
          <span className="font-caption text-xs text-muted-foreground">High Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning" />
          <span className="font-caption text-xs text-muted-foreground">Medium Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success" />
          <span className="font-caption text-xs text-muted-foreground">Low Priority</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="FlagIcon" size={16} variant="solid" className="text-accent" />
          <span className="font-caption text-xs text-muted-foreground">Milestone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-error ring-2 ring-error ring-offset-2" />
          <span className="font-caption text-xs text-muted-foreground">Critical Path</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
