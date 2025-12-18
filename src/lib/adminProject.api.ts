import { api } from './api';
import { Generation } from './mypageProfile.api';

// ==================== 타입 정의 (Swagger 스키마 기반) ====================

// 파트 타입
export type Part = 'PM' | 'DESIGN' | 'WEB' | 'MOBILE' | 'BACKEND' | 'AI';

// 일정 타입 (실제 API 응답 기반)
export type ScheduleType =
  | 'IDEA_REGISTRATION'
  | 'FIRST_TEAM_BUILDING'
  | 'FIRST_TEAM_BUILDING_ANNOUNCEMENT'
  | 'SECOND_TEAM_BUILDING'
  | 'SECOND_TEAM_BUILDING_ANNOUNCEMENT'
  | 'THIRD_TEAM_BUILDING'
  | 'FINAL_RESULT_ANNOUNCEMENT';

// 일정 항목
export type Schedule = {
  scheduleType: ScheduleType;
  startAt: string | null;
  endAt: string | null;
};

// 파트 가용 여부
export type AvailablePart = {
  part: Part;
  available: boolean;
};

// 참여자
export type Participant = {
  participantId: number;
  userId: number;
  name: string;
  school: string;
  generation: string;
  part: Part;
};

// GET /admin/projects/modifiable 응답 타입
export type ModifiableProject = {
  projectId: number;
  projectName: string;
  maxMemberCount: number;
  topics: string[];
  availableParts?: AvailablePart[];
  schedules: Schedule[];
  participants: Participant[];
};

// 승인된 유저 타입
export type ApprovedUser = {
  id: number;
  userName: string;
  school: string;
  generations: Generation[];
  part: string;
};

export type ApprovedUsersResponse = {
  users: ApprovedUser[];
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
};

// ==================== 관리자 프로젝트 관리 API ====================

// GET /admin/projects/modifiable - 수정 가능한 프로젝트 조회
export const getModifiableProject = async (): Promise<ModifiableProject> => {
  const response = await api.get('/admin/projects/modifiable');
  return response.data;
};

// POST /admin/projects - 새 프로젝트 생성
export const createProject = async (data: { projectName: string }): Promise<ModifiableProject> => {
  const response = await api.post('/admin/projects', data);
  return response.data;
};

// PUT /admin/projects/{projectId}/name - 프로젝트 이름 수정
export const updateProjectName = async (
  projectId: number,
  data: { projectName: string }
): Promise<ModifiableProject> => {
  const response = await api.put(`/admin/projects/${projectId}/name`, data);
  return response.data;
};

// DELETE /admin/projects/{projectId} - 프로젝트 삭제
export const deleteProject = async (projectId: number): Promise<void> => {
  await api.delete(`/admin/projects/${projectId}`);
};

// PUT /admin/projects/{projectId} - 프로젝트 정보 수정 (전체)
// 발표 일정(ANNOUNCEMENT)의 endAt 값은 null이어야 함
// 발표 일정 수정시 초기화되므로 해당 일정에 대한 팀빌딩 지원을 다시 처리할 수 있음
export type ProjectUpdateRequest = {
  maxMemberCount: number;
  availableParts: Part[];
  topics: string[];
  participantUserIds: number[];
  schedules: Schedule[];
};

export const updateProject = async (
  projectId: number,
  data: ProjectUpdateRequest
): Promise<ModifiableProject> => {
  const response = await api.put(`/admin/projects/${projectId}`, data);
  return response.data;
};

// ==================== 팀빌딩 프로젝트 API ====================

// GET /team-building/projects/{projectId} - 프로젝트 정보 및 일정 조회
export const getTeamBuildingProject = async (projectId: number): Promise<ModifiableProject> => {
  const response = await api.get(`/team-building/projects/${projectId}`);
  return response.data;
};

// ==================== 관리자의 승인된 멤버 관리 API ====================

// GET /admin/approved/users - 승인된 유저 목록 조회
export const getApprovedUsers = async (): Promise<ApprovedUsersResponse> => {
  const response = await api.get('/admin/approved/users');
  return response.data;
};

// ==================== 상수 조회 API ====================

// GET /constants/parts - 파트 목록 조회
export const getParts = async (): Promise<string[]> => {
  const response = await api.get('/constants/parts');
  return response.data;
};

// GET /constants/generations - 기수 목록 조회
export const getGenerations = async (): Promise<string[]> => {
  const response = await api.get('/constants/generations');
  return response.data;
};

// ==================== 학교 조회 API ====================

// 학교 응답 타입
export type SchoolResponse = {
  school: string;
};

// GET /admin/projects/schools - 학교 목록 조회
// 회원이 존재하는 모든 학교 목록을 조회합니다.
export const getSchools = async (): Promise<SchoolResponse[]> => {
  const response = await api.get('/admin/projects/schools');
  return response.data;
};
