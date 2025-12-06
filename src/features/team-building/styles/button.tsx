import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const buttonWrap = css`
  width: 100%;
  height: 2.8rem;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: ${colors.gdscBlue};
  color: white;
  border: none;
  font-weight: 400;
  font-size: 16px;
  &:hover:not(:disabled) {
    background-color: #3770cd;
  }

  &:active:not(:disabled) {
    background-color: #2d5aa6;
  }

  &:disabled {
    background-color: ${colors.grayscale[300]};
    color: ${colors.grayscale[400]};
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

    // 비활성화 색상 디자인대로 수정
    &:disabled {
      background-color: ${colors.grayscale[300]};
      color: ${colors.grayscale[400]};
      border: none;
    }
  }
`;
