import { useState } from 'react';
import { useRouter } from 'next/router';

import Modal from '../../components/Modal_Fix';
import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import type { ProjectStatus } from '../../types/gallery';

type PreviewQuery = {
  title?: string | string[];
  oneLiner?: string | string[];
  description?: string | string[];
  leaderPart?: string | string[];
  generation?: string | string[];
  serviceStatus?: 'RUNNING' | 'PAUSED' | string | string[];
  teamMembers?: string | string[];
};

// string 변환 함수 (타입 안전성)
const asString = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] : (value ?? '');

type RawTeamMember = {
  name: string;
  part?: string[];
};

const parseTeamMembers = (value: string | string[] | undefined): RawTeamMember[] => {
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function ProjectPreviewPage() {
  const router = useRouter();
  const query = router.query as PreviewQuery;

  const title = asString(query.title);
  const oneLiner = asString(query.oneLiner);
  const description = asString(query.description);
  const generation = asString(query.generation);

  const rawStatus = asString(query.serviceStatus);
  const status: ProjectStatus | undefined = rawStatus === 'RUNNING' ? 'service' : undefined;

  const teamMembers = parseTeamMembers(query.teamMembers);

  const leader = {
    name: '주현지',
    role: asString(query.leaderPart),
  };

  const members = teamMembers.map(m => ({
    name: m.name,
    role: m.part?.[0] ?? '',
  }));

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
