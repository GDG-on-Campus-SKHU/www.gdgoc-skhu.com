import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { Idea, useIdeaStore } from '../store/IdeaStore';
import IdeaComplete from './IdeaComplete';

export default function IdeaCompletePage() {
  const router = useRouter();
  const getIdeaById = useIdeaStore(state => state.getIdeaById);
  const addIdea = useIdeaStore(state => state.addIdea);
  const [resolvedIdea, setResolvedIdea] = useState<Idea | null>(null);

  const targetId = useMemo(() => {
    const raw = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }, [router.query.id]);

  useEffect(() => {
    if (targetId !== null) {
      const found = getIdeaById(targetId);
      if (found) {
        setResolvedIdea(found);
        return;
      }
    }

    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem('completedIdea');
    if (!stored) return;
    try {
      const parsed: Idea = JSON.parse(stored);
      if (parsed?.id) {
        if (!getIdeaById(parsed.id)) {
          addIdea(parsed);
        }
        setResolvedIdea(parsed);
      }
    } catch (error) {
      console.error('Failed to parse completedIdea from sessionStorage', error);
    }
  }, [addIdea, getIdeaById, targetId]);

  const handleGoList = () => {
    router.push('/welcomeopen');
  };

  if (!resolvedIdea) return null;

  return <IdeaComplete idea={resolvedIdea} onGoList={handleGoList} />;
}
