import axios, { InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from './authStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * 인증이 필요 없는 Public 페이지 경로
 */
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/project-gallery',
  '/activity',
  '/contact',
];

/**
 * 인증이 필요한 페이지 경로 정의
 */
const BLOCKED_PUBLIC_PATH_PATTERNS = [
  /^\/project-gallery\/post$/,
  /^\/project-gallery\/\d+\/edit$/,
];


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
    accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null);

  // Authorization 헤더는 "토큰이 있을 때만" 붙인다
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

    // 401 에러가 아니거나 이미 재시도한 요청이면 에러 반환
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
      /**
       * [중요]
       * api.post를 사용하면 Request Interceptor가 다시 동작하여
       * 만료된 accessToken을 Authorization 헤더에 붙이게 된다.
       * 따라서 "순수 axios"를 사용해야 한다.
       */
      const res = await axios.post<ReissueAccessTokenResponse>(
        `${baseURL}/auth/token/access`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: '',
          },
        }
      );

      const { accessToken, email, name, role } = res.data;

      // Zustand 스토어 업데이트
      useAuthStore.getState().setAuth({
        accessToken,
        email,
        name,
        role,
      });

      // 세션 스토리지 업데이트
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', accessToken);
      }

      // 대기 중이던 요청들 처리
      processQueue(null, accessToken);
      isRefreshing = false;

      // 실패했던 원래 요청의 헤더를 새 토큰으로 교체 후 재요청
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (reissueError) {
      isRefreshing = false;
      processQueue(reissueError, null);

      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');

        const currentPath = window.location.pathname;
        const isBlockedPublicPath = BLOCKED_PUBLIC_PATH_PATTERNS.some(pattern => pattern.test(currentPath));

        const isPublicPath = !isBlockedPublicPath &&
        (PUBLIC_PATHS.includes(currentPath) || /^\/project-gallery\/\d+$/.test(currentPath));

        if (!isPublicPath) {
          window.location.href = '/login';
        }
      }

      return Promise.reject(reissueError);
    }
  }
);
