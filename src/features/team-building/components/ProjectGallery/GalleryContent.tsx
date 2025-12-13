import { useMemo, useState } from 'react';
import { css } from '@emotion/react';

import type { GenerationTab, GenerationValue, ProjectGalleryListItem } from '../../types/gallery';
import GalleryEmpty from './GalleryEmpty';
import ProjectGrid from './ProjectGrid';

type Props = {
  activeTab: GenerationTab;
  projects: ProjectGalleryListItem[];
  isLoading?: boolean;
  isError?: boolean;
};

export default function GalleryContent({ activeTab, projects, isLoading, isError }: Props) {
  const filtered = useMemo(() => {
    if (activeTab === '전체') return projects;

    if (activeTab === '이전 기수') {
      const oldGens: GenerationValue[] = ['22-23', '23-24'];
      return projects.filter(p => oldGens.includes(p.generation));
    }

    // '25-26', '24-25'
    return projects.filter(p => p.generation === activeTab);
  }, [activeTab, projects]);

  if (isLoading) {
    return (
      <section css={wrapCss}>
        <p>프로젝트를 불러오는 중입니다...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section css={wrapCss}>
        <p>프로젝트 목록을 불러오는 중 오류가 발생했습니다.</p>
      </section>
    );
  }

  if (filtered.length === 0) {
    return (
      <section css={wrapCss}>
        <GalleryEmpty />
      </section>
    );
  }

  return (
    <section css={wrapCss}>
      <ProjectGrid items={filtered} />
    </section>
  );
}

const wrapCss = css`
  width: 100%;
`;

const toolbarCss = css`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

const btnCss = (active: boolean) => css`
  border: 1px solid ${active ? '#111' : '#e5e7eb'};
  background: ${active ? '#111' : '#fff'};
  color: ${active ? '#fff' : '#111'};
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    border-color: #111;
  }
`;
