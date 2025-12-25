import create from 'zustand';

export interface TeamCounts {
  planning: number;
  design: number;
  frontendWeb: number;
  frontendMobile: number;
  backend: number;
  aiMl: number;
}

export interface Idea {
  id: number;
  topic: string;
  title: string;
  intro: string;
  description: string;
  preferredPart: string;
  team: TeamCounts;
  filledTeam: TeamCounts;
  currentMembers: number;
  totalMembers: number;
  status: '모집 중' | '모집 마감';
}

type IdeaInput = {
  topic: string;
  title: string;
  intro: string;
  description: string;
  preferredPart: string;
  team: TeamCounts;
  filledTeam?: TeamCounts;
  currentMembers?: number;
  totalMembers?: number;
  status?: Idea['status'];
};

interface IdeaStore {
  ideas: Idea[];
  nextId: number; // 다음 ID 추적
  addIdea: (idea: IdeaInput) => Idea;
  getIdeaById: (id: number) => Idea | undefined;
  removeIdea: (id: number) => void;
  addApplicant: (id: number, part: keyof TeamCounts) => boolean;
  hasHydrated: boolean;
  hydrateFromStorage: () => void;
}

const STORAGE_KEY = 'team-building:ideas';
const NEXT_ID_KEY = 'team-building:nextId';

const loadStoredIdeas = (): Idea[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Idea[];
    if (parsed && Array.isArray(parsed.state?.ideas)) return parsed.state.ideas as Idea[];
    return [];
  } catch {
    return [];
  }
};

const loadNextId = (): number => {
  if (typeof window === 'undefined') return 1;
  try {
    const raw = window.localStorage.getItem(NEXT_ID_KEY);
    if (!raw) return 1;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  } catch {
    return 1;
  }
};

const saveIdeas = (ideas: Idea[]) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    // ignore storage errors (quota/unavailable)
  }
};

const saveNextId = (nextId: number) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(NEXT_ID_KEY, String(nextId));
  } catch {
    // ignore storage errors (quota/unavailable)
  }
};

export const createEmptyTeamCounts = (): TeamCounts => ({
  planning: 0,
  design: 0,
  frontendWeb: 0,
  frontendMobile: 0,
  backend: 0,
  aiMl: 0,
});

const clampTeamCounts = (candidate: TeamCounts | undefined, limits: TeamCounts): TeamCounts => {
  const base = createEmptyTeamCounts();
  const source = candidate ?? base;
  (Object.keys(base) as Array<keyof TeamCounts>).forEach(key => {
    const limit = limits[key] ?? 0;
    const value = source[key] ?? 0;
    base[key] = limit > 0 ? Math.min(value, limit) : 0;
  });
  return base;
};

const sumTeamCounts = (team: TeamCounts): number =>
  Object.values(team).reduce((sum, count) => sum + count, 0);

const safePositive = (value: number | undefined | null): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0;

export const resolveTotalMembers = (
  totalMembers: number | undefined,
  team: TeamCounts | undefined
): number => {
  const teamTotal = team ? sumTeamCounts(team) : 0;
  const explicitTotal = safePositive(totalMembers);
  const effective = Math.max(explicitTotal, teamTotal);
  return effective > 0 ? effective : 1;
};

export const useIdeaStore = create<IdeaStore>((set, get) => ({
  ideas: [],
  nextId: 1, // 초기값 1
  hasHydrated: false,

  hydrateFromStorage: () => {
    if (get().hasHydrated) return;
    const stored = loadStoredIdeas();
    const storedNextId = loadNextId();

    // 저장된 아이디어 중 가장 큰 ID + 1과 저장된 nextId 중 큰 값 사용
    const maxIdFromIdeas = stored.reduce((max, idea) => Math.max(max, idea.id), 0);
    const nextId = Math.max(storedNextId, maxIdFromIdeas + 1);

    set({ ideas: stored, nextId, hasHydrated: true });
  },

  addIdea: ({ currentMembers, totalMembers, status, preferredPart, team, filledTeam, ...idea }) => {
    const part = preferredPart ?? '기획';
    const safeTeam: TeamCounts = {
      ...createEmptyTeamCounts(),
      planning: team?.planning ?? 0,
      design: team?.design ?? 0,
      frontendWeb: team?.frontendWeb ?? 0,
      frontendMobile: team?.frontendMobile ?? 0,
      backend: team?.backend ?? 0,
      aiMl: team?.aiMl ?? 0,
    };
    const normalizedFilledTeam = clampTeamCounts(filledTeam, safeTeam);
    const filledTotal = sumTeamCounts(normalizedFilledTeam);
    const total = resolveTotalMembers(totalMembers, safeTeam);
    const current = Math.min(currentMembers ?? filledTotal, total);
    const resolvedStatus: Idea['status'] =
      status ?? (current >= total && total > 0 ? '모집 마감' : '모집 중');

    // 현재 nextId 가져오기
    const currentNextId = get().nextId;

    const newIdea: Idea = {
      id: currentNextId, // 순차적 ID 사용
      preferredPart: part,
      team: safeTeam,
      filledTeam: normalizedFilledTeam,
      currentMembers: current,
      totalMembers: total,
      status: resolvedStatus,
      ...idea,
    };

    set(state => {
      const ideas = [...state.ideas, newIdea];
      const nextId = currentNextId + 1; // ID 증가
      saveIdeas(ideas);
      saveNextId(nextId); // 다음 ID 저장
      return { ideas, nextId };
    });

    return newIdea;
  },

  getIdeaById: id => get().ideas.find(idea => idea.id === id),

  removeIdea: id =>
    set(state => {
      const ideas = state.ideas.filter(item => item.id !== id);
      saveIdeas(ideas);
      return { ideas };
    }),

  addApplicant: (id, part) => {
    const idea = get().getIdeaById(id);
    if (!idea) return false;

    const teamLimits = idea.team ?? createEmptyTeamCounts();
    const limit = teamLimits[part] ?? 0;
    const filledTeam = idea.filledTeam ?? createEmptyTeamCounts();
    const filledCount = filledTeam[part] ?? 0;
    const totalFilled = sumTeamCounts(filledTeam);
    const effectiveTotal = resolveTotalMembers(idea.totalMembers, teamLimits);
    const atCapacity = effectiveTotal > 0 && totalFilled >= effectiveTotal;
    if ((limit > 0 && filledCount >= limit) || atCapacity) {
      return false;
    }

    const nextFilledTeam: TeamCounts = {
      ...filledTeam,
      [part]: limit > 0 ? Math.min(filledCount + 1, limit) : filledCount + 1,
    };
    const nextFilledTotal = sumTeamCounts(nextFilledTeam);
    const nextCurrent = Math.min(nextFilledTotal, effectiveTotal);
    const nextStatus: Idea['status'] =
      nextCurrent >= effectiveTotal && effectiveTotal > 0 ? '모집 마감' : '모집 중';

    set(state => {
      const ideas = state.ideas.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          filledTeam: nextFilledTeam,
          currentMembers: nextCurrent,
          status: nextStatus,
        };
      });
      saveIdeas(ideas);
      return { ideas };
    });

    return true;
  },
}));
