import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const MOBILE_BREAKPOINT = '900px';
const SMALL_BREAKPOINT = '600px';
const COMPACT_BREAKPOINT = '480px';

const Container = styled.div`
  padding: 3.5rem 2.5rem 4rem;
  font-family: 'Pretendard', sans-serif;
  color: #1f1f1f;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: 3rem 2rem 3.5rem;
  }

  @media (max-width: ${COMPACT_BREAKPOINT}) {
    padding: 2.5rem 1.5rem 3rem;
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1.8rem;
  border-bottom: 1px solid #dcdcdc;
`;

const BrandTitle = styled.h1`
  font-size: 2.125rem;
  font-weight: 600;
  letter-spacing: 0.04em;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.9rem;
  }

  @media (max-width: ${COMPACT_BREAKPOINT}) {
    font-size: 1.75rem;
  }
`;

const PageTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 500;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 1.45rem;
  }

  @media (max-width: ${COMPACT_BREAKPOINT}) {
    font-size: 1.3rem;
  }
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 0;
  font-size: 0.95rem;
  border-bottom: 1px solid #dcdcdc;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
    font-size: 0.9rem;
  }
`;

const IdeaName = styled.span`
  font-weight: 600;
`;

const Mentor = styled.span`
  color: #5d5d5d;
`;

const Section = styled.section`
  margin-top: 2.5rem;
`;

const SectionLabel = styled.h3`
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const SectionContent = styled.div`
  font-size: 0.95rem;
  line-height: 1.8;
  color: #2f2f2f;
  white-space: pre-wrap;
`;

const SectionContentRich = styled(SectionContent)`
  white-space: normal;
  * {
    font-family: 'Pretendard', sans-serif;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 0.75rem;
  }
`;

const TeamList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.95rem;
  color: #2f2f2f;
`;

const Buttons = styled.div`
  margin-top: 3.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  min-width: 200px;
  padding: 0.9rem 2.2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border: ${({ $variant }) => ($variant === 'primary' ? 'none' : '1px solid #aaa')};
  background: ${({ $variant }) => ($variant === 'primary' ? '#7177ff' : '#d9d9d9')};
  color: ${({ $variant }) => ($variant === 'primary' ? '#fff' : '#1f1f1f')};
  transition: 0.2s ease;
  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${SMALL_BREAKPOINT}) {
    width: 100%;
    min-width: 0;
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #555;
  line-height: 1.6;
`;
import IdeaLayout from '../IdeaLayout/IdeaLayout';
import { createEmptyTeamCounts, useIdeaStore } from '../store/IdeaStore';

export default function IdeaCheckPage() {
  const router = useRouter();
  const { id } = router.query;

  const numericId = useMemo(() => {
    if (Array.isArray(id)) return Number(id[0]);
    return id ? Number(id) : NaN;
  }, [id]);

  const idea = useIdeaStore((state: { getIdeaById: (arg0: number) => any }) =>
    Number.isFinite(numericId) ? state.getIdeaById(numericId as number) : undefined
  );

  if (!idea) {
    return (
      <IdeaLayout>
        <EmptyState>
          확인하려는 아이디어를 찾을 수 없어요.
          <br />
          목록에서 다시 시도해 주세요.
        </EmptyState>
      </IdeaLayout>
    );
  }

  const team = idea.team ?? createEmptyTeamCounts();
  const filledTeam = idea.filledTeam ?? createEmptyTeamCounts();

  return (
    <IdeaLayout>
      <Container>
        <Header>
          <BrandTitle>Team Building</BrandTitle>
          <PageTitle>{idea.title}</PageTitle>
          <InfoBar>
            <IdeaName>{idea.intro || idea.title}</IdeaName>
            <Mentor>성공회대 디자인 주현지</Mentor>
          </InfoBar>
        </Header>

        <Section>
          <SectionLabel>지원 현황</SectionLabel>
          <TeamList>
            <li>
              기획: {filledTeam.planning}명 / {team.planning}명
            </li>
            <li>
              디자인: {filledTeam.design}명 / {team.design}명
            </li>
            <li>
              프론트엔드(웹): {filledTeam.frontendWeb}명 / {team.frontendWeb}명
            </li>
            <li>
              프론트엔드(모바일): {filledTeam.frontendMobile}명 / {team.frontendMobile}명
            </li>
            <li>
              백엔드: {filledTeam.backend}명 / {team.backend}명
            </li>
          </TeamList>
        </Section>

        <Section>
          <SectionLabel>주제</SectionLabel>
          <SectionContent>{idea.topic}</SectionContent>
        </Section>

        <Section>
          <SectionLabel>아이디어 제목</SectionLabel>
          <SectionContent>{idea.title}</SectionContent>
        </Section>

        <Section>
          <SectionLabel>아이디어 한 줄 소개</SectionLabel>
          <SectionContent>{idea.intro}</SectionContent>
        </Section>

        <Section>
          <SectionLabel>아이디어 설명</SectionLabel>
          <SectionContentRich
            dangerouslySetInnerHTML={{
              __html: idea.description || '<p>아이디어를 자유롭게 설명해 주세요!</p>',
            }}
          />
        </Section>

        <Buttons>
          <Button $variant="secondary" type="button" onClick={() => router.push('/welcome')}>
            아이디어 저장
          </Button>
          <Button
            $variant="primary"
            type="button"
            onClick={() => router.push({ pathname: '/IdeaApply', query: { id: idea.id } })}
          >
            지원하기
          </Button>
        </Buttons>
      </Container>
    </IdeaLayout>
  );
}
