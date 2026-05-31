import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { addFavorite, removeFavorite, getUserFavoriteFilmIds, isFavorite } from '../models/favorite.model';
import { getFilmById } from '../models/film.model';

// 添加收藏
export const add = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { filmId } = req.body;
        if (!filmId) {
            res.status(400).json({ message: 'filmId required' });
            return;
        }
        // 检查电影是否存在
        const film = await getFilmById(filmId);
        if (!film) {
            res.status(404).json({ message: 'Film not found' });
            return;
        }
        const already = await isFavorite(req.user.id, filmId);
        if (already) {
            res.status(409).json({ message: 'Already favorited' });
            return;
        }
        await addFavorite(req.user.id, filmId);
        res.status(201).json({ message: 'Added to favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 删除收藏
export const remove = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const filmId = parseInt(req.params.filmId);
        if (isNaN(filmId)) {
            res.status(400).json({ message: 'Invalid film ID' });
            return;
        }
        const deleted = await removeFavorite(req.user.id, filmId);
        if (!deleted) {
            res.status(404).json({ message: 'Favorite not found' });
            return;
        }
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 获取当前用户的收藏列表（返回完整电影对象）
export const list = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const filmIds = await getUserFavoriteFilmIds(req.user.id);
        if (filmIds.length === 0) {
            res.json([]);
            return;
        }
        // 批量获取电影（简单方式，可以优化为一条 IN 查询）
        const films = [];
        for (const id of filmIds) {
            const film = await getFilmById(id);
            if (film) films.push(film);
        }
        res.json(films);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};