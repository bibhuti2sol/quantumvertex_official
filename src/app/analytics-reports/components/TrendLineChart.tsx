'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendLineChartProps {
  data: Array<{
    date: string;
    velocity: number;
    efficiency: number;
  }>;
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  return (
    <div className="w-full h-80" aria-label="Project Velocity Trend Line Chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 55, 72, 0.12)" />
          <XAxis
            dataKey="date"
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
          <Line
            type="monotone"
            dataKey="velocity"
            stroke="#4A90E2"
            strokeWidth={2}
            name="Velocity"
            dot={{ fill: '#4A90E2', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="#7ED321"
            strokeWidth={2}
            name="Efficiency"
            dot={{ fill: '#7ED321', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;
