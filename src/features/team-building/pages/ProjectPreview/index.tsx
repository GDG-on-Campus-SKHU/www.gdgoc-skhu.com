import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Modal from '../../components/Modal_Fix';
import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import type {
  GenerationValue,
  Part,
  ProjectGalleryUpsertBody,
  ProjectMemberBase,
  ServiceStatus,
} from '../../types/gallery';
import { useCreateProjectGallery, useUpdateProjectGallery } from '@/lib/projectGallery.api';

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

/** JSON.parse 안전 유틸 (preview query에서 공통으로 재사용 가능) */
function safeParseJson<T>(value: unknown, fallback: T): T {
  const raw = asString(value);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseTeamMembers(value: unknown): RawTeamMember[] {
  const parsed = safeParseJson<unknown>(value, []);
  return Array.isArray(parsed) ? (parsed as RawTeamMember[]) : [];
}

function parseLeader(value: unknown): ProjectMemberBase | null {
  const parsed = safeParseJson<unknown>(value, null);

  if (!parsed || typeof parsed !== 'object') return null;
  const obj = parsed as Partial<ProjectMemberBase>;

  if (typeof obj.userId !== 'number') return null;
  if (typeof obj.name !== 'string') return null;

  return {
    userId: obj.userId,
    name: obj.name,
    school: typeof obj.school === 'string' ? obj.school : '',
    badge: typeof obj.badge === 'string' ? obj.badge : '',
  };
}

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

  const title = asString(query.title);
  const oneLiner = asString(query.oneLiner);
  const description = asString(query.description);

  const mode = asString(query.mode) || 'create'; // 'create' | 'edit'
  const returnTo = asString(query.returnTo) || '/project-gallery/post';

  const projectId = useMemo(() => {
    const n = Number(asString(query.projectId));
    return Number.isFinite(n) ? n : 0;
  }, [query.projectId]);

  const generation = useMemo<GenerationValue>(() => {
    const raw = asString(query.generation);
    return parseGeneration(raw);
  }, [query.generation]);

  const status = query.serviceStatus;

  const teamMembers = useMemo(() => parseTeamMembers(query.teamMembers), [query.teamMembers]);

  const leader = useMemo(() => {
    const leaderFromQuery = parseLeader((router.query as any)?.leader);
    const leaderPartUi = asString((router.query as any)?.leaderPart);

    return {
      name: leaderFromQuery?.name ?? '내 이름',
      role: mapUiPartToEnum(leaderPartUi),
      userId: leaderFromQuery?.userId ?? 0,
    };
  }, [router.query]);

  const members = useMemo(() => {
    return teamMembers.map(m => ({
      name: m.name,
      role: mapUiPartToEnum(m.part?.[0] ?? ''),
      userId: m.userId ?? 0,
    }));
  }, [teamMembers]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<number>(0);

  const createMutation = useCreateProjectGallery();
  const updateMutation = useUpdateProjectGallery();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleBackToForm = () => {
    router.push(returnTo);
  };

  const buildBody = (): ProjectGalleryUpsertBody => {
    const leaderPart = leader.role;
    if (!leaderPart || !leader.userId) {
      throw new Error('팀장 정보가 올바르지 않습니다.');
    }

    // teamMembers는 ProjectPostForm에서 userId 포함해서 넘기고 있으므로,
    // 여기서도 userId가 있어야 서버 payload를 만들 수 있음.
    const memberPayload = teamMembers.map(m => ({
      userId: Number(m.userId),
      part: mapUiPartToEnum(m.part?.[0] ?? '') as Part,
    }));

    return {
      projectName: title.trim(),
      generation,
      shortDescription: oneLiner.trim(),
      serviceStatus: status,
      description: description.trim(),
      leader: { userId: leader.userId, part: leaderPart },
      members: memberPayload,
      // thumbnailUrl: thumbnailUrl ?? null,
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
