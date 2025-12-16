import axios, { InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from './authStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 기본 API 인스턴스
 * - accessToken은 Authorization 헤더로 전달
 * - refreshToken은 HttpOnly Cookie로 자동 전달
 */
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/* =========================
 * Types
 * ========================= */

/**
 * Access Token 재발급 응답
 * - refreshToken은 응답에 포함되지 않음 (HttpOnly Cookie)
 */
interface ReissueAccessTokenResponse {
  accessToken: string;
  email: string;
  name: string;
  role: string;
}

/* =========================
 * Refresh Control Queue
 * ========================= */

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(p => {
    if (error || !token) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

/* =========================
 * Request Interceptor
 * ========================= */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();

  const token =
    accessToken ||
    (typeof window !== 'undefined'
      ? sessionStorage.getItem('accessToken')
      : null);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
 * Response Interceptor
 * ========================= */

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await api.post<ReissueAccessTokenResponse>(
        '/auth/token/access'
      );

      const { accessToken, email, name, role } = res.data;

      useAuthStore.getState().setAuth({
        accessToken,
        email,
        name,
        role,
      });

      processQueue(null, accessToken);
      isRefreshing = false;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (reissueError) {
      isRefreshing = false;
      processQueue(reissueError, null);

      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(reissueError);
    }
  }
);
