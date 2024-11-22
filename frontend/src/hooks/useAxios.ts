import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const useAxios = (): AxiosInstance => {
  const { accessToken, refreshAccessToken } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:3001',
      withCredentials: true, // Include cookies in requests
    });

    // Request interceptor to add accessToken to headers
    instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (accessToken && config.headers) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle 401 errors
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            await refreshAccessToken();

            if (accessToken && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return instance(originalRequest);
          } catch (refreshError) {
            // Redirect to login or handle accordingly
            navigate('/login');
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [refreshAccessToken, navigate, accessToken]); // TODO: Check dependencies

  return axiosInstance;
};
