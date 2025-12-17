import { useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCreateCategory, useCreatePost } from '@/lib/adminActivity.api';
import styled from 'styled-components';

import {
  DeleteButtonText,
  ModalActions,
  ModalButtonContainer,
  ModalCard,
  ModalInfo,
  ModalMessage,
  ModalOverlay,
  ModalTitle,
  MyCancelButton,
  MyDeleteButton,
} from '../../styles/AdminIdeaDeleted';

type VideoItem = {
  id: number;
  title: string;
  owner: string;
  generation: string;
  url?: string;
  thumbnailUrl?: string;
  isNew?: boolean;
};

const GENERATION_OPTIONS = ['25-26', '24-25', '23-24', '22-23'];
const LOAD_STEP = 10;

const AdminActivityCategoryCreate: NextPage = () => {
  const router = useRouter();

  const { mutateAsync: createCategory, isPending: isCategoryPending } = useCreateCategory();
  const { mutateAsync: createPost, isPending: isPostPending } = useCreatePost();

  const [categoryName, setCategoryName] = useState('');
  const [status, setStatus] = useState<'public' | 'private'>('public');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(LOAD_STEP);

  // 삭제 관련 상태
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string>('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  const nameCount = `${categoryName.length}/50`;
  const isMaxCategoryLength = categoryName.length >= 50;

  // 유효성 검사
  const allVideosValid = useMemo(
    () =>
      videos.length > 0 &&
      videos.every(v => v.title.trim() && v.owner.trim() && v.generation.trim()),
    [videos]
  );

  const canSave = useMemo(
    () => categoryName.trim().length > 0 && allVideosValid && editingId === null,
    [categoryName, allVideosValid, editingId]
  );

  const isSubmitting = isCategoryPending || isPostPending;

  const handleAddVideo = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'createCategoryDraft',
        JSON.stringify({
          categoryName,
          status,
        })
      );
    }
    router.push('/AdminActivityVideoCreate');
  };

  const handleDeleteVideo = (video: VideoItem) => {
    setDeleteTargetId(video.id);
    setDeleteTargetTitle(video.title);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId === null) return;
    if (editingId === deleteTargetId) {
      setEditingId(null);
    }
    setVideos(prev => {
      const next = prev.filter(v => v.id !== deleteTargetId);
      setVisibleCount(count => Math.min(count, Math.max(next.length, 0)));
      return next;
    });
    setShowDeleteConfirm(false);
    setShowDeleteComplete(true);
  };

  const completeDelete = () => {
    setShowDeleteComplete(false);
    setDeleteTargetId(null);
    setDeleteTargetTitle('');
  };

  const handleStartEdit = (video: VideoItem) => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(
        'createCategoryDraft',
        JSON.stringify({
          categoryName,
          status,
        })
      );
      window.sessionStorage.setItem('editActivityVideoDraft', JSON.stringify(video));
    }
    router.push('/AdminActivityVideoEdit');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const categoryDraft = window.sessionStorage.getItem('createCategoryDraft');
    if (categoryDraft) {
      try {
        const parsedDraft = JSON.parse(categoryDraft);
        if (parsedDraft.categoryName) setCategoryName(parsedDraft.categoryName);
        if (parsedDraft.status) setStatus(parsedDraft.status);
      } catch (e) {
        console.error('Failed to parse category draft', e);
      }
    }

    const storedNew = window.sessionStorage.getItem('newActivityVideo');
    const storedEdit = window.sessionStorage.getItem('editActivityVideo');
    let added = false;
    let editParsed: Partial<VideoItem> | null = null;

    try {
      if (storedEdit) editParsed = JSON.parse(storedEdit);
    } catch {
      editParsed = null;
    }

    try {
      const parsedNew: Partial<VideoItem> | null = storedNew ? JSON.parse(storedNew) : null;

      setVideos(prev => {
        let next = prev;
        if (parsedNew?.title) {
          const nextId = prev.length ? Math.max(...prev.map(v => v.id)) + 1 : 1;
          const nextVideo: VideoItem = {
            id: nextId,
            title: parsedNew.title ?? '영상 제목',
            owner: parsedNew.owner ?? '',
            generation: parsedNew.generation ?? GENERATION_OPTIONS[0],
            url: parsedNew.url,
            thumbnailUrl: parsedNew.thumbnailUrl,
          };
          next = [...prev, nextVideo];
          added = true;
        }
        if (editParsed?.id !== undefined) {
          next = next.map(video =>
            video.id === editParsed?.id
              ? {
                  ...video,
                  title: editParsed?.title ?? video.title,
                  owner: editParsed?.owner ?? video.owner,
                  generation: editParsed?.generation ?? video.generation,
                  url: editParsed?.url ?? video.url,
                  thumbnailUrl: editParsed?.thumbnailUrl ?? video.thumbnailUrl,
                }
              : video
          );
        }
        return next;
      });
      if (added) {
        setVisibleCount(prev => {
          const base = prev || 0;
          if (base < LOAD_STEP) return Math.min(LOAD_STEP, base + 1);
          return base;
        });
      }
    } catch (error) {
      console.error('Failed to restore video from sessionStorage', error);
    } finally {
      if (storedNew) window.sessionStorage.removeItem('newActivityVideo');
      if (storedEdit) window.sessionStorage.removeItem('editActivityVideo');
    }
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + LOAD_STEP, videos.length));
  };

  const handleSave = async () => {
    if (!canSave || isSubmitting) return;

    try {
      const categoryResponse = await createCategory({
        categoryName: categoryName,
        published: status === 'public',
      });

      const newCategoryId = categoryResponse.categoryId || (categoryResponse as any).id;

      if (!newCategoryId) {
        throw new Error('Category ID not found in response');
      }

      const postPromises = videos.map(video =>
        createPost({
          categoryId: newCategoryId,
          data: {
            title: video.title,
            speaker: video.owner,
            generation: video.generation,
            videoUrl: video.url || '',
          },
        })
      );

      await Promise.all(postPromises);

      alert('카테고리와 영상이 성공적으로 저장되었습니다.');

      sessionStorage.removeItem('newActivityVideo');
      sessionStorage.removeItem('editActivityVideo');
      sessionStorage.removeItem('createCategoryDraft');

      router.push('/AdminActivity');
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleBack = () => {
    router.back();
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
                <FieldLabel>카테고리명</FieldLabel>
                <Counter $hasValue={categoryName.length > 0} $isMaxLength={isMaxCategoryLength}>
                  {nameCount}
                </Counter>
              </FieldHeader>
              <Input
                value={categoryName}
                onChange={e => setCategoryName(e.target.value.slice(0, 50))}
                placeholder="카테고리명을 입력해주세요."
                $hasValue={categoryName.length > 0}
                $isMaxLength={isMaxCategoryLength}
              />
            </Field>

            <FieldSelection>
              <FieldLabel>카테고리 게시 여부</FieldLabel>
              <RadioGroup>
                <RadioOption onClick={() => setStatus('public')}>
                  <RadioInput type="radio" readOnly checked={status === 'public'} />
                  <TrueText>공개</TrueText>
                </RadioOption>
                <RadioOption onClick={() => setStatus('private')}>
                  <RadioInput type="radio" readOnly checked={status === 'private'} />
                  <FalseText>비공개</FalseText>
                </RadioOption>
              </RadioGroup>
            </FieldSelection>

            <VideoSection>
              <VideoHeaderRow>
                <VideoTitleColumn>
                  <VideoTitleRow>
                    <FieldLabel>영상 리스트</FieldLabel>
                    <VideoCount>{videos.length}개</VideoCount>
                  </VideoTitleRow>
                  <VideoHelperText>1개 이상 등록해야 카테고리가 게시됩니다.</VideoHelperText>
                </VideoTitleColumn>
                <AddVideoButton type="button" onClick={handleAddVideo}>
                  영상 등록하기
                </AddVideoButton>
              </VideoHeaderRow>

              <VideoTable>
                <VideoHeader>
                  <ThumbnailHeader>
                    <HeaderCell $thumb>썸네일</HeaderCell>
                  </ThumbnailHeader>
                  <TitleHeader>
                    <TitleHeaderCell>영상 제목</TitleHeaderCell>
                  </TitleHeader>
                  <OwnerHeader>
                    <OwnerHeaderCell>이름</OwnerHeaderCell>
                  </OwnerHeader>
                  <GenerationHeader>
                    <GenerationHeaderCell>기수</GenerationHeaderCell>
                  </GenerationHeader>
                  <ManagementHeader>
                    <ManagementHeaderCell>관리</ManagementHeaderCell>
                  </ManagementHeader>
                </VideoHeader>

                {videos.length === 0 ? (
                  <EmptyRow>아직 게시된 영상이 없습니다.</EmptyRow>
                ) : (
                  videos.slice(0, visibleCount).map(video => (
                    <VideoRow key={video.id}>
                      {video.thumbnailUrl ? (
                        <ThumbImage src={video.thumbnailUrl} alt="영상 썸네일" />
                      ) : (
                        <ThumbPlaceholder />
                      )}

                      <>
                        <TitleBody>
                          <TitleBodyCell>{video.title}</TitleBodyCell>
                        </TitleBody>
                        <OwnerBody>
                          <OwnerBodyCell>{video.owner}</OwnerBodyCell>
                        </OwnerBody>
                        <GenerationBody>
                          <GenerationBodyCell>{video.generation}</GenerationBodyCell>
                        </GenerationBody>
                        <ManagementCell>
                          <EditButton type="button" onClick={() => handleStartEdit(video)}>
                            수정
                          </EditButton>
                          <DeleteButton type="button" onClick={() => handleDeleteVideo(video)}>
                            삭제
                          </DeleteButton>
                        </ManagementCell>
                      </>
                    </VideoRow>
                  ))
                )}
              </VideoTable>

              {videos.length > visibleCount && (
                <LoadMore type="button" onClick={handleLoadMore}>
                  <LoadMoreCTNR>
                    <LoadMoreButtonCTNR>
                      <LoadMoreText>더보기 </LoadMoreText>
                      <Image src="/admindropdown.svg" width={24} height={24} alt={'더보기'} />
                    </LoadMoreButtonCTNR>
                  </LoadMoreCTNR>
                </LoadMore>
              )}
            </VideoSection>
          </FormSection>

          <Actions>
            <SecondaryButton type="button" onClick={handleBack}>
              돌아가기
            </SecondaryButton>
            <PrimaryButton type="button" disabled={!canSave || isSubmitting} onClick={handleSave}>
              {isSubmitting ? '저장 중...' : '저장하기'}
            </PrimaryButton>
          </Actions>
        </ContentContainer>
      </Content>

      {/* Modals */}
      {showDeleteConfirm && (
        <ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalInfo>
              <ModalTitle>{deleteTargetTitle}</ModalTitle>
              <ModalMessage>게시글을 삭제하시겠습니까?</ModalMessage>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton type="button" onClick={confirmDelete}>
                  <DeleteButtonText>확인</DeleteButtonText>
                </MyDeleteButton>
                <MyCancelButton type="button" onClick={() => setShowDeleteConfirm(false)}>
                  <CancelButtonText>취소</CancelButtonText>
                </MyCancelButton>
              </ModalButtonContainer>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {showDeleteComplete && (
        <ModalOverlay onClick={completeDelete}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalInfo>
              <ModalTitle>게시글 삭제가 완료되었습니다.</ModalTitle>
            </ModalInfo>
            <ModalActions>
              <ModalButtonContainer>
                <MyDeleteButton type="button" onClick={completeDelete}>
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
  grid-template-rows: auto;
  min-height: 100vh;
  background: #ffffff;
`;

const Content = styled.main`
  background: #ffffff;
  padding: 91px 40px 0 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1100px;
  max-width: 100%;
  gap: 60px;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const Title = styled.h1`
  margin: 0;
  color: #040405;
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
`;

const Subtitle = styled.p`
  margin: 0;
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
  display: flex;
  flex-direction: column;
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
  color: var(--grayscale-1000, #040405);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const Counter = styled.span<{ $hasValue: boolean; $isMaxLength?: boolean }>`
  color: ${({ $isMaxLength, $hasValue }) =>
    $isMaxLength ? '#ea4335' : $hasValue ? 'var(--grayscale-1000, #040405)' : '#626873'};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const Input = styled.input<{ $hasValue: boolean; $isMaxLength?: boolean }>`
  width: 100%;
  border: 1px solid ${({ $isMaxLength }) => ($isMaxLength ? '#ea4335' : '#c3c6cb')};
  border-radius: 8px;
  padding: 12px 16px;
  height: 50px;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  color: ${({ $hasValue }) => ($hasValue ? 'var(--grayscale-1000, #040405)' : '#979ca5')};

  &::placeholder {
    color: #979ca5;
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 160%;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RadioOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  color: #040405;
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

  width: 100%;
`;

const VideoHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto 20px;
`;

const VideoTitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 0;
  align-items: flex-start;
`;

const VideoTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const VideoTable = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;
  background: #fff;
  width: 100%;
  max-width: 1105px;
  margin: 0 auto;
`;

const VideoHeader = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr 80px 80px 132px;
  background: #ededef;
  height: 45px;
  padding: 0 8px;
  align-items: center;
  justify-items: start;
  width: 100%;
  color: #7e8590;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  gap: 19px;
`;

const HeaderCell = styled.div<{ $thumb?: boolean; $title?: boolean; $management?: boolean }>`
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const VideoRow = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr 80px 80px 132px;
  align-items: center;
  justify-items: start;
  height: 122px;
  gap: 19px;
  padding: 16px 8px;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  width: 100%;
`;

const ThumbPlaceholder = styled.div`
  width: 160px;
  height: 90px;
  border-radius: 4px;
  background: #e0e2e5;
`;

const ThumbImage = styled.img`
  width: 160px;
  height: 90px;
  border-radius: 4px;
  object-fit: cover;
  background: #e0e2e5;
`;

const EmptyRow = styled.div`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  width: 1105px;
  height: 60px;
  padding: 16px 8px;
  justify-content: center;
  align-items: center;
  color: var(--grayscale-600, #7e8590);

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const ManagementCell = styled.div`
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  display: inline-flex;
  width: 132px;
`;

const BaseActionButton = styled.button`
  height: 34px;
  min-width: 64px;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
`;

const EditButton = styled(BaseActionButton)`
  border: 1px solid #4285f4;
  background: #ffffff;
  color: #4285f4;
`;

const DeleteButton = styled(BaseActionButton)`
  border: 1px solid #ff7362;
  background: #ffffff;
  color: #ff7362;
`;

const CancelButtonText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const AddVideoButton = styled.button`
  border-radius: 8px;
  background: #4285f4;
  color: #f9f9fa;
  width: 200px;
  height: 50px;
  padding: 10px 8px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 20px 0;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
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

const VideoHelperText = styled.span`
  color: #626873;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
`;

const LoadMore = styled.button`
  border: none;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  width: 1105px;
  height: 60px;

  padding: 16px 8px;
  justify-content: center;
  align-items: center;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 133px;
  margin-bottom: 40px;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e0e2e5' : '#4285f4')};
  color: ${({ disabled }) => (disabled ? '#979ca5' : '#ffffff')};
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background: ${({ disabled }) => (disabled ? '#e0e2e5' : '#3367d6')};
  }
`;

const SecondaryButton = styled.button`
  border-radius: 8px;
  border: 1px solid #4285f4;
  background: #fff;
  display: inline-flex;
  width: 300px;
  height: 50px;
  padding: 10px 8px;
  justify-content: center;
  align-items: center;
  color: #4285f4;
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

const TitleBody = styled.div`
  width: 500px;
  padding: 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;
const TitleBodyCell = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 484px;
  color: #040405;
  font-size: 20px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 32px;
  word-wrap: break-word;
`;
const OwnerBody = styled.div`
  display: flex;
  width: 80px;
  height: 42px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const OwnerBodyCell = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  width: 52px;
  height: 32px;
`;
const GenerationBody = styled.div`
  width: 80px;
  height: 48px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;
const GenerationBodyCell = styled.div`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
  width: 57px;
`;

const TitleHeader = styled.div`
  width: 500px;
  padding: 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;

const TitleHeaderCell = styled.span`
  color: #7e8590;
  font-size: 18px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 28.8px;
  word-wrap: break-word;
  width: 484px;
`;

const OwnerHeader = styled.div`
  width: 80px;
  padding: 8px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;

const OwnerHeaderCell = styled.div`
  color: #7e8590;
  font-size: 18px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 28.8px;
  word-wrap: break-word;
  width: 32px;
`;

const GenerationHeader = styled.div`
  width: 80px;
  padding: 8px 0;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  display: inline-flex;
`;

const GenerationHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: left;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  width: 32px;
`;

const ManagementHeader = styled.div`
  display: flex;
  width: 132px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;

const ManagementHeaderCell = styled.div`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
  width: 32px;
`;

const LoadMoreCTNR = styled.div`
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
  display: flex;
  width: 1105px;
  height: 60px;
  padding: 16px 8px;
  justify-content: center;
  align-items: center;
`;

const LoadMoreText = styled.span`
  color: var(--primary-600-main, #4285f4);

  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
  align-items: center;
`;

const LoadMoreButtonCTNR = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FieldSelection = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  margin-top: 8px;
`;

const TrueText = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const FalseText = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b4/b4 */
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 25.6px */
`;

const ThumbnailHeader = styled.div`
  display: flex;
  width: 160px;
  padding: 8px;
  align-items: center;
  gap: 8px;
`;
