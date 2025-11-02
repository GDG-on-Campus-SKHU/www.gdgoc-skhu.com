import Link from 'next/link';
import { css } from '@emotion/react';

import { layoutCss } from '../../styles/constants/layout';
import SelectBox from '../../features/team-building/components/SelectBox';

const GDG_OC_LINK = 'https://sites.google.com/view/gdeveloperskorea/gdg-on-campus';

export default function Nav() {
  return (
    <nav
      css={css`
        ${layoutCss};
        height: 60px;

        position: fixed;
        top: 0;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 100;
      `}
    >
      <Link
        href="/"
        scroll={false}
        css={css`
          line-height: 1.25rem;
          cursor: pointer;
        `}
      >
        Google Developer Groups on Campus SKHU
      </Link>

      <div
        css={css`
          display: flex;
          gap: 0.75rem;
        `}
      >
        <a href={GDG_OC_LINK} target="_blank" rel="noreferrer">
          About
        </a>
        <Link href="/contact" scroll={false}>
          Contact
        </Link>
        <SelectBox 
          options={['z','s', '에에ㅔㅇ']}
          placeholder="보유하고 있는 기술 스택을 선택해주세요."
          multiple
          onChange={(selected) => console.log(selected)}
        />
      </div>
    </nav>
  );
}
