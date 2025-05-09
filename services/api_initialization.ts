import axios from 'axios';

const API_BASE_URL = 'http://192.168.137.143:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;

