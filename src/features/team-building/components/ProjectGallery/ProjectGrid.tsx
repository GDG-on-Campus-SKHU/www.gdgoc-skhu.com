import { css } from '@emotion/react';

import ProjectCard from './ProjectCard';
import { ProjectGalleryListItem } from '../../types/gallery';

type Props = { items: ProjectGalleryListItem[] };

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
  margin-top: 100px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 30px;

  // 반응형에 따른 카드 정렬
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
