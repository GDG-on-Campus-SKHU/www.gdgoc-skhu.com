import { PropsWithChildren } from 'react';
import { css } from '@emotion/react';
import { motion } from 'framer-motion';

import {
  defaultFadeInUpVariants,
  defaultFadeInVariants,
  staggerFourFive,
} from '../../constants/motions';
import { bigCss, colors, paragraphCss } from '../../styles/constants';

export default function IntroduceSection() {
  return (
    <section>
      <motion.div
        variants={staggerFourFive}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.6 }}
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 95vh;
        `}
      >
        <MotionSpan key="a">2026년에도,</MotionSpan>
        <MotionSpan key="b">성장을 위한 위대한 걸음</MotionSpan>
        <motion.span
          key="c"
          variants={defaultFadeInUpVariants}
          css={css`
            ${bigCss}
          `}
        >
          <span
            css={css`
              color: ${colors.gdscRed};
            `}
          >
            G
          </span>
          <span
            css={css`
              color: ${colors.gdscBlue};
            `}
          >
            D
          </span>
          <span
            css={css`
              color: ${colors.gdscYellow};
            `}
          >
            G
          </span>
          <span
            css={css`
              color: ${colors.gdscGreen};
            `}
          >
            oC
          </span>
          가
        </motion.span>
        <MotionSpan key="d">함께하겠습니다.</MotionSpan>
        <motion.p
          key="p-a"
          css={css`
            ${paragraphCss}
            margin-top: 3rem;
            line-height: 3rem;
          `}
          variants={defaultFadeInVariants}
        >
          Google과 함께하는 교내 최고, 최대의 개발 커뮤니티 GDGoC SKHU입니다.
        </motion.p>

        <motion.p key="p-b" css={paragraphCss} variants={defaultFadeInVariants}>
          다양한 경험을 통해 더 나은 개발자가 되고 싶다면 함께해 주세요!
        </motion.p>
      </motion.div>
    </section>
  );
}

function MotionSpan({ children }: PropsWithChildren<{}>) {
  return (
    <motion.span
      variants={defaultFadeInUpVariants}
      css={css`
        ${bigCss}
        line-height: 6rem;
      `}
    >
      {children}
    </motion.span>
  );
}
