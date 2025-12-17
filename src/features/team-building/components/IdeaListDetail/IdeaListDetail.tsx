import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';

import { fetchCurrentTeamBuildingProject, fetchIdeaDetail } from '../../api/ideas';
import { createEmptyTeamCounts, Idea } from '../store/IdeaStore';
import { sanitizeDescription } from '../utils/sanitizeDescription';
import { partToLabel } from '../MyTeam/ApplyStatusSection';

const SMALL_BREAKPOINT = '600px';
const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
] as const;

const TEAM_GROUPS: Array<Array<(typeof TEAM_ROLES)[number]['key']>> = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];

// part를 team key로 매핑
const partToKey: Record<string, (typeof TEAM_ROLES)[number]['key']> = {
  PM: 'planning',
  DESIGN: 'design',
  WEB: 'frontendWeb',
  MOBILE: 'frontendMobile',
  BACKEND: 'backend',
  AI: 'aiMl',
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
    part: string;
    school: string;
  };
  compositions: Array<{
    part: string;
    maxCount: number;
    currentCount: number;
  }>;
};

// API 응답을 Idea 타입으로 변환
const normalizeIdeaDetail = (apiIdea: IdeaDetailResponse): Idea => {
  const compositions = apiIdea.compositions || [];
  const totalMembers = compositions.reduce((sum, comp) => sum + comp.maxCount, 0);
  const currentMembers = compositions.reduce((sum, comp) => sum + comp.currentCount, 0);

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

const PageContainer = styled.div`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 0;
  width: 100%;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;

const PreviewCanvas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 1080px;
`;

const TitleSection = styled.section`
  display: flex;
  width: 100%;
  padding: 36px 0 20px 0;
  flex-direction: column;
  align-items: flex-start;
`;

const TitleText = styled.h1`
  margin: 0;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  text-align: left;
`;

const IntroText = styled.p`
  margin: 0 0 0 0;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const IntroRow = styled.div`
  display: flex;
  width: 100%;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;

  ${IntroText} {
    flex: 1;
  }
`;

const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
  padding: 32px 0 0;
  flex-wrap: wrap;
`;

const SubjectLabel = styled.span`
  min-width: 140px;
  color: #040405;
  font-size: 20px;
  font-weight: 700;
  line-height: 160%;
`;

const SubjectValue = styled.span`
  flex: 1;
  color: #040405;
  font-size: 20px;
  font-weight: 500;
  line-height: 160%;
`;

const MentorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
  align-self: baseline;
`;

const MentorPart = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 400;
  line-height: 160%;
`;

const Mentor = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 600;
  line-height: 160%;
`;

const MembersSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
  align-items: flex-start;
`;

const SectionTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
  margin-bottom: 20px;
`;

const MemberCard = styled.div`
  width: 100%;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  background: #ffffff;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MemberRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 40px;
  row-gap: 16px;
`;

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const RoleName = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const CountStat = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 24px;
  font-weight: 700;
  color: #4285f4;
`;

const CountUnit = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: #040405;
`;

const DescriptionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 0 0;
`;

const DescriptionBox = styled.div`
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  background: #ffffff;
  padding: 30px;
  min-height: 320px;
  color: #040405;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.7;

  * {
    font-family: 'Pretendard';
  }

  h1,
  h2,
  h3 {
    margin: 0 0 12px;
    font-weight: 500;
    font-style: normal;
    line-height: 160%;
  }

  h1 {
    font-size: 24px;
    font-weight: 500;
  }

  h2 {
    font-size: 18px;
    font-weight: 500;
  }

  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
  }

  p {
    margin: 0 0 16px;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
  }
`;

const ResponsiveWrapper = styled.div`
  width: 100%;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    ${MemberRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

const ActionRow = styled.div`
  margin: 120px auto 52px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 160%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PrimaryButton = styled(ActionButton)`
  border: 1px solid #4285f4;
  background: #4285f4;
  color: #f9f9fa;
  padding: 10px 8px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #626873;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #ea4335;
`;

export default function IdeaListPage() {
  const router = useRouter();
  const { id } = router.query;

  const [idea, setIdea] = React.useState<Idea | null>(null);
  const [creatorInfo, setCreatorInfo] = React.useState<IdeaDetailResponse['creator'] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [projectId, setProjectId] = React.useState<number | null>(null);

  const numericId = React.useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  // 프로젝트 ID 가져오기 (URL 쿼리 또는 다른 소스에서)
  React.useEffect(() => {
    const controller = new AbortController();

    const loadProjectId = async () => {
      try {
        const resp = await fetchCurrentTeamBuildingProject({ signal: controller.signal });
        const project = resp.data?.project;
        const nextProjectId = Number(project?.projectId);

        if (Number.isFinite(nextProjectId) && nextProjectId > 0) {
          setProjectId(nextProjectId);
        } else {
          setProjectId(null);
          setError('프로젝트 정보를 불러오지 못했습니다.');
        }
      } catch (err) {
        const isCanceled =
          (err as any)?.code === 'ERR_CANCELED' || (err as Error).name === 'CanceledError';
        if (!isCanceled) {
          console.warn('프로젝트 정보 조회 실패:', err);
          setProjectId(null);
          setError('프로젝트 정보를 불러오지 못했습니다.');
        }
      }
    };

    loadProjectId();
    return () => controller.abort();
  }, []);

  // API에서 아이디어 상세 정보 로드
  React.useEffect(() => {
    if (!Number.isFinite(numericId) || !projectId) return;

    const loadIdeaDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchIdeaDetail(projectId, numericId);
        const data = response.data as IdeaDetailResponse;

        const normalizedIdea = normalizeIdeaDetail(data);
        setIdea(normalizedIdea);
        setCreatorInfo(data.creator);
      } catch (err) {
        console.error('아이디어 상세 조회 실패:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError('아이디어를 찾을 수 없습니다.');
          } else {
            setError('아이디어를 불러오는데 실패했습니다.');
          }
        } else {
          setError('아이디어를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadIdeaDetail();
  }, [numericId, projectId]);

  const roleMap = React.useMemo(
    () =>
      TEAM_ROLES.reduce(
        (acc, role) => {
          acc[role.key] = role;
          return acc;
        },
        {} as Record<(typeof TEAM_ROLES)[number]['key'], (typeof TEAM_ROLES)[number]>
      ),
    []
  );

  const team = React.useMemo(
    () => ({
      ...createEmptyTeamCounts(),
      ...(idea?.team ?? {}),
    }),
    [idea?.team]
  );

  const preferredRoleKey = React.useMemo<(typeof TEAM_ROLES)[number]['key'] | null>(() => {
    const preferred = idea?.preferredPart;
    if (!preferred) return null;
    const matched = TEAM_ROLES.find(role => role.label === preferred || role.key === preferred);
    if (matched) return matched.key;
    // part 코드로도 확인
    const keyFromPart = partToKey[preferred];
    return keyFromPart || null;
  }, [idea?.preferredPart]);

  const filledTeam = React.useMemo(
    () => ({
      ...createEmptyTeamCounts(),
      ...(idea?.filledTeam ?? {}),
    }),
    [idea?.filledTeam]
  );

  const displayTotals = React.useMemo(() => {
    const totals: Record<(typeof TEAM_ROLES)[number]['key'], number> = {
      ...createEmptyTeamCounts(),
      ...team,
    };
    if (preferredRoleKey) {
      totals[preferredRoleKey] = Math.max(totals[preferredRoleKey] ?? 0, 1);
    }
    return totals;
  }, [preferredRoleKey, team]);

  const displayCurrents = React.useMemo(() => {
    const currents: Record<(typeof TEAM_ROLES)[number]['key'], number> = createEmptyTeamCounts();
    TEAM_ROLES.forEach(role => {
      const limit = displayTotals[role.key] ?? 0;
      const ownerSlot = preferredRoleKey === role.key ? 1 : 0;
      const applied = filledTeam[role.key] ?? 0;
      const totalApplied = ownerSlot + applied;
      currents[role.key] = limit > 0 ? Math.min(totalApplied, limit) : totalApplied;
    });
    return currents;
  }, [displayTotals, filledTeam, preferredRoleKey]);

  const safeDescription = React.useMemo(
    () => sanitizeDescription(idea?.description || ''),
    [idea?.description]
  );

  if (isLoading) {
    return (
      <PageContainer>
        <PreviewCanvas>
          <LoadingMessage>아이디어를 불러오는 중입니다...</LoadingMessage>
        </PreviewCanvas>
      </PageContainer>
    );
  }

  if (error || !idea) {
    return (
      <PageContainer>
        <PreviewCanvas>
          <ErrorMessage>{error || '아이디어를 찾을 수 없습니다.'}</ErrorMessage>
        </PreviewCanvas>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PreviewCanvas>
        <ResponsiveWrapper>
          <TitleSection>
            <TitleText>{idea.title || '아이디어 제목'}</TitleText>

            <IntroRow>
              <IntroText>{idea.intro || '아이디어 한줄소개'}</IntroText>
              {creatorInfo && (
                <MentorContainer>
                  <MentorPart>
                    {creatorInfo.school} {partToLabel(creatorInfo.part)}{' '}
                    <Mentor as="span">{creatorInfo.creatorName}</Mentor>
                  </MentorPart>
                </MentorContainer>
              )}
            </IntroRow>
          </TitleSection>

          <SubjectRow>
            <SubjectLabel>아이디어 주제</SubjectLabel>
            <SubjectValue>{idea.topic || '주제 없음'}</SubjectValue>
          </SubjectRow>

          <MembersSection>
            <SectionTitle>모집 인원</SectionTitle>
            <MemberCard>
              {TEAM_GROUPS.map(group => (
                <MemberRow key={group.join('-')}>
                  {group.map(roleKey => {
                    const role = roleMap[roleKey];
                    const total = displayTotals[role.key] ?? 0;
                    const current = displayCurrents[role.key] ?? 0;
                    return (
                      <MemberCount key={role.key}>
                        <RoleName>{role.label}</RoleName>
                        <CountStat>
                          {current} / {total}
                          <CountUnit>&nbsp;명</CountUnit>
                        </CountStat>
                      </MemberCount>
                    );
                  })}
                </MemberRow>
              ))}
            </MemberCard>
          </MembersSection>

          <DescriptionSection>
            <SectionTitle>아이디어 설명</SectionTitle>
            <DescriptionBox
              dangerouslySetInnerHTML={{
                __html:
                  safeDescription ||
                  '<p>Github README 작성에 쓰이는 "markdown"을 이용해 작성해보세요.</p>',
              }}
            />
          </DescriptionSection>
        </ResponsiveWrapper>

        <ActionRow>
          <PrimaryButton
            type="button"
            onClick={() =>
              router.push({
                pathname: '/IdeaApply',
                query: { id: idea.id },
              })
            }
          >
            아이디어 지원하기
          </PrimaryButton>
        </ActionRow>
      </PreviewCanvas>
    </PageContainer>
  );
}
