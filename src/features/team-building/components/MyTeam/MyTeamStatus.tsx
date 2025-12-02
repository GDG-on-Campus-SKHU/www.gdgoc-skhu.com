import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export type MyTeamStatusCardVariant =
  | 'not-recruiting' // 모집하지 않는 파트
  | 'not-filled'; // 아직 팀원 없음

type Props = {
  variant: MyTeamStatusCardVariant;
};

export default function MyTeamStatusCard({ variant }: Props) {
  const text = variant === 'not-recruiting' ? '모집하지 않는 파트예요.' : '아직 모집되지 않았어요.';

  return (
    <div css={[cardCss, variant === 'not-recruiting' ? notRecruitingCss : notFilledCss]}>
      {text}
    </div>
  );
}

const cardCss = css`
  height: 80px;
  width: 100%;

  border-radius: 8px;
  border: 1px solid ${colors.grayscale[400]};
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
`;

const notRecruitingCss = css`
  background: ${colors.grayscale[200]};
  color: ${colors.grayscale[500]};
`;

const notFilledCss = css`
  background: ${colors.white};
  color: ${colors.grayscale[1000]};
`;
