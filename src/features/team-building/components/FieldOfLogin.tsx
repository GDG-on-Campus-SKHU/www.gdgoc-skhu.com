/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';
import { field } from '../styles/field';

interface FieldOfLoginProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}

export default function FieldOfLogin({
  placeholder,
  value,
  onChange,
  hasError,
}: FieldOfLoginProps) {
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <input
        type={placeholder.toLowerCase() === 'password' ? 'password' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        css={[
          field(hasError),
          css`
            border: 0.0625rem solid ${colors.grayscale[400]} !important;
            background-color: white !important;
            margin-bottom: 0 !important;

            &:hover:not(:disabled):not(:focus) {
              border-color: ${colors.grayscale[400]} !important;
              background-color: #f5f5f5 !important;
            }

            &:focus {
              outline: none !important;
              border-color: ${colors.grayscale[400]} !important;
              background-color: white !important;
              box-shadow: none !important;
            }

            &:disabled {
              background-color: #ededef !important;
              color: #7e8590 !important;
              cursor: not-allowed !important;
            }
          `,
        ]}
      />
    </div>
  );
}
