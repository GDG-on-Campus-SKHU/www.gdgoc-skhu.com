export interface ProfileItem {
  label: string;
  value: string;
  isPlaceholder?: boolean;
  component?: React.ReactNode;
}

export const TECH_STACK_OPTIONS: string[] = [
  'Adobe After Effect',
  'javascript',
  'typescript',
  'java',
  'python',
];

export type TechStack = (typeof TECH_STACK_OPTIONS)[number];
