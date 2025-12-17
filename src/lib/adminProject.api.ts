import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('인증 에러: 토큰이 없거나 만료되었습니다.');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
  availableParts: AvailablePart[];
  schedules: Schedule[];
  participants: Participant[];
};

// 승인된 유저 타입
export type ApprovedUser = {
  userId: number;
  name: string;
  university: string;
  generation: string;
  part: string;
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
export const getApprovedUsers = async (): Promise<ApprovedUser[]> => {
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

// ==================== 참여자 API (엔드포인트 확인 필요) ====================

// 참여자 추가
export const addParticipant = async (projectId: number, userId: number): Promise<void> => {
  // TODO: 백엔드 엔드포인트 확인 필요
  await api.put(`/admin/projects/${projectId}/participants/${userId}`);
};

// 참여자 제거
export const removeParticipant = async (
  projectId: number,
  participantId: number
): Promise<void> => {
  // TODO: 백엔드 엔드포인트 확인 필요
  await api.delete(`/admin/projects/${projectId}/participants/${participantId}`);
};

export default api;
