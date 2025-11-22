import { css } from '@emotion/react';

import ActivitySection from '../../components/Activity/ActivitySection';
import { getActivitiesByCategory, MOCK_ACTIVITIES } from '../../types/activity';

export default function ActivityPage() {
  const category1Activities = getActivitiesByCategory(MOCK_ACTIVITIES, '카테고리 이름 1');
  const category2Activities = getActivitiesByCategory(MOCK_ACTIVITIES, '카테고리 이름 2');

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div css={headerCss}>
          <h1 css={titleCss}>Activity</h1>
        </div>

        <div css={sectionContainerCss}>
          <ActivitySection categoryName="카테고리 이름 1" activities={category1Activities} />
          <ActivitySection categoryName="카테고리 이름 2" activities={category2Activities} />
        </div>
      </div>
    </main>
  );
}

// Layout
const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 1rem 5rem 2.5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
  margin-bottom: 4rem;
  padding: 0;
`;

const sectionContainerCss = css`
  display: flex;
  flex-direction: column;
  gap: 5rem;
`;

// Typography
const titleCss = css`
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;
`;
