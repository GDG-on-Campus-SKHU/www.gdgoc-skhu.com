import { css } from '@emotion/react';

import type { Project } from '../../types/gallery';
import ProjectCard from './ProjectCard';

type Props = { items: Project[] };

export default function ProjectGrid({ items }: Props) {
  return (
    <div css={gridCss}>
      {items.map(p => (
        <ProjectCard key={p.id} item={p} />
      ))}
    </div>
  );
}

const gridCss = css`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;

  // 카드 그리드 반응형 설정
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
