import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import authRoutes from './routes/auth.routes';
import filmRoutes from './routes/film.routes';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger';
import favoriteRoutes from './routes/favorite.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/', (req, res) => {
    res.json({
        message: 'CinemaVault API is running',
        endpoints: {
            docs: '/api-docs',
            health: '/api/health',
            auth: '/api/auth',
            films: '/api/films'
        }
    });
});

// 数据库测试（可选）
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1+1 AS result');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});

// API 路由
app.use('/api/auth', authRoutes);

app.use('/api/films', filmRoutes);

// Swagger 文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/favorites', favoriteRoutes);

// 仅在直接运行此文件时启动服务器（用于开发），测试时不会自动监听
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
        console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
}

export default app;