'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

import { boxOff, boxOn } from '../styles/radioBox';

interface RadioBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /**
   * 라디오 박스에 표시될 텍스트
   */
  text: string;
  /**
   * 선택 상태 (controlled)
   */
  isSelected?: boolean;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 선택 상태 변경 시 호출되는 콜백
   */
  onChange?: (selected: boolean) => void;
}

const RadioBox = forwardRef<HTMLInputElement, RadioBoxProps>(
  ({ text, isSelected = true, disabled = false, onChange, className, ...rest }, ref) => {
    const handleClick = () => {
      if (disabled) return;
      onChange?.(!isSelected);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange?.(!isSelected);
      }
    };

    return (
      <label css={isSelected ? boxOn : boxOff} className={className}>
        <input
          ref={ref}
          type="radio"
          checked={isSelected}
          disabled={disabled}
          onChange={e => onChange?.(e.target.checked)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          {...rest}
        />
        <div
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="radio"
          aria-checked={isSelected}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {text}
        </div>
      </label>
    );
  }
);

RadioBox.displayName = 'RadioBox';

export default RadioBox;
