import type { AppProps } from 'next/app';
import Head from 'next/head';
import { css } from '@emotion/react';
import { AnimatePresence } from 'framer-motion';

import Footer from '../components/Footer';
import Nav from '../components/Nav';
import Scene from '../components/Scene';
import { BASE_URL } from '../constants/common';
import GlobalStyle from '../styles/GlobalStyle';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

export default function App({ Component, pageProps, router }: AppProps) {
  const CURRENT_URL = BASE_URL + router.route;
  return (
    <>
      <Head>
        <link rel="canonical" href={CURRENT_URL} />
        <meta property="og:url" content={CURRENT_URL} />
      </Head>
      <GlobalStyle />
      <Nav />
      <Scene />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          window.scrollTo(0, 0);
        }}
      >
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
      <Footer />
    </>
  );
}
