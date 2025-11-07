import { ButtonWrap } from '../styles/button';

interface ButtonProps {
  title?: string;
  disabled?: boolean;
  className?: string;
}

export default function Button({ title, disabled = false, className }: ButtonProps) {
  return (
    <div css={ButtonWrap} className={`${disabled ? 'disabled' : ''} ${className || ''}`}>
      <p>{title}</p>
    </div>
  );
}
