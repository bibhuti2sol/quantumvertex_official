'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface WorkloadData {
  name: string;
  assigned: number;
  completed: number;
  pending: number;
}

interface WorkloadChartProps {
  data: WorkloadData[];
}

const WorkloadChart = ({ data }: WorkloadChartProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg text-foreground mb-6">
        Team Workload Distribution
      </h3>
      <div className="w-full h-80" aria-label="Team Workload Distribution Bar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.12)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-foreground)',
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                color: 'var(--color-foreground)',
              }}
            />
            <Bar dataKey="assigned" fill="#4A90E2" name="Assigned" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#7ED321" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#D69E2E" name="Pending" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkloadChart;
