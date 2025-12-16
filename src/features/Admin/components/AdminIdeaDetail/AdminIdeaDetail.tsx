import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import MyTeamCount from '../../../team-building/components/MyTeam/MyTeamCount';
import MyTeamMemberCard from '../../../team-building/components/MyTeam/MyTeamMember';
import MyTeamStatusCard from '../../../team-building/components/MyTeam/MyTeamStatus';
import { createEmptyTeamCounts, Idea, useIdeaStore } from '../../store/IdeaStore';
import {
  Brand,
  BrandContainer,
  BrandName,
  CancelButtonText,
  Content,
  ContentContainer,
  CountNum,
  CountStat,
  CountUnit,
  DeleteButtonText,
  Description,
  DescriptionBox,
  DescriptionSection,
  Heading,
  ImageContainer,
  IntroRow,
  IntroText,
  MemberCard,
  MemberCount,
  MemberRow,
  MembersSection,
  Mentor,
  MentorContainer,
  MentorPart,
  ModalActions,
  ModalButtonContainer,
  ModalCard,
  ModalInfo,
  ModalMessage,
  ModalOverlay,
  ModalSuccessCard,
  ModalSuccessCardTitle,
  ModalTitle,
  MyCancelButton,
  MyConfirmButton,
  MyDeleteButton,
  MySuccessButtonText,
  Nav,
  NavArrow,
  NavButton,
  NavString,
  Page,
  PreviewCanvas,
  ProfileDetails,
  ProfileName,
  ProfileTitle,
  ResponsiveWrapper,
  RoleName,
  Sidebar,
  SubjectLabel,
  SubjectValue,
  Title,
  TitleSection,
  TitleText,
} from '../../styles/AdminIdeaDetail';
import { sanitizeDescription } from '../../utils/sanitizeDescription';

type NavItem = {
  label: string;
  active?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: '대시보드' },
  { label: '가입 심사' },
  { label: '멤버 관리' },
  { label: '프로젝트 관리' },
  { label: '아이디어 관리', active: true },
  { label: '프로젝트 갤러리 관리' },
  { label: '액티비티 관리' },
];
const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'aiMl', label: 'AI/ML' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)' },
  { key: 'backend', label: '백엔드' },
] as const;
const TEAM_GROUPS: Array<Array<(typeof TEAM_ROLES)[number]['key']>> = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];
type MemberDisplay = { id: string; name: string; isLeader?: boolean };
type TeamPartDisplay = {
  key: (typeof TEAM_ROLES)[number]['key'];
  label: string;
  capacity: number;
  current: number;
  isRecruiting: boolean;
  members: MemberDisplay[];
};
const DEFAULT_MEMBERS: Record<(typeof TEAM_ROLES)[number]['key'], MemberDisplay[]> = {
  planning: [{ id: 'plan-1', name: '홍길동', isLeader: true }],
  design: [
    { id: 'design-1', name: '주현지' },
    { id: 'design-2', name: '홍길동' },
  ],
  aiMl: [],
  frontendWeb: [],
  frontendMobile: [],
  backend: [
    { id: 'be-1', name: '홍길동' },
    { id: 'be-2', name: '홍길동' },
    { id: 'be-3', name: '홍길동' },
    { id: 'be-4', name: '홍길동' },
  ],
};
const DUMMY_IDEA: Idea = {
  id: 999999,
  topic: '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션',
  title: '리빙메이트',
  intro: '월세 부담을 덜어주는 룸메이트 매칭 서비스',
  description:
    '# 청년들의 월세 부담을 덜어줄 메이트, 리빙메이트\n\n### 다들 월세 얼마씩 내세요?\n저는 80만원이나 내고 있는데, 이걸 반반 부담할 친구가 있다면 얼마나 좋을까요? ',
  preferredPart: 'planning',
  team: {
    planning: 1,
    design: 2,
    frontendWeb: 3,
    frontendMobile: 0,
    backend: 4,
    aiMl: 0,
  },
  filledTeam: {
    planning: 1,
    design: 2,
    frontendWeb: 0,
    frontendMobile: 0,
    backend: 4,
    aiMl: 0,
  },
  currentMembers: 7,
  totalMembers: 10,
  status: '모집 중',
};

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
  display: flex;
  align-items: center;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
  margin: 160px 0 0;
`;

const ActionButton = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 8px;
  border: 1px solid
    ${({ $primary, $danger }) => {
      if ($primary) return '#4285f4';
      if ($danger) return '#f44242';
      return '#d7dadd';
    }};
  background: #ffffff;
  color: ${({ $primary, $danger }) => {
    if ($primary) return '#4285f4';
    if ($danger) return '#f44242';
    return '#040405';
  }};
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    background: ${({ $primary, $danger }) => {
      if ($primary) return 'rgba(66, 133, 244, 0.08)';
      if ($danger) return 'rgba(244, 66, 66, 0.08)';
      return 'rgba(0, 0, 0, 0.02)';
    }};
  }
`;

const SubjectRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 100px;
  margin: 40px 0 20px 0;
`;

const TeamCompositionSection = styled.div`
  display: flex;
  width: 1080px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-top: 20px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 60px;
  width: 100%;
`;

const TeamPartColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TeamPartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TeamPartTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
`;

const TeamPartBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function AdminIdeaDetail() {
  const router = useRouter();
  const { id } = router.query;

  const hasHydratedIdeas = useIdeaStore(state => state.hasHydrated);
  const hydrateIdeas = useIdeaStore(state => state.hydrateFromStorage);
  const removeIdea = useIdeaStore(state => state.removeIdea);

  const numericId = React.useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const idea: Idea | undefined = useIdeaStore(state =>
    Number.isFinite(numericId) ? state.getIdeaById(numericId) : undefined
  );

  const effectiveIdea: Idea = idea ?? DUMMY_IDEA;

  React.useEffect(() => {
    if (!hasHydratedIdeas) {
      hydrateIdeas();
    }
  }, [hasHydratedIdeas, hydrateIdeas]);
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');
  const [resolvedTitle, setResolvedTitle] = useState<string>(effectiveIdea.title);
  const [resolvedIntro, setResolvedIntro] = useState<string>(effectiveIdea.intro);
  const [rawDescription, setRawDescription] = useState<string>(effectiveIdea.description);
  const [memberMap, setMemberMap] =
    useState<Record<(typeof TEAM_ROLES)[number]['key'], MemberDisplay[]>>(DEFAULT_MEMBERS);

  const handleDeleteConfirm = () => {
    if (Number.isFinite(numericId)) {
      removeIdea(numericId);
    }
    setModalState('success');
  };

  const handleCloseModal = () => setModalState('closed');

  const handleSuccessClose = () => {
    setModalState('closed');
    router.push('/AdminIdeaProject');
  };

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
      ...(effectiveIdea.team ?? {}),
    }),
    [effectiveIdea.team]
  );

  const preferredRoleKey = React.useMemo<(typeof TEAM_ROLES)[number]['key'] | null>(() => {
    const preferred = effectiveIdea.preferredPart;
    if (!preferred) return null;
    const matched = TEAM_ROLES.find(role => role.label === preferred || role.key === preferred);
    return matched ? matched.key : null;
  }, [effectiveIdea.preferredPart]);

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
      const memberCount = memberMap[role.key]?.length ?? 0;
      currents[role.key] = limit > 0 ? Math.min(memberCount, limit) : memberCount;
    });
    return currents;
  }, [displayTotals, memberMap]);

  const teamParts: TeamPartDisplay[] = React.useMemo(
    () =>
      TEAM_ROLES.map(role => {
        const capacity = displayTotals[role.key] ?? 0;
        const allMembers = memberMap[role.key] ?? [];
        const visibleMembers = capacity > 0 ? allMembers.slice(0, capacity) : [];
        const current = Math.min(visibleMembers.length, capacity);

        return {
          key: role.key,
          label: role.label,
          capacity,
          current,
          isRecruiting: capacity > 0,
          members: visibleMembers,
        };
      }),
    [displayTotals, memberMap]
  );

  const handleRemoveMember = (partKey: (typeof TEAM_ROLES)[number]['key'], memberId: string) => {
    setMemberMap(prev => ({
      ...prev,
      [partKey]: (prev[partKey] ?? []).filter(member => member.id !== memberId),
    }));
  };

  React.useEffect(() => {
    setResolvedTitle(effectiveIdea.title);
    setResolvedIntro(effectiveIdea.intro);
    setRawDescription(effectiveIdea.description);
  }, [effectiveIdea.description, effectiveIdea.intro, effectiveIdea.title]);

  React.useEffect(() => {
    if (idea) return;
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('ideaFormData');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const draft = parsed?.form ?? parsed;
      if (draft?.title) setResolvedTitle(draft.title);
      if (draft?.intro) setResolvedIntro(draft.intro);
      if (draft?.description) setRawDescription(draft.description);
    } catch (error) {
      console.error('Failed to load idea data from session', error);
    }
  }, [idea]);

  const safeDescription = React.useMemo(
    () => sanitizeDescription(rawDescription || ''),
    [rawDescription]
  );

  const sidebar = (
    <Sidebar>
      <BrandContainer>
        <Brand>
          <ImageContainer>
            <Image src="/gdgoc_skhu_admin.svg" alt="GDGoC SKHU 로고" width={60} height={38} />
          </ImageContainer>
          <BrandName>GDGoC SKHU</BrandName>
        </Brand>
      </BrandContainer>

      <ProfileDetails>
        <ProfileName>윤준석</ProfileName>
        <ProfileTitle>님</ProfileTitle>
      </ProfileDetails>

      <Nav>
        {NAV_ITEMS.map(item => (
          <NavButton key={item.label} type="button" $active={item.active}>
            <NavString $active={item.active}>
              <span>{item.label}</span>
            </NavString>

            <NavArrow aria-hidden="true" $visible={Boolean(item.active)}>
              <Image src="/rightarrow_admin.svg" alt="오른쪽 화살표" width={16} height={16} />
            </NavArrow>
          </NavButton>
        ))}
        <NavButton key={''} type="button">
          <NavString>
            <span>홈 화면으로 나가기</span>
          </NavString>
        </NavButton>
      </Nav>
    </Sidebar>
  );

  return (
    <Page>
      {sidebar}
      <Content>
        <ContentContainer>
          <Heading>
            <Title>아이디어 관리</Title>
            <Description>역대 프로젝트에 게시된 아이디어 리스트를 관리할 수 있습니다.</Description>
          </Heading>

          <PreviewCanvas>
            <ResponsiveWrapper>
              <TitleSection>
                <TitleText>{resolvedTitle || '아이디어 제목'}</TitleText>

                <IntroRow>
                  <IntroText>{resolvedIntro || '아이디어 한줄소개'}</IntroText>
                  <MentorContainer>
                    <MentorPart>
                      성공회대 디자인 <Mentor as="span">주현지</Mentor>
                    </MentorPart>
                  </MentorContainer>
                </IntroRow>
              </TitleSection>

              <SubjectRow>
                <SubjectLabel>아이디어 주제</SubjectLabel>
                <SubjectValue>
                  {effectiveIdea.topic ||
                    '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'}
                </SubjectValue>
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
                              <CountNum>
                                {' '}
                                {current} / {total}
                              </CountNum>
                              <CountUnit>명</CountUnit>
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
            <TeamCompositionSection>
              <SectionTitle>현재 팀원 구성</SectionTitle>
              <TeamGrid>
                {teamParts.map(part => (
                  <TeamPartColumn key={part.key}>
                    <TeamPartHeader>
                      <TeamPartTitle>{part.label}</TeamPartTitle>
                      <MyTeamCount
                        current={part.current}
                        capacity={part.capacity}
                        isRecruiting={part.isRecruiting}
                      />
                    </TeamPartHeader>

                    <TeamPartBody>
                      {!part.isRecruiting && <MyTeamStatusCard variant="not-recruiting" />}
                      {part.isRecruiting && part.current === 0 && (
                        <MyTeamStatusCard variant="not-filled" />
                      )}
                      {part.isRecruiting &&
                        part.members.map(member => (
                          <MyTeamMemberCard
                            key={member.id}
                            variant={member.isLeader ? 'leader' : 'managedMember'}
                            name={member.name}
                            width="100%"
                            onClickRemove={
                              member.isLeader
                                ? undefined
                                : () => handleRemoveMember(part.key, member.id)
                            }
                          />
                        ))}
                    </TeamPartBody>
                  </TeamPartColumn>
                ))}
              </TeamGrid>
            </TeamCompositionSection>
          </PreviewCanvas>

          <ActionRow>
            <ActionButton $primary type="button">
              아이디어 수정하기
            </ActionButton>
            <ActionButton $danger type="button" onClick={() => setModalState('confirm')}>
              아이디어 삭제하기
            </ActionButton>
          </ActionRow>

          {modalState !== 'closed' && (
            <ModalOverlay>
              {modalState === 'confirm' && (
                <ModalCard>
                  <ModalInfo>
                    <ModalTitle>{resolvedTitle || '아이디어 제목'}</ModalTitle>
                    <ModalMessage>아이디어를 삭제할까요?</ModalMessage>
                    <ModalMessage>이 작업은 되돌릴 수 없습니다.</ModalMessage>
                  </ModalInfo>
                  <ModalActions>
                    <ModalButtonContainer>
                      <MyDeleteButton type="button" onClick={handleDeleteConfirm}>
                        <DeleteButtonText>삭제하기</DeleteButtonText>
                      </MyDeleteButton>
                      <MyCancelButton type="button" disabled={false} onClick={handleCloseModal}>
                        <CancelButtonText>취소</CancelButtonText>
                      </MyCancelButton>
                    </ModalButtonContainer>
                  </ModalActions>
                </ModalCard>
              )}

              {modalState === 'success' && (
                <ModalSuccessCard $compact>
                  <ModalSuccessCardTitle>아이디어가 삭제가 완료되었습니다.</ModalSuccessCardTitle>
                  <ModalActions>
                    <ModalButtonContainer>
                      <MyConfirmButton type="button" onClick={handleSuccessClose}>
                        <MySuccessButtonText>확인</MySuccessButtonText>
                      </MyConfirmButton>
                    </ModalButtonContainer>
                  </ModalActions>
                </ModalSuccessCard>
              )}
            </ModalOverlay>
          )}
        </ContentContainer>
      </Content>
    </Page>
  );
}
