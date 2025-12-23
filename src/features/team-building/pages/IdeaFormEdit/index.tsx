import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

import {
  fetchCurrentTeamBuildingProject,
  fetchIdeaConfigurations,
  fetchIdeaDetail,
  type IdeaMemberComposition,
  type IdeaUpdateBeforeEnrollmentPayload,
  type IdeaUpdatePayload,
  updateIdea,
  updateIdeaBeforeEnrollment,
} from '../../api/ideas';
import IdeaForm from '../../components/IdeaForm/IdeaForm';
import {
  type IdeaPartCode,
  resolveCreatorPart,
  toMemberCompositions,
} from '../../components/IdeaForm/IdeaFormUtils';

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
  topic: string; // label
  title: string;
  intro: string;
  description: string;
  preferredPart: string; // label
  status: '모집 중' | '모집 마감';
  team: TeamCounts;
};

type IdeaDetailResponse = {
  ideaId: number;
  title: string;
  introduction: string;
  description: string;
  topicId: number;
  topic: string;
  creator: {
    creatorName: string;
    part: IdeaPartCode; // 'PM' | ...
    school: string;
  };
  compositions: Array<{
    part: IdeaPartCode; // 'PM' | ...
    maxCount: number;
    currentCount: number;
  }>;
};

const PART_TO_TEAM_KEY: Record<IdeaPartCode, keyof TeamCounts> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

const PART_CODE_TO_LABEL: Record<IdeaPartCode, string> = {
  PM: '기획',
  DESIGN: '디자인',
  WEB: '프론트엔드 (웹)',
  MOBILE: '프론트엔드 (모바일)',
  BACKEND: '백엔드',
  AI: 'AI/ML',
};

const createEmptyTeam = (): TeamCounts => ({
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
});

function compositionsToTeamCounts(comps: IdeaDetailResponse['compositions']): TeamCounts {
  const team = createEmptyTeam();
  (comps ?? []).forEach(c => {
    const key = PART_TO_TEAM_KEY[c.part];
    if (key) team[key] = c.maxCount ?? 0;
  });
  return team;
}

function normalizeErrorMessage(errorData: any) {
  if (typeof errorData === 'string') return errorData;
  if (typeof errorData?.message === 'string') return errorData.message;
  return '';
}

function sortCompositions(comps: IdeaMemberComposition[]) {
  return [...comps].sort((a, b) => a.part.localeCompare(b.part));
}

function isSameCompositions(a: IdeaMemberComposition[], b: IdeaMemberComposition[]) {
  const aa = sortCompositions(a ?? []);
  const bb = sortCompositions(b ?? []);

  if (aa.length !== bb.length) return false;
  for (let i = 0; i < aa.length; i++) {
    if (aa[i].part !== bb[i].part) return false;
    if ((aa[i].maxCount ?? 0) !== (bb[i].maxCount ?? 0)) return false;
  }
  return true;
}

export default function IdeaFormEditPage() {
  const router = useRouter();
  const { id } = router.query;

  const ideaId = useMemo(() => {
    const raw = Array.isArray(id) ? id[0] : id;
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [id]);

  const [projectId, setProjectId] = useState<number | null>(null);

  const [topicOptions, setTopicOptions] = useState<string[]>([]);
  const [topicIdMap, setTopicIdMap] = useState<Record<string, number>>({});
  const [availableParts, setAvailableParts] = useState<IdeaPartCode[]>([]);
  const [maxMemberCount, setMaxMemberCount] = useState<number | null>(null);

  const [form, setForm] = useState<IdeaFormState>(() => ({
    totalMembers: 1,
    currentMembers: 0,
    topic: '',
    title: '',
    intro: '',
    description: '',
    preferredPart: '',
    status: '모집 중',
    team: createEmptyTeam(),
  }));

  // 원본(변경 감지용)
  const [origin, setOrigin] = useState<{
    topicId: number;
    creatorPart: IdeaPartCode;
    compositions: IdeaMemberComposition[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enabledTeamKeys = useMemo(() => {
    return availableParts.map(p => PART_TO_TEAM_KEY[p]).filter(Boolean);
  }, [availableParts]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name.startsWith('team.')) {
        const key = name.split('.')[1] as keyof TeamCounts;
        const numericValue = Number(value);
        setForm(prev => ({
          ...prev,
          team: { ...prev.team, [key]: Number.isNaN(numericValue) ? 0 : numericValue },
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
    if (!label) return origin?.topicId ?? 0;

    if (topicIdMap[label] !== undefined) return topicIdMap[label];

    // fallback: label이 숫자인 케이스
    const parsed = Number(label);
    if (Number.isFinite(parsed)) return parsed;

    return origin?.topicId ?? 0;
  }, [form.topic, topicIdMap, origin?.topicId]);

  /** 1) current project (projectId) */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const resp = await fetchCurrentTeamBuildingProject({ signal: controller.signal });
        const nextProjectId = Number(resp.data?.project?.projectId);
        setProjectId(Number.isFinite(nextProjectId) ? nextProjectId : null);
      } catch {
        setProjectId(null);
      }
    })();

    return () => controller.abort();
  }, []);

  /** 2) configs (topics/parts/max) */
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const resp = await fetchIdeaConfigurations({ signal: controller.signal });
        const data = resp.data;

        // topics
        const labels = (data.topics ?? []).map(t => t.topic);
        const map: Record<string, number> = {};
        (data.topics ?? []).forEach(t => (map[t.topic] = t.topicId));

        setTopicOptions(labels);
        setTopicIdMap(map);

        // parts / max
        setAvailableParts(data.availableParts ?? []);
        setMaxMemberCount(typeof data.maxMemberCount === 'number' ? data.maxMemberCount : null);
      } catch {}
    })();

    return () => controller.abort();
  }, []);

  /** 3) idea detail -> prefill */
  useEffect(() => {
    if (!ideaId || !projectId) return;

    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      try {
        const resp = await fetchIdeaDetail(projectId, ideaId, { signal: controller.signal });
        const data = resp.data as IdeaDetailResponse;

        const team = compositionsToTeamCounts(data.compositions);
        const totalMembers = (data.compositions ?? []).reduce((s, c) => s + (c.maxCount ?? 0), 0);
        const currentMembers = (data.compositions ?? []).reduce(
          (s, c) => s + (c.currentCount ?? 0),
          0
        );

        setForm({
          totalMembers: totalMembers || 1,
          currentMembers: currentMembers || 0,
          topic: data.topic ?? '',
          title: data.title ?? '',
          intro: data.introduction ?? '',
          description: data.description ?? '',
          preferredPart: data.creator?.part ? PART_CODE_TO_LABEL[data.creator.part] : '',
          status: currentMembers >= (totalMembers || 1) ? '모집 마감' : '모집 중',
          team,
        });

        setOrigin({
          topicId: data.topicId,
          creatorPart: data.creator?.part,
          compositions: (data.compositions ?? []).map(c => ({
            part: c.part,
            maxCount: c.maxCount,
          })),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [ideaId, projectId]);

  const hasPartOrCompositionChanged = useMemo(() => {
    if (!origin) return false;

    const nextCreatorPart = resolveCreatorPart(form.preferredPart) as IdeaPartCode | null;
    const nextComps = toMemberCompositions(form.team);

    // creatorPart를 못 구하면(라벨 이상), 변경 감지 로직에서는 “변경 없음”으로 두고
    // submit 단계에서 검증으로 막는게 안전
    const creatorChanged = nextCreatorPart ? nextCreatorPart !== origin.creatorPart : false;

    const compsChanged = !isSameCompositions(origin.compositions, nextComps);

    return creatorChanged || compsChanged;
  }, [origin, form.preferredPart, form.team]);

  const handlePreviewForEdit = useCallback(() => {
    if (!ideaId) return;

    // edit 모드로 확정
    sessionStorage.setItem('ideaPreview:mode', 'edit');
    sessionStorage.setItem('ideaPreview:returnTo', `/IdeaFormEdit?id=${ideaId}`);
    sessionStorage.setItem('ideaPreview:ideaId', String(ideaId));

    // origin은 이 페이지 state(origin) 사용
    if (origin) {
      sessionStorage.setItem(
        'ideaPreview:origin',
        JSON.stringify({
          topicId: origin.topicId,
          creatorPart: origin.creatorPart,
          compositions: origin.compositions,
        })
      );
    } else {
      // origin 없을 때(로딩 실패 등) 방어
      sessionStorage.removeItem('ideaPreview:origin');
    }
    router.push('/IdeaPreview');
  }, [ideaId, origin, router]);

  /**
   * IdeaForm이 "성공모달을 띄울지" 판단할 수 있도록 boolean 반환
   */
  const handleSubmitEdit = useCallback(async (): Promise<boolean> => {
    if (!ideaId || !projectId) return false;
    if (isSubmitting) return false;

    if (!origin) {
      alert('아이디어 원본 정보를 불러오지 못했습니다. 다시 시도해주세요.');
      return false;
    }

    // 기본 검증
    if (!form.title.trim()) {
      alert('아이디어 제목을 입력해주세요.');
      return false;
    }
    if (!form.intro.trim()) {
      alert('아이디어 소개를 입력해주세요.');
      return false;
    }
    if (!form.description.trim()) {
      alert('아이디어 설명을 입력해주세요.');
      return false;
    }

    const topicId = resolveTopicId();
    if (!topicId) {
      alert('아이디어 주제를 선택해주세요.');
      return false;
    }

    setIsSubmitting(true);
    try {
      if (hasPartOrCompositionChanged) {
        // 파트/모집구성 변경: before-enrollment만 시도
        const creatorPart = resolveCreatorPart(form.preferredPart) as IdeaPartCode | null;
        if (!creatorPart) {
          alert('작성자의 파트를 선택해주세요.');
          return false;
        }

        const compositions = toMemberCompositions(form.team);
        if (compositions.length === 0) {
          alert('모집 인원을 1명 이상 입력해주세요.');
          return false;
        }

        const payload: IdeaUpdateBeforeEnrollmentPayload = {
          title: form.title.trim(),
          introduction: form.intro.trim(),
          description: form.description,
          topicId,
          creatorPart,
          compositions,
        };

        try {
          await updateIdeaBeforeEnrollment(projectId, ideaId, payload);
          return true; // 성공
        } catch (e) {
          // 일정 지남이면 alert 후 false (성공모달 금지)
          if (axios.isAxiosError(e)) {
            const status = e.response?.status;
            const msg = normalizeErrorMessage(e.response?.data);
            if (status === 400 && msg) {
              alert('지원 기간에는 작성자의 파트 및 팀원 구성 수정이 불가능합니다.'); // "일정이 지났습니다."
              return false;
            }
          }
          throw e;
        }
      }

      // 텍스트만 수정: updateIdea
      const payload: IdeaUpdatePayload = {
        title: form.title.trim(),
        introduction: form.intro.trim(),
        description: form.description,
        topicId,
      };

      await updateIdea(projectId, ideaId, payload);
      return true;
    } catch (error) {
      console.error('아이디어 수정 실패:', error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const msg = normalizeErrorMessage(error.response?.data);

        if (status === 401) {
          alert('수정 권한이 없습니다. 다시 로그인해주세요.');
          return false;
        }
        if (status === 404) {
          alert('아이디어를 찾을 수 없습니다.');
          return false;
        }
        if (status === 500) {
          alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          return false;
        }
        if (msg) {
          alert(msg);
          return false;
        }
      }

      alert('수정 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    ideaId,
    projectId,
    isSubmitting,
    origin,
    form.title,
    form.intro,
    form.description,
    form.preferredPart,
    form.team,
    hasPartOrCompositionChanged,
    resolveTopicId,
  ]);

  const handleComplete = useCallback(() => {
    router.push({ pathname: '/IdeaListDetail', query: { id: ideaId } });
  }, [router, ideaId]);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>불러오는 중...</div>;
  }

  if (!ideaId) {
    return <div style={{ padding: 40, textAlign: 'center' }}>잘못된 접근입니다.</div>;
  }

  return (
    <IdeaForm
      form={form}
      topicOptions={topicOptions}
      enabledTeamRoles={enabledTeamKeys}
      maxMemberCount={maxMemberCount}
      onChange={handleChange}
      onSave={() => {}}
      mode="edit"
      onRegister={handleSubmitEdit}
      onComplete={handleComplete}
      onPreview={handlePreviewForEdit}
      onDescriptionChange={handleDescriptionChange}
      isSaving={isSubmitting}
    />
  );
}
