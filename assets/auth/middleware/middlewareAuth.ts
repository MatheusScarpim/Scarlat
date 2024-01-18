import {
  Request,
  Response,
  NextFunction
} from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized: Token not provided'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'S1Rl1t2330porta', (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid token'
      });
    }

    (req as any).userId = (decoded as any).userId;
    next();
  });
};