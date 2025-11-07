import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const tagButtonCss = css`
  position: relative;
  overflow: hidden;
  height: 2.125rem;
  padding: 0.5rem 0.75rem;
  background-color: ${colors.gdscBlue};
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 1rem;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

export const closeIconCss = css`
  cursor: pointer;
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0.625rem;
    height: 0.125rem;
    background-color: ${colors.gdscBlue};
    border-radius: 0.0625rem;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`;
