import { css } from '@emotion/react';
import { colors } from '../../../styles/constants';

export type TabItem = {
  key: string;
  label: string;
};

type TabsProps = {
  items: ReadonlyArray<TabItem>;
  activeKey: string;
  onChange: (key: string) => void;
};

export default function TabBar({ items, activeKey, onChange }: TabsProps) {
  return (
    <nav css={tabsWrapCss}>
      {items.map(item => {
        const active = item.key === activeKey;
        return (
          <button key={item.key} type="button" onClick={() => onChange(item.key)}>
            <span css={labelCss(active)}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const tabsWrapCss = css`
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const labelCss = (active: boolean) => css`
  position: relative;

  padding: 20px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
  color: ${active ? colors.grayscale[1000] : colors.grayscale[500]};

  border-bottom: 4px solid transparent;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 4px;
    background: ${colors.grayscale[1000]};

    transform-origin: center;
    transform: scaleX(${active ? 1 : 0});
    transition: transform 0.2s ease;
  }
`;
