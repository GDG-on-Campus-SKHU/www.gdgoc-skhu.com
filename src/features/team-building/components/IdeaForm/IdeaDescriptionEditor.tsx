import dynamic from 'next/dynamic';
import type React from 'react';
import { useUploadImage } from '@/lib/image.api';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default), {
  ssr: false,
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function insertAtCursor(
  current: string,
  insertText: string,
  textarea: HTMLTextAreaElement | null,
  onChange: (next: string) => void
) {
  if (!textarea) {
    onChange((current ?? '') + insertText);
    return;
  }

  const start = textarea.selectionStart ?? current.length;
  const end = textarea.selectionEnd ?? current.length;

  const next = current.slice(0, start) + insertText + current.slice(end);
  onChange(next);

  const nextPos = start + insertText.length;
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(nextPos, nextPos);
  });
}

export default function IdeaDescriptionEditor({ value, onChange }: Props) {
  const uploadMutation = useUploadImage();

  const uploadOneImage = async (file: File): Promise<string> => {
    const uploaded = await uploadMutation.mutateAsync({
      file,
      directory: 'idea',
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
        const url = await uploadOneImage(file);
        insertAtCursor(value, `${url}`, textarea, onChange);
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
        const url = await uploadOneImage(file);
        insertAtCursor(value, `${url}`, textarea, onChange);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
      }
    }
  };

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={val => onChange(val || '')}
        height={400}
        preview="live"
        textareaProps={{
          placeholder: "Github README 작성에 쓰이는 'markdown'을 이용해 작성해보세요.",
          onDrop: handleDrop,
          onPaste: handlePaste,
          onDragOver: e => e.preventDefault(),
        }}
      />
      {uploadMutation.isPending && <div style={{ marginTop: 8 }}>이미지 업로드 중...</div>}
    </div>
  );
}
