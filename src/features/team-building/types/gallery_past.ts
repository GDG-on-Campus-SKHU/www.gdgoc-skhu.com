/** api 연동하면서 기존 gallery.ts 내 임시데이터를 이곳으로 분리 (api 연동 완료 후 삭제해주세용) */
export type GenerationTab = '전체' | '25-26' | '24-25' | '이전 기수';

// StatusBadge에서 운영상태에 대해 실제 Enum 값으로 맞춰서 수정한 상태라 여기 타입도 같이 임시로 맞춰서 바꿨어요
// api 연동 시 gallery.ts의 ServiceStatus 사용
export type ProjectStatus = 'IN_SERVICE';

export type Project = {
  id: string;
  title: string;
  description: string;
  generation: Exclude<GenerationTab, '전체'>;
  status?: ProjectStatus;
  thumbnailUrl: string;
  team?: string;
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '25-26',
    status: 'IN_SERVICE',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'p2',
    title: '프로젝트명',
    description: '프로젝트 한줄소개',
    generation: '24-25',
    status: 'IN_SERVICE',
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
    status: 'IN_SERVICE',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
];
