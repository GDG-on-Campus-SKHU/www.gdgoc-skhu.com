import { ButtonHTMLAttributes, forwardRef } from 'react';

import { redButtonWrap } from '../styles/buttonRed';

export type RedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  disabled?: boolean;
};

const ButtonRed = forwardRef<HTMLButtonElement, RedButtonProps>(
  ({ title, disabled = false, children, type = 'button', ...rest }, ref) => {
    return (
      <button ref={ref} type={type} disabled={disabled} css={redButtonWrap} {...rest}>
        {children || title}
      </button>
    );
  }
);

ButtonRed.displayName = 'RedButton';

export default ButtonRed;

// * 기존 Button처럼 style props로 가능
