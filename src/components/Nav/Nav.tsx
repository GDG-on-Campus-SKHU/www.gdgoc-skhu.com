import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';

import DropdownMenu from '../../features/team-building/components/MyPage/DropdownMenu';
import { useAuthStore } from '../../lib/authStore';
import { layoutCss } from '../../styles/constants/layout';

const GDG_OC_LINK = 'https://sites.google.com/view/gdeveloperskorea/gdg-on-campus';
const AUTH_PAGES = ['/login', '/signup', '/forgot-password'];

const navItemCss = css`
  font-size: 16px;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;
  color: inherit;
  text-decoration: none;
`;

export default function Nav() {
  const router = useRouter();
  const { accessToken, role, participated, clearAuth, hydrateFromSession } = useAuthStore();
  const [isMyPageHovered, setIsMyPageHovered] = useState(false);

  const isLoggedIn = !!accessToken;
  const isAuthPage = AUTH_PAGES.includes(router.pathname);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;

  useEffect(() => {
    hydrateFromSession();
  }, [hydrateFromSession]);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <nav
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 60px;
        background: #ffffff;
        z-index: 100;
      `}
    >
      <div
        css={css`
          ${layoutCss};
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <Link
          href="/"
          scroll={false}
          css={css`
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
          `}
        >
          Google Developer Groups on Campus SKHU
        </Link>

        <div
          css={css`
            display: flex;
            gap: 0.75rem;
            align-items: center;
          `}
        >
          {isMobile && (
            <>
              <a href={GDG_OC_LINK} target="_blank" rel="noreferrer" css={navItemCss}>
                About
              </a>
              <Link href="/contact" scroll={false} css={navItemCss}>
                Contact
              </Link>
            </>
          )}

          {!isMobile && (isAuthPage || !isLoggedIn) && (
            <>
              <a href={GDG_OC_LINK} target="_blank" rel="noreferrer" css={navItemCss}>
                About
              </a>
              <Link href="/contact" scroll={false} css={navItemCss}>
                Contact
              </Link>
              <Link href="/login" scroll={false} css={navItemCss}>
                Login
              </Link>
            </>
          )}

          {!isMobile && !isAuthPage && isLoggedIn && (
            <>
              {participated && (
                <Link href="/WelcomeOpen" scroll={false} css={navItemCss}>
                  TeamBuild
                </Link>
              )}

              {role === 'ROLE_SKHU_ADMIN' && (
                <Link href="/admin" scroll={false} css={navItemCss}>
                  Manage
                </Link>
              )}

              <Link href="/project-gallery" scroll={false} css={navItemCss}>
                Gallery
              </Link>

              <Link href="/activity" scroll={false} css={navItemCss}>
                Activity
              </Link>

              <div
                css={css`
                  position: relative;
                `}
                onMouseEnter={() => setIsMyPageHovered(true)}
                onMouseLeave={() => setIsMyPageHovered(false)}
              >
                <span css={navItemCss}>MyPage</span>
                {isMyPageHovered && <DropdownMenu role={role} />}
              </div>

              <span css={navItemCss} onClick={handleLogout}>
                Logout
              </span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
