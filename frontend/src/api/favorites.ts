import apiClient from './client';

export const addFavorite = (filmId: number) => apiClient.post('/favorites', { filmId });
export const removeFavorite = (filmId: number) => apiClient.delete(`/favorites/${filmId}`);
export const getFavorites = () => apiClient.get('/favorites');