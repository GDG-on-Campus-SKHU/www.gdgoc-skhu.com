import { ReactNode } from 'react';

export type ModalType =
  | 'default'
  | 'textOnly'
  | 'confirm'
  | 'textConfirm'
  | 'scroll'
  | 'titleConfirm'
  | 'smallConfirm'
  | 'terms';

export interface ModalProps {
  type?: ModalType;
  title?: string;
  titleNode?: ReactNode;
  message: string | React.ReactNode;
  subText?: string;
  buttonText?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  customTitleAlign?: 'left' | 'center';
}
