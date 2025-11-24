import { css } from '@emotion/react';

import { colors } from './colors';
import { mediaQuery } from './media';

export const paragraphCss = css`
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: ${colors.gray500};

  ${mediaQuery('xs')} {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`;

export const bigCss = css`
  font-size: 5rem;
  font-weight: bold;
  line-height: 6rem;

  ${mediaQuery('xs')} {
    font-size: 3.5rem;
    line-height: 4rem;
  }
`;

export const typography = {
  h1Bold: css`
    font-size: 50px;
    font-weight: 700;
    line-height: 150%;
    color: ${colors.grayscale[1000]};
    ${mediaQuery('sm')} {
      font-size: 42px;
    }
  `,
  h2Bold: css`
    font-size: 36px;
    font-weight: 700;
    line-height: 150%;
    color: ${colors.grayscale[900]};
    ${mediaQuery('sm')} {
      font-size: 28px;
    }
  `,
  b1: css`
    font-size: 24px;
    font-weight: 400;
    line-height: 160%;
    color: ${colors.grayscale[800]};
    ${mediaQuery('sm')} {
      font-size: 20px;
    }
  `,
  b2: css`
    font-size: 20px;
    font-weight: 400;
    line-height: 160%;
    color: ${colors.grayscale[800]};
    ${mediaQuery('sm')} {
      font-size: 18px;
    }
  `,
  b3: css`
    font-size: 18px;
    font-weight: 400;
    line-height: 160%;
    color: ${colors.grayscale[700]};
    ${mediaQuery('sm')} {
      font-size: 16px;
    }
  `,
  b4: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    color: ${colors.grayscale[700]};
    ${mediaQuery('sm')} {
      font-size: 14px;
    }
  `,
  caption: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 150%;
    color: ${colors.grayscale[600]};
  `,
};
