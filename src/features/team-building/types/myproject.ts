export type Project = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  team?: string;
};

export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  leader: { name: string; role?: string };
  members: Array<{ name: string; role?: string }>;
  isLeader?: boolean; // 현재 사용자가 팀장인지 여부
  isDisplayed?: boolean; // 전시 여부
};

/** 임시 데이터 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p2',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p3',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p4',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p5',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p6',
    title: '프로젝트명',
    description: '한줄소개',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
];

const MOCK_DETAILS: Record<string, ProjectDetail> = {
  p1: {
    id: 'p1',
    title: '프로젝트명',
    description: '한줄소개',
    leader: { name: '윤준석', role: '백엔드' },
    members: [
      { name: '권지후', role: '기획' },
      { name: '최인석', role: 'AI/ML' },
      { name: '조정현', role: '디자인' },
      { name: '이솔', role: '프론트엔드(웹)' },
    ],
    isLeader: true, // 임시로 true 설정
    isDisplayed: true, // 임시로 전시 여부 true
  },
};

// 임시 상세조회 함수
export const getMockProjectDetailById = (id: string): ProjectDetail | null => {
  const detail = MOCK_DETAILS[id];

  return detail ?? MOCK_DETAILS['p1'] ?? null;
};
