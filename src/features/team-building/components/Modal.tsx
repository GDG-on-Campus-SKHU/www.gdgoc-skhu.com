import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import {
  boxCss,
  buttonCss,
  buttonRowCss,
  buttonSecondaryCss,
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
          <Button type="button" title={buttonText} onClick={handleClose} css={buttonCss} />
        )}

        {(type === 'confirm' || type === 'textConfirm') && (
          <div css={buttonRowCss}>
            <Button
              type="button"
              title={cancelText}
              onClick={handleClose}
              css={buttonSecondaryCss}
            />
            <Button
              type="button"
              title={confirmText}
              onClick={handleConfirm}
              css={buttonCss}
            />
          </div>
        )}
      </div>
    </div>
  );
}
