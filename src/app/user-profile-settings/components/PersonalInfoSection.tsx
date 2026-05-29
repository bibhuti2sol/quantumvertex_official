'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  departmentId?: number;
  jobTitle: string;
  location: string;
  timezone: string;
  profileImage?: string;
  reportingManager?: string;
  organization?: string;
  employeeId?: string;
  doj?: string;
}

interface PersonalInfoSectionProps {
  initialData: PersonalInfo;
  onSave: (data: PersonalInfo) => void | Promise<void>;
  onDataChange?: (data: PersonalInfo) => void;
  isSavingExternal?: boolean;
}

const PersonalInfoSection = ({
  initialData,
  onSave,
  onDataChange,
  isSavingExternal = false,
}: PersonalInfoSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loading = isSaving || isSavingExternal;

  useEffect(() => {
    setIsHydrated(true);
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    if (!isHydrated) return;
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  const handleSave = () => {
    if (!isHydrated) return;
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!isHydrated) return;
    setFormData(initialData);
    setIsEditing(false);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth"
          >
            <Icon name="PencilIcon" size={16} variant="outline" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={true}
            readOnly={true}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Department
          </label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleChange('timezone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Reporting Manager
          </label>
          <input
            type="text"
            value={formData.reportingManager || ''}
            onChange={(e) => handleChange('reportingManager', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Organization
          </label>
          <input
            type="text"
            value={formData.organization || ''}
            onChange={(e) => handleChange('organization', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Employee ID
          </label>
          <input
            type="text"
            value={formData.employeeId || ''}
            onChange={(e) => handleChange('employeeId', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-caption font-medium text-foreground mb-2">
            Date of Joining (DOJ)
          </label>
          <input
            type="date"
            value={formData.doj || ''}
            onChange={(e) => handleChange('doj', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-background border border-input rounded-md text-foreground font-caption text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;
