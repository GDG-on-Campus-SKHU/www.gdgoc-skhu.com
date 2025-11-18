export type GenerationTab = '전체' | '25-26' | '24-25' | '이전 기수';
export type ProjectStatus = 'service';

export type Project = {
  id: string;
  title: string;
  description: string;
  generation: Exclude<GenerationTab, '전체'>;
  status?: ProjectStatus;
  thumbnailUrl: string;
  team?: string;
};

export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  status?: ProjectStatus;
  leader: { name: string; role?: string };
  members: Array<{ name: string; role?: string }>;
};

/** 임시 데이터 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '25-26',
    status: 'service',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p2',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '24-25',
    status: 'service',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p3',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '이전 기수',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p4',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '이전 기수',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p5',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '24-25',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p6',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '25-26',
    status: 'service',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
];

const MOCK_DETAILS: Record<string, ProjectDetail> = {
  p1: {
    id: 'p1',
    title: '프로젝트 명',
    description: '프로젝트 한줄소개',
    status: 'service',
    leader: { name: '윤준석', role: '백엔드' },
    members: [
      { name: '권지후', role: '기획' },
      { name: '최인석', role: 'AI/ML' },
      { name: '조정현', role: '디자인' },
      { name: '이솔', role: '프론트엔드 (웹)' },
    ],
    // ui 확인을 위해 각각 스타일 조정
    longDescription: `
      <h2 style="font-size: 24px; font-weight: 500; margin-bottom: 20px;">
        청년들의 월세 부담을 덜어줄 메이트, 리빙메이트
      </h2>

      <p style="font-size: 18px; font-weight: 500;">
        다들 월세 얼마씩 내세요?
      </p>

      <p style="font-size: 16px; font-weight: 500;">
        저는 80만원이나 내고 있는데, 이걸 반반 부담할 친구가 있다면 얼마나 좋을까요?
      </p>
    `,
  },
};

// 임시 상세조회 함수
export const getMockProjectDetailById = (id: string): ProjectDetail | null => {
  const detail = MOCK_DETAILS[id];

  return detail ?? MOCK_DETAILS['p1'] ?? null; // ui 확인용이므로 p1 데이터로 전부 fallback
};
