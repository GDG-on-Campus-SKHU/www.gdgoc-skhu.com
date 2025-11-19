import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type ReactQuillType from 'react-quill';
import type { ReactQuillProps } from 'react-quill';
import styled, { css } from 'styled-components';

import Radio from '../../../features/team-building/components/Radio';
import SelectBoxBasic from '../../../features/team-building/components/SelectBoxBasic';
import { colors } from '../../../styles/constants';
import { useIdeaStore } from '../store/IdeaStore';
import { sanitizeDescription } from '../utils/sanitizeDescription';
import { PREFERRED_OPTIONS, TEAM_ROLES } from './IdeaFormUtils';

import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
}) as unknown as React.ForwardRefExoticComponent<
  ReactQuillProps & React.RefAttributes<ReactQuillType>
>;

const MOBILE_BREAKPOINT = '900px';
const SMALL_BREAKPOINT = '600px';

const TOPIC_PLACEHOLDER = '주제를 선택해주세요.';
const TOPIC_OPTIONS = ['전체', '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'];
const RECRUITING_STATUS = '모집 중';
const CLOSED_STATUS = '모집 마감';

type TeamRole = (typeof TEAM_ROLES)[number]['key'];
const TITLE_MAX_LENGTH = 20;
const INTRO_MAX_LENGTH = 50;
const DEFAULT_TEAM_COUNTS: Record<TeamRole, number> = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};
const AUTO_SAVE_PLACEHOLDER = '임시저장 완료 0000.00.00 00:00';
const SESSION_DRAFT_KEY = 'ideaFormData';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const formatSavedAt = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

interface SessionDraftPayload {
  form: Props['form'];
  savedAt?: string;
}

const PageContainer = styled.div<{ $isModalOpen?: boolean }>`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 120px;
  position: relative;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 32px 1.25rem 100px;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    padding: 28px 1rem 80px;
  }

  /* 모달이 열렸을 때 배경 blur 처리 */
  ${({ $isModalOpen }) =>
    $isModalOpen &&
    `
    &::before {
      content: "";
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(6px);
      z-index: 9998;
      pointer-events: none;
    }
  `}
`;

const FormContainer = styled.div`
  width: min(1080px, 100%);
  display: flex;
  flex-direction: column;
  gap: 40px;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 40px 0 20px;
  border-bottom: 0;
  gap: 12px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 0 20px;
  }
`;

const SectionTitle = styled.h2`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

const AutoSaveStatus = styled.span.attrs({
  role: 'status',
  'aria-live': 'polite',
})<{ $saving: boolean }>`
  color: var(--grayscale-1000, #040405);
  text-align: right;

  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const FieldHint = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const FieldCounter = styled.span<{ $isOver?: boolean; $isActive?: boolean; $hasValue?: boolean }>`
  color: ${({ $isOver, $isActive, $hasValue }) =>
    $isOver
      ? '#EA4335'
      : $isActive || $hasValue
        ? 'var(--grayscale-1000, #040405)'
        : 'var(--grayscale-500, #979ca5)'};

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const inputStyle = css`
  width: 100%;
  border: none;
  background: transparent;
  color: #9e9e9e;
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  line-height: 160%;
  padding: 0;
  margin: 0;
  &:focus {
    outline: none;
  }
`;

const FieldInputWrapper = styled.div<{ $isOver?: boolean }>`
  width: 100%;
  height: 3rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid ${({ $isOver }) => ($isOver ? '#EA4335' : '#e0e0e0')};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: ${({ $isOver }) => ($isOver ? '#EA4335' : colors.gdscBlue)};
  }

  &.open {
    border-color: ${colors.gdscBlue};
  }
`;

const Input = styled.input`
  ${inputStyle}
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 25.6px */
`;

const SelectWrapper = styled.div`
  display: flex;

  width: 480px;
  background: transparent;
  border: none;
  position: relative;
  align-items: flex-start;
  gap: 4px;

  & > div > div:first-child {
    position: relative;
    padding-right: 48px;
  }

  & > div > div:first-child::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background-image: url('/dropdownarrow.svg');

    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
    transition: transform 0.2s ease;
  }

  /* 열렸을 때 화살표 회전 */
  & > div > div:first-child.open::after {
    transform: translateY(-50%) rotate(180deg);
  }

  /* 기본 화살표 숨기기 */
  img,
  svg {
    display: none !important;
  }
`;

const PreferredSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PreferredHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TeamSection = styled.section`
  display: flex;
  width: 600px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const TeamHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TeamTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 160%; /* 32px */
  color: #040405;
`;

const TeamHint = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TeamRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 280px;
  height: 50px;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
  }
`;

const TeamLabel = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 160%;
  color: #040405;
`;

const TeamControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const StepButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #4285f4;
  background: #ffffff;
  color: #4285f4;
  font-size: 18px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      border-color: #e0e2e5;
      background: #e0e2e5;
      color: #c3c6cb;
      cursor: not-allowed;
    `}
`;

const TeamCount = styled.span`
  width: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 160%;
  color: #000000;
`;

const TextAreaWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  align-self: stretch;
  width: 100%;
  height: 400px;
  padding: 12px 16px;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
`;

const QuillWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  min-height: 0;

  .ql-toolbar.ql-snow {
    border: none;
    border-bottom: 1px solid #c3c6cb;
    padding: 0 0 4px;
  }

  .ql-container.ql-snow {
    border: none;
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ql-editor {
    flex: 1;
    min-height: 0;
    font-size: 16px;
    line-height: 1.6;
    /* add extra top padding so caret/input starts one line lower (matches placeholder leading newline) */
    padding: 36px 0 36px 0;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .ql-editor img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .ql-editor.ql-blank::before {
    color: var(--grayscale-500, #979ca5);
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
    white-space: pre-line;
    left: 0 !important;
    padding-left: 0;
  }

  .ql-editor p {
    padding-left: 0;
    margin-left: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 20px;
  max-width: 616px;
  width: 100%;
  margin: 0 auto;
`;

const ButtonBase = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */

  cursor: pointer;
  border: none;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    width: 100%;
  }
`;

const PreviewButton = styled(ButtonBase)<{ disabled?: boolean }>`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  ${({ disabled }) =>
    disabled &&
    css`
      border-color: #e0e2e5;
      color: #c3c6cb;
      cursor: not-allowed;
      background: #f3f4f6;
    `}
`;

const SubmitButton = styled(ButtonBase)<{ disabled?: boolean }>`
  background: ${({ disabled }) => (disabled ? '#e0e2e5' : '#4285f4')};
  color: ${({ disabled }) => (disabled ? '#c3c6cb' : '#ffffff')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalCard = styled.div`
  display: flex;
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%; /* 38.4px */
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  width: 460px;
  height: 50px;
  padding: 10px 8px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  height: 50px;
  border: ${({ $variant }) => ($variant === 'secondary' ? '1.5px solid #4285F4' : 'none')};
  background: ${({ $variant }) => ($variant === 'secondary' ? '#fff' : '#4285F4')};
  color: ${({ $variant }) => ($variant === 'secondary' ? '#4285F4' : '#fff')};
  transition: 0.2s ease;
  &:hover {
    filter: brightness(0.97);
  }
`;

interface Props {
  form: {
    totalMembers: number;
    currentMembers: number;
    topic: string;
    title: string;
    intro: string;
    description: string;
    preferredPart: string;
    status: '모집 중' | '모집 마감';
    team: Partial<Record<TeamRole, number>>;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
  onRegister?: () => Promise<number | void> | number | void;
  onPreview: () => void;
  onDescriptionChange: (value: string) => void;
  onBack?: () => void;
  lastSavedAt?: string;
  isSaving?: boolean;
  onModalStateChange?: (open: boolean) => void;
}

const quillToolbarOptions = [
  [{ header: [false, 1, 2, 3] }],
  [{ align: [] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
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

export default function IdeaForm({
  form,
  onChange,
  onRegister,
  onPreview,
  onDescriptionChange,
  onBack: _onBack,
  lastSavedAt,
  isSaving,
  onModalStateChange,
}: Props) {
  const router = useRouter();
  const addIdea = useIdeaStore(state => state.addIdea);
  const { topic = '', title = '', intro = '', description = '', preferredPart = '' } = form ?? {};
  const [localSavedAt, setLocalSavedAt] = React.useState<string | null>(null);
  const [localIsSaving, setLocalIsSaving] = React.useState(false);
  const autoSaveTimerRef = React.useRef<number | null>(null);
  const [draftPayload, setDraftPayload] = React.useState<SessionDraftPayload | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = React.useState(false);
  const team = React.useMemo(
    () => ({
      ...DEFAULT_TEAM_COUNTS,
      ...(form.team ?? {}),
    }),
    [form.team]
  );
  const [modalState, setModalState] = React.useState<'idle' | 'confirm' | 'success'>('idle');
  const preferredRoleKey = React.useMemo<TeamRole | null>(() => {
    const role = TEAM_ROLES.find(item => item.label === preferredPart);
    return role ? role.key : null;
  }, [preferredPart]);
  const [radioRenderVersion, setRadioRenderVersion] = React.useState(0);

  const safeDescription = sanitizeDescription(description ?? '', { convertMarkdown: false });

  const quillRef = React.useRef<ReactQuillType | null>(null);
  const lastSyncedDescriptionRef = React.useRef<string>(safeDescription);
  const hasCheckedDraftRef = React.useRef(false);
  const autoSaveMessage = React.useMemo(() => {
    const saving = isSaving ?? localIsSaving;
    const savedAt = lastSavedAt ?? localSavedAt;
    if (saving) return '임시저장 중...';
    if (savedAt) return `임시저장 완료 ${savedAt}`;
    return '';
  }, [isSaving, lastSavedAt, localIsSaving, localSavedAt]);

  const emitFieldChange = React.useCallback(
    (name: string, value: string) => {
      const syntheticEvent = {
        target: {
          name,
          value,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    },
    [onChange]
  );
  const handleTopicSelectChange = React.useCallback(
    (selected: string[]) => {
      emitFieldChange('topic', selected[0] ?? '');
    },
    [emitFieldChange]
  );
  const syncPreferredPartRadio = React.useCallback(() => {
    setRadioRenderVersion(prev => prev + 1);
  }, []);
  const previousPreferredRoleRef = React.useRef<TeamRole | null>(preferredRoleKey);
  const skipPreferredRoleSyncRef = React.useRef(false);
  const [activeField, setActiveField] = React.useState<'title' | 'intro' | null>(null);
  const isTitleActive = activeField === 'title';
  const isIntroActive = activeField === 'intro';
  const hasTitleValue = (title?.length ?? 0) > 0;
  const hasIntroValue = (intro?.length ?? 0) > 0;
  const handleImageUpload = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const editor = quillRef.current?.getEditor?.();
    if (!editor) return;

    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    window.document.body.appendChild(input);

    const cleanup = () => {
      window.removeEventListener('focus', cleanup);
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    input.onchange = () => {
      const file = input.files?.[0];
      cleanup();
      if (!file) return;

      if (file.size > MAX_IMAGE_SIZE) {
        window.alert('이미지는 최대 5MB까지 첨부할 수 있습니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') return;
        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();
        editor.insertEmbed(index, 'image', result, 'user');
        editor.setSelection(index + 1, 0, 'silent');
      };
      reader.readAsDataURL(file);
    };

    window.addEventListener('focus', cleanup, { once: true });
    input.click();
  }, []);
  const quillModules = React.useMemo(
    () => ({
      toolbar: {
        container: quillToolbarOptions,
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [handleImageUpload]
  );

  const handlePreferredPartSelect = React.useCallback(
    (option: (typeof PREFERRED_OPTIONS)[number], checked: boolean) => {
      if (!checked) {
        syncPreferredPartRadio();
        return;
      }

      if (preferredPart === option) {
        syncPreferredPartRadio();
        return;
      }

      const nextRole = TEAM_ROLES.find(item => item.label === option)?.key ?? null;
      const previousRole = preferredRoleKey;

      let syncedManually = false;

      if (nextRole) {
        const currentNextCount = team[nextRole] ?? 0;
        const ensuredNextCount = currentNextCount + 1;
        if (ensuredNextCount !== currentNextCount) {
          emitFieldChange(`team.${nextRole}`, String(ensuredNextCount));
          syncedManually = true;
        }
      }

      if (previousRole && previousRole !== nextRole) {
        const prevCount = team[previousRole] ?? 0;
        if (prevCount > 0) {
          emitFieldChange(`team.${previousRole}`, String(Math.max(0, prevCount - 1)));
          syncedManually = true;
        }
      }

      emitFieldChange('preferredPart', option);
      if (syncedManually) {
        skipPreferredRoleSyncRef.current = true;
      }
    },
    [emitFieldChange, preferredPart, preferredRoleKey, syncPreferredPartRadio, team]
  );

  React.useEffect(() => {
    syncPreferredPartRadio();
  }, [preferredPart, syncPreferredPartRadio]);

  React.useEffect(() => {
    const updates: Array<{ key: TeamRole; value: number }> = [];
    const currentRole = preferredRoleKey;
    const previousRole = previousPreferredRoleRef.current;

    if (skipPreferredRoleSyncRef.current) {
      skipPreferredRoleSyncRef.current = false;
      previousPreferredRoleRef.current = currentRole ?? null;
      return;
    }

    if (currentRole) {
      const currentCount = team[currentRole] ?? 0;
      const shouldAddAuthor = currentCount === 0;
      if (shouldAddAuthor) {
        const nextValue = currentCount + 1;
        if (nextValue !== currentCount) {
          updates.push({ key: currentRole, value: nextValue });
        }
      }
    }

    if (previousRole && previousRole !== currentRole) {
      const prevCount = team[previousRole] ?? 0;
      if (prevCount > 0) {
        updates.push({ key: previousRole, value: Math.max(0, prevCount - 1) });
      }
    }

    if (updates.length) {
      updates.forEach(update => {
        emitFieldChange(`team.${update.key}`, String(update.value));
      });
    }

    previousPreferredRoleRef.current = currentRole ?? null;
  });

  const syncEditorContent = React.useCallback((html: string) => {
    const instance = quillRef.current;
    if (!instance?.getEditor) return;
    const editor = instance.getEditor();
    const currentHtml = editor.root.innerHTML;
    if (currentHtml === html) return;

    const selection = editor.getSelection();
    const delta = editor.clipboard.convert(html);
    editor.setContents(delta, 'silent');

    if (selection) {
      const length = editor.getLength();
      const index = Math.min(selection.index, Math.max(length - 1, 0));
      editor.setSelection(index, selection.length, 'silent');
    }
  }, []);

  React.useEffect(() => {
    if (!quillRef.current?.getEditor) return;
    if (lastSyncedDescriptionRef.current === safeDescription) return;

    const editor = quillRef.current.getEditor();
    const currentHtml = editor.root.innerHTML;

    if (currentHtml === safeDescription) {
      lastSyncedDescriptionRef.current = safeDescription;
      return;
    }

    syncEditorContent(safeDescription);
    lastSyncedDescriptionRef.current = safeDescription;
  }, [safeDescription, syncEditorContent]);

  const handleDescriptionChange = (value: string) => {
    const sanitized = sanitizeDescription(value, { convertMarkdown: false });
    if (sanitized !== value) syncEditorContent(sanitized);
    onDescriptionChange(sanitized);
    lastSyncedDescriptionRef.current = sanitized;
  };

  const plainDescription = React.useMemo(() => {
    if (!safeDescription) return '';
    return safeDescription
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();
  }, [safeDescription]);

  const isOverCharLimit =
    (title?.length ?? 0) > TITLE_MAX_LENGTH || (intro?.length ?? 0) > INTRO_MAX_LENGTH;
  const isSubmitDisabled =
    !(title ?? '').trim() ||
    !(intro ?? '').trim() ||
    !(topic ?? '').trim() ||
    plainDescription.length === 0 ||
    (title?.length ?? 0) > TITLE_MAX_LENGTH ||
    (intro?.length ?? 0) > INTRO_MAX_LENGTH;

  const handleRegisterClick = React.useCallback(() => {
    if (isSubmitDisabled) return;
    setModalState('confirm');
  }, [isSubmitDisabled]);
  React.useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(modalState !== 'idle');
    }
    return () => {
      if (onModalStateChange) {
        onModalStateChange(false);
      }
    };
  }, [modalState, onModalStateChange]);

  const handleModalConfirm = React.useCallback(() => {
    setModalState('success');
  }, []);

  const handleModalCancel = React.useCallback(() => {
    setModalState('idle');
  }, []);

  const handleModalDone = React.useCallback(async () => {
    setModalState('idle');
    if (onRegister) {
      await onRegister();
    } else {
      const teamCounts = form.team ?? {};
      const teamTotal = Object.values(teamCounts).reduce((sum, count) => sum + (count ?? 0), 0);
      const totalMembers =
        teamTotal > 0
          ? teamTotal
          : form.totalMembers && form.totalMembers > 0
            ? form.totalMembers
            : 1;
      const created = addIdea({
        topic,
        title,
        intro,
        description,
        preferredPart,
        team: {
          planning: teamCounts.planning ?? 0,
          design: teamCounts.design ?? 0,
          frontendWeb: teamCounts.frontendWeb ?? 0,
          frontendMobile: teamCounts.frontendMobile ?? 0,
          backend: teamCounts.backend ?? 0,
          aiMl: teamCounts.aiMl ?? 0,
        },
        totalMembers,
        currentMembers: form.currentMembers ?? 0,
      });
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('completedIdea', JSON.stringify(created));
      }
    }
    router.push('/feature/team-building/WelcomeOpen');
  }, [
    addIdea,
    description,
    form.currentMembers,
    form.team,
    form.totalMembers,
    intro,
    onRegister,
    preferredPart,
    router,
    title,
    topic,
  ]);

  React.useEffect(() => {
    const shouldHandleInternally = lastSavedAt === undefined && isSaving === undefined;
    if (!shouldHandleInternally) return;
    if (typeof window === 'undefined') return;

    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
    }

    setLocalIsSaving(true);
    autoSaveTimerRef.current = window.setTimeout(() => {
      const now = new Date();
      const payload: SessionDraftPayload = {
        form: {
          ...form,
          team: { ...form.team },
        },
        savedAt: now.toISOString(),
      };
      try {
        window.sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(payload));
        const formatted = formatSavedAt(payload.savedAt);
        setLocalSavedAt(formatted);
      } catch (error) {
        console.error('Failed to autosave draft', error);
      } finally {
        setLocalIsSaving(false);
        autoSaveTimerRef.current = null;
      }
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) {
        window.clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [form, isSaving, lastSavedAt]);

  React.useEffect(() => {
    if (hasCheckedDraftRef.current) return;
    hasCheckedDraftRef.current = true;
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem(SESSION_DRAFT_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as SessionDraftPayload | null;
      const draft = parsed?.form ?? (parsed as unknown as Props['form']);
      if (!draft) return;
      const hasContent =
        !!draft.title?.trim() ||
        !!draft.intro?.trim() ||
        !!draft.description?.trim() ||
        !!draft.topic?.trim() ||
        !!draft.preferredPart?.trim() ||
        Object.values(draft.team ?? {}).some(count => (count ?? 0) > 0);
      if (!hasContent) return;
      const savedAt = formatSavedAt(parsed?.savedAt);
      if (savedAt) {
        setLocalSavedAt(savedAt);
      }
      setDraftPayload(parsed?.form ? parsed : { form: draft });
      setIsDraftModalOpen(true);
    } catch (error) {
      console.error('Failed to read draft from sessionStorage', error);
    }
  }, []);

  const handleLoadDraft = React.useCallback(() => {
    const draftData = draftPayload?.form;
    if (!draftData) {
      setIsDraftModalOpen(false);
      return;
    }
    if (draftData.title !== undefined) emitFieldChange('title', draftData.title);
    if (draftData.intro !== undefined) emitFieldChange('intro', draftData.intro);
    if (draftData.topic !== undefined) emitFieldChange('topic', draftData.topic);
    if (draftData.preferredPart !== undefined)
      emitFieldChange('preferredPart', draftData.preferredPart);
    if (draftData.description !== undefined) onDescriptionChange(draftData.description);
    if (draftData.status !== undefined) emitFieldChange('status', draftData.status);
    const keys: TeamRole[] = [
      'planning',
      'design',
      'frontendWeb',
      'frontendMobile',
      'backend',
      'aiMl',
    ];
    keys.forEach(key => {
      const value = draftData.team?.[key];
      if (typeof value === 'number') {
        emitFieldChange(`team.${key}`, String(value));
      }
    });
    setIsDraftModalOpen(false);
  }, [draftPayload, emitFieldChange, onDescriptionChange]);

  const handleSkipDraft = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_DRAFT_KEY);
    }
    setIsDraftModalOpen(false);
  }, []);

  const autoSaveDisplay = autoSaveMessage || AUTO_SAVE_PLACEHOLDER;
  const handlePreviewClick = React.useCallback(() => {
    if (onPreview) {
      onPreview();
      return;
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('ideaFormData', JSON.stringify(form));
    }
    router.push('/feature/team-building/IdeaPreview');
  }, [form, onPreview, router]);
  const formatCounter = (value: string, limit: number) =>
    `${Math.min(value.length, limit)}/${limit}`;
  const titleCounter = formatCounter(title, TITLE_MAX_LENGTH);
  const introCounter = formatCounter(intro, INTRO_MAX_LENGTH);
  return (
    <PageContainer>
      <FormContainer>
        <HeaderRow>
          <SectionTitle>아이디어 작성</SectionTitle>
          <AutoSaveStatus $saving={Boolean(isSaving ?? localIsSaving)}>
            {autoSaveDisplay}
          </AutoSaveStatus>
        </HeaderRow>

        {isDraftModalOpen && (
          <ModalOverlay>
            <ModalCard>
              <ModalTitle>
                {formatSavedAt(draftPayload?.savedAt) ?? localSavedAt ?? '최근'}에 저장된 글이
                있습니다.
                <br />
                불러오시겠습니까?
              </ModalTitle>
              <ModalActions>
                <ModalButton type="button" onClick={handleLoadDraft}>
                  예
                </ModalButton>
                <ModalButton type="button" $variant="secondary" onClick={handleSkipDraft}>
                  아니오
                </ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}

        <FormSection>
          <FieldSet>
            <FieldHeader>
              <FieldLabel htmlFor="title">아이디어 제목</FieldLabel>
              <FieldCounter
                $isOver={(title?.length ?? 0) > TITLE_MAX_LENGTH}
                $isActive={isTitleActive}
                $hasValue={hasTitleValue}
              >
                {titleCounter}
              </FieldCounter>
            </FieldHeader>
            <FieldInputWrapper $isOver={(title?.length ?? 0) > TITLE_MAX_LENGTH}>
              <Input
                id="title"
                name="title"
                value={title ?? ''}
                onChange={onChange}
                onFocus={() => setActiveField('title')}
                onBlur={() => setActiveField(prev => (prev === 'title' ? null : prev))}
                placeholder="제목을 입력해주세요."
              />
            </FieldInputWrapper>
          </FieldSet>

          <FieldSet>
            <FieldHeader>
              <FieldLabel htmlFor="intro">아이디어 한 줄 소개</FieldLabel>
              <FieldCounter
                $isOver={(intro?.length ?? 0) > INTRO_MAX_LENGTH}
                $isActive={isIntroActive}
                $hasValue={hasIntroValue}
              >
                {introCounter}
              </FieldCounter>
            </FieldHeader>

            <FieldInputWrapper $isOver={(intro?.length ?? 0) > INTRO_MAX_LENGTH}>
              <Input
                id="intro"
                name="intro"
                value={intro ?? ''}
                onChange={onChange}
                onFocus={() => setActiveField('intro')}
                onBlur={() => setActiveField(prev => (prev === 'intro' ? null : prev))}
                placeholder="아이디어를 간단하게 소개해주세요."
              />
            </FieldInputWrapper>
          </FieldSet>

          <FieldSet>
            <FieldLabel id="topic-label">아이디어 주제</FieldLabel>
            <SelectWrapper role="group" aria-labelledby="topic-label">
              <SelectBoxBasic
                options={TOPIC_OPTIONS}
                placeholder={TOPIC_PLACEHOLDER}
                multiple={false}
                searchable={false}
                onChange={handleTopicSelectChange}
              />
            </SelectWrapper>
          </FieldSet>
        </FormSection>

        <PreferredSection>
          <PreferredHeading>
            <FieldLabel as="span">작성자의 파트</FieldLabel>
            <FieldHint>하나의 파트만 선택할 수 있습니다.</FieldHint>
          </PreferredHeading>
          <RadioGroup>
            {PREFERRED_OPTIONS.map(option => (
              <Radio
                key={`${option}-${radioRenderVersion}`}
                name="preferredPart"
                label={option}
                checked={preferredPart === option}
                disabled={false}
                onClick={() => handlePreferredPartSelect(option, preferredPart !== option)}
              />
            ))}
          </RadioGroup>
        </PreferredSection>

        <TeamSection>
          <TeamHeading>
            <TeamTitle>팀원 구성</TeamTitle>
            <TeamHint>팀 당 최대 n명까지 가능합니다.</TeamHint>
          </TeamHeading>
          <TeamList>
            {TEAM_ROLES.map(option => {
              const currentCount = team[option.key] ?? 0;
              const handleAdjust = (direction: 'increment' | 'decrement') => {
                const next =
                  direction === 'increment' ? currentCount + 1 : Math.max(0, currentCount - 1);
                if (next === currentCount) return;
                emitFieldChange(`team.${option.key}`, String(next));
              };
              return (
                <TeamRow key={option.key}>
                  <TeamLabel>{option.label}</TeamLabel>
                  <TeamControls>
                    <StepButton
                      type="button"
                      onClick={() => handleAdjust('decrement')}
                      disabled={currentCount <= 0}
                    >
                      -
                    </StepButton>
                    <TeamCount>{currentCount}</TeamCount>
                    <StepButton type="button" onClick={() => handleAdjust('increment')}>
                      +
                    </StepButton>
                  </TeamControls>
                </TeamRow>
              );
            })}
          </TeamList>
        </TeamSection>

        <FieldSet>
          <FieldLabel htmlFor="description">아이디어 설명</FieldLabel>
          <TextAreaWrapper>
            <QuillWrapper>
              <ReactQuill
                ref={quillRef}
                value={safeDescription}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '100%' }}
                placeholder={`Github README 작성에 쓰이는 ‘markdown’을 이용해 작성해보세요.`}
              />
            </QuillWrapper>
          </TextAreaWrapper>
        </FieldSet>

        <ButtonGroup>
          <PreviewButton type="button" onClick={handlePreviewClick} disabled={isOverCharLimit}>
            아이디어 미리보기
          </PreviewButton>
          <SubmitButton type="button" onClick={handleRegisterClick} disabled={isSubmitDisabled}>
            아이디어 등록하기
          </SubmitButton>
        </ButtonGroup>

        {modalState !== 'idle' && (
          <ModalOverlay>
            <ModalCard>
              {modalState === 'confirm' ? (
                <>
                  <ModalTitle>해당 아이디어를 게시하겠습니까?</ModalTitle>
                  <ModalActions>
                    <ModalButton type="button" onClick={handleModalConfirm}>
                      예
                    </ModalButton>
                    <ModalButton type="button" $variant="secondary" onClick={handleModalCancel}>
                      아니오
                    </ModalButton>
                  </ModalActions>
                </>
              ) : (
                <>
                  <ModalTitle>게시가 완료되었습니다.</ModalTitle>
                  <ModalActions>
                    <ModalButton type="button" onClick={handleModalDone}>
                      확인
                    </ModalButton>
                  </ModalActions>
                </>
              )}
            </ModalCard>
          </ModalOverlay>
        )}
      </FormContainer>
    </PageContainer>
  );
}
