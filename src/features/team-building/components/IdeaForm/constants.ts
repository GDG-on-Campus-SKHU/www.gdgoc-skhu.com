import { TeamRole } from './IdeaFormUtils';

export const MOBILE_BREAKPOINT = '900px';
export const SMALL_BREAKPOINT = '600px';

export const TOPIC_PLACEHOLDER = '주제를 선택해주세요.';
export const TOPIC_OPTIONS = ['전체', '청년 세대의 경제적, 사회적 어려움을 해결하기 위한 솔루션'];

export const TITLE_MAX_LENGTH = 20;
export const INTRO_MAX_LENGTH = 50;

export const DEFAULT_TEAM_COUNTS: Record<TeamRole, number> = {
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
};

export const AUTO_SAVE_PLACEHOLDER = '임시저장 완료 0000.00.00 00:00';
export const SESSION_DRAFT_KEY = 'ideaFormData';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const formatSavedAt = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};
