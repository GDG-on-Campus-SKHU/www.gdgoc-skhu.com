import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useCreateProjectGallery } from '@/lib/projectGallery.api';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import ProjectPostForm, {
  PART_OPTIONS,
  ProjectPostFormInitialValues,
} from '../../components/ProjectGalleryPost/ProjectPostForm';
import type {
  CreateProjectGalleryResponseDto,
  ProjectGalleryUpsertBody,
} from '../../types/gallery';

// 폼에서 사용하는 한글 파트 타입 정의
type FormLeaderPart =
  | '기획'
  | '디자인'
  | '프론트엔드 (웹)'
  | '프론트엔드 (모바일)'
  | '백엔드'
  | 'AI/ML';

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

    // [Fix] API 타입(Part)이 아닌, 폼이 요구하는 한글 타입(FormLeaderPart)으로 단언
    const leaderPart =
      typeof query.leaderPart === 'string' && query.leaderPart.length > 0
        ? (query.leaderPart as FormLeaderPart)
        : undefined;

    let serviceStatus: 'IN_SERVICE' | 'NOT_IN_SERVICE' | undefined;
    const statusRaw = query.serviceStatus;
    if (statusRaw === 'IN_SERVICE' || statusRaw === 'NOT_IN_SERVICE') {
      serviceStatus = statusRaw;
    }

    // teamMembers 파싱
    let teamMembers: any[] | undefined;
    if (typeof query.teamMembers === 'string') {
      try {
        const parsed = JSON.parse(query.teamMembers);
        if (Array.isArray(parsed)) {
          teamMembers = parsed;
        }
      } catch {
        // ignore error
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
