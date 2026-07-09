import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/auth-store';
import type { ApiResponse } from '../types/api';
import type { RefreshResponse } from '../types/auth';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string }>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err: AxiosError) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { token, refreshToken } = useAuthStore.getState();

      if (!token || !refreshToken) {
        toast.error('Session expired. Please log in again.');
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<ApiResponse<RefreshResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
          { accessToken: token, refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const newAuthData = response.data.data;
        if (!newAuthData || !newAuthData.token || !newAuthData.refreshToken) {
          throw new Error('Invalid refresh response');
        }

        useAuthStore.getState().login({
          token: newAuthData.token,
          refreshToken: newAuthData.refreshToken,
        });

        processQueue(null, newAuthData.token);

        originalRequest.headers.Authorization = `Bearer ${newAuthData.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        toast.error('Session expired. Please log in again.');
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
