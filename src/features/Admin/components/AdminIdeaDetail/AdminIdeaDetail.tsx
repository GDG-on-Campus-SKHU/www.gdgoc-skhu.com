import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AdminIdeaDetail as AdminIdeaDetailType,
  AdminIdeaRoster,
  getAdminProjectIdeaDetail,
} from '@/lib/adminIdea.api';

import {
  Content,
  ContentContainer,
  CountNum,
  CountStat,
  CountUnit,
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

/* ======================================================
 * Constants
 * ====================================================== */

/**
 * 백엔드 part → 화면 표시용 라벨 매핑
 */
const TEAM_ROLE_LABEL_MAP: Record<AdminIdeaRoster['part'], string> = {
  PM: '기획',
  DESIGN: '디자인',
  AI: 'AI/ML',
  WEB: '프론트엔드 (웹)',
  MOBILE: '프론트엔드 (모바일)',
  BACKEND: '백엔드',
};

/**
 * 화면 배치용 파트 그룹
 */
const TEAM_GROUPS: Array<Array<AdminIdeaRoster['part']>> = [
  ['PM', 'DESIGN', 'AI'],
  ['WEB', 'MOBILE', 'BACKEND'],
];

/* ======================================================
 * Component
 * ====================================================== */

export default function AdminIdeaDetail() {
  const router = useRouter();
  const { id, projectId } = router.query;

  const [idea, setIdea] = useState<AdminIdeaDetailType | null>(null);
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  /* =========================
   * Fetch idea detail
   * ========================= */
  useEffect(() => {
    if (!id || !projectId) return;

    const fetchDetail = async () => {
      try {
        const res = await getAdminProjectIdeaDetail({
          projectId: Number(projectId),
          ideaId: Number(id),
        });
        setIdea(res.data);
      } catch (error) {
        console.error('아이디어 상세 조회 실패', error);
      }
    };

    fetchDetail();
  }, [id, projectId]);

  /* =========================
   * Derived values
   * ========================= */

  const safeDescription = useMemo(
    () => sanitizeDescription(idea?.description ?? ''),
    [idea?.description]
  );

  if (!idea) return null;

  /* =========================
   * Render
   * ========================= */

  return (
    <Content>
      <ContentContainer>
        <Heading>
          <Title>아이디어 관리</Title>
          <Description>선택한 아이디어 상세 정보입니다.</Description>
        </Heading>

        <PreviewCanvas>
          <ResponsiveWrapper>
            <TitleSection>
              <TitleText>{idea.title}</TitleText>

              <IntroRow>
                <IntroText>{idea.introduction}</IntroText>
                <MentorContainer>
                  <MentorPart>
                    {idea.creator.school} {idea.creator.part}{' '}
                    <Mentor as="span">{idea.creator.creatorName}</Mentor>
                  </MentorPart>
                </MentorContainer>
              </IntroRow>
            </TitleSection>

            <SubjectLabel>아이디어 주제</SubjectLabel>
            <SubjectValue>{idea.topic}</SubjectValue>

            <MembersSection>
              <Heading>
                <Title>모집 인원</Title>
              </Heading>

              <MemberCard>
                {TEAM_GROUPS.map(group => (
                  <MemberRow key={group.join('-')}>
                    {group.map(part => {
                      const roster = idea.rosters.find((r: AdminIdeaRoster) => r.part === part);
                      if (!roster) return null;

                      return (
                        <MemberCount key={part}>
                          <RoleName>{TEAM_ROLE_LABEL_MAP[part]}</RoleName>
                          <CountStat>
                            <CountNum>
                              {roster.currentMemberCount} / {roster.maxMemberCount}
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
              <Heading>
                <Title>아이디어 설명</Title>
              </Heading>

              <DescriptionBox dangerouslySetInnerHTML={{ __html: safeDescription }} />
            </DescriptionSection>
          </ResponsiveWrapper>
        </PreviewCanvas>

        <ModalActions>
          <MyConfirmButton onClick={() => setModalState('confirm')}>
            아이디어 삭제하기
          </MyConfirmButton>
        </ModalActions>

        {modalState === 'confirm' && (
          <ModalOverlay>
            <ModalCard>
              <ModalInfo>
                <ModalTitle>{idea.title}</ModalTitle>
                <ModalMessage>아이디어를 삭제할까요?</ModalMessage>
                <ModalMessage>이 작업은 되돌릴 수 없습니다.</ModalMessage>
              </ModalInfo>

              <ModalButtonContainer>
                <MyDeleteButton onClick={() => setModalState('success')}>
                  <MySuccessButtonText>삭제하기</MySuccessButtonText>
                </MyDeleteButton>
                <MyCancelButton onClick={() => setModalState('closed')}>취소</MyCancelButton>
              </ModalButtonContainer>
            </ModalCard>
          </ModalOverlay>
        )}

        {modalState === 'success' && (
          <ModalOverlay>
            <ModalSuccessCard>
              <ModalSuccessCardTitle>아이디어가 삭제되었습니다.</ModalSuccessCardTitle>
              <MyConfirmButton
                onClick={() =>
                  router.push({
                    pathname: '/AdminIdeaIdea',
                    query: { projectId },
                  })
                }
              >
                확인
              </MyConfirmButton>
            </ModalSuccessCard>
          </ModalOverlay>
        )}
      </ContentContainer>
    </Content>
  );
}
