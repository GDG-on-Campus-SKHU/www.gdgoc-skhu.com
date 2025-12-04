import { css } from '@emotion/react';

import { layoutCss } from '../../../../styles/constants';
import MyProjectCard from '../../components/MyProject/MyProjectCard';
import { MOCK_PROJECTS } from '../../types/myproject';

export default function MyProjectPage() {
  // MOCK_PROJECTS를 사용
  const projects = MOCK_PROJECTS;

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <div css={headerCss}>
          <p css={titleCss}>
            마이페이지 <span css={subTitleCss}>| My project</span>
          </p>
        </div>
        <div css={projectListCss}>
          {projects.map(project => (
            <MyProjectCard key={project.id} item={project} />
          ))}
        </div>
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
