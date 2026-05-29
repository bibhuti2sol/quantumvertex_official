'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AddTeamPanelProps {
  onClose: () => void;
  onSave: (newTeam: {
    teamName: string;
    department: string;
    teamLead: string;
    description: string;
    status: 'Active' | 'Inactive';
  }) => void;
  departments: { id: number; name: string }[];
  users: { id: number; name: string }[];
}

const AddTeamPanel: React.FC<AddTeamPanelProps> = ({ onClose, onSave, departments, users }) => {
  const [form, setForm] = useState<{
    teamName: string;
    department: string;
    teamLead: string;
    description: string;
    status: 'Active' | 'Inactive';
  }>({
    teamName: '',
    department: '',
    teamLead: '',
    description: '',
    status: 'Active',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-[94%] max-w-3xl overflow-hidden flex flex-col my-auto animate-fade-in transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="font-heading font-bold text-lg text-foreground">Create New Team</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
            aria-label="Close panel"
          >
            <Icon name="XMarkIcon" size={20} variant="outline" className="text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Team Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={form.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Platform Engineering"
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>

              <div>
                <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Department <span className="text-error">*</span>
                </label>
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Team Lead <span className="text-error">*</span>
                </label>
                <select
                  name="teamLead"
                  value={form.teamLead}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                >
                  <option value="">Select Team Lead</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.name}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Status <span className="text-error">*</span>
                </label>
                <div className="flex gap-4">
                  {['Active', 'Inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, status: status as 'Active' | 'Inactive' }))
                      }
                      className={`flex-1 py-2.5 rounded-xl border font-caption text-sm font-medium transition-smooth ${
                        form.status === status
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-background border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-caption font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Briefly describe the team's objectives..."
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl font-caption text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-smooth"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border rounded-xl font-caption font-semibold text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-caption font-semibold text-sm hover:opacity-90 shadow-md transition-smooth"
            >
              Start Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamPanel;
