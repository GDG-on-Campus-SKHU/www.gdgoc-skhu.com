import { useMemo, useState } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import type { Project } from '../../features/team-building/types/gallery';
import { MOCK_PROJECTS } from '../../features/team-building/types/gallery';
import StatusBadge from '../../features/team-building/components/ProjectGallery/StatusBadge';
import {
    sectionLayoutCss,
    sectionVerticalSpacing,
    sectionTitleCss,
    sectionDescCss,
} from '../../styles/constants';

export default function ProjectSection() {
    const projects = useMemo<Project[]>(() => {
        if (MOCK_PROJECTS.length >= 6) return MOCK_PROJECTS.slice(0, 6);

        const filled = [...MOCK_PROJECTS];

        while (filled.length < 6) {
            const num = filled.length + 1;
            filled.push({
                id: `dummy-${num}`,
                title: `프로젝트 ${num}`,
                description: '프로젝트 한줄소개',
                thumbnailUrl: '/images/project-dummy.png',
                status: 'service',
                generation: '25-26'
            });
        }

        return filled;
    }, []);

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);

    const maxPage = Math.floor((projects.length - 1) / 3);

    const prev = () => {
        setDirection(-1);
        setPage(prev => (prev === 0 ? maxPage : prev - 1));
    };

    const next = () => {
        setDirection(1);
        setPage(prev => (prev === maxPage ? 0 : prev + 1));
    };

    const visible = projects.slice(page * 3, page * 3 + 3);

    const hasRealProject = MOCK_PROJECTS.length >= 3;

    return (
        <section css={sectionCss}>
            <div css={headerWrapCss}>
                <h2 css={sectionTitleCss}>Project Gallery</h2>
                <p css={sectionDescCss}>GDGoC SKHU 멤버들이 실현한 아이디어에요.</p>
            </div>

            {!hasRealProject && (
                <div css={emptyNoticeCss}>
                    아직 프로젝트가 충분하지 않습니다. 프로젝트를 등록해보세요.
                </div>
            )}

            <div css={carouselWrapCss}>
                <button onClick={prev} css={leftArrowCss}>‹</button>

                <div css={viewportCss}>
                    <motion.div
                        key={page}
                        initial={{ x: direction * 80, opacity: 0, scale: 0.98 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 220,
                            damping: 26,
                            mass: 0.8
                        }}
                        css={cardRowCss}
                    >
                        {visible.map((item, idx) => (
                            <Link key={item.id} href={`/project-gallery/${item.id}`} css={linkResetCss}>
                                <div css={cardCss}>
                                    <div css={thumbFrameCss}>
                                        <img src={item.thumbnailUrl} alt={item.title} css={logoCss} />
                                    </div>

                                    <div css={metaCss}>
                                        <h3 css={titleItemCss}>
                                            {item.title || `프로젝트 ${page * 3 + idx + 1}`}
                                        </h3>
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

                <button onClick={next} css={rightArrowCss}>›</button>
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
`;

const headerWrapCss = css`
    width: 100%;
    margin-bottom: 70px;
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
    align-items: flex-start;
`;

const viewportCss = css`
    overflow: hidden;
    width: 100%;
`;

const cardRowCss = css`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
`;

const cardCss = css`
    width: 100%;
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
    width: 200px;
    height: 200px;
    object-fit: contain;
    display: block;
`;

const metaCss = css`
    margin-top: 15px;
`;

const titleItemCss = css`
    font-size: 18px;
    font-weight: 700;
    color: #111111;
    line-height: 160%;
`;

const descItemCss = css`
    font-size: 14px;
    color: #979ca5;
    line-height: 160%;
`;

const badgeRowCss = css`
    margin-top: 5px;
    min-height: 28px;
    display: flex;
    align-items: center;
`;

const arrowBaseCss = css`
    position: absolute;
    top: 100px;
    width: 44px;
    height: 44px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const leftArrowCss = css`
    ${arrowBaseCss};
    left: 0;
    transform: translateX(-64px);
`;

const rightArrowCss = css`
    ${arrowBaseCss};
    right: 0;
    transform: translateX(64px);
`;

const moreBtnCss = css`
    margin-top: 48px;
    padding: 16px 32px;
    border-radius: 8px;
    background: #4285f4;
    color: #ffffff;
    font-size: 15px;
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;
