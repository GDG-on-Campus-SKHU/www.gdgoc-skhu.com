import { css } from '@emotion/react';

import { MOCK_PROJECTS } from '../../types/myproject';
import MyProjectCard from './MyProjectCard';

export default function ProjectGrid() {
  const projects = MOCK_PROJECTS;
  return (
    <div css={gridCss}>
      {projects.map(p => (
        <MyProjectCard key={p.id} item={p} />
      ))}
    </div>
  );
}

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  // 카드 그리드 반응형 설정
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
