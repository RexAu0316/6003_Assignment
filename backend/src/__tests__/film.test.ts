import request from 'supertest';
import app from '../index';
import pool from '../config/db';

let adminToken: string;
let filmId: number;

beforeAll(async () => {
    // 清理测试数据
    await pool.execute('DELETE FROM films WHERE title LIKE "Test Film%"');
    await pool.execute('DELETE FROM users WHERE email = "admin@test.com"');

    // 注册一个管理员账号并获取 token
    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'admintest',
            email: 'admin@test.com',
            password: 'admin123',
            role: 'admin',
        });
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'admin123' });
    adminToken = loginRes.body.token;
});

afterAll(async () => {
    await pool.end();
});

describe('Films API', () => {
    it('should create a film (admin only)', async () => {
        const res = await request(app)
            .post('/api/films')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Test Film',
                genre: 'Action',
                year: 2025,
                rating: 8.5,
                description: 'A test film',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Film');
        filmId = res.body.id;
    });

    it('should not create film without admin token', async () => {
        const res = await request(app)
            .post('/api/films')
            .send({ title: 'Unauthorized Film' });
        expect(res.statusCode).toBe(401);
    });

    it('should list all films (public)', async () => {
        const res = await request(app).get('/api/films');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((f: any) => f.title === 'Test Film')).toBe(true);
    });

    it('should get a single film by id', async () => {
        const res = await request(app).get(`/api/films/${filmId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Test Film');
    });

    it('should search films by title', async () => {
        const res = await request(app).get('/api/films/search?title=Test');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toContain('Test');
    });

    it('should update film (admin only)', async () => {
        const res = await request(app)
            .put(`/api/films/${filmId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ rating: 9.0 });
        expect(res.statusCode).toBe(200);
        expect(parseFloat(res.body.rating)).toBe(9.0);   // 修复点
    });

    it('should delete film (admin only)', async () => {
        const res = await request(app)
            .delete(`/api/films/${filmId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);

        // 验证已删除
        const getRes = await request(app).get(`/api/films/${filmId}`);
        expect(getRes.statusCode).toBe(404);
    });
});