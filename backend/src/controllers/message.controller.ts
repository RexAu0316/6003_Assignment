import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createMessage, getUserMessages, getAllMessages, replyToMessage, deleteMessage } from '../models/message.model';

// 用户发送消息
export const sendMessage = async (req: AuthRequest, res: Response) => {
    console.log('User:', req.user); 
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { message } = req.body;
        if (!message || message.trim() === '') {
            res.status(400).json({ message: 'Message content is required' });
            return;
        }
        const newMessage = await createMessage(req.user.id, req.user.username, message.trim());
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 获取当前用户自己的消息
export const getMyMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const messages = await getUserMessages(req.user.id);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 管理员获取所有消息
export const getAllMessagesAdmin = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const messages = await getAllMessages();
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 管理员回复消息
export const replyMessageAdmin = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const messageId = parseInt(req.params.id);
        const { reply } = req.body;
        if (isNaN(messageId) || !reply || reply.trim() === '') {
            res.status(400).json({ message: 'Invalid message ID or reply content' });
            return;
        }
        const success = await replyToMessage(messageId, reply.trim());
        if (!success) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        res.json({ message: 'Reply sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 管理员删除消息
export const deleteMessageAdmin = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const messageId = parseInt(req.params.id);
        if (isNaN(messageId)) {
            res.status(400).json({ message: 'Invalid message ID' });
            return;
        }
        const success = await deleteMessage(messageId);
        if (!success) {
            res.status(404).json({ message: 'Message not found' });
            return;
        }
        res.json({ message: 'Message deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};