import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import Button from '../../../features/team-building/components/Button';
import SelectBoxBasic from '../../../features/team-building/components/SelectBoxBasic';
import Toggle from '../../../features/team-building/components/Toggle';
import IdeaItem from '../IdeaItem/IdeaItem';
import { Idea, resolveTotalMembers, useIdeaStore } from '../store/IdeaStore';

const MOBILE_BREAKPOINT = '900px';
const SMALL_BREAKPOINT = '600px';
const FEATURE_NAV_LINKS = ['TeamBuild', 'Gallery', 'Community', 'Mypage', 'Logout'] as const;
const TOPIC_FILTER_PLACEHOLDER = '주제를 선택해주세요.';
const TOPIC_FILTER_OPTIONS = ['전체', '디자인', '프론트엔드', '백엔드'];
const ITEMS_PER_PAGE = 10;
const PREFERRED_LABEL_MAP: Record<keyof Idea['team'], string> = {
  planning: '기획',
  design: '디자인',
  frontendWeb: '프론트엔드 (웹)',
  frontendMobile: '프론트엔드 (모바일)',
  backend: '백엔드',
  aiMl: 'AI/ML',
};

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

    /* Hide default arrow from SelectBoxBasic */
    & > svg {
      display: none;
    }
  }

  & > div:first-of-type::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%) rotate(0deg);
    background-image: url('/dropdownarrow.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  & > div:first-of-type.open::after {
    transform: translateY(-50%) rotate(180deg);
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
  width: 1080px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid var(--grayscale-400, #c3c6cb);
  background: #fff;
`;

const EmptyMessage = styled.p`
  color: var(--grayscale-900, #25282c);
  text-align: center;

  /* body/b1/b1 */
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%; /* 38.4px */
`;



const IdeaHeaderRow = styled.div`
display: flex;
width: 1080px;
padding: 8px 0;
align-items: center;
gap: 40px;
border-bottom: 1px solid var(--grayscale-200, #EDEDEF);
background: var(--grayscale-200, #EDEDEF);
`;
const NumberCTNR = styled.div`
width:100px;
height: 29px;
color: var(--grayscale-600, #7E8590);
text-align: center;
width: 100px;
/* body/b3/b3 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 28.8px */
`;
const IdeaContentCTNR = styled.div`
width:660px;
height: 29px;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
align-self: stretch;
overflow: hidden;
color: var(--grayscale-600, #7E8590);
text-align: center;
text-overflow: ellipsis;

/* body/b3/b3 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 28.8px */

`;
const ApplyCTNR = styled.div`
width:100px;
height: 29px;
color: var(--grayscale-600, #7E8590);
text-align: center;

/* body/b3/b3 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 28.8px */
width: 100px;
flex-shrink: 0;
`;
const RecruitStatusCTNR = styled.div`
width: 100px;
height: 29px;
color: var(--grayscale-600, #7E8590);
text-align: center;

/* body/b3/b3 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 28.8px */
width: 100px;
`;

const IdeaItemCTNR = styled.div`
width: 1080px;
height: 101px;
  display: flex;
padding: 20px 0;
align-items: center;
gap: 40px;
align-self: stretch;
border-bottom: 1px solid var(--grayscale-300, #E0E2E5);

`;
const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 28px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? '#4285f4' : '#e4e7ec')};
  background: ${({ $active }) => ($active ? '#4285f4' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#4b5563')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const GrowthonLogo = styled(Image)`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
`;

export default function Welcome() {
  const { ideas } = useIdeaStore();
  const addIdea = useIdeaStore(state => state.addIdea);
  const getIdeaById = useIdeaStore(state => state.getIdeaById);
  const [excludeClosed, setExcludeClosed] = useState(false);
  const [topicFilter, setTopicFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
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

  const resolveIdeaStatus = useCallback((idea: Idea) => {
    const effectiveTotalBase = resolveTotalMembers(idea.totalMembers, idea.team);
    const filledTotal = Object.values(idea.filledTeam ?? {}).reduce(
      (sum, count) => sum + (count ?? 0),
      0
    );
    const baseCurrent =
      typeof idea.currentMembers === 'number' && Number.isFinite(idea.currentMembers)
        ? idea.currentMembers
        : 0;
    const ownerPlusFilled = 1 + filledTotal; // 작성자 1명 + 지원 인원
    const effectiveCurrent = Math.max(baseCurrent, ownerPlusFilled);
    const safeTotal = Math.max(effectiveTotalBase, 1);
    const displayCurrent = Math.min(effectiveCurrent, safeTotal);
    const status =
      idea.status ?? (safeTotal > 0 && displayCurrent >= safeTotal ? '모집 마감' : '모집 중');
    return { status, displayCurrent, displayTotal: safeTotal };
  }, []);

  const filteredIdeas = useMemo(() => {
    const isAllTopic = !topicFilter || topicFilter === '전체';
    return ideas.filter(idea => {
      const progress = resolveIdeaStatus(idea);
      const status = progress.status;
      if (excludeClosed && status === '모집 마감') {
        return false;
      }
      if (!isAllTopic) {
        const ideaTopic = idea.topic ?? '';
        return ideaTopic === topicFilter;
      }
      return true;
    });
  }, [ideas, excludeClosed, topicFilter, resolveIdeaStatus]);

  const totalPages =
    filteredIdeas.length === 0 ? 1 : Math.ceil(filteredIdeas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIdeas = filteredIdeas.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [topicFilter, excludeClosed]);

  useEffect(() => {
    setCurrentPage(prev => Math.min(prev, totalPages));
  }, [totalPages]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <Container>
      <Wrapper>
        <TitleSection>
          <Title>Team Building</Title>
          <ProjectTitleRow>
            <Subtitle>
              그로우톤
              <GrowthonLogo
                src="/GrowthonScheduleIcon.svg"
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
            <StatusCount>{filteredIdeas.length}개</StatusCount>
          </StatusText>
          <StatusActions>
            <RegisterButtonLink href="/feature/team-building/IdeaForm">
              <Button
                title="아이디어 등록하기"
                disabled={false}
                className="IdeaButton"
                css={{
                  display: 'flex',
                  width: '200px',
                  height: '50px',
                  padding: '10px 8px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  color: 'var(--grayscale-100, #f9f9fa)',
                  fontFamily: 'Pretendard',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '160%',
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

        {filteredIdeas.length === 0 ? (
          <EmptyCard>
            <EmptyMessage>
              아직 아이디어가 없어요 😃
              <br />첫 번째 아이디어의 주인공이 되어보세요!
            </EmptyMessage>
          </EmptyCard>
        ) : (
          <>

              <IdeaHeaderRow>
                <NumberCTNR>
                순번
                </NumberCTNR>
                <IdeaContentCTNR>아이디어 내용</IdeaContentCTNR>

               <ApplyCTNR>지원 현황</ApplyCTNR>
               <RecruitStatusCTNR>모집 상태</RecruitStatusCTNR>
              </IdeaHeaderRow>
              {paginatedIdeas.map((idea, index) => (
               <IdeaItemCTNR> <IdeaItem key={idea.id} idea={idea} index={startIndex + index + 1} /></IdeaItemCTNR>
              ))}

            <Pagination aria-label="페이지 이동">
              <PageButton
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </PageButton>
              {Array.from({ length: totalPages }, (_, pageIndex) => {
                const pageNumber = pageIndex + 1;
                return (
                  <PageButton
                    key={pageNumber}
                    type="button"
                    $active={pageNumber === currentPage}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </PageButton>
                );
              })}
              <PageButton
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PageButton>
            </Pagination>
          </>
        )}
      </Wrapper>
    </Container>
  );
}
