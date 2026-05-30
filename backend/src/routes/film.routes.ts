import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { addFilm, listFilms, getFilm, editFilm, removeFilm, search } from '../controllers/film.controller';

const router = Router();

router.get('/', listFilms);
router.get('/search', search);
router.get('/:id', getFilm);

router.post('/', authenticateToken, requireAdmin, addFilm);
router.put('/:id', authenticateToken, requireAdmin, editFilm);
router.delete('/:id', authenticateToken, requireAdmin, removeFilm);

export default router;