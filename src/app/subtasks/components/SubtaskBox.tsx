'use client';

import React, { useEffect } from 'react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskBoxProps {
  subtasks: Subtask[] | any; // Allow for flexibility in the type of subtasks
}

const SubtaskBox: React.FC<SubtaskBoxProps> = ({ subtasks }) => {
  // Debugging: Log the subtasks prop to inspect its structure
  useEffect(() => {
    console.log('Subtasks prop:', subtasks);
  }, [subtasks]);

  // Ensure subtasks is an array and handle cases where it's not
  const parsedSubtasks: Subtask[] = Array.isArray(subtasks) ? subtasks : [];
  const totalSubtasks = parsedSubtasks.length;

  const closedSubtasks = parsedSubtasks.filter((s) => s.completed).length;
  const inProgressSubtasks = totalSubtasks - closedSubtasks;

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg font-medium">Subtasks</span>
        </div>
        <span className="text-sm text-gray-500">{totalSubtasks} total</span>
      </div>
      {totalSubtasks > 0 ? (
        <ul className="mt-3 space-y-2">
          <li className="flex items-center justify-between py-1.5 px-2 rounded-md bg-blue-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-gray-700">Total Subtasks</span>
            </div>
            <span className="text-sm font-semibold text-blue-600">{totalSubtasks}</span>
          </li>
          <li className="flex items-center justify-between py-1.5 px-2 rounded-md bg-amber-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-gray-700">In Progress</span>
            </div>
            <span className="text-sm font-semibold text-amber-600">{inProgressSubtasks}</span>
          </li>
          <li className="flex items-center justify-between py-1.5 px-2 rounded-md bg-green-50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-700">Closed</span>
            </div>
            <span className="text-sm font-semibold text-green-600">{closedSubtasks}</span>
          </li>
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-2">No subtasks available</p>
      )}
    </div>
  );
};

export default SubtaskBox;
