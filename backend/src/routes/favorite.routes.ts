import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { add, remove, list } from '../controllers/favorite.controller';

const router = Router();

router.use(authenticateToken); // 所有收藏路由都需要登录

router.post('/', add);
router.delete('/:filmId', remove);
router.get('/', list);

export default router;