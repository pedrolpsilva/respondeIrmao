import React from 'react';

export interface BrutalModalProps {
  visible: boolean;
  title: string;
  message?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'primary' | 'danger';
  showCancel?: boolean;
}
