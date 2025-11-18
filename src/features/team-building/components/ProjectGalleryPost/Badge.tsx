import { css } from '@emotion/react';

type BadgeProps = {
  text: string;
  className?: string;
};

export default function Badge({ text, className }: BadgeProps) {
  return (
    <span css={badgeCss} className={className}>
      {text}
    </span>
  );
}

const badgeCss = css`
  padding: 1px 8px;
  border-radius: 4px;

  font-size: 12px;
  font-weight: 600;
  line-height: 19.2px;

  color: #4285f4;
  background: #d9e7fd;
`;
