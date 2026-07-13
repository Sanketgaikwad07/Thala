import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('thala.admin.accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('thala.admin.accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface PaginatedEnvelope<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
}
