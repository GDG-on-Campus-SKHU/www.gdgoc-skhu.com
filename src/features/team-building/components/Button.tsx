import { ButtonWrap } from '../styles/button';

interface ButtonProps {
  title?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Button({ title, disabled = false, className, onClick }: ButtonProps) {
  return (
    <div
      css={ButtonWrap}
      onClick={!disabled ? onClick : undefined}
      className={`${disabled ? 'disabled' : ''} ${className || ''}`}
    >
      <p>{title}</p>
    </div>
  );
}
