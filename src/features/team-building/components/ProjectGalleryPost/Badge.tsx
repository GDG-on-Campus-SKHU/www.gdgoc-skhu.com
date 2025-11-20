import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

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

  color: ${colors.primary[600]};
  background: ${colors.primary[100]};
`;
