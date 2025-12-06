import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import SEO from '../components/common/SEO';
import IntroduceSection from '../components/IntroduceSection';
import PartSection from '../components/PartSection/PartSection';
import ProjectSection from '../components/ProjectSection';
import RecruitSection from '../components/RecruitSection';
import { defaultFadeInVariants } from '../constants/motions';
import { layoutCss } from '../styles/constants/layout';

export default function Root() {
  return (
    <>
      <SEO title="GDGoC SKHU" />

      <motion.main
        variants={defaultFadeInVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        css={css`
          margin-top: 100vh;
          background-color: rgba(255, 255, 255, 0.5);
          width: 100%;
          backdrop-filter: blur(20px);
          box-shadow: 0px -4px 20px 6px rgba(104, 112, 118, 0.08);
        `}
      >
        <div
          css={css`
            ${layoutCss}
            padding-top: 64px;
            padding-bottom: 64px;
          `}
        >
          <IntroduceSection />
          <ProjectSection />
          <PartSection />
          <RecruitSection />
        </div>
      </motion.main>
    </>
  );
}
