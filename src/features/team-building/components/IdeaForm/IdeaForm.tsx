import React from 'react';
import { useRouter } from 'next/router';

import useAutosaveDraft from '../../hooks/useAutosaveDraft';
import usePreferredSync from '../../hooks/usePreferredSync';
import { useIdeaStore } from '../store/IdeaStore';
import { DEFAULT_TEAM_COUNTS, INTRO_MAX_LENGTH, TITLE_MAX_LENGTH } from './constants';
import { TeamRole } from './IdeaFormUtils';
import IdeaFormView, { LABEL_TO_ROLE_MAP, ROLE_LABEL_MAP } from './IdeaFormView';

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
  enabledTeamRoles?: TeamRole[];
  maxMemberCount?: number | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSave: () => void;
  onRegister?: () => Promise<boolean> | boolean;
  onPreview: () => void;
  onDescriptionChange: (value: string) => void;
  onBack?: () => void;
  lastSavedAt?: string;
  isSaving?: boolean;
  onModalStateChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  onComplete?: () => void;
  lockComposition?: boolean;
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
    enabledTeamRoles,
    maxMemberCount,
    mode = 'create',
    onComplete,
    lockComposition = false,
  } = props;

  const router = useRouter();
  const addIdea = useIdeaStore(s => s.addIdea);

  const team = React.useMemo(() => ({ ...DEFAULT_TEAM_COUNTS, ...(form.team ?? {}) }), [form.team]);

  const isRoleEnabled = (role: TeamRole) => {
    if (!enabledTeamRoles) return true; // configurations 안 쓰는 경우
    return enabledTeamRoles.includes(role);
  };

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

  const title = form.title ?? '';
  const intro = form.intro ?? '';
  const topic = form.topic ?? '';
  const preferredPart = form.preferredPart ?? '';

  const isSubmitDisabled =
    !title.trim() ||
    !intro.trim() ||
    !topic.trim() ||
    (form.description ?? '').trim().length === 0 ||
    title.length > TITLE_MAX_LENGTH ||
    intro.length > INTRO_MAX_LENGTH;

  const [modalState, setModalState] = React.useState<'idle' | 'confirm' | 'success'>('idle');
  const [isSubmittingInModal, setIsSubmittingInModal] = React.useState(false);
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

  React.useEffect(() => {
    if (!enabledTeamRoles || enabledTeamRoles.length === 0) return;

    const current = form.preferredPart;
    if (!current) return;

    const role = LABEL_TO_ROLE_MAP[current];
    if (!role) return;

    if (!enabledTeamRoles.includes(role)) {
      const firstAllowedLabel = ROLE_LABEL_MAP[enabledTeamRoles[0]];

      emitFieldChange('preferredPart', firstAllowedLabel);
    }
  }, [enabledTeamRoles, form.preferredPart, emitFieldChange]);

  /**
   * confirm 모달에서 "예"를 눌렀을 때:
   * - 여기서 onRegister를 실행한다.
   * - 성공(true)일 때만 success 모달로 전환한다.
   * - 실패(false)면 success 모달 없이 닫는다.
   */
  const handleConfirmSubmit = React.useCallback(async () => {
    if (isSubmittingInModal) return;

    setIsSubmittingInModal(true);
    try {
      if (onRegister) {
        const ok = await onRegister();
        if (!ok) {
          setModalState('idle'); // 실패면 성공모달 없이 닫기
          return;
        }
      } else {
        // create + 로컬스토어/스토어 기반 (기존 로직 유지)
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

      // 성공일 때만
      setModalState('success');
    } catch {
      // onRegister 내부에서 alert 처리해도 됨
      setModalState('idle');
    } finally {
      setIsSubmittingInModal(false);
    }
  }, [isSubmittingInModal, onRegister, form, addIdea, topic, title, intro, preferredPart]);

  /**
   * success 모달의 "확인" 버튼
   * - 여기서는 절대 onRegister를 다시 호출하지 않는다.
   * - 완료 후 이동만 한다.
   */
  const handleModalDone = React.useCallback(() => {
    try {
      if (mode === 'edit') {
        // edit은 상세로 이동하는 게 목적이므로 onComplete 우선
        if (onComplete) {
          onComplete();
          return;
        }
        // onComplete가 없으면 fallback (원하면 수정 가능)
        router.push('/WelcomeOpen');
        return;
      }

      // create는 기존대로
      if (onComplete) onComplete();
      router.push('/WelcomeOpen');
    } finally {
      setModalState('idle');
    }
  }, [mode, onComplete, router]);

  const handlePreviewClick = React.useCallback(() => {
    // ✅ 부모가 create/edit에 맞게 sessionStorage 세팅하도록 맡김
    onPreview?.();

    // ✅ 폼 데이터는 공통 저장
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
      isRoleEnabled={isRoleEnabled}
      maxMemberCount={maxMemberCount}
      enabledTeamRoles={enabledTeamRoles}
      // handlers
      onChange={handleChange}
      emitFieldChange={emitFieldChange}
      onTopicSelect={(selected: any[]) => emitFieldChange('topic', selected[0] ?? '')}
      onPreferredPartSelect={handlePreferredPartSelect}
      onTeamAdjust={(key: any, next: any) => emitFieldChange(`team.${key}`, String(next))}
      onDescriptionChange={onDescriptionChange}
      onPreview={handlePreviewClick}
      onOpenSubmitModal={() => setModalState('confirm')}
      onConfirmSubmit={handleConfirmSubmit}
      onCloseModal={() => setModalState('idle')}
      onModalDone={handleModalDone}
      mode={mode}
      lockComposition={lockComposition}
      // ui state
      isSubmitDisabled={isSubmitDisabled}
      modalState={modalState}
      // draft
      isDraftModalOpen={isDraftModalOpen}
      draftSavedAt={draftPayload?.savedAt ?? localSavedAt ?? null}
      onLoadDraft={handleLoadDraft}
      onSkipDraft={handleSkipDraft}
      // autosave
      autoSaveSaving={Boolean(isSaving ?? localIsSaving)}
      autoSaveSavedAt={lastSavedAt ?? localSavedAt ?? ''}
    />
  );
}
