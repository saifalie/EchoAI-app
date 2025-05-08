import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from './api_initialization';

interface ApiRequestParams<T> {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  data?: T;
}

const apiRequest = async <T, R>({
  method,
  url,
  data,
}: ApiRequestParams<T>): Promise<R> => {
  // build config
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    headers: {},
  };

  // automatically pull userId from storage
  const userId = await AsyncStorage.getItem('userId');
  if (userId) {
    config.headers!['Authorization'] = userId;
  }

  const response: AxiosResponse<R> = await apiClient(config);
  return response.data;
};

export default apiRequest;
