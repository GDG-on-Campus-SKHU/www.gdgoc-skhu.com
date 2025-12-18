import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export const trBaseCss = css`
  border-bottom: 1px solid ${colors.grayscale[200]};
`;

export const tdBaseCss = css`
  padding: 18px 0;
  padding-left: 27px;
  padding-right: 15px;

  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.grayscale[1000]};
  vertical-align: middle;
  white-space: nowrap;
`;

export const tdAlignCss = (align: 'left' | 'center' | 'right') => css`
  text-align: ${align};
`;

export const colWidthCss = (w: number | string) => css`
  width: ${typeof w === 'number' ? `${w}px` : w};
`;
