import { Request, Response, NextFunction } from 'express';

export const roles = (allowed: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const role = req.user && req.user.role;
  if (!role) return res.status(401).json({ message: 'Unauthorized' });
  if (!allowed.includes(role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};