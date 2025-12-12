import { api } from './api';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  number: string;
  school: string;
  generation: string;
  part: string;
  position: string;
  role: string;
}

export interface SignUpResponse {
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
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
  return api.post<LoginResponse>('/auth/login', { email, password });
};

export const sendEmailCode = (email: string) => {
  return api.post<string>('/email/send', { email });
};

export const verifyEmailCode = (email: string, code: string) => {
  return api.post<string>('/email/verify', { email, code });
};

export const resetPassword = (email: string, code: string, newPassword: string) => {
  return api.post<string>('/email/reset-password', null, {
    params: {
      email,
      code,
      newPassword,
    },
  });
};
