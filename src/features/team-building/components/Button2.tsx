import { ButtonWrap } from '../styles/button';

interface Button2Props {
  title?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button2({ title, disabled = false, className, onClick }: Button2Props) {
  return (
    <div
      css={ButtonWrap}
      id="second"
      onClick={!disabled ? onClick : undefined}
      className={`${disabled ? 'disabled' : ''} ${className || ''}`}
    >
      <p>{title}</p>
    </div>
  );
}
