import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'changeme';

export interface JwtPayloadCustom {
  id: number;
  email: string;
  role: 'admin' | 'doctor' | 'user';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayloadCustom;
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export { jwtSecret };