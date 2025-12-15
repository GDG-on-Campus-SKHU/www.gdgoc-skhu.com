import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import ProjectPostForm, {
  ProjectPostFormInitialValues,
} from '../../components/ProjectGalleryPost/ProjectPostForm';

import { useCreateProjectGallery } from '@/lib/projectGallery.api';
import type {
  CreateProjectGalleryResponseDto,
  ProjectGalleryUpsertBody,
} from '../../types/gallery';

export default function ProjectGalleryPostPage() {
  const router = useRouter();
  const { query, isReady } = router;

  const createMutation = useCreateProjectGallery({
    onSuccess: res => {
      const id = res.galleryProjectId;
      router.push(`/project-gallery/${id}`);
    },
  });

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

    let serviceStatus: 'IN_SERVICE' | 'NOT_IN_SERVICE' | undefined;
    const statusRaw = query.serviceStatus;
    if (statusRaw === 'IN_SERVICE' || statusRaw === 'NOT_IN_SERVICE') {
      serviceStatus = statusRaw;
    }

    // ⚠️ teamMembers 파싱은 ProjectPostFormInitialValues 타입에 맞춰야 함
    // (다음에 ProjectPostForm 보여주면 정확히 맞춰서 수정해줄게)
    let teamMembers: any[] | undefined;
    if (typeof query.teamMembers === 'string') {
      try {
        const parsed = JSON.parse(query.teamMembers);
        if (Array.isArray(parsed)) {
          teamMembers = parsed;
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

  const handleSubmit = async (
    body: ProjectGalleryUpsertBody
  ): Promise<CreateProjectGalleryResponseDto> => {
    if (createMutation.isPending) throw new Error('이미 전시 중입니다.');

    const normalized: ProjectGalleryUpsertBody = {
      ...body,
      thumbnailUrl: body.thumbnailUrl ?? null,
    };

    return await createMutation.mutateAsync(normalized);
  };

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <h1 css={pageTitleCss}>Project Gallery</h1>

        <ProjectPostForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error as Error | null}
        />
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
