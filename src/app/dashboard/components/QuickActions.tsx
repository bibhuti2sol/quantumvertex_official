'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: number;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');

  const handleCreateTask = () => {
    setCreateTaskModalOpen(true);
  };

  const handleDownloadReport = () => {
    const reportData = JSON.stringify(
      {
        filter: 'Applied Filters',
        data: 'Sample Report Data',
      },
      null,
      2
    );

    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const updatedActions = actions.map((action) => {
    if (action.label === 'Create Task') {
      return { ...action, onClick: handleCreateTask };
    } else if (action.label === 'View Reports') {
      return { ...action, onClick: handleDownloadReport };
    }
    return action;
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Task Created:', { taskTitle, taskAssignee, taskPriority });
    setCreateTaskModalOpen(false);
    setTaskTitle('');
    setTaskAssignee('');
    setTaskPriority('Medium');
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {updatedActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center gap-3"
          >
            <span className="font-caption font-medium text-sm text-foreground text-center">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      {isCreateTaskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-card p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Create Task</h2>
            <form onSubmit={handleTaskSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground">Assignee</label>
                <input
                  type="text"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                  placeholder="Enter assignee name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="mt-1 block w-full border border-border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => setCreateTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
