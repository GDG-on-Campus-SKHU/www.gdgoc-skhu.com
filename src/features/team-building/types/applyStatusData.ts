// 지원 상태 타입
export type ApplyStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// 1차 / 2차 구분
export type ApplyPhase = 'FIRST' | 'SECOND';

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

// 1차 지원
export const mockFirstPhaseApplicants: ApplyApplicant[] = [
  {
    id: 'f1',
    phase: 'FIRST',
    priorityLabel: '2지망',
    name: '주현지',
    part: '디자인',
    school: '성공회대학교',
    status: 'PENDING',
  },
  {
    id: 'f2',
    phase: 'FIRST',
    priorityLabel: '3지망',
    name: '김태우',
    part: '백엔드',
    school: '성공회대학교',
    status: 'REJECTED',
  },
  {
    id: 'f3',
    phase: 'FIRST',
    priorityLabel: '1지망',
    name: '황재현',
    part: '프론트엔드 (웹)',
    school: '성공회대학교',
    status: 'REJECTED',
  },
  {
    id: 'f4',
    phase: 'FIRST',
    priorityLabel: '2지망',
    name: '강민정',
    part: '디자인',
    school: '성공회대학교',
    status: 'ACCEPTED',
  },
  {
    id: 'f5',
    phase: 'FIRST',
    priorityLabel: '3지망',
    name: '이서영',
    part: '기획',
    school: '성공회대학교',
    status: 'PENDING',
  },
  {
    id: 'f6',
    phase: 'FIRST',
    priorityLabel: '3지망',
    name: '윤준석',
    part: '백엔드',
    school: '성공회대학교',
    status: 'ACCEPTED',
  },
];

// 2차 지원
export const mockSecondPhaseApplicants: ApplyApplicant[] = [
  {
    id: 's1',
    phase: 'SECOND',
    priorityLabel: '1지망',
    name: '김태우',
    part: '백엔드',
    school: '성공회대학교',
    status: 'PENDING',
  },
  {
    id: 's2',
    phase: 'SECOND',
    priorityLabel: '1지망',
    name: '김준',
    part: '프론트엔드 (웹)',
    school: '성공회대학교',
    status: 'REJECTED',
  },
  {
    id: 's3',
    phase: 'SECOND',
    priorityLabel: '1지망',
    name: '이재민',
    part: '프론트엔드 (모바일)',
    school: '숭실대학교',
    status: 'REJECTED',
  },
  {
    id: 's4',
    phase: 'SECOND',
    priorityLabel: '2지망',
    name: '홍길동',
    part: '프론트엔드 (모바일)',
    school: '서울과학기술대학교',
    status: 'ACCEPTED',
  },
  {
    id: 's5',
    phase: 'SECOND',
    priorityLabel: '3지망',
    name: '홍길동',
    part: '프론트엔드 (모바일)',
    school: '서울여자대학교',
    status: 'PENDING',
  },
];
