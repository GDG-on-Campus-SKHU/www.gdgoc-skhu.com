import { ButtonHTMLAttributes, forwardRef } from 'react';

import { circle, recruitWrap } from '../styles/recruit';

interface RecruitProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 제목
   */
  title: string;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
}

const Recruit = forwardRef<HTMLButtonElement, RecruitProps>(
  ({ title, disabled = false, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        css={recruitWrap}
        className={`${disabled ? 'disabled' : ''} ${className || ''}`}
        disabled={disabled}
        {...rest}
      >
        <div css={circle} className={disabled ? 'disabled' : ''} />
        <p>{title}</p>
      </button>
    );
  }
);

Recruit.displayName = 'Recruit';

export default Recruit;
