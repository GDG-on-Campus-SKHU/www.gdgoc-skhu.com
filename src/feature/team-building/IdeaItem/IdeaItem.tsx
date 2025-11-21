/** @jsxImportSource @emotion/react */
import Link from 'next/link';
import styled from 'styled-components';

import { circle, recruitWrap } from '../../../features/team-building/styles/recruit';
import { Idea, resolveTotalMembers } from '../store/IdeaStore';

type IdeaItemProps = {
  idea: Idea;
  index: number;
};

const IdeaRow = styled(Link)`
  display: grid;
  grid-template-columns: 80px 1fr 140px 120px;
  align-items: center;
  padding: 18px 4px;
  color: inherit;
  text-decoration: none;
  border-top: 1px solid #f1f3f4;
  transition: background 0.15s ease;

  &:hover {
    background: #fafbff;
  }
`;

const IdeaIndex = styled.span`

width: 100px;
height: 38px;
color: var(--grayscale-1000, #040405);
text-align: center;

/* body/b1/b1 */
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 38.4px */
`;



const IdeaTitleText = styled.span`
width: 660px;
height: 32px;
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
align-self: stretch;
overflow: hidden;
color: var(--grayscale-1000, #040405);
text-overflow: ellipsis;

/* body/b2/b2-bold */
font-family: Pretendard;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: 160%; /* 32px */
`;

const IdeaIntroText = styled.span`
width: 660px;
height: 29px;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
align-self: stretch;
overflow: hidden;
color: var(--grayscale-600, #7E8590);
text-overflow: ellipsis;

/* body/b3/b3 */
font-family: Pretendard;
font-size: 18px;
font-style: normal;
font-weight: 500;
line-height: 160%; /* 28.8px */
`;
const IdeaCountContainer = styled.div`
display: flex;
padding: 20px 0;
align-items: center;
gap: 40px;
align-self: stretch;
display: flex;
width: 100px;
justify-content: center;
align-items: center;
`;
const IdeaCount = styled.span`
 color: var(--primary-600-main, #4285F4);
text-align: center;

/* body/b1/b1-bold */
font-family: Pretendard;
font-size: 24px;
font-style: normal;
font-weight: 700;
line-height: 160%; /* 38.4px */
`;
const IdeaUnit = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #7e8590;
  margin-left: 2px;
`;

const resolveStatus = (idea: Idea) => {
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
  const variant: 'active' | 'closed' = status === '모집 중' ? 'active' : 'closed';

  return { status, variant, displayCurrent, displayTotal: safeTotal };
};

function IdeaItem({ idea, index }: IdeaItemProps) {
  const { status, variant, displayCurrent, displayTotal } = resolveStatus(idea);

  return (
    <IdeaRow href={{ pathname: '/feature/team-building/IdeaList', query: { id: idea.id } }}>
      <IdeaIndex>{index}</IdeaIndex>

        <IdeaTitleText>{idea.title || '아이디어 제목'}</IdeaTitleText>
        <IdeaIntroText>{idea.intro || '아이디어 내용이 아직 작성되지 않았어요.'}</IdeaIntroText>

<IdeaCountContainer>
      <IdeaCount>
        {displayCurrent} / {displayTotal}<IdeaUnit>명</IdeaUnit>
      </IdeaCount>
      </IdeaCountContainer>
      <span
        css={recruitWrap}
        className={variant === 'active' ? undefined : 'disabled'}
        style={{ justifySelf: 'flex-end' }}
      >
        <span css={circle} className={variant === 'active' ? undefined : 'disabled'} />
        {status}
      </span>
    </IdeaRow>
  );
}

export default IdeaItem;
