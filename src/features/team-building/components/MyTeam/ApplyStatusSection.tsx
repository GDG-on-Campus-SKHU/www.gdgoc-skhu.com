import { useEffect, useMemo, useState } from 'react';
import {
  useDetermineEnrollment,
  useEnrollmentReadabilities,
  useReceivedEnrollments,
} from '@/lib/myTeam.api';
import { css } from '@emotion/react';

import { colors } from '../../../../styles/constants';
import { titleNormalCss, titleStrongCss } from '../../styles/modalStyles_Fix';
import {
  ApplyStatusRow,
  EnrollmentReadability,
  EnrollmentScheduleType,
  ReceivedEnrollment,
} from '../../types/applyStatusData';
import Modal from '../Modal_Fix';
import ApplyPeriodToggle, { SupportPhase } from './ApplyPeriodToggle';
import ApplyStatusTable from './ApplyStatusTable';

type PendingAction = 'ACCEPT' | 'REJECT';

type ConfirmModalState = {
  phase: SupportPhase;
  applicant: ApplyStatusRow;
  action: PendingAction;
} | null;

/** SupportPhase -> scheduleType 매핑 */
function toScheduleType(phase: SupportPhase): EnrollmentScheduleType {
  return phase === 'first' ? 'FIRST_TEAM_BUILDING' : 'SECOND_TEAM_BUILDING';
}

/** choice enum -> 라벨 */
function choiceToLabel(choice: ReceivedEnrollment['choice']) {
  if (choice === 'FIRST') return '1지망';
  if (choice === 'SECOND') return '2지망';
  return '3지망';
}

/**
 * 이 매핑 함수 유틸로 분리 예정
 */
function partToLabel(part: string) {
  switch (part) {
    case 'PM':
      return '기획';
    case 'DESIGN':
      return '디자인';
    case 'WEB':
      return '프론트엔드 (웹)';
    case 'MOBILE':
      return '모바일';
    case 'BACKEND':
      return '백엔드';
    case 'AI':
      return 'AI/ML';
    default:
      return part;
  }
}

export default function ApplyStatusSection() {
  const {
    data: readabilities,
    isLoading: isReadLoading,
    isError: isReadError,
  } = useEnrollmentReadabilities({
    retry: false,
  });

  // readable scheduleType만 추림
  const readableSet = useMemo(() => {
    const set = new Set<EnrollmentScheduleType>();
    (readabilities ?? []).forEach((r: EnrollmentReadability) => {
      if (r.readable) set.add(r.scheduleType);
    });
    return set;
  }, [readabilities]);

  // 1차/2차 탭 사용 가능 여부
  const firstReadable = readableSet.has('FIRST_TEAM_BUILDING');
  const secondReadable = readableSet.has('SECOND_TEAM_BUILDING');

  // UI 토글에서 쓰는 값
  // const secondEnabled = secondReadable;

  const [activePhase, setActivePhase] = useState<SupportPhase>('first');

  useEffect(() => {
    if (isReadLoading) return;

    // 1차가 불가이고 2차가 가능하면 2차로 스위치
    if (!firstReadable && secondReadable) setActivePhase('second');

    // 둘 다 불가면 일단 first 유지(빈 UI 처리)
  }, [isReadLoading, firstReadable, secondReadable]);

  // 둘 다 readable이 아니면 (아직 기간 전) => 빈 화면 처리 가능
  const readableNone = !firstReadable && !secondReadable;
  const phaseReadable = activePhase === 'first' ? firstReadable : secondReadable;
  const scheduleType = toScheduleType(activePhase);

  const {
    data: received,
    isLoading,
    isError,
  } = useReceivedEnrollments(scheduleType, {
    // 해당 phase가 readable 할 때만 조회
    enabled: phaseReadable && !readableNone,
    retry: false,
  });

  const rows: ApplyStatusRow[] = useMemo(() => {
    const list = received?.enrollments ?? [];
    return list.map(e => ({
      id: e.enrollmentId,
      priorityLabel: choiceToLabel(e.choice),
      name: e.applicantName,
      partLabel: partToLabel(e.applicantPart),
      school: e.applicantSchool,
      status: e.enrollmentStatus,
      enrollmentAcceptable: e.enrollmentAcceptable,
    }));
  }, [received]);

  const totalCount = rows.length;

  const scheduleEnded = received?.scheduleEnded ?? false;

  const canOpenAccept = (row: ApplyStatusRow) => {
    if (row.status !== 'WAITING') return false;
    if (scheduleEnded) return false;
    if (!row.enrollmentAcceptable) return false;
    return true;
  };

  const canOpenReject = (row: ApplyStatusRow) => {
    if (row.status !== 'WAITING') return false;
    if (scheduleEnded) return false;
    return true;
  };

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(null);

  const determineMutation = useDetermineEnrollment({
    onSuccess: () => {
      setConfirmModal(null);
    },
  });

  const isDetermining = determineMutation.isPending;
  const pendingEnrollmentId = determineMutation.variables?.enrollmentId ?? null;

  const handleClickAccept = (enrollmentId: number) => {
    if (isDetermining) return;

    const row = rows.find(r => r.id === enrollmentId);
    if (!row) return;
    if (!canOpenAccept(row)) return;

    setConfirmModal({ phase: activePhase, applicant: row, action: 'ACCEPT' });
  };

  const handleClickReject = (enrollmentId: number) => {
    if (isDetermining) return;

    const row = rows.find(r => Number(r.id) === enrollmentId);
    if (!row) return;
    if (!canOpenReject(row)) return;

    setConfirmModal({ phase: activePhase, applicant: row, action: 'REJECT' });
  };

  /**
   * 실제 수락/거절 API는 아직 만들지 않았으니(요청 안 함),
   * 여기서는 “확인 모달 닫기”까지만 처리해 둠.
   * (다음 단계에서 PATCH/POST 연동할 때 useMutation으로 붙이면 됨)
   */
  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    if (isDetermining) return;

    const accept = confirmModal.action === 'ACCEPT';

    await determineMutation.mutateAsync({
      enrollmentId: confirmModal.applicant.id,
      body: { accept },
    });
  };

  return (
    <section css={sectionWrapCss}>
      {/* 상단: 지원기간 토글 + 총 지원자 수 */}
      <header css={headerRowCss}>
        <ApplyPeriodToggle
          activePhase={activePhase}
          secondEnabled={secondReadable}
          onChange={next => {
            if (isDetermining) return;
            if (next === 'first' && !firstReadable) return;
            if (next === 'second' && !secondReadable) return;
            setActivePhase(next);
          }}
        />

        <div css={totalWrapCss}>
          <span css={totalLabelCss}>총 지원자 수</span>
          <span css={totalCountCss}>{totalCount}명</span>
        </div>
      </header>

      {/* 컨텐츠 */}
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
        <ApplyStatusTable
          rows={rows}
          onAccept={handleClickAccept}
          onReject={handleClickReject}
          scheduleEnded={scheduleEnded}
          isDetermining={isDetermining}
          pendingEnrollmentId={pendingEnrollmentId}
        />
      )}

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
          confirmText={
            isDetermining
              ? '처리 중...'
              : confirmModal.action === 'ACCEPT'
                ? '수락하기'
                : '거절하기'
          }
          cancelText="취소"
          onClose={() => (isDetermining ? null : setConfirmModal(null))}
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
