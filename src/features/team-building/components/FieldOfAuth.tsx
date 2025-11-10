/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

interface FieldOfAuthProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
}

export default function FieldOfAuth({
  label,
  placeholder = '',
  value,
  type = 'text',
  onChange,
  disabled = false,
  error = false,
  errorMessage = '',
  helperText = '',
}: FieldOfAuthProps) {
  return (
    <div css={fieldBoxCss}>
      {label && <label css={labelCss}>{label}</label>}
      <input
        type={type}
        css={inputCss(error)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {errorMessage ? (
        <p css={errorTextCss}>{errorMessage}</p>
      ) : helperText ? (
        <p css={helperTextCss}>{helperText}</p>
      ) : null}
    </div>
  );
}

const fieldBoxCss = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

const labelCss = css`
  font-weight: 700;
  font-size: 15px;
  color: ${colors.black};
`;

const inputCss = (err: boolean) => css`
  height: 52px;
  border-radius: 12px;
  border: 1.5px solid ${err ? colors.point.red : colors.grayscale[300]};
  background: #fff;
  padding: 0 16px;
  font-size: 15px;
  transition: all 0.15s ease;
  outline: none;
  &:focus {
    border-color: ${err ? colors.point.red : colors.primary[600]};
    box-shadow: 0 0 0 3px ${err ? 'rgba(234,67,53,0.1)' : 'rgba(66,133,244,0.15)'};
  }
`;

const helperTextCss = css`
  color: ${colors.grayscale[600]};
  font-size: 12px;
  margin: 4px 0 0 0;
`;

const errorTextCss = css`
  color: ${colors.point.red};
  font-size: 12px;
  margin: 4px 0 0 0;
`;
