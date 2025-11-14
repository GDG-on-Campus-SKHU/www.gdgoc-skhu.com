import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const field = (hasError?: boolean) => css`
  width: 100%;
  height: 3rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 0.0625rem solid ${hasError ? '#EA4335' : '#e0e0e0'};
  border-radius: 0.5rem;
  cursor: text;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-size: 1rem;
  color: #000;
  margin-bottom: ${hasError ? '0.25rem' : '0'};
  &::placeholder {
    color: #9e9e9e;
  }

  &:hover:not(:disabled):not(:focus) {
    border-color: ${hasError ? '#EA4335' : '#bdbdbd'};
    background-color: ${hasError ? 'white' : '#f5f5f5'};
  }

  &:focus {
    outline: none;
    border-color: ${hasError ? '#EA4335' : colors.gdscBlue};
    background-color: white;
  }

  &:disabled {
    background-color: #ededef;
    color: #7e8590;
    cursor: not-allowed;
  }
`;

export const errorText = css`
  color: #ea4335;
  font-size: 0.875rem;
`;
