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
  startAt: string;      // ISO String
  endAt: string | null; // 종료일이 없을 수 있음
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
 *
 * ⚠️ authorName은 현재 백엔드 미지원
 * → 상세 API에서는 creator 객체로 제공됨
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
 * (실제 백엔드 응답 기준)
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
