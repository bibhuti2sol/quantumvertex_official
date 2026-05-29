'use client';

import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  departmentName: string;
  managerId: number | null;
  managerName: string | null;
}

interface TreeNode {
  id: string;
  role: string;
  name: string;
  department: string;
  avatar: string;
  children: TreeNode[];
  headerBg: string;
  borderColor: string;
}

export default function OrgHierarchyTree() {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await axios.get(`${API_ENDPOINTS.users.list()}?page=0&size=500&sort=id,desc`, {
          headers: { Authorization: token },
        });

        const rawUsers: ApiUser[] = res.data?.data || res.data?.content || res.data || [];

        if (Array.isArray(rawUsers)) {
          setTotalMembers(rawUsers.length);
          const depts = new Set(rawUsers.map((u) => u.departmentName).filter(Boolean));
          setTotalDepartments(depts.size);

          const userMap = new Map<number, TreeNode>();

          // Map users to initial nodes
          rawUsers.forEach((u) => {
            userMap.set(u.id, {
              id: u.id.toString(),
              role: u.jobTitle || 'Employee',
              name: u.fullName || `${u.firstName} ${u.lastName}`,
              department: u.departmentName || 'General',
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.firstName)}+${encodeURIComponent(u.lastName)}&background=003366&color=fff`,
              children: [],
              headerBg: '',
              borderColor: '',
            });
          });

          const roots: TreeNode[] = [];

          rawUsers.forEach((u) => {
            const node = userMap.get(u.id)!;
            if (u.managerId && userMap.has(u.managerId)) {
              userMap.get(u.managerId)!.children.push(node);
            } else {
              roots.push(node);
            }
          });

          // Assign colors based on depth
          const assignColors = (nodes: TreeNode[], depth: number) => {
            nodes.forEach((node) => {
              if (depth === 0) {
                node.headerBg = 'bg-[#003366] dark:bg-[#002244]';
                node.borderColor = 'border-[#003366] dark:border-[#002244]';
              } else if (depth === 1) {
                node.headerBg = 'bg-[#0055b3] dark:bg-[#003d80]';
                node.borderColor = 'border-[#0055b3] dark:border-[#003d80]';
              } else {
                node.headerBg = 'bg-[#00a8e8] dark:bg-[#0086ba]';
                node.borderColor = 'border-[#00a8e8] dark:border-[#0086ba]';
              }
              if (node.children) assignColors(node.children, depth + 1);
            });
          };
          assignColors(roots, 0);

          setTreeData(roots);

          // Fetch profile pictures asynchronously
          rawUsers.forEach(async (u) => {
            try {
              const picResponse = await fetch(API_ENDPOINTS.users.getProfilePicture(u.id), {
                headers: { Authorization: token },
              });
              if (picResponse.ok) {
                const blob = await picResponse.blob();
                if (!blob.type.includes('application/json')) {
                  const imageUrl = URL.createObjectURL(blob);
                  setAvatars((prev) => ({ ...prev, [u.id]: imageUrl }));
                }
              }
            } catch (err) {
              console.warn(`Failed to fetch profile picture for user ${u.id}`, err);
            }
          });
        }
      } catch (err) {
        console.error('Failed to fetch org hierarchy:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderTree = (nodes: TreeNode[]) => {
    if (!nodes || nodes.length === 0) return null;

    return (
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <div
              className={`bg-card border-2 ${node.borderColor || 'border-border'} rounded-xl shadow-elevation-2 overflow-hidden w-64 inline-flex flex-col flex-shrink-0 hover:shadow-elevation-3 hover:-translate-y-0.5 transition-smooth relative group z-10 mx-auto text-left`}
            >
              <div
                className={`${node.headerBg || 'bg-primary'} px-3 py-1.5 text-center border-b border-inherit`}
              >
                <span className="font-heading font-black text-xs text-white tracking-wider block uppercase truncate">
                  {node.role}
                </span>
              </div>
              <div className="p-3 flex items-center gap-3 bg-card">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border flex-shrink-0 bg-muted">
                  <img
                    src={avatars[node.id] || node.avatar}
                    alt={node.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-caption italic font-semibold text-sm text-foreground/80 truncate">
                    {node.name}
                  </p>
                  <p className="font-caption text-[10px] text-muted-foreground uppercase tracking-wider truncate hidden">
                    {node.department}
                  </p>
                </div>
              </div>

              {node.children && node.children.length > 0 && (
                <div
                  className="w-5 h-5 bg-background border border-[#ccc] rounded-full flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted absolute left-1/2 -translate-x-1/2 -bottom-2.5 z-20 shadow-sm"
                  title="Collapse"
                >
                  <span className="text-xs leading-none font-bold mb-0.5">-</span>
                </div>
              )}
            </div>

            {node.children && node.children.length > 0 && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <style>{`
        .org-tree ul {
          padding-top: 20px; position: relative;
          display: flex; justify-content: center;
        }
        .org-tree li {
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 20px 10px 0 10px;
        }
        .org-tree li::before, .org-tree li::after {
          content: '';
          position: absolute; top: 0; right: 50%;
          border-top: 2px solid #cbd5e1;
          width: 50%; height: 20px;
        }
        .org-tree li::after {
          right: auto; left: 50%;
          border-left: 2px solid #cbd5e1;
        }
        .org-tree li:only-child::after, .org-tree li:only-child::before {
          display: none;
        }
        .org-tree li:only-child { padding-top: 0; }
        .org-tree li:first-child::before, .org-tree li:last-child::after {
          border: 0 none;
        }
        .org-tree li:last-child::before {
          border-right: 2px solid #cbd5e1;
          border-radius: 0 5px 0 0;
        }
        .org-tree li:first-child::after {
          border-radius: 5px 0 0 0;
        }
        .org-tree ul ul::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2px solid #cbd5e1;
          width: 0; height: 20px;
          transform: translateX(-50%);
        }
        .dark .org-tree li::before, .dark .org-tree li::after {
          border-top-color: #334155;
        }
        .dark .org-tree li::after {
          border-left-color: #334155;
        }
        .dark .org-tree li:last-child::before {
          border-right-color: #334155;
        }
        .dark .org-tree ul ul::before {
          border-left-color: #334155;
        }
      `}</style>

      {/* Dashboard Preview Box */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-elevation-2 hover:shadow-elevation-3 transition-smooth flex flex-col justify-between group h-full relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
          <Icon name="UserGroupIcon" size={140} variant="outline" className="text-foreground" />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="UserGroupIcon" size={22} variant="outline" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">
                Organization Hierarchy
              </h2>
              <p className="text-[10px] text-muted-foreground font-caption">
                Command and reporting structures
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6 font-caption leading-relaxed max-w-sm">
            Access the dynamic organizational tree outlining division nodes, auxiliary channels, and
            personnel reporting structures.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-background/80 border border-border px-3 py-1.5 rounded-lg text-xs font-caption font-medium">
              <span className="text-primary font-bold">{loading ? '...' : totalMembers}</span>{' '}
              Active Members
            </div>
            <div className="bg-background/80 border border-border px-3 py-1.5 rounded-lg text-xs font-caption font-medium">
              <span className="text-primary font-bold">{loading ? '...' : totalDepartments}</span>{' '}
              Departments
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          disabled={loading || treeData.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-caption font-bold text-sm shadow-md hover:shadow-lg transition-smooth transform active:scale-press disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="PresentationChartBarIcon" size={18} variant="outline" />
          )}
          {loading ? 'Building Chart...' : 'View Interactive Org Chart'}
        </button>
      </div>

      {/* Expanded Hierarchy Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[1200] flex flex-col animate-in fade-in duration-300">
          <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Icon name="PresentationChartBarIcon" size={22} variant="outline" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Interactive Org Structure
                </h3>
                <p className="text-xs text-muted-foreground font-caption">
                  Dynamic reporting visualizer based on database
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-background border border-border rounded-xl p-1 gap-1">
                <button
                  onClick={zoomOut}
                  className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
                  title="Zoom Out"
                >
                  <Icon name="MinusIcon" size={18} />
                </button>
                <button
                  onClick={resetZoom}
                  className="px-2 py-1 hover:bg-muted rounded-lg text-xs font-caption font-bold text-muted-foreground hover:text-foreground transition-smooth"
                  title="Reset Zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={zoomIn}
                  className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-smooth"
                  title="Zoom In"
                >
                  <Icon name="PlusIcon" size={18} />
                </button>
              </div>

              <div className="h-6 w-px bg-border" />

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-muted hover:bg-error/15 text-muted-foreground hover:text-error rounded-xl transition-smooth"
                title="Close Visualizer"
              >
                <Icon name="XMarkIcon" size={20} variant="outline" />
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-auto p-12 bg-[#FAFBFC] dark:bg-[#0F1419] custom-scrollbar flex justify-center items-start select-none org-tree"
          >
            <div
              style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
              className="transition-transform duration-300 ease-out min-w-max pb-16"
            >
              {treeData.length > 0 ? (
                <div className="flex justify-center">
                  {/* If there are multiple disconnected roots, render them side-by-side */}
                  <ul className={treeData.length > 1 ? 'flex gap-16' : ''}>
                    {treeData.map((rootNode) => (
                      <li
                        key={rootNode.id}
                        className={treeData.length > 1 ? '!px-0 !before:hidden !after:hidden' : ''}
                      >
                        {renderTree([rootNode])}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-muted-foreground flex flex-col items-center p-12">
                  <Icon name="ExclamationTriangleIcon" size={48} className="mb-4 opacity-50" />
                  <p className="font-heading text-lg">No hierarchy data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
