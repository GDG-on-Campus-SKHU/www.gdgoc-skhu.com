import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import type {
  GenerationTab,
  GenerationValue,
  MemberRole,
  Part,
  ProjectDetail,
  ProjectGalleryListItem,
  ProjectGalleryMemberSearchItem,
  ProjectGalleryMemberSearchResponse,
  ServiceStatus,
} from '../features/team-building/types/gallery';
import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const projectGalleryKeys = {
  all: ['projectGallery'] as const,
  list: (tab?: GenerationTab) => [...projectGalleryKeys.all, 'list', tab ?? '전체'] as const,
  detail: (projectId: number) => [...projectGalleryKeys.all, 'detail', projectId] as const,
  memberSearch: (name: string) =>
    [...projectGalleryKeys.all, 'memberSearch', name || '(empty)'] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface GalleryProjectSummaryDto {
  galleryProjectId: number;
  projectName: string;
  shortDescription: string;
  serviceStatus: ServiceStatus;
  generation: GenerationValue; // 서버가 곧 목록에도 포함해줄 예정(가정)
  thumbnailUrl?: string | null;
}

interface GetGalleryProjectsResponse {
  galleryProjectSummaryResponseDtoList: GalleryProjectSummaryDto[];
}

interface GalleryProjectMemberDto {
  userId: number;
  memberRole: MemberRole; // 'LEADER' | 'MEMBER'
  name: string;
  part: Part; // 'PM' | 'DESIGN' | ...
}

interface GetGalleryProjectDetailResponse {
  galleryProjectId: number;
  projectName: string;
  generation: GenerationValue;
  shortDescription: string;
  serviceStatus: ServiceStatus;
  description: string; // markdown 본문
  leaderId?: number;
  members: GalleryProjectMemberDto[];
  thumbnailUrl?: string | null; // 추후 제거될 수 있음
}

interface GalleryMemberSearchDto {
  userId: number;
  name: string;
  school: string;
  generationAndPosition: string;
  isSelected: boolean;
}
interface GetGalleryMemberSearchResponse {
  members: GalleryMemberSearchDto[];
}

/* =========================================================
 * Utils
 * ======================================================= */
function buildGenerationParam(tab?: GenerationTab) {
  // 전체 / 이전 기수는 서버에는 generation을 안 보내고 전체 조회
  if (!tab || tab === '전체' || tab === '이전 기수') return undefined;

  // 여기서 올 수 있는 값은 '25-26' | '24-25'
  const gen: GenerationValue = tab;
  return { generation: gen };
}

function mapSummaryDtoToListItem(dto: GalleryProjectSummaryDto): ProjectGalleryListItem {
  return {
    id: dto.galleryProjectId,
    title: dto.projectName,
    description: dto.shortDescription,
    status: dto.serviceStatus,
    generation: dto.generation,
    thumbnailUrl: dto.thumbnailUrl ?? null,
  };
}

function mapDetailDtoToDomain(dto: GetGalleryProjectDetailResponse): ProjectDetail {
  const members = (dto.members ?? []).map(m => ({
    userId: m.userId,
    memberRole: m.memberRole,
    name: m.name,
    part: m.part,
  }));

  const leader = members.find(m => m.memberRole === 'LEADER') ?? null;

  return {
    id: dto.galleryProjectId,
    title: dto.projectName,
    generation: dto.generation,
    shortDescription: dto.shortDescription,
    status: dto.serviceStatus,
    longDescription: dto.description,
    leaderId: dto.leaderId,
    leader, // 컴포넌트 연결 편리성 위함
    members,
    thumbnailUrl: dto.thumbnailUrl ?? null,
  };
}

function mapMemberSearchDtoToDomain(dto: GalleryMemberSearchDto): ProjectGalleryMemberSearchItem {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    generationAndPosition: dto.generationAndPosition,
    isSelected: dto.isSelected,
  };
}

/* =========================================================
 * API: List
 * ======================================================= */
export async function fetchProjectGalleryList(
  tab?: GenerationTab
): Promise<ProjectGalleryListItem[]> {
  try {
    const res = await api.get<GetGalleryProjectsResponse>('/project-gallery/projects', {
      params: buildGenerationParam(tab),
    });

    const list = res.data.galleryProjectSummaryResponseDtoList ?? [];
    const mapped = list.map(mapSummaryDtoToListItem);

    // "이전 기수" 탭: 22-23, 23-24 만 프론트에서 필터링
    if (tab === '이전 기수') {
      const oldGens: GenerationValue[] = ['22-23', '23-24'];
      return mapped.filter(p => oldGens.includes(p.generation));
    }

    return mapped;
  } catch (error: any) {
    // "등록된 프로젝트가 없음"을 404로 주는 서버 정책 → 빈 배열로 정상 처리
    if (error?.response?.status === 404) return [];
    throw error;
  }
}

export function useProjectGalleryList(tab?: GenerationTab) {
  return useQuery({
    queryKey: projectGalleryKeys.list(tab),
    queryFn: () => fetchProjectGalleryList(tab),
    staleTime: 1000 * 60,
  });
}

/* =========================================================
 * API: Detail
 * ======================================================= */
export async function fetchProjectGalleryDetail(projectId: number): Promise<ProjectDetail> {
  const res = await api.get<GetGalleryProjectDetailResponse>(`/project-gallery/${projectId}`);
  return mapDetailDtoToDomain(res.data);
}

export function useProjectGalleryDetail(
  projectId: number,
  options?: Omit<UseQueryOptions<ProjectDetail, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProjectDetail, Error>({
    queryKey: projectGalleryKeys.detail(projectId),
    queryFn: () => fetchProjectGalleryDetail(projectId),
    enabled: Number.isFinite(projectId) && projectId > 0, // 기본값
    staleTime: 1000 * 60,
    ...options, // 페이지에서 enabled 등 덮어쓰기
  });
}

/* =========================================================
 *  API: Member Search (팀원 등록용)
 * ======================================================= */
export async function fetchProjectGalleryMemberSearch(
  name: string
): Promise<ProjectGalleryMemberSearchResponse> {
  const trimmed = name.trim();
  if (!trimmed) return { members: [] };

  const res = await api.get<GetGalleryMemberSearchResponse>('/project-gallery/members/search', {
    params: { name: trimmed },
  });

  return {
    members: (res.data.members ?? []).map(mapMemberSearchDtoToDomain),
  };
}

export function useProjectGalleryMemberSearch(
  name: string,
  options?: Omit<UseQueryOptions<ProjectGalleryMemberSearchResponse, Error>, 'queryKey' | 'queryFn'>
) {
  const trimmed = name.trim();

  return useQuery<ProjectGalleryMemberSearchResponse, Error>({
    queryKey: projectGalleryKeys.memberSearch(trimmed),
    queryFn: () => fetchProjectGalleryMemberSearch(trimmed),
    enabled: trimmed.length > 0, // 기본: 입력 있을 때만
    staleTime: 1000 * 30,
    ...options,
  });
}
