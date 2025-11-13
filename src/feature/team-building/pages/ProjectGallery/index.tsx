import { useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import GalleryContent from '../../components/ProjectGallery/GalleryContent';
import { Project } from '../../types/gallery';

const TABS = ['전체', '25-26', '24-25', '이전 기수'] as const;
type Tab = (typeof TABS)[number];

export default function ProjectGalleryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('전체');

  // 데이터 타입 명시화 (추후 api 연결)
  const projects: Project[] = [];

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
        <GalleryContent activeTab={activeTab} projects={projects} />
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
  max-width: 1000px;
`;

const headerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
`;

const titleCss = css`
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;
`;

const actionBtnCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  border-radius: 8px;
  background: #4285f4;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  border: none;
  line-height: 160%;
  cursor: pointer;
  transition:
    transform 0.06s ease-out,
    opacity 0.2s ease;

  &:hover {
    opacity: 0.95;
  }
  &:active {
    transform: translateY(1px);
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
    bottom: -8px;
    width: ${active ? '50px' : '0'};
    height: 3px;
    background: #111111;
    border-radius: 2px;
    transition: width 0.2s ease;
  }
`;
