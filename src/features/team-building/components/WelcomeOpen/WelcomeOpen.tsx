// WelcomeView.tsx 수정 (API 연동 + 일정 모달 + 개별 조회)
import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

import {
  CurrentProjectSchedule,
  fetchCurrentTeamBuildingProject,
  fetchIdeaDetail,
  fetchIdeas,
  TeamBuildingScheduleType,
} from '../../api/ideas';
import {
  ApplyCTNR,
  ArrowIcon,
  Container,
  EmptyCard,
  EmptyMessage,
  FilterContainer,
  GrowthonLogo,
  IdeaContentCTNR,
  IdeaHeaderRow,
  IdeaItemCTNR,
  NumberCTNR,
  PageButton,
  PageInsertNum,
  Pagination,
  ProjectTitleRow,
  RecruitStatusCTNR,
  RegisterButtonLink,
  ScheduleDot,
  ScheduleMarker,
  ScheduleModalCard,
  ScheduleModalCloseButton,
  ScheduleModalHeader,
  ScheduleModalOverlay,
  ScheduleModalSubtitle,
  ScheduleModalTitle,
  ScheduleStep,
  ScheduleStepDate,
  ScheduleSteps,
  ScheduleStepTitle,
  StateLabel,
  StateRow,
  StateToggle,
  StatusActions,
  StatusBar,
  StatusCount,
  StatusLabel,
  StatusText,
  Subtitle,
  Title,
  TitleSection,
  TopicSelectBox,
  Wrapper,
} from '../../styles/WelcomeOpen';
import Button from '../Button';
import IdeaItem from '../IdeaItem/IdeaItem';
import { Idea } from '../store/IdeaStore';
import Toggle from '../Toggle';

const IDEAS_PER_PAGE = 10;

export const SCHEDULE_LABEL: Record<VisibleScheduleType, string> = {
  IDEA_REGISTRATION: '아이디어 등록 기간',
  FIRST_TEAM_BUILDING: '1차 팀빌딩 지원 기간',
  FIRST_TEAM_BUILDING_ANNOUNCEMENT: '1차 팀빌딩 결과 발표',
  SECOND_TEAM_BUILDING: '2차 팀빌딩 지원 기간',
  SECOND_TEAM_BUILDING_ANNOUNCEMENT: '2차 팀빌딩 결과 발표',
  FINAL_RESULT_ANNOUNCEMENT: '최종 팀빌딩 결과 발표',
};

const SCHEDULE_ORDER = [
  'IDEA_REGISTRATION',
  'FIRST_TEAM_BUILDING',
  'FIRST_TEAM_BUILDING_ANNOUNCEMENT',
  'SECOND_TEAM_BUILDING',
  'SECOND_TEAM_BUILDING_ANNOUNCEMENT',
  'FINAL_RESULT_ANNOUNCEMENT',
] as const;

function isVisibleScheduleType(type: TeamBuildingScheduleType): type is VisibleScheduleType {
  return (SCHEDULE_ORDER as readonly string[]).includes(type);
}

type VisibleScheduleType = (typeof SCHEDULE_ORDER)[number];

const SCHEDULE_MODAL_STORAGE_KEY = 'welcomeOpenScheduleModalSeen';
const SCHEDULE_MODAL_BODY_CLASS = 'schedule-modal-open';

type IdeaResponse = {
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

type PageInfo = {
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
};

type IdeasApiResponse = {
  ideas: IdeaResponse[];
  pageInfo: PageInfo;
};

// part를 team key로 매핑
const partToKey: Record<string, keyof Idea['team']> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
};

// API 응답을 Idea 타입으로 변환
const normalizeIdea = (apiIdea: IdeaResponse): Idea => {
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
    const key = partToKey[comp.part];
    if (key) {
      team[key] = comp.maxCount || 0;
      filledTeam[key] = comp.currentCount || 0;
    }
  });

  // compositions에서 계산
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

export default function WelcomeView() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [topicFilter, setTopicFilter] = useState('전체');
  const [excludeClosed, setExcludeClosed] = useState(false);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [topicIdMap, setTopicIdMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [projectName, setProjectName] = useState<string>('');
  const [schedules, setSchedules] = useState<CurrentProjectSchedule[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isRegistrable, setIsRegistrable] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 일정 모달 초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeenModal = window.localStorage.getItem(SCHEDULE_MODAL_STORAGE_KEY);
    if (!hasSeenModal) setShowScheduleModal(true);
  }, []);

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (!showScheduleModal || typeof document === 'undefined') return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showScheduleModal]);

  // 모달 열릴 때 body 클래스 추가
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (showScheduleModal) {
      body.classList.add(SCHEDULE_MODAL_BODY_CLASS);
    } else {
      body.classList.remove(SCHEDULE_MODAL_BODY_CLASS);
    }
    return () => {
      body.classList.remove(SCHEDULE_MODAL_BODY_CLASS);
    };
  }, [showScheduleModal]);

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SCHEDULE_MODAL_STORAGE_KEY, 'true');
    }
  };

  // 프로젝트 정보 로드
  useEffect(() => {
    const controller = new AbortController();

    const fetchProjectInfo = async () => {
      try {
        const resp = await fetchCurrentTeamBuildingProject({ signal: controller.signal });
        const data = resp.data;
        const project = data?.project;
        const registrable = data?.registrable;

        setSchedules(Array.isArray(project?.schedules) ? project.schedules : []);
        setIsRegistrable(registrable);

        const nextProjectId = Number(project?.projectId);
        if (!Number.isNaN(nextProjectId) && nextProjectId > 0) {
          setProjectId(nextProjectId);
        } else {
          setProjectId(null);
        }

        if (typeof project?.projectName === 'string') {
          setProjectName(project.projectName);
        }

        if (Array.isArray(project?.topics)) {
          const nextMap: Record<string, number> = {};
          project.topics.forEach((topic: any) => {
            if (typeof topic?.topic === 'string' && typeof topic?.topicId === 'number') {
              nextMap[topic.topic] = topic.topicId;
            }
          });
          setTopicIdMap(nextMap);
        }
      } catch (err) {
        const isCanceled =
          (err as any)?.code === 'ERR_CANCELED' || (err as Error).name === 'CanceledError';
        if (!isCanceled) {
          console.warn('프로젝트 정보 조회 실패');
          setProjectId(null);
        }
      }
    };

    fetchProjectInfo();
    return () => controller.abort();
  }, []);

  // 아이디어 목록 조회 (개별 상세 조회로 compositions 보완)
  const loadIdeas = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);

    try {
      const topicId = topicFilter !== '전체' ? topicIdMap[topicFilter] : undefined;

      const params = {
        page: Math.max(0, currentPage - 1),
        size: IDEAS_PER_PAGE,
        sortBy: 'id',
        order: 'DESC' as const,
        recruitingOnly: excludeClosed,
        ...(topicId !== undefined && { topicId }),
      };

      const response = await fetchIdeas(projectId, params);
      const data = response.data as IdeasApiResponse;

      const ideasArray = Array.isArray(data?.ideas) ? data.ideas : [];

      // 각 아이디어의 상세 정보를 가져와서 compositions 채우기
      const ideasWithCompositions = await Promise.all(
        ideasArray.map(async idea => {
          // compositions가 비어있으면 개별 상세 조회
          if (!idea.compositions || idea.compositions.length === 0) {
            try {
              const detailResponse = await fetchIdeaDetail(projectId, idea.ideaId);
              const detailData = detailResponse.data;
              return {
                ...idea,
                compositions: detailData.compositions || [],
              };
            } catch (err) {
              console.warn(`아이디어 ${idea.ideaId} 상세 조회 실패:`, err);
              return idea;
            }
          }
          return idea;
        })
      );

      const normalizedIdeas = ideasWithCompositions.map(normalizeIdea);

      setIdeas(normalizedIdeas);
      setTotalIdeas(data?.pageInfo?.totalCount || 0);
      setTotalPages(data?.pageInfo?.totalPages || 1);
    } catch (err) {
      console.warn('아이디어 목록 조회 실패:', err);
      setIdeas([]);
      setTotalIdeas(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, currentPage, topicFilter, excludeClosed, topicIdMap]);

  // 아이디어 목록 로드
  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const handleChangeTopic = (topic: string) => {
    setTopicFilter(topic);
    setCurrentPage(1);
  };

  const handleToggleExclude = () => {
    setExcludeClosed(prev => !prev);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * IDEAS_PER_PAGE;
  const visibleIdeasCount = ideas.length;

  const topicOptions = useMemo(() => {
    const dynamic = Object.keys(topicIdMap);
    return ['전체', ...dynamic];
  }, [topicIdMap]);

  const visibleSchedules = useMemo(() => {
    return schedules
      .filter((s): s is CurrentProjectSchedule & { scheduleType: VisibleScheduleType } =>
        isVisibleScheduleType(s.scheduleType)
      )
      .sort(
        (a, b) => SCHEDULE_ORDER.indexOf(a.scheduleType) - SCHEDULE_ORDER.indexOf(b.scheduleType)
      );
  }, [schedules]);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    // 필요하면 로케일/AMPM 맞춰 커스텀
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (projectId === null) {
    return (
      <Container>
        <Wrapper>
          <EmptyMessage>프로젝트 정보를 불러오는 중...</EmptyMessage>
        </Wrapper>
      </Container>
    );
  }

  return (
    <>
      {mounted &&
        showScheduleModal &&
        createPortal(
          <ScheduleModalOverlay onClick={handleCloseScheduleModal}>
            <ScheduleModalCard role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
              <ScheduleModalHeader>
                <div>
                  <ScheduleModalTitle>{projectName}</ScheduleModalTitle>
                  <ScheduleModalSubtitle>팀빌딩 진행 일정</ScheduleModalSubtitle>
                </div>
                <ScheduleModalCloseButton>
                  <Image
                    src="/outX.svg"
                    alt="닫기 아이콘"
                    width={20}
                    height={20}
                    style={{ aspectRatio: '1 / 1' }}
                    onClick={handleCloseScheduleModal}
                  />
                </ScheduleModalCloseButton>
              </ScheduleModalHeader>

              <ScheduleSteps>
                {visibleSchedules.map((s, idx) => {
                  const isLast = idx === visibleSchedules.length - 1;
                  const title = SCHEDULE_LABEL[s.scheduleType];

                  const isAnnouncement = s.scheduleType.endsWith('ANNOUNCEMENT');
                  const period = isAnnouncement
                    ? formatDateTime(s.startAt)
                    : `${formatDateTime(s.startAt)} ~ ${formatDateTime(s.endAt)}`;

                  return (
                    <ScheduleStep key={s.scheduleType} $isLast={isLast}>
                      <ScheduleMarker $isLast={isLast}>
                        <ScheduleDot />
                      </ScheduleMarker>
                      <div>
                        <ScheduleStepTitle>{title}</ScheduleStepTitle>
                        <ScheduleStepDate>{period}</ScheduleStepDate>
                      </div>
                    </ScheduleStep>
                  );
                })}
              </ScheduleSteps>
            </ScheduleModalCard>
          </ScheduleModalOverlay>,
          document.body
        )}

      <Container>
        <Wrapper>
          <TitleSection>
            <Title>Team Building</Title>

            <ProjectTitleRow>
              <Subtitle>
                {projectName || '프로젝트'}
                <GrowthonLogo
                  src="/GrowthonScheduleIcon.svg"
                  alt="그로우톤 로고"
                  width={36}
                  height={36}
                  priority
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowScheduleModal(true)}
                />
              </Subtitle>
            </ProjectTitleRow>
          </TitleSection>

          <StatusBar>
            <StatusText>
              <StatusLabel>아이디어 현황</StatusLabel>
              <StatusCount>{totalIdeas}개</StatusCount>
            </StatusText>

            <StatusActions>
              {isRegistrable && (
                <RegisterButtonLink href="/IdeaForm">
                  <Button
                    title="아이디어 등록하기"
                    disabled={false}
                    className="IdeaButton"
                    css={{
                      display: 'flex',
                      width: '200px',
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
                  />
                </RegisterButtonLink>
              )}
            </StatusActions>
          </StatusBar>

          <FilterContainer>
            <TopicSelectBox
              options={topicOptions}
              placeholder={topicFilter || '주제를 선택해주세요.'}
              multiple={false}
              searchable={false}
              onChange={selected => handleChangeTopic(selected[0] ?? '')}
            />

            <StateRow>
              <StateLabel>모집 중인 공고만 보기</StateLabel>

              <StateToggle
                $active={excludeClosed}
                onClick={handleToggleExclude}
                role="switch"
                aria-checked={excludeClosed}
              >
                <Toggle checked={excludeClosed} />
              </StateToggle>
            </StateRow>
          </FilterContainer>

          {isLoading ? (
            <EmptyCard>
              <EmptyMessage>로딩 중...</EmptyMessage>
            </EmptyCard>
          ) : visibleIdeasCount === 0 ? (
            <EmptyCard>
              <EmptyMessage>
                아직 아이디어가 없어요 😃
                <br />첫 번째 아이디어의 주인공이 되어보세요!
              </EmptyMessage>
            </EmptyCard>
          ) : (
            <>
              <IdeaHeaderRow>
                <NumberCTNR>순번</NumberCTNR>
                <IdeaContentCTNR>아이디어 내용</IdeaContentCTNR>
                <ApplyCTNR>지원 현황</ApplyCTNR>
                <RecruitStatusCTNR>모집 상태</RecruitStatusCTNR>
              </IdeaHeaderRow>

              {ideas.map((idea: Idea, idx: number) => (
                <IdeaItemCTNR key={idea.id}>
                  <IdeaItem idea={idea} index={startIndex + idx + 1} />
                </IdeaItemCTNR>
              ))}

              <Pagination>
                <PageButton
                  $isArrow
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ArrowIcon $direction="left" />
                </PageButton>

                {Array.from({ length: totalPages }, (_, pageIndex) => {
                  const pageNumber = pageIndex + 1;
                  const isActive = pageNumber === currentPage;
                  return (
                    <PageInsertNum
                      key={pageNumber}
                      $active={isActive}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => handlePageChange(pageNumber)}
                      css={{
                        cursor: 'pointer',
                        display: 'flex',
                        width: '40px',
                        height: '40px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '8px',
                        background: isActive ? 'var(--primary-600-main, #4285F4)' : '#ffffff',
                        color: isActive
                          ? 'var(--grayscale-100, #ffffff)'
                          : 'var(--grayscale-1000, #000000)',
                      }}
                    >
                      {pageNumber}
                    </PageInsertNum>
                  );
                })}

                <PageButton
                  $isArrow
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ArrowIcon $direction="right" />
                </PageButton>
              </Pagination>
            </>
          )}
        </Wrapper>
      </Container>
    </>
  );
}
