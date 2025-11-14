import { css } from '@emotion/react';

export default function GalleryEmpty() {
  return <div css={emptyBoxCss}>아직 등록된 프로젝트가 없습니다.</div>;
}

const emptyBoxCss = css`
  margin-top: 100px;
  width: 100%;
  border-radius: 8px;
  outline: 1px #c3c6cb solid;
  outline-offset: -1px;
  padding: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #353a40;
  font-size: 20px;
  font-weight: 500;
  line-height: 38.4px;
`;
