import { useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { css } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import Footer from '../components/Footer';
import Scene from '../components/Scene';
import GlobalStyle from '../styles/GlobalStyle';
import Nav from '../components/Nav';
import { AppNavBar } from '../features/team-building/components/FeatureNavBar/FeatureNavBar';
import { BASE_URL } from '../constants/common';

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password'];

export default function App({ Component, pageProps, router }: AppProps) {
  const CURRENT_URL = BASE_URL + router.route;
  const [queryClient] = useState(() => new QueryClient());

  const isPublicPage = PUBLIC_ROUTES.includes(router.pathname);
  const isHome = router.pathname === '/';

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="canonical" href={CURRENT_URL} />
        <meta property="og:url" content={CURRENT_URL} />
      </Head>

      <GlobalStyle />

      {!isPublicPage && isHome && <Nav />}
      {!isPublicPage && !isHome && <AppNavBar />}

      <Scene />

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <div
          key={CURRENT_URL}
          css={css`
            position: relative;
            z-index: 99;
          `}
        >
          <Component {...pageProps} />
        </div>
      </AnimatePresence>

      {!isPublicPage && <Footer />}
    </QueryClientProvider>
  );
}
