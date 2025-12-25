import dynamic from 'next/dynamic';
import { useUploadImage } from '@/lib/image.api';
import { css } from '@emotion/react';
import remarkBreaks from 'remark-breaks';

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

function insertAtCursor(
  current: string,
  insertText: string,
  textarea: HTMLTextAreaElement | null,
  onChange: (next: string) => void
) {
  // textarea 접근이 불가하면 그냥 뒤에 붙이기(안전 fallback)
  if (!textarea) {
    onChange((current ?? '') + insertText);
    return;
  }

  const start = textarea.selectionStart ?? current.length;
  const end = textarea.selectionEnd ?? current.length;

  const next = current.slice(0, start) + insertText + current.slice(end);
  onChange(next);

  // 커서 위치를 삽입 텍스트 뒤로 이동
  const nextPos = start + insertText.length;
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(nextPos, nextPos);
  });
}

export default function ProfileBio({
  isEditing,
  isPreviewMode,
  bioMarkdown,
  tempMarkdown,
  setTempMarkdown,
}: ProfileBioProps) {
  const showEditor = isEditing && !isPreviewMode;
  const uploadMutation = useUploadImage();

  const insertImageMarkdown = (url: string, file: File, textarea: HTMLTextAreaElement | null) => {
    const alt = file.name.replace(/\.[^/.]+$/, '') || 'image';
    const md = `\n![${alt}](${url})\n`;
    insertAtCursor(tempMarkdown, md, textarea, setTempMarkdown);
  };

  const uploadOneProjectImage = async (file: File): Promise<string> => {
    const uploaded = await uploadMutation.mutateAsync({
      file,
      directory: 'project',
    });
    return uploaded.url;
  };

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget;

    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/') && f.size > 0
    );
    if (!files.length) return;

    for (const file of files) {
      try {
        const url = await uploadOneProjectImage(file);
        insertImageMarkdown(url, file, textarea);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const items = Array.from(e.clipboardData.items).filter(it => it.type.startsWith('image/'));

    if (!items.length) return;
    e.preventDefault();

    for (const item of items) {
      const file = item.getAsFile();
      if (!file || file.size === 0) continue;

      try {
        const url = await uploadOneProjectImage(file);
        insertImageMarkdown(url, file, textarea);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
      }
    }
  };

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
            previewOptions={{ remarkPlugins: [remarkBreaks] }}
            textareaProps={{
              placeholder: "Github README 생성에 쓰이는 'markdown'을 이용해 작성해보세요.",
              onDrop: handleDrop,
              onPaste: handlePaste,
              onDragOver: e => e.preventDefault(),
            }}
          />
        </div>
      ) : (
        <div css={boxCss} data-color-mode="light">
          <MDPreview
            source={isEditing ? tempMarkdown : bioMarkdown}
            remarkPlugins={[remarkBreaks]}
          />
        </div>
      )}
    </section>
  );
}

const labelCss = css`
  min-width: 150px;
  font-size: 18px;
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
