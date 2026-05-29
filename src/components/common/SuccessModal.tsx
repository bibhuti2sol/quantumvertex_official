'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  message: string;
  buttonText?: string;
}

const SuccessModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  message,
  buttonText = 'Close',
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-card w-full max-w-lg rounded-[28px] shadow-elevation-4 overflow-hidden animate-in zoom-in-95 duration-200 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6">
          {/* Icon Section */}
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Icon
                name="ExclamationTriangleIcon"
                size={28}
                variant="outline"
                className="text-warning"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-1 leading-tight">{title}</h3>
            {subtitle && (
              <p className="text-sm font-medium text-muted-foreground/70 mb-4">{subtitle}</p>
            )}
            <div className="text-lg text-muted-foreground leading-relaxed mb-8">{message}</div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-muted/30 hover:bg-muted/50 text-foreground font-bold rounded-2xl transition-all duration-200 border border-border/50"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all duration-200 active:scale-95"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
