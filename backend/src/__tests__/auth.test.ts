import request from 'supertest';
import app from '../index';
import pool from '../config/db';

// 测试前清空相关表（可选）
beforeAll(async () => {
    // 删除特定测试用户
    await pool.execute('DELETE FROM users WHERE email = ?', ['jest@example.com']);
});

afterAll(async () => {
    await pool.end();
});

describe('Auth API', () => {
    const testUser = {
        username: 'jestuser',
        email: 'jest@example.com',
        password: 'test123',
        role: 'user',
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not register with existing email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        expect(res.statusCode).toBe(409);
        expect(res.body.message).toMatch(/already registered/i);
    });

    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: 'wrong' });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/invalid credentials/i);
    });

    it('should get current user with valid token', async () => {
        // 先登录获取 token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        const token = loginRes.body.token;

        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe(testUser.email);
    });

    it('should not get user without token', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.statusCode).toBe(401);
    });
});