import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://event-management-system-backend-01.onrender.com/api',
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        refreshPromise = refreshPromise || http.post('/auth/refresh');
        const refreshResponse = await refreshPromise;
        refreshPromise = null;
        const newToken = refreshResponse.data?.data?.accessToken;

        if (newToken) {
          localStorage.setItem('ems_access_token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      } catch (refreshError) {
        refreshPromise = null;
        localStorage.removeItem('ems_access_token');
        localStorage.removeItem('ems_user');
      }
    }

    return Promise.reject(error);
  },
);

export default http;