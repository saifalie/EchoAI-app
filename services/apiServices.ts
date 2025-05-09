import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from './api_initialization';

interface ApiRequestParams<T> {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: T;
  headers?: Record<string, string>;
}

const apiRequest = async <T, R>({
  method,
  url,
  data,
  headers = {}, // Ensure headers is always an object
}: ApiRequestParams<T>): Promise<R> => {
  // Auto-add Authorization token if available
  try {
    const token = await AsyncStorage.getItem('userId');
    if (token) {
      headers['Authorization'] = token;
    }
  } catch (e) {
    console.warn('Could not load auth token', e);
  }

  // If sending FormData, set multipart header
  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  // Build config
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers,
  };

  // Execute request
  const response: AxiosResponse<R> = await apiClient(config);
  return response.data;
};

export default apiRequest;