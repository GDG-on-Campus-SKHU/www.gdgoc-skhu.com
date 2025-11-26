import React, { useMemo } from 'react';
import { useRouter } from 'next/router';

import { useIdeaStore } from '../store/IdeaStore';
import IdeaPreview from './IdeaPreview';

export default function IdeaPreviewPage() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const idea = useIdeaStore(state =>
    Number.isFinite(numericId) ? state.getIdeaById(Number(numericId)) : undefined
  );

  const formFromIdea = idea
    ? {
        topic: idea.topic,
        title: idea.title,
        intro: idea.intro,
        description: idea.description,
        preferredPart: idea.preferredPart,
        team: {
          planning: idea.team?.planning ?? 0,
          design: idea.team?.design ?? 0,
          frontendWeb: idea.team?.frontendWeb ?? 0,
          frontendMobile: idea.team?.frontendMobile ?? 0,
          backend: idea.team?.backend ?? 0,
          aiMl: idea.team?.aiMl ?? 0,
        },
      }
    : undefined;

  return (
    <IdeaPreview
      form={formFromIdea}
      onBack={() => router.back()}
      onRegister={() => {
        if (idea) {
          router.push({ pathname: '/IdeaApply', query: { id: idea.id } });
        }
      }}
    />
  );
}
