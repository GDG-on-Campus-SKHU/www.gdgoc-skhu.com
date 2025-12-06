import { useCallback, useEffect, useMemo, useState } from 'react';

import { Idea, resolveTotalMembers, useIdeaStore } from '../../components/store/IdeaStore';
import WelcomeOpen from '../../components/WelcomeOpen/WelcomeOpen';

const ITEMS_PER_PAGE = 10;

export default function WelcomePage() {
  const ideas = useIdeaStore(state => state.ideas);
  const hasHydratedIdeas = useIdeaStore(state => state.hasHydrated);
  const hydrateIdeas = useIdeaStore(state => state.hydrateFromStorage);
  const addIdea = useIdeaStore(state => state.addIdea);
  const getIdeaById = useIdeaStore(state => state.getIdeaById);

  const [excludeClosed, setExcludeClosed] = useState(false);
  const [topicFilter, setTopicFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 상태 복구
  useEffect(() => {
    if (!hasHydratedIdeas) hydrateIdeas();
  }, [hasHydratedIdeas, hydrateIdeas]);

  // 🔹 sessionStorage 데이터 반영
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = window.sessionStorage.getItem('completedIdea');
      if (!stored) return;

      const parsed: Idea = JSON.parse(stored);
      if (!parsed?.title) return;
      if (parsed.id && getIdeaById(parsed.id)) return;

      addIdea(parsed);
      window.sessionStorage.removeItem('completedIdea');
    } catch (error) {
      console.error('Failed to restore idea from sessionStorage', error);
    }
  }, [addIdea, getIdeaById]);

  const resolveIdeaStatus = useCallback((idea: Idea) => {
    const effectiveTotalBase = resolveTotalMembers(idea.totalMembers, idea.team);
    const filledTotal = Object.values(idea.filledTeam ?? {}).reduce(
      (sum, count) => sum + (count ?? 0),
      0
    );

    const baseCurrent = typeof idea.currentMembers === 'number' ? idea.currentMembers : 0;

    const ownerPlusFilled = 1 + filledTotal;
    const effectiveCurrent = Math.max(baseCurrent, ownerPlusFilled);
    const safeTotal = Math.max(effectiveTotalBase, 1);

    const displayCurrent = Math.min(effectiveCurrent, safeTotal);
    const isClosed = displayCurrent >= safeTotal || idea.status === '모집 마감';

    return { isClosed };
  }, []);

  // 🔹 필터 + 정렬
  const filteredIdeas = useMemo(() => {
    const isAll = !topicFilter || topicFilter === '전체';

    return ideas.filter(idea => {
      const status = resolveIdeaStatus(idea);
      if (excludeClosed && status.isClosed) return false;

      if (!isAll && idea.topic !== topicFilter) return false;

      return true;
    });
  }, [ideas, excludeClosed, topicFilter, resolveIdeaStatus]);

  // 🔹 페이지네이션
  const totalIdeaCount = ideas.length;
  const filteredIdeaCount = filteredIdeas.length;
  const totalPages = Math.max(1, Math.ceil(filteredIdeaCount / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIdeas = filteredIdeas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [topicFilter, excludeClosed]);

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const goToPage = (page: number) => {
    return setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <WelcomeOpen
      ideas={paginatedIdeas}
      totalIdeas={totalIdeaCount}
      visibleIdeasCount={filteredIdeaCount}
      topicFilter={topicFilter}
      excludeClosed={excludeClosed}
      currentPage={currentPage}
      totalPages={totalPages}
      startIndex={startIndex}
      onChangeTopic={setTopicFilter}
      onToggleExclude={() => setExcludeClosed(prev => !prev)}
      onPageChange={goToPage}
    />
  );
}
