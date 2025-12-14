import React from 'react';
import { useRouter } from 'next/router';

import useAutosaveDraft from '../../hooks/useAutosaveDraft';
import usePreferredSync from '../../hooks/usePreferredSync';
import useQuillImages from '../../hooks/useQuillImages';
import { useIdeaStore } from '../store/IdeaStore';
import { DEFAULT_TEAM_COUNTS, INTRO_MAX_LENGTH, TITLE_MAX_LENGTH } from './constants';
import { TeamRole } from './IdeaFormUtils';
import IdeaFormView from './IdeaFormView';

export interface Props {
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
  topicOptions?: string[];
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

export default function IdeaForm(props: Props) {
  const {
    form,
    topicOptions,
    onChange,
    onRegister,
    onPreview,
    onDescriptionChange,
    lastSavedAt,
    isSaving,
    onModalStateChange,
  } = props;

  const router = useRouter();
  const addIdea = useIdeaStore(s => s.addIdea);

  const team = React.useMemo(() => ({ ...DEFAULT_TEAM_COUNTS, ...(form.team ?? {}) }), [form.team]);

  const applyLengthLimit = React.useCallback((name: string, value: string) => {
    if (name === 'title') return value.slice(0, TITLE_MAX_LENGTH);
    if (name === 'intro') return value.slice(0, INTRO_MAX_LENGTH);
    return value;
  }, []);

  const emitFieldChange = React.useCallback(
    (name: string, value: string) => {
      const limitedValue = applyLengthLimit(name, value);
      const synthetic = {
        target: { name, value: limitedValue },
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
      onChange(synthetic);
    },
    [applyLengthLimit, onChange]
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const limitedValue = applyLengthLimit(name, value);

      if (limitedValue !== value) {
        emitFieldChange(name, limitedValue);
        return;
      }

      onChange(e);
    },
    [applyLengthLimit, emitFieldChange, onChange]
  );

  // 1) preferredPart ↔ team 자동 동기화
  const { preferredRoleKey, radioRenderVersion, handlePreferredPartSelect } = usePreferredSync({
    preferredPart: form.preferredPart ?? '',
    team,
    emitFieldChange,
  });

  // 2) Draft + Autosave + Draft-modal
  const {
    isDraftModalOpen,
    draftPayload,
    localSavedAt,
    localIsSaving,
    handleLoadDraft,
    handleSkipDraft,
  } = useAutosaveDraft({
    form,
    emitFieldChange,
    onDescriptionChange,
    lastSavedAt,
    isSaving,
  });

  // 3) Quill + 이미지 업로드(툴바/드랍/붙여넣기)
  const {
    quillRef,
    imageInputRef,
    pageRef,
    quillModules,
    quillFormats,
    handleImageFileChange,
    handleDescriptionChange,
    plainDescription,
  } = useQuillImages({
    description: form.description ?? '',
    onDescriptionChange,
  });

  const title = form.title ?? '';
  const intro = form.intro ?? '';
  const topic = form.topic ?? '';
  const preferredPart = form.preferredPart ?? '';

  const isSubmitDisabled =
    !title.trim() ||
    !intro.trim() ||
    !topic.trim() ||
    plainDescription.length === 0 ||
    title.length > TITLE_MAX_LENGTH ||
    intro.length > INTRO_MAX_LENGTH;

  const [modalState, setModalState] = React.useState<'idle' | 'confirm' | 'success'>('idle');
  const isAnyModalOpen = modalState !== 'idle' || isDraftModalOpen;

  React.useEffect(() => {
    onModalStateChange?.(isAnyModalOpen);
    return () => onModalStateChange?.(false);
  }, [isAnyModalOpen, onModalStateChange]);

  React.useEffect(() => {
    const className = 'ideaform-modal-open';
    const { body } = document;

    if (isAnyModalOpen) {
      body.classList.add(className);
    } else {
      body.classList.remove(className);
    }

    return () => {
      body.classList.remove(className);
    };
  }, [isAnyModalOpen]);

  const handleModalDone = React.useCallback(async () => {
    try {
      if (onRegister) {
        await onRegister();
      } else {
        const teamCounts = form.team ?? {};
        const teamTotal = Object.values(teamCounts).reduce((s, c) => s + (c ?? 0), 0);
        const totalMembers =
          teamTotal > 0 ? teamTotal : form.totalMembers > 0 ? form.totalMembers : 1;

        const created = addIdea({
          topic,
          title,
          intro,
          description: form.description,
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

        sessionStorage.setItem('completedIdea', JSON.stringify(created));
      }

      router.push('/WelcomeOpen');
    } catch (error) {
      console.error('아이디어 등록 실패', error);
    } finally {
      setModalState('idle');
    }
  }, [addIdea, form, intro, onRegister, preferredPart, router, title, topic]);

  const handlePreviewClick = React.useCallback(() => {
    onPreview?.();
    sessionStorage.setItem(
      'ideaFormData',
      JSON.stringify({ form, savedAt: new Date().toISOString() })
    );
    router.push('/IdeaPreview');
  }, [form, onPreview, router]);

  return (
    <IdeaFormView
      // data
      form={form}
      team={team}
      topicOptions={topicOptions}
      preferredRoleKey={preferredRoleKey}
      radioRenderVersion={radioRenderVersion}
      // handlers
      onChange={handleChange}
      emitFieldChange={emitFieldChange}
      onTopicSelect={(selected: any[]) => emitFieldChange('topic', selected[0] ?? '')}
      onPreferredPartSelect={handlePreferredPartSelect}
      onTeamAdjust={(key: any, next: any) => emitFieldChange(`team.${key}`, String(next))}
      onDescriptionChange={handleDescriptionChange}
      onPreview={handlePreviewClick}
      onOpenSubmitModal={() => setModalState('confirm')}
      onConfirmSubmit={() => setModalState('success')}
      onCloseModal={() => setModalState('idle')}
      onModalDone={handleModalDone}
      // quill
      quillRef={quillRef}
      pageRef={pageRef}
      imageInputRef={imageInputRef}
      onImageFileChange={handleImageFileChange}
      quillModules={quillModules}
      quillFormats={quillFormats}
      // ui state
      isSubmitDisabled={isSubmitDisabled}
      modalState={modalState}
      // draft
      isDraftModalOpen={isDraftModalOpen}
      draftSavedAt={draftPayload?.savedAt ?? localSavedAt ?? null}
      onLoadDraft={handleLoadDraft}
      onSkipDraft={handleSkipDraft}
      // autosave text
      autoSaveSaving={Boolean(isSaving ?? localIsSaving)}
      autoSaveSavedAt={lastSavedAt ?? localSavedAt ?? ''}
    />
  );
}
