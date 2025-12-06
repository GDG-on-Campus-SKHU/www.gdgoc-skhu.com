import { api } from './api';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  number: string;
  introduction: string;
  school: string;
  generation: string;
  part: string;
  position: string;
  role: string;
  status: 'ACTIVE' | 'BANNED';
  approvalStatus: 'WAITING' | 'APPROVED' | 'REJECTED';
}

export interface SignUpResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  role: string;
}

export const signUp = (data: SignUpRequest) => {
  return api.post<SignUpResponse>('/auth/signup', data);
};

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};
