export type ModalType = 'default' | 'textOnly' | 'confirm' | 'textConfirm';

export interface ModalProps {
    type?: ModalType;
    title?: string;
    message: string;
    subText?: string;
    buttonText?: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm?: () => void;
}
