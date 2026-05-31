import apiClient from './client';

export const uploadAvatar = (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};