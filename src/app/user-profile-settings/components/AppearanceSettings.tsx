'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AppearanceSettingsProps {
  currentTheme: 'light' | 'dark';
  currentDensity: 'comfortable' | 'compact' | 'spacious';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onDensityChange: (density: 'comfortable' | 'compact' | 'spacious') => void;
}

const AppearanceSettings = ({
  currentTheme,
  currentDensity,
  onThemeChange,
  onDensityChange,
}: AppearanceSettingsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h2 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
        <Icon name="PaintBrushIcon" size={24} variant="outline" className="text-primary" />
        Appearance
      </h2>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="font-caption font-semibold text-sm text-foreground mb-3">Theme</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onThemeChange('light')}
              className={`p-4 rounded-md border-2 transition-smooth ${
                currentTheme === 'light'
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-input bg-background hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon name="SunIcon" size={20} variant="outline" className="text-warning" />
                <span className="font-caption font-medium text-sm text-foreground">Light</span>
              </div>
              <div className="h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded border border-gray-200" />
            </button>

            <button
              onClick={() => onThemeChange('dark')}
              className={`p-4 rounded-md border-2 transition-smooth ${
                currentTheme === 'dark'
                  ? 'border-primary bg-primary bg-opacity-10'
                  : 'border-input bg-background hover:border-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon name="MoonIcon" size={20} variant="outline" className="text-primary" />
                <span className="font-caption font-medium text-sm text-foreground">Dark</span>
              </div>
              <div className="h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded border border-gray-700" />
            </button>
          </div>
        </div>

        {/* UI Density */}
        <div>
          <h3 className="font-caption font-semibold text-sm text-foreground mb-3">UI Density</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['compact', 'comfortable', 'spacious'] as const).map((density) => (
              <button
                key={density}
                onClick={() => onDensityChange(density)}
                className={`p-4 rounded-md border-2 transition-smooth ${
                  currentDensity === density
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-input bg-background hover:border-muted-foreground'
                }`}
              >
                <p className="font-caption font-medium text-sm text-foreground capitalize mb-2">
                  {density}
                </p>
                <div className="space-y-1">
                  <div
                    className={`bg-muted rounded ${
                      density === 'compact' ? 'h-2' : density === 'comfortable' ? 'h-3' : 'h-4'
                    }`}
                  />
                  <div
                    className={`bg-muted rounded ${
                      density === 'compact' ? 'h-2' : density === 'comfortable' ? 'h-3' : 'h-4'
                    }`}
                  />
                  <div
                    className={`bg-muted rounded ${
                      density === 'compact' ? 'h-2' : density === 'comfortable' ? 'h-3' : 'h-4'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
