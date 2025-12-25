import type { MyPageProject } from '@/lib/mypageProject.api';
import { css } from '@emotion/react';

import { MOCK_PROJECTS } from '../../types/myproject';
import MyProjectCard from './MyProjectCard';

export default function ProjectGrid() {
  const projects: MyPageProject[] = MOCK_PROJECTS.map((p, index) => ({
    projectId: index + 1,
    thumbnailUrl: p.thumbnailUrl,
    projectName: p.title,
    exhibited: true,
    description: p.description,
    isLeader: true,
    leader: {
      userId: 1,
      name: '윤준석',
      part: 'BACKEND',
    },
    members: [
      {
        userId: 2,
        name: '권지후',
        part: 'PM',
      },
      {
        userId: 3,
        name: '최인석',
        part: 'AI/ML',
      },
    ],
  }));

  return (
    <div css={gridCss}>
      {projects.map(p => (
        <MyProjectCard key={p.projectId} item={p} />
      ))}
    </div>
  );
}

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
