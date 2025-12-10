import { MyApplyStatus } from '../components/MyTeam/ApplyStatusBadge';

export type MemberApplyPriority = 1 | 2 | 3;

/** 1차 / 2차 지원기간 구분 */
export type MemberApplyPhase = 'first' | 'second';

export type MemberApplyData = {
  id: string;
  phase: MemberApplyPhase;
  priority: MemberApplyPriority; // 1, 2, 3 지망
  projectName: string; // 아이디어 이름
  oneLiner: string; // 한 줄 소개
  partName: string; // 지원 파트
  applicantCount: number; // 현재 지원자 수
  capacity: number; // 목표 인원
  status: MyApplyStatus; // 대기/수락/거절
};

/** 1차 지원기간 - 결과 발표 전 UI 확인용 mock */
export const mockMemberApplyCardsBeforeResult: MemberApplyData[] = [
  {
    id: 'first-1',
    phase: 'first',
    priority: 1,
    projectName: '리빙메이트',
    oneLiner:
      '룸메를 찾아주는 플랫폼 애도 한줄 넘으면 쩜쩜쩜 처리되는데 애초에 한줄소개가 50자를 넘어갈 일이 있을까 싶긴...',
    partName: '프론트엔드 (모바일)',
    applicantCount: 10,
    capacity: 2,
    status: 'PENDING',
  },
  {
    id: 'first-2',
    phase: 'first',
    priority: 2,
    projectName: '아이디어명',
    oneLiner: '아이디어 한줄소개',
    partName: '프론트엔드 (모바일)',
    applicantCount: 10,
    capacity: 2,
    status: 'PENDING',
  },
];

/** 1차 지원기간 - 결과 발표 후 UI 확인용 mock */
export const mockMemberApplyCardsAfterResult: MemberApplyData[] = [
  {
    id: 'apply-1',
    phase: 'first',
    priority: 1,
    projectName: '아이디어명',
    oneLiner: '아이디어 한줄소개',
    partName: '프론트엔드 (모바일)',
    applicantCount: 10,
    capacity: 2,
    status: 'ACCEPTED', // 1지망 합격
  },
  {
    id: 'apply-2',
    phase: 'first',
    priority: 2,
    projectName: '아이디어명',
    oneLiner: '아이디어 한줄소개',
    partName: '프론트엔드 (모바일)',
    applicantCount: 10,
    capacity: 2,
    status: 'REJECTED', // 2지망 불합격
  },
];

// 결과 발표 전후 조절
export const mockMemberApplyCards = mockMemberApplyCardsBeforeResult;
