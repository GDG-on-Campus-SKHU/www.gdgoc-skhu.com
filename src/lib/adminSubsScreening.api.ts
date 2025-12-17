import { api } from './api';
import type { AxiosRequestConfig } from 'axios';
import { useMutation } from '@tanstack/react-query';

// types/admin.ts
export type AdminUserId = number;

export type AdminDecision = 'approve' | 'reject';

// (선택) 서버가 204(no content)면 이건 안 써도 됨
export type AdminApproveRejectResponse = {
  userId: number;
  status: 'APPROVED' | 'REJECTED';
} | void;

export type AdminResetResponse = void;

// 회원 가입 승인
export const approveUserSignup = (userId: number, config?: AxiosRequestConfig) => {
  return api.post<AdminApproveRejectResponse>(`/admin/${userId}/approve`, undefined, config);
};

// 회원 가입 거절
export const rejectUserSignup = (userId: number, config?: AxiosRequestConfig) => {
  return api.post<AdminApproveRejectResponse>(`/admin/${userId}/reject`, undefined, config);
};

export const resetRejectedUserToWaiting = (userId: number, config?: AxiosRequestConfig) => {
  return api.post<AdminResetResponse>(`/admin/${userId}/reset`, undefined, config);
};

export const useApproveUserSignup = () =>
  useMutation({
    mutationFn: (userId: number) => approveUserSignup(userId),
  });

export const useRejectUserSignup = () =>
  useMutation({
    mutationFn: (userId: number) => rejectUserSignup(userId),
  });

export const useResetRejectedUserToWaiting = () =>
  useMutation({
    mutationFn: (userId: number) => resetRejectedUserToWaiting(userId),
  });
