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
    color: #d4d7dd;
    pointer-events: none;
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

const FeatureNavItem = styled.span<{ $bold?: boolean }>`
  ${baseItemCss};
  --item-weight: ${({ $bold }) => ($bold ? 700 : 500)};
`;

const FeatureNavLink = styled(Link)<{ $bold?: boolean }>`
  ${baseItemCss};
  --item-weight: ${({ $bold }) => ($bold ? 700 : 500)};
`;

const FEATURE_NAV_LINKS = ['TeamBuild', 'Gallery', 'Community', 'Mypage', 'Logout'] as const;

export function FeatureNavBarComponent() {
  const router = useRouter();
  const isHome = router.pathname === '/';
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

  return (
    <FeatureNavContainer data-feature-nav="true">
      <FeatureBrand>Google Developer Groups on Campus SKHU</FeatureBrand>
      <FeatureNavLinks data-feature-nav-link="true">
        {FEATURE_NAV_LINKS.map(link => {
          const isEmphasized = link === 'TeamBuild' || link === 'Gallery' || link === 'Community';
          if (link === 'TeamBuild') {
            return (
              <FeatureNavLink key={link} href="/WelcomeOpen" $bold={isEmphasized}>
                {link}
              </FeatureNavLink>
            );
          }
          return (
            <FeatureNavItem key={link} $bold={isEmphasized}>
              {link}
            </FeatureNavItem>
          );
        })}
      </FeatureNavLinks>
    </FeatureNavContainer>
  );
}

export const AppNavBar = FeatureNavBarComponent;

export default FeatureNavBarComponent;
