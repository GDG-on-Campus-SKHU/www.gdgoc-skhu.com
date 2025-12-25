import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';

import { createEmptyTeamCounts, useIdeaStore } from '../../components/store/IdeaStore';

type IdeaFormState = {
  title: string;
  intro: string;
  description: string;
  topic: string;
  preferredPart: string;
  team: ReturnType<typeof createEmptyTeamCounts>;
};

type FormFieldName = keyof Omit<IdeaFormState, 'team'>;

export default function useIdeaForm() {
  const router = useRouter();
  const addIdea = useIdeaStore(s => s.addIdea);

  const [form, setForm] = useState<IdeaFormState>({
    title: '',
    intro: '',
    description: '',
    topic: '',
    preferredPart: '',
    team: createEmptyTeamCounts(),
  });

  const [modal, setModal] = useState<'idle' | 'confirm' | 'success'>('idle');

  const updateField = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const fieldName = name as FormFieldName;
      setForm(prev => ({ ...prev, [fieldName]: value }));
    },
    []
  );

  const changeDescription = useCallback((value: string) => {
    setForm(prev => ({ ...prev, description: value }));
  }, []);

  const isSubmitDisabled = !form.title.trim() || !form.intro.trim() || !form.description.trim();

  const preview = useCallback(() => {
    sessionStorage.setItem(
      'ideaFormData',
      JSON.stringify({ form, savedAt: new Date().toISOString() })
    );
    router.push('/IdeaPreview');
  }, [form, router]);

  const submit = useCallback(() => {
    // 실제 저장
    const newIdea = addIdea({
      ...form,
      totalMembers: 1,
      currentMembers: 1,
    });
    sessionStorage.setItem('completedIdea', JSON.stringify(newIdea));
    router.push('/WelcomeOpen');
  }, [form, addIdea, router]);

  const openModal = () => setModal('confirm');
  const closeModal = () => setModal('idle');

  return {
    form,
    updateField,
    changeDescription,
    submit,
    preview,
    isSubmitDisabled,
    modal,
    openModal,
    closeModal,
  };
}
