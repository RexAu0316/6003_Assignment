import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createFilm, getAllFilms, getFilmById, updateFilm, deleteFilm, searchFilms } from '../models/film.model';

// 辅助函数：安全获取 id
const getNumericId = (param: string | string[] | undefined): number | null => {
    if (!param || Array.isArray(param)) return null;
    const id = parseInt(param, 10);
    return isNaN(id) ? null : id;
};

// 管理员：创建电影
export const addFilm = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const film = await createFilm(req.body);
        res.status(201).json(film);
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};

// 公开：获取所有电影
export const listFilms = async (req: Request, res: Response) => {
    try {
        const films = await getAllFilms();
        res.json(films);
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};

// 公开：获取单部电影
export const getFilm = async (req: Request, res: Response) => {
    try {
        const id = getNumericId(req.params.id);
        if (!id) {
            res.status(400).json({ message: 'Invalid film ID' });
            return;
        }
        const film = await getFilmById(id);
        if (!film) {
            res.status(404).json({ message: 'Film not found' });
            return;
        }
        res.json(film);
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};

// 管理员：更新电影
export const editFilm = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const id = getNumericId(req.params.id);
        if (!id) {
            res.status(400).json({ message: 'Invalid film ID' });
            return;
        }
        const updated = await updateFilm(id, req.body);
        if (!updated) {
            res.status(404).json({ message: 'Film not found or no changes' });
            return;
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};

// 管理员：删除电影
export const removeFilm = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({ message: 'Admin only' });
            return;
        }
        const id = getNumericId(req.params.id);
        if (!id) {
            res.status(400).json({ message: 'Invalid film ID' });
            return;
        }
        const deleted = await deleteFilm(id);
        if (!deleted) {
            res.status(404).json({ message: 'Film not found' });
            return;
        }
        res.json({ message: 'Film deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};

// 公开：搜索筛选（只传递有值的参数）
export const search = async (req: Request, res: Response) => {
    try {
        const { title, genre, year, minRating } = req.query;
        const filters: { title?: string; genre?: string; year?: number; minRating?: number } = {};
        if (title && typeof title === 'string') filters.title = title;
        if (genre && typeof genre === 'string') filters.genre = genre;
        if (year && typeof year === 'string') {
            const y = parseInt(year, 10);
            if (!isNaN(y)) filters.year = y;
        }
        if (minRating && typeof minRating === 'string') {
            const r = parseFloat(minRating);
            if (!isNaN(r)) filters.minRating = r;
        }
        const films = await searchFilms(filters);
        res.json(films);
    } catch (err) {
        res.status(500).json({ message: String(err) });
    }
};