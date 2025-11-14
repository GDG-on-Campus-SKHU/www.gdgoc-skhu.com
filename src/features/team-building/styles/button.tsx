import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const ButtonWrap = css`
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 40px;
  border-radius: 8px;
  background-color: ${colors.gdscBlue};
  color: white;
  &:hover {
    background-color: #3770cd;
  }
  &:active {
    background-color: #2d5aa6;
  }
  &.disabled {
    background-color: #ededef;
    color: #c3c6cb;
  }
  &#second {
    background-color: white;
    color: ${colors.gdscBlue};
    border: 1px solid ${colors.gdscBlue};
    &:hover {
      background-color: #d9e7fd;
    }
    &:active {
      background-color: #9dc0f9;
    }
    &.disabled {
      background-color: #ededef;
      color: #c3c6cb;
      border: 0;
    }
  }
`;
