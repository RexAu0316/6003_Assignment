import pool from '../config/db';

export interface Message {
    id: number;
    user_id: number;
    username: string;
    message: string;
    reply: string | null;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

// 用户发送消息
export const createMessage = async (userId: number, username: string, message: string): Promise<Message> => {
    const [result] = await pool.execute(
        `INSERT INTO messages (user_id, username, message) VALUES (?, ?, ?)`,
        [userId, username, message]
    );
    const insertId = (result as any).insertId;
    const [rows] = await pool.execute(`SELECT * FROM messages WHERE id = ?`, [insertId]);
    return (rows as Message[])[0];
};

// 获取用户自己的消息（普通用户）
export const getUserMessages = async (userId: number): Promise<Message[]> => {
    const [rows] = await pool.execute(
        `SELECT * FROM messages WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
    );
    return rows as Message[];
};

// 获取所有消息（管理员）
export const getAllMessages = async (): Promise<Message[]> => {
    const [rows] = await pool.execute(`SELECT * FROM messages ORDER BY created_at DESC`);
    return rows as Message[];
};

// 管理员回复消息
export const replyToMessage = async (messageId: number, reply: string): Promise<boolean> => {
    const [result] = await pool.execute(
        `UPDATE messages SET reply = ?, is_read = TRUE WHERE id = ?`,
        [reply, messageId]
    );
    return (result as any).affectedRows > 0;
};

// 管理员删除消息
export const deleteMessage = async (messageId: number): Promise<boolean> => {
    const [result] = await pool.execute(`DELETE FROM messages WHERE id = ?`, [messageId]);
    return (result as any).affectedRows > 0;
};