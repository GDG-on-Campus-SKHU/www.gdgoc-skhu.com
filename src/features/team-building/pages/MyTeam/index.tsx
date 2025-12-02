import { useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import Button from '../../components/Button';
import ApplyStatusSection from '../../components/MyTeam/ApplyStatusSection';
import CurrentTeamEmpty from '../../components/MyTeam/CurrentTeamEmpty';
import CurrentTeamSection from '../../components/MyTeam/CurrentTeamSection';
import MemberApplyStatusSection from '../../components/MyTeam/MemberApplyStatusSection';
import TabBar from '../../components/TabBar';

type MyTeamTabKey = 'currentMembers' | 'applications';

export default function MyTeamPage() {
  const [activeTab, setActiveTab] = useState<MyTeamTabKey>('currentMembers');

  // ui 확인용
  const isLeader = true;
  const isEmpty = false;

  return (
    <main css={mainCss}>
      <div css={innerCss}>
        {/* 상단 프로젝트 정보 영역 */}
        <header css={headerCss}>
          <h1 css={pageTitleCss}>
            마이페이지<span css={pageTitle1Css}> | My team</span>
          </h1>
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

        {/* 탭 컨텐츠 */}
        <section css={contentSectionCss}>
          {activeTab === 'currentMembers' &&
            (isEmpty ? <CurrentTeamEmpty /> : <CurrentTeamSection />)}
          {activeTab === 'applications' &&
            (isLeader ? <ApplyStatusSection secondEnabled /> : <MemberApplyStatusSection />)}
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

// 추후 추가 수정
const tabSectionCss = css``;

const contentSectionCss = css``;
