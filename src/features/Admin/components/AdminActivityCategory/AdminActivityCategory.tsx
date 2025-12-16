import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type VideoItem = {
  id: number;
  title: string;
  owner: string;
  generation: string;
};

const DEFAULT_VIDEOS: VideoItem[] = [
  { id: 1, title: '👀 24-25 Tech Talk 다시보기', owner: '윤준석', generation: '24-25' },
  { id: 2, title: '👀 23-24 Tech Talk 다시보기', owner: '이솔', generation: '23-24' },
];

const AdminActivityCategoryCreate: NextPage = () => {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState<'public' | 'private'>('private');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const nameCount = `${categoryName.length}/50`;

  const handleAddVideo = () => {
    const nextId = videos.length ? Math.max(...videos.map(v => v.id)) + 1 : 1;
    setVideos(prev => [
      ...prev,
      { id: nextId, title: `새 영상 ${nextId}`, owner: '작성자', generation: '25-26' },
    ]);
  };

  const handleSave = () => {
    const payload = {
      categoryName,
      status,
      videos,
    };
    console.log('Saving category', payload);
    void router.push('/AdminActivity');
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <Page>
      <Sidebar>
        <Logo>
          <Image src="/gdgoc_skhu_admin.svg" alt="GDGoC SKHU" width={60} height={38} />
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
          <MenuItem>프로젝트 갤러리 관리</MenuItem>
          <MenuItemActive>
            <span>액티비티 관리</span>
            <ArrowIcon src="/rightarrow_admin.svg" alt="" />
          </MenuItemActive>
          <MenuItem>홈 화면으로 나가기</MenuItem>
        </MenuList>
      </Sidebar>

      <Content>
        <ContentContainer>
          <Header>
            <Title>액티비티 관리</Title>
            <Subtitle>액티비티 게시판에 업로드된 콘텐츠를 관리할 수 있습니다.</Subtitle>
          </Header>

          <FormSection>
            <Field>
              <FieldHeader>
                <FieldLabel>카테고리명</FieldLabel>
                <Counter $hasValue={categoryName.length > 0}>{nameCount}</Counter>
              </FieldHeader>
              <Input
                value={categoryName}
                onChange={e => setCategoryName(e.target.value.slice(0, 50))}
                placeholder="카테고리명을 입력해주세요."
              />
            </Field>

            <RadioField>
              <FieldLabel>카테고리 게시 여부</FieldLabel>
              <RadioGroup>
                <RadioOption onClick={() => setStatus('public')}>
                  <RadioInput type="radio" readOnly checked={status === 'public'} />
                  <span>공개</span>
                </RadioOption>
                <RadioOption onClick={() => setStatus('private')}>
                  <RadioInput type="radio" readOnly checked={status === 'private'} />
                  <span>비공개</span>
                </RadioOption>
              </RadioGroup>
            </RadioField>

            <VideoSection>
              <VideoListSection>
                <VideoHeaderRow>
                  <VideoTitleColumn>
                    <VideoTitleRow>
                      <FieldLabel>영상 리스트</FieldLabel>
                      <VideoCount>{videos.length}개</VideoCount>
                    </VideoTitleRow>
                    <VideoHelperText>1개 이상 등록해야 카테고리가 게시됩니다.</VideoHelperText>
                  </VideoTitleColumn>
                  <AddVideoButton type="button" onClick={handleAddVideo}>
                    <VideoButton>영상 등록하기</VideoButton>
                  </AddVideoButton>
                </VideoHeaderRow>
              </VideoListSection>

              <VideoTable>
                <VideoHeader>
                  <ThumbnailHeader>
                    {' '}
                    <HeaderCell>썸네일</HeaderCell>
                  </ThumbnailHeader>
                  <TitleHeader>
                    {' '}
                    <HeaderCell $wide>영상 제목</HeaderCell>
                  </TitleHeader>
                  <NameHeader>
                    {' '}
                    <HeaderCell>이름</HeaderCell>
                  </NameHeader>
                  <GenerationHeader>
                    <HeaderCell>기수</HeaderCell>
                  </GenerationHeader>
                  <ManagementHeader>
                    {' '}
                    <HeaderCell>관리</HeaderCell>
                  </ManagementHeader>
                </VideoHeader>
                {videos.length === 0 ? (
                  <EmptyRow>아직 게시된 영상이 없습니다.</EmptyRow>
                ) : (
                  videos.map(video => (
                    <VideoRow key={video.id}>
                      <BodyCell>—</BodyCell>
                      <BodyCell $wide>{video.title}</BodyCell>
                      <BodyCell>{video.owner}</BodyCell>
                      <BodyCell>{video.generation}</BodyCell>
                      <BodyCell></BodyCell>
                    </VideoRow>
                  ))
                )}
              </VideoTable>
            </VideoSection>

            <Actions>
              <SecondaryButton type="button" onClick={handleBack}>
                <SecondaryButtonText>돌아가기</SecondaryButtonText>
              </SecondaryButton>
              <PrimaryButton type="button" disabled={videos.length === 0} onClick={handleSave}>
                <PrimaryButtonText>저장하기</PrimaryButtonText>
              </PrimaryButton>
            </Actions>
          </FormSection>
        </ContentContainer>
      </Content>
    </Page>
  );
};

export default AdminActivityCategoryCreate;

const Page = styled.div`
  display: grid;
  grid-template-columns: 255px 1fr;
  min-height: 100vh;
  background: #ffffff;
  width: 100%;
  height:;
`;

const Sidebar = styled.div`
  width: 255px;
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

const LogoText = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #fff;
  font-weight: 400;
  line-height: 160%;
`;

const LoginInfo = styled.div`
  align-self: stretch;
  border-top: 1px solid #626873;
  display: flex;
  align-items: center;
  padding: 20px 28px;
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
  width: 255px;
  height: 50px;

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
  height: 16px;
`;

const Content = styled.main`
  background: #ffffff;
  padding: 91px 65px 80px 40px;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1105px;
  max-width: 100%;
  gap: 40px;
`;

const Header = styled.header`
  display: inline-flex;
  height: 100px;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 6px;
`;

const Title = styled.h1`
  color: #000;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

const Subtitle = styled.p`
  color: var(--grayscale-700, #626873);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
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

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

const FieldLabel = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
  margin: 0;
`;

const Counter = styled.span<{ $hasValue: boolean }>`
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  color: #040405;
  height: 50px;

  margin &::placeholder {
    color: #979ca5;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
`;

const RadioOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  appearance: none;
  border: 1px solid #040405;
  cursor: pointer;

  &:checked {
    border: 6px solid #4285f4;
  }
`;

const VideoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const VideoListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VideoHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VideoTitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

const VideoTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const VideoTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e2e5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

const VideoHeader = styled.div`
  background: var(--grayscale-200, #ededef);
  display: flex;
  height: 45px;
  padding: 16px 8px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const VideoRow = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 3fr 1fr 1fr 1fr;
  padding: 12px 16px;
  gap: 12px;
  border-top: 1px solid #e0e2e5;
`;

const HeaderCell = styled.div<{ $wide?: boolean }>`
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  flex: 1 0 0;
`;

const BodyCell = styled.div<{ $wide?: boolean }>`
  display: flex;
  width: 1105px;
  height: 60px;
  padding: 16px 8px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
`;

const EmptyRow = styled.div`
  color: var(--grayscale-600, #7e8590);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const AddVideoButton = styled.button`
  border-radius: 8px;
  background: var(--primary-600-main, #4285f4);
  display: flex;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 120px auto 0;
`;

const PrimaryButton = styled.button`
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: var(--grayscale-300, #e0e2e5);

  &:hover {
    background: ${({ disabled }) => (disabled ? '#e0e2e5' : '#3367d6')};
  }
`;

const SecondaryButton = styled.button`
  border-radius: 8px;
  border: 1px solid var(--primary-600-main, #4285f4);
  background: #fff;
  display: flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #f0f7ff;
  }
`;

const VideoCount = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const VideoButton = styled.div`
  color: var(--grayscale-100, #f9f9fa);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const VideoHelperText = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const ThumbnailHeader = styled.div`
  display: flex;
  width: 160px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const TitleHeader = styled.div`
  display: flex;
  width: 500px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const NameHeader = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const GenerationHeader = styled.div`
  display: flex;
  width: 80px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const ManagementHeader = styled.div`
  display: flex;
  width: 132px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const SecondaryButtonText = styled.div`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const PrimaryButtonText = styled.div`
  color: var(--grayscale-400, #c3c6cb);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const RadioField = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
