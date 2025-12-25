import type { Part } from './gallery';

/**1/2차 지원 기간 */
export type JoinPhase = 'first' | 'second';

/** 팀원 정보 */
export type MyTeamMember = {
  id: string;
  name: string;
  /** 이 파트의 리더인지 여부 */
  isLeader?: boolean;
  joinPhase?: JoinPhase;
};

/** 각 파트 */
export type MyTeamPart = {
  id: string;
  name: string;
  capacity: number;
  isRecruiting: boolean;
  members: MyTeamMember[];
};

/**
 * 서버에서 내려주는 역할 값 (Swagger 예시)
 * - myRole: 본인의 역할
 * - memberRole: roster 멤버의 역할
 */
export type TeamMemberRole = 'CREATOR' | 'MEMBER';

/** 팀원 구성 - 멤버 */
export type CurrentTeamMember = {
  userId: number;
  memberName: string;
  memberRole: TeamMemberRole;
  confirmed: boolean;
};

/** 파트별 로스터(팀원 구성) */
export type CurrentTeamRoster = {
  part: Part;
  currentMemberCount: number;
  maxMemberCount: number;
  members: CurrentTeamMember[];
};

/** 도메인: 현재 팀원 구성(마이팀 - 팀원 구성) */
export type CurrentTeamData = {
  ideaId: number;
  ideaTitle: string;
  ideaIntroduction: string;
  myRole: TeamMemberRole;
  rosters: CurrentTeamRoster[];
};

/* =========================
 * DTO (Backend Response)
 * ======================= */
export type CurrentTeamMemberDto = {
  userId: number;
  memberName: string;
  memberRole: TeamMemberRole;
  confirmed: boolean;
};

export type CurrentTeamRosterDto = {
  part: Part;
  currentMemberCount: number;
  maxMemberCount: number;
  members: CurrentTeamMemberDto[];
};

export type GetCurrentTeamResponseDto = {
  ideaId: number;
  ideaTitle: string;
  ideaIntroduction: string;
  myRole: TeamMemberRole;
  rosters: CurrentTeamRosterDto[];
};

/** 팀장: 팀원 삭제 */
export type RemoveTeamMemberParams = {
  ideaId: number;
  memberId: number; // 팀원의 userId
};
