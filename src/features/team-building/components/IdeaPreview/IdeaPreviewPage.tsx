import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import { fetchIdeaDetail } from '../../api/ideas';
import IdeaPreview from './IdeaPreview';

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
const partCodeToKey: Record<string, string> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

export default function IdeaPreviewPage() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const [apiIdea, setApiIdea] = useState<IdeaApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // API에서 아이디어 상세 정보 가져오기
  const loadIdeaDetail = useCallback(async () => {
    if (!Number.isFinite(numericId)) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetchIdeaDetail(DEFAULT_PROJECT_ID, numericId);
      setApiIdea(response as unknown as IdeaApiResponse);
    } catch (error) {
      console.error('아이디어 상세 조회 실패:', error);
      setHasError(true);

      let message = '아이디어를 불러오는데 실패했습니다.';

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          message = '아이디어를 찾을 수 없습니다.';
        } else if (status === 401) {
          message = '로그인이 필요합니다.';
        } else if (status === 500) {
          message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      alert(message);
    } finally {
      setIsLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    loadIdeaDetail();
  }, [loadIdeaDetail]);

  // API 응답을 form 형태로 변환
  const formFromApi = useMemo(() => {
    if (!apiIdea) return undefined;

    const team: Record<string, number> = {
      planning: 0,
      design: 0,
      frontendWeb: 0,
      frontendMobile: 0,
      backend: 0,
      aiMl: 0,
    };

    apiIdea.compositions?.forEach(comp => {
      const key = partCodeToKey[comp.part];
      if (key) {
        team[key] = comp.maxCount || 0;
      }
    });

    return {
      topic: apiIdea.topic || '',
      title: apiIdea.title || '',
      intro: apiIdea.introduction || '',
      description: apiIdea.description || '',
      preferredPart: apiIdea.creator?.part || '',
      team,
      creator: apiIdea.creator,
    };
  }, [apiIdea]);

  // 로딩 중
  if (isLoading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>아이디어를 불러오는 중...</div>;
  }

  // 에러 발생 시
  if (hasError || !formFromApi) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        아이디어를 불러올 수 없습니다.
        <br />
        <button
          onClick={() => router.push('/WelcomeOpen')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #4285f4',
            background: '#fff',
            color: '#4285f4',
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <IdeaPreview
      form={formFromApi}
      onBack={() => router.back()}
      onRegister={() => {
        if (apiIdea?.ideaId) {
          router.push({ pathname: '/IdeaApply', query: { id: apiIdea.ideaId } });
        }
      }}
    />
  );
}
