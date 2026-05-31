import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { sendMessage, getMyMessages, getAllMessagesAdmin, replyMessageAdmin, deleteMessageAdmin } from '../controllers/message.controller';

const router = Router();

// 用户路由（需要登录）
router.post('/', authenticateToken, sendMessage);
router.get('/me', authenticateToken, getMyMessages);

// 管理员路由
router.get('/admin', authenticateToken, requireAdmin, getAllMessagesAdmin);
router.post('/admin/:id/reply', authenticateToken, requireAdmin, replyMessageAdmin);
router.delete('/admin/:id', authenticateToken, requireAdmin, deleteMessageAdmin);

export default router;