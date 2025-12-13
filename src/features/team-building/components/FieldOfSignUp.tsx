import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

interface FieldOfSignUpProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  hideHelperOnValue?: boolean;
}

export default function FieldOfSignUp({
  label,
  placeholder = '',
  value,
  type = 'text',
  onChange,
  disabled = false,
  error = false,
  errorMessage = '',
  hideHelperOnValue = false,
}: FieldOfSignUpProps) {
  const hasValue = Boolean(value && value.trim().length > 0);

  const showHelper = !error && errorMessage && !(hideHelperOnValue && hasValue);

  const errorText = error && errorMessage ? errorMessage : null;

  return (
    <div css={fieldBoxCss}>
      <label css={labelCss}>{label}</label>
      <input
        type={type}
        css={inputCss(error)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {errorText && <p css={errorTextCss}>{errorText}</p>}
      {showHelper && <p css={helperTextCss}>{errorMessage}</p>}
    </div>
  );
}

const fieldBoxCss = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
`;

const labelCss = css`
  font-weight: 700;
  font-size: 15px;
  color: #111;
`;

const inputCss = (err: boolean) => css`
  height: 52px;
  border-radius: 12px;
  border: 1.5px solid ${err ? '#EA4335' : '#E5E7EB'};
  background: #fff;
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.15s ease;
  outline: none;
  &:focus {
    border-color: ${err ? '#EA4335' : colors.gdscBlue};
  }
`;

const helperTextCss = css`
  color: ${colors.grayscale[600]};
  font-size: 13px;
  margin: 2px 0 0 0;
`;

const errorTextCss = css`
  color: #ea4335;
  font-size: 13px;
  margin: 2px 0 0 0;
`;
