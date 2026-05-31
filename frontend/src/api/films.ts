import apiClient from './client';

export const getFilms = () => apiClient.get('/films');
export const searchFilms = (params: { title?: string; genre?: string; year?: number; minRating?: number }) =>
  apiClient.get('/films/search', { params });
export const createFilm = (data: any) => apiClient.post('/films', data);
export const updateFilm = (id: number, data: any) => apiClient.put(`/films/${id}`, data);
export const deleteFilm = (id: number) => apiClient.delete(`/films/${id}`);
export const getFilmById = (id: number) => apiClient.get(`/films/${id}`);