import { css } from '@emotion/react';
import dynamic from 'next/dynamic';
import { colors } from '../../../../styles/constants';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface ProfileBioProps {
  isEditing: boolean;
  bioMarkdown: string;
  tempMarkdown: string;
  setTempMarkdown: (value: string) => void;
}

export default function ProfileBio({
  isEditing,
  bioMarkdown,
  tempMarkdown,
  setTempMarkdown,
}: ProfileBioProps) {
  return (
    <section css={!isEditing && wrapCss}>
      <h3 css={labelCss}>자기소개</h3>
      {isEditing ? (
        <div css={editorContainerCss} data-color-mode="light">
          <MDEditor
            value={tempMarkdown}
            onChange={(val) => setTempMarkdown(val || '')}
            height={400}
            preview="live"
            hideToolbar={false}
            visibleDragbar={true}
            textareaProps={{
              placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
            }}
          />
        </div>
      ) : (
        <div css={boxCss} data-color-mode="light">
          <MDPreview source={bioMarkdown} />
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
  padding: 32px;
  background: #fff;
  min-height: 400px;

  & h1, & h2, & h3, & h4, & h5, & h6 {
    font-family: 'Pretendard', sans-serif;
  }

  & code {
    font-family: 'Courier New', monospace;
  }
`;

const editorContainerCss = css`
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;

  & .w-md-editor {
    border-radius: 8px;
    border: 1px solid #c3c6cb;
  }

  & .w-md-editor-toolbar {
    border-bottom: 1px solid #d0d7de;
  }

  & .w-md-editor-text-pre {
    font-family: 'Courier New', monospace;
  }
`;