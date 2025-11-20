import { forwardRef, InputHTMLAttributes } from 'react';

import { radioButtonCss, radioLabelCss, radioWrapperCss } from '../styles/radio';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, disabled = false, onChange, className, ...rest }, ref) => {
    // 선택 가능하도록 추가
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      onChange?.(e.target.checked);
    };

    return (
      <label css={radioWrapperCss} className={`${disabled ? 'disabled' : ''} ${className || ''}`}>
        <input
          ref={ref}
          type="radio"
          css={radioButtonCss}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        <span css={radioLabelCss}>{label}</span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
