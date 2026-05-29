'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ActionRestrictedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  message?: string;
  buttonText?: string;
}

const ActionRestrictedModal = ({
  isOpen,
  onClose,
  title = 'Action Restricted',
  subtitle = 'Warning',
  message = 'This action cannot be performed.',
  buttonText = 'Close',
}: ActionRestrictedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-elevation-3 w-full max-w-md overflow-hidden animate-scale-up">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <Icon name="ExclamationTriangleIcon" size={24} variant="outline" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
          </div>

          <p className="font-caption text-sm text-muted-foreground leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex justify-end gap-3 flex-col sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 font-caption text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-smooth"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionRestrictedModal;
