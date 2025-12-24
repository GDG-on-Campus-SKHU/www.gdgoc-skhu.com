import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import StatusBadge from '../../features/team-building/components/ProjectGallery/StatusBadge';
import { useProjectGalleryList } from '../../lib/projectGallery.api';
import {
  sectionDescCss,
  sectionLayoutCss,
  sectionTitleCss,
  sectionVerticalSpacing,
} from '../../styles/constants';

export default function ProjectSection() {
  const { data: projects = [], isLoading } = useProjectGalleryList();

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const itemsPerPage = isMobile ? 1 : 3;

  const maxPage = Math.max(0, Math.floor((projects.length - 1) / itemsPerPage));

  const prev = () => {
    setDirection(-1);
    setPage(prev => (prev === 0 ? maxPage : prev - 1));
  };

  const next = () => {
    setDirection(1);
    setPage(prev => (prev === maxPage ? 0 : prev + 1));
  };

  const visible = useMemo(
    () => projects.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage),
    [projects, page, itemsPerPage]
  );

  const hasEnoughProjects = projects.length >= 1;

  return (
    <section css={sectionCss}>
      <div css={headerWrapCss}>
        <h2 css={sectionTitleCss}>Project Gallery</h2>
        <p css={sectionDescCss}>GDGoC SKHU 멤버들이 실현한 아이디어에요.</p>
      </div>

      {!isLoading && !hasEnoughProjects && (
        <div css={emptyNoticeCss}>아직 프로젝트가 충분하지 않습니다. 프로젝트를 등록해보세요.</div>
      )}

      <div css={carouselWrapCss}>
        <div css={arrowSideCss}>
          <button onClick={prev} css={leftArrowCss} disabled={projects.length <= itemsPerPage}>
            <img src="/leftarrow.svg" alt="prev" css={leftArrowIconCss} />
          </button>
        </div>

        <div css={viewportCss}>
          <motion.div
            key={page}
            initial={{ x: direction * 80, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 26,
              mass: 0.8,
            }}
            css={cardRowCss}
          >
            {visible.map(item => (
              <Link key={item.id} href={`/project-gallery/${item.id}`} css={linkResetCss}>
                <div css={cardCss}>
                  <div css={thumbFrameCss}>
                    <img
                      src={item.thumbnailUrl?.trim() ? item.thumbnailUrl : '/gdgoc_logo.svg'}
                      alt={item.title}
                      css={logoCss}
                    />
                  </div>

                  <div css={metaCss}>
                    <h3 css={titleItemCss}>{item.title}</h3>
                    <p css={descItemCss}>{item.description}</p>
                    <div css={badgeRowCss}>
                      {item.status && <StatusBadge status={item.status} />}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        <div css={arrowSideCss}>
          <button onClick={next} css={rightArrowCss} disabled={projects.length <= itemsPerPage}>
            <img src="/rightarrow.svg" alt="next" css={rightArrowIconCss} />
          </button>
        </div>
      </div>

      <div css={mobileArrowRowCss}>
        <button onClick={prev} css={mobileArrowCss}>
          ‹
        </button>
        <button onClick={next} css={mobileArrowCss}>
          ›
        </button>
      </div>

      <Link href="/project-gallery" css={moreBtnCss}>
        더 많은 프로젝트 보러가기
      </Link>
    </section>
  );
}

/* ---------- styles ---------- */

const linkResetCss = css`
  text-decoration: none;
  color: inherit;
`;

const sectionCss = css`
  ${sectionLayoutCss};
  margin-top: ${sectionVerticalSpacing.large};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const headerWrapCss = css`
  width: 100%;
  margin-bottom: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const emptyNoticeCss = css`
  width: 100%;
  margin-bottom: 24px;
  font-size: 14px;
  color: #9aa0a6;
`;

const carouselWrapCss = css`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const viewportCss = css`
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const cardRowCss = css`
  display: grid;
  grid-template-columns: repeat(3, 312px);
  gap: 40px;
  justify-content: center;

  @media (max-width: 479px) {
    grid-template-columns: 312px;
  }
`;

const cardCss = css`
  width: 312px;
  min-width: 312px;
  max-width: 312px;
`;

const thumbFrameCss = css`
  height: 245px;
  border-radius: 12px;
  border: 1px solid var(--grayscale-900, #25282c);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const logoCss = css`
  width: 220px;
  height: 220px;
  object-fit: contain;
  display: block;
`;

const metaCss = css`
  margin-top: 20px;
  max-width: 100%;
  overflow: hidden;
`;

const titleItemCss = css`
  font-size: 24px;
  font-weight: 600;
  line-height: 140%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const descItemCss = css`
  margin-top: 5px;
  font-size: 16px;
  font-weight: 400;
  color: #979ca5;
  line-height: 150%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const badgeRowCss = css`
  margin-top: 14px;
  min-height: 28px;
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
`;

const arrowBaseCss = css`
  position: absolute;
  top: 100px;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 2px solid #d9d9d9;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const arrowSideCss = css`
  @media (max-width: 479px) {
    display: none;
  }
`;

const mobileArrowRowCss = css`
  display: none;
  margin-top: 24px;
  gap: 16px;

  @media (max-width: 479px) {
    display: flex;
    justify-content: center;
  }
`;

const mobileArrowCss = css`
  width: 44px;
  height: 44px;
  border-radius: 15%;
  border: 1px solid #d9d9d9;
  background: #ffffff;
  font-size: 20px;
  cursor: pointer;
`;

const leftArrowIconCss = css`
  width: 20px;
  height: 20px;
  display: block;
  transform: translateX(-1px);
`;

const rightArrowIconCss = css`
  width: 20px;
  height: 20px;
  display: block;
  transform: translateX(1px);
`;

const leftArrowCss = css`
  ${arrowBaseCss};
  left: 0;
  transform: translateX(-80px);

  &:hover:not(:disabled) {
    background: #f1f3f4;
    border-color: #bdbdbd;
  }

  &:active:not(:disabled) {
    background: #e8eaed;
  }
`;

const rightArrowCss = css`
  ${arrowBaseCss};
  right: 0;
  transform: translateX(80px);

  &:hover:not(:disabled) {
    background: #f1f3f4;
    border-color: #bdbdbd;
  }

  &:active:not(:disabled) {
    background: #e8eaed;
  }
`;

const moreBtnCss = css`
  margin-top: 72px;
  padding: 18px 40px;
  border-radius: 12px;
  background: #4285f4;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    background: #2171f2;
  }
`;
