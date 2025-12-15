import { useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../../components/Button';
import ApplyStatusSection from '../../components/MyTeam/ApplyStatusSection';
import CurrentTeamEmpty from '../../components/MyTeam/CurrentTeamEmpty';
import CurrentTeamSection from '../../components/MyTeam/CurrentTeamSection';
import MemberApplyStatusSection from '../../components/MyTeam/MemberApplyStatusSection';
import TabBar from '../../components/TabBar';
import { useCurrentTeam } from '@/lib/myTeam.api';

type UserRole = 'LEADER' | 'MEMBER';
type MyTeamTabKey = 'currentMembers' | 'applications';

export default function MyTeamPage() {
  const [role] = useState<UserRole>('LEADER'); // 'MEMBER' 로 바꿔가며 테스트
  const [activeTab, setActiveTab] = useState<MyTeamTabKey>('currentMembers');

  const isLeader = role === 'LEADER';
  const isMember = role === 'MEMBER';

  const {
    data: currentTeam,
    isLoading: isCurrentTeamLoading,
    isError: isCurrentTeamError,
    error: currentTeamError,
  } = useCurrentTeam({
    enabled: activeTab === 'currentMembers',
    retry: false,
  });

  // fetchCurrentTeam이 404에서 null을 반환하므로, "팀 없음"은 null로 판별
  const hasMatchedTeam = !!currentTeam;

  // 기존 isEmpty 의미: "팀원인데 아직 팀이 없음"
  const isEmpty = isMember && !hasMatchedTeam;

  const ideaTitle = currentTeam?.ideaTitle ?? '리빙메이트';
  const ideaIntro = currentTeam?.ideaIntroduction ?? '아이디어 한줄소개';

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
                <p css={projectNameCss}>{ideaTitle}</p>
                <p css={projectOneLinerCss}>{ideaIntro}</p>
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
              <p css={projectNameCss}>{ideaTitle}</p>
              <p css={projectOneLinerCss}>{ideaIntro}</p>
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
          {activeTab === 'currentMembers' && (
            <>
              {/* 로딩 */}
              {isCurrentTeamLoading && null /* 원하면 로딩 UI */}

              {/* 팀원 + 매칭된 팀 없음(404) => Empty */}
              {!isCurrentTeamLoading && isEmpty && <CurrentTeamEmpty />}

              {/* 매칭된 팀 있음 => Section */}
              {!isCurrentTeamLoading && hasMatchedTeam && currentTeam && (
                <CurrentTeamSection
                  data={currentTeam}
                  isLeaderView={isLeader || currentTeam.myRole === 'CREATOR'} // 서버 myRole 기준도 반영
                  resultAnnouncedByPhase={{
                    first: false,
                    second: false,
                  }}
                />
              )}

              {!isCurrentTeamLoading && isCurrentTeamError && (
                <div>팀 정보를 불러오지 못했습니다. {(currentTeamError as any)?.message}</div>
              )}
            </>
          )}

          {/* 지원 현황 탭 */}
          {activeTab === 'applications' &&
            (isLeader ? <ApplyStatusSection /> : <MemberApplyStatusSection enabled />)}
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
