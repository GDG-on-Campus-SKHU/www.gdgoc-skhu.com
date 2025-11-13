import { css } from '@emotion/react';

import { ProjectStatus } from '../../types/gallery';

type Props = { status: ProjectStatus };

const LABEL: Record<ProjectStatus, string> = {
  service: '서비스 중',
};

const DOT: Record<ProjectStatus, string> = {
  service: '#4285F4',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span css={badgeCss}>
      <i css={dotCss(DOT[status])} />
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
