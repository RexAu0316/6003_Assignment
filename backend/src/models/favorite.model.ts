import pool from '../config/db';

export interface Favorite {
    id: number;
    user_id: number;
    film_id: number;
    created_at: Date;
}

// 添加收藏
export const addFavorite = async (userId: number, filmId: number): Promise<void> => {
    await pool.execute(
        `INSERT INTO favorites (user_id, film_id) VALUES (?, ?)`,
        [userId, filmId]
    );
};

// 删除收藏
export const removeFavorite = async (userId: number, filmId: number): Promise<boolean> => {
    const [result] = await pool.execute(
        `DELETE FROM favorites WHERE user_id = ? AND film_id = ?`,
        [userId, filmId]
    );
    return (result as any).affectedRows > 0;
};

// 获取用户收藏的电影ID列表
export const getUserFavoriteFilmIds = async (userId: number): Promise<number[]> => {
    const [rows] = await pool.execute(
        `SELECT film_id FROM favorites WHERE user_id = ?`,
        [userId]
    );
    return (rows as any[]).map(row => row.film_id);
};

// 检查用户是否已收藏某部电影
export const isFavorite = async (userId: number, filmId: number): Promise<boolean> => {
    const [rows] = await pool.execute(
        `SELECT 1 FROM favorites WHERE user_id = ? AND film_id = ?`,
        [userId, filmId]
    );
    return (rows as any[]).length > 0;
};