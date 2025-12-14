import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { fetchIdeaDetail } from '../../api/ideas';
import { Idea, useIdeaStore } from '../store/IdeaStore';
import IdeaComplete from './IdeaComplete';

const DEFAULT_PROJECT_ID = 2;

// API 응답 타입
type IdeaApiResponse = {
  ideaId: number;
  title: string;
  introduction: string;
  description: string;
  topic: string;
  topicId: number;
  creator: {
    creatorName: string;
    part: string;
    school: string;
  };
  compositions: Array<{
    part: string;
    maxCount: number;
    currentCount: number;
  }>;
};

// API 파트 코드를 team key로 매핑
const partCodeToKey: Record<string, keyof Idea['team']> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

// API 응답을 Idea 타입으로 변환
const normalizeApiIdea = (apiIdea: IdeaApiResponse): Idea => {
  const compositions = apiIdea.compositions || [];

  const team: Idea['team'] = {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
    aiMl: 0,
  };

  const filledTeam: Idea['team'] = {
    planning: 0,
    design: 0,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 0,
    aiMl: 0,
  };

  compositions.forEach(comp => {
    const key = partCodeToKey[comp.part];
    if (key) {
      team[key] = comp.maxCount || 0;
      filledTeam[key] = comp.currentCount || 0;
    }
  });

  const totalMembers = compositions.reduce((sum, comp) => sum + (comp.maxCount || 0), 0);
  const currentMembers = compositions.reduce((sum, comp) => sum + (comp.currentCount || 0), 0);

  return {
    id: apiIdea.ideaId,
    topic: apiIdea.topic || '',
    title: apiIdea.title || '',
    intro: apiIdea.introduction || '',
    description: apiIdea.description || '',
    preferredPart: apiIdea.creator?.part || '',
    team,
    filledTeam,
    totalMembers: totalMembers || 1,
    currentMembers: currentMembers || 0,
    status: currentMembers >= totalMembers ? '모집 마감' : '모집 중',
  };
};

export default function IdeaCompletePage() {
  const router = useRouter();
  const getIdeaById = useIdeaStore(state => state.getIdeaById);
  const addIdea = useIdeaStore(state => state.addIdea);

  const [resolvedIdea, setResolvedIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetId = useMemo(() => {
    const raw = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const parsed = raw ? Number(raw) : NaN;
    return Number.isNaN(parsed) ? null : parsed;
  }, [router.query.id]);

  // API에서 아이디어 상세 정보 가져오기
  const loadIdeaDetail = useCallback(async () => {
    if (targetId === null) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchIdeaDetail(DEFAULT_PROJECT_ID, targetId);
      const apiIdea = response.data as IdeaApiResponse;
      const normalized = normalizeApiIdea(apiIdea);
      setResolvedIdea(normalized);
    } catch (error) {
      console.warn('아이디어 상세 조회 실패, 로컬 데이터 사용:', error);

      // API 실패 시 로컬 스토어에서 찾기
      const found = getIdeaById(targetId);
      if (found) {
        setResolvedIdea(found);
        return;
      }

      // sessionStorage에서 찾기
      if (typeof window !== 'undefined') {
        const stored = window.sessionStorage.getItem('completedIdea');
        if (stored) {
          try {
            const parsed: Idea = JSON.parse(stored);
            if (parsed?.id) {
              if (!getIdeaById(parsed.id)) {
                addIdea(parsed);
              }
              setResolvedIdea(parsed);
            }
          } catch (parseError) {
            console.error('Failed to parse completedIdea from sessionStorage', parseError);
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetId, getIdeaById, addIdea]);

  useEffect(() => {
    loadIdeaDetail();
  }, [loadIdeaDetail]);

  // sessionStorage 폴백 (targetId가 없는 경우)
  useEffect(() => {
    if (targetId !== null || resolvedIdea) return;

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
  }, [addIdea, getIdeaById, targetId, resolvedIdea]);

  const handleGoList = () => {
    router.push('/WelcomeOpen');
  };

  if (isLoading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>아이디어를 불러오는 중...</div>;
  }

  if (!resolvedIdea) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        아이디어를 찾을 수 없습니다.
        <br />
        <button
          onClick={() => router.push('/WelcomeOpen')}
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return <IdeaComplete idea={resolvedIdea} onGoList={handleGoList} />;
}
