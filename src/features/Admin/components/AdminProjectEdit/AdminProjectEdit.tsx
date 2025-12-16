import React, { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import ReQuill from '../../../team-building/components/ReQuill';
import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';

const PROJECT_TITLE_MAX = 20;
const PROJECT_INTRO_MAX = 30;
const ROLE_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드 (웹)',
  '프론트엔드 (모바일)',
  '백엔드',
  'AI/ML',
] as const;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
];
interface TeamMember {
  id: number;
  name: string;
  school: string;
  role: string;
  tag: string;
  isLeader?: boolean;
}

const ProjectGalleryEdit: React.FC = () => {
  const generationOptions = ['25-26', '24-25', '23-24'];
  const [projectTitle, setProjectTitle] = useState('커피와 담소');
  const [projectDescription, setProjectDescription] = useState('담소를 나누기 위해 사용하셍용');
  const [serviceStatus, setServiceStatus] = useState<'operating' | 'not-operating'>('operating');
  const [projectDetail, setProjectDetail] = useState('');
  const [generation, setGeneration] = useState<string[]>([generationOptions[0]]);
  const [leader, setLeader] = useState<TeamMember>({
    id: 1,
    name: '주현지',
    school: '성공회대학교',
    role: '백엔드',
    tag: '25-26 Core',
    isLeader: true,
  });
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 2,
      name: '윤준석',
      school: '성공회대학교',
      role: '프론트엔드 (웹)',
      tag: '25-26 Organizer',
    },
    {
      id: 3,
      name: '이솔',
      school: '성공회대학교',
      role: '디자인',
      tag: '25-26 Core',
    },
    {
      id: 4,
      name: '이서영',
      school: '성공회대학교',
      role: 'AI/ML',
      tag: '25-26 Core',
    },
  ]);

  const selectedGeneration = generation[0] ?? generationOptions[0];
  const titleCountText = `${projectTitle.length}/${PROJECT_TITLE_MAX}`;
  const introCountText = `${projectDescription.length}/${PROJECT_INTRO_MAX}`;

  const handleGenerationChange = (value: string[]) => {
    if (value.length === 0) return;
    setGeneration([value[value.length - 1]]);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value.slice(0, PROJECT_TITLE_MAX));
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDescription(e.target.value.slice(0, PROJECT_INTRO_MAX));
  };

  const handleAddMember = () => {
    setMembers(prev => {
      const maxId = Math.max(leader.id, ...prev.map(member => member.id));
      return [
        ...prev,
        {
          id: maxId + 1,
          name: `새 팀원 ${prev.length + 1}`,
          school: '소속을 입력해주세요',
          role: ROLE_OPTIONS[0],
          tag: `${selectedGeneration} Core`,
        },
      ];
    });
  };

  const handleDeleteMember = (id: number) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleLeaderRoleChange = (value: string[]) => {
    const nextRole = value[0];
    if (!nextRole) return;
    setLeader(prev => ({ ...prev, role: nextRole }));
  };

  const handleMemberRoleChange = (id: number, value: string[]) => {
    const nextRole = value[0];
    if (!nextRole) return;
    setMembers(prev =>
      prev.map(member => (member.id === id ? { ...member, role: nextRole } : member))
    );
  };

  const handleProjectDetailChange = (value: string) => {
    setProjectDetail(value);
  };

  const handleApply = () => {
    const payload = {
      projectTitle,
      projectDescription,
      generation: selectedGeneration,
      serviceStatus,
      projectDetail,
      leader,
      members,
    };

    console.log('Apply changes', payload);
    alert('변경 사항이 적용되었습니다.');
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <LogoImage src="/gdgoc_skhu_admin.svg" alt="" />
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
          <MenuItem>프로젝트 관리</MenuItem>
          <MenuItem>아이디어 관리</MenuItem>
          <MenuItemActive>
            <span>프로젝트 갤러리 관리</span>
            <ArrowIcon src="/rightarrow_admin.svg" alt="" />
          </MenuItemActive>
          <MenuItem>액티비티 관리</MenuItem>
          <MenuItem>홈 화면으로 나가기</MenuItem>
        </MenuList>
      </Sidebar>

      <MainContent>
        <ContentWrapper>
          <HeaderBlock>
            <Header>
              <Title>프로젝트 갤러리 관리</Title>
              <Subtitle>프로젝트 갤러리에 전시되어있는 글을 관리하고 수정하는 화면입니다.</Subtitle>
            </Header>
          </HeaderBlock>

          <FormBlock>
            <FormWrapper>
              <ApplyButton onClick={handleApply}>적용하기</ApplyButton>

              <FieldList>
                <FieldTitle>
                  <TitleRow>
                    <FieldLabel>프로젝트 제목</FieldLabel>
                    <CharCount>{titleCountText}</CharCount>
                  </TitleRow>
                  <InputField
                    type="text"
                    value={projectTitle}
                    onChange={handleTitleChange}
                    placeholder="커피와 담소"
                  />
                </FieldTitle>

                <FieldTitle>
                  <TitleRow>
                    <FieldLabel>프로젝트 한 줄 소개</FieldLabel>
                    <CharCount>{introCountText}</CharCount>
                  </TitleRow>
                  <InputField
                    type="text"
                    value={projectDescription}
                    onChange={handleIntroChange}
                    placeholder="담소를 나누기 위해 사용하셍용"
                  />
                </FieldTitle>

                <FieldTitle>
                  <FieldLabel>기수</FieldLabel>
                  <SelectBoxWrapper>
                    <SelectBoxBasic
                      options={generationOptions}
                      value={generation}
                      onChange={handleGenerationChange}
                    />
                  </SelectBoxWrapper>
                </FieldTitle>

                <FieldLeader>
                  <FieldLabel>팀장</FieldLabel>
                  <MemberCard>
                    <MemberInfo>
                      <InfoTotal>
                        <InfoName>
                          <MemberName>{leader.name}</MemberName>
                          <CrownIcon src="/icon-crown.svg" alt="" />
                          <Tag>{leader.tag}</Tag>
                        </InfoName>
                        <School>{leader.school}</School>
                      </InfoTotal>
                      <SelectBoxWrapper>
                        <SelectBoxBasic
                          options={ROLE_OPTIONS}
                          value={[leader.role]}
                          onChange={handleLeaderRoleChange}
                          css={{ width: '240px', height: '50px' }}
                        />
                      </SelectBoxWrapper>
                    </MemberInfo>
                  </MemberCard>
                </FieldLeader>

                <FieldMember>
                  <FieldLabel>팀원</FieldLabel>
                  {members.map(member => (
                    <MemberCard key={member.id}>
                      <MemberInfo>
                        <InfoTotal>
                          <InfoName>
                            <MemberName>{member.name}</MemberName>
                            <Tag>{member.tag}</Tag>
                          </InfoName>
                          <School>{member.school}</School>
                        </InfoTotal>
                        <SelectBoxWrapper>
                          <SelectBoxBasic
                            options={ROLE_OPTIONS}
                            value={[member.role]}
                            onChange={value => handleMemberRoleChange(member.id, value)}
                            css={{ width: '240px', height: '50px' }}
                          />
                        </SelectBoxWrapper>
                      </MemberInfo>

                      <MemberActions>
                        <DeleteButton type="button" onClick={() => handleDeleteMember(member.id)}>
                          <Image src="/deleteicon.svg" width={12} height={12} alt="팀원 삭제" />
                        </DeleteButton>
                      </MemberActions>
                    </MemberCard>
                  ))}
                  <AddMemberButton onClick={handleAddMember}>+ 팀원 추가</AddMemberButton>
                </FieldMember>

                <FieldState>
                  <FieldLabel>서비스 운영 상태</FieldLabel>
                  <RadioGroup>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        checked={serviceStatus === 'operating'}
                        onChange={() => setServiceStatus('operating')}
                      />
                      <span>운영 중</span>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        checked={serviceStatus === 'not-operating'}
                        onChange={() => setServiceStatus('not-operating')}
                      />
                      <span>미운영 중</span>
                    </RadioOption>
                  </RadioGroup>
                </FieldState>
                <FieldState>
                  <FieldLabel>서비스 전시 여부</FieldLabel>
                  <RadioGroup>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        checked={serviceStatus === 'operating'}
                        onChange={() => setServiceStatus('operating')}
                      />
                      <span>활성화</span>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        checked={serviceStatus === 'not-operating'}
                        onChange={() => setServiceStatus('not-operating')}
                      />
                      <span>비활성화</span>
                    </RadioOption>
                  </RadioGroup>
                </FieldState>

                <FieldMarkdown>
                  <FieldLabel>프로젝트 설명</FieldLabel>
                  <QuillContainer>
                    <ReQuill
                      value={projectDetail}
                      onChange={handleProjectDetailChange}
                      placeholder={`프로젝트 설명을 입력해주세요`}
                      modules={quillModules}
                      formats={quillFormats}
                      height={400}
                    />
                  </QuillContainer>
                </FieldMarkdown>
              </FieldList>
            </FormWrapper>
          </FormBlock>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  width: 1440px;
  height: 2093px;
  background-color: #fff;
  display: flex;
  gap: 40px;
  line-height: normal;
  letter-spacing: normal;
`;

const Sidebar = styled.div`
  width: 255px;
  height: 2093px;
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

const LogoImage = styled.img`
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
  width: 16px;
  max-height: 100%;
  object-fit: contain;
`;

const MainContent = styled.main`
  flex: 1;
  margin: 0 65px 0 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;

  @media screen and (max-width: 1300px) {
    margin: 60px 60px 0 40px;
  }

  @media screen and (max-width: 1125px) {
    margin: 40px 40px 0 40px;
  }

  @media screen and (max-width: 800px) {
    margin: 30px 20px 0 20px;
  }
`;

const ContentWrapper = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 100px; /* ⬅ 사진처럼 하단 여백 생김 */
  max-width: 100%;
  text-align: left;
  font-size: 36px;
  color: #000;
  font-family: Pretendard;
`;

const HeaderBlock = styled.div`
  width: 100%;
  margin-top: 91px;
`;

const FormBlock = styled.div`
  width: 100%;
  margin-top: 60px;
`;

const Header = styled.div`
  width: 100%;
  max-width: 100%;
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

const FormWrapper = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 40px;
  font-size: 20px;
  color: #040405;

  @media screen and (max-width: 800px) {
    gap: 20px;
  }
`;

const ApplyButton = styled.button`
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

const MemberActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  color: #4285f4;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 6px;
  border-radius: 50%;
  background: var(--grayscale-500, #979ca5);
  cursor: pointer;

  &:hover {
    background: #7e8590;
  }
`;
const FieldList = styled.div`
  height: 1552px;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  z-index: 1;

  @media screen and (max-width: 800px) {
    gap: 20px;
  }
`;

const FieldTitle = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const TitleRow = styled.div`
  align-self: stretch;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  @media screen and (max-width: 450px) {
    flex-wrap: wrap;
  }
`;

const FieldLabel = styled.h3`
  margin: 0;
  font-size: 20px;
  line-height: 160%;
  font-weight: 700;
  font-family: Pretendard;

  @media screen and (max-width: 450px) {
    font-size: 16px;
    line-height: 26px;
  }
`;

const CharCount = styled.div`
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const InputField = styled.input`
  align-self: stretch;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #c3c6cb;
  padding: 12px 16px;
  font-weight: 500;
  font-family: Pretendard;
  font-size: 16px;
  color: #040405;
  line-height: 160%;
  outline: none;

  &::placeholder {
    color: #979ca5;
  }

  &:focus {
    border-color: #4285f4;
  }
`;

const SelectBoxWrapper = styled.div`
  width: 496px;
  max-width: 100%;
`;

const FieldLeader = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  font-size: 20px;
  color: #040405;
  font-family: Pretendard;
`;

const MemberCard = styled.div`
  width: 100%;
  max-width: 1080px;
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  gap: 20px;
  font-size: 18px;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  flex: 1;
`;

const InfoTotal = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InfoName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MemberName = styled.b`
  line-height: 160%;
  font-weight: 700;
`;

const CrownIcon = styled.img`
  width: 24px;
  max-height: 100%;
`;

const Tag = styled.div`
  border-radius: 4px;
  background-color: #d9e7fd;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  font-size: 12px;
  color: #4285f4;
  font-weight: 600;
  line-height: 160%;
`;

const School = styled.div`
  font-size: 16px;
  line-height: 160%;
  font-weight: 500;
  color: #979ca5;
`;

const FieldMember = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  font-size: 18px;
  color: #040405;
  font-family: Pretendard;
`;

const AddMemberButton = styled.button`
  cursor: pointer;
  border: 1px solid #4285f4;
  padding: 10px 8px;
  background-color: #fff;
  width: 100%;
  max-width: 1080px;
  height: 50px;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 160%;
  font-weight: 500;
  font-family: Pretendard;
  color: #4285f4;

  &:hover {
    background-color: #f0f7ff;
  }
`;

const FieldState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const RadioGroup = styled.div`
  width: 166px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  font-size: 16px;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RadioInput = styled.input`
  cursor: pointer;
  margin: 0;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  flex-shrink: 0;
  appearance: none;
  border: ${props => (props.checked ? '6px solid #4285f4' : '1px solid #040405')};
  box-sizing: border-box;

  &:hover {
    border-color: #4285f4;
  }
`;

const FieldMarkdown = styled.section`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  text-align: left;
  font-size: 20px;
  font-family: Pretendard;
  color: #040405;
  margin-bottom: 100px;
`;

const QuillContainer = styled.div`
  width: 1080px;
  flex-shrink: 0;

  .ql-editor {
    height: calc(400px - 48px) !important; /* 에디터 영역 정확히 352px */
    overflow-y: auto;
  }
`;

export default ProjectGalleryEdit;
