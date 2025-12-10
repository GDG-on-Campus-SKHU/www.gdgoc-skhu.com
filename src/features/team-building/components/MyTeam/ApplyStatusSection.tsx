import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import { titleNormalCss, titleStrongCss } from '../../styles/modalStyles_Fix';
import {
  ApplyApplicant,
  ApplyStatus,
  mockFirstPhaseApplicants,
  mockSecondPhaseApplicants,
} from '../../types/applyStatusData';
import Modal from '../Modal_Fix';
import ApplyPeriodToggle, { SupportPhase } from './ApplyPeriodToggle';
import ApplyStatusTable from './ApplyStatusTable';

type ApplyStatusSectionProps = {
  /** 1차 지원자 리스트 (기본값 임시) */
  firstPhaseApplicants?: ApplyApplicant[];
  /** 2차 지원자 리스트 (기본값 임시) */
  secondPhaseApplicants?: ApplyApplicant[];
  /** 2차 지원기간이 열렸는지 여부 */
  secondEnabled?: boolean;
  /** 각 지원기간별 결과 발표 여부 (first/second) */
  resultAnnouncedByPhase?: Record<SupportPhase, boolean>;
};

type PendingAction = 'ACCEPT' | 'REJECT';

type ConfirmModalState = {
  phase: SupportPhase;
  applicant: ApplyApplicant;
  action: PendingAction;
} | null;

export default function ApplyStatusSection({
  firstPhaseApplicants,
  secondPhaseApplicants,
  secondEnabled = false,
  resultAnnouncedByPhase,
}: ApplyStatusSectionProps) {
  const [activePhase, setActivePhase] = useState<SupportPhase>('first');

  // api 연결 전 초기값 (없으면 임시 데이터)
  const initialFirst = firstPhaseApplicants ?? mockFirstPhaseApplicants;
  const initialSecond = secondPhaseApplicants ?? mockSecondPhaseApplicants;
  const [firstRows, setFirstRows] = useState<ApplyApplicant[]>(initialFirst);
  const [secondRows, setSecondRows] = useState<ApplyApplicant[]>(initialSecond);

  // index 에서 api 주입 시 동기화
  useEffect(() => {
    setFirstRows(firstPhaseApplicants ?? mockFirstPhaseApplicants);
  }, [firstPhaseApplicants]);

  useEffect(() => {
    setSecondRows(secondPhaseApplicants ?? mockSecondPhaseApplicants);
  }, [secondPhaseApplicants]);

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(null);

  const currentRows = activePhase === 'first' ? firstRows : secondRows;
  const totalCount = currentRows.length;

  const controlsDisabled = resultAnnouncedByPhase?.[activePhase] ?? false;

  const updateRowStatus = (phase: SupportPhase, id: string, nextStatus: ApplyStatus) => {
    const setter = phase === 'first' ? setFirstRows : setSecondRows;
    setter(prev => prev.map(row => (row.id === id ? { ...row, status: nextStatus } : row)));
  };

  /** 수락버튼 */
  const handleClickAccept = (id: string) => {
    if (controlsDisabled) return; // 발표 후에는 수락 불가
    const source = activePhase === 'first' ? firstRows : secondRows;
    const applicant = source.find(row => row.id === id);
    if (!applicant) return;

    setConfirmModal({
      phase: activePhase,
      applicant,
      action: 'ACCEPT',
    });
  };

  /** 거절버튼 */
  const handleClickReject = (id: string) => {
    if (controlsDisabled) return; // 발표 후에는 거절 불가
    const source = activePhase === 'first' ? firstRows : secondRows;
    const applicant = source.find(row => row.id === id);
    if (!applicant) return;

    setConfirmModal({
      phase: activePhase,
      applicant,
      action: 'REJECT',
    });
  };

  /** 확인 모달에서 수락하기 / 거절하기 */
  const handleConfirmAction = () => {
    if (!confirmModal) return;

    const { phase, applicant, action } = confirmModal;
    const nextStatus: ApplyStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

    updateRowStatus(phase, applicant.id, nextStatus);

    setConfirmModal(null);
  };

  return (
    <section css={sectionWrapCss}>
      {/* 상단: 지원기간 토글 + 총 지원자 수 */}
      <header css={headerRowCss}>
        <ApplyPeriodToggle
          activePhase={activePhase}
          secondEnabled={secondEnabled}
          onChange={setActivePhase}
        />

        <div css={totalWrapCss}>
          <span css={totalLabelCss}>총 지원자 수</span>
          <span css={totalCountCss}>{totalCount}명</span>
        </div>
      </header>

      {/* 지원자 표 */}
      <ApplyStatusTable
        rows={currentRows}
        onAccept={handleClickAccept}
        onReject={handleClickReject}
        controlsDisabled={controlsDisabled}
      />

      {/* 수락 / 거절 확인 모달 */}
      {confirmModal && (
        <Modal
          type="textConfirm"
          titleNode={
            <>
              <span css={titleNormalCss}>지원자 </span>
              <span css={titleStrongCss}>{confirmModal.applicant.name}</span>
              <span css={titleNormalCss}>의 지원을 </span>
              <span css={titleStrongCss}>
                {' '}
                {confirmModal.action === 'ACCEPT' ? '수락' : '거절'}
              </span>
              <span css={titleNormalCss}>할까요?</span>
            </>
          }
          message=""
          confirmText={confirmModal.action === 'ACCEPT' ? '수락하기' : '거절하기'}
          cancelText="취소"
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirmAction}
          customTitleAlign="center"
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const totalWrapCss = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
`;

const totalLabelCss = css`
  font-size: 18px;
  font-weight: 500;
  line-height: 28.8px;
  color: ${colors.grayscale[1000]};
`;

const totalCountCss = css`
  font-size: 24px;
  font-weight: 700;
  line-height: 38.4px;
  color: ${colors.primary[600]};
`;
