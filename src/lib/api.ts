import axios, { InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from './authStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

refreshClient.interceptors.request.use(config => {
  if (config.headers) delete config.headers.Authorization;
  return config;
});

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  name: string;
  role: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token || undefined);
  });
  failedQueue = [];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = useAuthStore.getState();
  const token =
    state.accessToken ||
    (typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${String(token)}`;
            }
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const res = await refreshClient.post<RefreshResponse>('/auth/refresh');
      const { accessToken, email, name, role } = res.data;

      useAuthStore.getState().setAuth({ accessToken, email, name, role });

      processQueue(null, accessToken);
      isRefreshing = false;

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      useAuthStore.getState().clearAuth();
      processQueue(refreshError, null);

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(refreshError);
    }
  }
);
