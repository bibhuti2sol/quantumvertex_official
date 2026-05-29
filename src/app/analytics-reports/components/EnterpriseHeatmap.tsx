'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface UserUtilization {
  name: string;
  weeks: number[]; // Percentages
}

interface EnterpriseHeatmapProps {
  data: UserUtilization[];
}

const EnterpriseHeatmap = ({ data }: EnterpriseHeatmapProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Colors based on utilization levels
  const getLevelColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 75) return 'bg-orange-500';
    if (value >= 40) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getStatusLabel = (value: number) => {
    if (value >= 90)
      return { label: 'Overloaded', class: 'text-red-500 bg-red-500/10 border-red-500/20' };
    if (value >= 75)
      return { label: 'High Load', class: 'text-orange-500 bg-orange-500/10 border-orange-500/20' };
    if (value >= 40)
      return { label: 'Optimal', class: 'text-green-500 bg-green-500/10 border-green-500/20' };
    return { label: 'Available', class: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data.length, totalPages, currentPage]);

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full shadow-elevation-1 flex flex-col group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="UsersIcon" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">
              Resource Efficiency & Utilization
            </h3>
            <p className="text-xs text-muted-foreground">
              Cumulative performance & workload intensity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-border/50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-nowrap">
            Tabular View
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Resource Name
              </th>
              <th className="pb-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                Avg. Load
              </th>
              <th className="pb-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider w-[240px]">
                Utilization Bar
              </th>
              <th className="pb-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedData.length > 0 ? (
              paginatedData.map((user, idx) => {
                const averageUtilization = Math.round(
                  user.weeks.reduce((a, b) => a + b, 0) / user.weeks.length
                );
                const status = getStatusLabel(averageUtilization);

                return (
                  <tr key={idx} className="hover:bg-muted/5 transition-colors group/row">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 text-primary font-bold text-[10px] flex-shrink-0">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-sm font-semibold text-foreground group-hover/row:text-primary transition-colors">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="text-sm font-black text-foreground">
                        {averageUtilization}%
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-[1.5px] border border-border/30 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getLevelColor(averageUtilization)}`}
                          style={{ width: `${averageUtilization}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border tracking-tight ${status.class}`}
                      >
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="UsersIcon" size={32} className="text-muted-foreground opacity-20" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    No resource data available
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > pageSize && (
        <div className="mt-4 py-3 border-t border-border flex items-center justify-between bg-card">
          <span className="text-[10px] text-muted-foreground font-bold">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, data.length)} of {data.length} resources
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

      <div className="mt-4 flex justify-center items-center gap-6 border-t border-border pt-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-sm shadow-blue-500/50" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            Available
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500 shadow-sm shadow-green-500/50" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            Optimal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-orange-500 shadow-sm shadow-orange-500/50" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            High Load
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm shadow-red-500/50" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
            Critical
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseHeatmap;
