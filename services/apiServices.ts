// utils/apiService.ts

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from './api_initialization';

interface ApiRequestParams<T> {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: T;
  userId?: string;
}

const apiRequest = async <T, R>({
  method,
  url,
  data,
  userId,
}: ApiRequestParams<T>): Promise<R> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers: {},
    };

    if (userId) {
      config.headers!['Authorization'] = userId;
    }

    const response: AxiosResponse<R> = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} ${url} failed:`, error);
    throw error;
  }
};

export default apiRequest;
