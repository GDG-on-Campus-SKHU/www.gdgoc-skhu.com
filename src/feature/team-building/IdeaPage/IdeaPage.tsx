import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '../../../features/team-building/components/Button';
import IdeaComplete from '../IdeaComplete/IdeaComplete';
import IdeaForm from '../IdeaForm/IdeaForm';
import IdeaLayout from '../IdeaLayout/IdeaLayout';
import IdeaPreview from '../IdeaPreview/IdeaPreview';
import { Idea, useIdeaStore } from '../store/IdeaStore';

const DraftModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
`;

const MODAL_BREAKPOINT = '540px';

const DraftModalCard = styled.div`
  display: flex;
  width: min(500px, 90%);
  min-height: 226px;
  padding: 40px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
  font-family: 'Pretendard', sans-serif;
  color: #1f1f1f;
  text-align: center;
`;

const DraftModalText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const DraftModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  line-height: 1.6;
  font-weight: 700;
`;

const DraftModalMessage = styled.p`
  margin: 0;
  font-size: 20px;
  line-height: 1.6;
  font-weight: 700;

  @media (max-width: ${MODAL_BREAKPOINT}) {
    font-size: 0.9rem;
  }
`;

const DraftModalActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;

  @media (max-width: ${MODAL_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DraftModalButton = styled(Button)`
  min-width: 120px;
  flex: 1;

  @media (max-width: ${MODAL_BREAKPOINT}) {
    width: 100%;
    min-width: 0;
  }
`;

type IdeaFormState = {
  topic: string;
  title: string;
  intro: string;
  description: string;
  preferredPart: string;
  status: Idea['status'];
  team: {
    planning: number;
    design: number;
    frontendWeb: number;
    frontendMobile: number;
    backend: number;
    aiMl: number;
  };
  currentMembers: number;
  totalMembers: number;
};

type IdeaDraftPayload = {
  form: IdeaFormState;
  savedAt: string;
};

const DRAFT_STORAGE_KEY = 'ideaDraft';

const formatDraftTimestamp = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const createInitialForm = (): IdeaFormState => ({
  topic: '전체',
  title: '',
  intro: '',
  description: '',
  preferredPart: '기획',
  status: '모집 중',
  team: {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
    aiMl: 0,
  },
  currentMembers: 0,
  totalMembers: 0,
});

const hasDraftContent = (draft: IdeaFormState, base: IdeaFormState) => {
  if (!draft) return false;
  if (draft.title.trim() || draft.intro.trim() || draft.description.trim()) {
    return true;
  }
  if (draft.topic && draft.topic !== base.topic) return true;
  if (draft.preferredPart && draft.preferredPart !== base.preferredPart) return true;
  if (draft.status && draft.status !== base.status) return true;
  if (draft.currentMembers !== base.currentMembers) return true;
  if (draft.totalMembers !== base.totalMembers) return true;
  if (draft.team) {
    return Object.values(draft.team).some(count => count > 0);
  }
  return false;
};

export default function IdeaPage() {
  const router = useRouter();
  const addIdea = useIdeaStore(state => state.addIdea);

  const [form, setForm] = useState<IdeaFormState>(() => createInitialForm());
  const [step, setStep] = useState<'form' | 'preview' | 'complete'>('form');
  const [completedIdea, setCompletedIdea] = useState<Idea | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftForm, setDraftForm] = useState<IdeaFormState | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const autoSaveTimerRef = useRef<number | null>(null);
  const skipAutoSaveRef = useRef(false);
  const hasUserInteractedRef = useRef(false);
  const latestFormRef = useRef(form);

  const persistDraft = useCallback(
    (targetForm: IdeaFormState, options: { showAlert?: boolean } = {}) => {
      if (typeof window === 'undefined') {
        if (options.showAlert) {
          alert('브라우저 환경에서만 임시 저장을 사용할 수 있어요.');
        }
        return;
      }

      try {
        const payload: IdeaDraftPayload = {
          form: {
            ...targetForm,
            team: { ...targetForm.team },
          },
          savedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        setDraftForm(payload.form);
        setDraftSavedAt(payload.savedAt);
      } catch (error) {
        console.error('Failed to save idea draft', error);
        if (options.showAlert) {
          alert('임시 저장 중 오류가 발생했어요. 브라우저 저장 공간을 확인해 주세요.');
        }
      }
    },
    []
  );

  const clearAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      window.clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as IdeaDraftPayload;
      if (!stored?.form) return;
      const base = createInitialForm();
      const legacyTeam = (stored.form.team ?? {}) as Record<string, number | undefined>;
      const sanitized: IdeaFormState = {
        ...base,
        ...stored.form,
        status: stored.form.status ?? base.status,
        team: {
          ...base.team,
          ...(stored.form.team ?? base.team),
          frontendWeb:
            stored.form.team?.frontendWeb ??
            (typeof legacyTeam.frontend === 'number' ? legacyTeam.frontend : base.team.frontendWeb),
          frontendMobile: stored.form.team?.frontendMobile ?? base.team.frontendMobile,
        },
        currentMembers: stored.form.currentMembers ?? base.currentMembers,
        totalMembers: stored.form.totalMembers ?? base.totalMembers,
      };
      const hasContent = hasDraftContent(sanitized, base);
      if (!hasContent) {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        setDraftForm(null);
        setDraftSavedAt(null);
        setIsDraftModalOpen(false);
        return;
      }
      setDraftForm(sanitized);
      setDraftSavedAt(stored.savedAt ?? null);
      setIsDraftModalOpen(true);
    } catch (error) {
      console.error('Failed to read draft from storage', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear draft storage on offline', error);
      }
      setDraftForm(null);
      setDraftSavedAt(null);
      setIsDraftModalOpen(false);
    };

    window.addEventListener('offline', handleOffline);

    if (!window.navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (skipAutoSaveRef.current) {
      skipAutoSaveRef.current = false;
      return;
    }

    if (!hasUserInteractedRef.current) {
      return;
    }

    clearAutoSaveTimer();

    setIsAutoSaving(true);
    autoSaveTimerRef.current = window.setTimeout(() => {
      persistDraft(form, { showAlert: false });
      setIsAutoSaving(false);
      autoSaveTimerRef.current = null;
    }, 1000);

    return () => {
      clearAutoSaveTimer();
    };
  }, [clearAutoSaveTimer, form, persistDraft]);

  const formattedSavedAt = useMemo(() => {
    if (!draftSavedAt) return '';
    return formatDraftTimestamp(draftSavedAt);
  }, [draftSavedAt]);

  const updateFormState = useCallback((updater: (prev: IdeaFormState) => IdeaFormState) => {
    setForm(prev => {
      const next = updater(prev);
      latestFormRef.current = next;
      return next;
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    hasUserInteractedRef.current = true;
    const { name, value } = e.target;
    if (name.startsWith('team.')) {
      const key = name.split('.')[1] as keyof IdeaFormState['team'];
      const numericValue = Number(value);
      updateFormState(prev => ({
        ...prev,
        team: {
          ...prev.team,
          [key]: Number.isNaN(numericValue) ? 0 : numericValue,
        },
      }));
      return;
    }
    updateFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    hasUserInteractedRef.current = true;
    updateFormState(prev => ({ ...prev, description: value }));
  };

  const handleSave = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    persistDraft(form, { showAlert: true });
  };
  const handlePreview = () => setStep('preview');
  const handleFormBack = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    router.back();
  };
  const handleBack = () => setStep('form');

  const handleRegister = async () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    const teamTotal = Object.values(form.team).reduce((sum, count) => sum + count, 0);
    const computedTotal = teamTotal > 0 ? teamTotal : 1;
    const ideaData = {
      ...form,
      totalMembers: computedTotal,
      currentMembers: form.currentMembers ?? 0,
    };
    const createdIdea = addIdea(ideaData);
    setCompletedIdea(createdIdea);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      window.sessionStorage.setItem('completedIdea', JSON.stringify(createdIdea));
    }

    // Reset local state after registration so the form is clean when user returns.
    setDraftForm(null);
    setDraftSavedAt(null);
    skipAutoSaveRef.current = true;
    const initial = createInitialForm();
    latestFormRef.current = initial;
    setForm(initial);
    setStep('form');

    return createdIdea.id;
  };

  const handleGoList = () => {
    setStep('form');
    router.push('/feature/team-building/welcome');
  };

  const handleLoadDraft = () => {
    if (!draftForm) {
      setIsDraftModalOpen(false);
      return;
    }
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    skipAutoSaveRef.current = true;
    const nextForm = {
      ...draftForm,
      team: { ...draftForm.team },
    };
    latestFormRef.current = nextForm;
    setForm(nextForm);
    setStep('form');
    setCompletedIdea(null);
    setIsDraftModalOpen(false);
  };

  const handleSkipDraft = () => {
    clearAutoSaveTimer();
    setIsAutoSaving(false);
    skipAutoSaveRef.current = true;
    const initial = createInitialForm();
    latestFormRef.current = initial;
    setForm(initial);
    setStep('form');
    setCompletedIdea(null);
    setIsDraftModalOpen(false);
  };

  useEffect(() => {
    latestFormRef.current = form;
  }, [form]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const flushDraft = () => {
      const currentForm = latestFormRef.current;
      if (!currentForm) return;
      clearAutoSaveTimer();
      setIsAutoSaving(false);
      persistDraft(currentForm, { showAlert: false });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushDraft();
      }
    };

    window.addEventListener('pagehide', flushDraft);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    router.events?.on('routeChangeStart', flushDraft);

    return () => {
      window.removeEventListener('pagehide', flushDraft);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      router.events?.off('routeChangeStart', flushDraft);
    };
  }, [clearAutoSaveTimer, persistDraft, router.events]);

  return (
    <>
      {isDraftModalOpen && draftForm && (
        <DraftModalBackdrop>
          <DraftModalCard>
            <DraftModalText>
              <DraftModalTitle>{formattedSavedAt}에 저장된 글이 있습니다.</DraftModalTitle>
              <DraftModalMessage>불러오시겠습니까?</DraftModalMessage>
            </DraftModalText>
            <DraftModalActions>
              <DraftModalButton title="예" disabled={false} onClick={handleLoadDraft} />
              <DraftModalButton
                title="아니오"
                disabled={false}
                id="second"
                onClick={handleSkipDraft}
              />
            </DraftModalActions>
          </DraftModalCard>
        </DraftModalBackdrop>
      )}
      <IdeaLayout isModalOpen={step === 'preview'}>
        {step === 'form' && (
          <IdeaForm
            form={form}
            onChange={handleChange}
            onSave={handleSave}
            onRegister={handleRegister}
            onPreview={handlePreview}
            onDescriptionChange={handleDescriptionChange}
            lastSavedAt={formattedSavedAt}
            isSaving={isAutoSaving}
            onBack={handleFormBack}
          />
        )}
        {step === 'preview' && (
          <IdeaPreview form={form} onBack={handleBack} onRegister={handleRegister} />
        )}
        {step === 'complete' && completedIdea && (
          <IdeaComplete idea={completedIdea} onGoList={handleGoList} />
        )}
      </IdeaLayout>
    </>
  );
}
