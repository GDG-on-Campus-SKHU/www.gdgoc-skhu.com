import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Nav from '../../../../components/Nav';

const FeatureNavContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: min(1080px, 100%);
  padding: 16px 0 14px;
  margin: 0 auto;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  background: #ffffff;
  color: #000000;
  transition:
    filter 0.2s ease,
    background-color 0.2s ease,
    backdrop-filter 0.2s ease,
    color 0.2s ease;

  body.ideaform-modal-open &,
  body.ideaapply-modal-open &,
  body.modal-open & {
    filter: blur(6px);
    background: #f3f4f6;
    backdrop-filter: blur(6px);
    color: #d4d7dd !important;
    pointer-events: none;
  }

  body.schedule-modal-open & {
    /* Navbar는 자기 배경을 유지해야 사진과 동일하게 나옴 */
    background: inherit !important;
    filter: none !important; /* Navbar 전체 blur 금지 */
    backdrop-filter: none !important; /* Navbar 배경 흐림 금지 */

    pointer-events: none !important;
    box-shadow: none !important;
  }

  /* 🔥 Navbar 내부 글씨 + 아이콘만 흐리게 */
  body.schedule-modal-open & * {
    filter: blur(4px) !important; /* 글씨만 blur */
    opacity: 0.65 !important; /* 사진처럼 살짝 투명하게 */
    color: inherit !important; /* 기존 색 유지 (검정) */
  }
`;

const FeatureBrand = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 160%;
  color: inherit;
`;

export const FeatureNavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  line-height: 160%;
  color: inherit;
  flex-wrap: wrap;
`;

const baseItemCss = `
  display: flex;
  align-items: center;
  font-weight: var(--item-weight, 500);
  color: inherit;
  white-space: nowrap;
  text-decoration: none;
`;

const FeatureNavLink = styled(Link)<{ $bold?: boolean }>`
  ${baseItemCss};
  --item-weight: ${({ $bold }) => ($bold ? 700 : 500)};
`;

type FeatureNavItem = {
  label: string;
  href: string;
  bold?: boolean;
};

const FEATURE_NAV_ITEMS: FeatureNavItem[] = [
  { label: 'TeamBuild', href: '/WelcomeOpen' },
  { label: 'Gallery', href: '/IdeaLayout' },
  { label: 'Community', href: '/contact' },
  { label: 'Mypage', href: '/login' },
  { label: 'Logout', href: '/login' },
] as const;

export function FeatureNavBarComponent() {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const pathDepth = React.useMemo(
    () => router.pathname.split('/').filter(Boolean).length,
    [router.pathname]
  );
  const isAdminRoute = router.pathname.toLowerCase().startsWith('/admin');
  // show on root and first-level folders (and their files); hide on deeper nested routes or admin pages
  const shouldHide = isAdminRoute || pathDepth > 2;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isHome || !mounted) return;
    const navs =
      typeof document !== 'undefined'
        ? Array.from(document.querySelectorAll('nav')).filter(
            el => el.getAttribute('data-feature-nav-link') !== 'true'
          )
        : [];
    if (!navs.length) return;

    const previousDisplays = navs.map(el => el.style.display);
    navs.forEach(el => {
      el.style.display = 'none';
    });

    return () => {
      navs.forEach((el, idx) => {
        el.style.display = previousDisplays[idx];
      });
    };
  }, [isHome, mounted]);

  if (!mounted) {
    return null;
  }

  if (isHome) {
    return <Nav />;
  }

  if (shouldHide) {
    return null;
  }

  return (
    <FeatureNavContainer data-feature-nav="true">
      <FeatureBrand>Google Developer Groups on Campus SKHU</FeatureBrand>
      <FeatureNavLinks data-feature-nav-link="true">
        {FEATURE_NAV_ITEMS.map(item => (
          <FeatureNavLink key={item.label} href={item.href} $bold={item.bold}>
            {item.label}
          </FeatureNavLink>
        ))}
      </FeatureNavLinks>
    </FeatureNavContainer>
  );
}

export const AppNavBar = FeatureNavBarComponent;

export default FeatureNavBarComponent;
