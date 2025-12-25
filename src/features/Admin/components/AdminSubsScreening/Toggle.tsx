import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

export type ScreeningTab = 'pending' | 'history';

type ToggleProps = {
  /** 현재 선택된 탭 */
  activeTab: ScreeningTab;
  /** 대기 목록 개수 */
  pendingCount: number;
  /** 심사 내역 개수 */
  historyCount: number;
  onChange: (tab: ScreeningTab) => void;
  className?: string;
};

export default function Toggle({
  activeTab,
  pendingCount,
  historyCount,
  onChange,
  className,
}: ToggleProps) {
  const handleClick = (next: ScreeningTab) => {
    if (next === activeTab) return;
    onChange(next);
  };

  return (
    <div css={wrapCss} className={className}>
      <button
        type="button"
        css={tabCss({ active: activeTab === 'pending' })}
        onClick={() => handleClick('pending')}
      >
        심사 대기 목록
        <span css={countCss({ active: activeTab === 'pending' })}>({pendingCount}건)</span>
      </button>

      <button
        type="button"
        css={tabCss({ active: activeTab === 'history' })}
        onClick={() => handleClick('history')}
      >
        심사 내역
        <span css={countCss({ active: activeTab === 'history' })}>({historyCount}건)</span>
      </button>
    </div>
  );
}

const wrapCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 999px;
  background-color: ${colors.grayscale[200]};
  white-space: nowrap;
  gap: 6px;
`;

type TabStyleParams = {
  active: boolean;
};

const tabCss = ({ active }: TabStyleParams) => css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 30px;
  padding: 9px 22px;
  background-color: ${active ? colors.white : 'transparent'};
  color: ${active ? colors.grayscale[1000] : colors.grayscale[600]};
  font-size: 18px;
  line-height: 28px;
  font-weight: ${active ? 800 : 600};
  cursor: ${active ? 'default' : 'pointer'};
  box-shadow: ${active ? '0 8px 20px rgba(13, 16, 23, 0.08)' : 'none'};
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${active ? colors.white : 'rgba(255, 255, 255, 0.72)'};
    color: ${colors.grayscale[1000]};
  }

  &:active {
    transform: ${active ? 'none' : 'scale(0.99)'};
  }
`;

const countCss = ({ active }: TabStyleParams) => css`
  color: ${colors.grayscale[1000]};
  font-size: 16px;
  font-weight: ${active ? 700 : 500};
`;
