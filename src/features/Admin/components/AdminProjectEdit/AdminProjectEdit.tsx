/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SelectBoxBasic from '@/features/team-building/components/SelectBoxBasic';
import {
  ProjectMember,
  SearchMember,
  UpdateProjectGalleryRequestDto,
  useProjectGalleryDetail,
  useSearchMembers,
  useUpdateProjectGallery,
} from '@/lib/adminProjectGallery.api';
import styled from 'styled-components';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});

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

const PART_MAP_TO_KR: Record<string, string> = {
  PM: '기획',
  DESIGN: '디자인',
  WEB: '프론트엔드 (웹)',
  ANDROID: '프론트엔드 (모바일)',
  IOS: '프론트엔드 (모바일)',
  SERVER: '백엔드',
  AI: 'AI/ML',
};

const PART_MAP_TO_EN: Record<string, string> = {
  기획: 'PM',
  디자인: 'DESIGN',
  '프론트엔드 (웹)': 'WEB',
  '프론트엔드 (모바일)': 'ANDROID',
  백엔드: 'SERVER',
  'AI/ML': 'AI',
};

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface TeamMember {
  id: number;
  name: string;
  school: string;
  role: string;
  tag: string;
  isLeader?: boolean;
}

const ProjectGalleryEdit: React.FC = () => {
  const router = useRouter();

  const projectId = router.isReady && router.query.id ? Number(router.query.id) : 0;

  const { data: detailData, isLoading } = useProjectGalleryDetail(projectId, {
    enabled: !!projectId,
  });

  const { mutate: updateProject } = useUpdateProjectGallery();

  const generationOptions = ['25-26', '24-25', '23-24'];

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [serviceStatus, setServiceStatus] = useState<'operating' | 'not-operating'>('operating');

  const [isExhibited, setIsExhibited] = useState(true);

  const [projectDetail, setProjectDetail] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const [generation, setGeneration] = useState<string[]>([generationOptions[0]]);
  const [leader, setLeader] = useState<TeamMember>({
    id: 0,
    name: '',
    school: '',
    role: ROLE_OPTIONS[0],
    tag: '',
    isLeader: true,
  });
  const [members, setMembers] = useState<TeamMember[]>([]);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const { data: searchResults, isLoading: isSearching } = useSearchMembers(debouncedKeyword, {
    enabled: isSearchModalOpen,
  });

  const formatTag = (member: ProjectMember) => {
    const mainGen = member.generations.find(g => g.isMain) || member.generations[0];
    return mainGen ? `${mainGen.generation} ${mainGen.position}` : '';
  };

  useEffect(() => {
    if (detailData) {
      setProjectTitle(detailData.projectName);
      setProjectDescription(detailData.shortDescription);
      setProjectDetail(detailData.description);
      setGeneration([detailData.generation]);

      setServiceStatus(detailData.serviceStatus === 'IN_SERVICE' ? 'operating' : 'not-operating');
      setIsExhibited(detailData.exhibited);

      // @ts-ignore
      if (detailData.thumbnailUrl) setThumbnailUrl(detailData.thumbnailUrl);

      if (detailData.leader) {
        setLeader({
          id: detailData.leader.userId,
          name: detailData.leader.name,
          school: detailData.leader.school,
          role: PART_MAP_TO_KR[detailData.leader.part] || detailData.leader.part,
          tag: formatTag(detailData.leader),
          isLeader: true,
        });
      }

      if (detailData.members) {
        setMembers(
          detailData.members.map(m => ({
            id: m.userId,
            name: m.name,
            school: m.school,
            role: PART_MAP_TO_KR[m.part] || m.part,
            tag: formatTag(m),
          }))
        );
      }
    }
  }, [detailData]);

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

  const handleOpenSearchModal = () => {
    setSearchKeyword('');
    setIsSearchModalOpen(true);
  };

  const handleSelectMember = (member: SearchMember) => {
    const isAlreadyMember = members.some(m => m.id === member.userId);
    const isLeader = leader.id === member.userId;

    if (isAlreadyMember || isLeader) {
      alert('이미 프로젝트에 등록된 멤버입니다.');
      return;
    }

    setMembers(prev => [
      ...prev,
      {
        id: member.userId,
        name: member.name,
        school: member.school,
        role: ROLE_OPTIONS[0],
        tag: member.generationAndPosition,
      },
    ]);
    setIsSearchModalOpen(false);
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

  const handleApply = () => {
    if (!projectId) {
      alert('프로젝트 ID를 찾을 수 없습니다.');
      return;
    }

    if (!leader.id) {
      alert('팀장 정보가 올바르지 않습니다.');
      return;
    }

    const payload: UpdateProjectGalleryRequestDto = {
      projectName: projectTitle,
      generation: selectedGeneration,
      shortDescription: projectDescription,
      serviceStatus: serviceStatus === 'operating' ? 'IN_SERVICE' : 'NOT_IN_SERVICE',
      exhibited: isExhibited,
      description: projectDetail,
      leaderId: leader.id,
      leaderPart: PART_MAP_TO_EN[leader.role] || leader.role,
      members: members.map(m => ({
        userId: m.id,
        part: PART_MAP_TO_EN[m.role] || m.role,
      })),
      thumbnailUrl: thumbnailUrl || '',
    };

    console.log('전송 데이터 확인:', payload);

    updateProject(
      { projectId, payload },
      {
        onSuccess: () => {
          alert('변경 사항이 성공적으로 적용되었습니다.');
          router.push('/AdminProjectGallery');
        },
        onError: (error: any) => {
          console.error(error);
          const errorMsg =
            error?.response?.data?.message || '수정에 실패했습니다. 입력값을 확인해주세요.';
          alert(`[Error] ${errorMsg}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container>
        <MainContent>
          <LoadingText>데이터를 불러오는 중입니다...</LoadingText>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
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
                    placeholder="프로젝트 제목을 입력하세요"
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
                    placeholder="한 줄 소개를 입력하세요"
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
                  <AddMemberButton onClick={handleOpenSearchModal}>+ 팀원 추가</AddMemberButton>
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
                        checked={isExhibited === true}
                        onChange={() => setIsExhibited(true)}
                      />
                      <span>활성화</span>
                    </RadioOption>
                    <RadioOption>
                      <RadioInput
                        type="radio"
                        checked={isExhibited === false}
                        onChange={() => setIsExhibited(false)}
                      />
                      <span>비활성화</span>
                    </RadioOption>
                  </RadioGroup>
                </FieldState>

                <FieldMarkdown>
                  <FieldLabel>프로젝트 설명</FieldLabel>
                  <MarkdownContainer data-color-mode="light">
                    <MDEditor
                      value={projectDetail}
                      onChange={val => setProjectDetail(val || '')}
                      height={400}
                      preview="live"
                      hideToolbar={false}
                      visibleDragbar={true}
                      textareaProps={{
                        placeholder: '프로젝트 설명을 마크다운으로 입력해주세요.',
                      }}
                    />
                  </MarkdownContainer>
                </FieldMarkdown>
              </FieldList>
            </FormWrapper>
          </FormBlock>
        </ContentWrapper>
      </MainContent>

      {isSearchModalOpen && (
        <ModalOverlay onClick={() => setIsSearchModalOpen(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHeader>팀원 추가</ModalHeader>
            <ModalSearchInput
              placeholder="이름으로 검색..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              autoFocus
            />
            <SearchResultList>
              {isSearching && <EmptyResult>불러오는 중...</EmptyResult>}

              {!isSearching && searchResults?.length === 0 && searchKeyword && (
                <EmptyResult>검색 결과가 없습니다.</EmptyResult>
              )}

              {!isSearching &&
                searchResults?.map(member => (
                  <SearchResultItem key={member.userId} onClick={() => handleSelectMember(member)}>
                    <ResultInfo>
                      <ResultName>{member.name}</ResultName>
                      <ResultDetail>
                        {member.school} | {member.generationAndPosition}
                      </ResultDetail>
                    </ResultInfo>
                    {/* AddText 컴포넌트는 사용되지 않으므로 제거 */}
                  </SearchResultItem>
                ))}
            </SearchResultList>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProjectGalleryEdit;

/* ================= Styled Components ================= */

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
  padding-bottom: 100px;
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
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
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
  margin-bottom: 10px;
`;

const MarkdownContainer = styled.div`
  width: 1080px;
  border-radius: 8px;
  background: #fff;

  .w-md-editor {
    border-radius: 8px;
    border: 1px solid var(--grayscale-400, #c3c6cb);
    box-shadow: none;
    background-color: #fff;
  }

  .w-md-editor-toolbar {
    border-bottom: 1px solid #d0d7de;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
  }

  .w-md-editor-text-pre {
    font-family: 'Courier New', monospace;
  }

  .wmde-markdown {
    font-family: 'Pretendard', sans-serif;
  }
`;

const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  font-size: 18px;
  color: #666;
`;

/* ================= Modal Styles ================= */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  width: 500px;
  height: 600px;
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const ModalSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #4285f4;
  }
`;

const SearchResultList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SearchResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f5f7fa;
  }
`;

const ResultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResultName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ResultDetail = styled.span`
  font-size: 14px;
  color: #666;
`;

const EmptyResult = styled.div`
  text-align: center;
  color: #999;
  margin-top: 20px;
`;
