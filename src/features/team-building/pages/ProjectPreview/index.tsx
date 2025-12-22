import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateProjectGallery, useUpdateProjectGallery } from '@/lib/projectGallery.api';

import Modal from '../../components/Modal_Fix';
import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import { PROJECT_GALLERY_DRAFT_KEY } from '../../components/ProjectGalleryPost/ProjectPostForm';
import type {
  GenerationValue,
  Part,
  ProjectGalleryUpsertBody,
  ProjectMemberBase,
  ServiceStatus,
} from '../../types/gallery';

type PreviewQuery = {
  title?: string | string[];
  oneLiner?: string | string[];
  description?: string | string[];
  leaderPart?: string | string[];
  generation?: string | string[];
  serviceStatus: ServiceStatus;
  teamMembers?: string | string[];
  leader?: string | string[];

  mode?: string | string[]; // 'create' | 'edit'
  returnTo?: string | string[];
  projectId?: string | string[];
  thumbnailUrl?: string | string[];
};

// string 변환 함수 (타입 안전성)
const asString = (value: unknown): string => {
  if (Array.isArray(value)) return String(value[0] ?? '');
  if (typeof value === 'string') return value;
  return '';
};

type RawTeamMember = {
  name: string;
  part?: string[];
  userId?: number; // ✅ 실제 payload 만들려면 userId가 있어야 함 (현재 ProjectPostForm teamMembers는 userId 포함)
  school?: string;
  badge?: string;
};

type ProjectGalleryDraft = {
  title: string;
  oneLiner: string;
  generation: string[];
  leader: ProjectMemberBase;
  leaderPart: string[];
  description: string;
  teamMembers: RawTeamMember[];
  serviceStatus: ServiceStatus;
  thumbnailUrl?: string | null;
};

/** 따로 분리하여 정리할 예정 */
function parseGeneration(value: string): GenerationValue {
  if (value === '25-26' || value === '24-25' || value === '23-24' || value === '22-23') {
    return value;
  }
  return '25-26';
}

function mapUiPartToEnum(ui: string): Part | undefined {
  switch (ui) {
    case '기획':
      return 'PM';
    case '디자인':
      return 'DESIGN';
    case '프론트엔드 (웹)':
      return 'WEB';
    case '프론트엔드 (모바일)':
      return 'MOBILE';
    case '백엔드':
      return 'BACKEND';
    case 'AI/ML':
      return 'AI';
    default:
      return undefined;
  }
}

export default function ProjectPreviewPage() {
  const router = useRouter();
  const query = router.query as PreviewQuery;

  const mode = asString(query.mode) || 'create'; // 'create' | 'edit'
  const returnTo = asString(query.returnTo) || '/project-gallery/post';

  const draft = useMemo<ProjectGalleryDraft | null>(() => {
    if (!router.isReady) return null;

    const raw = sessionStorage.getItem(PROJECT_GALLERY_DRAFT_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as ProjectGalleryDraft;
    } catch {
      return null;
    }
  }, [router.isReady]);

  const projectId = useMemo(() => {
    const n = Number(asString(query.projectId));
    return Number.isFinite(n) ? n : 0;
  }, [query.projectId]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.startsWith('/project-gallery/post') && !url.startsWith('/project-gallery/preview')) {
        sessionStorage.removeItem(PROJECT_GALLERY_DRAFT_KEY);
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const clearDraft = () => {
      sessionStorage.removeItem(PROJECT_GALLERY_DRAFT_KEY);
    };

    window.addEventListener('pagehide', clearDraft);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        clearDraft();
      }
    });

    return () => {
      window.removeEventListener('pagehide', clearDraft);
    };
  }, []);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<number>(0);

  const createMutation = useCreateProjectGallery();
  const updateMutation = useUpdateProjectGallery();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (!draft) return null;

  const title = draft.title;
  const oneLiner = draft.oneLiner;
  const description = draft.description;
  const status = draft.serviceStatus;

  const generation = parseGeneration(draft.generation[0]);

  const leader = {
    name: draft.leader.name,
    role: mapUiPartToEnum(draft.leaderPart[0]),
    userId: draft.leader.userId,
  };

  const members = draft.teamMembers.map(m => ({
    name: m.name,
    role: mapUiPartToEnum(m.part?.[0] ?? ''),
    userId: m.userId ?? 0,
  }));

  const handleBackToForm = () => {
    router.push(returnTo);
  };

  const buildBody = (): ProjectGalleryUpsertBody => {
    if (!draft) throw new Error('임시 저장된 프로젝트가 없습니다.');

    return {
      projectName: draft.title.trim(),
      generation: parseGeneration(draft.generation[0]),
      shortDescription: draft.oneLiner.trim(),
      serviceStatus: draft.serviceStatus,
      description: draft.description.trim(),
      leader: {
        userId: draft.leader.userId,
        part: mapUiPartToEnum(draft.leaderPart[0])!,
      },
      members: draft.teamMembers.map(m => ({
        userId: m.userId!,
        part: mapUiPartToEnum(m.part?.[0] ?? '')!,
      })),
      thumbnailUrl: draft.thumbnailUrl ?? null,
    };
  };

  // 프로젝트 전시하기 버튼 클릭
  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting) return;

    try {
      const body = buildBody();

      if (mode === 'edit') {
        if (projectId <= 0) throw new Error('수정할 프로젝트 ID가 없습니다.');

        const res = await updateMutation.mutateAsync({
          projectId,
          body: { ...body, thumbnailUrl: body.thumbnailUrl ?? null },
        });

        setSavedProjectId(res.galleryProjectId);
      } else {
        const res = await createMutation.mutateAsync({
          ...body,
          thumbnailUrl: body.thumbnailUrl ?? null,
        });

        setSavedProjectId(res.galleryProjectId);
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (e: any) {
      setShowConfirmModal(false);
      alert(e?.message ?? '전시에 실패했습니다.');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    if (savedProjectId > 0) router.push(`/project-gallery/${savedProjectId}`);
  };

  if (!router.isReady) return null;

  return (
    <>
      <ProjectDetailView
        title={title}
        description={oneLiner}
        longDescription={description}
        status={status}
        generation={generation}
        leader={leader}
        members={members}
        isPreview
        onClickBackToForm={handleBackToForm}
        onClickSubmit={handleSubmitClick}
      />

      {/* 전시 확인 모달 */}
      {showConfirmModal && (
        <Modal
          type="textConfirm"
          title="해당 프로젝트를 전시하시겠습니까?"
          message=""
          confirmText={isSubmitting ? '전시 중...' : '예'}
          cancelText="아니오"
          onClose={() => (isSubmitting ? null : setShowConfirmModal(false))}
          onConfirm={handleConfirmSubmit}
          customTitleAlign="center"
        />
      )}

      {/* 전시 완료 모달 */}
      {showSuccessModal && (
        <Modal
          type="textOnly"
          title="전시가 완료되었습니다."
          message=""
          buttonText="확인"
          onClose={handleCloseSuccess}
          customTitleAlign="center"
        />
      )}
    </>
  );
}
