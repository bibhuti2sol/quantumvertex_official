'use client';

import { useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  alt: string;
  activeTasks: number;
  workloadPercentage: number;
}

interface TeamWorkloadOverviewProps {
  teamMembers: TeamMember[];
}

const PAGE_SIZE = 5;

const TeamWorkloadOverview = ({ teamMembers }: TeamWorkloadOverviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(teamMembers.length / PAGE_SIZE));

  const paginatedMembers = teamMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getWorkloadColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-4">
      {paginatedMembers.map((member) => (
        <div
          key={member.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
        >
          <div className="flex items-center gap-4 mb-3">
            {/* Avatar removed as requested */}
            <div className="flex-1 min-w-0">
              <h4 className="font-heading font-semibold text-base text-foreground truncate">
                {member.name}
              </h4>
              <p className="text-sm text-muted-foreground font-caption">{member.role}</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-bold text-lg text-foreground">{member.activeTasks}</p>
              <p className="text-xs text-muted-foreground font-caption">Active Tasks</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-caption text-muted-foreground">Workload</span>
              <span className="font-caption font-medium text-foreground">
                {member.workloadPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-smooth ${getWorkloadColor(member.workloadPercentage)}`}
                style={{ width: `${member.workloadPercentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          <span className="font-caption text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} &middot; {teamMembers.length} members
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md text-xs font-caption font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-smooth"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-md text-xs font-caption font-medium border transition-smooth ${
                  page === currentPage
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md text-xs font-caption font-medium border border-border bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-smooth"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkloadOverview;
