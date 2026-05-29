'use client';

import Icon from '@/components/ui/AppIcon';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName }: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[2000] transition-smooth" onClick={onClose} />
      <div className="fixed inset-0 z-[2001] flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                <Icon
                  name="ExclamationTriangleIcon"
                  size={24}
                  variant="outline"
                  className="text-error"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  Delete User
                </h3>
                <p className="font-caption text-sm text-muted-foreground mb-4">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-foreground">{userName}</span>? This action
                  cannot be undone and will remove all associated data.
                </p>
                <div className="flex items-start gap-2 p-3 bg-warning/5 border border-warning/20 rounded-md">
                  <Icon
                    name="InformationCircleIcon"
                    size={16}
                    variant="outline"
                    className="text-warning flex-shrink-0 mt-0.5"
                  />
                  <p className="font-caption text-xs text-muted-foreground">
                    All tasks assigned to this user will need to be reassigned manually.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 py-4 bg-muted/30 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-background border border-border text-foreground rounded-lg font-caption font-medium text-sm hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-error text-error-foreground rounded-lg font-caption font-medium text-sm hover:bg-error/90 transition-smooth"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
