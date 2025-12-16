import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import styled from 'styled-components';

import downArrow from '../../../../../public/dropdownarrow.svg';
import editIcon from '../../../../../public/edit.svg';
import rightArrow from '../../../../../public/rightarrow_admin.svg';
import closeButton from '../../../../../public/X.svg';

interface Project {
  id: number;
  name: string;
}
type ProjectModalMode = 'create' | 'edit' | 'editSuccess' | 'deleteConfirm' | null;

const AdminProjectManage: NextPage = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [modalMode, setModalMode] = useState<ProjectModalMode>(null);

  return (
    <>
      <Container>
        <Sidebar>
          <Logo>
            <GdgocSkhuImage src="gdgoc_logo.svg" alt="" width={60} height={38} />
            <LogoText>GDGoC SKHU</LogoText>
          </Logo>

          <LoginInfo>
            <UserName>윤준석</UserName>
            <Divider>님</Divider>
          </LoginInfo>

          <MenuList>
            <MenuItem>대시보드</MenuItem>
            <MenuItem>가입 심사</MenuItem>
            <MenuItem>멤버 관리</MenuItem>
            <MenuItemActive>
              <span>프로젝트 관리</span>
              <ArrowIcon src={rightArrow.src} width={16} height={16} alt="" />
            </MenuItemActive>
            <MenuItem>아이디어 관리</MenuItem>
            <MenuItem>프로젝트 갤러리 관리</MenuItem>
            <MenuItem>액티비티 관리</MenuItem>
            <MenuItem>홈 화면으로 나가기</MenuItem>
          </MenuList>
        </Sidebar>

        <MainContent>
          <ContentWrapper>
            <HeaderBlock>
              <HeaderRow>
                <Header>
                  <Title>프로젝트 관리</Title>
                  <Subtitle>역대 프로젝트의 일정, 참여자, 팀 조정을 관리할 수 있습니다.</Subtitle>
                </Header>

                <SecondaryButton>종료 프로젝트 보기</SecondaryButton>
              </HeaderRow>
            </HeaderBlock>

            {!project ? (
              <EmptyState>
                <EmptyCard>
                  <EmptyIntro>프로젝트를 생성하고 일정과 팀빌딩을 관리할 수 있습니다.</EmptyIntro>

                  <ButtonDefault
                    onClick={() => {
                      setProjectName('');
                      setModalMode('create');
                    }}
                  >
                    프로젝트 생성
                  </ButtonDefault>
                </EmptyCard>
              </EmptyState>
            ) : (
              <>
                <ProjectContent>
                  <ProjectHeader>
                    <ProjectName>{project.name}</ProjectName>
                    <IconWrapper
                      onClick={() => {
                        if (!project) return;
                        setProjectName(project.name);
                        setModalMode('edit');
                      }}
                    >
                      <EditIcon src={editIcon.src} alt="수정 아이콘" />
                    </IconWrapper>
                  </ProjectHeader>
                  <ProjectBody>
                    <SectionRow>
                      <SectionTitle>프로젝트 일정 관리</SectionTitle>
                      <IconWrapper>
                        <ArrowIcon src={downArrow.src} />
                      </IconWrapper>
                    </SectionRow>

                    <SectionRow>
                      <SectionTitle>주제 관리</SectionTitle>
                      <IconWrapper>
                        <ArrowIcon src={downArrow.src} />
                      </IconWrapper>
                    </SectionRow>

                    <SectionRow>
                      <SectionTitle>참여자 관리</SectionTitle>
                      <IconWrapper>
                        <ArrowIcon src={downArrow.src} />
                      </IconWrapper>
                    </SectionRow>

                    <SectionRow>
                      <SectionTitle>팀 관리</SectionTitle>
                      <IconWrapper>
                        <ArrowIcon src={downArrow.src} />
                      </IconWrapper>
                    </SectionRow>
                  </ProjectBody>
                </ProjectContent>

                <BottomActions>
                  <DeleteButton
                    onClick={() => {
                      setModalMode('deleteConfirm');
                    }}
                  >
                    프로젝트 삭제하기
                  </DeleteButton>

                  <SaveButton
                    disabled={false}
                    onClick={() => {
                      // TODO: 프로젝트 저장 API
                    }}
                  >
                    저장하기
                  </SaveButton>
                </BottomActions>
              </>
            )}
          </ContentWrapper>
        </MainContent>
      </Container>

      {modalMode && (
        <Dimmed onClick={() => setModalMode(null)}>
          <Modal $mode={modalMode} onClick={e => e.stopPropagation()}>
            {modalMode === 'deleteConfirm' ? (
              <>
                <DeleteModalContent>
                  <DeleteModalTitle>프로젝트를 삭제하시겠습니까?</DeleteModalTitle>
                  <DeleteDescription>삭제된 데이터는 복구할 수 없습니다.</DeleteDescription>
                </DeleteModalContent>

                <DeleteActions>
                  <DeleteConfirmButton
                    onClick={() => {
                      setProject(null);
                      setModalMode(null);
                    }}
                  >
                    예
                  </DeleteConfirmButton>

                  <DeleteCancelButton onClick={() => setModalMode(null)}>아니오</DeleteCancelButton>
                </DeleteActions>
              </>
            ) : modalMode === 'editSuccess' ? (
              <>
                <SuccessModalTitle>수정이 완료되었습니다.</SuccessModalTitle>
                <SuccessConfirmButton onClick={() => setModalMode(null)}>확인</SuccessConfirmButton>
              </>
            ) : (
              <>
                <ModalHeader $mode={modalMode}>
                  <ModalTitle $mode={modalMode}>
                    {
                      {
                        create: '프로젝트 등록',
                        edit: '프로젝트 수정',
                      }[modalMode as 'create' | 'edit']
                    }
                  </ModalTitle>

                  {(modalMode === 'create' || modalMode === 'edit') && (
                    <CloseButton
                      src={closeButton.src}
                      alt="닫기"
                      onClick={() => setModalMode(null)}
                    />
                  )}
                </ModalHeader>

                {(modalMode === 'create' || modalMode === 'edit') && (
                  <FormSection>
                    <Field>
                      <Input
                        value={projectName}
                        maxLength={30}
                        placeholder="프로젝트명을 입력해주세요."
                        onChange={e => setProjectName(e.target.value)}
                      />
                    </Field>

                    <Actions>
                      <PrimaryButton
                        disabled={projectName.trim().length === 0}
                        onClick={() => {
                          if (modalMode === 'create') {
                            setProject({
                              id: Date.now(),
                              name: projectName.trim(),
                            });
                            setModalMode(null);
                            return;
                          }

                          if (modalMode === 'edit' && project) {
                            setProject({
                              ...project,
                              name: projectName.trim(),
                            });
                            setModalMode('editSuccess');
                          }
                        }}
                      >
                        확인
                      </PrimaryButton>
                    </Actions>
                  </FormSection>
                )}
              </>
            )}
          </Modal>
        </Dimmed>
      )}
    </>
  );
};

export default AdminProjectManage;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  line-height: normal;
  letter-spacing: normal;
`;

const Sidebar = styled.div`
  width: 255px;
  min-height: 100vh;
  background-color: #454b54;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Logo = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 28px 20px;
  gap: 12px;
  text-align: center;
  color: #fff;
  font-family: Pretendard;
`;

const GdgocSkhuImage = styled(Image)`
  width: 60px;
  max-height: 100%;
  object-fit: cover;
`;

const LogoText = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 400;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const LoginInfo = styled.div`
  align-self: stretch;
  border-top: 1px solid #626873;
  display: flex;
  align-items: center;
  padding: 18px 28px 20px;
  gap: 8px;
  color: #fff;
  font-family: Pretendard;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 700;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const Divider = styled.div`
  font-size: 16px;
  line-height: 160%;
  font-weight: 500;
`;

const MenuList = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
  font-size: 16px;
  color: #fff;
  font-family: Pretendard;
`;

const MenuItem = styled.div`
  align-self: stretch;
  background-color: #454b54;
  border-bottom: 1px solid #626873;
  display: flex;
  align-items: center;
  padding: 12px 28px;
  line-height: 160%;
  font-weight: 500;
  cursor: pointer;

  &:first-child {
    border-top: 1px solid #626873;
  }

  &:hover {
    background-color: #353a40;
  }
`;

const MenuItemActive = styled.div`
  align-self: stretch;
  background: linear-gradient(#353a40, #353a40), #25282c;
  border-bottom: 1px solid #626873;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 28px;
  gap: 20px;
  font-weight: 700;
  line-height: 160%;
  cursor: pointer;
`;

const ArrowIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 40px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
`;

const ContentWrapper = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  text-align: left;
  font-size: 36px;
  color: #000;
  font-family: Pretendard;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const HeaderBlock = styled.div`
  width: 100%;
  margin-top: 91px;
`;

const Header = styled.div`
  width: 100%;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  align-self: stretch;
  font-size: 36px;
  line-height: 160%;
  font-weight: 700;

  @media screen and (max-width: 800px) {
    font-size: 29px;
    line-height: 46px;
  }

  @media screen and (max-width: 450px) {
    font-size: 22px;
    line-height: 35px;
  }
`;

const Subtitle = styled.h3`
  margin: 0;
  align-self: stretch;
  font-size: 20px;
  line-height: 160%;
  font-weight: 500;
  color: #626873;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const EmptyIntro = styled.div`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const ButtonDefault = styled.button`
  cursor: pointer;
  border: 0;
  padding: 10px 8px;
  background-color: #4285f4;
  width: 200px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 18px;
  line-height: 160%;
  font-weight: 500;
  font-family: Pretendard;
  color: #f9f9fa;
  z-index: 2;

  &:hover {
    background-color: #3367d6;
  }
`;

const EmptyState = styled.section`
  width: 100%;
  margin-top: 257px;
  display: flex;
  justify-content: center;
`;

const EmptyCard = styled.div`
  display: flex;
  width: 538px;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Field = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  display: flex;
  width: 560px;
  padding: 12px 16px;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  padding: 10px 8px;
  justify-content: flex-end;
  align-items: center;
`;

const PrimaryButton = styled.button<{ disabled: boolean }>`
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;

  background: ${({ disabled }) => (disabled ? 'var(--grayscale-300, #e0e2e5)' : '#4285f4')};
  color: ${({ disabled }) => (disabled ? '#c3c6cb' : '#ffffff')};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? 'var(--grayscale-300, #e0e2e5)' : '#3367d6')};
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;

  &:hover {
    background: #f0f7ff;
  }
`;

const Dimmed = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div<{ $mode: ProjectModalMode }>`
  display: flex;
  flex-direction: column;
  background: #fff;

  ${({ $mode }) =>
    $mode === 'deleteConfirm' || $mode === 'editSuccess'
      ? `
    width: 500px;
    padding: 40px 20px 20px 20px;
    align-items: center;
    gap: 40px;
    border-radius: 12px;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.20);
  `
      : `
    width: 600px;
    padding: 20px;
    align-items: flex-end;
    gap: 20px;
    border-radius: 8px;
  `}
`;

const ModalHeader = styled.div<{ $mode: ProjectModalMode }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ModalTitle = styled.h3<{ $mode: ProjectModalMode }>`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  text-align: left;
`;

const CloseButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const ProjectName = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SectionTitle = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ProjectContent = styled.div`
  display: flex;
  width: 1105px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-top: 66px;
`;

const ProjectHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionRow = styled.div`
  display: flex;
  padding: 24px 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
`;

const ProjectBody = styled.div`
  width: 100%;
`;

const EditIcon = styled.img`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const BottomActions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 305px;
`;

const DeleteButton = styled.button`
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--point-red, #ea4335);
  background: #fff;
  color: var(--point-red, #ea4335);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #fff1f1;
  }
`;

const SaveButton = styled(PrimaryButton)`
  width: 300px;
`;

/* Delete Modal Styles */
const DeleteModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;

const DeleteModalTitle = styled.h3`
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-align: center;
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const DeleteDescription = styled.p`
  margin: 0;
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-align: center;
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const DeleteActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const DeleteConfirmButton = styled.button`
  display: flex;
  flex: 1;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: none;
  background: #4285f4;
  color: #ffffff;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;

const DeleteCancelButton = styled.button`
  display: flex;
  flex: 1;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  color: var(--primary-600-main, #4285f4);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f0f7ff;
  }
`;

/* Edit Success Modal Styles */
const SuccessModalTitle = styled.h3`
  margin: 0;
  color: var(--grayscale-1000, #040405);
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const SuccessConfirmButton = styled.button`
  display: flex;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: none;
  background: var(--primary-600-main, #4285f4);
  color: #ffffff;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #3367d6;
  }
`;
