'use client';

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userRole: string;
  profileImage?: string;
  profileImageAlt: string;
  onImageUpload: (file: File) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const ProfileHeader = ({
  userName,
  userEmail,
  userRole,
  profileImage = '',
  profileImageAlt,
  onImageUpload,
  onSave,
  isSaving = false,
}: ProfileHeaderProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isHydrated) return;
    const file = e.target.files?.[0];
    console.log('ProfileHeader: handleFileChange - File selected:', file?.name);
    if (file) {
      onImageUpload(file);
    }
  };

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
          <div className="flex-1">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mb-1" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6 shadow-elevation-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
            <AppImage
              src={profileImage}
              alt={profileImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          {/* File input always in DOM so onChange fires even after hover ends */}
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {isHovering && (
            <label
              htmlFor="profile-upload"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full cursor-pointer transition-smooth"
            >
              <Icon name="CameraIcon" size={32} variant="outline" className="text-white" />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{userName}</h1>
          <p className="text-sm font-caption text-muted-foreground mb-1">{userEmail}</p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary bg-opacity-10 rounded-full">
            <Icon name="ShieldCheckIcon" size={16} variant="solid" className="text-primary" />
            <span className="text-sm font-caption font-medium text-primary">{userRole}</span>
          </div>
        </div>

        <div className="flex flex-row sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              console.log('ProfileHeader: Save Changes clicked');
              if (onSave) onSave();
            }}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving && (
              <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            )}
            Save
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-muted text-foreground rounded-md font-caption font-medium text-sm hover:bg-opacity-80 transition-smooth">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
