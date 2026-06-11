import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  isDanger = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={isDanger ? 'error' : 'default'}
      confirmText={confirmText}
      onConfirm={onConfirm}
    >
      <div className="space-y-2">
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
