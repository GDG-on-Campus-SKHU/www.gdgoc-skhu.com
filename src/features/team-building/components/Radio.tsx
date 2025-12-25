import React, { forwardRef, InputHTMLAttributes } from 'react';

import { radioButtonCss, radioLabelCss, radioWrapperCss } from '../styles/radio';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, disabled = false, onChange, className, ...rest }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
    };

    return (
      <label css={radioWrapperCss} className={`${disabled ? 'disabled' : ''} ${className || ''}`}>
        <input
          ref={ref}
          type="checkbox"
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
