import React from 'react';
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { useIdeaStore } from '../store/IdeaStore';
import { sanitizeDescription } from '../utils/sanitizeDescription';
import { useMyProfile } from '@/lib/mypageProfile.api';
import axios from 'axios';
import {
  createIdea,
  fetchCurrentTeamBuildingProject,
  fetchIdeaConfigurations,
  updateIdea,
  updateIdeaBeforeEnrollment,
} from '../../api/ideas';
import { resolveCreatorPart, toMemberCompositions } from '../IdeaForm/IdeaFormUtils';

const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
] as const;

const TEAM_GROUPS: TeamRole[][] = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];

const DEFAULT_TEAM_COUNTS: Record<TeamRole, number> = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};

const PageContainer = styled.div<{ $isModalOpen?: boolean }>`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 120px;
  width: 100%;

  /* 모달이 열렸을 때 배경 blur 처리 */
  ${({ $isModalOpen }) =>
    $isModalOpen &&
    `
    filter: blur(6px);
  `}
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

const TitleHeader = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
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

const PreviewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
  color: #ea4335;
  margin-left: auto;
`;

const TitleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

const IntroText = styled.p`
  margin: 0;
  flex: 1;
  min-width: 300px;
  max-width: 720px;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;
const WriterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const WriterContent = styled.span`
  color: #000;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
`;
const WriterName = styled.span`
  color: #040405;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%;
`;

const SubjectRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 100px;
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
  gap: 20px;
`;

const MembersSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 1080px;
  margin-top: 20px;

  gap: 20px;
  align-items: flex-start;
`;

const SectionTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
`;

const MemberCard = styled.div`
  display: flex;
  width: 1080px;
  height: 156px;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  background: #ffffff;
  padding: 30px;
  gap: 20px;
  flex-direction: column;
`;

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  align-self: stretch;
`;

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 4px;
`;

const RoleName = styled.span`
  color: var(--grayscale-1000, #040405);
gap 20px;
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 700;
line-height: 160%; /* 28.8px */
`;

const CountStat = styled.span`
  color: var(--primary-600-main, #4285f4);
  text-align: right;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const CountUnit = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: right;

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const DescriptionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 0 0;
`;

const DescriptionBox = styled.div`
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  background: #ffffff;
  padding: 30px;
  height: 400px;
  overflow: auto;
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

const ActionRow = styled.div`
  width: min(616px, 100%);
  margin: 80px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  width: 300px;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 160%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SecondaryButton = styled(ActionButton)`
  border: 1px solid #4285f4;
  background: #ffffff;
  color: #4285f4;
`;

const PrimaryButton = styled(ActionButton)`
  border: 1px solid #4285f4;
  background: #4285f4;
  color: #f9f9fa;
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
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const ModalActions = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
`;

const ModalButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  width: 222px;
  height: 50px;
  padding: 0.75rem 0;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  gap: 16px;
  height: 50px;
  border: ${({ $variant }) => ($variant === 'secondary' ? '1.5px solid #4285F4' : 'none')};
  background: ${({ $variant }) => ($variant === 'secondary' ? '#fff' : '#4285F4')};
  color: ${({ $variant }) => ($variant === 'secondary' ? '#4285F4' : '#fff')};
  transition: 0.2s ease;
  &:hover {
    filter: brightness(0.97);
  }
`;

type ModalState = 'idle' | 'confirm' | 'success';

type IdeaFormMode = 'create' | 'edit';

type TeamRole = (typeof TEAM_ROLES)[number]['key'];

interface Props {
  form?: {
    topic: string;
    title: string;
    intro: string;
    description: string;
    preferredPart: string;
    team: Partial<Record<TeamRole, number>>;
  };
  onBack?: () => void;
  onRegister?: () => Promise<number | void> | number | void;
  mode?: 'create' | 'edit';
}

export default function IdeaPreview({ form, onBack, onRegister, mode }: Props) {
  const router = useRouter();
  const [resolvedForm, setResolvedForm] = React.useState(form);

  const [modalState, setModalState] = React.useState<ModalState>('idle');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [createdIdeaId, setCreatedIdeaId] = React.useState<number | null>(null);

  function normalizeErrorMessage(errorData: any) {
    if (typeof errorData === 'string') return errorData;
    if (typeof errorData?.message === 'string') return errorData.message;
    return '';
  }

  // origin 비교용(= EditPage에서 쓰던 로직 최소 복사)
  function sortCompositions(comps: any[]) {
    return [...(comps ?? [])].sort((a, b) => String(a.part).localeCompare(String(b.part)));
  }
  function isSameCompositions(a: any[], b: any[]) {
    const aa = sortCompositions(a ?? []);
    const bb = sortCompositions(b ?? []);
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) {
      if (aa[i].part !== bb[i].part) return false;
      if ((aa[i].maxCount ?? 0) !== (bb[i].maxCount ?? 0)) return false;
    }
    return true;
  }

  const resolvedMode = React.useMemo<IdeaFormMode>(() => {
    if (mode) return mode;
    if (typeof window === 'undefined') return 'create';

    const storedMode = window.sessionStorage.getItem('ideaPreview:mode');
    const storedIdeaId = window.sessionStorage.getItem('ideaPreview:ideaId');

    // ✅ edit 진입인데 mode 저장이 누락된 경우를 방어
    if (storedIdeaId) return 'edit';

    return storedMode === 'edit' ? 'edit' : 'create';
  }, [mode]);

  const actionText = resolvedMode === 'edit' ? '아이디어 수정하기' : '아이디어 등록하기';
  const confirmTitle =
    resolvedMode === 'edit' ? '아이디어를 수정하겠습니까?' : '해당 아이디어를 게시하겠습니까?';
  const successTitle =
    resolvedMode === 'edit' ? '수정이 완료되었습니다.' : '게시가 완료되었습니다.';

  const addIdea = useIdeaStore(state => state.addIdea);

  const { data: myProfile } = useMyProfile({ enabled: true });

  const writerSchool = myProfile?.school ?? '';
  const writerName = myProfile?.name ?? '';
  const writerPartLabel = resolvedForm?.preferredPart ?? '';

  React.useEffect(() => {
    if (form) {
      setResolvedForm(form);
      return;
    }
    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem('ideaFormData');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const candidate = parsed?.form ? parsed.form : parsed;
        setResolvedForm(candidate);
        return;
      } catch (error) {
        console.error('Failed to parse ideaFormData', error);
      }
    }
    router.push('/IdeaForm');
  }, [form, router]);

  const handleBack = React.useCallback(() => {
    if (onBack) return onBack();

    if (typeof window !== 'undefined') {
      const returnTo = window.sessionStorage.getItem('ideaPreview:returnTo');
      if (returnTo) {
        router.push(returnTo);
        return;
      }
    }
    router.back();
  }, [onBack, router]);

  const handleConfirmSubmit = React.useCallback(async () => {
    if (isSubmitting) return;
    if (!resolvedForm) return;

    setIsSubmitting(true);

    try {
      // projectId 확보 (없으면 current에서 가져오기)
      const projectResp = await fetchCurrentTeamBuildingProject();
      const projectId = Number(projectResp.data?.project?.projectId);
      if (!Number.isFinite(projectId)) {
        alert('프로젝트 정보를 불러올 수 없습니다.');
        setModalState('idle');
        return;
      }

      // topicId 맵 확보
      const configResp = await fetchIdeaConfigurations();
      const topics = configResp.data?.topics ?? [];
      const topicId =
        topics.find(t => t.topic === resolvedForm.topic)?.topicId ?? Number(resolvedForm.topic); // 혹시 숫자로 들어오는 경우
      if (!topicId || !Number.isFinite(topicId)) {
        alert('아이디어 주제를 선택해주세요.');
        setModalState('idle');
        return;
      }

      // 공통: creatorPart / compositions
      const creatorPart = resolveCreatorPart(resolvedForm.preferredPart);
      if (!creatorPart) {
        alert('작성자의 파트를 선택해주세요.');
        setModalState('idle');
        return;
      }

      const compositions = toMemberCompositions(resolvedForm.team);
      if (!compositions.length) {
        alert('모집 인원을 1명 이상 입력해주세요.');
        setModalState('idle');
        return;
      }

      if (resolvedMode === 'create') {
        // 등록
        const payload = {
          title: resolvedForm.title.trim(),
          introduction: resolvedForm.intro.trim(),
          description: resolvedForm.description,
          topicId,
          creatorPart,
          registerStatus: 'REGISTERED',
          compositions,
        } as const;

        const resp = await createIdea(projectId, payload);
        const newId = resp.data?.ideaId ?? resp.data?.id ?? null;

        if (typeof newId === 'number') setCreatedIdeaId(newId);

        setModalState('success');
        return;
      }

      const ideaIdRaw =
        typeof window !== 'undefined' ? window.sessionStorage.getItem('ideaPreview:ideaId') : null;
      const ideaId = ideaIdRaw ? Number(ideaIdRaw) : NaN;
      if (!Number.isFinite(ideaId)) {
        alert('수정할 아이디어 id를 찾을 수 없습니다.');
        setModalState('idle');
        return;
      }

      // origin 읽기
      const originRaw =
        typeof window !== 'undefined' ? window.sessionStorage.getItem('ideaPreview:origin') : null;
      const origin = originRaw ? JSON.parse(originRaw) : null;

      // origin 없으면(비정상) -> 안전하게 텍스트 update만 시도
      if (!origin) {
        await updateIdea(projectId, ideaId, {
          title: resolvedForm.title.trim(),
          introduction: resolvedForm.intro.trim(),
          description: resolvedForm.description,
          topicId,
        });
        setModalState('success');
        return;
      }

      const nextCreatorPart = creatorPart;
      const nextComps = compositions;

      const creatorChanged = nextCreatorPart !== origin.creatorPart;
      const compsChanged = !isSameCompositions(origin.compositions, nextComps);
      const hasPartOrCompositionChanged = creatorChanged || compsChanged;

      if (hasPartOrCompositionChanged) {
        // before-enrollment (일정 지나면 여기서 막혀야 함)
        try {
          await updateIdeaBeforeEnrollment(projectId, ideaId, {
            title: resolvedForm.title.trim(),
            introduction: resolvedForm.intro.trim(),
            description: resolvedForm.description,
            topicId,
            creatorPart: nextCreatorPart,
            compositions: nextComps,
          });
        } catch (e) {
          if (axios.isAxiosError(e)) {
            const status = e.response?.status;
            const msg = normalizeErrorMessage(e.response?.data);
            if (status === 400 && msg) {
              alert(msg); // "일정이 지났습니다."
              setModalState('idle'); // success 모달 안 뜸
              return;
            }
          }
          throw e;
        }

        setModalState('success');
        return;
      }

      await updateIdea(projectId, ideaId, {
        title: resolvedForm.title.trim(),
        introduction: resolvedForm.intro.trim(),
        description: resolvedForm.description,
        topicId,
      });

      setModalState('success');
    } catch (e) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const msg = normalizeErrorMessage(e.response?.data);

        if (status === 401) return alert('권한이 없습니다. 다시 로그인해주세요.');
        if (status === 404) return alert('아이디어를 찾을 수 없습니다.');
        if (status === 500) return alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        if (msg) return alert(msg);

        return alert('요청에 실패했습니다.');
      }

      alert('요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, resolvedForm, resolvedMode]);

  // success 모달 확인 버튼
  const handleModalDone = React.useCallback(() => {
    setModalState('idle');

    if (resolvedMode === 'create') {
      if (createdIdeaId) {
        router.push(`/IdeaComplete?id=${createdIdeaId}`);
      } else {
        router.push('/IdeaComplete');
      }
      return;
    }

    // edit success 이동
    if (typeof window !== 'undefined') {
      const ideaIdRaw = window.sessionStorage.getItem('ideaPreview:ideaId');
      if (ideaIdRaw) router.push(`/IdeaListDetail?id=${ideaIdRaw}`);
    }
  }, [createdIdeaId, resolvedMode, router]);

  const team = React.useMemo(
    () => ({
      ...DEFAULT_TEAM_COUNTS,
      ...(resolvedForm?.team ?? {}),
    }),
    [resolvedForm?.team]
  );
  const preferredRoleKey = React.useMemo<TeamRole | null>(() => {
    const preferred = resolvedForm?.preferredPart;
    if (!preferred) return null;
    const matched = TEAM_ROLES.find(role => role.label === preferred || role.key === preferred);
    return matched ? matched.key : null;
  }, [resolvedForm?.preferredPart]);
  const displayTotals = React.useMemo(() => {
    const totals: Record<TeamRole, number> = { ...DEFAULT_TEAM_COUNTS, ...team };
    if (preferredRoleKey) {
      totals[preferredRoleKey] = Math.max(totals[preferredRoleKey] ?? 0, 1);
    }
    return totals;
  }, [preferredRoleKey, team]);
  const displayCurrents = React.useMemo(() => {
    const currents: Record<TeamRole, number> = { ...DEFAULT_TEAM_COUNTS };
    if (preferredRoleKey) {
      currents[preferredRoleKey] = 1;
    }
    return currents;
  }, [preferredRoleKey]);

  const safeDescription = React.useMemo(
    () => sanitizeDescription(resolvedForm?.description ?? ''),
    [resolvedForm?.description]
  );

  const roleMap = React.useMemo(
    () =>
      TEAM_ROLES.reduce(
        (acc, role) => {
          acc[role.key] = role;
          return acc;
        },
        {} as Record<TeamRole, (typeof TEAM_ROLES)[number]>
      ),
    []
  );

  const PreviewBadgeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5ZM12 16.5C9.52 16.5 7.5 14.48 7.5 12C7.5 9.52 9.52 7.5 12 7.5C14.48 7.5 16.5 9.52 16.5 12C16.5 14.48 14.48 16.5 12 16.5ZM12 9.5C10.62 9.5 9.5 10.62 9.5 12C9.5 13.38 10.62 14.5 12 14.5C13.38 14.5 14.5 13.38 14.5 12C14.5 10.62 13.38 9.5 12 9.5Z"
        fill="#EA4335"
      />
    </svg>
  );
  return (
    <PageContainer $isModalOpen={modalState !== 'idle'}>
      <PreviewCanvas>
        <TitleSection>
          <TitleHeader>
            <TitleText>{resolvedForm?.title || '아이디어 제목'}</TitleText>

            <PreviewBadge>
              <PreviewBadgeIcon />
              미리보기 화면입니다.
            </PreviewBadge>
          </TitleHeader>
          <TitleInfoRow>
            <IntroText>{resolvedForm?.intro || '아이디어 한줄소개'}</IntroText>
            <WriterContainer>
              <WriterContent>
                {writerSchool && writerPartLabel
                  ? `${writerSchool} ${writerPartLabel}`
                  : writerSchool
                    ? writerSchool
                    : writerPartLabel
                      ? writerPartLabel
                      : ' '}
              </WriterContent>
              <WriterName>{writerName || ' '}</WriterName>
            </WriterContainer>
          </TitleInfoRow>
        </TitleSection>

        <SubjectRow>
          <SubjectLabel>아이디어 주제</SubjectLabel>
          <SubjectValue>
            {resolvedForm?.topic || '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'}
          </SubjectValue>
        </SubjectRow>

        <MembersSection>
          <SectionTitle>모집 인원</SectionTitle>
          <MemberCard>
            {TEAM_GROUPS.map(group => (
              <MemberRow key={group.join('-')}>
                {group.map(roleKey => {
                  const role = roleMap[roleKey];
                  const total = displayTotals[role.key] ?? 0;
                  const current = displayCurrents[role.key] ?? 0;
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

        <ActionRow>
          <SecondaryButton type="button" onClick={handleBack}>
            작성화면으로 돌아가기
          </SecondaryButton>
          <PrimaryButton type="button" onClick={() => setModalState('confirm')}>
            {actionText}
          </PrimaryButton>
        </ActionRow>
      </PreviewCanvas>

      {modalState !== 'idle' && typeof window !== 'undefined'
        ? ReactDOM.createPortal(
            <ModalOverlay>
              <ModalCard>
                {modalState === 'confirm' ? (
                  <>
                    <ModalTitle>{confirmTitle}</ModalTitle>
                    <ModalActions>
                      <ModalButton type="button" onClick={handleConfirmSubmit}>
                        예
                      </ModalButton>
                      <ModalButton
                        type="button"
                        $variant="secondary"
                        onClick={() => setModalState('idle')}
                      >
                        아니오
                      </ModalButton>
                    </ModalActions>
                  </>
                ) : (
                  <>
                    <ModalTitle>{successTitle}</ModalTitle>
                    <ModalActions>
                      <ModalButton type="button" onClick={handleModalDone}>
                        확인
                      </ModalButton>
                    </ModalActions>
                  </>
                )}
              </ModalCard>
            </ModalOverlay>,
            document.body
          )
        : null}
    </PageContainer>
  );
}
