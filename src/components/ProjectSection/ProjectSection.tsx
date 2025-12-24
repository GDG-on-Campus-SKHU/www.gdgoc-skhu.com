import { useMemo, useState } from 'react';
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

  const itemsPerPage = 3;
  const maxPage = Math.max(0, Math.floor((projects.length - 1) / itemsPerPage));

  const prev = () => {
    setDirection(-1);
    setPage(p => (p === 0 ? maxPage : p - 1));
  };

  const next = () => {
    setDirection(1);
    setPage(p => (p === maxPage ? 0 : p + 1));
  };

  const visible = useMemo(
    () => projects.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage),
    [projects, page]
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
        <button onClick={prev} css={pcLeftArrowCss} disabled={projects.length <= itemsPerPage}>
          <img src="/leftarrow.svg" alt="prev" css={iconCss} />
        </button>

        <div css={viewportCss}>
          <motion.div
            key={page}
            initial={{ x: direction * 80, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.8 }}
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

        <button onClick={next} css={pcRightArrowCss} disabled={projects.length <= itemsPerPage}>
          <img src="/rightarrow.svg" alt="next" css={iconCss} />
        </button>
      </div>

      <div css={bottomArrowRowCss}>
        <button onClick={prev} css={arrowCss} disabled={projects.length <= itemsPerPage}>
          <img src="/leftarrow.svg" alt="prev" css={iconCss} />
        </button>
        <button onClick={next} css={arrowCss} disabled={projects.length <= itemsPerPage}>
          <img src="/rightarrow.svg" alt="next" css={iconCss} />
        </button>
      </div>

      <Link href="/project-gallery" css={moreBtnCss}>
        더 많은 프로젝트 보러가기
      </Link>
    </section>
  );
}

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
  overflow: visible;
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
`;

const viewportCss = css`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const cardRowCss = css`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(3, 312px);
  justify-content: center;

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 312px);
  }

  @media (max-width: 479px) {
    grid-template-columns: 312px;
  }
`;

const cardCss = css`
  width: 312px;
  border-radius: 12px;
`;

const thumbFrameCss = css`
  height: 245px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 10px 10px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
`;

const logoCss = css`
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
`;

const metaCss = css`
  margin-top: 20px;
  overflow: hidden;
`;

const titleItemCss = css`
  font-size: 24px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const descItemCss = css`
  margin-top: 5px;
  font-size: 16px;
  color: #979ca5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const badgeRowCss = css`
  margin-top: 14px;
  min-height: 28px;
  display: flex;
  align-items: center;
`;

const arrowCss = css`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 2px solid #d9d9d9;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const iconCss = css`
  width: 20px;
  height: 20px;
`;

const pcLeftArrowCss = css`
  ${arrowCss};
  position: absolute;
  left: 0;
  top: 120px;
  transform: translateX(-80px);

  @media (max-width: 1023px) {
    display: none;
  }
`;

const pcRightArrowCss = css`
  ${arrowCss};
  position: absolute;
  right: 0;
  top: 120px;
  transform: translateX(80px);

  @media (max-width: 1023px) {
    display: none;
  }
`;

const bottomArrowRowCss = css`
  margin-top: 24px;
  display: none;
  gap: 16px;
  justify-content: center;

  @media (max-width: 1023px) {
    display: flex;
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

  @media (max-width: 479px) {
    display: none;
  }
`;
