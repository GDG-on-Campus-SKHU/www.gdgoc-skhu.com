'use client';

import { closeIconCss, tagButtonCss } from '../styles/chip';

interface ChipProps {
  children?: React.ReactNode;
  disabled?: boolean;
  showCloseIcon?: boolean;
  onClose?: () => void;
}

export default function Chip({
  children = 'JAVA',
  disabled = false,
  showCloseIcon = true,
  onClose,
}: ChipProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <button css={tagButtonCss} disabled={disabled}>
      {children}
      {showCloseIcon && <div css={closeIconCss} onClick={handleClose} />}
    </button>
  );
}
