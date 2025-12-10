import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export type MyApplyStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type MyApplyStatusBadgeProps = {
  status: MyApplyStatus;
};

export default function ApplyStatusBadge({ status }: MyApplyStatusBadgeProps) {
  const label = status === 'PENDING' ? '대기 중' : status === 'ACCEPTED' ? '수락됨' : '거절됨';

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

const dotCss = (status: MyApplyStatus) => css`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  flex-shrink: 0;

  background-color: ${status === 'PENDING'
    ? colors.point.yellow
    : status === 'ACCEPTED'
      ? colors.primary[600]
      : colors.grayscale[400]};
`;

const badgeVariantCss = (status: MyApplyStatus) => {
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
    case 'PENDING':
    default:
      return css`
        background-color: #feeecc;
        color: ${colors.grayscale[1000]};
      `;
  }
};
