import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
// 1. deleteAdminIdea API 추가 Import
import {
  AdminIdeaDetail as AdminIdeaDetailType,
  deleteAdminIdea,
  getAdminProjectIdeaDetail,
} from '@/lib/adminIdea.api';
import styled from 'styled-components';

import MyTeamCount from '../../../team-building/components/MyTeam/MyTeamCount';
import MyTeamMemberCard from '../../../team-building/components/MyTeam/MyTeamMember';
import MyTeamStatusCard from '../../../team-building/components/MyTeam/MyTeamStatus';
import {
  CancelButtonText,
  ContentContainer,
  CountNum,
  CountStat,
  CountUnit,
  DeleteButtonText,
  Description,
  DescriptionBox,
  DescriptionSection,
  Heading,
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
  PreviewCanvas,
  ResponsiveWrapper,
  RoleName,
  SubjectLabel,
  SubjectValue,
  Title,
  TitleSection,
  TitleText,
} from '../../styles/AdminIdeaDetail';
import { sanitizeDescription } from '../../utils/sanitizeDescription';

const TEAM_ROLES = [
  { key: 'planning', label: '기획', apiKey: 'PM' },
  { key: 'design', label: '디자인', apiKey: 'DESIGN' },
  { key: 'aiMl', label: 'AI/ML', apiKey: 'AI' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)', apiKey: 'WEB' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)', apiKey: 'MOBILE' },
  { key: 'backend', label: '백엔드', apiKey: 'BACKEND' },
] as const;

const TEAM_GROUPS: Array<Array<(typeof TEAM_ROLES)[number]['key']>> = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];

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
  const { id, projectId } = router.query;

  const [ideaData, setIdeaData] = useState<AdminIdeaDetailType | null>(null);
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  useEffect(() => {
    if (!id || !projectId) return;

    getAdminProjectIdeaDetail({
      projectId: Number(projectId),
      ideaId: Number(id),
    })
      .then(res => setIdeaData(res.data))
      .catch(err => console.error(err));
  }, [id, projectId]);

  const teamParts = useMemo(() => {
    if (!ideaData) return [];

    return TEAM_ROLES.map(roleDef => {
      const roster = ideaData.rosters.find(r => r.part === roleDef.apiKey);
      const capacity = roster?.maxMemberCount ?? 0;
      const current = roster?.currentMemberCount ?? 0;
      const members =
        roster?.members.map(m => ({
          id: String(m.userId),
          name: m.memberName,
          isLeader: m.memberRole === 'CREATOR',
        })) ?? [];

      return {
        key: roleDef.key,
        label: roleDef.label,
        capacity,
        current,
        isRecruiting: capacity > 0,
        members,
      };
    });
  }, [ideaData]);

  const statsMap = useMemo(() => {
    const map: Record<string, { current: number; total: number }> = {};
    teamParts.forEach(part => {
      map[part.key] = {
        current: part.current,
        total: part.capacity,
      };
    });
    return map;
  }, [teamParts]);

  const safeDescription = useMemo(
    () => sanitizeDescription(ideaData?.description ?? ''),
    [ideaData]
  );

  const handleEditClick = () => {
    router.push({
      pathname: '/AdminIdeaEdit',
      query: { projectId, id },
    });
  };

  // 2. 삭제 핸들러 수정: 실제 API 호출
  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      // API 호출
      await deleteAdminIdea(Number(id));
      // 성공 시 모달 상태 변경
      setModalState('success');
    } catch (error) {
      console.error('Failed to delete idea:', error);
      alert('아이디어 삭제에 실패했습니다.');
      setModalState('closed');
    }
  };

  const handleCloseModal = () => setModalState('closed');

  const handleSuccessClose = () => {
    setModalState('closed');
    // 삭제 후 아이디어 목록으로 이동 (projectId 유지)
    router.push({
      pathname: '/AdminIdeaIdea',
      query: { projectId },
    });
  };

  if (!ideaData) {
    return <ContentContainer>Loading...</ContentContainer>;
  }

  return (
    <ContentContainer>
      <Heading>
        <Title>아이디어 관리</Title>
        <Description>역대 프로젝트에 게시된 아이디어 리스트를 관리할 수 있습니다.</Description>
      </Heading>

      <PreviewCanvas>
        <ResponsiveWrapper>
          <TitleSection>
            <TitleText>{ideaData.title}</TitleText>
            <IntroRow>
              <IntroText>{ideaData.introduction}</IntroText>
              <MentorContainer>
                <MentorPart>
                  {ideaData.creator.school} {ideaData.creator.part}{' '}
                  <Mentor as="span">{ideaData.creator.creatorName}</Mentor>
                </MentorPart>
              </MentorContainer>
            </IntroRow>
          </TitleSection>

          <SubjectRow>
            <SubjectLabel>아이디어 주제</SubjectLabel>
            <SubjectValue>{ideaData.topic}</SubjectValue>
          </SubjectRow>

          <MembersSection>
            <SectionTitle>모집 인원</SectionTitle>
            <MemberCard>
              {TEAM_GROUPS.map(group => (
                <MemberRow key={group.join('-')}>
                  {group.map(roleKey => {
                    const roleLabel = TEAM_ROLES.find(r => r.key === roleKey)?.label;
                    const stat = statsMap[roleKey] ?? { current: 0, total: 0 };
                    return (
                      <MemberCount key={roleKey}>
                        <RoleName>{roleLabel}</RoleName>
                        <CountStat>
                          <CountNum>
                            {stat.current} / {stat.total}
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
            <DescriptionBox dangerouslySetInnerHTML={{ __html: safeDescription }} />
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
                      />
                    ))}
                </TeamPartBody>
              </TeamPartColumn>
            ))}
          </TeamGrid>
        </TeamCompositionSection>
      </PreviewCanvas>

      <ActionRow>
        <ActionButton $primary type="button" onClick={handleEditClick}>
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
                <ModalTitle>{ideaData.title}</ModalTitle>
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
  );
}
