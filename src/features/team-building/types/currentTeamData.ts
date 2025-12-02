/** 팀원 정보 */
export type MyTeamMember = {
  id: string;
  name: string;
  /** 이 파트의 리더인지 여부 */
  isLeader?: boolean;
};

/** 각 파트 */
export type MyTeamPart = {
  id: string;
  name: string;
  capacity: number;
  isRecruiting: boolean;
  members: MyTeamMember[];
};

/** 임시 데이터 */
export const MOCK_PARTS: MyTeamPart[] = [
  {
    id: 'PLAN',
    name: '기획',
    capacity: 1,
    isRecruiting: true,
    members: [{ id: 'u1', name: '홍길동', isLeader: true }],
  },
  {
    id: 'DESIGN',
    name: '디자인',
    capacity: 2,
    isRecruiting: true,
    members: [
      { id: 'u2', name: '홍길동' },
      { id: 'u3', name: '홍길동' },
    ],
  },
  {
    id: 'AI_ML',
    name: 'AI/ML',
    capacity: 0,
    isRecruiting: false,
    members: [],
  },
  {
    id: 'FE_WEB',
    name: '프론트엔드 (웹)',
    capacity: 3,
    isRecruiting: true,
    members: [],
  },
  {
    id: 'FE_MOBILE',
    name: '프론트엔드 (모바일)',
    capacity: 0,
    isRecruiting: false,
    members: [],
  },
  {
    id: 'BE',
    name: '백엔드',
    capacity: 4,
    isRecruiting: true,
    members: [
      { id: 'u4', name: '홍길동' },
      { id: 'u5', name: '홍길동' },
      { id: 'u6', name: '홍길동' },
      { id: 'u7', name: '홍길동' },
    ],
  },
];
