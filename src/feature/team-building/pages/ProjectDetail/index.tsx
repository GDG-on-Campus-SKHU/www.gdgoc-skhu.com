import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import ProjectDetailDescription from '../../components/ProjectDetail/ProjectDetailDescription';
import ProjectDetailHeader from '../../components/ProjectDetail/ProjectDetailHeader';
import ProjectDetailMeta from '../../components/ProjectDetail/ProjectDetailMeta';
import { getMockProjectDetailById } from '../../types/gallery';

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  // 임시 데이터 연결
  const data = useMemo(() => (id ? getMockProjectDetailById(id) : null), [id]);

  if (!data) return null;

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <h1 css={pageTitleCss}>Project Gallery</h1>

        <ProjectDetailHeader title={data.title} subtitle={data.description} status={data.status} />

        <ProjectDetailMeta leader={data.leader} members={data.members} />

        <ProjectDetailDescription title="프로젝트 설명" content={data.longDescription} />
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
  background: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const pageTitleCss = css`
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;
  margin: 60px 0;
`;
