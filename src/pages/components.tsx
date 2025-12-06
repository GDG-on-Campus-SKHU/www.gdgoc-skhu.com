/** 컴포넌트 사용 예시 확인 페이지 (지울 예정) */
import { useState } from 'react';
import { css } from '@emotion/react';

import TabBar from '../features/team-building/components/TabBar';

const MY_TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'project', label: 'My project' },
  { key: 'team', label: 'My team' },
] as const;

type MyTab = (typeof MY_TABS)[number]['key'];

export default function ComponentsPage() {
  const [activeTab, setActiveTab] = useState<MyTab>('project');

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 탭 컴포넌트 (마이페이지 사용 예시) */}
        <TabBar
          items={MY_TABS}
          activeKey={activeTab}
          onChange={key => setActiveTab(key as MyTab)}
        />
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: #fff;
  padding-top: 80px;
`;

const innerCss = css`
  width: 100%;
`;
