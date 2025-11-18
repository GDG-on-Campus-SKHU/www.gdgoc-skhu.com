import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import {
  boxCss,
  buttonCss,
  buttonRowCss,
  closingBoxCss,
  closingOverlayCss,
  messageCss,
  overlayCss,
  scrollBoxCss,
  subTextCss,
  titleCss,
} from '../styles/modalStyles';
import { ModalProps } from './Modal.types';
import Button from './Button';
import { createPortal } from 'react-dom';

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
  customTitleAlign = 'center',
}: ModalProps & { customTitleAlign?: 'left' | 'center' }) {
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal 설정으로 브라우저에서만 렌더되도록 하기 위함
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // 처음은 렌더 x
  if (!mounted) return null;

  const modalNode = (
    <div css={[overlayCss, closing && closingOverlayCss]} onClick={handleClose}>
      <div css={[boxCss, closing && closingBoxCss]} onClick={e => e.stopPropagation()}>
        {title && (
          <h2
            css={[
              titleCss,
              css`
                text-align: ${customTitleAlign};
              `,
            ]}
          >
            {title}
          </h2>
        )}

        {(type === 'default' || type === 'textOnly') && <p css={messageCss}>{message}</p>}

        {type === 'scroll' && (
          <div
            css={[
              scrollBoxCss,
              css`
                text-align: ${customTitleAlign};
              `,
            ]}
          >
            {message}
          </div>
        )}

        {subText && <p css={subTextCss}>{subText}</p>}

        {(type === 'default' || type === 'textOnly' || type === 'scroll') && (
          <div css={buttonCss}>
            {/* Button으로 변경 */}
            <Button
              onClick={handleClose}
              style={{
                height: '50px',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '28.8px',
              }}
            >
              {buttonText}
            </Button>
          </div>
        )}

        {(type === 'confirm' || type === 'textConfirm') && (
          <div css={buttonRowCss}>
            <Button
              onClick={handleConfirm}
              style={{
                height: '50px',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '28.8px',
              }}
            >
              {confirmText}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              style={{
                height: '50px',
                fontSize: '18px',
                fontWeight: '500',
                lineHeight: '28.8px',
              }}
            >
              {cancelText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // createPortal: Nav보다 상위 레이아웃으로 설정하여 blur 처리 해결
  return createPortal(modalNode, document.body);
}
