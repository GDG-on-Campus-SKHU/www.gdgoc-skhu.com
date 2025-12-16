import React from 'react';
import styled, { css } from 'styled-components';

import { ButtonBase } from '../../styles/IdeaForm';
import Button from '../Button';
import { createEmptyTeamCounts, Idea } from '../store/IdeaStore';
import { sanitizeDescription } from '../utils/sanitizeDescription';

const SMALL_BREAKPOINT = '600px';
const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드 (Web)' },
  { key: 'frontendMobile', label: '프론트엔드 (Mobile)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
] as const;

const TEAM_GROUPS: Array<Array<(typeof TEAM_ROLES)[number]['key']>> = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];

const PageContainer = styled.div`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 80px;
  width: 100%;
`;

const PreviewCanvas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
  width: 100%;
  max-width: 1080px;
`;

const TitleSection = styled.section`
  display: flex;
  width: 1080px;
  padding: 100px 0 20px 0;
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
  margin: 12px 0 0;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-size: 16px;
  font-weight: 700;
  color: #040405;
`;

const CountStat = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 16px;
  font-weight: 700;
  color: #4285f4;
`;

const CountUnit = styled.span`
  font-size: 16px;
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

export const DeleteButton = styled(ButtonBase)<{ disabled?: boolean }>`
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--point-red, #ea4335);
  background: #fff;
`;

export const DeletebuttonText = styled.span`
  color: var(--point-red, #ea4335);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;
export const EditButton = styled(ButtonBase)<{ disabled?: boolean }>`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  ${({ disabled }) =>
    disabled &&
    css`
      border-color: #e0e2e5;
      color: #c3c6cb;
      cursor: not-allowed;
      background: #f3f4f6;
    `}
`;
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 120px;
  padding-bottom: 40px;
  max-width: 616px;
  width: 100%;
  margin: 0 auto;
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
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-align: center;
  text-overflow: ellipsis;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const ModalTitleComplete = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const ModalMessage = styled.p`
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  margin: 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ModalButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const ModalOKCard = styled.div`
  display: flex;
  width: 500px;
  padding: 40px 20px 20px 20px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.2);
`;

const ModalButton = styled(Button)`
  display: flex;
  width: 222px;
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

const ModalOKButton = styled(Button)`
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;

interface IdeaCompleteProps {
  idea: Idea;
  onGoList: () => void;
}

export default function IdeaComplete({ idea, onGoList }: IdeaCompleteProps) {
  const [resolvedTitle, setResolvedTitle] = React.useState<string>(idea.title || '');
  const [resolvedIntro, setResolvedIntro] = React.useState<string>(idea.intro || '');
  const [rawDescription, setRawDescription] = React.useState<string>(idea.description || '');

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
      ...(idea.team ?? {}),
    }),
    [idea.team]
  );

  const filledTeam = React.useMemo(
    () => ({
      ...createEmptyTeamCounts(),
      ...(idea.filledTeam ?? {}),
    }),
    [idea.filledTeam]
  );

  React.useEffect(() => {
    if (idea.title) setResolvedTitle(idea.title);
    if (idea.intro) setResolvedIntro(idea.intro);
    if (idea.description) setRawDescription(idea.description);

    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('ideaFormData');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const draft = parsed?.form ?? parsed;
      if (!idea.title && draft?.title) setResolvedTitle(draft.title);
      if (!idea.intro && draft?.intro) setResolvedIntro(draft.intro);
      if (!idea.description && draft?.description) setRawDescription(draft.description);
    } catch (error) {
      console.error('Failed to load idea data from session', error);
    }
  }, [idea.description, idea.intro, idea.title]);

  const safeDescription = React.useMemo(
    () => sanitizeDescription(rawDescription || ''),
    [rawDescription]
  );

  const [modalState, setModalState] = React.useState<
    'closed' | 'editConfirm' | 'deleteConfirm' | 'deleteSuccess'
  >('closed');

  const handleOpenEditModal = () => setModalState('editConfirm');
  const handleOpenDeleteModal = () => setModalState('deleteConfirm');
  const handleCloseModal = () => setModalState('closed');
  const handleConfirmEdit = () => {
    setModalState('closed');
  };
  const handleConfirmDelete = () => {
    setModalState('deleteSuccess');
  };
  const handleDeleteSuccessClose = () => {
    setModalState('closed');
    onGoList();
  };

  return (
    <PageContainer>
      <PreviewCanvas>
        <ResponsiveWrapper>
          <TitleSection>
            <TitleText>{resolvedTitle || '아이디어 제목'}</TitleText>
            <IntroText>{resolvedIntro || '아이디어 한줄소개'}</IntroText>
          </TitleSection>

          <SubjectRow>
            <SubjectLabel>아이디어 주제</SubjectLabel>
            <SubjectValue>
              {idea.topic || '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'}
            </SubjectValue>
          </SubjectRow>

          <MembersSection>
            <SectionTitle>모집 인원</SectionTitle>
            <MemberCard>
              {TEAM_GROUPS.map(group => (
                <MemberRow key={group.join('-')}>
                  {group.map(roleKey => {
                    const role = roleMap[roleKey];
                    const total = team[role.key as keyof typeof team] ?? 0;
                    const current = filledTeam[role.key as keyof typeof filledTeam] ?? 0;
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

          <ButtonGroup>
            <EditButton type="button" onClick={handleOpenEditModal}>
              수정하기
            </EditButton>
            <DeleteButton type="button" onClick={handleOpenDeleteModal}>
              <DeletebuttonText>삭제하기</DeletebuttonText>
            </DeleteButton>
          </ButtonGroup>
        </ResponsiveWrapper>
      </PreviewCanvas>
      {modalState !== 'closed' && (
        <ModalOverlay>
          {modalState === 'deleteSuccess' ? (
            <ModalCard style={{ height: '188px', paddingTop: 0 }}>
              <ModalOKCard>
                <ModalTitleComplete>아이디어가 삭제되었습니다.</ModalTitleComplete>
                <ModalActions>
                  <ModalOKButton
                    title="확인"
                    onClick={handleDeleteSuccessClose}
                    css={{ width: '100%' }}
                  />
                </ModalActions>
              </ModalOKCard>
            </ModalCard>
          ) : (
            <ModalCard>
              <ModalInfo>
                <ModalTitle>{resolvedTitle || '아이디어 제목'}</ModalTitle>
                <ModalMessage>
                  {modalState === 'editConfirm'
                    ? '아이디어를 수정하시겠습니까?'
                    : '아이디어를 삭제하시겠습니까?'}
                </ModalMessage>
                <ModalActions>
                  <ModalButtonContainer>
                    <ModalButton
                      title={modalState === 'editConfirm' ? '수정하기' : '삭제하기'}
                      onClick={
                        modalState === 'editConfirm' ? handleConfirmEdit : handleConfirmDelete
                      }
                      css={{ width: '100%' }}
                    />
                    <ModalButton
                      title="취소"
                      variant="secondary"
                      onClick={handleCloseModal}
                      css={{ width: '100%' }}
                    />
                  </ModalButtonContainer>
                </ModalActions>
              </ModalInfo>
            </ModalCard>
          )}
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
