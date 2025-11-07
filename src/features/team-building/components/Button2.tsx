import { ButtonWrap } from '../styles/button';

interface Button2Props {
  title?: string;
  disabled?: boolean;
  className?: string;
}

export default function Button({ title, disabled = false, className }: Button2Props) {
  return (
    <div
      css={ButtonWrap}
      id={'second'}
      className={`${disabled ? 'disabled' : ''} ${className || ''}`}
    >
      <p>{title}</p>
    </div>
  );
}
