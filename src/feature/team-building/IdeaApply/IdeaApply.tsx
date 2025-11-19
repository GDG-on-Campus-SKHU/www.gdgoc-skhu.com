import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Button from '../../../features/team-building/components/Button';
import Radio from '../../../features/team-building/components/Radio';

const MOBILE_BREAKPOINT = '900px';

const PageContainer = styled.div`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 120px;
  width: 100%;
  font-family: 'Pretendard', sans-serif;
  color: #040405;
`;
const ApplyCanvas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 1080px;
`;

const GrowTitle = styled.div`
  display: flex;
  width: 1080px;
  padding-top: 100px;
  align-items: flex-end;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 2.1rem;
  }
`;

const HeroInfoRow = styled.div`
  display: flex;
  width: 1080px;
  padding: 40px 0;
  flex-direction: column;
  align-items: flex-start;
  border-bottom: 1px solid var(--grayscale-400, #c3c6cb);
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const IdeaInfo = styled.div`
  display: flex;
  width: 1080px;
  padding: 40px 0;
  flex-direction: column;
  align-items: flex-start;
`;

const IdeaTitle = styled.h2`
  margin: 0;
  font-size: 1.55rem;
  font-weight: 600;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.35rem;
  }
`;

const IdeaSubtitle = styled.p`
  color: var(--grayscale-500, #979ca5);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const MentorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
`;
const MentorPart = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 300;
`;
const Mentor = styled.p`
  margin: 0;
  font-size: 0.98rem;
  color: #030213;
  font-weight: 600;
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  align-self: stretch;
  /* body/b2/b2-bold */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 32px */
`;

const SectionHint = styled.span`
  color: var(--grayscale-700, #626873);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const DesiredRankingAndPartSection = styled(FormSection)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;

const RadioList = styled.div`
  display: flex;
  width: 166px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;

const BackLink = styled.a`
  margin-top: 1.5rem;
  display: inline-flex;
  border: none;
  background: transparent;
  color: #7f8cff;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
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
  position: absolute;
  width: 500px;
  height: 240px;
  left: calc(50% - 500px / 2);
  top: calc(50% - 240px / 2 + 0.5px);
  padding: 40px 20px 20px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  border-radius: 12px;
  background: #ffffff;
`;
const ModalTitle = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

const ModalTitleComplete = styled.h3`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  margin: 0 0 20px;

  /* header/h2-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 57.6px */
`;

const ModalMessage = styled.p`
  color: var(--grayscale-600, #7e8590);
  text-align: center;

  /* body/b2/b2 */
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 32px */
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
`;
const ModalButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 16px;
  width: 100%;
`;
const ModalOKCard = styled.div`
  display: flex;
  width: 500px;
  height: 188px;
  padding: 40px 20px 0 20px;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
`;
const ModalButton = styled(Button)`
  display: flex;
  height: 50px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  margin-top: 20px;
  background: var(--primary-600-main, #4285f4);
`;
import { Idea, resolveTotalMembers, useIdeaStore } from '../store/IdeaStore';

const PART_OPTIONS: Array<{ key: keyof Idea['team']; label: string }> = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드(웹)' },
  { key: 'frontendMobile', label: '프론트엔드(모바일)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
];

const PRIORITY_OPTIONS = ['1지망', '2지망', '3지망'] as const;

type PriorityOption = (typeof PRIORITY_OPTIONS)[number];
type IdeaApplyPageProps = {
  ideaId?: number | null;
};

const ZERO_TEAM: Idea['team'] = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};
const PRIORITY_STORAGE_KEY = 'team-building:priority-selection';

const createEmptyPriorityState = (): Record<PriorityOption, number | null> => ({
  '1지망': null,
  '2지망': null,
  '3지망': null,
});

const resolveInitialPart = (idea?: Idea) => {
  const team = idea?.team ?? ZERO_TEAM;
  const filled = idea?.filledTeam ?? ZERO_TEAM;
  const target = PART_OPTIONS.find(option => {
    const limit = team[option.key] ?? 0;
    const current = filled[option.key] ?? 0;
    if (limit <= 0) return false;
    return current < limit;
  });
  return target ? target.key : 'planning';
};

export default function IdeaApplyPage({ ideaId }: IdeaApplyPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const resolvedIdeaId = useMemo(() => {
    if (typeof ideaId === 'number' || ideaId === null) return ideaId;
    if (Array.isArray(id)) {
      const parsed = Number(id[0]);
      return Number.isFinite(parsed) ? parsed : null;
    }
    if (typeof id === 'string') {
      const parsed = Number(id);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }, [id, ideaId]);

  const addApplicant = useIdeaStore(state => state.addApplicant);

  const idea = useIdeaStore(state =>
    resolvedIdeaId !== null ? state.getIdeaById(resolvedIdeaId) : undefined
  );
  const [priority, setPriority] = useState<PriorityOption>('1지망');
  const [priorityLocks, setPriorityLocks] = useState<Record<PriorityOption, number | null>>(() =>
    createEmptyPriorityState()
  );
  const [part, setPart] = useState<keyof Idea['team']>(() => resolveInitialPart(idea));
  const allPrioritiesTaken = useMemo(
    () => PRIORITY_OPTIONS.every(option => priorityLocks[option] !== null),
    [priorityLocks]
  );
  const [modalState, setModalState] = useState<'closed' | 'confirm' | 'success'>('closed');

  const partOptions = useMemo(() => {
    if (!idea) {
      return PART_OPTIONS.map(option => ({ ...option, disabled: false }));
    }
    const team = idea.team ?? ZERO_TEAM;
    const filled = idea.filledTeam ?? ZERO_TEAM;
    const hasPositive = Object.values(team).some(count => count > 0);
    return PART_OPTIONS.map(option => {
      const count = team[option.key] ?? 0;
      const taken = filled[option.key] ?? 0;
      return {
        ...option,
        disabled: hasPositive ? count <= 0 || taken >= count : false,
      };
    });
  }, [idea]);

  const selectedPartLabel = useMemo(() => {
    const match = partOptions.find(option => option.key === part);
    return match?.label ?? '선택한 파트';
  }, [part, partOptions]);

  const priorityOptions = useMemo(
    () =>
      PRIORITY_OPTIONS.map(option => {
        if (!idea) {
          return { value: option, disabled: false };
        }
        const assignedId = priorityLocks[option];
        const disabled = assignedId !== null;
        return { value: option, disabled };
      }),
    [idea, priorityLocks]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PRIORITY_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Record<PriorityOption, unknown>>;
      const resolved = createEmptyPriorityState();
      PRIORITY_OPTIONS.forEach(option => {
        const value = parsed?.[option];
        if (typeof value === 'number' && Number.isFinite(value)) {
          resolved[option] = value;
        } else {
          resolved[option] = null;
        }
      });
      setPriorityLocks(resolved);
    } catch {
      // ignore malformed storage data
      setPriorityLocks(createEmptyPriorityState());
    }
  }, []);

  useEffect(() => {
    if (!idea) return;
    setPriority(prev => {
      if (priorityLocks[prev] === null || priorityLocks[prev] === idea.id) {
        return prev;
      }
      const assignedToCurrent = PRIORITY_OPTIONS.find(option => priorityLocks[option] === idea.id);
      if (assignedToCurrent) {
        return assignedToCurrent;
      }
      const fallback = PRIORITY_OPTIONS.find(option => priorityLocks[option] === null);
      return fallback ?? prev;
    });
  }, [idea, priorityLocks]);

  useEffect(() => {
    const fallback = partOptions.find(option => !option.disabled)?.key ?? 'planning';
    setPart(prev => {
      const stillEnabled = partOptions.some(option => option.key === prev && !option.disabled);
      return stillEnabled ? prev : fallback;
    });
  }, [partOptions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!idea) {
      alert('아이디어 정보를 불러오지 못했어요. 다시 시도해주세요.');
      return;
    }
    const totalLimit = resolveTotalMembers(idea.totalMembers, idea.team);
    if (idea.currentMembers >= totalLimit) {
      alert('이미 모집이 완료된 아이디어입니다.');
      return;
    }
    if (allPrioritiesTaken) {
      alert('1지망, 2지망, 3지망을 모두 사용하셨습니다. 기존 지원을 취소한 뒤 다시 시도해 주세요.');
      return;
    }
    if (priorityLocks[priority] !== null) {
      alert('이미 해당 지망으로 지원하셨어요.');
      return;
    }
    const selected = partOptions.find(option => option.key === part);
    if (selected?.disabled) {
      alert('이미 모집이 완료된 파트입니다.');
      return;
    }
    const accepted = addApplicant(idea.id, part);
    if (!accepted) {
      alert('이미 모집이 완료된 파트입니다.');
      return;
    }
    if (typeof window !== 'undefined') {
      const nextLocks = { ...priorityLocks, [priority]: idea.id };
      window.localStorage.setItem(PRIORITY_STORAGE_KEY, JSON.stringify(nextLocks));
      setPriorityLocks(nextLocks);
    }
    setModalState('confirm');
  };

  if (!idea) {
    return (
      <>
        <ApplyCanvas>
          <EmptyState>
            지원하려는 아이디어를 찾을 수 없어요.
            <br />
            목록에서 다시 선택해 주세요.
            <Link href="/feature/team-building/WelcomeOpen" passHref>
              <BackLink>목록으로 돌아가기</BackLink>
            </Link>
          </EmptyState>
        </ApplyCanvas>
      </>
    );
  }

  return (
    <>
      <PageContainer>
        <ApplyCanvas>
          <Hero>
            <GrowTitle>
              <HeroTitle>그로우톤 1차 지원</HeroTitle>
            </GrowTitle>
            <HeroInfoRow>
              <IdeaInfo>
                <TitleContainer>
                  {' '}
                  <IdeaTitle>{idea.title}</IdeaTitle>
                  <MentorContainer>
                    <MentorPart>
                      성공회대 디자인 <Mentor as="span">주현지</Mentor>
                    </MentorPart>
                  </MentorContainer>
                </TitleContainer>
                <IdeaSubtitle>{idea.intro || '아이디어 한줄소개'}</IdeaSubtitle>
              </IdeaInfo>
            </HeroInfoRow>
          </Hero>

          <form onSubmit={handleSubmit}>
            <DesiredRankingAndPartSection>
              <ContentContainer>
                <SectionTitle>희망 순위</SectionTitle>
                <SectionHint>하나의 순위만 선택할 수 있습니다.</SectionHint>
              </ContentContainer>
              <RadioList>
                {priorityOptions.map(option => (
                  <Radio
                    key={option.value}
                    name="priority"
                    label={option.value}
                    checked={priority === option.value}
                    disabled={option.disabled}
                    onChange={checked => {
                      if (checked && !option.disabled) setPriority(option.value);
                    }}
                  />
                ))}
              </RadioList>
            </DesiredRankingAndPartSection>

            <DesiredRankingAndPartSection>
              <ContentContainer>
                <SectionTitle>희망 파트</SectionTitle>
                <SectionHint>하나의 파트만 선택할 수 있습니다.</SectionHint>
              </ContentContainer>
              <RadioList>
                {partOptions.map(option => (
                  <Radio
                    key={option.key}
                    name="part"
                    label={option.label}
                    checked={part === option.key}
                    disabled={option.disabled}
                    onChange={checked => {
                      if (checked && !option.disabled) setPart(option.key);
                    }}
                  />
                ))}
              </RadioList>
            </DesiredRankingAndPartSection>
            <ButtonContainer>
              <Button
                type="submit"
                disabled={allPrioritiesTaken}
                css={{
                  display: 'flex',
                  width: '300px',
                  height: '50px',
                  padding: '10px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                아이디어 지원하기
              </Button>
            </ButtonContainer>
          </form>
          {modalState !== 'closed' && (
            <ModalOverlay>
              {modalState === 'confirm' && (
                <ModalCard>
                  <ModalInfo>
                    <ModalTitle>{idea.title}</ModalTitle>
                    <ModalMessage>{`${priority}, ${selectedPartLabel}에 지원하시겠습니까?`}</ModalMessage>
                    <ModalActions>
                      <ModalButtonContainer>
                        <ModalButton
                          title="지원하기"
                          disabled={false}
                          onClick={() => setModalState('success')}
                          css={{ width: '100%' }}
                        />
                        <ModalButton
                          title="취소"
                          variant="secondary"
                          disabled={false}
                          onClick={() => setModalState('closed')}
                          css={{ width: '100%' }}
                        />
                      </ModalButtonContainer>
                    </ModalActions>
                  </ModalInfo>
                </ModalCard>
              )}
              {modalState === 'success' && (
                <ModalCard style={{ height: '200px', paddingTop: 0 }}>
                  <ModalOKCard>
                    <ModalTitleComplete>지원이 완료되었습니다.</ModalTitleComplete>
                    <ModalActions>
                      <ModalButton
                        title="확인"
                        disabled={false}
                        onClick={() => {
                          setModalState('closed');
                          router.push('/feature/team-building/WelcomeOpen');
                        }}
                        css={{ width: '100%' }}
                      />
                    </ModalActions>
                  </ModalOKCard>
                </ModalCard>
              )}
            </ModalOverlay>
          )}
        </ApplyCanvas>
      </PageContainer>
    </>
  );
}
