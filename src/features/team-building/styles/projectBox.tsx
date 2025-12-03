import { css } from '@emotion/react';

export const wrap = css`
  margin-top: 500px;
  display: flex;
  flex-direction: column;
  width: 21rem;
  gap: 0.6rem;
`;

export const img = css`
  width: 100%;
  height: 15rem;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
