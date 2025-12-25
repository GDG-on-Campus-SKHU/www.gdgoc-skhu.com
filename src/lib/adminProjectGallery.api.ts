import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import { api } from './api';

/* =========================================================
 * Query Keys
 * ======================================================= */
export const adminProjectGalleryKeys = {
  all: ['adminProjectGallery'] as const,
  lists: () => [...adminProjectGalleryKeys.all, 'list'] as const,
  list: (filter?: string) => [...adminProjectGalleryKeys.lists(), { filter }] as const,
  details: () => [...adminProjectGalleryKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminProjectGalleryKeys.details(), id] as const,
  members: (keyword?: string) => [...adminProjectGalleryKeys.all, 'members', { keyword }] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */

export interface ProjectMemberDto {
  userId: number;
  name: string;
  school: string;
  generations: Array<{
    id: number;
    generation: string;
    position: string;
    isMain: boolean;
  }>;
  memberRole: string;
  part: string;
}

export interface ProjectGalleryListItemDto {
  id: number;
  projectName: string;
  generation: string;
  exhibited: boolean;
  createdAt: string;
}

export interface ProjectGalleryDetailDto {
  projectId: number;
  projectName: string;
  generation: string;
  shortDescription: string;
  serviceStatus: string;
  exhibited: boolean;
  description: string;
  leader: ProjectMemberDto;
  members: ProjectMemberDto[];
  thumbnailUrl?: string;
}

export interface UpdateProjectGalleryRequestDto {
  projectName: string;
  generation: string;
  shortDescription: string;
  serviceStatus: 'IN_SERVICE' | 'NOT_IN_SERVICE';
  exhibited: boolean;
  description: string;
  leaderId: number;
  leaderPart: string;
  members: Array<{
    userId: number;
    part: string;
  }>;
  thumbnailUrl: string;
}

export interface SearchMemberDto {
  userId: number;
  name: string;
  school: string;
  generationAndPosition: string;
  isSelected: boolean;
}

export interface SearchMembersResponseDto {
  members: SearchMemberDto[];
}

type GetProjectGalleryListResponse = ProjectGalleryListItemDto[];
type GetProjectGalleryDetailResponse = ProjectGalleryDetailDto;

/* =========================================================
 * Domain Types
 * ======================================================= */

export interface ProjectGalleryListItem {
  id: number;
  projectName: string;
  generation: string;
  exhibited: boolean;
  createdAt: string;
}

export interface ProjectMember {
  userId: number;
  name: string;
  school: string;
  generations: Array<{
    id: number;
    generation: string;
    position: string;
    isMain: boolean;
  }>;
  memberRole: string;
  part: string;
}

export interface ProjectGalleryDetail {
  projectId: number;
  projectName: string;
  generation: string;
  shortDescription: string;
  serviceStatus: string;
  exhibited: boolean;
  description: string;
  leader: ProjectMember;
  members: ProjectMember[];
  thumbnailUrl?: string;
}

export interface SearchMember {
  userId: number;
  name: string;
  school: string;
  generationAndPosition: string;
  isSelected: boolean;
}

/* =========================================================
 * Utils (Mappers)
 * ======================================================= */

function mapListItemDtoToDomain(dto: ProjectGalleryListItemDto): ProjectGalleryListItem {
  return {
    id: dto.id,
    projectName: dto.projectName,
    generation: dto.generation,
    exhibited: dto.exhibited,
    createdAt: dto.createdAt,
  };
}

function mapMemberDtoToDomain(dto: ProjectMemberDto): ProjectMember {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    generations: dto.generations,
    memberRole: dto.memberRole,
    part: dto.part,
  };
}

function mapDetailDtoToDomain(dto: ProjectGalleryDetailDto): ProjectGalleryDetail {
  return {
    projectId: dto.projectId,
    projectName: dto.projectName,
    generation: dto.generation,
    shortDescription: dto.shortDescription,
    serviceStatus: dto.serviceStatus,
    exhibited: dto.exhibited,
    description: dto.description,
    leader: mapMemberDtoToDomain(dto.leader),
    members: (dto.members ?? []).map(mapMemberDtoToDomain),
    thumbnailUrl: dto.thumbnailUrl,
  };
}

function mapSearchMemberDtoToDomain(dto: SearchMemberDto): SearchMember {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    generationAndPosition: dto.generationAndPosition,
    isSelected: dto.isSelected,
  };
}

/* =========================================================
 * API Functions
 * ======================================================= */

export async function fetchProjectGalleryList(): Promise<ProjectGalleryListItem[]> {
  const res = await api.get<GetProjectGalleryListResponse>('/admin/gallery-project', {
    params: {
      order: 'DESC',
    },
  });

  return (res.data ?? []).map(mapListItemDtoToDomain);
}

export async function searchProjectGallery(projectName: string): Promise<ProjectGalleryListItem[]> {
  const res = await api.get<GetProjectGalleryListResponse>('/admin/gallery-project/search', {
    params: { projectName },
  });
  return (res.data ?? []).map(mapListItemDtoToDomain);
}

export async function fetchProjectGalleryDetail(projectId: number): Promise<ProjectGalleryDetail> {
  const res = await api.get<GetProjectGalleryDetailResponse>(`/admin/gallery-project/${projectId}`);
  return mapDetailDtoToDomain(res.data);
}

export async function updateProjectGallery(
  projectId: number,
  payload: UpdateProjectGalleryRequestDto
): Promise<void> {
  await api.patch(`/admin/gallery-project/${projectId}`, payload);
}

export async function searchMembersForRegistration(keyword?: string): Promise<SearchMember[]> {
  const res = await api.get<SearchMembersResponseDto>('/project-gallery/members/search', {
    params: { name: keyword },
  });
  return (res.data?.members ?? []).map(mapSearchMemberDtoToDomain);
}

/* =========================================================
 * Hooks
 * ======================================================= */

export function useProjectGalleryList(
  options?: Omit<UseQueryOptions<ProjectGalleryListItem[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProjectGalleryListItem[], Error>({
    queryKey: adminProjectGalleryKeys.list(),
    queryFn: fetchProjectGalleryList,
    ...options,
  });
}

export function useProjectGallerySearch(
  projectName: string,
  options?: Omit<UseQueryOptions<ProjectGalleryListItem[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProjectGalleryListItem[], Error>({
    queryKey: adminProjectGalleryKeys.list(projectName),
    queryFn: () => searchProjectGallery(projectName),
    enabled: !!projectName,
    ...options,
  });
}

export function useProjectGalleryDetail(
  projectId: number,
  options?: Omit<UseQueryOptions<ProjectGalleryDetail, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProjectGalleryDetail, Error>({
    queryKey: adminProjectGalleryKeys.detail(projectId),
    queryFn: () => fetchProjectGalleryDetail(projectId),
    enabled: !!projectId,
    ...options,
  });
}

export function useUpdateProjectGallery(
  options?: UseMutationOptions<
    void,
    Error,
    { projectId: number; payload: UpdateProjectGalleryRequestDto }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }) => updateProjectGallery(projectId, payload),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: adminProjectGalleryKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: adminProjectGalleryKeys.lists() });
    },
    ...options,
  });
}

export function useSearchMembers(
  keyword?: string,
  options?: Omit<UseQueryOptions<SearchMember[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<SearchMember[], Error>({
    queryKey: adminProjectGalleryKeys.members(keyword),
    queryFn: () => searchMembersForRegistration(keyword),
    ...options,
  });
}
