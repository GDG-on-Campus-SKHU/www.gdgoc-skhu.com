import { forwardRef, InputHTMLAttributes } from 'react';

import { radioButtonCss, radioLabelCss, radioWrapperCss } from '../styles/radio';

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, disabled = false, onChange, className, ...rest }, ref) => {
    return (
      <label css={radioWrapperCss} className={`${disabled ? 'disabled' : ''} ${className || ''}`}>
        <input ref={ref} type="checkbox" css={radioButtonCss} disabled={disabled} {...rest} />
        <span css={radioLabelCss}>{label}</span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export default Radio;
