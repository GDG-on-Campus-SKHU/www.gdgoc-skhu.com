/** 
 * API 연동 완료 후 삭제 예정인 임시 타입 및 데이터
 */

export type ActivityCategory = '카테고리 이름 1' | '카테고리 이름 2';

export type Activity = {
  id: string;
  title: string;
  author: string;
  category: ActivityCategory;
  year: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  date?: string;
  description?: string;
};

/** 임시 데이터 - API 연동 후 삭제 */
export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '테크톡 제목',
    author: '주현지',
    category: '카테고리 이름 1',
    year: '25-26',
    youtubeId: '3fsY8rLvhZ4',
  },
  {
    id: 'a2',
    title: '제목이 길면 밑으로 안내려가고 잘려요 이렇게',
    author: '주현지',
    category: '카테고리 이름 1',
    year: '25-26',
    youtubeId: '3fsY8rLvhZ4',
  },
  {
    id: 'a3',
    title: '제목이 길면 밑으로 안내려가고 잘려요 이렇게',
    author: '주현지',
    category: '카테고리 이름 1',
    year: '25-26',
    youtubeId: '3fsY8rLvhZ4',
  },
  {
    id: 'a4',
    title: '제목이 길면 밑으로 안내려가고 잘려요 이렇게',
    author: '주현지',
    category: '카테고리 이름 2',
    year: '25-26',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'a5',
    title: '테크톡 제목',
    author: '주현지',
    category: '카테고리 이름 2',
    year: '25-26',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'a6',
    title: '제목이 길면 밑으로 안내려가고 잘려요 이렇게',
    author: '주현지',
    category: '카테고리 이름 2',
    year: '25-26',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'a7',
    title: '제목이 길면 밑으로 안내려가고 잘려요 이렇게',
    author: '주현지',
    category: '카테고리 이름 2',
    year: '25-26',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
  {
    id: 'a8',
    title: '테크톡 제목',
    author: '주현지',
    category: '카테고리 이름 2',
    year: '25-26',
    thumbnailUrl: '/gdgoc_logo.svg',
  },
];

/** 임시 유틸 함수 - API 연동 후 삭제 */
export const getActivitiesByCategory = (
  activities: Activity[],
  category: ActivityCategory
): Activity[] => {
  return activities.filter(activity => activity.category === category);
};