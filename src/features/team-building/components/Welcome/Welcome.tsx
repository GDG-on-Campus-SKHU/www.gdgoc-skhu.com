import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';

import Button from '../Button';
import SelectBoxBasic from '../SelectBoxBasic';
import { resolveTotalMembers, useIdeaStore } from '../store/IdeaStore';
import Toggle from '../Toggle';

const MOBILE_BREAKPOINT = '900px';
const SMALL_BREAKPOINT = '600px';
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
`;

const Wrapper = styled.div`
  width: min(1080px, 100%);
  padding: 24px 0 120px;
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.section`
  padding: 100px 0 20px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 20px 0;
  }
`;

const Title = styled.h1`
  font-size: 50px;
  font-weight: 700;
  line-height: 160%;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 44px;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    font-size: 36px;
  }
`;

const Subtitle = styled.h2`
  font-size: 36px;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GrowthonLogo = styled(Image)`
  width: 36px;
  height: 36px;
`;

const StatusBar = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusLabel = styled.span`
  font-size: 24px;
  font-weight: 700;
`;

const StatusCount = styled.span`
  font-size: 18px;
  color: #979ca5;
`;

const RegisterButtonWrapper = styled.div`
  width: 200px;
  height: 48px;

  button {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 100%;
  }
`;

const FilterRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 30px;
  gap: 24px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const TopicSelectBox = styled(SelectBoxBasic)`
  width: 380px;
  max-width: 44%;

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
  }

  svg {
    display: none;
  }
`;

const StateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
`;

const StateLabel = styled.span`
  font-size: 18px;
`;

const StateToggle = styled.div<{ $active: boolean }>`
  position: relative;
  width: 72px;
  height: 36px;
  border-radius: 18px;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#4285F4' : '#C3C6CB')};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $active }) => ($active ? '39px' : '3px')};
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #f9f9fa;
    transition: left 0.2s ease;
  }

  & > div {
    opacity: 0;
  }
`;

const EmptyCard = styled.div`
  height: 400px;
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  background: #ededef;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyMessage = styled.p`
  font-size: 24px;
  text-align: center;
`;

export default function Welcome() {
  const { ideas } = useIdeaStore();
  const [excludeClosed, setExcludeClosed] = useState(false);
  const [topicFilter, setTopicFilter] = useState('');

  const displayedIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const totalMembers = resolveTotalMembers(idea.totalMembers, idea.team);
      const status =
        idea.currentMembers >= totalMembers && totalMembers > 0 ? '모집 마감' : '모집 중';

      if (excludeClosed && status === '모집 마감') return false;
      if (topicFilter && topicFilter !== '전체' && idea.topic !== topicFilter) return false;
      return true;
    });
  }, [ideas, excludeClosed, topicFilter]);

  return (
    <Container>
      <Wrapper>
        <TitleSection>
          <Title>Team Building</Title>
          <Subtitle>
            그로우톤
            <GrowthonLogo src="/GrowthonScheduleIcon.svg" alt="그로우톤 로고" width={36} height={36} />
          </Subtitle>
        </TitleSection>

        <StatusBar>
          <StatusLeft>
            <StatusLabel>아이디어 현황</StatusLabel>
            <StatusCount>{ideas.length}개</StatusCount>
          </StatusLeft>

          <RegisterButtonWrapper>
            <Link href="/IdeaForm">
              <Button title="아이디어 등록하기" disabled />
            </Link>
          </RegisterButtonWrapper>
        </StatusBar>

        <FilterRow>
          <TopicSelectBox
            options={TOPIC_FILTER_OPTIONS}
            placeholder={topicFilter || TOPIC_FILTER_PLACEHOLDER}
            onChange={selected => setTopicFilter(selected[0] ?? '')}
          />

          <StateRow>
            <StateLabel>모집 중인 공고만 보기</StateLabel>
            <StateToggle $active={excludeClosed} onClick={() => setExcludeClosed(v => !v)}>
              <Toggle checked={excludeClosed} />
            </StateToggle>
          </StateRow>
        </FilterRow>

        {displayedIdeas.length === 0 && (
          <EmptyCard>
            <EmptyMessage>
              👋 팀빌딩이 곧 시작돼요!
              <br />
              등록할 아이디어를 미리 생각해두세요.
            </EmptyMessage>
          </EmptyCard>
        )}
      </Wrapper>
    </Container>
  );
}
