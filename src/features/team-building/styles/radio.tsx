import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const radioWrapperCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const radioButtonCss = css`
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: 1px solid #000;
  background-color: white;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  &:checked {
    border: 6px solid ${colors.gdscBlue};
  }

  &:disabled {
    cursor: not-allowed;
    border: 6px solid var(--grayscale-400, #c3c6cb);
    background-color: #ffffff;
  }

  &:disabled:checked {
    border: 6px solid var(--grayscale-400, #c3c6cb);
    background-color: #ffffff;
  }
`;

export const radioLabelCss = css`
  font-size: 1rem;
  font-weight: 400;
  color: #000;
  user-select: none;

  &.disabled {
    color: #b0b0b0;
  }
`;
