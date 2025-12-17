import axios from 'axios';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 기반 인증 시 필요
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  config => {
    // 브라우저 환경에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
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
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      console.error('인증 에러: 토큰이 없거나 만료되었습니다.');

      // 브라우저 환경에서만 리다이렉트
      if (typeof window !== 'undefined') {
        // 토큰 삭제
        localStorage.removeItem('accessToken');

        // 로그인 페이지로 리다이렉트 (필요시 주석 해제)
        // window.location.href = '/login';
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== 타입 정의 ====================

// 프로젝트 정보 타입
export type ProjectInfo = {
  projectId: number;
  projectName: string;
  status: string;
  round: number;
};

export type ProjectInfoUpdateRequest = {
  projectName: string;
};

// 일정(라운드) 관련 타입
export type ScheduleRound = {
  id: number;
  roundType: string;
  status: '등록 전' | '진행 전' | '진행 중' | '완료';
  startDate: string | null;
  endDate: string | null;
};

export type ScheduleUpdateRequest = {
  startDate: string;
  endDate?: string;
};

// 주제 관련 타입
export type Topic = {
  topicId: number;
  topicName: string;
};

export type TopicCreateRequest = {
  topicName: string;
};

// 멤버 관련 타입
export type Member = {
  memberId: number;
  name: string;
  university: string;
  generation: string;
  part: string;
};

// 참여자 관련 타입
export type Participant = {
  memberId: number;
  name: string;
  university: string;
  generation: string;
  part: string;
};

// 팀빌딩 조건 타입
export type TeamBuildingCondition = {
  maxMember: number;
  recruitParts: string[];
};

export type TeamBuildingConditionUpdateRequest = {
  maxMember: number;
  recruitParts: string[];
};

// ==================== 프로젝트 정보 API ====================

// 프로젝트 정보 조회
export const getProjectInfo = async (): Promise<ProjectInfo> => {
  const response = await api.get('/api/admin/project/info');
  return response.data;
};

// 프로젝트 정보 수정
export const updateProjectInfo = async (data: ProjectInfoUpdateRequest): Promise<ProjectInfo> => {
  const response = await api.put('/api/admin/project/info', data);
  return response.data;
};

// ==================== 일정(라운드) API ====================

// 팀빌딩 라운드 목록 조회
export const getScheduleRounds = async (): Promise<ScheduleRound[]> => {
  const response = await api.get('/api/admin/project/teambuilding/round');
  return response.data;
};

// 팀빌딩 라운드 일정 수정
export const updateScheduleRound = async (
  roundId: number,
  data: ScheduleUpdateRequest
): Promise<ScheduleRound> => {
  const response = await api.put(`/api/admin/project/teambuilding/round/${roundId}`, data);
  return response.data;
};

// ==================== 주제 API ====================

// 주제 목록 조회
export const getTopics = async (): Promise<Topic[]> => {
  const response = await api.get('/api/admin/project/topic');
  return response.data;
};

// 주제 등록
export const createTopic = async (data: TopicCreateRequest): Promise<Topic> => {
  const response = await api.post('/api/admin/project/topic', data);
  return response.data;
};

// 주제 삭제
export const deleteTopic = async (topicId: number): Promise<void> => {
  await api.delete(`/api/admin/project/topic/${topicId}`);
};

// ==================== 참여자 API ====================

// 참여자 목록 조회
export const getParticipants = async (): Promise<Participant[]> => {
  const response = await api.get('/api/admin/project/participants');
  return response.data;
};

// 참여자 추가
export const addParticipant = async (memberId: number): Promise<void> => {
  await api.put(`/api/admin/project/participants/${memberId}`);
};

// 참여자 제거
export const removeParticipant = async (memberId: number): Promise<void> => {
  await api.delete(`/api/admin/project/participants/${memberId}`);
};

// ==================== 멤버 API ====================

// 전체 멤버 목록 조회
export const getMembers = async (generation?: string, university?: string): Promise<Member[]> => {
  const params = new URLSearchParams();
  if (generation && generation !== '전체') {
    params.append('generation', generation);
  }
  if (university && university !== '전체' && university !== '성공회대학교 외 4개') {
    params.append('university', university);
  }
  const queryString = params.toString();
  const url = queryString ? `/api/member?${queryString}` : '/api/member';
  const response = await api.get(url);
  return response.data;
};

// ==================== 팀빌딩 조건 API ====================

// 팀빌딩 조건 조회
export const getTeamBuildingCondition = async (): Promise<TeamBuildingCondition> => {
  const response = await api.get('/api/admin/project/teambuilding/condition');
  return response.data;
};

// 팀빌딩 조건 수정
export const updateTeamBuildingCondition = async (
  data: TeamBuildingConditionUpdateRequest
): Promise<TeamBuildingCondition> => {
  const response = await api.put('/api/admin/project/teambuilding/condition', data);
  return response.data;
};

// ==================== 프로젝트 전체 저장 API ====================

export type ProjectSaveRequest = {
  projectName: string;
  schedules: Array<{
    id: number;
    startDate: string | null;
    endDate: string | null;
  }>;
  topics: string[];
  participantIds: number[];
  teamBuildingCondition: {
    maxMember: number;
    recruitParts: string[];
  };
};

// 프로젝트 전체 저장 (개별 API 호출 조합)
export const saveProject = async (data: ProjectSaveRequest): Promise<void> => {
  // 1. 프로젝트 이름 수정
  await updateProjectInfo({ projectName: data.projectName });

  // 2. 팀빌딩 조건 수정
  await updateTeamBuildingCondition(data.teamBuildingCondition);

  // 주제와 참여자는 개별 API로 처리되므로 여기서는 생략
  // (실제 구현 시 필요에 따라 추가)
};

export default api;
