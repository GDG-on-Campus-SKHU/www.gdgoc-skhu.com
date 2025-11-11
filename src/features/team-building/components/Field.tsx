import { forwardRef, InputHTMLAttributes } from 'react';

import { errorText, field } from '../styles/field';

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * 입력 필드 placeholder
   */
  placeholder?: string;
  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean;
  /**
   * 에러 상태 여부
   * @default false
   */
  error?: boolean;
  /**
   * 에러 메시지
   */
  errorMessage?: string;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ placeholder, disabled = false, error = false, errorMessage, ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          css={field(error)}
          placeholder={placeholder}
          disabled={disabled}
          type="text"
          {...rest}
        />
        {error && errorMessage && <div css={errorText}>{errorMessage}</div>}
      </div>
    );
  }
);

Field.displayName = 'Field';

export default Field;
