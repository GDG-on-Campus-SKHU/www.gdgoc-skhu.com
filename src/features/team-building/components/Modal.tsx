import { useEffect, useState } from 'react';
import {
    overlayCss,
    closingOverlayCss,
    boxCss,
    closingBoxCss,
    titleCss,
    messageCss,
    subTextCss,
    buttonCss,
    buttonRowCss,
    buttonSecondaryCss,
    scrollBoxCss,
} from '../styles/modalStyles';
import { ModalProps } from './Modal.types';

export default function Modal({
    type = 'default',
    title,
    message,
    subText,
    buttonText = '확인',
    confirmText = '예',
    cancelText = '아니오',
    onClose,
    onConfirm,
}: ModalProps) {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setClosing(true);
                setTimeout(onClose, 250);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(onClose, 250);
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        handleClose();
    };

    return (
        <div css={[overlayCss, closing && closingOverlayCss]} onClick={handleClose}>
            <div css={[boxCss, closing && closingBoxCss]} onClick={(e) => e.stopPropagation()}>
                {title && <h2 css={titleCss}>{title}</h2>}
                {(type === 'default' || type === 'textOnly') && <p css={messageCss}>{message}</p>}
                {type === 'scroll' && <div css={scrollBoxCss}>{message}</div>}
                {subText && <p css={subTextCss}>{subText}</p>}

                {(type === 'default' || type === 'textOnly' || type === 'scroll') && (
                    <button css={buttonCss} onClick={handleClose}>
                        {buttonText}
                    </button>
                )}

                {(type === 'confirm' || type === 'textConfirm') && (
                    <div css={buttonRowCss}>
                        <button css={buttonSecondaryCss} onClick={handleClose}>
                            {cancelText}
                        </button>
                        <button css={buttonCss} onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
