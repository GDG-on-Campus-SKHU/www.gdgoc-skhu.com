import { css } from '@emotion/react';

import { layoutCss } from '../../../../styles/constants';
import { useMyPageProjects } from '@/lib/mypageProject.api';
import MyProjectCard from '../../components/MyProject/MyProjectCard';

export default function MyProjectPage() {
  const { data: projects, isLoading, error } = useMyPageProjects();

  // 로딩 상태
  if (isLoading) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={loadingCss}>프로젝트를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <div css={errorCss}>프로젝트를 불러오는 중 오류가 발생했습니다.</div>
        </div>
      </main>
    );
  }

  // 프로젝트 없음
  const hasProjects = projects && projects.length > 0;

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div css={headerCss}>
          <p css={titleCss}>
            마이페이지 <span css={subTitleCss}>| My project</span>
          </p>
        </div>
        
        {hasProjects ? (
          <div css={projectListCss}>
            {projects.map((project) => (
              <MyProjectCard key={project.projectId} item={project} />
            ))}
          </div>
        ) : (
          <div css={emptyStateCss}>참여한 프로젝트가 없습니다.</div>
        )}
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding-top: 5rem;
  padding-bottom: 4rem;
`;

const innerCss = css`
  ${layoutCss}
`;

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
  margin-bottom: 2rem;
`;

const titleCss = css`
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const subTitleCss = css`
  font-weight: 400;
`;

const projectListCss = css`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

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
  font-size: 20px;
  color: #999;
`;