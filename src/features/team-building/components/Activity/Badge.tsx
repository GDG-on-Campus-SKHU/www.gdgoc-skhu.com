import { css } from '@emotion/react';

interface StatusBadgeProps {
  year: string;
}

export default function StatusBadge({ year }: StatusBadgeProps) {
  return <span css={badgeCss}>{year}</span>;
}

const badgeCss = css`
  display: inline-flex;
  align-items: center;
  line-height: 1;
  font-size: 12px;
  font-weight: 600;
  color: #4285f4;
  background: #d9e7fd;
  border-radius: 999px;
  padding: 0.3em 0.6em;
`;
