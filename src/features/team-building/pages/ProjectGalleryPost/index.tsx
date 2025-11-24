import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import ProjectPostForm, {
  ProjectPostFormInitialValues,
  TeamMember,
} from '../../components/ProjectGalleryPost/ProjectPostForm';

export default function ProjectGalleryPostPage() {
  const router = useRouter();
  const { query, isReady } = router;

  // 미리보기 -> 작성 페이지로 돌아올 시 입력값 유지
  const initialValues = useMemo<ProjectPostFormInitialValues>(() => {
    if (!isReady) return {};

    const title =
      typeof query.title === 'string' && query.title.length > 0 ? query.title : undefined;

    const oneLiner =
      typeof query.oneLiner === 'string' && query.oneLiner.length > 0 ? query.oneLiner : undefined;

    const description =
      typeof query.description === 'string' && query.description.length > 0
        ? query.description
        : undefined;

    const genRaw = query.generation;
    const generation =
      genRaw === '25-26' || genRaw === '24-25' || genRaw === '이전 기수'
        ? (genRaw as '25-26' | '24-25' | '이전 기수')
        : undefined;

    const leaderPart =
      typeof query.leaderPart === 'string' && query.leaderPart.length > 0
        ? query.leaderPart
        : undefined;

    let serviceStatus: 'RUNNING' | 'PAUSED' | undefined;
    const statusRaw = query.serviceStatus;
    if (statusRaw === 'RUNNING' || statusRaw === 'PAUSED') {
      serviceStatus = statusRaw;
    }

    let teamMembers: TeamMember[] | undefined;
    if (typeof query.teamMembers === 'string') {
      try {
        const parsed = JSON.parse(query.teamMembers);
        if (Array.isArray(parsed)) {
          teamMembers = parsed.map(m => ({
            id: String(m.id),
            name: String(m.name),
            badge: String(m.badge),
            school: String(m.school),
            part: Array.isArray(m.part) ? m.part.map((p: unknown) => String(p)) : [],
          }));
        }
      } catch {
        // 실패 시 undefined 유지
      }
    }

    const result: ProjectPostFormInitialValues = {
      title,
      oneLiner,
      generation,
      leaderPart,
      serviceStatus,
      description,
      teamMembers,
    };

    return result;
  }, [isReady, query]);

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <h1 css={pageTitleCss}>Project Gallery</h1>
        <ProjectPostForm initialValues={initialValues} />
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
  background-color: ${colors.white};
  color: ${colors.grayscale[1000]};
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
  margin: 60px 0 55px;
`;
