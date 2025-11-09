import { css } from '@emotion/react';

import { colors } from './colors';

/**
 * `color`, `background-color`,
 * `border-radius`, `box-shadow`
 * `flex center` 속성을 가지고 있음
 */
export const defaultButtonCss = css`
  position: relative;
  overflow: hidden;
  color: ${colors.gray500};
  background-color: ${colors.white};
  border-radius: 50px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 30px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const glassCardCss = css`
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0.1) 80%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 30px;
`;

export const glassButtonCss = css`
  ${defaultButtonCss};

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0.1) 100%
  );

  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);

  border: 2px solid rgba(255, 255, 255, 0.8);

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 100%;
    box-shadow: inset 0 -5px 10px rgba(0, 0, 0, 0.05);
    border-radius: inherit;
    pointer-events: none;
  }

  color: rgb(24, 24, 24);

  &:hover {
    transform: translateY(-6px);
    box-shadow:
      0 30px 60px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }
`;
