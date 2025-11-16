// 라이브러리 적용 전
import { useState } from 'react';
import { css } from '@emotion/react';

export default function ProjectDescriptionEditor() {
  const [value, setValue] = useState('');

  return (
    <div css={editorWrapCss}>
      {/* 간단한 툴바 UI (기능 X, 나중에 에디터로 교체 예정) */}
      <div css={toolbarCss}>
        <button type="button" css={toolbarButtonCss}>
          Normal
        </button>
        <span
          css={css`
            width: 1px;
            height: 16px;
            background: #e5e7eb;
          `}
        />
        <button type="button" css={toolbarButtonCss}>
          B
        </button>
        <button type="button" css={toolbarButtonCss}>
          I
        </button>
        <button type="button" css={toolbarButtonCss}>
          U
        </button>
        <button type="button" css={toolbarButtonCss}>
          •
        </button>
        <button type="button" css={toolbarButtonCss}>
          1.
        </button>
        <button type="button" css={toolbarButtonCss}>
          A
        </button>
        <button type="button" css={toolbarButtonCss}>
          🖼
        </button>
      </div>

      <textarea
        css={textareaCss}
        placeholder={`Github README 작성에 쓰이는 'markdown' 을 이용해 작성해보세요.`}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}

const editorWrapCss = css`
  border-radius: 8px;
  border: 1px solid #dadce0;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const toolbarCss = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 14px;
`;

const toolbarButtonCss = css`
  padding: 4px 6px;
  border-radius: 4px;
  border: none;
  background: transparent;
  font-size: 13px;
  cursor: default;
  color: #6b7280;
`;

const textareaCss = css`
  min-height: 260px;
  padding: 14px 16px;
  border: none;
  outline: none;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
  font-family: inherit;
  resize: none;

  &::placeholder {
    color: #b0b5bd;
  }
`;
