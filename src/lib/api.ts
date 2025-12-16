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
    accessToken || (typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null);

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
      // [수정 포인트] api.post 대신 axios.post 사용
      // api 인스턴스를 쓰면 Request Interceptor가 다시 동작하여 만료된 토큰을 헤더에 붙입니다.
      // 따라서 순수 axios를 사용하여 Authorization 헤더 없이 요청해야 합니다.
      const res = await axios.post<ReissueAccessTokenResponse>(
        `${baseURL}/auth/token/access`, // 전체 URL 명시
        {}, // body가 없다면 빈 객체
        {
          withCredentials: true, // Refresh Token 쿠키 전송을 위해 필수
          headers: {
            // 명시적으로 Authorization 헤더 제거 (혹시 전역 설정이 있을 경우 대비)
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

      // 세션 스토리지도 업데이트 (새로고침 대비용이라면)
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
        window.location.href = '/login';
      }

      return Promise.reject(reissueError);
    }
  }
);
