import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

interface TagProps {
  label: string;
  disabled?: boolean;
}

export default function Tag({ label, disabled = false }: TagProps) {
  return <div css={getWrapCss(disabled)}>{label}</div>;
}

const getWrapCss = (disabled: boolean) => css`
  min-width: 144px;
  min-height: 33px;
  padding: 2px 8px;
  text-align: center;
  background-color: ${disabled ? colors.grayscale[300] : '#D9E7FD'};
  color: ${disabled ? colors.grayscale[600] : colors.gdscBlue};
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  border-radius: 4px;
`;
