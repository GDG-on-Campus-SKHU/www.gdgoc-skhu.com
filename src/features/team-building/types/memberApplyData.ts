import { MyApplyStatus } from '../components/MyTeam/ApplyStatusBadge';

export type MemberApplyPriority = 1 | 2 | 3;

/** 1차 / 2차 지원기간 구분 */
export type ApplyPhase = 'first' | 'second';

export type MemberApplyData = {
  id: string;
  phase: ApplyPhase;
  priority: MemberApplyPriority; // 1, 2, 3 지망
  projectName: string; // 아이디어 이름
  oneLiner: string; // 한 줄 소개
  partName: string; // 지원 파트
  applicantCount: number; // 현재 지원자 수
  capacity: number; // 목표 인원
  status: MyApplyStatus; // 대기/수락/거절
};

// ui 확인을 위해 주석처리하며 경우에 맞게 데이터 사용
export const mockMemberApplyCards: MemberApplyData[] = [
  // {
  //   id: 'p1',
  //   priority: 1,
  //   projectName: '리빙메이트',
  //   oneLiner:
  //     '룸메를 찾아주는 플랫폼 애도 한줄 넘으면 짤짤짤 처리되는데 애초에 한줄소개가 50자를 넘어갈 일이 있을까 싶긴...',
  //   partName: '프론트엔드 (모바일)',
  //   applicantCount: 10,
  //   capacity: 2,
  //   status: 'PENDING',
  // },
  // {
  //   id: 'p2',
  //   priority: 2,
  //   projectName: '캠퍼스 푸드파인더',
  //   oneLiner: '학교 주변 맛집을 큐레이팅하고 리뷰를 모아주는 서비스입니다.',
  //   partName: '백엔드',
  //   applicantCount: 4,
  //   capacity: 1,
  //   status: 'ACCEPTED',
  // },
  // {
  //   id: 'p3',
  //   priority: 3,
  //   projectName: '스터디 메이트',
  //   oneLiner: '비슷한 목표를 가진 학생들을 자동 매칭해주는 스터디 플랫폼입니다.',
  //   partName: '기획',
  //   applicantCount: 7,
  //   capacity: 2,
  //   status: 'REJECTED',
  // },
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
  // {
  //   id: 'apply-1',
  //   phase: 'first',
  //   priority: 1,
  //   projectName: '아이디어명',
  //   oneLiner: '아이디어 한줄소개',
  //   partName: '프론트엔드 (모바일)',
  //   applicantCount: 10,
  //   capacity: 2,
  //   status: 'ACCEPTED', // 1지망 합격
  // },
  // {
  //   id: 'apply-2',
  //   phase: 'first',
  //   priority: 2,
  //   projectName: '아이디어명',
  //   oneLiner: '아이디어 한줄소개',
  //   partName: '프론트엔드 (모바일)',
  //   applicantCount: 10,
  //   capacity: 2,
  //   status: 'REJECTED', // 2지망 불합격
  // },
];
