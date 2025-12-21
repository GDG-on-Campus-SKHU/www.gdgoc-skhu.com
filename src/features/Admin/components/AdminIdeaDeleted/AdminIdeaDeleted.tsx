import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
  AdminIdeaDetail as AdminIdeaDetailType,
  deleteAdminIdea,
  getAdminProjectIdeaDetail,
  restoreAdminIdea,
} from '@/lib/adminIdea.api';
import { colors } from '@/styles/constants';
import styled from 'styled-components';

import {
  CancelButtonText,
  ContentContainer,
  CountNum,
  CountStat,
  CountUnit,
  DeleteButtonText,
  DeletedMark,
  DeletedMarkContainer,
  DeletedText,
  Description,
  DescriptionSection,
  Heading,
  IntroRow,
  IntroText,
  MarkBar,
  MarkDot,
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
} from '../../styles/AdminIdeaDeleted'; // 스타일 파일 경로는 프로젝트에 맞게 확인 필요

// --- Constants & Types ---

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

// --- Styled Components ---

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
  margin-top: 120px;
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

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview').then(mod => mod.default), {
  ssr: false,
});

export default function AdminIdeaDeleted() {
  const router = useRouter();
  const { id, projectId } = router.query;

  // 데이터 상태
  const [ideaData, setIdeaData] = useState<AdminIdeaDetailType | null>(null);

  // 모달 상태 ('restore' | 'delete' | 'success_restore' | 'success_delete')
  const [modalType, setModalType] = useState<
    'closed' | 'restore_confirm' | 'delete_confirm' | 'restore_success' | 'delete_success'
  >('closed');

  // 1. API 데이터 조회
  useEffect(() => {
    if (!id || !projectId) return;

    getAdminProjectIdeaDetail({
      projectId: Number(projectId),
      ideaId: Number(id),
    })
      .then(res => setIdeaData(res.data))
      .catch(err => {
        console.error('Failed to fetch deleted idea detail:', err);
        // 에러 처리 (예: 이미 완전히 삭제된 경우 등)
      });
  }, [id, projectId]);

  // 2. 데이터 가공 (모집 인원 통계)
  const statsMap = useMemo(() => {
    if (!ideaData) return {};

    const map: Record<string, { current: number; total: number }> = {};

    // 기본 0으로 초기화
    TEAM_ROLES.forEach(r => {
      map[r.key] = { current: 0, total: 0 };
    });

    // API Roster 데이터 매핑
    ideaData.rosters.forEach(roster => {
      const roleDef = TEAM_ROLES.find(r => r.apiKey === roster.part);
      if (roleDef) {
        map[roleDef.key] = {
          current: roster.currentMemberCount,
          total: roster.maxMemberCount,
        };
      }
    });
    return map;
  }, [ideaData]);

  // --- Handlers ---

  // 복구 API 호출
  const handleRestoreConfirm = async () => {
    if (!id) return;
    try {
      await restoreAdminIdea(Number(id));
      setModalType('restore_success');
    } catch (error) {
      console.error('Failed to restore idea:', error);
      alert('아이디어 복구에 실패했습니다.');
      setModalType('closed');
    }
  };

  // 완전 삭제 API 호출
  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await deleteAdminIdea(Number(id));
      setModalType('delete_success');
    } catch (error) {
      console.error('Failed to delete idea permanently:', error);
      alert('아이디어 삭제에 실패했습니다.');
      setModalType('closed');
    }
  };

  const handleCloseModal = () => setModalType('closed');

  const handleSuccessClose = () => {
    setModalType('closed');
    // 목록으로 이동 (쿼리 유지)
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
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'flex-start',
              }}
            >
              <TitleText>{ideaData.title}</TitleText>

              <DeletedMarkContainer>
                <DeletedMark>
                  <MarkBar />
                  <MarkDot />
                </DeletedMark>
                <DeletedText> 작성자가 삭제한 아이디어입니다.</DeletedText>
              </DeletedMarkContainer>
            </div>

            <IntroRow>
              <div style={{ flex: 1 }}>
                <IntroText>{ideaData.introduction}</IntroText>
              </div>

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
                            {' '}
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
            <MarkdownPreviewBox data-color-mode="light">
              <MDPreview source={ideaData.description} />
            </MarkdownPreviewBox>
          </DescriptionSection>
        </ResponsiveWrapper>
      </PreviewCanvas>

      <ActionRow>
        <ActionButton $primary type="button" onClick={() => setModalType('restore_confirm')}>
          아이디어 복구하기
        </ActionButton>
        <ActionButton $danger type="button" onClick={() => setModalType('delete_confirm')}>
          아이디어 삭제하기
        </ActionButton>
      </ActionRow>

      {/* ===== MODAL ===== */}
      {modalType !== 'closed' && (
        <ModalOverlay>
          {/* 복구 확인 모달 */}
          {modalType === 'restore_confirm' && (
            <ModalCard>
              <ModalInfo>
                <ModalTitle>{ideaData.title}</ModalTitle>
                <ModalMessage>아이디어를 복구할까요?</ModalMessage>
                <ModalMessage>
                  이 작업은 아이디어를 &apos;모집 중&apos; 상태로 되돌립니다.
                </ModalMessage>
              </ModalInfo>
              <ModalActions>
                <ModalButtonContainer>
                  {/* 복구 버튼 스타일 (Primary 색상 재사용하거나 커스텀) */}
                  <MyConfirmButton type="button" onClick={handleRestoreConfirm}>
                    <MySuccessButtonText>복구하기</MySuccessButtonText>
                  </MyConfirmButton>
                  <MyCancelButton type="button" onClick={handleCloseModal}>
                    <CancelButtonText>취소</CancelButtonText>
                  </MyCancelButton>
                </ModalButtonContainer>
              </ModalActions>
            </ModalCard>
          )}

          {/* 완전 삭제 확인 모달 */}
          {modalType === 'delete_confirm' && (
            <ModalCard>
              <ModalInfo>
                <ModalTitle>{ideaData.title}</ModalTitle>
                <ModalMessage>아이디어를 완전히 삭제할까요?</ModalMessage>
                <ModalMessage style={{ color: '#f44242' }}>
                  이 작업은 되돌릴 수 없으며 DB에서 영구 삭제됩니다.
                </ModalMessage>
              </ModalInfo>
              <ModalActions>
                <ModalButtonContainer>
                  <MyDeleteButton type="button" onClick={handleDeleteConfirm}>
                    <DeleteButtonText>영구 삭제</DeleteButtonText>
                  </MyDeleteButton>
                  <MyCancelButton type="button" onClick={handleCloseModal}>
                    <CancelButtonText>취소</CancelButtonText>
                  </MyCancelButton>
                </ModalButtonContainer>
              </ModalActions>
            </ModalCard>
          )}

          {/* 복구 성공 모달 */}
          {modalType === 'restore_success' && (
            <ModalSuccessCard $compact>
              <ModalSuccessCardTitle>아이디어가 성공적으로 복구되었습니다.</ModalSuccessCardTitle>
              <ModalActions>
                <ModalButtonContainer>
                  <MyConfirmButton type="button" onClick={handleSuccessClose}>
                    <MySuccessButtonText>확인</MySuccessButtonText>
                  </MyConfirmButton>
                </ModalButtonContainer>
              </ModalActions>
            </ModalSuccessCard>
          )}

          {/* 삭제 성공 모달 */}
          {modalType === 'delete_success' && (
            <ModalSuccessCard $compact>
              <ModalSuccessCardTitle>아이디어가 영구적으로 삭제되었습니다.</ModalSuccessCardTitle>
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
