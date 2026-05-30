import pool from '../config/db';
import bcrypt from 'bcryptjs';

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    role: 'admin' | 'user';
    profile_photo?: string;
    created_at: Date;
}

export const createUser = async (
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'user' = 'user'
): Promise<Omit<User, 'password_hash'>> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, role]
    );
    const insertId = (result as any).insertId;
    const [rows] = await pool.execute(
        `SELECT id, username, email, role, profile_photo, created_at
         FROM users WHERE id = ?`,
        [insertId]
    );
    const users = rows as User[];
    const newUser = users[0];
    if (!newUser) {
        throw new Error('Failed to retrieve created user');
    }
    const { password_hash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE email = ?`,
        [email]
    );
    const users = rows as User[];
    const user = users[0];
    return user || null;   // 将 undefined 转换为 null
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE username = ?`,
        [username]
    );
    const users = rows as User[];
    const user = users[0];
    return user || null;   // 将 undefined 转换为 null
};

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};