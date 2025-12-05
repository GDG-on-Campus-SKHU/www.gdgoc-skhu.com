import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import {
  MemberApplyData,
  MemberApplyPriority,
  mockMemberApplyCards,
} from '../../types/memberApplyData';
import Modal from '../Modal_Fix';
import ApplyPeriodToggle, { SupportPhase } from './ApplyPeriodToggle';
import MyApplyCard from './MyApplyCard';

type MemberApplyStatusSectionProps = {
  /** 1차 지원기간 카드 목록 */
  firstPhaseCards?: MemberApplyData[];
  /** 2차 지원기간 카드 목록 (임시 데이터 x) */
  secondPhaseCards?: MemberApplyData[];
  /** 2차 지원기간이 열렸는지 여부 */
  secondEnabled?: boolean;
  /** 각 지원기간별 결과 발표 여부 */
  resultAnnouncedByPhase?: Record<SupportPhase, boolean>;
};

const PRIORITIES: MemberApplyPriority[] = [1, 2, 3];

export default function MemberApplyStatusSection({
  firstPhaseCards,
  secondPhaseCards = [],
  secondEnabled = false,
  resultAnnouncedByPhase,
}: MemberApplyStatusSectionProps) {
  const [activePhase, setActivePhase] = useState<SupportPhase>('first');

  const initialFirst = firstPhaseCards ?? mockMemberApplyCards;
  const initialSecond = secondPhaseCards ?? [];

  // 각 지원기간별 카드 (취소 시 UI 반영용)
  const [firstCards, setFirstCards] = useState<MemberApplyData[]>(initialFirst);
  const [secondCards, setSecondCards] = useState<MemberApplyData[]>(initialSecond);

  // 부모에서 firstPhaseCards/secondPhaseCards가 바뀌면 로컬 상태도 리셋
  useEffect(() => {
    setFirstCards(firstPhaseCards ?? mockMemberApplyCards);
  }, [firstPhaseCards]);

  useEffect(() => {
    setSecondCards(secondPhaseCards ?? []);
  }, [secondPhaseCards]);

  // "지원 취소" 확인 모달용 대상 카드
  const [cancelTarget, setCancelTarget] = useState<MemberApplyData | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false); // 확인 모달

  // 현재 선택된 지원기간에 따른 카드 목록
  const cardsOfActivePhase = activePhase === 'first' ? firstCards : secondCards;

  // 추후 phase 필드를 섞어서 넣을 수도 있으니 한 번 더 필터링
  const currentCards = cardsOfActivePhase.filter(card => card.phase === activePhase);

  // 현재 활성된 지원기간의 결과 발표 여부
  const isResultAnnounced = resultAnnouncedByPhase?.[activePhase] ?? false;

  /** 지원 취소 버튼 클릭 → 확인 모달 열기 */
  const handleCancel = (card: MemberApplyData) => {
    if (card.status !== 'PENDING') return;
    if (isResultAnnounced) return;
    setCancelTarget(card);
    setShowConfirmCancel(true);
  };

  /** 확인 모달 닫기 */
  const handleCloseCancelModal = () => {
    setShowConfirmCancel(false);
    setCancelTarget(null);
  };

  /** 확인 모달 - "지원 취소" 버튼 */
  const handleConfirmCancel = () => {
    if (cancelTarget) {
      const { id, phase } = cancelTarget;
      const setter = phase === 'first' ? setFirstCards : setSecondCards;

      setter(prev => prev.filter(card => card.id !== id));
    }

    setCancelTarget(null);
    setShowConfirmCancel(false);
  };

  const handleClickEmptyPriority = (priority: MemberApplyPriority) => {
    if (isResultAnnounced) return; // 결과 발표 후에는 클릭 무시
    console.log(`${priority}지망 아이디어 지원하기 클릭`);
  };

  /** 지망별로 카드 / 빈 카드 렌더링 */
  const renderPriorityBlock = (priority: MemberApplyPriority) => {
    const item = currentCards.find(card => card.priority === priority);

    if (!item) {
      // 아직 이 지망에 지원하지 않은 경우
      return (
        <MyApplyCard
          variant="empty"
          priority={priority}
          emptyType={isResultAnnounced ? 'result' : 'apply'}
          onClickApply={isResultAnnounced ? undefined : () => handleClickEmptyPriority(priority)}
        />
      );
    }

    return <MyApplyCard key={item.id} variant="applied" data={item} onCancel={handleCancel} />;
  };

  return (
    <section css={sectionWrapCss}>
      <header css={headerRowCss}>
        <ApplyPeriodToggle
          activePhase={activePhase}
          secondEnabled={secondEnabled}
          onChange={setActivePhase}
        />
      </header>

      <div css={cardListCss}>{PRIORITIES.map(priority => renderPriorityBlock(priority))}</div>

      {/* 지원 취소 확인 모달 */}
      {showConfirmCancel && cancelTarget && (
        <Modal
          type="smallConfirm"
          title={cancelTarget.projectName}
          message="아이디어 지원을 취소할까요?"
          confirmText="지원 취소"
          cancelText="아니오"
          onConfirm={handleConfirmCancel}
          onClose={handleCloseCancelModal}
        />
      )}
    </section>
  );
}

const sectionWrapCss = css`
  width: 100%;
  margin-top: 55px;
`;

const headerRowCss = css`
  margin-bottom: 22px;
  display: flex;
  justify-content: flex-start;
`;

const cardListCss = css`
  display: flex;
  flex-direction: column;
  gap: 35px;
`;
