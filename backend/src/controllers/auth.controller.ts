import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserByUsername, verifyPassword } from '../models/user.model';
import { AuthRequest } from '../middlewares/auth.middleware';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            res.status(400).json({ message: 'Username, email and password are required' });
            return;
        }

        const existingUserByEmail = await findUserByEmail(email);
        if (existingUserByEmail) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }

        const existingUserByUsername = await findUserByUsername(username);
        if (existingUserByUsername) {
            res.status(409).json({ message: 'Username already taken' });
            return;
        }

        const userRole = (role === 'admin') ? 'admin' : 'user';

        const newUser = await createUser(username, email, password, userRole);

        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email, 
                role: newUser.role, 
                username: newUser.username
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        const { password_hash, ...userWithoutPassword } = user;
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await findUserByEmail(req.user.email);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { password_hash, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};