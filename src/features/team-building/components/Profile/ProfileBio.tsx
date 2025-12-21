import dynamic from 'next/dynamic';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

interface ProfileBioProps {
  isEditing: boolean;
  isPreviewMode: boolean;
  bioMarkdown: string;
  tempMarkdown: string;
  setTempMarkdown: (value: string) => void;
}

export default function ProfileBio({
  isEditing,
  isPreviewMode,
  bioMarkdown,
  tempMarkdown,
  setTempMarkdown,
}: ProfileBioProps) {
  const showEditor = isEditing && !isPreviewMode;

  return (
    <section css={!isEditing && wrapCss}>
      <h3 css={labelCss}>자기소개</h3>
      {showEditor ? (
        <div css={editorContainerCss} data-color-mode="light">
          <MDEditor
            value={tempMarkdown}
            onChange={val => setTempMarkdown(val || '')}
            height={400}
            preview="edit"
            hideToolbar={false}
            visibleDragbar={false}
            textareaProps={{
              placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
            }}
          />
        </div>
      ) : (
        <div css={boxCss} data-color-mode="light">
          <MDPreview source={isEditing ? tempMarkdown : bioMarkdown} />
        </div>
      )}
    </section>
  );
}

const labelCss = css`
  min-width: 150px;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 2rem;
`;

const wrapCss = css`
  margin-top: 3rem;
`;

const boxCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  outline: 1px ${colors.grayscale[400]} solid;
  outline-offset: -1px;
  padding: 32px 32px 32px 50px;
  background: #fff;
  min-height: 400px;

  & .wmde-markdown {
    background: transparent;
    ul {
      list-style: disc !important;
      padding-left: 1rem !important;
    }
    ol {
      list-style: decimal !important;
      padding-left: 1rem !important;
    }
  }

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
`;

const editorContainerCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  background: #fff;
  min-height: 400px;

  & .wmde-markdown {
    background: transparent;
    ul {
      list-style: disc !important;
      padding-left: 1rem !important;
    }
    ol {
      list-style: decimal !important;
      padding-left: 1rem !important;
    }
  }

  & .wmde-markdown h1,
  & .wmde-markdown h2,
  & .wmde-markdown h3,
  & .wmde-markdown h4,
  & .wmde-markdown h5,
  & .wmde-markdown h6 {
    font-family: 'Pretendard', sans-serif;
  }

  & .wmde-markdown code {
    font-family: 'Courier New', monospace;
  }
`;
