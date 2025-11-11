import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const buttonWrap = css`
  width: 100%;
  height: 2.5rem;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${colors.gdscBlue};
  color: white;
  border: none;
  font-weight: 500;
  &:hover:not(:disabled) {
    background-color: #3770cd;
  }

  &:active:not(:disabled) {
    background-color: #2d5aa6;
  }

  &:disabled {
    background-color: #ededef;
    color: #c3c6cb;
    cursor: not-allowed;
  }

  &[data-variant='secondary'] {
    background-color: white;
    color: ${colors.gdscBlue};
    border: 1px solid ${colors.gdscBlue};

    &:hover:not(:disabled) {
      background-color: #d9e7fd;
    }

    &:active:not(:disabled) {
      background-color: #9dc0f9;
    }

    &:disabled {
      background-color: #ededef;
      color: #c3c6cb;
      border: none;
    }
  }
`;
