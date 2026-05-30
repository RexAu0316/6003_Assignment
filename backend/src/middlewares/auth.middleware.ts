import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }
        req.user = decoded as any;
        next();
    });
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};