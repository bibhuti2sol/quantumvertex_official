'use client';

import { useUser } from '@/components/common/UserContext';
import DashboardInteractive from './components/DashboardInteractive';
import React from 'react';

const Dashboard = ({
  activeTasks,
  upcomingDeadlines,
  teamMembers,
  completionRate,
  totalSubtasks,
}: any) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome back! Here's your overview for today</p>
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Tasks</p>
          <h2 className="text-2xl font-bold">{activeTasks}</h2>
          <p className="text-sm text-success">↑ 12%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
          <h2 className="text-2xl font-bold">{upcomingDeadlines}</h2>
          <p className="text-sm text-error">↓ 5%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Team Members</p>
          <h2 className="text-2xl font-bold">{teamMembers}</h2>
          <p className="text-sm text-success">↑ 8%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Completion Rate</p>
          <h2 className="text-2xl font-bold">{completionRate}%</h2>
          <p className="text-sm text-success">↑ 15%</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Subtasks</p>
          <h2 className="text-2xl font-bold">{totalSubtasks}</h2>
          <p className="text-sm text-info">Total Subtasks</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useUser();
  const userRole = user?.userRole || 'Associate';
  const userName = user?.userName || 'User';
  return <DashboardInteractive userRole={userRole} userName={userName} />;
}
