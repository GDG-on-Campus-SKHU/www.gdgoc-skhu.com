import type { AxiosRequestConfig } from 'axios';

import type { IdeaPartCode } from '../components/IdeaForm/IdeaFormUtils';
import { teamBuildingApi } from './client';

export interface IdeaMemberComposition {
  part: IdeaPartCode;
  maxCount: number;
}

export interface IdeaCreatePayload {
  title: string;
  introduction: string;
  description: string;
  topicId: number;
  creatorPart: IdeaPartCode;
  registerStatus: 'TEMPORARY' | 'REGISTERED';
  compositions: IdeaMemberComposition[];
}

export interface IdeaUpdatePayload {
  title?: string;
  introduction?: string;
  description?: string;
  topicId?: number;
}

export const fetchCurrentTeamBuildingProject = (config?: AxiosRequestConfig) =>
  teamBuildingApi.get('/team-building/projects/current', config);

// ideas.ts 파일 수정
export const fetchIdeas = (
  projectId: number,
  params: {
    page: number;
    size: number;
    sortBy: string;
    order: 'ASC' | 'DESC';
    recruitingOnly: boolean;
    topicId?: number; // 추가
  },
  config?: AxiosRequestConfig
) => teamBuildingApi.get(`/projects/${projectId}/ideas`, { params, ...config });

// ideas.ts

// 아이디어 상세 조회
export const fetchIdeaDetail = (projectId: number, ideaId: number, config?: AxiosRequestConfig) => {
  return teamBuildingApi.get(`/projects/${projectId}/ideas/${ideaId}`, config);
};

export const fetchTemporaryIdea = (projectId: number, config?: AxiosRequestConfig) =>
  teamBuildingApi.get(`/projects/${projectId}/ideas/temporary`, config);

export const fetchRoster = (config?: AxiosRequestConfig) =>
  teamBuildingApi.get('/ideas/roster', config);

// ideas.ts에 추가

// 아이디어 지원
export const applyToIdea = (
  ideaId: number,
  payload: {
    part: string;
    priority: number; // 1, 2, 3
  },
  config?: AxiosRequestConfig
) => {
  return teamBuildingApi.post(`/enrollments/ideas/${ideaId}`, payload, config);
};
// createIdea 함수 수정: ideaId 파라미터 제거, URL 경로 수정
export const createIdea = (
  projectId: number,
  payload: IdeaCreatePayload,
  config?: AxiosRequestConfig
) => teamBuildingApi.post(`/projects/${projectId}/ideas`, payload, config);

export const updateIdea = (
  projectId: number,
  ideaId: number,
  payload: IdeaUpdatePayload,
  config?: AxiosRequestConfig
) => teamBuildingApi.put(`/projects/${projectId}/ideas/${ideaId}`, payload, config);

export const deleteIdea = (projectId: number, ideaId: number, config?: AxiosRequestConfig) =>
  teamBuildingApi.delete(`/projects/${projectId}/ideas/${ideaId}`, config);

export const deleteIdeaMember = (ideaId: number, memberId: number, config?: AxiosRequestConfig) =>
  teamBuildingApi.delete(`/ideas/${ideaId}/members/${memberId}`, config);
