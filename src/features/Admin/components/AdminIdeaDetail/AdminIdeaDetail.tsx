import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  AdminIdeaDetail as AdminIdeaDetailType,
  deleteAdminIdea,
  getAdminProjectIdeaDetail,
  removeAdminIdeaMember,
} from '@/lib/adminIdea.api';
import { colors } from '@/styles/constants';
import remarkBreaks from 'remark-breaks';
import styled from 'styled-components';

import MyTeamCount from '../../../team-building/components/MyTeam/MyTeamCount';
import MyTeamMemberCard from '../../../team-building/components/MyTeam/MyTeamMember';
import MyTeamStatusCard from '../../../team-building/components/MyTeam/MyTeamStatus';
import {
  CancelButtonText,
  ContentContainer,
  DeleteButtonText,
  Description,
  DescriptionSection,
  Heading,
  IntroRow,
  IntroText,
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
  MyDeleteButton,
  MySuccessButtonText,
  PreviewCanvas,
  ResponsiveWrapper,
  SubjectLabel,
  SubjectValue,
  Title,
  TitleSection,
  TitleText,
} from '../../styles/AdminIdeaDetail';

import '@uiw/react-markdown-preview/markdown.css';

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

/* ===============================
 * Constants
 * =============================== */

const TEAM_ROLES = [
  { key: 'planning', label: '기획', apiKey: 'PM' },
  { key: 'design', label: '디자인', apiKey: 'DESIGN' },
  { key: 'aiMl', label: 'AI/ML', apiKey: 'AI' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)', apiKey: 'WEB' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)', apiKey: 'MOBILE' },
  { key: 'backend', label: '백엔드', apiKey: 'BACKEND' },
] as const;

/* ===============================
 * Styled
 * =============================== */

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
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
    ${({ $primary, $danger }) => ($primary ? '#4285f4' : $danger ? '#f44242' : '#d7dadd')};
  background: #ffffff;
  color: ${({ $primary, $danger }) => ($primary ? '#4285f4' : $danger ? '#f44242' : '#040405')};
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
  gap: 20px;
  margin-top: 80px;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 16px;
  row-gap: 60px;
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
`;

const MarkdownPreviewBox = styled.div`
  border-radius: 8px;
  padding: 32px;
  outline: 1px ${colors.grayscale[400]} solid;
  outline-offset: -1px;
  background: #fff;
  min-height: 400px;

  & .wmde-markdown {
    background: transparent;
    ul {
      list-style: disc !important;
      padding-left: 1rem !important;
    }
    ol {
      list-style: decimal !important;
      padding-left: 1rem !important;
    }
  }

  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6 {
    font-family: 'Pretendard', sans-serif;
  }
  & code {
    font-family: 'Courier New', monospace;
  }
`;

/* ===============================
 * Component
 * =============================== */

export default function AdminIdeaDetail() {
  const router = useRouter();
  const { id, projectId } = router.query;

  const [ideaData, setIdeaData] = useState<AdminIdeaDetailType | null>(null);
  const [ideaModalState, setIdeaModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  const [memberModal, setMemberModal] = useState<{
    open: boolean;
    memberId: number | null;
    memberName: string;
  }>({ open: false, memberId: null, memberName: '' });

  useEffect(() => {
    if (!id || !projectId) return;

    getAdminProjectIdeaDetail({
      projectId: Number(projectId),
      ideaId: Number(id),
    })
      .then(res => setIdeaData(res.data))
      .catch(console.error);
  }, [id, projectId]);

  const teamParts = useMemo(() => {
    if (!ideaData) return [];

    return TEAM_ROLES.map(role => {
      const roster = ideaData.rosters.find(r => r.part === role.apiKey);

      return {
        key: role.key,
        label: role.label,
        capacity: roster?.maxMemberCount ?? 0,
        current: roster?.currentMemberCount ?? 0,
        isRecruiting: (roster?.maxMemberCount ?? 0) > 0,
        members:
          roster?.members.map(m => ({
            id: m.userId,
            name: m.memberName,
            isLeader: m.memberRole === 'CREATOR',
          })) ?? [],
      };
    });
  }, [ideaData]);

  const confirmRemoveMember = async () => {
    if (!ideaData || !memberModal.memberId) return;

    try {
      await removeAdminIdeaMember({
        ideaId: ideaData.ideaId,
        memberId: memberModal.memberId,
      });

      setIdeaData(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          rosters: prev.rosters.map(r => {
            const removed = r.members.some(m => m.userId === memberModal.memberId);
            return {
              ...r,
              members: r.members.filter(m => m.userId !== memberModal.memberId),
              currentMemberCount: removed ? r.currentMemberCount - 1 : r.currentMemberCount,
            };
          }),
        };
      });

      setMemberModal({ open: false, memberId: null, memberName: '' });
    } catch {
      alert('멤버 삭제에 실패했습니다.');
      setMemberModal({ open: false, memberId: null, memberName: '' });
    }
  };

  const handleDeleteIdea = async () => {
    if (!ideaData) return;

    try {
      await deleteAdminIdea(ideaData.ideaId);
      setIdeaModalState('success');
    } catch {
      alert('아이디어 삭제에 실패했습니다.');
      setIdeaModalState('closed');
    }
  };

  if (!ideaData) return <ContentContainer>Loading...</ContentContainer>;

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

          <DescriptionSection>
            <SectionTitle>아이디어 설명</SectionTitle>
            <MarkdownPreviewBox data-color-mode="light">
              <MDPreview source={ideaData.description} remarkPlugins={[remarkBreaks]} />
            </MarkdownPreviewBox>
          </DescriptionSection>
        </ResponsiveWrapper>
      </PreviewCanvas>

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

              {!part.isRecruiting && <MyTeamStatusCard variant="not-recruiting" />}

              {part.isRecruiting && part.current === 0 && <MyTeamStatusCard variant="not-filled" />}

              {part.members.map(member => (
                <MyTeamMemberCard
                  key={member.id}
                  variant={member.isLeader ? 'leader' : 'managedMember'}
                  name={member.name}
                  width="100%"
                  onClickRemove={
                    member.isLeader
                      ? undefined
                      : () =>
                          setMemberModal({
                            open: true,
                            memberId: member.id,
                            memberName: member.name,
                          })
                  }
                />
              ))}
            </TeamPartColumn>
          ))}
        </TeamGrid>
      </TeamCompositionSection>

      <ActionRow>
        <ActionButton
          $primary
          onClick={() =>
            router.push({
              pathname: '/AdminIdeaEdit',
              query: { projectId, id },
            })
          }
        >
          아이디어 수정하기
        </ActionButton>

        <ActionButton $danger onClick={() => setIdeaModalState('confirm')}>
          아이디어 삭제하기
        </ActionButton>
      </ActionRow>

      {memberModal.open && (
        <ModalOverlay>
          <ModalCard>
            <ModalInfo>
              <ModalTitle>{memberModal.memberName}</ModalTitle>
              <ModalMessage>해당 멤버를 팀에서 제거할까요?</ModalMessage>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton onClick={confirmRemoveMember}>
                  <DeleteButtonText>삭제하기</DeleteButtonText>
                </MyDeleteButton>
                <MyCancelButton
                  onClick={() => setMemberModal({ open: false, memberId: null, memberName: '' })}
                >
                  <CancelButtonText>취소</CancelButtonText>
                </MyCancelButton>
              </ModalButtonContainer>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {ideaModalState === 'confirm' && (
        <ModalOverlay>
          <ModalCard>
            <ModalInfo>
              <ModalTitle>아이디어 삭제</ModalTitle>
              <ModalMessage>해당 아이디어를 삭제할까요?</ModalMessage>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton onClick={handleDeleteIdea}>
                  <DeleteButtonText>삭제하기</DeleteButtonText>
                </MyDeleteButton>
                <MyCancelButton onClick={() => setIdeaModalState('closed')}>
                  <CancelButtonText>취소</CancelButtonText>
                </MyCancelButton>
              </ModalButtonContainer>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {ideaModalState === 'success' && (
        <ModalOverlay>
          <ModalSuccessCard>
            <ModalSuccessCardTitle>아이디어가 삭제되었습니다.</ModalSuccessCardTitle>
            <MyDeleteButton
              onClick={() =>
                router.push({
                  pathname: '/AdminIdeaIdea',
                  query: { projectId },
                })
              }
            >
              <MySuccessButtonText>확인</MySuccessButtonText>
            </MyDeleteButton>
          </ModalSuccessCard>
        </ModalOverlay>
      )}
    </ContentContainer>
  );
}
