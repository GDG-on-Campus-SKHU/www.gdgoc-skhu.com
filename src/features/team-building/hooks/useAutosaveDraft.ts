import React from 'react';

import { AUTO_SAVE_PLACEHOLDER, SESSION_DRAFT_KEY } from '../components/IdeaForm/constants';
import type { Props } from '../components/IdeaForm/IdeaForm';
import { TEAM_ROLES, TeamRole } from '../components/IdeaForm/IdeaFormUtils';
import { formatSavedAt } from '../components/IdeaForm/utils';

interface SessionDraftPayload {
  form: Props['form'];
  savedAt?: string;
}

export default function useAutosaveDraft({
  form,
  emitFieldChange,
  onDescriptionChange,
  lastSavedAt,
  isSaving,
}: {
  form: Props['form'];
  emitFieldChange: (name: string, value: string) => void;
  onDescriptionChange: (value: string) => void;
  lastSavedAt?: string;
  isSaving?: boolean;
}) {
  const [localSavedAt, setLocalSavedAt] = React.useState<string | null>(null);
  const [localIsSaving, setLocalIsSaving] = React.useState(false);

  const [draftPayload, setDraftPayload] = React.useState<SessionDraftPayload | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = React.useState(false);
  const hasCheckedDraftRef = React.useRef(false);
  const autoSaveTimerRef = React.useRef<number | null>(null);

  // autosave (외부 isSaving/lastSavedAt 없을 때만 내부 autosave)
  React.useEffect(() => {
    const shouldInternal = lastSavedAt === undefined && isSaving === undefined;
    if (!shouldInternal || typeof window === 'undefined') return;

    if (autoSaveTimerRef.current) window.clearTimeout(autoSaveTimerRef.current);

    setLocalIsSaving(true);
    autoSaveTimerRef.current = window.setTimeout(() => {
      const payload: SessionDraftPayload = {
        form: { ...form, team: { ...form.team } },
        savedAt: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem(SESSION_DRAFT_KEY, JSON.stringify(payload));
        setLocalSavedAt(formatSavedAt(payload.savedAt));
      } catch (e) {
        console.error('autosave failed', e);
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

  // draft 미리 체크 → 모달 오픈
  React.useEffect(() => {
    if (hasCheckedDraftRef.current || typeof window === 'undefined') return;
    hasCheckedDraftRef.current = true;

    try {
      const stored = sessionStorage.getItem(SESSION_DRAFT_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored) as SessionDraftPayload | SessionDraftPayload['form'];
      const draft =
        (parsed as SessionDraftPayload)?.form ?? (parsed as SessionDraftPayload['form']);
      if (!draft || typeof draft !== 'object') return;

      const hasContent =
        !!draft.title?.trim() ||
        !!draft.intro?.trim() ||
        !!draft.description?.trim() ||
        !!draft.topic?.trim() ||
        !!draft.preferredPart?.trim() ||
        Object.values(draft.team ?? {}).some(v => (v ?? 0) > 0);

      if (!hasContent) return;

      const savedAt = (parsed as SessionDraftPayload)?.savedAt;
      setDraftPayload({ form: draft, savedAt });
      setLocalSavedAt(formatSavedAt(savedAt));
      setIsDraftModalOpen(true);
    } catch (e) {
      console.error('draft read failed', e);
    }
  }, []);

  const handleLoadDraft = React.useCallback(() => {
    const draftData = draftPayload?.form;
    if (!draftData) return setIsDraftModalOpen(false);

    emitFieldChange('title', draftData.title ?? '');
    emitFieldChange('intro', draftData.intro ?? '');
    emitFieldChange('topic', draftData.topic ?? '');
    emitFieldChange('preferredPart', draftData.preferredPart ?? '');
    if (draftData.description) onDescriptionChange(draftData.description);

    TEAM_ROLES.forEach(r => {
      const key = r.key as TeamRole;
      const value = draftData.team?.[key];
      if (typeof value === 'number') emitFieldChange(`team.${key}`, String(value));
    });

    setIsDraftModalOpen(false);
  }, [draftPayload, emitFieldChange, onDescriptionChange]);

  const handleSkipDraft = React.useCallback(() => {
    sessionStorage.removeItem(SESSION_DRAFT_KEY);
    setIsDraftModalOpen(false);
  }, []);

  return {
    isDraftModalOpen,
    draftPayload,
    localSavedAt,
    localIsSaving,
    handleLoadDraft,
    handleSkipDraft,
  };
}
