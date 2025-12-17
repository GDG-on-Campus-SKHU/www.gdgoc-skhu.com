import { useState } from 'react';
import { useCurrentTeam } from '@/lib/myTeam.api';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../../components/Button';
import ApplyStatusSection from '../../components/MyTeam/ApplyStatusSection';
import CurrentTeamEmpty from '../../components/MyTeam/CurrentTeamEmpty';
import CurrentTeamSection from '../../components/MyTeam/CurrentTeamSection';
import MemberApplyStatusSection from '../../components/MyTeam/MemberApplyStatusSection';
import TabBar from '../../components/TabBar';
import { useRouter } from 'next/router';

type MyTeamTabKey = 'currentMembers' | 'applications';

export default function MyTeamPage() {
  const [activeTab, setActiveTab] = useState<MyTeamTabKey>('currentMembers');
  const router = useRouter();

  const {
    data: currentTeam,
    isLoading: isCurrentTeamLoading,
    isError: isCurrentTeamError,
    error: currentTeamError,
  } = useCurrentTeam({
    enabled: true,
    retry: false,
  });

  const handleGoIdeaDetail = () => {
    if (!currentTeam?.ideaId) return;

    router.push({
      pathname: '/IdeaListDetail',
      query: {
        id: currentTeam.ideaId,
      },
    });
  };

  // fetchCurrentTeam이 404에서 null을 반환하므로, "팀 없음"은 null로 판별
  const hasMatchedTeam = !!currentTeam;

  // 팀이 있을 때만 역할 판단 가능
  const myRole = currentTeam?.myRole; // 'CREATOR' | 'MEMBER' (서버 기준)
  const isCreator = myRole === 'CREATOR';
  const isMember = myRole === 'MEMBER';

  const ideaTitle = currentTeam?.ideaTitle ?? '';
  const ideaIntro = currentTeam?.ideaIntroduction ?? '';

  // 상단 프로젝트 정보 영역 표시 조건 (원하면 조절)
  const showCreatorHeader = hasMatchedTeam && isCreator;

  // 팀원 전용 아이디어 정보 영역(TabBar 아래) 표시 조건
  const showMemberIdeaInfo = hasMatchedTeam && isMember && activeTab === 'currentMembers';

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 상단 프로젝트 정보 영역 */}
        <header css={headerCss}>
          <h1 css={pageTitleCss}>
            마이페이지<span css={pageTitle1Css}> | My team</span>
          </h1>
          {showCreatorHeader && (
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
                  onClick={handleGoIdeaDetail}
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
        {showMemberIdeaInfo && (
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
                onClick={handleGoIdeaDetail}
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
              {!isCurrentTeamLoading && !hasMatchedTeam && <CurrentTeamEmpty />}

              {/* 매칭된 팀 있음 => Section */}
              {!isCurrentTeamLoading && hasMatchedTeam && currentTeam && (
                <CurrentTeamSection
                  data={currentTeam}
                  isLeaderView={isCreator} // 서버 myRole 기준도 반영
                />
              )}

              {!isCurrentTeamLoading && isCurrentTeamError && (
                <div>팀 정보를 불러오지 못했습니다. {(currentTeamError as any)?.message}</div>
              )}
            </>
          )}

          {/* 지원 현황 탭 */}
          {activeTab === 'applications' &&
            (isCreator ? <ApplyStatusSection /> : <MemberApplyStatusSection enabled />)}
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
