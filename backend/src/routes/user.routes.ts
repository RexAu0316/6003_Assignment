import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { upload, uploadAvatar } from '../controllers/avatar.controller';

const router = Router();

// POST /api/users/avatar - 上传头像
router.post('/avatar', authenticateToken, upload.single('avatar'), uploadAvatar);

export default router;