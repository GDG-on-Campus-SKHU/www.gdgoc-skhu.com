import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import IdeaForm from './IdeaForm';

type TeamCounts = {
  planning: number;
  design: number;
  frontendWeb: number;
  frontendMobile: number;
  backend: number;
  aiMl: number;
};

type IdeaFormState = {
  totalMembers: number;
  currentMembers: number;
  topic: string;
  title: string;
  intro: string;
  description: string;
  preferredPart: string;
  status: '모집 중' | '모집 마감';
  team: TeamCounts;
};

const createInitialForm = (): IdeaFormState => ({
  totalMembers: 1,
  currentMembers: 0,
  topic: '',
  title: '',
  intro: '',
  description: '',
  preferredPart: '',
  status: '모집 중',
  team: {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
    aiMl: 0,
  },
});

export default function IdeaFormPage() {
  const router = useRouter();
  const [form, setForm] = useState<IdeaFormState>(() => createInitialForm());

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name.startsWith('team.')) {
        const key = name.split('.')[1] as keyof TeamCounts;
        const numericValue = Number(value);
        setForm(prev => ({
          ...prev,
          team: {
            ...prev.team,
            [key]: Number.isNaN(numericValue) ? 0 : numericValue,
          },
        }));
        return;
      }
      setForm(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleDescriptionChange = useCallback((description: string) => {
    setForm(prev => ({ ...prev, description }));
  }, []);

  const handleSave = useCallback(() => {
    console.log('save', form);
  }, [form]);

  const handlePreview = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('ideaFormData', JSON.stringify(form));
    }
    router.push('/feature/team-building/IdeaPreview');
  }, [form, router]);

  return (
    <IdeaForm
      form={form}
      onChange={handleChange}
      onSave={handleSave}
      onPreview={handlePreview}
      onDescriptionChange={handleDescriptionChange}
    />
  );
}
