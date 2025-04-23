// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'default_secret';

interface AuthRequest extends Request {
  user?: { id: string, email: string, name: string };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: string, email: string, name: string };
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
