import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import type { GenerationTab, Project } from '../../types/gallery';
import { MOCK_PROJECTS } from '../../types/gallery';
import GalleryEmpty from './GalleryEmpty';
import ProjectGrid from './ProjectGrid';

type Props = { activeTab: GenerationTab; projects: Project[] };

// 개발 모드
const isDev = process.env.NODE_ENV !== 'production';

export default function GalleryContent({ activeTab, projects }: Props) {
  const [previewHas, setPreviewHas] = useState<boolean | null>(null);

  const filteredReal = useMemo(() => {
    if (activeTab === '전체') return projects;
    return projects.filter(p => p.generation === activeTab);
  }, [activeTab, projects]);

  const items = useMemo(() => {
    if (!isDev || previewHas === null) return filteredReal;
    if (previewHas === false) return [];
    if (activeTab === '전체') return MOCK_PROJECTS;
    return MOCK_PROJECTS.filter(p => p.generation === activeTab);
  }, [filteredReal, previewHas, activeTab]);

  return (
    <section css={wrapCss}>
      {/* 프로젝트 있을 경우 & 없을 경우 버튼 (ui 확인용) */}
      {isDev && (
        <div css={toolbarCss}>
          <button css={btnCss(previewHas === false)} onClick={() => setPreviewHas(false)}>
            없음
          </button>
          <button css={btnCss(previewHas === true)} onClick={() => setPreviewHas(true)}>
            있음
          </button>
        </div>
      )}

      {items.length === 0 ? <GalleryEmpty /> : <ProjectGrid items={items} />}
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
