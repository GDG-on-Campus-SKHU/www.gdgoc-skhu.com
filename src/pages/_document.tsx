import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import { IS_PRODUCTION } from '../constants/common';

const TITLE = 'GDGoC SKHU';
const DESCRIPTION = 'Google Developer Groups on Campus SKHU';
const IMAGE = '/gdgoc_skhu.png';

const GA_ID = 'G-SF5GEJR7Z9';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="kr">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.css"
          />

          <meta httpEquiv="Content-type" content="text/html; charset=utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />

          <link rel="icon" href="/favicon.ico" />
          <meta name="keywords" content="development,developer,gdsc,google" />
          <meta name="description" content={DESCRIPTION} />

          <meta property="og:type" content="website" />
          <meta property="og:locale" content="ko_KR" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:image" content={IMAGE} />

          <meta name="twitter:creator" content="GDSC_AT_SKHU" />
          <meta name="twitter:title" content={TITLE} />
          <meta name="twitter:description" content={DESCRIPTION} />
          <meta name="twitter:image" content={IMAGE} />

          {/* for google analytics */}
          {IS_PRODUCTION && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
