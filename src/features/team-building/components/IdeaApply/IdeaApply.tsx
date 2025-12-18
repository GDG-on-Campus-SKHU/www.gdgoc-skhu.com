import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

import {
  applyToIdea,
  fetchCurrentTeamBuildingProject,
  fetchEnrollmentAvailability,
  fetchIdeaDetail,
  GetEnrollmentAvailabilityResponse,
} from '../../api/ideas';
import { EnrollmentChoice } from '../../types/applyStatusData';
import { Part } from '../../types/gallery';
import Button from '../Button';
import { partToLabel } from '../MyTeam/ApplyStatusSection';
import Radio from '../Radio';
import { Idea, resolveTotalMembers, useIdeaStore } from '../store/IdeaStore';

const MOBILE_BREAKPOINT = '900px';

const PageContainer = styled.div`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 120px;
  width: 100%;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;
const ApplyCanvas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 1080px;
`;

const GrowTitle = styled.div`
  display: flex;
  width: 1080px;
  padding-top: 100px;
  align-items: flex-end;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ApplyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ApplyTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 2.1rem;
  }
`;

const ApplyInfoRow = styled.div`
  display: flex;
  width: 1080px;
  padding: 40px 0;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--grayscale-400, #c3c6cb);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const IdeaInfo = styled.div`
  display: flex;
  width: 1080px;
  padding: 0;
  flex-direction: column;
  align-items: flex-start;
`;

const IdeaTitle = styled.h2`
  margin: 0;
  font-size: 1.55rem;
  font-weight: 600;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.35rem;
  }
`;

const IdeaSubtitle = styled.p`
  margin: 12px 0 0;
  color: var(--grayscale-500, #979ca5);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const MentorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
`;
const MentorPart = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 300;
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0;
`;

const SectionTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  align-self: stretch;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SectionHint = styled.span`
  color: var(--grayscale-700, #626873);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const DesiredRankingAndPartSection = styled(FormSection)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  margin-top: 40px;
  & + & {
    margin-top: 40px;
  }
`;

const RadioList = styled.div`
  display: flex;
  width: 166px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;

const BackLink = styled.a`
  margin-top: 1.5rem;
  display: inline-flex;
  border: none;
  background: transparent;
  color: #7f8cff;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
const ModalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const ModalCard = styled.div`
  display: flex;
  position: absolute;
  width: 500px;
  height: 240px;
  left: calc(50% - 500px / 2);
  top: calc(50% - 240px / 2 + 0.5px);
  padding: 40px 20px 20px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  border-radius: 12px;
  background: #ffffff;
`;
const ModalTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const ModalTitleComplete = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  margin: 0 0 20px;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const ModalMessage = styled.p`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const ModalButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 16px;
  width: 100%;
`;
const ModalOKCard = styled.div`
  display: flex;
  width: 500px;
  height: 188px;
  padding: 40px 20px 0 20px;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
`;
const ModalButton = styled(Button)`
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  margin-top: 20px;
  background: var(--primary-600-main, #4285f4);
  color: var(--grayscale-100, #f9f9fa);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

function scheduleTypeToKorean(scheduleType?: string) {
  switch (scheduleType) {
    case 'FIRST_TEAM_BUILDING':
      return '1차';
    case 'SECOND_TEAM_BUILDING':
      return '2차';
    case 'THIRD_TEAM_BUILDING':
      return '3차';
    default:
      return '';
  }
}

// 파트 옵션 및 API 파트 코드 매핑
const PART_OPTIONS: Array<{ key: keyof Idea['team']; label: string; apiCode: Part }> = [
  { key: 'planning', label: '기획', apiCode: 'PM' },
  { key: 'design', label: '디자인', apiCode: 'DESIGN' },
  { key: 'frontendWeb', label: '프론트엔드(웹)', apiCode: 'WEB' },
  { key: 'frontendMobile', label: '프론트엔드(모바일)', apiCode: 'MOBILE' },
  { key: 'backend', label: '백엔드', apiCode: 'BACKEND' },
  { key: 'aiMl', label: 'AI/ML', apiCode: 'AI' },
];

const PRIORITY_OPTIONS = ['1지망', '2지망', '3지망'] as const;

type PriorityOption = (typeof PRIORITY_OPTIONS)[number];

const PRIORITY_TO_CHOICE: Record<PriorityOption, EnrollmentChoice> = {
  '1지망': 'FIRST',
  '2지망': 'SECOND',
  '3지망': 'THIRD',
};

// 지망 라벨을 숫자로 변환
const priorityToNumber = (priority: PriorityOption): string => {
  switch (priority) {
    case '1지망':
      return 'FIRST';
    case '2지망':
      return 'SECOND';
    case '3지망':
      return 'THIRD';
  }
};

type IdeaApplyPageProps = {
  ideaId?: number | null;
};

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

const ZERO_TEAM: Idea['team'] = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};

const createEmptyPriorityState = (): Record<PriorityOption, number | null> => ({
  '1지망': null,
  '2지망': null,
  '3지망': null,
});

// API 파트 코드를 team key로 매핑
const partCodeToKey: Record<string, keyof Idea['team']> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

const normalizeChoice = (choice: unknown): EnrollmentChoice | null => {
  // 서버가 "FIRST" 처럼 주는 경우
  if (choice === 'FIRST' || choice === 'SECOND' || choice === 'THIRD') return choice;

  // 서버가 1/2/3으로 주는 경우
  if (typeof choice === 'number') {
    if (choice === 1) return 'FIRST';
    if (choice === 2) return 'SECOND';
    if (choice === 3) return 'THIRD';
  }

  // 서버가 "1" 같은 문자열로 주는 경우
  if (typeof choice === 'string') {
    const n = Number(choice);
    if (Number.isFinite(n)) return normalizeChoice(n);
  }

  return null;
};

// API 응답을 Idea 타입으로 변환
const normalizeApiIdea = (apiIdea: IdeaApiResponse): Idea => {
  const compositions = apiIdea.compositions || [];

  const team: Idea['team'] = { ...ZERO_TEAM };
  const filledTeam: Idea['team'] = { ...ZERO_TEAM };

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

export default function IdeaApplyPage({ ideaId }: IdeaApplyPageProps) {
  const router = useRouter();
  const { id } = router.query;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedIdeaId = useMemo(() => {
    if (typeof ideaId === 'number' || ideaId === null) return ideaId;
    if (Array.isArray(id)) {
      const parsed = Number(id[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof id === 'string') {
      const parsed = Number(id);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [id, ideaId]);

  const [applyInfo, setApplyInfo] = useState<GetEnrollmentAvailabilityResponse | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);

  // 로컬 스토어 (폴백용)
  const hasHydratedIdeas = useIdeaStore(state => state.hasHydrated);
  const hydrateIdeas = useIdeaStore(state => state.hydrateFromStorage);
  const localIdea = useIdeaStore(state =>
    resolvedIdeaId !== null ? state.getIdeaById(resolvedIdeaId) : undefined
  );

  // API에서 가져온 아이디어
  const [apiIdea, setApiIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 최종 사용할 아이디어 (API 우선, 없으면 로컬)
  const idea = apiIdea || localIdea;

  const [priority, setPriority] = useState<PriorityOption>('1지망');
  const [priorityLocks, setPriorityLocks] = useState<Record<PriorityOption, number | null>>(() =>
    createEmptyPriorityState()
  );
  const [part, setPart] = useState<keyof Idea['team']>('planning');

  const allPrioritiesTaken = useMemo(
    () => PRIORITY_OPTIONS.every(option => priorityLocks[option] !== null),
    [priorityLocks]
  );

  const priorityStorageKey = useMemo(() => {
    const pid = applyInfo?.projectId ?? projectId ?? 'unknown';
    const st = applyInfo?.scheduleType ?? 'unknown';
    return `team-building:priority-selection:${pid}:${st}`;
  }, [applyInfo?.projectId, applyInfo?.scheduleType, projectId]);

  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const resp = await fetchCurrentTeamBuildingProject({ signal: controller.signal });
        const next = Number(resp.data?.project?.projectId);
        setProjectId(Number.isFinite(next) ? next : null);
      } catch {
        setProjectId(null);
      }
    })();

    return () => controller.abort();
  }, []);

  // API에서 아이디어 상세 정보 가져오기
  const loadIdeaDetail = useCallback(async () => {
    if (resolvedIdeaId === null) {
      setIsLoading(false);
      return;
    }

    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await fetchIdeaDetail(projectId, resolvedIdeaId);
      const data = response.data as IdeaApiResponse;
      const normalized = normalizeApiIdea(data);
      setApiIdea(normalized);
    } catch (error) {
      console.warn('아이디어 상세 조회 실패, 로컬 데이터 사용:', error);
      // API 실패 시 로컬 스토어 데이터 사용
    } finally {
      setIsLoading(false);
    }
  }, [resolvedIdeaId, projectId]);

  useEffect(() => {
    loadIdeaDetail();
  }, [loadIdeaDetail]);

  // 서버 availability map
  const choiceAvailabilityMap = useMemo(() => {
    const map: Record<EnrollmentChoice, boolean> = { FIRST: true, SECOND: true, THIRD: true };
    applyInfo?.choiceAvailabilities?.forEach(v => {
      const key = normalizeChoice((v as any).choice);
      if (key) map[key] = !!(v as any).available;
    });
    return map;
  }, [applyInfo]);

  useEffect(() => {
    const selectedChoice = PRIORITY_TO_CHOICE[priority];
    if (choiceAvailabilityMap[selectedChoice] === false) {
      const next = PRIORITY_OPTIONS.find(
        p => choiceAvailabilityMap[PRIORITY_TO_CHOICE[p]] !== false
      );
      if (next) setPriority(next);
    }
  }, [choiceAvailabilityMap, priority]);

  const partAvailabilityMap = useMemo(() => {
    const map: Record<Part, boolean> = {
      PM: true,
      DESIGN: true,
      WEB: true,
      MOBILE: true,
      BACKEND: true,
      AI: true,
    };
    applyInfo?.partAvailabilities?.forEach(v => {
      map[v.part] = !!v.available;
    });
    return map;
  }, [applyInfo]);

  // priorityOptions (로컬락 + 서버 availability)
  const priorityOptions = useMemo(
    () =>
      PRIORITY_OPTIONS.map(option => {
        const locked = priorityLocks[option] !== null;
        const choice = PRIORITY_TO_CHOICE[option];
        const serverDisabled = choiceAvailabilityMap[choice] === false;
        return { value: option, disabled: locked || serverDisabled };
      }),
    [priorityLocks, choiceAvailabilityMap]
  );

  const partOptions = useMemo(() => {
    if (!idea) {
      return PART_OPTIONS.map(option => ({
        ...option,
        disabled: partAvailabilityMap[option.apiCode] === false,
      }));
    }

    const team = idea.team ?? ZERO_TEAM;
    const filled = idea.filledTeam ?? ZERO_TEAM;
    const totalLimit = resolveTotalMembers(idea.totalMembers, team);
    const totalFilled = Math.max(
      idea.currentMembers ?? 0,
      Object.values(filled).reduce((sum, count) => sum + (count ?? 0), 0)
    );
    const totalAtCapacity = totalLimit > 0 && totalFilled >= totalLimit;

    return PART_OPTIONS.map(option => {
      const count = team[option.key] ?? 0;
      const taken = filled[option.key] ?? 0;
      const partAtCapacity = count > 0 && taken >= count;
      const byCapacity = totalAtCapacity || count <= 0 || partAtCapacity;
      const byServer = partAvailabilityMap[option.apiCode] === false;

      return { ...option, disabled: byCapacity || byServer };
    });
  }, [idea, partAvailabilityMap]);

  const selectedPartLabel = useMemo(() => {
    const match = partOptions.find(option => option.key === part);
    return match?.label ?? '선택한 파트';
  }, [part, partOptions]);

  const selectedPartApiCode = useMemo(() => {
    const match = PART_OPTIONS.find(option => option.key === part);
    return match?.apiCode ?? 'PM';
  }, [part]);

  // 지원하기 상단 정보 로드
  const loadApplyInfo = useCallback(async () => {
    if (resolvedIdeaId === null) return;

    try {
      const resp = await fetchEnrollmentAvailability(resolvedIdeaId);
      setApplyInfo(resp.data);
    } catch (err) {
      console.warn('지원하기 정보 조회 실패:', err);
      setApplyInfo(null);
    }
  }, [resolvedIdeaId]);

  useEffect(() => {
    loadApplyInfo();
  }, [loadApplyInfo]);

  // 상단 제목/우측 정보 문자열 만들기
  const applyTitleText = useMemo(() => {
    const projectName = applyInfo?.projectName ?? '그로우톤';
    const phase = scheduleTypeToKorean(applyInfo?.scheduleType);
    return phase ? `${projectName} ${phase} 지원` : `${projectName} 지원`;
  }, [applyInfo]);

  const creatorInfoText = useMemo(() => {
    if (!applyInfo) return '';
    const partLabel = partToLabel(applyInfo.creatorPart);
    return `${applyInfo.creatorSchool} ${partLabel} ${applyInfo.creatorName}`;
  }, [applyInfo]);

  // ... (로딩/idea 없음 처리 그대로)

  const isModalOpen = modalState !== 'closed';

  useEffect(() => {
    const { body } = document;
    const classNames = ['ideaform-modal-open', 'ideaapply-modal-open'];

    if (isModalOpen) {
      classNames.forEach(name => body.classList.add(name));
    } else {
      classNames.forEach(name => body.classList.remove(name));
    }

    return () => {
      classNames.forEach(name => body.classList.remove(name));
    };
  }, [isModalOpen]);

  // 로컬 스토리지에서 지망 상태 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(priorityStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Record<PriorityOption, unknown>>;
      const resolved = createEmptyPriorityState();
      PRIORITY_OPTIONS.forEach(option => {
        const value = parsed?.[option];
        if (typeof value === 'number' && Number.isFinite(value)) {
          resolved[option] = value;
        } else {
          resolved[option] = null;
        }
      });
      setPriorityLocks(resolved);
    } catch {
      setPriorityLocks(createEmptyPriorityState());
    }
  }, [priorityStorageKey]);

  useEffect(() => {
    if (!idea) return;
    setPriority(prev => {
      if (priorityLocks[prev] === null || priorityLocks[prev] === idea.id) {
        return prev;
      }
      const assignedToCurrent = PRIORITY_OPTIONS.find(option => priorityLocks[option] === idea.id);
      if (assignedToCurrent) {
        return assignedToCurrent;
      }
      const fallback = PRIORITY_OPTIONS.find(option => priorityLocks[option] === null);
      return fallback ?? prev;
    });
  }, [idea, priorityLocks]);

  useEffect(() => {
    if (!hasHydratedIdeas) {
      hydrateIdeas();
    }
  }, [hasHydratedIdeas, hydrateIdeas]);

  useEffect(() => {
    const fallback = partOptions.find(option => !option.disabled)?.key ?? 'planning';
    setPart(prev => {
      const stillEnabled = partOptions.some(option => option.key === prev && !option.disabled);
      return stillEnabled ? prev : fallback;
    });
  }, [partOptions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!idea) {
      alert('아이디어 정보를 불러오지 못했어요. 다시 시도해주세요.');
      return;
    }
    const totalLimit = resolveTotalMembers(idea.totalMembers, idea.team);
    if (idea.currentMembers >= totalLimit) {
      alert('이미 모집이 완료된 아이디어입니다.');
      return;
    }
    if (allPrioritiesTaken) {
      alert('1지망, 2지망, 3지망을 모두 사용하셨습니다. 기존 지원을 취소한 뒤 다시 시도해 주세요.');
      return;
    }
    if (priorityLocks[priority] !== null) {
      alert('이미 해당 지망으로 지원하셨어요.');
      return;
    }
    const selected = partOptions.find(option => option.key === part);
    if (selected?.disabled) {
      alert('이미 모집이 완료된 파트입니다.');
      return;
    }
    setModalState('confirm');
  };

  // API 지원 요청
  const handleConfirmSubmit = async () => {
    if (!idea) return;
    if (isSubmitting) return;

    const totalLimit = resolveTotalMembers(idea.totalMembers, idea.team);
    if (idea.currentMembers >= totalLimit) {
      alert('이미 모집이 완료된 아이디어입니다.');
      setModalState('closed');
      return;
    }
    if (priorityLocks[priority] !== null) {
      alert('이미 해당 지망으로 지원하셨어요.');
      setModalState('closed');
      return;
    }
    const selected = partOptions.find(option => option.key === part);
    if (selected?.disabled) {
      alert('이미 모집이 완료된 파트입니다.');
      setModalState('closed');
      return;
    }

    setIsSubmitting(true);

    try {
      // API 지원 요청
      const payload = {
        part: selectedPartApiCode,
        choice: priorityToNumber(priority),
      };

      console.log('=== 아이디어 지원 요청 ===');
      console.log('ideaId:', idea.id);
      console.log('payload:', payload);

      await applyToIdea(idea.id, payload);

      // 지원 성공 시 로컬 스토리지에 지망 상태 저장
      if (typeof window !== 'undefined') {
        const nextLocks = { ...priorityLocks, [priority]: idea.id };
        window.localStorage.setItem(priorityStorageKey, JSON.stringify(nextLocks));
        setPriorityLocks(nextLocks);
      }

      setModalState('success');
    } catch (error) {
      console.error('아이디어 지원 실패:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data;

        let message = '지원에 실패했습니다.';

        if (status === 400) {
          const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || '';
          if (errorMessage.includes('이미') || errorMessage.includes('already')) {
            message = '이미 해당 아이디어에 지원하셨습니다.';
          } else {
            message = errorMessage || '입력 정보를 확인해주세요.';
          }
        } else if (status === 401) {
          message = '지원 권한이 없습니다. 다시 로그인해주세요.';
        } else if (status === 404) {
          message = '아이디어를 찾을 수 없습니다.';
        } else if (status === 500) {
          message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }

        alert(message);
      } else {
        alert('지원 중 오류가 발생했습니다.');
      }

      setModalState('closed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <PageContainer>
        <ApplyCanvas>
          <EmptyState>아이디어를 불러오는 중이에요...</EmptyState>
        </ApplyCanvas>
      </PageContainer>
    );
  }

  // 아이디어를 찾을 수 없음
  if (!idea) {
    return (
      <PageContainer>
        <ApplyCanvas>
          <EmptyState>
            지원하려는 아이디어를 찾을 수 없어요.
            <br />
            목록에서 다시 선택해 주세요.
            <Link href="/WelcomeOpen" passHref>
              <BackLink>목록으로 돌아가기</BackLink>
            </Link>
          </EmptyState>
        </ApplyCanvas>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <ApplyCanvas>
          <ApplyContainer>
            <GrowTitle>
              <ApplyTitle>{applyTitleText}</ApplyTitle>
            </GrowTitle>
            <ApplyInfoRow>
              <IdeaInfo>
                <TitleContainer>
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <MentorContainer>
                    <MentorPart>{creatorInfoText}</MentorPart>
                  </MentorContainer>
                </TitleContainer>
                <IdeaSubtitle>{idea.intro || '아이디어 한줄소개'}</IdeaSubtitle>
              </IdeaInfo>
            </ApplyInfoRow>
          </ApplyContainer>

          <form onSubmit={handleSubmit}>
            <DesiredRankingAndPartSection>
              <ContentContainer>
                <SectionTitle>희망 순위</SectionTitle>
                <SectionHint>하나의 순위만 선택할 수 있습니다.</SectionHint>
              </ContentContainer>
              <RadioList>
                {priorityOptions.map(option => (
                  <Radio
                    key={option.value}
                    name="priority"
                    label={option.value}
                    checked={priority === option.value}
                    disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) setPriority(option.value);
                    }}
                    css={{}}
                  />
                ))}
              </RadioList>
            </DesiredRankingAndPartSection>

            <DesiredRankingAndPartSection>
              <ContentContainer>
                <SectionTitle>희망 파트</SectionTitle>
                <SectionHint>하나의 파트만 선택할 수 있습니다.</SectionHint>
              </ContentContainer>
              <RadioList>
                {partOptions.map(option => (
                  <Radio
                    key={option.key}
                    name="part"
                    label={option.label}
                    checked={part === option.key}
                    disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) setPart(option.key);
                    }}
                  />
                ))}
              </RadioList>
            </DesiredRankingAndPartSection>
            <ButtonContainer>
              <Button
                type="submit"
                disabled={allPrioritiesTaken || isSubmitting}
                css={{
                  display: 'flex',
                  width: '300px',
                  height: '50px',
                  padding: '10px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  color: 'var(--grayscale-100, #f9f9fa)',
                  fontFamily: 'Pretendard',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '160%',
                }}
              >
                {isSubmitting ? '지원 중...' : '아이디어 지원하기'}
              </Button>
            </ButtonContainer>
          </form>

          {mounted &&
            modalState !== 'closed' &&
            createPortal(
              <ModalOverlay>
                {modalState === 'confirm' && (
                  <ModalCard>
                    <ModalInfo>
                      <ModalTitle>{idea.title}</ModalTitle>
                      <ModalMessage>{`${priority}, ${selectedPartLabel}에 지원하시겠습니까?`}</ModalMessage>
                      <ModalActions>
                        <ModalButtonContainer>
                          <ModalButton
                            title={isSubmitting ? '지원 중...' : '지원하기'}
                            disabled={isSubmitting}
                            onClick={handleConfirmSubmit}
                            css={{ width: '100%' }}
                          />
                          <ModalButton
                            title="취소"
                            variant="secondary"
                            disabled={isSubmitting}
                            onClick={() => setModalState('closed')}
                            css={{ width: '100%' }}
                          />
                        </ModalButtonContainer>
                      </ModalActions>
                    </ModalInfo>
                  </ModalCard>
                )}
                {modalState === 'success' && (
                  <ModalCard style={{ height: '200px', paddingTop: 0 }}>
                    <ModalOKCard>
                      <ModalTitleComplete>지원이 완료되었습니다.</ModalTitleComplete>
                      <ModalActions>
                        <ModalButton
                          title="확인"
                          disabled={false}
                          onClick={() => {
                            setModalState('closed');
                            router.push('/WelcomeOpen');
                          }}
                          css={{ width: '100%' }}
                        />
                      </ModalActions>
                    </ModalOKCard>
                  </ModalCard>
                )}
              </ModalOverlay>,
              document.body
            )}
        </ApplyCanvas>
      </PageContainer>
    </>
  );
}
