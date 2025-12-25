// src/feature/team-building/IdeaForm/ideaFormUtils.ts

export const PREFERRED_OPTIONS = [
  '기획',
  '디자인',
  '프론트엔드 (웹)',
  '프론트엔드 (모바일)',
  '백엔드',
  'AI/ML',
] as const;

export const TEAM_ROLES = [
  { key: 'planning', label: '기획' },
  { key: 'design', label: '디자인' },
  { key: 'frontendWeb', label: '프론트엔드 (웹)' },
  { key: 'frontendMobile', label: '프론트엔드 (모바일)' },
  { key: 'backend', label: '백엔드' },
  { key: 'aiMl', label: 'AI/ML' },
] as const;

export type TeamRole = (typeof TEAM_ROLES)[number]['key'];
export type IdeaPartCode = 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';

export const TEAM_ROLE_TO_PART: Record<TeamRole, IdeaPartCode> = {
  planning: 'PM',
  design: 'DESIGN',
  frontendWeb: 'WEB',
  frontendMobile: 'MOBILE',
  backend: 'BACKEND',
  aiMl: 'AI',
};

const PREFERRED_LABEL_TO_PART: Record<string, IdeaPartCode> = {
  기획: 'PM',
  디자인: 'DESIGN',
  '프론트엔드 (웹)': 'WEB',
  '프론트엔드 (모바일)': 'MOBILE',
  백엔드: 'BACKEND',
  'AI/ML': 'AI',
};

export const resolveCreatorPart = (preferredPart: string): IdeaPartCode | null => {
  const trimmed = preferredPart.trim();
  if (!trimmed) return null;

  const byRoleKey = TEAM_ROLE_TO_PART[trimmed as TeamRole];
  if (byRoleKey) return byRoleKey;

  if ((Object.values(TEAM_ROLE_TO_PART) as string[]).includes(trimmed)) {
    return trimmed as IdeaPartCode;
  }

  return PREFERRED_LABEL_TO_PART[trimmed] ?? null;
};

// 수정: filter 제거 - 0인 파트도 모두 포함
export const toMemberCompositions = (
  team: Partial<Record<TeamRole, number>>
): Array<{ part: IdeaPartCode; maxCount: number }> =>
  TEAM_ROLES.map(role => {
    const raw = team?.[role.key] ?? 0;
    const numeric = Number(raw);
    const safe = Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
    return { part: TEAM_ROLE_TO_PART[role.key], maxCount: safe };
  });
// .filter(item => item.maxCount > 0); // 이 줄 제거!

export function handlePreferredPartSelect({
  option,
  checked,
  emitFieldChange,
  team,
  preferredPart,
}: {
  option: string;
  checked: boolean;
  emitFieldChange: (name: string, value: string) => void;
  team: Record<string, number>;
  preferredPart: string;
}) {
  if (!checked) return;

  const nextRoleKey = TEAM_ROLES.find(role => role.label === option)?.key ?? null;

  const previousRoleKey = TEAM_ROLES.find(role => role.label === preferredPart)?.key ?? null;

  if (nextRoleKey) {
    const current = team[nextRoleKey] ?? 0;
    emitFieldChange(`team.${nextRoleKey}`, String(current + 1));
  }

  if (previousRoleKey && previousRoleKey !== nextRoleKey) {
    const current = team[previousRoleKey] ?? 0;
    emitFieldChange(`team.${previousRoleKey}`, String(Math.max(0, current - 1)));
  }

  emitFieldChange('preferredPart', option);
}
