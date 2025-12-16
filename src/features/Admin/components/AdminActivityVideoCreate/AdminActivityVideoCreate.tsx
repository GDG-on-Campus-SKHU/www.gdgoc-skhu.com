import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';
import {
  DeleteButtonText,
  ModalActions,
  ModalButtonContainer,
  ModalCard,
  ModalInfo,
  ModalOverlay,
  ModalTitle,
  MyDeleteButton,
} from '../../styles/AdminIdeaDeleted';

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
const GenOptions = ['25-26', '24-25', '23-24', '22-23', '기타'];
const AdminActivityCategoryCreate: NextPage = () => {
  const router = useRouter();
  const [videoTitle, setVideoTitle] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [generation, setGeneration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [fetchedTitle, setFetchedTitle] = useState('');
  const [status] = useState<'public' | 'private'>('private');
  const [videos] = useState<VideoItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  const titleCount = `${videoTitle.length}/20`;
  const presenterCount = `${presenterName.length}/5`;
  const isTitleMax = videoTitle.length >= 20;
  const isPresenterMax = presenterName.length >= 5;
  const hasKoreanInUrl = /[ㄱ-ㅎ가-힣]/.test(videoUrl);

  const thumbnailUrl = useMemo(() => {
    const extractId = (url: string) => {
      try {
        const { hostname, searchParams, pathname } = new URL(url);
        if (hostname.includes('youtu.be')) {
          return pathname.replace('/', '') || null;
        }
        if (hostname.includes('youtube.com')) {
          if (searchParams.get('v')) return searchParams.get('v');
          const pathParts = pathname.split('/').filter(Boolean);
          if (pathParts[0] === 'embed' || pathParts[0] === 'shorts') {
            return pathParts[1] || null;
          }
        }
      } catch {
        return null;
      }
      return null;
    };

    const id = extractId(videoUrl.trim());
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }, [videoUrl]);

  useEffect(() => {
    setFetchedTitle('');
    if (!thumbnailUrl) return;

    const controller = new AbortController();
    const fetchTitle = async () => {
      try {
        const resp = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`, {
          signal: controller.signal,
        });
        if (!resp.ok) return;
        const data = await resp.json();
        if (typeof data.title === 'string') {
          setFetchedTitle(data.title);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setFetchedTitle('');
        }
      }
    };

    fetchTitle();
    return () => controller.abort();
  }, [thumbnailUrl, videoUrl]);

  const handleSave = () => {
    const payload = {
      title: videoTitle,
      presenter: presenterName,
      generation,
      url: videoUrl,
      status,
      videos,
    };
    console.log('Saving category', payload);
    setShowModal(true);
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
                <TitleFieldLabel>영상 제목</TitleFieldLabel>
                <Counter $hasValue={videoTitle.length > 0} $isMaxLength={isTitleMax}>
                  {titleCount}
                </Counter>
              </FieldHeader>
              <Input
                value={videoTitle}
                onChange={e => setVideoTitle(e.target.value.slice(0, 20))}
                placeholder="제목을 입력해주세요."
                $isMaxLength={isTitleMax}
              />
            </Field>
            <Field>
              <FieldHeader>
                <PublisherFieldLabel>영상 발표자</PublisherFieldLabel>
                <Counter $hasValue={presenterName.length > 0} $isMaxLength={isPresenterMax}>
                  {presenterCount}
                </Counter>
              </FieldHeader>
              <Input
                value={presenterName}
                onChange={e => setPresenterName(e.target.value.slice(0, 5))}
                placeholder="발표자 이름을 입력해주세요."
                $isMaxLength={isPresenterMax}
              />
            </Field>
            <Field>
              <FieldHeader>
                <GenerationFieldLabel>기수</GenerationFieldLabel>
              </FieldHeader>
              <StyledSelectBox
                options={GenOptions}
                placeholder="기수를 선택해주세요."
                $hasValue={!!generation}
                onChange={selected => setGeneration(selected[0] ?? '')}
              />
            </Field>
            <Field>
              <FieldHeader>
                <UrlFieldLabel>URL</UrlFieldLabel>
                <Counter $hasValue={videoUrl.length > 0} $isUrlError={hasKoreanInUrl}></Counter>
              </FieldHeader>
              <Input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="영상의 링크를 작성해주세요."
                $isUrlError={hasKoreanInUrl}
              />
            </Field>
            {thumbnailUrl && (
              <PreviewForm>
                <PreviewLabel>영상 미리보기</PreviewLabel>
                <PreviewBox>
                  <PreviewImage src={thumbnailUrl} alt="영상 썸네일 미리보기" />
                </PreviewBox>
                {fetchedTitle && (
                  <PreviewTitleContainer>
                    <PreviewTitle>{fetchedTitle}</PreviewTitle>
                  </PreviewTitleContainer>
                )}
              </PreviewForm>
            )}
          </FormSection>
          <Actions>
            <PrimaryButton
              type="button"
              disabled={
                !videoTitle.trim() ||
                !presenterName.trim() ||
                !generation.trim() ||
                !videoUrl.trim() ||
                !thumbnailUrl
              }
              onClick={handleSave}
            >
              <PrimaryButtonText
                $disabled={
                  !videoTitle.trim() ||
                  !presenterName.trim() ||
                  !generation.trim() ||
                  !videoUrl.trim() ||
                  !thumbnailUrl
                }
              >
                저장하기
              </PrimaryButtonText>
            </PrimaryButton>
          </Actions>
        </ContentContainer>
      </Content>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalInfo>
              <ModalTitle>게시물 등록이 완료되었습니다.</ModalTitle>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.sessionStorage.setItem(
                        'newActivityVideo',
                        JSON.stringify({
                          title: videoTitle,
                          owner: presenterName,
                          generation,
                          url: videoUrl.trim(),
                          thumbnailUrl,
                        })
                      );
                    }
                    setShowModal(false);
                    router.push('/AdminActivityCategoryCreate');
                  }}
                >
                  <DeleteButtonText>확인</DeleteButtonText>
                </MyDeleteButton>
              </ModalButtonContainer>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
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
  height: 142px;
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
  height: 72px;
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
  padding: 91px 40px 40px 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
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

const TitleFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const Counter = styled.span<{ $hasValue: boolean; $isMaxLength?: boolean; $isUrlError?: boolean }>`
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  color: ${({ $isMaxLength, $isUrlError, $hasValue }) =>
    $isMaxLength || $isUrlError
      ? '#ea4335'
      : $hasValue
        ? 'var(--grayscale-1000, #040405)'
        : '#626873'};
`;

const Input = styled.input<{ $isMaxLength?: boolean; $isUrlError?: boolean }>`
  width: 100%;
  border: 1px solid
    ${({ $isMaxLength, $isUrlError }) => ($isMaxLength || $isUrlError ? '#ea4335' : '#c3c6cb')};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  color: #040405;
  height: 50px;

  &::placeholder {
    color: #979ca5;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 171px;
`;

const PrimaryButton = styled.button`
  display: flex;
  width: 300px;
  height: 50px;
  border-radius: 8px;
  margin: 0;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  background: ${({ disabled }) =>
    disabled ? 'var(--grayscale-300, #e0e2e5)' : 'var(--primary-600-main, #4285F4)'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? 'var(--grayscale-300, #e0e2e5)' : '#3367d6')};
  }
`;

const PrimaryButtonText = styled.div<{ $disabled: boolean }>`
  color: ${({ $disabled }) => ($disabled ? 'var(--grayscale-400, #c3c6cb)' : '#ffffff')};

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const StyledSelectBox = styled(SelectBoxBasic)<{ $hasValue: boolean }>`
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
  display: flex;
  width: 300px;
  flex-direction: column;
  align-items: flex-start;
  height: 50px;

  & > div:first-of-type {
    border: none !important;
    background: transparent;
    height: 52px;
    box-shadow: none;
    display: flex;
    align-items: center;
    gap: 8px;
    svg {
      width: 24px;
      height: 24px;

      background: url('/dropdownarrow.svg') center/contain no-repeat;
      color: transparent;
      stroke: none;
    }

    span {
      color: ${({ $hasValue }) =>
        $hasValue ? 'var(--grayscale-1000, #040405)' : 'var(--grayscale-500, #979ca5)'} !important;
      font-family: Pretendard;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 160%; /* 25.6px */
    }
  }
`;

const PreviewLabel = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: stretch;
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const PreviewBox = styled.div`
  width: 488px;
  height: 268px;

  border-radius: 8px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewTitleContainer = styled.div`
  margin: 4px 0 0;
  width: 100%;
  max-width: 360px;
`;

const PreviewTitle = styled.div`
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
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
  align-self: stretch;
`;

const PublisherFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const GenerationFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
  align-self: stretch;
`;

const UrlFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const PreviewForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;
