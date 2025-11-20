import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

const baseBox = css`
  display: flex;
  width: 20rem;
  padding: 20px;
  align-items: center;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const boxOn = css`
  ${baseBox}
  border: 1px solid  ${colors.gdscBlue};
  background: #d9e7fd;
  color: #000000;
`;

export const boxOff = css`
  ${baseBox}
  border: 1px solid #C3C6CB;
  background: #ffffff;
  color: #000000;
`;
