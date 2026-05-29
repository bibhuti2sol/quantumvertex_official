'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface CareerProgressionRow {
  id: string;
  name: string;
  username: string;
  jobTitle: string;
  department: string;
  kra: string[];
  kpiScore: number;
  kpiMetric: string;
  avatar: string;
}

const DEFAULT_CAREER_DATA: CareerProgressionRow[] = [
  {
    id: '1',
    name: 'Peter Murphy',
    username: 'pmurphy',
    jobTitle: 'Dean / Academic Executive',
    department: 'Executive Administration',
    kra: ['Institutional Strategy', 'Resource Stewardship', 'Board Representation'],
    kpiScore: 95,
    kpiMetric: 'Strategic Milestones',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: '1-aux',
    name: 'Ronald Cox',
    username: 'rcox',
    jobTitle: 'Auxiliary Operations Officer',
    department: 'Auxiliary Services',
    kra: ['Facility Logistics', 'Operations Support', 'Inventory Integrity'],
    kpiScore: 89,
    kpiMetric: 'Logistical Fulfillment',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2',
    name: 'Mike Fox',
    username: 'mfox',
    jobTitle: 'Office Manager',
    department: "Dean's Office",
    kra: ['Interdepartmental Liaison', 'Scheduling Optimization', 'Operational Budgets'],
    kpiScore: 92,
    kpiMetric: 'Office SLA Target',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: '2-1',
    name: 'Kate Williams',
    username: 'kwilliams',
    jobTitle: 'Academic Director',
    department: 'Academic Affairs',
    kra: ['Curriculum Policy', 'Faculty Accreditation', 'Educational Quality'],
    kpiScore: 96,
    kpiMetric: 'Academic Audits Passed',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: '2-2',
    name: 'Holly Greene',
    username: 'hgreene',
    jobTitle: 'Relations Specialist',
    department: 'Development Office',
    kra: ['Donor Engagement', 'Community Outreach', 'Fundraising Channels'],
    kpiScore: 87,
    kpiMetric: 'Campaign Growth Rate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: '2-3',
    name: 'Silvia Lewis',
    username: 'slewis',
    jobTitle: 'Facilities Director',
    department: 'Facilities Management',
    kra: ['Campus Safety', 'Capital Projects', 'Maintenance Routines'],
    kpiScore: 91,
    kpiMetric: 'Safety Metric Score',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: '2-4',
    name: 'Lydia Chance',
    username: 'lchance',
    jobTitle: 'Financial Lead',
    department: 'Finance and Accounting',
    kra: ['Auditing Control', 'Corporate Ledger', 'Financial Forecasting'],
    kpiScore: 94,
    kpiMetric: 'Forecast Accuracy Rate',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    id: '2-5',
    name: 'Jason Patrick',
    username: 'jpatrick',
    jobTitle: 'Exhibition Architect',
    department: 'Exhibitions Division',
    kra: ['Gallery Design', 'Artist Coordination', 'Public Relations'],
    kpiScore: 88,
    kpiMetric: 'Visitor Rating Index',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
];

export default function CareerProgressionTable() {
  const [data, setData] = useState<CareerProgressionRow[]>(DEFAULT_CAREER_DATA);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  // Editing state
  const [editingRow, setEditingRow] = useState<CareerProgressionRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editKraString, setEditKraString] = useState('');
  const [editKpiScore, setEditKpiScore] = useState(90);
  const [editKpiMetric, setEditKpiMetric] = useState('');

  // Fetch real users from active DB to merge
  useEffect(() => {
    const fetchApiUsers = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.users.list()}?page=0&size=50`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: getAuthToken(),
          },
        });
        if (response.ok) {
          const result = await response.json();
          const list = result.data || result.content || result;
          if (Array.isArray(list)) {
            // Map API users to career rows
            const mapped: CareerProgressionRow[] = list.map((u: any) => ({
              id: `api-${u.id}`,
              name: `${u.firstName} ${u.lastName}`,
              username: u.username || `${u.firstName.toLowerCase()}.${u.lastName.toLowerCase()}`,
              jobTitle:
                u.jobTitle ||
                (u.roles?.[0]?.replace('ROLE_', '') === 'ADMIN'
                  ? 'System Administrator'
                  : 'Associate Specialist'),
              department: u.departmentName || 'General Operations',
              kra: ['Task Execution', 'Team Collaborations', 'SLA Alignment'],
              kpiScore: Math.floor(Math.random() * 20) + 80, // Mock initial score
              kpiMetric: 'Performance Velocity',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName)}+${encodeURIComponent(u.lastName)}&background=0055b3&color=fff`,
            }));

            // Merge avoiding duplicates by username
            setData((prev) => {
              const savedLocal = localStorage.getItem('career_progression_data');
              const baseList = savedLocal ? JSON.parse(savedLocal) : prev;
              const merged = [...baseList];
              mapped.forEach((mapUser) => {
                if (!merged.some((m) => m.username === mapUser.username)) {
                  merged.push(mapUser);
                }
              });
              return merged;
            });
          }
        }
      } catch (err) {
        console.error('Failed to merge API users into Career progression table', err);
      }
    };

    // Load from localStorage if present
    const saved = localStorage.getItem('career_progression_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    fetchApiUsers();
  }, []);

  const handleEditClick = (row: CareerProgressionRow) => {
    setEditingRow(row);
    setEditKraString(row.kra.join(', '));
    setEditKpiScore(row.kpiScore);
    setEditKpiMetric(row.kpiMetric);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    const updated = data.map((item) => {
      if (item.id === editingRow.id) {
        return {
          ...item,
          kra: editKraString
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          kpiScore: Number(editKpiScore),
          kpiMetric: editKpiMetric,
        };
      }
      return item;
    });

    setData(updated);
    localStorage.setItem('career_progression_data', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingRow(null);
  };

  // Filter and Search logic
  const filteredData = data.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.jobTitle.toLowerCase().includes(query);

    const matchesDept = deptFilter === 'All' || item.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Extract departments for filter list
  const departments = ['All', ...Array.from(new Set(data.map((d) => d.department)))];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-elevation-2 overflow-hidden hover:shadow-elevation-3 transition-smooth">
      <div className="p-6 border-b border-border bg-muted/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-foreground">
            Career Progression Target
          </h2>
          <p className="text-xs text-muted-foreground font-caption">
            Tracking personnel key responsibilities (KRAs) and achievement milestones (KPIs)
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground pointer-events-none">
              <Icon name="MagnifyingGlassIcon" size={16} />
            </span>
            <input
              type="text"
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="relative">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-8 cursor-pointer font-caption font-semibold"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground pointer-events-none">
              <Icon name="ChevronDownIcon" size={12} />
            </span>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[800px]">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-caption">
                Username / Personnel
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-caption">
                Department
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-caption">
                Key Result Areas (KRAs)
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-caption">
                Key Performance Indicators (KPIs)
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-caption">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-muted/10 transition-colors">
                  {/* User Profile Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-border/80 flex-shrink-0 bg-muted/40">
                        <img
                          src={row.avatar}
                          alt={row.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=0055b3&color=fff`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-sm text-foreground">
                          {row.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-caption">
                          @{row.username} • <span className="italic">{row.jobTitle}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Department Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                      {row.department}
                    </span>
                  </td>

                  {/* KRA Tags */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {row.kra.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-muted border border-border/50 text-[10px] rounded-lg text-foreground/80 font-caption font-medium shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* KPI Target Indicator */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 w-44">
                      <div className="flex justify-between items-center text-[10px] font-caption">
                        <span className="text-muted-foreground font-medium truncate max-w-[100px]">
                          {row.kpiMetric}
                        </span>
                        <span
                          className={`font-black ${row.kpiScore >= 90 ? 'text-success' : row.kpiScore >= 80 ? 'text-primary' : 'text-warning'}`}
                        >
                          {row.kpiScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          style={{ width: `${row.kpiScore}%` }}
                          className={`h-full rounded-full transition-all duration-700 ${row.kpiScore >= 90 ? 'bg-success' : row.kpiScore >= 80 ? 'bg-primary' : 'bg-warning'}`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Edit Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="p-1.5 hover:bg-muted text-muted-foreground hover:text-primary rounded-lg transition-smooth"
                      title="Edit Targets"
                    >
                      <Icon name="PencilSquareIcon" size={16} variant="outline" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-muted-foreground font-caption"
                >
                  No organizational personnel matches current parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit KRA/KPI Modal */}
      {isModalOpen && editingRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-elevation-5 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
                  <img
                    src={editingRow.avatar}
                    alt={editingRow.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Edit Career Path
                  </h3>
                  <p className="text-[10px] text-muted-foreground font-caption">
                    {editingRow.name} • @{editingRow.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                  Key Result Areas (KRAs)
                </label>
                <input
                  type="text"
                  required
                  value={editKraString}
                  onChange={(e) => setEditKraString(e.target.value)}
                  placeholder="e.g. Budget audits, Systems logic, Client liaison"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-[9px] text-muted-foreground font-caption mt-1 block">
                  Separate distinct responsibilities with commas.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    KPI Achievement (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editKpiScore}
                    onChange={(e) => setEditKpiScore(Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-caption font-semibold text-muted-foreground mb-1.5">
                    KPI Target Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editKpiMetric}
                    onChange={(e) => setEditKpiMetric(e.target.value)}
                    placeholder="e.g. Campaign Goals"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-caption font-semibold text-foreground hover:bg-muted transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-caption font-semibold hover:opacity-90 transition-smooth shadow-sm"
                >
                  Save Progression Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
