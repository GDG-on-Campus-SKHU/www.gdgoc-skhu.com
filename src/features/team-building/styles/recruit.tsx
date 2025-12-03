import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const recruitWrap = css`
  display: inline-flex;
  padding: 6px 8px;
  align-items: center;
  gap: 5px;
  border-radius: 20px;
  background-color: #d9e7fd;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  &.disabled {
    background-color: #ededef;
    color: #979ca5;
  }
`;
export const circle = css`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${colors.gdscBlue};
  &.disabled {
    background-color: #c3c6cb;
  }
`;
