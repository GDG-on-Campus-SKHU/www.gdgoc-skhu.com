import { api } from './api';

/** =========================
 * Types
 * ========================= */

/** 관리자 프로젝트 */
export interface AdminProject {
  projectId: number;
  projectName: string;
  startAt: string;
  endAt: string | null;
}

/** 공통 페이지 정보 */
export interface AdminPageInfo {
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
}

/** 관리자 프로젝트 목록 응답 */
export interface AdminProjectListResponse {
  projects: AdminProject[];
  pageInfo: AdminPageInfo;
}

/** =========================
 * Admin Idea
 * ========================= */

/**
 * 관리자 아이디어
 * ⚠️ authorName은 현재 백엔드 미지원 (추후 추가 예정)
 */
export interface AdminIdea {
  ideaId: number;
  title: string;
  introduction: string;
  currentMemberCount: number;
  maxMemberCount: number;
  deleted: boolean;

  /** 작성자 이름 (백엔드 추가 예정) */
  authorName?: string;
}

/** 관리자 아이디어 목록 응답 */
export interface AdminIdeaListResponse {
  ideas: AdminIdea[];
  pageInfo: AdminPageInfo;
}

/** =========================
 * API
 * ========================= */

/**
 * 관리자 프로젝트 목록 조회
 * page: 0-based
 */
export const getAdminProjects = (params: {
  page: number;
  size: number;
  sortBy?: 'id' | 'name';
  order?: 'ASC' | 'DESC';
}) => {
  return api.get<AdminProjectListResponse>('/admin/projects', {
    params: {
      page: params.page,
      size: params.size,
      sortBy: params.sortBy ?? 'id',
      order: params.order ?? 'ASC',
    },
  });
};

/**
 * 특정 프로젝트의 아이디어 목록 조회
 * page: 0-based
 */
export const getAdminProjectIdeas = (params: {
  projectId: number;
  page: number;
  size: number;
  sortBy?: 'id';
  order?: 'ASC' | 'DESC';
}) => {
  return api.get<AdminIdeaListResponse>(
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
};

/** 아이디어 상세 (관리자) */
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
    part: string;
    school: string;
  };
  rosters: Array<{
    part: string;
    currentMemberCount: number;
    maxMemberCount: number;
    members: Array<{
      memberId: number;
      name: string;
    }>;
  }>;
}

/**
 * 특정 아이디어 상세 조회 (관리자)
 */
export const getAdminProjectIdeaDetail = (params: {
  projectId: number;
  ideaId: number;
}) => {
  return api.get<AdminIdeaDetail>(
    `/admin/projects/${params.projectId}/ideas/${params.ideaId}`
  );
};
