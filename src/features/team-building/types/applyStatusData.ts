import { Part } from './gallery';

// 지원 상태 타입
export type ApplyStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// 1차 / 2차 구분
export type ApplyPhase = 'first' | 'second';

// 한 명의 지원자 정보
export type ApplyApplicant = {
  id: string;
  phase: ApplyPhase;
  priorityLabel: string;
  name: string;
  part: string;
  school: string;
  status: ApplyStatus;
};

/** =========================== API 연동 작업 후 만든 타입 ======================= */

/** 지원 기간(일정) 타입 - Swagger 설명에 나온 전체 케이스를 일단 모두 포함 */
export type EnrollmentScheduleType =
  | 'IDEA_REGISTRATION'
  | 'FIRST_TEAM_BUILDING'
  | 'FIRST_TEAM_BUILDING_ANNOUNCEMENT'
  | 'SECOND_TEAM_BUILDING'
  | 'SECOND_TEAM_BUILDING_ANNOUNCEMENT'
  | 'THIRD_TEAM_BUILDING'
  | 'FINAL_RESULT_ANNOUNCEMENT';

/** 지망 */
export type EnrollmentChoice = 'FIRST' | 'SECOND' | 'THIRD';

/** 지원 상태 */
export type EnrollmentStatus = 'WAITING' | 'EXPIRED' | 'REJECTED' | 'ACCEPTED';

/** 팀장: 받은 지원 내역(현황) 1건 */
export type ReceivedEnrollment = {
  enrollmentId: number;
  choice: EnrollmentChoice;
  enrollmentStatus: EnrollmentStatus;

  /** 수락 가능 여부(파트 인원 다 찼으면 false) */
  enrollmentAcceptable: boolean;

  applicantId: number;
  applicantName: string;
  applicantPart: Part;
  applicantSchool: string;
};

/** 팀장: 받은 지원 내역(현황) 조회 도메인 */
export type ReceivedEnrollmentsData = {
  /** 해당 지원 기간이 종료되었는지 */
  scheduleEnded: boolean;
  enrollments: ReceivedEnrollment[];
};

/** =========================
 * DTO (Backend Response)
 * ======================= */

export type ReceivedEnrollmentDto = {
  enrollmentId: number;
  choice: EnrollmentChoice;
  enrollmentStatus: EnrollmentStatus;
  enrollmentAcceptable: boolean;
  applicantId: number;
  applicantName: string;
  applicantPart: Part;
  applicantSchool: string;
};

export type GetReceivedEnrollmentsResponseDto = {
  scheduleEnded: boolean;
  enrollments: ReceivedEnrollmentDto[];
};

/** =========================
 * 조회 가능 여부(Readabilities)
 * ======================= */

export type EnrollmentReadability = {
  scheduleType: EnrollmentScheduleType;
  readable: boolean;
};

export type EnrollmentReadabilityDto = EnrollmentReadability;

/** =========================
 * UI 전용 Row 타입 (표 렌더링용)
 * - ApplyStatusSection / ApplyStatusTable에서 사용
 * ======================= */
export type ApplyStatusRow = {
  id: number; // enrollmentId string
  priorityLabel: string; // "1지망" | "2지망" | "3지망"
  name: string;
  partLabel: string; // "프론트엔드 (웹)" 같은 화면 표시용
  school: string;
  applicantId: number;
  status: EnrollmentStatus;
  enrollmentAcceptable: boolean;
};

export type SentEnrollment = {
  enrollmentId: number;
  ideaId: number;

  choice: EnrollmentChoice;
  enrollmentStatus: EnrollmentStatus;

  ideaTitle: string;
  ideaIntroduction: string;

  enrollmentPart: Part;
  maxMemberCountOfPart: number;
  applicantCount: number;
};

export type SentEnrollmentsData = {
  scheduleEnded: boolean;
  enrollments: SentEnrollment[];
};

export type SentEnrollmentDto = SentEnrollment;

export type GetSentEnrollmentsResponseDto = {
  scheduleEnded: boolean;
  enrollments: SentEnrollmentDto[];
};

export type EnrollmentPriority = 1 | 2 | 3;

export type MemberSentCardStatus = 'WAITING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

/** 팀원 지원 현황 - UI에서 사용하는 카드 모델 */
export type MemberSentApplyCard = {
  enrollmentId: number;
  phase: ApplyPhase;
  priority: EnrollmentPriority;

  ideaId?: number;

  projectName: string;
  oneLiner: string;

  // 아래 3개는 카드에서 추가정보 표시에 쓰일 수 있어서 유지
  enrollmentPart: Part;
  maxMemberCountOfPart: number;
  applicantCount: number;

  status: MemberSentCardStatus;
};

export type DetermineEnrollmentBody = {
  /** true면 수락, false면 거절 */
  accept: boolean;
};

export type DetermineEnrollmentParams = {
  enrollmentId: number;
  body: DetermineEnrollmentBody;
};

export type CancelEnrollmentParams = {
  enrollmentId: number;
};
