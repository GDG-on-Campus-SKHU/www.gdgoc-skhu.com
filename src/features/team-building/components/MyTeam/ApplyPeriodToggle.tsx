import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export type SupportPhase = 'first' | 'second';

type MyTeamSupportPeriodToggleProps = {
  /** 현재 선택된 지원 기간 */
  activePhase: SupportPhase;
  /** 2차 지원 기간이 열렸는지 여부 */
  secondEnabled: boolean;
  onChange: (phase: SupportPhase) => void;
  className?: string;
};

export default function ApplyPeriodToggle({
  activePhase,
  secondEnabled,
  onChange,
  className,
}: MyTeamSupportPeriodToggleProps) {
  const handleClickFirst = () => {
    if (activePhase !== 'first') onChange('first');
  };

  const handleClickSecond = () => {
    if (!secondEnabled) return;
    if (activePhase !== 'second') onChange('second');
  };

  return (
    <div css={wrapCss} className={className}>
      {/* 1차 지원기간 버튼 */}
      <button
        type="button"
        css={tabCss({
          active: activePhase === 'first',
          disabled: false,
        })}
        onClick={handleClickFirst}
      >
        1차 지원기간
      </button>

      {/* 2차 지원기간 버튼 */}
      <button
        type="button"
        css={tabCss({
          active: activePhase === 'second',
          disabled: !secondEnabled,
        })}
        onClick={handleClickSecond}
        disabled={!secondEnabled}
      >
        2차 지원기간
      </button>
    </div>
  );
}

const wrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 7.5px;
  border-radius: 999px;
  background-color: ${colors.grayscale[200]};
  white-space: noWrap;
`;

type TabStyleParams = {
  active: boolean;
  disabled: boolean;
};

const tabCss = ({ active, disabled }: TabStyleParams) => css`
  flex: 1;

  border-radius: 30px;
  border: none;
  padding: 5px 20px;

  font-size: 20px;
  line-height: 32px;

  font-weight: ${disabled ? 500 : active ? 700 : 500};

  background-color: ${active ? colors.white : 'transparent'};
  color: ${
    disabled ? colors.grayscale[400] : active ? colors.grayscale[1000] : colors.grayscale[1000]
  };

  box-shadow: ${active ? '0 0 0 0' + colors.white : 'none'};
  cursor: ${disabled ? 'default' : 'pointer'};

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
    transform 0.1s ease;
`;
