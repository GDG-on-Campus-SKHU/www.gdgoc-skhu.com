import dynamic from 'next/dynamic';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

type Props = { title: string; content: string };

export default function ProjectDetailDescription({ title, content }: Props) {
  return (
    <section css={wrapCss}>
      <h3 css={sectionTitleCss}>{title}</h3>
      <div css={boxCss} data-color-mode="light">
        <MDPreview source={content || '아직 작성된 내용이 없습니다.'} />
      </div>
    </section>
  );
}

const wrapCss = css`
  margin-top: 20px;
`;

const sectionTitleCss = css`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 160%;
`;

const boxCss = css`
  border-radius: 8px;
  outline: 1px #c3c6cb solid;
  outline-offset: -1px;
  padding: 24px;
  background: #fff;
  min-height: 400px;

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-family: 'Pretendard', sans-serif;
  }

  & code {
    font-family: 'Courier New', monospace;
  }

  & pre {
    background: ${colors.grayscale[100]};
    padding: 12px 16px;
    border-radius: 6px;
    overflow-x: auto;
  }
`;
