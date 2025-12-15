import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';

import { api } from './api';
import { projectGalleryKeys } from './projectGallery.api'; // import 추가

/* =========================================================
 * Query Keys
 * ======================================================= */
export const mypageProjectKeys = {
  all: ['mypageProject'] as const,
  list: () => [...mypageProjectKeys.all, 'list'] as const,
};

/* =========================================================
 * DTO Types (Backend Response Shape)
 * ======================================================= */
interface MyPageProjectMemberDto {
  userId: number;
  name: string;
  part: string;
}

interface MyPageProjectDto {
  projectId: number;
  thumbnailImageUrl: string;
  projectName: string;
  exhibited: boolean;
  shortIntroduction: string;
  myRole: 'LEADER' | 'MEMBER';
  leader: MyPageProjectMemberDto;
  members: MyPageProjectMemberDto[];
}

type GetMyPageProjectsResponse = MyPageProjectDto[];

interface UpdateProjectExhibitRequest {
  projectId: number;
  exhibited: boolean;
}

/* =========================================================
 * Domain Types
 * ======================================================= */
export interface MyPageProjectMember {
  userId: number;
  name: string;
  part: string;
}

export interface MyPageProject {
  projectId: number;
  thumbnailUrl: string;
  projectName: string;
  exhibited: boolean;
  description: string;
  isLeader: boolean;
  leader: MyPageProjectMember;
  members: MyPageProjectMember[];
}

/* =========================================================
 * Utils
 * ======================================================= */
function mapMyPageProjectDtoToDomain(dto: MyPageProjectDto): MyPageProject {
  return {
    projectId: dto.projectId,
    thumbnailUrl: dto.thumbnailImageUrl,
    projectName: dto.projectName,
    exhibited: dto.exhibited,
    description: dto.shortIntroduction,
    isLeader: dto.myRole === 'LEADER',
    leader: dto.leader,
    members: dto.members,
  };
}

/* =========================================================
 * API: Get My Page Projects
 * ======================================================= */
export async function fetchMyPageProjects(): Promise<MyPageProject[]> {
  const res = await api.get<GetMyPageProjectsResponse>('/mypage/projects');
  return (res.data ?? []).map(mapMyPageProjectDtoToDomain);
}

export function useMyPageProjects(
  options?: Omit<UseQueryOptions<MyPageProject[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<MyPageProject[], Error>({
    queryKey: mypageProjectKeys.list(),
    queryFn: fetchMyPageProjects,
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
}

/* =========================================================
 * API: Update Project Exhibit Status (전시 여부)
 * ======================================================= */
export async function updateProjectExhibit(data: UpdateProjectExhibitRequest): Promise<void> {
  await api.put(`/mypage/mypage/projects/exhibit`, {
    projectId: data.projectId,
    exhibited: data.exhibited,
  });
}

export function useUpdateProjectExhibit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectExhibit,
    onSuccess: () => {
      // 마이 프로젝트 목록 갱신
      queryClient.invalidateQueries({ queryKey: mypageProjectKeys.list() });
      // 프로젝트 갤러리 목록도 갱신 (전시 여부가 변경되었으므로)
      queryClient.invalidateQueries({ queryKey: projectGalleryKeys.all });
    },
  });
}
