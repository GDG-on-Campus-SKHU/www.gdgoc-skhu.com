import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
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
  url?: string;
  thumbnailUrl?: string;
};

const GenOptions = ['25-26', '24-25', '23-24', '22-23', '기타'];

const AdminActivityVideoEdit: NextPage = () => {
  const router = useRouter();

  // State
  const [id, setId] = useState<number | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [generation, setGeneration] = useState(GenOptions[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [fetchedTitle, setFetchedTitle] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [presetThumbnailUrl, setPresetThumbnailUrl] = useState('');
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [urlErrorMessage, setUrlErrorMessage] = useState('');

  // Validation
  const titleCount = `${videoTitle.length}/20`;
  const presenterCount = `${presenterName.length}/5`;
  const isTitleMax = videoTitle.length >= 20;
  const isPresenterMax = presenterName.length >= 5;
  const hasKoreanInUrl = /[ㄱ-ㅎ가-힣]/.test(videoUrl);

  function extractYoutubeId(url: string): string | null {
    try {
      const { hostname, searchParams, pathname } = new URL(url);

      if (hostname.includes('youtu.be')) {
        return pathname.replace('/', '') || null;
      }

      if (hostname.includes('youtube.com')) {
        if (searchParams.get('v')) return searchParams.get('v');
        const parts = pathname.split('/').filter(Boolean);
        if (parts[0] === 'embed' || parts[0] === 'shorts') {
          return parts[1] || null;
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  const youtubeId = useMemo(() => extractYoutubeId(videoUrl.trim()), [videoUrl]);

  const isValidYoutubeUrl = !!youtubeId && !hasKoreanInUrl;

  // Thumbnail Logic
  const derivedThumbnailUrl = useMemo(() => {
    if (!isValidYoutubeUrl || !youtubeId) return '';
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }, [youtubeId, isValidYoutubeUrl]);

  const thumbnailUrl = presetThumbnailUrl || derivedThumbnailUrl;

  useEffect(() => {
    setUrlErrorMessage('');
    setFetchedTitle('');

    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setIsUrlValid(null);
      return;
    }

    if (/[ㄱ-ㅎ가-힣]/.test(trimmed)) {
      setIsUrlValid(false);
      setUrlErrorMessage('URL에 한글이 포함되어 있어요.');
      return;
    }

    const id = extractYoutubeId(trimmed);
    if (!id) {
      setIsUrlValid(false);
      setUrlErrorMessage('유효한 YouTube 링크가 아니에요.');
      return;
    }

    const controller = new AbortController();

    fetch(`https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data?.error || !data?.title) {
          setIsUrlValid(false);
          setUrlErrorMessage('존재하지 않거나 접근할 수 없는 영상이에요.');
        } else {
          setIsUrlValid(true);
          setFetchedTitle(data.title);
        }
      })
      .catch(() => {
        setIsUrlValid(false);
        setUrlErrorMessage('영상 정보를 확인할 수 없어요.');
      });

    return () => controller.abort();
  }, [videoUrl]);

  // Fetch YouTube Title
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

  // Load Data from Session Storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem('editActivityVideoDraft');

    if (!stored) {
      // 데이터가 없으면 잘못된 접근이므로 뒤로가기
      router.back();
      return;
    }

    try {
      const parsed: Partial<VideoItem> = JSON.parse(stored);
      setId(typeof parsed?.id === 'number' ? parsed.id : null);
      setVideoTitle(parsed?.title ?? '');
      setPresenterName(parsed?.owner ?? '');
      setGeneration(parsed?.generation ?? GenOptions[0]);
      setVideoUrl(parsed?.url ?? '');
      if (parsed?.thumbnailUrl) {
        setPresetThumbnailUrl(parsed.thumbnailUrl);
      }
    } catch (error) {
      console.error('Failed to load edit draft', error);
      router.back();
    }
    // 데이터 로드 후 즉시 삭제하지 않음 (Strict Mode 등에서 튕김 방지)
  }, [router]);

  const handleSave = () => {
    if (!id) return;
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    if (typeof window !== 'undefined' && id) {
      // 수정된 데이터를 세션 스토리지에 저장 (부모 페이지가 읽을 수 있도록)
      window.sessionStorage.setItem(
        'editActivityVideo',
        JSON.stringify({
          id,
          title: videoTitle.trim(),
          owner: presenterName.trim(),
          generation,
          url: videoUrl.trim(),
          thumbnailUrl,
        })
      );
    }
    setShowModal(false);

    // [중요] router.push 대신 router.back() 사용
    // 그래야 생성 페이지면 생성 페이지로, 수정 페이지면 수정 페이지로 돌아가서 데이터를 반영함
    router.back();
  };

  const isSaveDisabled =
    !videoTitle.trim() || !presenterName.trim() || !generation.trim() || isUrlValid !== true;

  return (
    <Page>
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
                value={generation ? [generation] : []}
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
                onChange={e => {
                  setVideoUrl(e.target.value);
                  setPresetThumbnailUrl('');
                }}
                placeholder="영상의 링크를 작성해주세요."
                $isUrlError={hasKoreanInUrl}
              />
            </Field>
            {videoUrl && isUrlValid === false && (
              <span
                style={{
                  color: '#ea4335',
                  fontSize: '14px',
                  marginTop: '4px',
                }}
              >
                {urlErrorMessage || '올바른 YouTube 영상 URL을 입력해주세요.'}
              </span>
            )}

            {isValidYoutubeUrl && thumbnailUrl && (
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
            <PrimaryButton type="button" disabled={isSaveDisabled} onClick={handleSave}>
              <PrimaryButtonText $disabled={isSaveDisabled}>저장하기</PrimaryButtonText>
            </PrimaryButton>
          </Actions>
        </ContentContainer>
      </Content>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalInfo>
              <ModalTitle>게시글 수정이 완료되었습니다.</ModalTitle>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton type="button" onClick={handleConfirmSave}>
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

export default AdminActivityVideoEdit;

const Page = styled.div`
  grid-template-columns: 255px 1fr;
  min-height: 100vh;
  background: #ffffff;
  width: 100%;
`;

const Content = styled.main`
  background: #ffffff;
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
