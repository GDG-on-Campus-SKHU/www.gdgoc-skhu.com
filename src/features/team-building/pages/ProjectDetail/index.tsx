// * ui 확인을 위해 일단 본인이 팀장이라 가정
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import { useProjectGalleryDetail } from '../../../../lib/projectGallery.api';

export default function ProjectDetailPage() {
  const router = useRouter();
  const rawId = router.query.id;

  const projectId = useMemo(() => {
    if (typeof rawId !== 'string') return null;
    const n = Number(rawId);
    return Number.isFinite(n) ? n : null;
  }, [rawId]);

  const { data, isLoading, isError } = useProjectGalleryDetail(projectId ?? 0, {
    enabled: projectId !== null,
  });

  if (!router.isReady) return null;
  if (projectId === null) return null;

  if (isLoading) return null; // 원하면 로딩 UI
  if (isError || !data) return null; // 원하면 에러 UI

  // meta 컴포넌트가 기대하는 형태로 가공
  const leaderMember = data.members.find(m => m.memberRole === 'LEADER');
  const leader = leaderMember
    ? { name: leaderMember.name, role: leaderMember.part }
    : { name: '-', role: undefined };

  const members = data.members
    .filter(m => m.memberRole === 'MEMBER')
    .map(m => ({ name: m.name, role: m.part }));

  const handleClickEdit = () => {
    router.push(`/project-gallery/${projectId}/edit`);
  };

  return (
    <ProjectDetailView
      title={data.title}
      description={data.shortDescription}
      longDescription={data.longDescription}
      status={data.status}
      generation={data.generation}
      leader={leader}
      members={members}
      canEdit
      onClickEdit={handleClickEdit}
    />
  );
}
