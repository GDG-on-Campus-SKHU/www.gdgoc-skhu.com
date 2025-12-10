import { css } from '@emotion/react';

type Props = { title: string; content: string };

export default function ProjectDetailDescription({ title, content }: Props) {
  return (
    <section css={wrapCss}>
      <h3 css={sectionTitleCss}>{title}</h3>
      <div css={boxCss}>
        {/* 임시 데이터 객체 내에 스타일 설정 */}
        <div css={contentCss} dangerouslySetInnerHTML={{ __html: content }} />
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
`;
const contentCss = css`
  white-space: normal;
  line-height: 1.6;
`;
