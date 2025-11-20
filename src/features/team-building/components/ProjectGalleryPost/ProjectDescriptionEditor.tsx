import Image from 'next/image';
import { css } from '@emotion/react';

import markdown from '../../assets/markdown.svg';

type ProjectDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProjectDescriptionEditor({
  value,
  onChange,
}: ProjectDescriptionEditorProps) {
  return (
    <div css={editorWrapCss}>
      {/* 간단한 UI (기능 X, 나중에 재현님 만드신 컴포로 교체 예정) */}
      <div css={toolbarCss}>
        <Image src={markdown} alt="마크다운" />
      </div>

      <textarea
        css={textareaCss}
        placeholder={`Github README 작성에 쓰이는 'markdown' 을 이용해 작성해보세요.`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

const editorWrapCss = css`
  border-radius: 8px;
  outline: 1px #c3c6cb solid;
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 10px;
`;

const toolbarCss = css`
  gap: 12px;
  padding: 12px 14px;
`;

const textareaCss = css`
  min-height: 260px;
  padding: 18px 16px;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  resize: none;

  &::placeholder {
    color: #b0b5bd;
  }
`;
