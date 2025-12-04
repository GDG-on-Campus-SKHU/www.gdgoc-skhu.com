import { useState } from 'react';
import Link from 'next/link';
import { css } from '@emotion/react';

import DropdownMenu from '../../features/team-building/components/MyPage/DropdownMenu';
import { layoutCss } from '../../styles/constants/layout';

const GDG_OC_LINK = 'https://sites.google.com/view/gdeveloperskorea/gdg-on-campus';

export default function Nav() {
  const [isMyPageHovered, setIsMyPageHovered] = useState(false);

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
          font-weight: 700;
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
        <Link href="/login" scroll={false}>
          Login
        </Link>
        <div
          css={css`
            position: relative;
          `}
          onMouseOver={() => setIsMyPageHovered(true)}
          onMouseLeave={() => setIsMyPageHovered(false)}
        >
          MyPage
          {isMyPageHovered && <DropdownMenu />}
        </div>
        <Link href="/login" scroll={false}>
          Logout
        </Link>
      </div>
    </nav>
  );
}
