/**
 * @swagger
 * tags:
 *   name: Films
 *   description: 电影管理接口
 */

/**
 * @swagger
 * /films:
 *   get:
 *     summary: 获取所有电影（公开）
 *     tags: [Films]
 *     security: []
 *     responses:
 *       200:
 *         description: 成功返回电影列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 */

/**
 * @swagger
 * /films/search:
 *   get:
 *     summary: 搜索电影（公开）
 *     tags: [Films]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *         description: 标题关键词
 *       - in: query
 *         name: genre
 *         schema: { type: string }
 *         description: 类型
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: 年份
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *         description: 最低评分
 *     responses:
 *       200:
 *         description: 搜索结果
 */

/**
 * @swagger
 * /films/{id}:
 *   get:
 *     summary: 获取单部电影详情（公开）
 *     tags: [Films]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 成功
 *       404:
 *         description: 电影不存在
 */

/**
 * @swagger
 * /films:
 *   post:
 *     summary: 添加电影（仅管理员）
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               genre: { type: string }
 *               year: { type: integer }
 *               rating: { type: number }
 *               description: { type: string }
 *               poster_url: { type: string }
 *     responses:
 *       201:
 *         description: 创建成功
 *       403:
 *         description: 非管理员
 */

/**
 * @swagger
 * /films/{id}:
 *   put:
 *     summary: 更新电影（仅管理员）
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               genre: { type: string }
 *               year: { type: integer }
 *               rating: { type: number }
 *               description: { type: string }
 *               poster_url: { type: string }
 *     responses:
 *       200:
 *         description: 更新成功
 *       403:
 *         description: 非管理员
 *       404:
 *         description: 电影不存在
 */

/**
 * @swagger
 * /films/{id}:
 *   delete:
 *     summary: 删除电影（仅管理员）
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: 删除成功
 *       403:
 *         description: 非管理员
 *       404:
 *         description: 电影不存在
 */

import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware';
import { addFilm, listFilms, getFilm, editFilm, removeFilm, search } from '../controllers/film.controller';

const router = Router();

router.get('/', listFilms);
router.get('/search', search);
router.get('/:id', getFilm);

router.post('/', authenticateToken, requireAdmin, addFilm);
router.put('/:id', authenticateToken, requireAdmin, editFilm);
router.delete('/:id', authenticateToken, requireAdmin, removeFilm);

export default router;