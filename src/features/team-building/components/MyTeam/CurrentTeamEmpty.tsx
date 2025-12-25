import { useEffect } from 'react';
import { useCurrentTeam } from '@/lib/myTeam.api';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

type CurrentTeamEmptyProps = {
  /** MyTeamPage에서 "현재 팀원 구성" 탭 + 팀원일 때만 enabled 주는 용도 */
  enabled?: boolean;
  /** 팀이 있는지 여부를 MyTeamPage에게 */
  onHasMatchedTeamChange?: (hasTeam: boolean) => void;
};

export default function CurrentTeamEmpty({
  enabled = true,
  onHasMatchedTeamChange,
}: CurrentTeamEmptyProps) {
  const { data, isLoading, isError } = useCurrentTeam({
    enabled,
    retry: false,
  });

  const hasTeam = !!data;

  useEffect(() => {
    if (!enabled) return;
    if (isLoading) return;
    if (isError) return; // 여기서는 별도 처리
    onHasMatchedTeamChange?.(hasTeam);
  }, [enabled, hasTeam, isLoading, isError, onHasMatchedTeamChange]);

  if (!enabled) return null;

  if (isLoading) {
    return (
      <section css={sectionWrapCss}>
        <div css={emptyBoxCss}>
          <p css={emptyTextCss}>불러오는 중...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section css={sectionWrapCss}>
        <div css={emptyBoxCss}>
          <p css={emptyTextCss}>팀 정보를 불러오지 못했어요.</p>
        </div>
      </section>
    );
  }

  if (data) return null;

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
  font-size: 20px;
  font-weight: 500;
  line-height: 38.4px;
  color: ${colors.grayscale[400]};
`;
