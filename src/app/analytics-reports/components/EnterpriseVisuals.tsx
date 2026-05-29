'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Icon from '@/components/ui/AppIcon';

// 1. Enterprise Metric Card with Sparkline
interface EnterpriseMetricCardProps {
  title: string;
  primaryValue: string | number;
  primaryLabel: string;
  secondaryValue?: string | number;
  secondaryLabel?: string;
  chartData: any[];
  chartType: 'line' | 'bar';
}

export const EnterpriseMetricCard = ({
  title,
  primaryValue,
  primaryLabel,
  secondaryValue,
  secondaryLabel,
  chartData,
  chartType,
}: EnterpriseMetricCardProps) => (
  <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-full shadow-sm">
    <h3 className="font-caption text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
      {title}
    </h3>
    <div className="flex justify-between items-end gap-4 mb-4">
      <div>
        <div className="text-3xl font-heading font-bold text-foreground">{primaryValue}</div>
        <div className="text-[10px] text-muted-foreground font-medium uppercase">
          {primaryLabel}
        </div>
      </div>
      {secondaryValue && (
        <div className="text-right">
          <div className="text-3xl font-heading font-bold text-foreground">{secondaryValue}</div>
          <div className="text-[10px] text-muted-foreground font-medium uppercase">
            {secondaryLabel}
          </div>
        </div>
      )}
    </div>
    <div className="flex-1 min-h-[60px]">
      <ResponsiveContainer width="100%" height="80%">
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
      {chartType === 'bar' && (
        <div className="text-[9px] text-muted-foreground text-center mt-1 font-medium">
          Distribution by Cycle Time
        </div>
      )}
    </div>
  </div>
);

// 2. Risk Gauge Chart
export const RiskGauge = ({ value, label }: { value: number; label: string }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-full shadow-sm">
      <h3 className="font-caption text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Resource Overload Risk Index
      </h3>
      <div className="flex flex-col items-center justify-center flex-1 py-4">
        <div className="relative w-48 h-24 overflow-hidden">
          {/* Gauge Background (Rainbow/Zones) */}
          <div
            className="absolute top-0 w-48 h-48 rounded-full border-[12px] border-t-transparent border-x-transparent border-b-transparent rotate-45"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 100%, #22c55e 0deg 60deg, #eab308 60deg 120deg, #ef4444 120deg 180deg)',
            }}
          ></div>
          {/* Mask for semi-circle */}
          <div className="absolute top-[12px] left-[12px] w-[168px] h-[168px] bg-card rounded-full z-10" />

          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 w-1 h-20 bg-foreground origin-bottom z-20 transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full z-30" />
        </div>
        <div className="mt-4 text-center">
          <p className="text-xl font-heading font-bold text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground font-medium uppercase">Severity Status</p>
        </div>
      </div>
    </div>
  );
};

// 3. Project Budget Analysis Chart (Tabular)
export const ProjectBudgetChart = ({ data }: { data: any[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Filter out the 'Total View' fallback if it's there, to just show project rows
  const displayData = data.filter((d) => d.name !== 'Total View');

  const totalPages = Math.ceil(displayData.length / pageSize);
  const paginatedData = displayData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset page if data changes significantly
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [displayData.length, totalPages, currentPage]);

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-base">Project Budget Analysis</h3>
          <p className="text-xs text-muted-foreground">Recovered vs Pending Budget</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {displayData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
            No project data available
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedData.map((project, idx) => {
              const total = project.recovered + project.pending;
              const recoveredPct = total > 0 ? (project.recovered / total) * 100 : 0;

              return (
                <div
                  key={idx}
                  className="bg-muted/10 border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground">{project.name}</span>
                    <span className="text-xs font-bold text-muted-foreground">
                      Total: {formatCurrency(total)}
                    </span>
                  </div>

                  {/* Progress Bar visual */}
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex mb-2">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${recoveredPct}%` }}
                    />
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${100 - recoveredPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground uppercase font-semibold">
                        Recovered
                      </span>
                      <span className="text-emerald-600 font-bold">
                        {formatCurrency(project.recovered)}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-muted-foreground uppercase font-semibold">Pending</span>
                      <span className="text-amber-600 font-bold">
                        {formatCurrency(project.pending)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {displayData.length > pageSize && (
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between bg-card">
          <span className="text-[10px] text-muted-foreground font-bold">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, displayData.length)} of {displayData.length} projects
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-border"
            >
              <Icon name="ChevronLeftIcon" size={14} variant="outline" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted text-muted-foreground border border-border'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-border"
            >
              <Icon name="ChevronRightIcon" size={14} variant="outline" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
