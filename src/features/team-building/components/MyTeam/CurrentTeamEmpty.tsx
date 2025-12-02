import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export default function CurrentTeamEmpty() {
  return (
    <section css={sectionWrapCss}>
      <div css={emptyBoxCss}>
        <p css={emptyTextCss}>아직 매칭된 팀이 없어요.</p>
      </div>
    </section>
  );
}

const sectionWrapCss = css`
  width: 100%;
  margin-top: 55px;
`;

const emptyBoxCss = css`
  width: 100%;
  min-height: 400px;
  border-radius: 12px;
  background-color: ${colors.grayscale[200]};
  border: 1px solid ${colors.grayscale[400]};

  display: flex;
  align-items: center;
  justify-content: center;
`;

const emptyTextCss = css`
  font-size: 24px;
  font-weight: 500;
  line-height: 38.4px;
  color: ${colors.grayscale[900]};
`;
