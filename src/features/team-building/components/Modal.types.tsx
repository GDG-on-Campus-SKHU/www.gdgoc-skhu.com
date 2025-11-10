export type ModalType = 'default' | 'textOnly' | 'confirm' | 'textConfirm' | 'scroll';

export interface ModalProps {
    type?: ModalType;
    title?: string;
    message: string | React.ReactNode;
    subText?: string;
    buttonText?: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm?: () => void;
    customTitleAlign?: 'left' | 'center';
}
