import { ButtonHTMLAttributes, forwardRef } from 'react';

import { buttonWrap } from '../styles/button';

interface ButtonBasicProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 버튼에 표시될 텍스트
   */
  title?: string;
  /**
   * 버튼의 시각적 변형
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary';
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 버튼 타입
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

const Button = forwardRef<HTMLButtonElement, ButtonBasicProps>(
  (
    { title, children, disabled = false, className, variant = 'primary', type = 'button', ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        css={buttonWrap}
        className={className}
        data-variant={variant}
        {...rest}
      >
        {children || title}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
