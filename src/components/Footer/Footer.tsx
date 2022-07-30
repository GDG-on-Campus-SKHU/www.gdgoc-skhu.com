import { css } from '@emotion/react';

import { colors } from '../../styles/constants';
import { layoutCss } from '../../styles/constants/layout';

export default function Footer() {
  return (
    <footer
      css={css`
        width: 100%;
        background-color: ${colors.gray500};
        color: ${colors.white};
        z-index: 100;
      `}
    >
      <div
        css={css`
          ${layoutCss}
          height: 36px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}
      >
        <small
          css={css`
            font-size: 0.75rem;
          `}
        >
          &copy; 2022 Google Developer Student Clubs at SKHU. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
