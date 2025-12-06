import { css } from '@emotion/react';

import { colors } from '../../../styles/constants/colors';

export const wrap = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const fieldWrap = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.5rem;
`;

export const selectBoxContainer = css`
  width: 13rem;
  flex-shrink: 0;
`;

export const fieldContainer = css`
  flex: 1;
`;

export const addButtonContainer = css`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

export const addButton = css`
  width: 100%;
  height: 3rem;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.0625rem solid ${colors.gdscBlue};
  border-radius: 0.5rem;
  background-color: white;
  color: ${colors.gdscBlue};
  cursor: pointer;
`;
