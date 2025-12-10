import { useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../../components/Button';
import { SupportPhase } from '../../components/MyTeam/ApplyPeriodToggle';
import ApplyStatusSection from '../../components/MyTeam/ApplyStatusSection';
import CurrentTeamEmpty from '../../components/MyTeam/CurrentTeamEmpty';
import CurrentTeamSection from '../../components/MyTeam/CurrentTeamSection';
import MemberApplyStatusSection from '../../components/MyTeam/MemberApplyStatusSection';
import TabBar from '../../components/TabBar';
import {
  mockMemberApplyCardsAfterResult,
  mockMemberApplyCardsBeforeResult,
} from '../../types/memberApplyData';

type UserRole = 'LEADER' | 'MEMBER';
type MyTeamTabKey = 'currentMembers' | 'applications';
type PhaseKey = 'first' | 'second';

type PhaseState = {
  opened: boolean;
  resultAnnounced: boolean;
};

export default function MyTeamPage() {
  const [role] = useState<UserRole>('LEADER'); // 'MEMBER' 로 바꿔가며 테스트
  const [activeTab, setActiveTab] = useState<MyTeamTabKey>('currentMembers');

  // 팀원일 때 매칭된 팀 유무 (기존 isEmpty의 반대 의미)
  const [hasMatchedTeam] = useState<boolean>(false); // true/false 바꿔가며 테스트

  // 1차/2차 지원기간 상태
  const [phaseState] = useState<Record<PhaseKey, PhaseState>>({
    first: { opened: true, resultAnnounced: false },
    second: { opened: true, resultAnnounced: false },
  });

  const isLeader = role === 'LEADER';
  const isMember = role === 'MEMBER';

  // 기존 isEmpty 의미: "팀원인데 아직 팀이 없음"
  const isEmpty = isMember && !hasMatchedTeam;

  // ApplyPeriodToggle & 지원현황 섹션에서 쓸 값들
  const secondEnabled = phaseState.second.opened;

  const resultAnnouncedByPhase: Record<SupportPhase, boolean> = {
    first: phaseState.first.resultAnnounced,
    second: phaseState.second.resultAnnounced,
  };

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 상단 프로젝트 정보 영역 */}
        <header css={headerCss}>
          <h1 css={pageTitleCss}>
            마이페이지<span css={pageTitle1Css}> | My team</span>
          </h1>
          {isLeader && (
            <div css={subTitleCss}>
              <div css={projectInfoCss}>
                <p css={projectNameCss}>리빙메이트</p>
                <p css={projectOneLinerCss}>아이디어 한줄소개</p>
              </div>

              <div>
                <Button
                  type="button"
                  variant="secondary"
                  title="내 아이디어 보러가기"
                  style={{
                    height: '50px',
                    width: '200px',
                    fontSize: '18px',
                    fontWeight: '500',
                    lineHeight: '28.8px',
                    borderColor: colors.primary[600],
                    color: colors.primary[600],
                  }}
                />
              </div>
            </div>
          )}
        </header>

        {/* 탭바 */}
        <section css={tabSectionCss}>
          <TabBar
            items={[
              { key: 'currentMembers', label: '현재 팀원 구성' },
              { key: 'applications', label: '지원 현황' },
            ]}
            activeKey={activeTab}
            onChange={key => setActiveTab(key as MyTeamTabKey)}
          />
        </section>

        {/* --- 팀원 전용: TabBar 아래 + 현재 팀원 구성 탭 + 매칭된 팀 있을 때만 --- */}
        {!isLeader && !isEmpty && activeTab === 'currentMembers' && (
          <section css={memberIdeaInfoSectionCss}>
            <div css={projectInfoCss}>
              {/* 실제 매칭된 아이디어 정보로 교체 */}
              <p css={projectNameCss}>리빙메이트</p>
              <p css={projectOneLinerCss}>아이디어 한줄소개</p>
            </div>

            <div>
              <Button
                type="button"
                variant="secondary"
                title="아이디어 보러가기"
                style={{
                  height: '50px',
                  width: '200px',
                  fontSize: '18px',
                  fontWeight: '500',
                  lineHeight: '28.8px',
                  borderColor: colors.primary[600],
                  color: colors.primary[600],
                }}
              />
            </div>
          </section>
        )}

        {/* 탭 컨텐츠 */}
        <section css={contentSectionCss}>
          {/* 현재 팀원 구성 탭 */}
          {activeTab === 'currentMembers' &&
            (isEmpty ? (
              <CurrentTeamEmpty />
            ) : (
              <CurrentTeamSection
                isLeaderView={isLeader}
                resultAnnouncedByPhase={resultAnnouncedByPhase}
                // 2차 수락한 팀원 확인할 경우
                // visibleJoinPhases={['first', 'second']}
              />
            ))}

          {/* 지원 현황 탭 */}
          {activeTab === 'applications' &&
            (isLeader ? (
              <ApplyStatusSection
                secondEnabled={secondEnabled}
                resultAnnouncedByPhase={resultAnnouncedByPhase}
                // 추후 1, 2차 지원 기간 props 사용해 api 연동 예정
              />
            ) : (
              <MemberApplyStatusSection
                secondEnabled={secondEnabled}
                resultAnnouncedByPhase={resultAnnouncedByPhase}
                // 1차 데이터만 만든 상태
                firstPhaseCards={
                  phaseState.first.resultAnnounced
                    ? mockMemberApplyCardsAfterResult
                    : mockMemberApplyCardsBeforeResult
                }
              />
            ))}
        </section>
      </div>
    </main>
  );
}

const mainCss = css`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${colors.white};
  color: ${colors.grayscale[1000]};
  font-family: 'Pretendard', sans-serif;
  padding: 4rem 2.5rem 5rem;
`;

const innerCss = css`
  width: 100%;
  max-width: 1080px;
`;

const headerCss = css`
  margin-top: 60px;
`;

const pageTitleCss = css`
  font-size: 36px;
  font-weight: 700;
  line-height: 57.6px;
  margin-bottom: 28px;
`;

const pageTitle1Css = css`
  font-size: 36px;
  font-weight: 400;
  line-height: 57.6px;
`;

const subTitleCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const projectInfoCss = css`
  display: flex;
  flex-direction: column;
`;

const projectNameCss = css`
  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
`;

const projectOneLinerCss = css`
  font-size: 20px;
  font-weight: 500;
  line-height: 32px;
  color: ${colors.grayscale[600]};
`;

const memberIdeaInfoSectionCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
`;

// 추후 추가 수정
const tabSectionCss = css``;

const contentSectionCss = css``;
