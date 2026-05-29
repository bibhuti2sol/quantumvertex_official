'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartData {
  day: string;
  completed: number;
  inProgress: number;
  todo: number;
}

interface ProductivityChartProps {
  data: ChartData[];
}

const ProductivityChart = ({ data }: ProductivityChartProps) => {
  return (
    <div className="w-full h-80" aria-label="Weekly Productivity Bar Chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.12)" />
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <YAxis
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <Bar dataKey="completed" fill="#7ED321" name="Completed" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inProgress" fill="#4A90E2" name="In Progress" radius={[4, 4, 0, 0]} />
          <Bar dataKey="todo" fill="#FBBF24" name="To Do" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;
