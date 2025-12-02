import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const redButtonWrap = css`
  width: 100%;
  height: 50px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;
  border: 1px solid ${colors.point.red};
  color: ${colors.point.red};
  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: #fbd9d7;
  }

  &:active:not(:disabled) {
    background-color: #f7bbb6;
  }

  &:disabled {
    background-color: ${colors.grayscale[300]};
    color: ${colors.grayscale[400]};
    border: none;
    cursor: not-allowed;
  }
`;
