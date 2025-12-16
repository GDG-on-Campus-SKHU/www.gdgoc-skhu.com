import { useEffect, useMemo, useState } from 'react';
import {
  useCancelEnrollment,
  useEnrollmentReadabilities,
  useSentEnrollments,
} from '@/lib/myTeam.api';
import { colors } from '@/styles/constants';
import { css } from '@emotion/react';

import {
  EnrollmentChoice,
  EnrollmentPriority,
  EnrollmentReadability,
  EnrollmentScheduleType,
  EnrollmentStatus,
  MemberSentApplyCard,
} from '../../types/applyStatusData';
import Modal from '../Modal_Fix';
import ApplyPeriodToggle, { SupportPhase } from './ApplyPeriodToggle';
import MyApplyCard from './MyApplyCard';

type MemberApplyStatusSectionProps = {
  /** 탭 전환 시 불필요한 호출 방지용 */
  enabled?: boolean;
};

const PRIORITIES: EnrollmentPriority[] = [1, 2, 3];

/** SupportPhase -> scheduleType 매핑 */
function toScheduleType(phase: SupportPhase): EnrollmentScheduleType {
  return phase === 'first' ? 'FIRST_TEAM_BUILDING' : 'SECOND_TEAM_BUILDING';
}

/** choice -> priority number */
function choiceToPriority(choice: EnrollmentChoice): EnrollmentPriority {
  if (choice === 'FIRST') return 1;
  if (choice === 'SECOND') return 2;
  return 3;
}

function toMemberCardStatus(scheduleEnded: boolean, enrollmentStatus: EnrollmentStatus) {
  if (!scheduleEnded) return 'WAITING' as const;

  if (enrollmentStatus === 'ACCEPTED') return 'ACCEPTED' as const;
  if (enrollmentStatus === 'REJECTED') return 'REJECTED' as const;
  if (enrollmentStatus === 'EXPIRED') return 'REJECTED' as const;

  // 방어(원칙상 종료 후 WAITING이 오면 안 되지만)
  return 'WAITING' as const;
}

export default function MemberApplyStatusSection({
  enabled = true,
}: MemberApplyStatusSectionProps) {
  const [activePhase, setActivePhase] = useState<SupportPhase>('first');

  /** 1) 조회 가능 여부 */
  const {
    data: readabilities,
    isLoading: isReadLoading,
    isError: isReadError,
  } = useEnrollmentReadabilities({
    enabled,
    retry: false,
  });

  const readableSet = useMemo(() => {
    const set = new Set<EnrollmentScheduleType>();
    (readabilities ?? []).forEach((r: EnrollmentReadability) => {
      if (r.readable) set.add(r.scheduleType);
    });
    return set;
  }, [readabilities]);

  const firstReadable = readableSet.has('FIRST_TEAM_BUILDING');
  const secondReadable = readableSet.has('SECOND_TEAM_BUILDING');

  const readableNone = !firstReadable && !secondReadable;
  const phaseReadable = activePhase === 'first' ? firstReadable : secondReadable;

  // 토글 UI에서 2차 버튼 노출 여부
  const secondEnabled = secondReadable;

  // 1차가 불가 & 2차가 가능하면 자동으로 2차로 이동
  useEffect(() => {
    if (!enabled) return;
    if (isReadLoading) return;
    if (!firstReadable && secondReadable) setActivePhase('second');
  }, [enabled, isReadLoading, firstReadable, secondReadable]);

  /** 2) 보낸 지원 현황 */
  const scheduleType = toScheduleType(activePhase);

  const {
    data: sent,
    isLoading,
    isError,
  } = useSentEnrollments(scheduleType, {
    enabled: enabled && !readableNone && phaseReadable,
    retry: false,
  });

  const scheduleEnded = sent?.scheduleEnded ?? false;
  const isResultAnnounced = scheduleEnded;

  const currentCards = useMemo<MemberSentApplyCard[]>(() => {
    const list = sent?.enrollments ?? [];
    return list.map(e => ({
      enrollmentId: e.enrollmentId,
      phase: activePhase,
      priority: choiceToPriority(e.choice),

      projectName: e.ideaTitle,
      oneLiner: e.ideaIntroduction,

      enrollmentPart: e.enrollmentPart,
      maxMemberCountOfPart: e.maxMemberCountOfPart,
      applicantCount: e.applicantCount,

      status: toMemberCardStatus(scheduleEnded, e.enrollmentStatus),
    }));
  }, [sent, activePhase, scheduleEnded]);

  const cancelMutation = useCancelEnrollment();

  /** 취소 확인 모달 */
  const [cancelTarget, setCancelTarget] = useState<MemberSentApplyCard | null>(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const handleCancel = (card: MemberSentApplyCard) => {
    if (isResultAnnounced) return;
    if (card.status !== 'WAITING') return;
    setCancelTarget(card);
    setShowConfirmCancel(true);
  };

  const handleCloseCancelModal = () => {
    if (cancelMutation.isPending) return;
    setShowConfirmCancel(false);
    setCancelTarget(null);
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    if (cancelMutation.isPending) return;

    try {
      await cancelMutation.mutateAsync({ enrollmentId: cancelTarget.enrollmentId });
      setShowConfirmCancel(false);
      setCancelTarget(null);
    } catch {
      // 에러 UI는 필요하면 모달 하단에 표시하거나 toast로 처리 가능
    }
  };

  const handleClickEmptyPriority = (priority: EnrollmentPriority) => {
    if (isResultAnnounced) return;
    console.log(`${priority}지망 아이디어 지원하기 클릭`);
  };

  const renderPriorityBlock = (priority: EnrollmentPriority) => {
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

    return (
      <MyApplyCard
        key={item.enrollmentId}
        variant="applied"
        data={item}
        onCancel={() => handleCancel(item)}
      />
    );
  };

  return (
    <section css={sectionWrapCss}>
      <header css={headerRowCss}>
        <ApplyPeriodToggle
          activePhase={activePhase}
          secondEnabled={secondEnabled}
          onChange={next => {
            // readable 체크
            if (next === 'first' && !firstReadable) return;
            if (next === 'second' && !secondReadable) return;
            setActivePhase(next);
          }}
        />
      </header>

      {/* 상태 처리 */}
      {isReadLoading ? (
        <div css={emptyCss}>불러오는 중...</div>
      ) : isReadError ? (
        <div css={emptyCss}>지원기간 정보를 불러오지 못했어요.</div>
      ) : readableNone ? (
        <div css={emptyCss}>아직 지원 현황을 조회할 수 없어요.</div>
      ) : !phaseReadable ? (
        <div css={emptyCss}>현재 선택한 기간은 조회할 수 없어요.</div>
      ) : isLoading ? (
        <div css={emptyCss}>불러오는 중...</div>
      ) : isError ? (
        <div css={emptyCss}>지원 현황을 불러오지 못했어요.</div>
      ) : (
        <div css={cardListCss}>{PRIORITIES.map(p => renderPriorityBlock(p))}</div>
      )}

      {/* 지원 취소 확인 모달 */}
      {showConfirmCancel && cancelTarget && (
        <Modal
          type="smallConfirm"
          title={cancelTarget.projectName}
          message="아이디어 지원을 취소할까요?"
          confirmText={cancelMutation.isPending ? '취소 중...' : '지원 취소'}
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

const emptyCss = css`
  width: 100%;
  min-height: 400px;
  border-radius: 12px;
  background-color: ${colors.grayscale[200]};
  border: 1px solid ${colors.grayscale[400]};

  display: flex;
  align-items: center;
  justify-content: center;
`;
