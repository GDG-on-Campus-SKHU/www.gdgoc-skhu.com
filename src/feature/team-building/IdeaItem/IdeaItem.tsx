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
  font-size: 16px;
  font-weight: 600;
  color: #202124;
`;

const IdeaContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const IdeaTitleText = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #202124;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IdeaIntroText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #5f6368;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IdeaCount = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #4285f4;
  text-align: right;
`;

const resolveStatus = (idea: Idea) => {
  const preferredRoleKey = (() => {
    const preferred = idea.preferredPart;
    if (!preferred) return null;
    const matched = (Object.keys(idea.team ?? {}) as Array<keyof Idea['team']>).find(key => {
      const label = {
        planning: '기획',
        design: '디자인',
        frontendWeb: '프론트엔드 (웹)',
        frontendMobile: '프론트엔드 (모바일)',
        backend: '백엔드',
        aiMl: 'AI/ML',
      }[key];
      return label === preferred || key === preferred;
    });
    return matched ?? null;
  })();
  const effectiveTotalBase = resolveTotalMembers(idea.totalMembers, idea.team);
  const filledTotal = Object.values(idea.filledTeam ?? {}).reduce(
    (sum, count) => sum + (count ?? 0),
    0
  );
  const baseCurrent =
    typeof idea.currentMembers === 'number' && Number.isFinite(idea.currentMembers)
      ? idea.currentMembers
      : 0;
  const effectiveCurrent = Math.max(baseCurrent, filledTotal, preferredRoleKey ? 1 : 0);
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
      <IdeaContent>
        <IdeaTitleText>{idea.title || '아이디어 제목'}</IdeaTitleText>
        <IdeaIntroText>{idea.intro || '아이디어 내용이 아직 작성되지 않았어요.'}</IdeaIntroText>
      </IdeaContent>
      <IdeaCount>
        {displayCurrent} / {displayTotal}명
      </IdeaCount>
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
