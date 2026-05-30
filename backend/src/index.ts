import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1+1 AS result');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: String(error) });
    }
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});