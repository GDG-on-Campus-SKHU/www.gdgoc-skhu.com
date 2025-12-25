import { useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import { useProjectGalleryList } from '../../../../lib/projectGallery.api';
import { colors } from '../../../../styles/constants';
import GalleryContent from '../../components/ProjectGallery/GalleryContent';
import { GenerationTab } from '../../types/gallery';

const TABS: GenerationTab[] = ['전체', '25-26', '24-25', '이전 기수'];

export default function ProjectGalleryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GenerationTab>('전체');

  const { data: projects = [], isLoading, isError } = useProjectGalleryList(activeTab);

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 헤더: 제목 + 우측 버튼 */}
        <div css={headerCss}>
          <h1 css={titleCss}>Project Gallery</h1>
          <button
            type="button"
            css={actionBtnCss}
            onClick={() => {
              router.push('/project-gallery/post');
            }}
          >
            갤러리 전시하기
          </button>
        </div>

        {/* 탭 */}
        <div css={tabsWrapCss}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <button key={tab} css={tabBtnCss(active)} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            );
          })}
        </div>

        {/* 컨텐츠 영역 */}
        <GalleryContent
          activeTab={activeTab}
          projects={projects}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  color: #1f1f1f;
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
`;

const titleCss = css`
  font-size: 36px;
  font-weight: 700;
  line-height: 160%;
`;

const actionBtnCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 42px;
  border-radius: 8px;
  background: ${colors.primary[600]};
  color: ${colors.white};
  font-size: 18px;
  font-weight: 500;
  border: none;
  line-height: 28.8px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background-color: ${colors.primary[700]};
  }
`;

const tabsWrapCss = css`
  margin: 60px 0;
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const tabBtnCss = (active: boolean) => css`
  position: relative;
  background: transparent;
  border: none;
  padding: 8px 0;
  cursor: pointer;

  font-size: 20px;
  font-weight: 700;
  line-height: 160%;
  color: ${active ? '#111111' : '#9aa0a6'};

  &:after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -5px;
    width: ${active ? '60px' : '0'};
    height: 3px;
    background: #111111;
    transition: width 0.2s ease;
  }
`;
