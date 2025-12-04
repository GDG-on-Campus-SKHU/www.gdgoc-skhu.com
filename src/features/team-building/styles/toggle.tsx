import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const toggleContainerCss = css`
  width: 4.5rem;
  height: 2.25rem;
  padding: 0.125rem 1.625rem 0.125rem 0.125rem;
  border-radius: 2.4375rem;
  background-color: ${colors.grayscale[400]};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  display: flex;
  align-items: center;

  &.active {
    background-color: ${colors.gdscBlue};
    padding: 0.125rem 0.125rem 0.125rem 1.625rem;
  }
`;

export const toggleCircleCss = css`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  background-color: white;
  transition: all 0.3s ease;
  position: absolute;
  left: 0.1875rem;

  &.active {
    left: calc(100% - 2.0625rem);
  }
`;
