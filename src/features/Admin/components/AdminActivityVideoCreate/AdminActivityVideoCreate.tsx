import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCreatePost } from '@/lib/adminActivity.api';
import styled from 'styled-components';

import SelectBoxBasic from '../../../team-building/components/SelectBoxBasic';

const GenOptions = ['25-26', '24-25', '23-24', '22-23', '기타'];

const AdminActivityVideoCreate: NextPage = () => {
  const router = useRouter();
  const [videoTitle, setVideoTitle] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [generation, setGeneration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [fetchedTitle, setFetchedTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null); // null=미검증/입력중
  const [urlErrorMessage, setUrlErrorMessage] = useState<string>('');

  const { mutate: createPost, isPending } = useCreatePost();

  function extractYoutubeId(url: string): string | null {
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
  }

  useEffect(() => {
    if (!router.isReady) return;
    const { categoryId: idParam } = router.query;

    if (idParam) {
      setCategoryId(Number(idParam));
    }
  }, [router.isReady, router.query]);

  const titleCount = `${videoTitle.length}/20`;
  const presenterCount = `${presenterName.length}/5`;
  const isTitleMax = videoTitle.length >= 20;
  const isPresenterMax = presenterName.length >= 5;
  const hasKoreanInUrl = /[ㄱ-ㅎ가-힣]/.test(videoUrl);
  const youtubeId = useMemo(() => extractYoutubeId(videoUrl.trim()), [videoUrl]);

  useEffect(() => {
    setFetchedTitle('');
    setIsUrlValid(null);
    setUrlErrorMessage('');

    const trimmed = videoUrl.trim();
    if (!trimmed) return;

    // 한글 포함이면 바로 invalid
    if (/[ㄱ-ㅎ가-힣]/.test(trimmed)) {
      setIsUrlValid(false);
      setUrlErrorMessage('URL에 한글이 포함되어 있어요.');
      return;
    }

    const youtubeId = extractYoutubeId(trimmed);
    if (!youtubeId) {
      setIsUrlValid(false);
      setUrlErrorMessage('유효한 유튜브 링크 형식이 아니에요.');
      return;
    }

    const controller = new AbortController();

    const validate = async () => {
      try {
        // noembed로 검증 + 제목 가져오기
        const resp = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });

        if (!resp.ok) {
          setIsUrlValid(false);
          setUrlErrorMessage('존재하지 않는 영상이거나 접근할 수 없어요.');
          return;
        }

        const data = await resp.json();

        // noembed 에러 응답 형태 처리
        if (data?.error) {
          setIsUrlValid(false);
          setUrlErrorMessage('존재하지 않는 영상이거나 접근할 수 없어요.');
          return;
        }

        // title 있으면 유효로 판단
        if (typeof data?.title === 'string' && data.title.trim()) {
          setFetchedTitle(data.title);
          setIsUrlValid(true);
          setUrlErrorMessage('');
          return;
        }

        // title이 없으면 보수적으로 invalid 처리
        setIsUrlValid(false);
        setUrlErrorMessage('영상 정보를 불러오지 못했어요. URL을 확인해주세요.');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setIsUrlValid(false);
          setUrlErrorMessage('영상 정보를 불러오는 중 오류가 발생했어요.');
        }
      }
    };

    validate();
    return () => controller.abort();
  }, [videoUrl]);

  const thumbnailUrl = useMemo(() => {
    return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '';
  }, [youtubeId]);

  const handleSave = () => {
    const videoData = {
      title: videoTitle,
      owner: presenterName,
      generation,
      url: videoUrl.trim(),
      thumbnailUrl,
    };

    if (isUrlValid !== true) {
      alert(urlErrorMessage || '유효하지 않은 영상 URL입니다.');
      return;
    }

    if (categoryId) {
      createPost(
        {
          categoryId,
          data: {
            title: videoTitle,
            speaker: presenterName,
            generation,
            videoUrl: videoUrl.trim(),
          },
        },
        {
          onSuccess: () => {
            console.log('영상 등록에 성공했습니다.');
          },
          onError: error => {
            console.error(error);
            console.log('영상 등록에 실패했습니다.');
          },
        }
      );
    } else {
      window.sessionStorage.setItem('newActivityVideo', JSON.stringify(videoData));
      router.back();
    }
  };

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
                $hasValue={!!generation}
                onChange={selected => setGeneration(selected[0] ?? '')}
              />
            </Field>
            <Field>
              <FieldHeader>
                <UrlFieldLabel>URL</UrlFieldLabel>
                <Counter
                  $hasValue={videoUrl.length > 0}
                  $isUrlError={hasKoreanInUrl || isUrlValid === false}
                />
              </FieldHeader>

              <Input
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="영상의 링크를 작성해주세요."
                $isUrlError={hasKoreanInUrl || isUrlValid === false}
              />

              {/* ✅ URL 유효성 UX 메시지 */}
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
                !thumbnailUrl ||
                isUrlValid !== true ||
                (categoryId ? isPending : false)
              }
              onClick={handleSave}
            >
              <PrimaryButtonText
                $disabled={
                  !videoTitle.trim() ||
                  !presenterName.trim() ||
                  !generation.trim() ||
                  !videoUrl.trim() ||
                  !thumbnailUrl ||
                  isUrlValid !== true ||
                  (categoryId ? isPending : false)
                }
              >
                {categoryId && isPending ? '저장 중...' : '저장하기'}
              </PrimaryButtonText>
            </PrimaryButton>
          </Actions>
        </ContentContainer>
      </Content>
    </Page>
  );
};

export default AdminActivityVideoCreate;

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
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const Subtitle = styled.p`
  color: var(--grayscale-700, #626873);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
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
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
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
  border: none;
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
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
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
      line-height: 160%;
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
  line-height: 160%;
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
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
`;

const PublisherFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const GenerationFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  align-self: stretch;
`;

const UrlFieldLabel = styled.span`
  color: var(--grayscale-1000, #040405);
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const PreviewForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;
