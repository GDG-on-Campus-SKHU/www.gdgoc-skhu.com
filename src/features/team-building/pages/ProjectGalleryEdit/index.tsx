import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import ProjectPostForm, {
  type ProjectPostFormInitialValues,
} from '../../components/ProjectGalleryPost/ProjectPostForm';

import {
  useProjectGalleryDetail,
  useProjectGalleryLeaderProfile,
  useUpdateProjectGallery,
} from '@/lib/projectGallery.api';

import type {
  ProjectGalleryUpsertBody,
  Part,
  GenerationValue,
  GenerationTab,
  ProjectMemberBase,
} from '../../types/gallery';

/** Part(enum) -> 폼 라벨(한글) */
function partToLabel(
  part: Part
): '기획' | '디자인' | '프론트엔드 (웹)' | '프론트엔드 (모바일)' | '백엔드' | 'AI/ML' {
  switch (part) {
    case 'PM':
      return '기획';
    case 'DESIGN':
      return '디자인';
    case 'WEB':
      return '프론트엔드 (웹)';
    case 'MOBILE':
      return '프론트엔드 (모바일)';
    case 'BACKEND':
      return '백엔드';
    case 'AI':
      return 'AI/ML';
    default:
      return '기획';
  }
}

function generationValueToTab(gen: GenerationValue): GenerationTab {
  if (gen === '25-26') return '25-26';
  if (gen === '24-25') return '24-25';
  return '이전 기수'; // 23-24, 22-23은 이전 기수로
}

function normalizeLeaderProfile(input: any): ProjectMemberBase | undefined {
  if (!input) return undefined;

  return {
    userId: input.userId,
    name: input.name,
    school: input.school,
    badge: input.badge ?? input.generationAndPosition ?? '',
  };
}

export default function ProjectGalleryEditPage() {
  const router = useRouter();
  const { isReady, query } = router;

  const projectId = useMemo(() => {
    if (!isReady) return 0;
    const raw = (query.projectId ?? query.id) as string | string[] | undefined;
    const n = Number(Array.isArray(raw) ? raw[0] : raw);
    return Number.isFinite(n) ? n : 0;
  }, [isReady, query.projectId, query.id]);

  const {
    data: detail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
  } = useProjectGalleryDetail(projectId, {
    enabled: isReady && projectId > 0,
    retry: false,
  });

  const { data: leaderProfile } = useProjectGalleryLeaderProfile({
    enabled: projectId > 0,
    retry: false,
  });

  const updateMutation = useUpdateProjectGallery({
    onSuccess: async res => {
      router.push(`/project-gallery/${res.galleryProjectId}`);
    },
  });

  /** 상세 → 폼 초기값으로 변환 */
  const initialValues = useMemo<ProjectPostFormInitialValues>(() => {
    if (!detail) return {};

    const leader = normalizeLeaderProfile(leaderProfile) ?? normalizeLeaderProfile(detail.leader);

    const leaderPartLabel = detail.leader?.part ? partToLabel(detail.leader.part) : undefined;

    const teamMembers =
      (detail.members ?? [])
        .filter(m => m.memberRole === 'MEMBER')
        .map(m => ({
          userId: m.userId,
          name: m.name,
          school: m.school,
          badge: m.badge, // (api mapping에서 generationAndPosition -> badge로 이미 바뀐 상태)
          part: [partToLabel(m.part)],
        })) ?? [];

    return {
      title: detail.title,
      oneLiner: detail.shortDescription,
      generation: generationValueToTab(detail.generation),
      leader,
      leaderPart: leaderPartLabel,
      serviceStatus: detail.status,
      description: detail.longDescription,
      teamMembers,
      thumbnailUrl: detail.thumbnailUrl,
    };
  }, [detail, leaderProfile]);

  const handleSubmit = (body: ProjectGalleryUpsertBody) => {
    return updateMutation.mutateAsync({
      projectId,
      body: { ...body, thumbnailUrl: body.thumbnailUrl ?? null },
    });
  };

  if (!isReady || projectId === 0) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <h1 css={pageTitleCss}>Project Gallery</h1>
          <div css={infoCss}>잘못된 접근입니다.</div>
        </div>
      </main>
    );
  }

  if (isDetailLoading) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <h1 css={pageTitleCss}>Project Gallery</h1>
          <div css={infoCss}>불러오는 중...</div>
        </div>
      </main>
    );
  }

  if (isDetailError) {
    return (
      <main css={mainCss}>
        <div css={innerCss}>
          <h1 css={pageTitleCss}>Project Gallery</h1>
          <div css={errorCss}>
            프로젝트 정보를 불러오지 못했습니다.
            <br />
            {detailError?.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        <h1 css={pageTitleCss}>Project Gallery</h1>

        <ProjectPostForm
          initialValues={initialValues}
          isEditMode
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitError={updateMutation.error as Error | null}
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
  margin: 60px 0 40px;
`;

const infoCss = css`
  padding: 24px 0;
  font-size: 18px;
`;

const errorCss = css`
  padding: 24px 0;
  font-size: 18px;
  color: ${colors.point.red};
`;
