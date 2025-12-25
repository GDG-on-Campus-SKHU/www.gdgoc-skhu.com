import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

type MyTeamCapacityBadgeProps = {
  /** 현재 모집된 인원 수 */
  current: number;
  /** 목표 / 최대 인원 수 */
  capacity: number;
  /** 이 파트가 모집 중인지 여부 */
  isRecruiting: boolean;
  /** 상위에서 width 조절 */
  width?: string | number;
};

export default function MyTeamCount({
  current,
  capacity,
  isRecruiting,
  width,
}: MyTeamCapacityBadgeProps) {
  const isDisabled = !isRecruiting;

  const label = `${current}/${capacity}명`;

  const inlineWidth =
    width != null ? { width: typeof width === 'number' ? `${width}px` : width } : undefined;

  const ariaLabel = isRecruiting
    ? `현재 ${capacity}명 중 ${current}명 모집`
    : '이 파트는 모집하지 않습니다.';

  return (
    <span
      css={[badgeBaseCss, isDisabled ? badgeDisabledCss : badgeActiveCss]}
      style={inlineWidth}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
    >
      {label}
    </span>
  );
}

const badgeBaseCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 2px 12px;
  border-radius: 20px;

  font-size: 16px;
  font-weight: 700;
  line-height: 25.6px;
`;

const badgeActiveCss = css`
  color: ${colors.primary[600]};
  background-color: ${colors.primary[100]};
`;

const badgeDisabledCss = css`
  color: ${colors.grayscale[500]};
  background-color: ${colors.grayscale[200]};
`;
