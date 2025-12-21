/** @jsxImportSource @emotion/react */
import Link from 'next/link';
import styled from 'styled-components';

import { circle, recruitWrap } from '../../styles/recruit';
import { Idea } from '../store/IdeaStore';

type IdeaItemProps = {
  idea: Idea;
  index: number;
};

const IdeaRow = styled(Link)`
  display: grid;
  grid-template-columns: 93px 661.5px 80px 110px;
  align-items: center;
  column-gap: 40px;
  padding: 20px 0;
  width: 100%;
  max-width: 1080px;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--grayscale-300, #e0e2e5);
`;

const IdeaIndex = styled.span`
  color: var(--grayscale-1000, #040405);
  text-align: center;
  width: 100%;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const IdeaContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const IdeaTitleText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
  overflow: hidden;
  color: var(--grayscale-1000, #040405);
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const IdeaIntroText = styled.span`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  align-self: stretch;
  overflow: hidden;
  color: var(--grayscale-600, #7e8590);
  text-overflow: ellipsis;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

const IdeaCountContainer = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  width: 100%;
`;

const IdeaCount = styled.span<{ $closed?: boolean }>`
  color: ${({ $closed }) =>
    $closed ? 'var(--grayscale-500, #979ca5)' : 'var(--primary-600-main, #4285f4)'};
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const IdeaTotal = styled.span<{ $closed?: boolean }>`
  color: ${({ $closed }) =>
    $closed ? 'var(--grayscale-500, #979ca5)' : 'var(--primary-600-main, #4285f4)'};
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 160%;
`;

const IdeaUnit = styled.span<{ $closed?: boolean }>`
  color: ${({ $closed }) =>
    $closed ? 'var(--grayscale-500, #979ca5)' : 'var(--primary-600-main, #4285f4)'};
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 160%;
`;

function IdeaItem({ idea, index }: IdeaItemProps) {
  // API에서 전달받은 값을 직접 사용
  // totalMembers: compositions의 maxCount 합계 (모집 총 인원)
  // currentMembers: compositions의 currentCount 합계 (현재 참여 인원)
  const totalMembers = idea.totalMembers || 1;
  const currentMembers = idea.currentMembers || 0;

  // 모집 상태 판단
  const isClosed = currentMembers >= totalMembers;
  const displayStatus = isClosed ? '모집마감' : '모집 중';
  const statusVariant = isClosed ? 'closed' : 'active';

  return (
    <IdeaRow href={{ pathname: '/IdeaListDetail', query: { id: idea.id } }}>
      <IdeaIndex>{index}</IdeaIndex>
      <IdeaContent>
        <IdeaTitleText>{idea.title || '아이디어 제목'}</IdeaTitleText>
        <IdeaIntroText>{idea.intro || '아이디어 내용이 아직 작성되지 않았어요.'}</IdeaIntroText>
      </IdeaContent>
      <IdeaCountContainer>
        <IdeaCount $closed={isClosed}>{currentMembers}</IdeaCount>
        <IdeaTotal $closed={isClosed}>/ {totalMembers}</IdeaTotal>
        <IdeaUnit $closed={isClosed}>명</IdeaUnit>
      </IdeaCountContainer>
      <span
        css={recruitWrap}
        className={statusVariant === 'active' ? undefined : 'disabled'}
        style={{ justifySelf: 'center' }}
      >
        <span css={circle} className={statusVariant === 'active' ? undefined : 'disabled'} />
        {displayStatus}
      </span>
    </IdeaRow>
  );
}

export default IdeaItem;
