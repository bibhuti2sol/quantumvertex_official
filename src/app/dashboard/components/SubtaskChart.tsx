'use client';

import React from 'react';

interface SubtaskChartProps {
  total: number;
  inProgress: number;
  closed: number;
}

const SubtaskChart: React.FC<SubtaskChartProps> = ({ total = 0, inProgress = 0, closed = 0 }) => {
  const todo = Math.max(0, total - inProgress - closed);

  // Calculate percentages
  const closedPct = total > 0 ? (closed / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
  const todoPct = total > 0 ? (todo / total) * 100 : 0;

  const stats = [
    { label: 'Closed', value: closed, color: 'bg-green-500', pct: closedPct },
    { label: 'In Progress', value: inProgress, color: 'bg-yellow-500', pct: inProgressPct },
    { label: 'To Do', value: todo, color: 'bg-blue-500', pct: todoPct },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-muted-foreground font-caption text-sm font-medium uppercase tracking-wider">
          Subtask Progress
        </h3>
        <p className="text-foreground font-heading font-bold text-xl">{total}</p>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        {/* Simple Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
          <div
            style={{ width: `${closedPct}%` }}
            className="h-full bg-green-500 transition-all duration-700"
          />
          <div
            style={{ width: `${inProgressPct}%` }}
            className="h-full bg-yellow-500 transition-all duration-700"
          />
          <div
            style={{ width: `${todoPct}%` }}
            className="h-full bg-blue-500 transition-all duration-700"
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="text-foreground">{stat.value}</span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color} transition-all duration-700`}
                  style={{ width: `${stat.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubtaskChart;
