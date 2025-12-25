import { useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { css } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';

import Footer from '../components/Footer';
import Nav from '../components/Nav';
import Scene from '../components/Scene';
import { BASE_URL } from '../constants/common';
import AdminLayout from '../features/Admin/layout/AdminLayout';
import GlobalStyle from '../styles/GlobalStyle';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const HIDE_FOOTER_PAGES = ['/403', '/404'];

export default function App({ Component, pageProps, router }: AppProps) {
  const CURRENT_URL = BASE_URL + router.route;
  const [queryClient] = useState(() => new QueryClient());
  const hideFooter = HIDE_FOOTER_PAGES.includes(router.pathname);
  const isAdminPage = router.pathname.toLowerCase().startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="canonical" href={CURRENT_URL} />
        <meta property="og:url" content={CURRENT_URL} />
      </Head>

      <GlobalStyle />
      {!isAdminPage && <Nav />}
      {!isAdminPage && <Scene />}

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <div
          key={CURRENT_URL}
          css={css`
            position: relative;
            z-index: 99;
          `}
        >
          {isAdminPage ? (
            <AdminLayout>
              <Component {...pageProps} />
            </AdminLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </div>
      </AnimatePresence>

      {!hideFooter && !isAdminPage && <Footer />}
    </QueryClientProvider>
  );
}
