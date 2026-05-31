import apiClient from './client';

export const register = (data: { username: string; email: string; password: string; role?: string }) =>
  apiClient.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

export const getMe = () => apiClient.get('/auth/me');