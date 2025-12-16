import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import Modal from '../../components/Modal_Fix';
import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import type { GenerationValue, Part, ProjectMemberBase, ServiceStatus } from '../../types/gallery';

type PreviewQuery = {
  title?: string | string[];
  oneLiner?: string | string[];
  description?: string | string[];
  leaderPart?: string | string[];
  generation?: string | string[];
  serviceStatus: ServiceStatus;
  teamMembers?: string | string[];

  leader?: string | string[];
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
    };
  }, [router.query]);

  const members = useMemo(() => {
    return teamMembers.map(m => ({
      name: m.name,
      role: mapUiPartToEnum(m.part?.[0] ?? ''),
    }));
  }, [teamMembers]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBackToForm = () => {
    router.push({
      pathname: '/project-gallery/post',
      query,
    });
  };

  // 프로젝트 전시하기 버튼 클릭
  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
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
          confirmText="예"
          cancelText="아니오"
          onClose={() => setShowConfirmModal(false)}
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
          onClose={() => setShowSuccessModal(false)}
          customTitleAlign="center"
        />
      )}
    </>
  );
}
