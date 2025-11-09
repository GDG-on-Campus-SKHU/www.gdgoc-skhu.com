import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const wrap = css`
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
`;

export const icon = css`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 5px solid ${colors.gdscBlue};
  flex-shrink: 0;
  margin-top: 1%;
`;

export const textWrap = css`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const subject = css`
  font-size: 1.1rem;
  font-weight: '700';
  color: #040405;
  margin: 0;
  line-height: 1;
`;

export const period = css`
  font-size: 1rem;
  color: ${colors.gdscBlue};
  margin: 0;
  line-height: 1;
`;
