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
