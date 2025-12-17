// * ui 확인을 위해 일단 본인이 팀장이라 가정
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useProjectGalleryDetail } from '../../../../lib/projectGallery.api';
import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import { useMyProfile } from '@/lib/mypageProfile.api';

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

  const { data: myProfile } = useMyProfile({
    enabled: true, // 로그인 되어있지 않으면 여기서 에러/undefined 가능
  });

  if (!router.isReady) return null;
  if (projectId === null) return null;

  if (isLoading) return null; // 원하면 로딩 UI
  if (isError || !data) return null; // 원하면 에러 UI

  const leaderUserId = data.leader?.userId;
  const myUserId = myProfile?.userId;

  const canEdit = Boolean(myUserId && leaderUserId && myUserId === leaderUserId);

  // meta 컴포넌트가 기대하는 형태로 가공
  const leader = data.leader
    ? { name: data.leader.name, role: data.leader.part }
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
      canEdit={canEdit}
      onClickEdit={handleClickEdit}
    />
  );
}
