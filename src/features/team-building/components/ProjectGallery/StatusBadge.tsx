import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import type { ServiceStatus } from '../../types/gallery';

type Props = { status: ServiceStatus };

const LABEL: Record<Extract<ServiceStatus, 'IN_SERVICE'>, string> = {
  IN_SERVICE: '서비스 중',
};

const STATE_COLOR: Record<Extract<ServiceStatus, 'IN_SERVICE'>, string> = {
  IN_SERVICE: colors.primary[600],
};

export default function StatusBadge({ status }: Props) {
  if (status === 'NOT_IN_SERVICE') {
    return null;
  }

  return (
    <span css={badgeCss}>
      <i css={dotCss(STATE_COLOR[status])} />
      {LABEL[status]}
    </span>
  );
}

const badgeCss = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #3b3f45;
  background: #d9e7fd;
  border-radius: 9999px;
  padding: 6px 10px;
`;

const dotCss = (color: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${color};
  display: inline-block;
`;
