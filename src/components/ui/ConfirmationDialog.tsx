import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  const getIconColor = () => {
    if (variant === 'danger') return 'text-danger bg-danger/10';
    if (variant === 'warning') return 'text-warning bg-warning/10';
    return 'text-primary bg-primary/10';
  };

  const getButtonVariant = () => {
    if (variant === 'danger') return 'danger';
    if (variant === 'warning') return 'warning';
    return 'primary';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`p-3.5 rounded-full ${getIconColor()} flex items-center justify-center`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mt-1">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full mt-5">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={getButtonVariant() as any}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
