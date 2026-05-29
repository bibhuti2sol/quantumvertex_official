'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Subtask {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee: string;
  startDate: string;
  endDate: string;
}

interface SubtaskEditModalProps {
  subtask: Subtask | null;
  onSave: (updated: Subtask) => void;
  onClose: () => void;
}

const SubtaskEditModal = ({ subtask, onSave, onClose }: SubtaskEditModalProps) => {
  const [title, setTitle] = useState(subtask?.title || '');
  const [status, setStatus] = useState<Subtask['status']>(subtask?.status || 'To Do');
  const [assignee, setAssignee] = useState(subtask?.assignee || '');
  const [startDate, setStartDate] = useState(subtask?.startDate || '');
  const [endDate, setEndDate] = useState(subtask?.endDate || '');

  return null; // Placeholder, implement modal UI as needed
};

interface Task {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatar: string;
    alt: string;
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number;
  project: string;
  department?: string; // Add department field
  subtasks: number;
  completedSubtasks: number;
  subtaskList?: Subtask[];
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (taskId: string) => void;
}

const TaskListView = ({
  tasks: initialTasks = [],
  onTaskClick,
  onStatusChange,
  onEditTask,
}: TaskListViewProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Ensure `tasks` and `selectedTasks` are initialized with default values.
  const tasks: Task[] = Array.isArray(initialTasks) ? initialTasks : []; // Ensure tasks is always an array
  const selectedTasksState: string[] = Array.isArray(selectedTasks) ? selectedTasks : []; // Ensure selectedTasks is always an array

  // Add nullish coalescing to safely handle undefined values.
  const hasSelectedTasks = (selectedTasksState?.length ?? 0) > 0;
  const hasTasks = (tasks?.length ?? 0) > 0;

  // Ensure all `map` and `length` operations are guarded.
  const safeTasks = tasks ?? []; // Default to an empty array if tasks is undefined
  const safeSelectedTasks = selectedTasksState ?? []; // Default to an empty array if selectedTasksState is undefined

  const handleSort = (column: keyof Task) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string) => {
    if (selectedTasksState.includes(taskId)) {
      setSelectedTasks(selectedTasksState.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasksState, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTasksState.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10';
      case 'Medium':
        return 'text-warning bg-warning/10';
      case 'Low':
        return 'text-success bg-success/10';
    }
  };

  const getStatusColor = (status: Task['status']) => {
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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {selectedTasksState.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border">
          <span className="font-caption text-sm text-foreground">
            {selectedTasksState.length} task{selectedTasksState.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="ArrowPathIcon" size={14} variant="outline" />
              Change Status
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-xs font-caption font-medium text-foreground hover:bg-muted transition-smooth">
              <Icon name="UserGroupIcon" size={14} variant="outline" />
              Reassign
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-error/10 border border-error/20 rounded-md text-xs font-caption font-medium text-error hover:bg-error/20 transition-smooth">
              <Icon name="TrashIcon" size={14} variant="outline" />
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedTasksState.length === tasks.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Title
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assignee')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Assignee
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Priority
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Status
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Start Date
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('endDate')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  End Date
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">
                  Overdue Tasks
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">
                  Progress
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-medium text-xs text-muted-foreground">
                  Actions
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-2 font-caption font-medium text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Department
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const today = new Date();
              const endDate = new Date(task.endDate);
              const isOverdue = endDate < today && task.status !== 'Completed';
              return (
                <React.Fragment key={task.id}>
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTasksState.includes(task.id)}
                        onChange={() => handleSelectTask(task.id)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={
                            expandedTaskId === task.id ? 'Collapse subtasks' : 'Expand subtasks'
                          }
                          className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              transform: `rotate(${expandedTaskId === task.id ? 90 : 0}deg)`,
                            }}
                          >
                            &#9654;
                          </span>
                        </button>
                        <div>
                          <p className="font-caption font-medium text-sm text-foreground">
                            {task.title}
                          </p>
                          <p className="font-caption text-xs text-muted-foreground mt-0.5">
                            {task.project} • {task.completedSubtasks}/{task.subtasks} subtasks
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          {/* <AppImage
                            src={task.assignee.avatar}
                            alt={task.assignee.alt}
                            className="w-full h-full object-cover"
                          /> */}
                        </div>
                        <span className="font-caption text-sm text-foreground">
                          {task.assignee.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-caption font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-caption text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(task.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {isOverdue ? (
                        <span className="font-caption text-xs text-error font-bold">Overdue</span>
                      ) : (
                        <span className="font-caption text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm font-medium text-foreground">
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label="Edit task"
                        className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onEditTask) onEditTask(task.id);
                        }}
                      >
                        ✏️
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-caption text-sm text-foreground">
                        {task.department || 'N/A'}
                      </span>
                    </td>
                  </tr>
                  {expandedTaskId === task.id && (
                    <tr className="bg-muted/5">
                      <td colSpan={10} className="pl-12 py-2">
                        <div className="space-y-2">
                          {Array.isArray(task.subtaskList) && task.subtaskList.length > 0 ? (
                            task.subtaskList.map((subtask) => (
                              <div
                                key={subtask.id}
                                className="flex items-center gap-4 py-1 border-b border-border"
                              >
                                <span className="font-caption text-sm text-foreground">
                                  {subtask.title}
                                </span>
                                <span
                                  className={`font-caption text-xs px-2 py-1 rounded ${getStatusColor(subtask.status)}`}
                                >
                                  {subtask.status}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Edit subtask"
                                  className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
                                  onClick={() => {
                                    setEditingSubtask(subtask);
                                    setEditingTaskId(task.id);
                                  }}
                                >
                                  ✏️
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="font-caption text-xs text-muted-foreground">
                              No subtasks available.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {editingSubtask && (
          <SubtaskEditModal
            subtask={editingSubtask}
            onSave={(updated) => {
              if (!editingTaskId) return;
              setEditingSubtask(null);
              setEditingTaskId(null);
            }}
            onClose={() => {
              setEditingSubtask(null);
              setEditingTaskId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskListView;
