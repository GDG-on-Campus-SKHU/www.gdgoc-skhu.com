import React from 'react';
import type { RangeStatic } from 'quill';
import ReactQuill from 'react-quill';

import { MAX_IMAGE_SIZE } from '../components/IdeaForm/constants';

const quillToolbarOptions = [
  [{ header: [false, 1, 2, 3] }],
  [{ align: [] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'bullet' }],
  [{ color: [] }, { background: [] }],
  ['blockquote', 'image'],
];

const quillFormats = [
  'header',
  'align',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'color',
  'background',
  'blockquote',
  'image',
];

export default function useQuillImages({
  description,
  onDescriptionChange,
}: {
  description: string;
  onDescriptionChange: (value: string) => void;
}) {
  const quillRef = React.useRef<ReactQuill | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement | null>(null);
  const pageRef = React.useRef<HTMLDivElement | null>(null);

  const lastSelectionRef = React.useRef<RangeStatic | null>(null);
  const lastSyncedDescriptionRef = React.useRef(description);
  const descriptionRef = React.useRef(description);

  React.useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  const uploadImageAndGetUrl = React.useCallback(
    (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === 'string'
            ? resolve(reader.result)
            : reject(new Error('invalid image'));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }),
    []
  );

  const insertImageAtSelection = React.useCallback(
    (dataUrl: string) => {
      const editor = quillRef.current?.getEditor?.();
      if (!editor) return;

      const sel = editor.getSelection() || lastSelectionRef.current;
      const baseIndex = sel ? sel.index + (sel.length ?? 0) : editor.getLength();
      const idx = Math.max(0, Math.min(baseIndex, editor.getLength()));

      editor.focus();
      editor.insertEmbed(idx, 'image', dataUrl, 'user');
      editor.setSelection(idx + 1, 0, 'silent');

      const html = editor.root.innerHTML;
      lastSyncedDescriptionRef.current = html;
      if (html !== descriptionRef.current) onDescriptionChange(html);
    },
    [onDescriptionChange]
  );

  const insertImageFile = React.useCallback(
    async (file: File) => {
      if (file.size > MAX_IMAGE_SIZE) return alert('이미지는 최대 5MB까지 가능합니다.');
      try {
        const url = await uploadImageAndGetUrl(file);
        insertImageAtSelection(url);
      } catch (e) {
        console.error(e);
        alert('이미지 처리 실패');
      }
    },
    [insertImageAtSelection, uploadImageAndGetUrl]
  );

  const handleImageFileChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = '';
      if (f) await insertImageFile(f);
    },
    [insertImageFile]
  );

  const handleImageUpload = React.useCallback(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor) lastSelectionRef.current = editor.getSelection() ?? null;
    imageInputRef.current?.click();
  }, []);

  const quillModules = React.useMemo(
    () => ({
      toolbar: {
        container: quillToolbarOptions,
        handlers: { image: handleImageUpload },
      },
    }),
    [handleImageUpload]
  );
  // window drag/drop/paste (페이지 내부만 허용)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const isInsidePage = (evt: Event) => {
      const pageEl = pageRef.current;
      if (!pageEl) return false;
      const target = evt.target as Node | null;
      const path = (evt as any).composedPath?.() ?? [];
      return (target && pageEl.contains(target)) || path.includes(pageEl);
    };

    const onDragOver = (evt: DragEvent) => {
      if (!isInsidePage(evt)) return;
      if (!evt.dataTransfer?.types?.includes('Files')) return;
      evt.preventDefault();
    };

    const onDrop = (evt: DragEvent) => {
      if (!isInsidePage(evt)) return;
      const files = evt.dataTransfer?.files;
      if (!files?.length) return;

      const img = Array.from(files).find(f => f.type.startsWith('image/'));
      if (!img) return;

      evt.preventDefault();
      evt.stopPropagation();

      const editor = quillRef.current?.getEditor?.();
      if (editor) lastSelectionRef.current = editor.getSelection() ?? null;
      void insertImageFile(img);
    };

    const onPaste = (evt: ClipboardEvent) => {
      if (!isInsidePage(evt)) return;
      const items = Array.from(evt.clipboardData?.items ?? []);
      const item = items.find(i => i.type.startsWith('image/'));
      const file = item?.getAsFile();
      if (!file) return;

      evt.preventDefault();
      const editor = quillRef.current?.getEditor?.();
      if (editor) lastSelectionRef.current = editor.getSelection() ?? null;
      void insertImageFile(file);
    };

    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    window.addEventListener('paste', onPaste);

    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
      window.removeEventListener('paste', onPaste);
    };
  }, [insertImageFile]);

  // quill selection tracking
  React.useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const onSelection = (range: RangeStatic | null) => {
      if (range) lastSelectionRef.current = range;
    };

    editor.on('selection-change', onSelection);
    return () => {
      editor.off('selection-change', onSelection);
    };
  }, []);

  // ">" or "*" + Enter handlers
  React.useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const enterKey = 13;
    const handler = (range: any) => {
      try {
        const pos = range?.index ?? 0;
        const [line] = editor.getLine(pos);
        if (!line || !line.domNode) return true;

        const raw = line.domNode.textContent ?? '';
        const text = raw.replace(/\uFEFF/g, '').trim();

        if (text === '>') {
          const lineStart = pos - (range?.offset ?? 0);
          editor.deleteText(lineStart, line.length(), 'user');
          const template =
            '<details><summary>토글 제목</summary><div><p>내용을 입력하세요.</p></div></details><p><br></p>';
          editor.clipboard.dangerouslyPasteHTML(lineStart, template, 'user');
          const html = editor.root.innerHTML
            .replace(/&lt;(\/?details)&gt;/gi, '<$1>')
            .replace(/&lt;(\/?summary)&gt;/gi, '<$1>')
            .replace(/&lt;(\/?div)&gt;/gi, '<$1>')
            .replace(/&lt;(\/?p)&gt;/gi, '<$1>');
          if (html !== editor.root.innerHTML) {
            editor.root.innerHTML = html;
          }
          descriptionRef.current = editor.root.innerHTML;
          lastSyncedDescriptionRef.current = editor.root.innerHTML;
          onDescriptionChange(editor.root.innerHTML);
          editor.setSelection(Math.min(lineStart + 1, editor.getLength()), 0, 'silent');
          return false;
        }

        if (text === '*') {
          const lineStart = pos - (range?.offset ?? 0);
          editor.deleteText(lineStart, line.length(), 'user');
          editor.formatLine(lineStart, 1, 'list', 'bullet');
          const html = editor.root.innerHTML;
          descriptionRef.current = html;
          lastSyncedDescriptionRef.current = html;
          onDescriptionChange(html);
          editor.setSelection(Math.min(lineStart, editor.getLength()), 0, 'silent');
          return false;
        }

        return true;
      } catch (e) {
        console.error('quill enter handler failed', e);
        return true;
      }
    };

    const binding = editor.keyboard.addBinding({ key: enterKey as any }, handler);

    return () => {
      const arr = (editor.keyboard as any).bindings?.[enterKey];
      if (!arr) return;
      (editor.keyboard as any).bindings[enterKey] = arr.filter((b: any) => b !== binding);
    };
  }, [onDescriptionChange]);

  // 외부 description이 바뀌면 quill sync 처리
  React.useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;
    const root = editor.root as HTMLElement;
    const currentHtml = root.innerHTML;

    if (currentHtml.trim() === description.trim()) {
      lastSyncedDescriptionRef.current = description;
      return;
    }

    const prevScroll = root.scrollTop;
    const selection = editor.getSelection();
    editor.setContents(editor.clipboard.convert(description), 'silent');
    if (selection) editor.setSelection(selection.index, selection.length ?? 0, 'silent');
    root.scrollTop = prevScroll;
    lastSyncedDescriptionRef.current = description;
  }, [description]);

  const handleDescriptionChange = (value: string) => {
    onDescriptionChange(value);
    lastSyncedDescriptionRef.current = value;
  };

  const plainDescription = React.useMemo(() => {
    if (!description) return '';
    return description
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }, [description]);

  return {
    quillRef,
    imageInputRef,
    pageRef,
    quillModules,
    quillFormats,
    handleImageFileChange,
    handleDescriptionChange,
    plainDescription,
  };
}
