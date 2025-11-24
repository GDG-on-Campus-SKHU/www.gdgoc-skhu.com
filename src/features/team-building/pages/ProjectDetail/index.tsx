// * ui 확인을 위해 일단 본인이 팀장이라 가정
import { useMemo } from 'react';
import { useRouter } from 'next/router';

import ProjectDetailView from '../../components/ProjectDetail/ProjectDetailView';
import { getMockProjectDetailById } from '../../types/gallery';

export default function ProjectDetailPage() {
  const router = useRouter();
  const rawId = router.query.id;

  const id = typeof rawId === 'string' ? rawId : undefined;

  const data = useMemo(() => (id ? getMockProjectDetailById(id) : null), [id]);

  if (!data) return null;

  const handleClickEdit = () => {
    router.push(`/project-gallery/${id}/edit`);
  };

  return (
    <ProjectDetailView
      title={data.title}
      description={data.description}
      longDescription={data.longDescription}
      status={data.status}
      generation={data.generation}
      leader={data.leader}
      members={data.members}
      canEdit
      onClickEdit={handleClickEdit}
    />
  );
}
