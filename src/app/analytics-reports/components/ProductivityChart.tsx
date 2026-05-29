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

interface ProductivityChartProps {
  data: Array<{
    name: string;
    completed: number;
    inProgress: number;
    overdue: number;
  }>;
}

const ProductivityChart = ({ data }: ProductivityChartProps) => {
  return (
    <div className="w-full h-80" aria-label="Team Productivity Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.12)" />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(45, 55, 72, 0.12)' }}
          />
          <YAxis
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(45, 55, 72, 0.12)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} iconType="circle" />
          <Bar dataKey="completed" fill="#38A169" name="Completed" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="#4A90E2" name="In Progress" radius={[4, 4, 0, 0]} />
          <Bar dataKey="overdue" fill="#E53E3E" name="Overdue" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;
