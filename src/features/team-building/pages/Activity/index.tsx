import { usePublishedActivities } from '@/lib/activity.api';
import { css } from '@emotion/react';

import ActivitySection from '../../components/Activity/ActivitySection';

export default function ActivityPage() {
  const { data: categories, isLoading, error } = usePublishedActivities();

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={loadingCss}>로딩 중...</div>
        </div>
      </main>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={errorCss}>데이터를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </main>
    );
  }

  // 데이터 없음 처리
  if (!categories || categories.length === 0) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={headerCss}>
            <h1 css={titleCss}>Activity</h1>
          </div>
          <div css={emptyStateCss}>등록된 액티비티가 없습니다.</div>
        </div>
      </main>
    );
  }

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div css={headerCss}>
          <h1 css={titleCss}>Activity</h1>
        </div>

        <div css={sectionContainerCss}>
          {categories.map(category => (
            <ActivitySection
              key={category.categoryId}
              categoryName={category.categoryTitle}
              activities={category.activities}
            />
          ))}
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

// State styles
const loadingCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #666;
`;

const errorCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #e53e3e;
`;

const emptyStateCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 18px;
  color: #999;
`;
