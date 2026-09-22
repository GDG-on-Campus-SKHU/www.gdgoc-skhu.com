import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import {
  defaultFadeInUpVariants,
  defaultFadeInVariants,
  staggerFourFive,
} from '../../constants/motions';
import {
  colors,
  glassButtonCss,
  sectionLayoutCss,
  sectionTitleCss,
  sectionVerticalSpacing,
} from '../../styles/constants';

const FRONTEND_RECRUIT_LINK =
  'https://butternut-yam-936.notion.site/GDG-on-Campus-SKHU-Frontend-Part-Recruiting-3c2f2706730e80cab65bff33f558da96';
const BACKEND_RECRUIT_LINK =
  'https://butternut-yam-936.notion.site/GDG-on-Campus-SKHU-Backend-Part-Recruiting-3bdf2706730e80c7bbc8fce9bc5fce70';
const PM_RECRUIT_LINK =
  'https://butternut-yam-936.notion.site/GDG-on-Campus-SKHU-PM-Part-Recruiting-3c2f2706730e801b8d5dde7c2c7d11e9';
const DESIGN_RECRUIT_LINK =
  'https://butternut-yam-936.notion.site/GDG-on-Campus-SKHU-Design-Part-Recruiting-3c2f2706730e8019a0a8de770ceed7cd';

export default function RecruitSection() {
  return (
    <motion.section
      variants={staggerFourFive}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.6 }}
      css={sectionCss}
    >
      <div css={headerWrapCss}>
        <motion.h2 variants={defaultFadeInVariants} css={sectionTitleCss}>
          Recruit
        </motion.h2>
        <motion.p variants={defaultFadeInVariants} css={descCss}>
          GDGoC SKHU에 지원하고, 기회를 얻어보세요.
        </motion.p>
      </div>

      <div css={buttonWrapCss}>
        <RecruitAnchor href={FRONTEND_RECRUIT_LINK} text="🌎 Frontend 파트 멤버 지원하기" disable />
        <RecruitAnchor href={BACKEND_RECRUIT_LINK} text="🔧 Backend 파트 멤버 지원하기" disable />
        <RecruitAnchor href={PM_RECRUIT_LINK} text="🧭 PM 파트 멤버 지원하기" disable />
        <RecruitAnchor href={DESIGN_RECRUIT_LINK} text="🎨 Design 파트 멤버 지원하기" disable />
      </div>
    </motion.section>
  );
}

interface RecruitAnchorProps {
  href: string;
  text: string;
  disable?: boolean;
}

function RecruitAnchor({ href, text, disable = false }: RecruitAnchorProps) {
  if (disable) {
    return (
      <motion.button
        variants={defaultFadeInUpVariants}
        onClick={() => {
          alert('현재 기수 모집은 마감되었습니다. 다음 기수 모집을 기다려주세요!');
        }}
        css={disableBtnCss}
      >
        {text}
      </motion.button>
    );
  }

  return (
    <motion.a
      variants={defaultFadeInUpVariants}
      href={href}
      target="_blank"
      rel="noreferrer"
      css={buttonCss}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      {text}
    </motion.a>
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
  margin-bottom: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const descCss = css`
  font-size: 1.7rem;
  font-weight: 400;
  color: #9aa0a6;
`;

const buttonWrapCss = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const buttonCss = css`
  ${glassButtonCss};
  font-size: 1.5rem;
  font-weight: bold;
  width: 32rem;
  max-width: 100%;
  height: 5rem;
`;

const disableBtnCss = css`
  ${glassButtonCss};
  font-size: 1.5rem;
  font-weight: bold;
  width: 32rem;
  max-width: 100%;
  height: 5rem;
  color: ${colors.gray100};
  background-color: rgba(255, 255, 255, 0.2);
`;
