import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import { EnrollmentStatus } from '../../types/applyStatusData';

type MyApplyStatusBadgeProps = {
  status: EnrollmentStatus;
};

const STATUS_LABEL: Record<EnrollmentStatus, string> = {
  WAITING: '대기 중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
  EXPIRED: '거절됨',
};

export default function ApplyStatusBadge({ status }: MyApplyStatusBadgeProps) {
  const label = STATUS_LABEL[status];

  return (
    <span css={[badgeBaseCss, badgeVariantCss(status)]}>
      <span css={dotCss(status)} />
      <span>{label}</span>
    </span>
  );
}

const badgeBaseCss = css`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  padding: 4px 15px;
  border-radius: 20px;

  font-size: 18px;
  font-weight: 700;
  line-height: 28.8px;
`;

const dotCss = (status: EnrollmentStatus) => css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;

  background-color: ${status === 'WAITING'
    ? colors.point.yellow
    : status === 'ACCEPTED'
      ? colors.primary[600]
      : colors.grayscale[400]};
`;

const badgeVariantCss = (status: EnrollmentStatus) => {
  switch (status) {
    case 'ACCEPTED':
      return css`
        background-color: ${colors.primary[100]};
        color: ${colors.grayscale[1000]};
      `;
    case 'REJECTED':
      return css`
        background-color: ${colors.grayscale[200]};
        color: ${colors.grayscale[500]};
      `;
    case 'EXPIRED':
      return css`
        background-color: ${colors.grayscale[200]};
        color: ${colors.grayscale[500]};
      `;
    case 'WAITING':
    default:
      return css`
        background-color: #feeecc;
        color: ${colors.grayscale[1000]};
      `;
  }
};
