import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import Button from '../../../features/team-building/components/Button';
import SelectBoxBasic from '../../../features/team-building/components/SelectBoxBasic';
import Toggle from '../../../features/team-building/components/Toggle';
import { Idea, resolveTotalMembers, useIdeaStore } from '../store/IdeaStore';

const MOBILE_BREAKPOINT = '900px';
const SMALL_BREAKPOINT = '600px';
const FEATURE_NAV_LINKS = ['TeamBuild', 'Gallery', 'Community', 'Mypage', 'Logout'] as const;
const TOPIC_FILTER_PLACEHOLDER = '주제를 선택해주세요.';
const TOPIC_FILTER_OPTIONS = ['전체', '디자인', '프론트엔드', '백엔드'];

const Container = styled.div`
  width: 100%;
  min-height: 1024px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 0 1.5rem;
  font-family: 'Pretendard', sans-serif;
  color: #040405;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    padding: 0 1rem;
  }
`;

const Wrapper = styled.div`
  width: min(1080px, 100%);
  padding: 24px 0 120px;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding-bottom: 80px;
  }
`;

const FeatureNavBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

const FeatureBrand = styled.span`
  font-size: 16px;
  font-weight: 700;
  line-height: 160%;
  color: #000000;
`;

const FeatureNavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  line-height: 160%;
  color: #000000;
  flex-wrap: wrap;
`;

const FeatureNavItem = styled.span<{ $bold?: boolean }>`
  display: flex;
  align-items: center;
  font-weight: ${({ $bold }) => ($bold ? 700 : 500)};
  color: inherit;
`;

const TitleSection = styled.section`
  display: flex;
  width: 1080px;
  padding: 100px 0 20px 0;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 20px 0 20px;
    gap: 24px;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    padding: 16px 0 20px;
  }
`;

const Title = styled.h1`
  dcolor: var(--grayscale-1000, #040405);

  /* header/h1-bold */
  font-family: Pretendard;
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 80px */
  align-self: stretch;
  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 44px;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    font-size: 36px;
  }
`;
const FilterContainer = styled.div`
  display: flex;
  width: 1080px;
  padding: 10px 0;
  justify-content: space-between;
  align-items: center;
`;
const ProjectTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 58px;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-wrap: wrap;
  }
`;

const Subtitle = styled.h2`
  color: var(--grayscale-1000, #040405);

  font-family: Pretendard;
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 30px;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    font-size: 26px;
  }
`;

const StatusBar = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  gap: clamp(1rem, 35vw, 717px);
  width: 100%;
  min-height: 70px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    gap: 0.75rem;
  }
`;

const StatusLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b1/b1-bold */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%; /* 38.4px */
`;

const StatusCount = styled.span`
  color: var(--grayscale-500, #979ca5);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%; /* 28.8px */
`;

const StatusActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RegisterButtonLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
`;

const FilterRow = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0 10px;
  gap: 30px;
  width: 100%;
  min-height: 64px;
  margin-top: 6px;
  margin-bottom: 30px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-bottom: 32px;
  }
`;

const TopicSelectBox = styled(SelectBoxBasic)`
  display: flex;
  width: 496px;
  max-width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
  }

  & > div:first-of-type {
    position: relative;
    padding-right: 48px;
  }

  & > div:first-of-type::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background-image: url('/dropdownarrow.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    pointer-events: none;
  }

  svg {
    display: none;
  }
`;

const StateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const StateLabel = styled.span`
  color: var(--grayscale-1000, #040405);

  /* body/b3/b3 */
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 28.8px */
`;

const StateToggle = styled.div<{ $active: boolean }>`
  position: relative;
  border-radius: 18px;
  display: flex;
  width: 72px;
  height: 36px;
  padding: ${({ $active }) => ($active ? '3px 3px 3px 39px' : '3px 39px 3px 3px')};
  justify-content: ${({ $active }) => ($active ? 'flex-end' : 'flex-start')};
  align-items: center;
  cursor: pointer;
  background: ${({ $active }) =>
    $active ? 'var(--primary-600-main, #4285F4)' : 'var(--grayscale-400, #C3C6CB)'};
  transition:
    padding 0.2s ease,
    background 0.2s ease,
    justify-content 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 30px;
    height: 30px;
    border-radius: 18px;
    background: #f9f9fa;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    transform: ${({ $active }) => ($active ? 'translateX(36px)' : 'translateX(0)')};
    transition: transform 0.2s ease;
  }

  & > div {
    opacity: 0;
  }
`;

const EmptyCard = styled.div`
  display: flex;
  width: 1080px;
  height: 400px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: var(--grayscale-200, #ededef);
`;

const EmptyMessage = styled.p`
  color: var(--grayscale-900, #25282c);
  text-align: center;

  & > p {
    font-family: Pretendard;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%; /* 38.4px */
  }
`;

const IdeaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 40px;
`;

const IdeaCard = styled(Link)`
  display: block;
  padding: 1.75rem 1.9rem;
  border-radius: 12px;
  border: 1px solid #c3c6cb;
  background: #ffffff;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 1.5rem 1.6rem;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    padding: 1.3rem 1.25rem;
  }
`;

const IdeaCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.85rem;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }
`;

const IdeaCardTitle = styled.h3`
  font-size: 1.12rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.05rem;
  }
`;

const StatusTag = styled.span<{ $variant: 'active' | 'closed' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${({ $variant }) => ($variant === 'active' ? '#c7d2fe' : '#d4d4d4')};
  background: ${({ $variant }) => ($variant === 'active' ? '#eef2ff' : '#f5f5f5')};
  color: ${({ $variant }) => ($variant === 'active' ? '#1d2cd8' : '#6b7280')};
`;

const StatusDot = styled.span<{ $variant: 'active' | 'closed' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $variant }) => ($variant === 'active' ? '#4f46e5' : '#9ca3af')};
`;

const IdeaCardIntro = styled.p`
  font-size: 0.95rem;
  color: #4a4a4a;
  margin: 0 0 1.1rem;
`;

const IdeaCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
  font-size: 0.85rem;
  color: #5a5a5a;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-direction: column;
    gap: 0.6rem;
  }
`;

const GrowthonLogo = styled(Image)`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
`;
const MetaItem = styled.span`
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  strong {
    font-weight: 600;
    color: #2f2f2f;
  }
`;

export default function Welcome() {
  const { ideas } = useIdeaStore();
  const addIdea = useIdeaStore(state => state.addIdea);
  const getIdeaById = useIdeaStore(state => state.getIdeaById);
  const [excludeClosed, setExcludeClosed] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>('');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('completedIdea');
      if (!stored) return;
      const parsed: Idea = JSON.parse(stored);
      if (!parsed?.title) return;
      if (parsed.id && getIdeaById(parsed.id)) return;
      addIdea({
        topic: parsed.topic,
        title: parsed.title,
        intro: parsed.intro,
        description: parsed.description,
        preferredPart: parsed.preferredPart,
        team: parsed.team,
        filledTeam: parsed.filledTeam,
        currentMembers: parsed.currentMembers,
        totalMembers: parsed.totalMembers,
        status: parsed.status,
      });
      window.sessionStorage.removeItem('completedIdea');
    } catch (error) {
      console.error('Failed to restore idea from sessionStorage', error);
    }
  }, [addIdea, getIdeaById]);

  const displayedIdeas = useMemo(() => {
    const isAllTopic = !topicFilter || topicFilter === '전체';
    return ideas.filter(idea => {
      const totalMembers = resolveTotalMembers(idea.totalMembers, idea.team);
      const status =
        idea.status ??
        (idea.currentMembers >= totalMembers && totalMembers > 0 ? '모집 마감' : '모집 중');
      if (excludeClosed && status === '모집 마감') {
        return false;
      }
      if (!isAllTopic) {
        const ideaTopic = idea.topic ?? '';
        return ideaTopic === topicFilter;
      }
      return true;
    });
  }, [ideas, excludeClosed, topicFilter]);

  return (
    <Container>
      <Wrapper>
        <FeatureNavBar>
          <FeatureBrand>Google Developer Groups on Campus SKHU</FeatureBrand>
          <FeatureNavLinks>
            {FEATURE_NAV_LINKS.map(link => (
              <FeatureNavItem
                key={link}
                $bold={link === 'TeamBuild' || link === 'Gallery' || link === 'Community'}
              >
                {link}
              </FeatureNavItem>
            ))}
          </FeatureNavLinks>
        </FeatureNavBar>

        <TitleSection>
          <Title>Team Building</Title>
          <ProjectTitleRow>
            <Subtitle>
              그로우톤
              <GrowthonLogo
                src="/GrowthonLogo.svg"
                alt="그로우톤 로고"
                width={36}
                height={36}
                priority
              />
            </Subtitle>
          </ProjectTitleRow>
        </TitleSection>

        <StatusBar>
          <StatusText>
            <StatusLabel>아이디어 현황</StatusLabel>
            <StatusCount>{ideas.length}개</StatusCount>
          </StatusText>
          <StatusActions>
            <RegisterButtonLink href="/feature/team-building/IdeaForm">
              <Button
                title="아이디어 등록하기"
                disabled={true}
                className="IdeaButton"
                css={{
                  borderRadius: '8px',
                  backgroundColor: 'var(--grayscale-300, #E0E2E5)',
                  display: 'flex',
                  width: '200px',
                  height: '50px',
                  padding: '10px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  color: 'var(--grayscale-500, #E0E2E5)',
                }}
              />
            </RegisterButtonLink>
          </StatusActions>
        </StatusBar>

        <FilterRow>
          <FilterContainer>
            <TopicSelectBox
              options={TOPIC_FILTER_OPTIONS}
              placeholder={topicFilter || TOPIC_FILTER_PLACEHOLDER}
              multiple={false}
              searchable={false}
              onChange={selected => {
                const newTopic = selected[0] ?? '';
                setTopicFilter(newTopic);
              }}
            />

            <StateRow>
              <StateLabel>모집 중인 공고만 보기</StateLabel>
              <StateToggle
                $active={excludeClosed}
                role="switch"
                tabIndex={0}
                aria-checked={excludeClosed}
                aria-label="모집 상태"
                onClick={() => setExcludeClosed(prev => !prev)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setExcludeClosed(prev => !prev);
                  }
                }}
              >
                <Toggle checked={excludeClosed} />
              </StateToggle>
            </StateRow>
          </FilterContainer>
        </FilterRow>

        {displayedIdeas.length === 0 ? (
          <EmptyCard>
            <EmptyMessage>
              <p>
                👋 팀빌딩이 곧 시작돼요!
                <br /> 등록할 아이디어를 미리 생각해두면, 팀빌딩이 열릴 때 바로 등록할 수 있습니다.
              </p>
            </EmptyMessage>
          </EmptyCard>
        ) : (
          <IdeaList>
            {displayedIdeas.map(idea => {
              const totalMembers = resolveTotalMembers(idea.totalMembers, idea.team);
              const status =
                idea.status ??
                (idea.currentMembers >= totalMembers && totalMembers > 0 ? '모집 마감' : '모집 중');
              const variant = status === '모집 중' ? 'active' : 'closed';

              return (
                <IdeaCard
                  key={idea.id}
                  href={{ pathname: '/feature/team-building/IdeaList', query: { id: idea.id } }}
                >
                  <IdeaCardHeader>
                    <IdeaCardTitle>{idea.title}</IdeaCardTitle>
                    <StatusTag $variant={variant}>
                      <StatusDot $variant={variant} />
                      {status}
                    </StatusTag>
                  </IdeaCardHeader>
                  <IdeaCardIntro>
                    {idea.intro || '아직 한 줄 소개가 작성되지 않았어요.'}
                  </IdeaCardIntro>
                  <IdeaCardMeta>
                    <MetaItem>
                      <strong>인원</strong> {idea.currentMembers} / {totalMembers}
                    </MetaItem>
                    <MetaItem>
                      <strong>희망 파트</strong> {idea.preferredPart}
                    </MetaItem>
                  </IdeaCardMeta>
                </IdeaCard>
              );
            })}
          </IdeaList>
        )}
      </Wrapper>
    </Container>
  );
}
