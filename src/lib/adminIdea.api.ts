import { api } from './api';

/* ======================================================
 * Common Types
 * ====================================================== */

/**
 * 공통 페이지네이션 정보
 */
export interface AdminPageInfo {
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

/* ======================================================
 * Project (Admin)
 * ====================================================== */

/**
 * 관리자 프로젝트 요약 정보
 */
export interface AdminProject {
  projectId: number;
  projectName: string;
  startAt: string | null;
  endAt: string | null;
}

/**
 * 관리자 프로젝트 목록 응답
 */
export interface AdminProjectListResponse {
  projects: AdminProject[];
  pageInfo: AdminPageInfo;
}

/**
 * 관리자 프로젝트 목록 조회
 * - page는 0-based
 */
export const getAdminProjects = (params: {
  page: number;
  size: number;
  sortBy?: 'id' | 'name';
  order?: 'ASC' | 'DESC';
}) =>
  api.get<AdminProjectListResponse>('/admin/projects', {
    params: {
      page: params.page,
      size: params.size,
      sortBy: params.sortBy ?? 'id',
      order: params.order ?? 'ASC',
    },
  });

/* ======================================================
 * Idea (Admin - List)
 * ====================================================== */

/**
 * 관리자 아이디어 요약 정보
 */
export interface AdminIdea {
  ideaId: number;
  title: string;
  introduction: string;
  currentMemberCount: number;
  maxMemberCount: number;
  deleted: boolean;
  authorName?: string;
}

/**
 * 관리자 아이디어 목록 응답
 */
export interface AdminIdeaListResponse {
  ideas: AdminIdea[];
  pageInfo: AdminPageInfo;
}

/**
 * 특정 프로젝트의 아이디어 목록 조회 (관리자)
 * - page는 0-based
 */
export const getAdminProjectIdeas = (params: {
  projectId: number;
  page: number;
  size: number;
  sortBy?: 'id';
  order?: 'ASC' | 'DESC';
}) =>
  api.get<AdminIdeaListResponse>(
    `/admin/projects/${params.projectId}/ideas`,
    {
      params: {
        page: params.page,
        size: params.size,
        sortBy: params.sortBy ?? 'id',
        order: params.order ?? 'ASC',
      },
    }
  );

/* ======================================================
 * Idea (Admin - Detail)
 * ====================================================== */

/**
 * 아이디어 팀원 정보
 */
export interface AdminIdeaMember {
  userId: number;
  memberName: string;
  memberRole: 'CREATOR' | 'MEMBER';
  confirmed: boolean;
}

/**
 * 팀 파트별 모집 현황
 */
export interface AdminIdeaRoster {
  part: 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';
  currentMemberCount: number;
  maxMemberCount: number;
  members: AdminIdeaMember[];
}

/**
 * 관리자 아이디어 상세 정보
 */
export interface AdminIdeaDetail {
  ideaId: number;
  title: string;
  introduction: string;
  description: string;
  topicId: number;
  topic: string;
  deleted: boolean;

  creator: {
    creatorName: string;
    part: 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';
    school: string;
  };

  rosters: AdminIdeaRoster[];
}

/**
 * 특정 아이디어 상세 조회 (관리자)
 */
export const getAdminProjectIdeaDetail = (params: {
  projectId: number;
  ideaId: number;
}) =>
  api.get<AdminIdeaDetail>(
    `/admin/projects/${params.projectId}/ideas/${params.ideaId}`
  );

/* ======================================================
 * Idea (Admin - Restore)
 * ====================================================== */

/**
 * 소프트 딜리트된 아이디어 복원
 *
 * - 이미 다른 아이디어를 게시한 사용자가 있으면 4XX
 * - 삭제 상태가 아니면 4XX
 */
export const restoreAdminIdea = (ideaId: number) =>
  api.post<void>(`/admin/ideas/${ideaId}/restore`);

/* ======================================================
 * Idea (Admin - Hard Delete)
 * ====================================================== */

/**
 * 관리자 아이디어 완전 삭제
 *
 * ⚠️ DB에서 실제 삭제되며 복구 불가
 */
export const deleteAdminIdea = (ideaId: number) =>
  api.delete<void>(`/admin/ideas/${ideaId}`);

/* ======================================================
 * Idea (Admin - Remove Member)
 * ====================================================== */

/**
 * 아이디어에 소속된 팀원 제거
 *
 * ⚠️ 팀장(CREATOR)은 제거 불가
 */
export const removeAdminIdeaMember = (params: {
  ideaId: number;
  memberId: number;
}) =>
  api.delete<void>(
    `/admin/ideas/${params.ideaId}/members/${params.memberId}`
  );

/* ======================================================
 * Idea (Admin - Update)
 * ====================================================== */

/**
 * 파트별 최대 인원 설정
 */
export interface AdminIdeaCompositionRequest {
  part: 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';
  maxCount: number;
}

/**
 * 관리자 아이디어 수정 요청 DTO
 *
 * ⚠️ maxCount는 현재 인원수보다 작을 수 없음
 */
export interface AdminIdeaUpdateRequest {
  title: string;
  introduction: string;
  description: string;
  topicId: number;
  creatorPart: 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';
  compositions: AdminIdeaCompositionRequest[];
}

/**
 * 관리자 아이디어 수정
 */
export const updateAdminIdea = (params: {
  ideaId: number;
  data: AdminIdeaUpdateRequest;
}) =>
  api.put<void>(`/admin/ideas/${params.ideaId}`, params.data);
