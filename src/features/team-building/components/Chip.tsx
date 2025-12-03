import { closeIconCss, tagButtonCss } from '../styles/chip';

interface ChipProps {
  /**
   * Chip에 표시될 내용
   */
  children: React.ReactNode;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 닫기 아이콘 표시 여부
   * @default true
   */
  showCloseIcon?: boolean;
  /**
   * 닫기 버튼 클릭 시 호출되는 콜백 함수
   */
  onClose?: () => void;
}

export default function Chip({
  children,
  disabled = false,
  showCloseIcon = true,
  onClose,
}: ChipProps) {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <button css={tagButtonCss} disabled={disabled} type="button">
      {children}
      {showCloseIcon && <div css={closeIconCss} onClick={handleClose} />}
    </button>
  );
}
