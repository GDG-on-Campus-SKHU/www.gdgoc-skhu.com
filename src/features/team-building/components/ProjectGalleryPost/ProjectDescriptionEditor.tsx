import dynamic from 'next/dynamic';
import { useUploadImage } from '@/lib/image.api';
import { css } from '@emotion/react';
import type React from 'react';
import remarkBreaks from 'remark-breaks';

import { colors } from '../../../../styles/constants';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

type ProjectDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
  isEditing?: boolean;
};

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

export default function ProjectDescriptionEditor({
  value,
  onChange,
  isEditing = true,
}: ProjectDescriptionEditorProps) {
  const uploadMutation = useUploadImage();

  const insertImageMarkdown = (url: string, file: File, textarea: HTMLTextAreaElement) => {
    const alt = file.name.replace(/\.[^/.]+$/, '') || 'image';
    const md = `\n![${alt}](${url})\n`;
    insertAtCursor(value, md, textarea, onChange);
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

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) return;

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

    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter(it => it.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    for (const item of imageItems) {
      const file = item.getAsFile();
      if (!file) continue;

      try {
        const url = await uploadOneProjectImage(file);
        insertImageMarkdown(url, file, textarea);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
      }
    }
  };

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
            previewOptions={{
              remarkPlugins: [remarkBreaks],
            }}
            textareaProps={{
              placeholder: "Github README 작성에 쓰이는 'markdown'을 이용해 작성해보세요.",
              onDrop: handleDrop,
              onPaste: handlePaste,
              onDragOver: e => e.preventDefault(),
            }}
          />

          {/* 원하면 업로드 중 표시도 추가 가능 */}
          {uploadMutation.isPending && <div css={uploadingCss}>이미지 업로드 중...</div>}
        </div>
      ) : (
        <div css={previewBoxCss}>
          <MDPreview
            source={value || '아직 작성된 내용이 없습니다.'}
            remarkPlugins={[remarkBreaks]}
          />
        </div>
      )}
    </div>
  );
}

const editorWrapCss = css`
  margin-top: 10px;
`;

const editorContainerCss = css`
  width: 1080px;
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

const uploadingCss = css`
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 8px 12px;
  border-radius: 10px;
  background: ${colors.grayscale[100]};
  border: 1px solid ${colors.grayscale[200]};
  font-size: 14px;
  color: ${colors.grayscale[700]};
`;
