import React from 'react';
import styled from 'styled-components';

import { createEmptyTeamCounts, Idea } from '../store/IdeaStore';
import { sanitizeDescription } from '../utils/sanitizeDescription';

const SMALL_BREAKPOINT = '600px';
const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드 (Web)' },
  { key: 'frontendMobile', label: '프론트엔드 (Mobile)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
] as const;

const TEAM_GROUPS: Array<Array<(typeof TEAM_ROLES)[number]['key']>> = [
  ['planning', 'design', 'aiMl'],
  ['frontendWeb', 'frontendMobile', 'backend'],
];

const PageContainer = styled.div`
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 0 80px;
  width: 100%;
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

const IntroText = styled.p`
  margin: 12px 0 0;
  color: #040405;
  font-family: 'Pretendard';
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const SubjectRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 32px 0 0;
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
`;

const MembersSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  gap: 10px;
  align-items: flex-start;
`;

const SectionTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #040405;
`;

const MemberCard = styled.div`
  width: 100%;
  border: 1px solid #c3c6cb;
  border-radius: 8px;
  background: #ffffff;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MemberRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: 40px;
  row-gap: 16px;
`;

const MemberCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const RoleName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #040405;
`;

const CountStat = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 16px;
  font-weight: 700;
  color: #4285f4;
`;

const CountUnit = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #040405;
`;

const DescriptionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 40px 0 0;
`;

const DescriptionBox = styled.div`
  border-radius: 8px;
  border: 1px solid #c3c6cb;
  background: #ffffff;
  padding: 30px;
  min-height: 320px;
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

const ResponsiveWrapper = styled.div`
  width: 100%;

  @media (max-width: ${SMALL_BREAKPOINT}) {
    ${MemberRow} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

interface IdeaCompleteProps {
  idea: Idea;
  onGoList: () => void;
}

export default function IdeaComplete({ idea }: IdeaCompleteProps) {
  const [resolvedTitle, setResolvedTitle] = React.useState<string>(idea.title || '');
  const [resolvedIntro, setResolvedIntro] = React.useState<string>(idea.intro || '');
  const [rawDescription, setRawDescription] = React.useState<string>(idea.description || '');

  const roleMap = React.useMemo(
    () =>
      TEAM_ROLES.reduce(
        (acc, role) => {
          acc[role.key] = role;
          return acc;
        },
        {} as Record<(typeof TEAM_ROLES)[number]['key'], (typeof TEAM_ROLES)[number]>
      ),
    []
  );

  const team = React.useMemo(
    () => ({
      ...createEmptyTeamCounts(),
      ...(idea.team ?? {}),
    }),
    [idea.team]
  );

  const filledTeam = React.useMemo(
    () => ({
      ...createEmptyTeamCounts(),
      ...(idea.filledTeam ?? {}),
    }),
    [idea.filledTeam]
  );

  React.useEffect(() => {
    if (idea.title) setResolvedTitle(idea.title);
    if (idea.intro) setResolvedIntro(idea.intro);
    if (idea.description) setRawDescription(idea.description);

    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('ideaFormData');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const draft = parsed?.form ?? parsed;
      if (!idea.title && draft?.title) setResolvedTitle(draft.title);
      if (!idea.intro && draft?.intro) setResolvedIntro(draft.intro);
      if (!idea.description && draft?.description) setRawDescription(draft.description);
    } catch (error) {
      console.error('Failed to load idea data from session', error);
    }
  }, [idea.description, idea.intro, idea.title]);

  const safeDescription = React.useMemo(
    () => sanitizeDescription(rawDescription || ''),
    [rawDescription]
  );

  return (
    <PageContainer>
      <PreviewCanvas>
        <ResponsiveWrapper>
          <TitleSection>
            <TitleText>{resolvedTitle || '아이디어 제목'}</TitleText>
            <IntroText>{resolvedIntro || '아이디어 한줄소개'}</IntroText>
          </TitleSection>

          <SubjectRow>
            <SubjectLabel>아이디어 주제</SubjectLabel>
            <SubjectValue>
              {idea.topic || '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'}
            </SubjectValue>
          </SubjectRow>

          <MembersSection>
            <SectionTitle>모집 인원</SectionTitle>
            <MemberCard>
              {TEAM_GROUPS.map(group => (
                <MemberRow key={group.join('-')}>
                  {group.map(roleKey => {
                    const role = roleMap[roleKey];
                    const total = team[role.key as keyof typeof team] ?? 0;
                    const current = filledTeam[role.key as keyof typeof filledTeam] ?? 0;
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
        </ResponsiveWrapper>
      </PreviewCanvas>
    </PageContainer>
  );
}
