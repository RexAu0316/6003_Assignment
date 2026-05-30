import pool from '../config/db';

export interface Film {
    id: number;
    title: string;
    genre?: string;
    year?: number;
    rating?: number;
    description?: string;
    poster_url?: string;
    created_at: Date;
    updated_at: Date;
}

// 创建电影（管理员）
export const createFilm = async (film: Omit<Film, 'id' | 'created_at' | 'updated_at'>): Promise<Film> => {
    const { title, genre, year, rating, description, poster_url } = film;
    const [result] = await pool.execute(
        `INSERT INTO films (title, genre, year, rating, description, poster_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, genre || null, year || null, rating || null, description || null, poster_url || null]
    );
    const insertId = (result as any).insertId;
    const [rows] = await pool.execute(`SELECT * FROM films WHERE id = ?`, [insertId]);
    const newFilm = (rows as Film[])[0];
    if (!newFilm) {
        throw new Error('Failed to retrieve created film');
    }
    return newFilm;
};

// 获取所有电影（公开）
export const getAllFilms = async (): Promise<Film[]> => {
    const [rows] = await pool.execute(`SELECT * FROM films ORDER BY created_at DESC`);
    return rows as Film[];
};

// 根据ID获取单部电影（公开）
export const getFilmById = async (id: number): Promise<Film | null> => {
    const [rows] = await pool.execute(`SELECT * FROM films WHERE id = ?`, [id]);
    const films = rows as Film[];
    return films[0] || null;
};

// 更新电影（管理员）
export const updateFilm = async (id: number, film: Partial<Omit<Film, 'id' | 'created_at' | 'updated_at'>>): Promise<Film | null> => {
    const fields: string[] = [];
    const values: any[] = [];
    if (film.title !== undefined) { fields.push('title = ?'); values.push(film.title); }
    if (film.genre !== undefined) { fields.push('genre = ?'); values.push(film.genre); }
    if (film.year !== undefined) { fields.push('year = ?'); values.push(film.year); }
    if (film.rating !== undefined) { fields.push('rating = ?'); values.push(film.rating); }
    if (film.description !== undefined) { fields.push('description = ?'); values.push(film.description); }
    if (film.poster_url !== undefined) { fields.push('poster_url = ?'); values.push(film.poster_url); }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.execute(`UPDATE films SET ${fields.join(', ')} WHERE id = ?`, values);
    return getFilmById(id);
};

// 删除电影（管理员）
export const deleteFilm = async (id: number): Promise<boolean> => {
    const [result] = await pool.execute(`DELETE FROM films WHERE id = ?`, [id]);
    return (result as any).affectedRows > 0;
};

// 搜索和筛选
export const searchFilms = async (filters: { title?: string; genre?: string; year?: number; minRating?: number }): Promise<Film[]> => {
    let sql = `SELECT * FROM films WHERE 1=1`;
    const params: any[] = [];
    if (filters.title) {
        sql += ` AND title LIKE ?`;
        params.push(`%${filters.title}%`);
    }
    if (filters.genre) {
        sql += ` AND genre = ?`;
        params.push(filters.genre);
    }
    if (filters.year !== undefined) {
        sql += ` AND year = ?`;
        params.push(filters.year);
    }
    if (filters.minRating !== undefined) {
        sql += ` AND rating >= ?`;
        params.push(filters.minRating);
    }
    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows as Film[];
};