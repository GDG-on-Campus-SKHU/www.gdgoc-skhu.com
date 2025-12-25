// IdeaFormPage.tsx 수정

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Quill from 'quill';
import MarkdownShortcuts from 'quill-markdown-shortcuts';

import {
  createIdea,
  fetchCurrentTeamBuildingProject,
  fetchIdeaConfigurations,
} from '../../api/ideas';
import { formatSavedAt, TOPIC_OPTIONS } from './constants';
import IdeaForm from './IdeaForm';
import { resolveCreatorPart, toMemberCompositions } from './IdeaFormUtils';

Quill.register('modules/markdownShortcuts', MarkdownShortcuts);

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

type IdeaPartCode = 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';
type RegisterStatus = 'TEMPORARY' | 'REGISTERED';

type IdeaComposition = {
  part: IdeaPartCode;
  maxCount: number;
  currentCount?: number;
};

type IdeaCreator = {
  creatorName: string;
  part: IdeaPartCode;
  school: string;
};

type IdeaResponse = {
  lastTemporarySavedAt?: string;
  idea: {
    ideaId: number;
    title: string;
    introduction: string;
    description: string;
    topicId: number;
    topic: string;
    creator: IdeaCreator;
    compositions: IdeaComposition[];
  };
};

type CreateIdeaPayload = {
  title: string;
  introduction: string;
  description: string;
  topicId: number;
  creatorPart: IdeaPartCode;
  registerStatus: RegisterStatus;
  compositions: Array<{ part: IdeaPartCode; maxCount: number }>;
};

// 기본 프로젝트 ID (API 실패 시 사용)
const DEFAULT_PROJECT_ID = 2;

// 기본 주제 ID (API 실패 시 사용)
const DEFAULT_TOPIC_ID = 4;

// 기본 주제 옵션 및 ID 매핑 (API 실패 시 사용)
const DEFAULT_TOPIC_OPTIONS = ['주제1', '주제2'];
const DEFAULT_TOPIC_ID_MAP: Record<string, number> = {
  주제1: 3,
  주제2: 4,
};

const PART_TO_TEAM_KEY: Record<IdeaPartCode, keyof TeamCounts> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

const createInitialForm = (): IdeaFormState => ({
  totalMembers: 1,
  currentMembers: 0,
  topic: DEFAULT_TOPIC_OPTIONS[0],
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
  const [projectId, setProjectId] = useState<number>(DEFAULT_PROJECT_ID);
  const [topicOptions, setTopicOptions] = useState<string[]>(DEFAULT_TOPIC_OPTIONS);
  const [topicIdMap, setTopicIdMap] = useState<Record<string, number>>(DEFAULT_TOPIC_ID_MAP);
  const [, setIsRegistrable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(undefined);
  const [availableParts, setAvailableParts] = useState<IdeaPartCode[]>([]);
  const [maxMemberCount, setMaxMemberCount] = useState<number | null>(null);

  const getAccessToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    return (
      window.localStorage.getItem('accessToken') ?? window.sessionStorage.getItem('accessToken')
    );
  }, []);

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

  const resolveTopicId = useCallback(() => {
    const label = form.topic;
    if (!label) return DEFAULT_TOPIC_ID;
    if (topicIdMap[label] !== undefined) return topicIdMap[label];
    const firstTopicId = Object.values(topicIdMap)[0];
    if (firstTopicId !== undefined) return firstTopicId;
    const parsed = Number(label);
    if (Number.isFinite(parsed)) return parsed;
    return DEFAULT_TOPIC_ID;
  }, [form.topic, topicIdMap]);

  const resolveProjectId = useCallback(() => {
    if (projectId !== null && projectId !== undefined && Number.isFinite(projectId)) {
      return projectId;
    }

    const raw = Array.isArray(router.query.projectId)
      ? router.query.projectId[0]
      : router.query.projectId;
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed)) return parsed;

    return DEFAULT_PROJECT_ID;
  }, [projectId, router.query.projectId]);

  // 수동 임시저장 함수 (버튼 클릭 시에만 호출)
  const handleSave = useCallback(async () => {
    // 임시저장 기능은 현재 비활성화
    console.log('임시저장 기능은 현재 비활성화되어 있습니다.');
  }, []);

  // 정식 등록 함수
  const handleRegister = useCallback(async (): Promise<boolean> => {
    if (isSubmitting) return false;

    const targetProjectId = resolveProjectId();
    if (!targetProjectId) {
      alert('프로젝트 정보를 불러오지 못했습니다.');
      throw new Error('projectId is missing');
    }

    const creatorPart = resolveCreatorPart(form.preferredPart);
    if (!creatorPart) {
      alert('작성자의 파트를 선택해주세요.');
      throw new Error('creatorPart is missing');
    }

    const topicId = resolveTopicId();

    const compositions = toMemberCompositions(form.team);
    if (compositions.length === 0) {
      alert('모집 인원을 1명 이상 입력해주세요.');
      throw new Error('compositions are empty');
    }

    if (!form.title.trim()) {
      alert('아이디어 제목을 입력해주세요.');
      throw new Error('title is missing');
    }

    if (!form.intro.trim()) {
      alert('아이디어 소개를 입력해주세요.');
      throw new Error('introduction is missing');
    }

    if (!form.description.trim()) {
      alert('아이디어 설명을 입력해주세요.');
      throw new Error('description is missing');
    }

    const payload: CreateIdeaPayload = {
      title: form.title.trim(),
      introduction: form.intro.trim(),
      description: form.description,
      topicId,
      creatorPart,
      registerStatus: 'REGISTERED',
      compositions,
    };

    console.log('=== 아이디어 등록 요청 ===');
    console.log('projectId:', targetProjectId);
    console.log('payload:', JSON.stringify(payload, null, 2));

    setIsSubmitting(true);
    try {
      const resp = await createIdea(targetProjectId, payload);
      const data = resp.data as IdeaResponse;

      const savedAt = new Date().toISOString();
      setLastSavedAt(formatSavedAt(savedAt) ?? savedAt);

      if (typeof window !== 'undefined' && data.idea) {
        try {
          window.sessionStorage.setItem('completedIdea', JSON.stringify(data.idea));
        } catch (error) {
          console.error('완료 아이디어를 저장하지 못했습니다.', error);
        }
      }

      return true;
    } catch (error) {
      console.error('아이디어 등록에 실패했습니다.', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        let message = '아이디어 등록에 실패했습니다.';

        if (status === 400) {
          if (typeof errorData === 'string') {
            message = errorData;
          } else if (errorData?.message) {
            message = errorData.message;
          }
        } else if (status === 401) {
          message = '아이디어 등록 권한이 없습니다. 다시 로그인해주세요.';
        } else if (status === 500) {
          message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }

        alert(message);
      } else {
        alert('아이디어 등록 중 오류가 발생했습니다.');
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    form.description,
    form.intro,
    form.preferredPart,
    form.team,
    form.title,
    isSubmitting,
    resolveProjectId,
    resolveTopicId,
  ]);

  const handlePreview = useCallback(() => {
    sessionStorage.setItem('ideaPreview:mode', 'create');
    sessionStorage.setItem('ideaPreview:returnTo', '/IdeaForm');

    sessionStorage.removeItem('ideaPreview:ideaId');
    sessionStorage.removeItem('ideaPreview:origin');

    router.push('/IdeaPreview');
  }, [router]);

  const enabledTeamKeys = React.useMemo(() => {
    return availableParts.map(part => PART_TO_TEAM_KEY[part]).filter(Boolean);
  }, [availableParts]);

  // URL에서 projectId 가져오기
  useEffect(() => {
    const raw = Array.isArray(router.query.projectId)
      ? router.query.projectId[0]
      : router.query.projectId;
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isNaN(parsed)) {
      setProjectId(parsed);
    }
  }, [router.query.projectId]);

  useEffect(() => {
    const controller = new AbortController();

    const loadIdeaConfigurations = async () => {
      try {
        const resp = await fetchIdeaConfigurations({
          signal: controller.signal,
        });

        const data = resp.data;

        // 1. topic 설정
        if (Array.isArray(data.topics) && data.topics.length > 0) {
          const labels = data.topics.map(t => t.topic);
          const map: Record<string, number> = {};

          data.topics.forEach(t => {
            map[t.topic] = t.topicId;
          });

          setTopicOptions(labels);
          setTopicIdMap(map);
          setForm(prev => ({ ...prev, topic: labels[0] }));
        }

        // 2. availableParts
        setAvailableParts(data.availableParts ?? []);

        // 3. maxMemberCount
        setMaxMemberCount(typeof data.maxMemberCount === 'number' ? data.maxMemberCount : null);
      } catch {
        console.warn('아이디어 설정 정보를 불러오지 못했습니다.');
      }
    };

    loadIdeaConfigurations();
    return () => controller.abort();
  }, []);

  // 프로젝트 정보 가져오기 (실패해도 기본값 유지)
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const controller = new AbortController();

    const fetchCurrentProject = async () => {
      try {
        const resp = await fetchCurrentTeamBuildingProject({ signal: controller.signal });
        const data = resp.data;
        const project = data?.project;
        setIsRegistrable(typeof data?.registrable === 'boolean' ? data.registrable : null);

        if (project?.projectId) {
          const parsedId = Number(project.projectId);
          if (!Number.isNaN(parsedId)) setProjectId(parsedId);
        }

        if (Array.isArray(project?.topics) && project.topics.length > 0) {
          const nextMap: Record<string, number> = {};
          const labels: string[] = [];
          project.topics.forEach((topic: any) => {
            if (typeof topic?.topic === 'string') {
              labels.push(topic.topic);
              if (typeof topic?.topicId === 'number') {
                nextMap[topic.topic] = topic.topicId;
              }
            }
          });
          if (labels.length > 0) {
            setTopicOptions(labels);
            setTopicIdMap(nextMap);
            setForm(prev => ({ ...prev, topic: labels[0] }));
          }
        }
      } catch (error) {
        const isCanceled =
          (error as any)?.code === 'ERR_CANCELED' || (error as Error).name === 'CanceledError';
        if (!isCanceled) {
          console.warn('프로젝트 정보를 불러오지 못했습니다. 기본값을 사용합니다.');
        }
      }
    };

    fetchCurrentProject();
    return () => controller.abort();
  }, [getAccessToken]);

  return (
    <IdeaForm
      form={form}
      topicOptions={topicOptions}
      enabledTeamRoles={enabledTeamKeys}
      maxMemberCount={maxMemberCount}
      onChange={handleChange}
      onSave={handleSave}
      onRegister={handleRegister}
      onPreview={handlePreview}
      onDescriptionChange={handleDescriptionChange}
      lastSavedAt={lastSavedAt}
      isSaving={isSubmitting}
    />
  );
}
