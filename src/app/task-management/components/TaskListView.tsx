'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import SubtaskView from './SubtaskView';
import EditSubtask from './EditSubtask';
import EditTask from './EditTask';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { getAuthToken } from '@/utils/auth';
import { Subtask } from './types';
import TaskCommentsModal from './TaskCommentsModal';

// Use Subtask from ./types instead of local definition

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

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ id: subtask?.id || '', title, status, assignee, startDate, endDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative">
        <button
          className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">Edit Subtask</h3>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Subtask Title"
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Subtask['status'])}
            className="border border-border rounded-lg px-4 py-2 w-full"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Assignee"
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-border rounded-lg px-4 py-2 w-full"
          />
          <button
            type="button"
            className="bg-gradient-to-r from-primary to-accent text-white font-bold px-6 py-2 rounded-lg hover:scale-105 transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
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
  subtasks: number;
  completedSubtasks: number;
  subtaskList?: Subtask[];
  description: string; // Added property
  comments: string; // Added property
  timeTracked: string;
  estimatedTime: string;
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEditTask?: (taskId: string) => void;
  onTaskUpdate: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onRefresh?: () => void;
}

const TaskListView = ({
  tasks,
  onTaskClick,
  onStatusChange,
  onEditTask,
  onTaskUpdate,
  onDeleteTask,
  onRefresh,
}: TaskListViewProps) => {
  const [sortColumn, setSortColumn] = useState<keyof Task | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [viewingCommentsTask, setViewingCommentsTask] = useState<Task | null>(null);
  const [subtasksCache, setSubtasksCache] = useState<Record<string, Subtask[]>>({});

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const totalElements = tasks.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;

  const paginatedTasks = tasks.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Reset to first page when tasks array changes (e.g., due to search filters)
  useEffect(() => {
    setCurrentPage(0);
  }, [tasks]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const assigneeOptions = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'];
  const projectOptions = [
    'Website Redesign',
    'Mobile App',
    'API Integration',
    'Marketing Campaign',
  ];

  const handleSort = (column: keyof Task) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
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

  const handleEditSubtask = (subtask: Subtask, taskId: string) => {
    setEditingSubtask(subtask);
    setEditingTaskId(taskId);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setEditingSubtask(null); // Ensure subtask editing is not active
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop/Tablet Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left pl-10">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth whitespace-nowrap uppercase tracking-wider"
                >
                  Task Title
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('assignee')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Assignee
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Priority
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Status
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-slate-600 uppercase tracking-wider">
                  Overdue Task
                </span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <span className="font-caption font-semibold text-xs text-slate-600 uppercase tracking-wider">
                  Progress
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  Start Date
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => handleSort('endDate')}
                  className="flex items-center gap-2 font-caption font-semibold text-xs text-slate-600 hover:text-foreground transition-smooth uppercase tracking-wider"
                >
                  End Date
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="font-caption font-semibold text-xs text-slate-600 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedTasks.map((task) => {
              const today = new Date();
              const endDate = new Date(task.endDate);
              const isOverdue = endDate < today && task.status !== 'Completed';
              return (
                <React.Fragment key={task.id}>
                  <tr>
                    {/* TASK TITLE */}
                    <td className="px-4 py-3 pl-10">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={
                            expandedTaskId === task.id ? 'Collapse subtasks' : 'Expand subtasks'
                          }
                          className={`transition-transform duration-200 flex-shrink-0 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
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
                            className="flex-shrink-0"
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
                    {/* ASSIGNEE */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm text-foreground">
                          {task.assignee.name}
                        </span>
                      </div>
                    </td>
                    {/* PRIORITY */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-caption font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    {/* STATUS */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-caption text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    {/* OVERDUE TASK */}
                    <td className="px-4 py-3">
                      {isOverdue ? (
                        <span className="font-caption text-xs text-error font-bold">Overdue</span>
                      ) : (
                        <span className="font-caption text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    {/* PROGRESS */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="font-caption text-sm font-medium text-foreground">
                          {task.progress}%
                        </span>
                      </div>
                    </td>
                    {/* START DATE */}
                    <td className="px-4 py-3">
                      {new Date(task.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    {/* END DATE */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {new Date(task.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    {/* ACTIONS */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="text-primary hover:scale-110 transition-transform"
                          onClick={() => setViewingCommentsTask(task)}
                          title="View Comments"
                        >
                          <Icon name="ChatBubbleLeftEllipsisIcon" size={20} variant="outline" />
                        </button>
                        <button
                          type="button"
                          className="text-blue-500 hover:scale-110 transition-transform"
                          onClick={() => handleEditTask(task.id)}
                          title="Edit Task"
                        >
                          <Icon name="PencilIcon" size={20} variant="outline" />
                        </button>
                        <button
                          type="button"
                          className="text-red-500 hover:scale-110 transition-transform"
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Icon name="TrashIcon" size={20} variant="outline" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedTaskId === task.id &&
                    (task.subtaskList && task.subtaskList.length > 0 ? (
                      task.subtaskList.map((subtask) => {
                        const subtaskEndDate = subtask.endDate ? new Date(subtask.endDate) : null;
                        const isSubtaskOverdue =
                          subtaskEndDate &&
                          subtaskEndDate < today &&
                          subtask.status !== 'Completed';
                        return (
                          <tr
                            key={subtask.id}
                            className="bg-muted/15 border-b border-border/40 hover:bg-muted/20 transition-colors"
                          >
                            {/* TASK TITLE */}
                            <td className="px-4 py-3 pl-16">
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground text-sm font-semibold select-none">
                                  ↳
                                </span>
                                <div>
                                  <p className="font-caption font-medium text-sm text-foreground">
                                    {subtask.title}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/* ASSIGNEE */}
                            <td className="px-4 py-3">
                              <span className="font-caption text-sm text-foreground">
                                {subtask.assignee || 'Unassigned'}
                              </span>
                            </td>
                            {/* PRIORITY */}
                            <td className="px-4 py-3">
                              <span className="font-caption text-xs text-muted-foreground">-</span>
                            </td>
                            {/* STATUS */}
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-caption font-medium ${getStatusColor(subtask.status)}`}
                              >
                                {subtask.status}
                              </span>
                            </td>
                            {/* OVERDUE TASK */}
                            <td className="px-4 py-3">
                              {isSubtaskOverdue ? (
                                <span className="font-caption text-xs text-error font-bold">
                                  Overdue
                                </span>
                              ) : (
                                <span className="font-caption text-xs text-muted-foreground">
                                  -
                                </span>
                              )}
                            </td>
                            {/* PROGRESS */}
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="font-caption text-xs text-muted-foreground">-</span>
                            </td>
                            {/* START DATE */}
                            <td className="px-4 py-3">
                              {subtask.startDate
                                ? new Date(subtask.startDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </td>
                            {/* END DATE */}
                            <td className="px-4 py-3 hidden lg:table-cell">
                              {subtask.endDate
                                ? new Date(subtask.endDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </td>
                            {/* ACTIONS */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  className="text-blue-500 hover:scale-110 transition-transform"
                                  onClick={() => handleEditSubtask(subtask, task.id)}
                                  title="Edit Subtask"
                                >
                                  <Icon name="PencilIcon" size={20} variant="outline" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="bg-muted/10">
                        <td
                          colSpan={9}
                          className="px-4 py-3 pl-16 font-caption text-xs text-muted-foreground"
                        >
                          No subtasks available.
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-280px)]">
        {paginatedTasks.map((task) => {
          const today = new Date();
          const endDate = new Date(task.endDate);
          const isOverdue = endDate < today && task.status !== 'Completed';

          return (
            <div
              key={task.id}
              className="p-4 bg-muted/20 border border-border rounded-xl space-y-3 relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStatusColor(task.status)}`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isOverdue && (
                    <span className="text-[10px] text-error font-bold flex items-center gap-1">
                      <Icon name="ExclamationTriangleIcon" size={12} />
                      Overdue
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    className={`p-1 hover:bg-muted rounded-md transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                  >
                    <Icon
                      name="ChevronRightIcon"
                      size={16}
                      variant="outline"
                      className="text-muted-foreground"
                    />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-heading font-bold text-base text-foreground mb-1">
                  {task.title}
                </h4>
                <div
                  className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                >
                  <span className="bg-primary/5 px-2 py-0.5 rounded">{task.project}</span>
                  <span>•</span>
                  <span>
                    {task.completedSubtasks}/{task.subtasks} subtasks
                  </span>
                </div>
              </div>

              {expandedTaskId === task.id && (
                <div className="pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <SubtaskView
                    subtasks={task.subtaskList || []}
                    onEdit={(subtask) => handleEditSubtask(subtask, task.id)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">
                      {task.assignee.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-foreground font-medium">{task.assignee.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewingCommentsTask(task)}
                    className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-smooth border border-primary/20"
                    title="View Comments"
                  >
                    <Icon name="ChatBubbleLeftEllipsisIcon" size={16} variant="outline" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditTask(task.id)}
                    className="p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-smooth border border-blue-200"
                    title="Edit Task"
                  >
                    <Icon name="PencilIcon" size={16} variant="outline" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-smooth border border-red-200"
                    title="Delete Task"
                  >
                    <Icon name="TrashIcon" size={16} variant="outline" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {paginatedTasks.length === 0 && (
          <div className="text-center py-10">
            <Icon
              name="InboxIcon"
              size={48}
              className="mx-auto text-muted-foreground opacity-20 mb-3"
            />
            <p className="text-muted-foreground font-caption">No tasks found</p>
          </div>
        )}
      </div>

      {/* Footer Pagination */}
      {totalElements > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20 hidden lg:flex">
          <p className="font-caption text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">{currentPage * pageSize + 1}</span> to{' '}
            <span className="font-medium text-foreground">
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </span>{' '}
            of <span className="font-medium text-foreground">{totalElements}</span> tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-caption text-xs font-semibold transition-smooth ${
                    currentPage === i
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Pagination */}
      {totalElements > 0 && (
        <div className="lg:hidden flex flex-col items-center gap-3 p-4 border-t border-border bg-muted/20 mt-auto">
          <p className="font-caption text-xs text-muted-foreground">
            {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} of{' '}
            {totalElements}
          </p>
          <div className="flex items-center justify-center w-full gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage + 1 === totalPages}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 border border-border rounded-lg font-caption font-medium text-xs text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              Next
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}

      {editingSubtask && (
        <EditSubtask
          taskId={editingTaskId || ''}
          subtask={editingSubtask}
          onSave={(updated) => {
            setEditingSubtask(null);
            setEditingTaskId(null);
            // Trigger full refresh so the task list reloads from the server
            if (onRefresh) onRefresh();
          }}
          onClose={() => {
            setEditingSubtask(null);
            setEditingTaskId(null);
          }}
        />
      )}
      {editingTaskId && !editingSubtask && (
        <EditTask
          task={{
            ...tasks.find((task) => task.id === editingTaskId)!,
            assignee: tasks.find((task) => task.id === editingTaskId)?.assignee?.name || '',
            description: tasks.find((task) => task.id === editingTaskId)?.description || '',
            comments: tasks.find((task) => task.id === editingTaskId)?.comments || '',
          }}
          assigneeOptions={assigneeOptions}
          projectOptions={projectOptions}
          onSave={(updatedTask) => {
            onTaskUpdate(updatedTask);
            setEditingTaskId(null);
            // Trigger full refresh so the task list reloads from the server
            if (onRefresh) onRefresh();
          }}
          onClose={() => setEditingTaskId(null)}
        />
      )}
      {viewingCommentsTask && (
        <TaskCommentsModal
          taskId={viewingCommentsTask.id}
          taskTitle={viewingCommentsTask.title}
          onClose={() => setViewingCommentsTask(null)}
        />
      )}
    </div>
  );
};

export default TaskListView;
