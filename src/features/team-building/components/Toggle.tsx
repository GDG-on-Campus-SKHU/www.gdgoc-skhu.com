import { forwardRef, InputHTMLAttributes, useState } from 'react';

import { toggleCircleCss, toggleContainerCss } from '../styles/toggle';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * 초기 체크 상태 (uncontrolled)
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * 체크 상태 (controlled)
   */
  checked?: boolean;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 상태 변경 시 호출되는 콜백
   */
  onChange?: (checked: boolean) => void;
  /**
   * 레이블 텍스트
   */
  label?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      defaultChecked = false,
      checked: controlledChecked,
      disabled = false,
      onChange,
      label,
      className,
      ...rest
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const isControlled = controlledChecked !== undefined;
    const isChecked = isControlled ? controlledChecked : internalChecked;

    const handleToggle = () => {
      if (disabled) return;

      const newValue = !isChecked;

      if (!isControlled) {
        setInternalChecked(newValue);
      }

      onChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    };

    const toggleElement = (
      <>
        <input
          ref={ref}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={e => {
            if (!isControlled) {
              setInternalChecked(e.target.checked);
            }
            onChange?.(e.target.checked);
          }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          {...rest}
        />
        <div
          css={toggleContainerCss}
          className={`${isChecked ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
          onClick={handleToggle}
          role="switch"
          aria-checked={isChecked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          <div css={toggleCircleCss} className={isChecked ? 'active' : ''} />
        </div>
      </>
    );

    if (label) {
      return (
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {toggleElement}
          <span style={{ userSelect: 'none', opacity: disabled ? 0.5 : 1 }}>{label}</span>
        </label>
      );
    }

    return toggleElement;
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
