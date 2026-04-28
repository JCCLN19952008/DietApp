import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);

  const token = authHeader?.split(' ')[1];
  console.log('Token:', token);

  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret';
    console.log('Verifying with secret:', secret);
    const payload = jwt.verify(token, secret) as { userId: number };
    console.log('Payload:', payload);
    req.userId = payload.userId;
    next();
  } catch (err) {
    console.log('JWT error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}