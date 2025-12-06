import { css } from '@emotion/react';

export const layout = {
  maxWidth: '1080px',
  padding: '0 1rem',
} as const;

export const layoutCss = css`
  width: 100%;
  max-width: ${layout.maxWidth};
  padding: ${layout.padding};
  margin: 0 auto;
`;

export const sectionLayoutCss = css`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const sectionLayoutWideCss = css`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

export const sectionVerticalSpacing = {
  large: '140px',
  medium: '100px',
  small: '70px',
} as const;

