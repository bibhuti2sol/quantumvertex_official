import React from 'react';
import SubtaskBox from './components/SubtaskBox';

const SubtasksPage: React.FC = () => {
  // Example subtasks data
  const subtasks = [
    { id: '1', title: 'Subtask 1', completed: false },
    { id: '2', title: 'Subtask 2', completed: true },
    { id: '3', title: 'Subtask 3', completed: false },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Subtasks</h1>
      <SubtaskBox subtasks={subtasks} />
    </div>
  );
};

export default SubtasksPage;
