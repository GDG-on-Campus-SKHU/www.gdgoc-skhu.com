import { circle, recruitWrap } from '../styles/recruit';

interface RecruitProps {
  title?: string;
  disabled?: boolean;
  className?: string;
}

export default function Recruit({ title, disabled = false, className }: RecruitProps) {
  return (
    <div css={recruitWrap} className={`${disabled ? 'disabled' : ''} ${className || ''}`}>
      <div css={circle} className={disabled ? 'disabled' : ''} />
      <p>{title}</p>
    </div>
  );
}
