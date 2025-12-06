import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import {
    defaultFadeInUpVariants,
    defaultFadeInVariants,
    staggerOne,
} from '../../constants/motions';
import {
    colors,
    glassCardCss,
    mediaQuery,
    sectionLayoutCss,
    sectionVerticalSpacing,
    sectionTitleCss,
} from '../../styles/constants';

const GDGOC_NETWORKING_SESSION_LINK = 'https://www.instagram.com/gdgoc.skhu/';

export default function PartSection() {
    return (
        <motion.section
            variants={staggerOne}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.6 }}
            css={sectionCss}
        >
            <div css={headerWrapCss}>
                <motion.h2 variants={defaultFadeInVariants} css={sectionTitleCss}>
                    Experience
                </motion.h2>
                <motion.p variants={defaultFadeInVariants} css={descCss}>
                    GDGoC SKHU에 오면 경험할 수 있는 것들이에요
                </motion.p>
            </div>

            <motion.div variants={staggerOne} css={rowCss}>
                <motion.article css={articleCss({})} variants={defaultFadeInUpVariants}>
                    <h3>스터디 활동</h3>
                    <p>
                        Web, Mobile, Server, PM(기획), DESIGN(디자인) 과정으로 나누어, 입문자를 기준으로
                        설계한 커리큘럼을 통해 파트별 스터디를 진행합니다.
                        <br />
                        <br />
                        빠르게 성장하고 싶은 열정과, 배우고자 하는 의지만 있다면 누구나 좋은 개발자,
                        기획자, 디자이너로서의 첫 걸음을 내딛을 수 있도록 돕습니다.
                    </p>
                </motion.article>

                <motion.article css={articleCss({})} variants={defaultFadeInUpVariants}>
                    <h3>프로젝트 활동</h3>
                    <p>
                        3개월간의 스터디 세션을 통해 탄탄히 다져진 기본기를 바탕으로 다른 파트의 멤버들과
                        함께 협업하여, 세상에 기여할 수 있는 서비스를 개발할 수 있습니다.
                        <br />
                        <br />
                        아이디어 회의, 도메인 설계와 개발, 클라우드를 이용한 서비스 배포까지,
                        전반적인 개발 프로세스를 경험할 수 있습니다.
                    </p>
                </motion.article>

                <motion.article css={articleCss({})} variants={defaultFadeInUpVariants}>
                    <h3>친목 활동</h3>
                    <p>
                        GDGoC는 개발에 있어 협력과 소통을 가장 중요하게 생각합니다.
                        <br />
                        <br />
                        MT, AIOS, 종강 파티, 회식 등 다양한 활동을 통해 더 넓은 인간 관계를
                        만들 수 있도록 계획하고 있습니다.
                    </p>
                </motion.article>
            </motion.div>

            <motion.div variants={staggerOne} css={bottomRowCss}>
                <motion.article css={articleCss({ width: '100%' })} variants={defaultFadeInUpVariants}>
                    <h3>연합 활동</h3>
                    <p>
                        GDGoC와 함께 진행할
                        <a href={GDGOC_NETWORKING_SESSION_LINK} target="_blank" rel="noreferrer">
                            &nbsp;다양한 연합 활동 경험
                        </a>
                        을 통해, 리더십과 개발 역량 그리고 협업 능력을 키울 수 있습니다.
                        <br />
                        연합 활동은 타 대학 또는 우리 대학 내의 다른 동아리와 연합하여 아이디어톤,
                        해커톤, 프로젝트 등 공동의 목표를 기반으로 문제를 해결하는 활동입니다.
                    </p>
                </motion.article>
            </motion.div>
        </motion.section>
    );
}

const sectionCss = css`
    ${sectionLayoutCss};
    margin-top: ${sectionVerticalSpacing.large};
    margin-bottom: ${sectionVerticalSpacing.large};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const headerWrapCss = css`
    width: 100%;
    margin-bottom: 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const descCss = css`
    font-size: 1.7rem;
    font-weight: 400;
    color: #9aa0a6;
`;

const rowCss = css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 32px;

    ${mediaQuery('xs')} {
        flex-direction: column;
    }
`;

const bottomRowCss = css`
    width: 100%;
    margin-top: 32px;
`;

const articleCss = ({ width = '32%' }: { width?: string }) => css`
    ${glassCardCss};
    width: ${width};
    padding: 24px 22px;
    border-radius: 12px;

    & > h3 {
        font-size: 1.4rem;
        margin-bottom: 12px;
    }

    & > p {
        color: ${colors.gray500};
        font-size: 1rem;
        line-height: 150%;
    }

    & a {
        color: ${colors.gdscBlue};
    }

    ${mediaQuery('xs')} {
        width: 100%;
    }
`;
