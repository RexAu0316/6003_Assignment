import apiClient from './client';

// 用户发送消息
export const sendMessage = (message: string) => apiClient.post('/messages', { message });

// 获取当前用户的消息
export const getMyMessages = () => apiClient.get('/messages/me');

// 管理员：获取所有消息
export const getAllMessages = () => apiClient.get('/messages/admin');

// 管理员：回复消息
export const replyMessage = (id: number, reply: string) => apiClient.post(`/messages/admin/${id}/reply`, { reply });

// 管理员：删除消息
export const deleteMessage = (id: number) => apiClient.delete(`/messages/admin/${id}`);