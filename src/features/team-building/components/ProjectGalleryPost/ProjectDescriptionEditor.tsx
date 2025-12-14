import dynamic from 'next/dynamic';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

type ProjectDescriptionEditorProps = {
  /** 마크다운 문자열 */
  value: string;
  /** 편집 중에 값 변경 */
  onChange: (value: string) => void;
  /** true면 에디터, false면 미리보기 */
  isEditing?: boolean;
};

export default function ProjectDescriptionEditor({
  value,
  onChange,
  isEditing = true,
}: ProjectDescriptionEditorProps) {
  return (
    <div css={editorWrapCss} data-color-mode="light">
      {isEditing ? (
        <div css={editorContainerCss}>
          <MDEditor
            value={value}
            onChange={val => onChange(val || '')}
            height={400}
            preview="live"
            hideToolbar={false}
            visibleDragbar={true}
            textareaProps={{
              placeholder: "Github README 작성에 쓰이는 'markdown'을 이용해 작성해보세요.",
            }}
          />
        </div>
      ) : (
        <div css={previewBoxCss}>
          <MDPreview source={value || '아직 작성된 내용이 없습니다.'} />
        </div>
      )}
    </div>
  );
}

const editorWrapCss = css`
  margin-top: 10px;
`;

const editorContainerCss = css`
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

const previewBoxCss = css`
  border-radius: 8px;
  outline: 1px ${colors.grayscale[400]} solid;
  outline-offset: -1px;
  padding: 20px 25px;
  min-height: 260px;

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
