'use client';

import React from 'react';

interface SubtaskBreakdownProps {
  total: number;
  inProgress: number;
  closed: number;
}

const SubtaskBreakdown = ({ total = 0, inProgress = 0, closed = 0 }: SubtaskBreakdownProps) => {
  const todo = Math.max(0, total - inProgress - closed);

  // Calculate percentages for the bars
  const closedPct = total > 0 ? (closed / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
  const todoPct = total > 0 ? (todo / total) * 100 : 0;

  const stats = [
    { label: 'Closed', value: closed, color: 'bg-green-500', pct: closedPct },
    { label: 'In Progress', value: inProgress, color: 'bg-yellow-500', pct: inProgressPct },
    { label: 'To Do', value: todo, color: 'bg-blue-500', pct: todoPct },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-full shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-caption text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Subtask Distribution
        </h3>
        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {total} Total
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        {/* Stacked Bar Representation */}
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden flex">
          <div
            style={{ width: `${closedPct}%` }}
            className="h-full bg-green-500 transition-all duration-1000"
            title={`Closed: ${closed}`}
          />
          <div
            style={{ width: `${inProgressPct}%` }}
            className="h-full bg-yellow-500 transition-all duration-1000"
            title={`In Progress: ${inProgress}`}
          />
          <div
            style={{ width: `${todoPct}%` }}
            className="h-full bg-blue-500 transition-all duration-1000"
            title={`To Do: ${todo}`}
          />
        </div>

        {/* Detailed Horizontal Bars with Labels */}
        <div className="space-y-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex justify-between items-center text-[10px] font-medium uppercase">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="text-foreground font-bold">{stat.value}</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color} transition-all duration-1000`}
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

export default SubtaskBreakdown;
