import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';

import type {
  CreateProjectGalleryResponseDto,
  GenerationTab,
  GenerationValue,
  MemberRole,
  Part,
  ProjectDetail,
  ProjectDetailMember,
  ProjectGalleryLeaderProfile,
  ProjectGalleryListItem,
  ProjectGalleryMemberSearchItem,
  ProjectGalleryMemberSearchResponse,
  ProjectGalleryUpsertBody,
  ServiceStatus,
  UpdateProjectGalleryResponseDto,
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
  leaderProfile: () => [...projectGalleryKeys.all, 'leaderProfile'] as const,
  update: (projectId: number) => [...projectGalleryKeys.all, 'update', projectId] as const,
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

interface GalleryProjectMemberDetailDto {
  userId: number;
  memberRole: MemberRole;
  name: string;
  school: string;
  generationAndPosition: string;
  part: Part;
}

interface GetGalleryProjectDetailResponse {
  galleryProjectId: number;
  projectName: string;
  generation: GenerationValue;
  shortDescription: string;
  serviceStatus: ServiceStatus;
  description: string; // markdown 본문

  leader: GalleryProjectMemberDetailDto; // ✅ 추가/변경
  members: GalleryProjectMemberDetailDto[]; // ✅ 변경

  thumbnailUrl?: string | null;
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

/** 최소 작성하기 응답 */
type PostProjectGalleryResponseDto = CreateProjectGalleryResponseDto;

interface GetLeaderProfileResponseDto {
  userId: number;
  name: string;
  school: string;
  generationAndPosition: string;
}

function mapLeaderProfileDtoToDomain(
  dto: GetLeaderProfileResponseDto
): ProjectGalleryLeaderProfile {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    badge: dto.generationAndPosition, // ✅ ProjectMemberBase의 badge로 매핑
  };
}

type PatchProjectGalleryResponseDto = UpdateProjectGalleryResponseDto;

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

function mapDetailMemberDtoToDomain(dto: GalleryProjectMemberDetailDto): ProjectDetailMember {
  return {
    userId: dto.userId,
    name: dto.name,
    school: dto.school,
    badge: dto.generationAndPosition,
    memberRole: dto.memberRole,
    part: dto.part,
  };
}

function mapDetailDtoToDomain(dto: GetGalleryProjectDetailResponse): ProjectDetail {
  return {
    id: dto.galleryProjectId,
    title: dto.projectName,
    generation: dto.generation,
    shortDescription: dto.shortDescription,
    status: dto.serviceStatus,
    longDescription: dto.description,

    leader: dto.leader ? mapDetailMemberDtoToDomain(dto.leader) : null, // ✅ 이제 leader는 dto.leader
    members: (dto.members ?? []).map(mapDetailMemberDtoToDomain),

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

/* =========================================================
 * API: Create (프로젝트 작성하기)
 * POST /project-gallery
 * ======================================================= */
export async function createProjectGallery(
  body: ProjectGalleryUpsertBody
): Promise<CreateProjectGalleryResponseDto> {
  const res = await api.post<PostProjectGalleryResponseDto>('/project-gallery', body);
  return res.data;
}

export function useCreateProjectGallery(
  options?: UseMutationOptions<CreateProjectGalleryResponseDto, Error, ProjectGalleryUpsertBody>
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation<CreateProjectGalleryResponseDto, Error, ProjectGalleryUpsertBody>({
    mutationFn: createProjectGallery,

    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: projectGalleryKeys.all });

      // 타입 정의가 4-인자(onMutateResult 포함)로 잡혀있는 환경 대응
      if (userOnSuccess) {
        // onMutateResult 자리에 undefined를 넣어 4개 인자로 호출
        (userOnSuccess as any)(data, variables, undefined, context);
      }
    },

    ...restOptions,
  });
}

/* =========================================================
 * API: Leader Profile (팀장 영역 자동 세팅용)
 * GET /project-gallery/members/me  (※ 서버에 맞게 경로만 수정)
 * ======================================================= */
export async function fetchProjectGalleryLeaderProfile(): Promise<ProjectGalleryLeaderProfile> {
  const res = await api.get<GetLeaderProfileResponseDto>('/project-gallery/exhibitor');
  return mapLeaderProfileDtoToDomain(res.data);
}

export function useProjectGalleryLeaderProfile(
  options?: Omit<UseQueryOptions<ProjectGalleryLeaderProfile, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ProjectGalleryLeaderProfile, Error>({
    queryKey: projectGalleryKeys.leaderProfile(),
    queryFn: fetchProjectGalleryLeaderProfile,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

/* =========================================================
 * API: Update (프로젝트 수정하기)
 * ======================================================= */

export async function updateProjectGallery(params: {
  projectId: number;
  body: ProjectGalleryUpsertBody;
}): Promise<UpdateProjectGalleryResponseDto> {
  const { projectId, body } = params;

  const res = await api.put<PatchProjectGalleryResponseDto>(`/project-gallery/${projectId}`, body);
  return res.data;
}

export function useUpdateProjectGallery(
  options?: UseMutationOptions<
    CreateProjectGalleryResponseDto,
    Error,
    { projectId: number; body: ProjectGalleryUpsertBody }
  >
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation<
    CreateProjectGalleryResponseDto,
    Error,
    { projectId: number; body: ProjectGalleryUpsertBody }
  >({
    mutationFn: updateProjectGallery,

    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: projectGalleryKeys.all });

      qc.invalidateQueries({ queryKey: projectGalleryKeys.detail(variables.projectId) });

      if (userOnSuccess) {
        (userOnSuccess as any)(data, variables, undefined, context);
      }
    },

    ...restOptions,
  });
}
