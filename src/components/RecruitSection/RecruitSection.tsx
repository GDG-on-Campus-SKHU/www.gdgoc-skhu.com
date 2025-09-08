import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import {
  defaultFadeInUpVariants,
  defaultFadeInVariants,
  staggerFourFive,
} from '../../constants/motions';
import { bigCss, colors, glassButtonCss } from '../../styles/constants';

const WEB_RECRUIT_LINK =
  'https://noble-animal-f7e.notion.site/GDG-on-Campus-SKHU-FE-WEB-Part-Recruiting-226dacc0346380a19e7cfeb0e509dabc';
const MOBILE_RECRUIT_LINK =
  'https://noble-animal-f7e.notion.site/GDG-on-Campus-SKHU-FE-Mobile-Part-Recruiting-226dacc0346380f78ebaeb0fc0506ad9';
const SERVER_RECRUIT_LINK =
  'https://noble-animal-f7e.notion.site/GDG-on-Campus-SKHU-Server-Part-Recruiting-226dacc034638014912ce71d847affa6';
const PM_RECRUIT_LINK =
  'https://noble-animal-f7e.notion.site/GDG-on-Campus-SKHU-PM-Part-Recruiting-219dacc034638066805fe3267af2c967';
const DESIGN_RECRUIT_LINK =
  'https://noble-animal-f7e.notion.site/GDG-on-Campus-SKHU-Design-Part-Recruiting-226dacc0346380da84a3da41f713d46a';
const CORE_RECRUIT_LINK = 'https://forms.gle/2opc6KwXUrLUQy2A9';

export default function RecruitSection() {
  return (
    <section>
      <motion.div
        variants={staggerFourFive}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.6 }}
        css={css`
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 95vh;
        `}
      >
        <motion.h2
          variants={defaultFadeInVariants}
          css={css`
            ${bigCss}
            text-align: center;
            margin-bottom: 120px;
          `}
        >
          성공회대 GDGoC와
          <br />
          함께하고 싶다면
          <br />
        </motion.h2>
        {/* <RecruitAnchor href={CORE_RECRUIT_LINK} text="✨ 25-26 Core 멤버 지원하기" /> */}
        <RecruitAnchor href={PM_RECRUIT_LINK} text="🧭 PM 파트 멤버 지원하기" disable />
        <RecruitAnchor href={DESIGN_RECRUIT_LINK} text="🎨 Design 파트 멤버 지원하기" disable />
        <RecruitAnchor href={WEB_RECRUIT_LINK} text="🌎 Web 파트 멤버 지원하기" disable />
        <RecruitAnchor href={MOBILE_RECRUIT_LINK} text="📱 Mobile 파트 멤버 지원하기" disable />
        <RecruitAnchor href={SERVER_RECRUIT_LINK} text="🔧 Server 파트 멤버 지원하기" disable />
      </motion.div>
    </section>
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
        css={css`
          ${glassButtonCss}
          font-size: 1.5rem;
          font-weight: bold;
          width: 32rem;
          max-width: 100%;
          height: 5rem;

          margin-bottom: 14px;

          color: ${colors.gray100};
          background-color: rgba(255, 255, 255, 0.2);
        `}
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
      css={css`
        ${glassButtonCss}

        font-size: 1.5rem;
        font-weight: bold;
        width: 32rem;
        max-width: 100%;
        height: 5rem;

        margin-bottom: 14px;
      `}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      {text}
    </motion.a>
  );
}
