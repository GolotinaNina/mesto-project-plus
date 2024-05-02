import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Unathorized from '../utils/errors/Unathorized';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unathorized('Необходима авторизация');
  }

  let payload;

  try {
    payload = verify(authorization!.replace('Bearer ', ''), 'super-strong-secret');
  } catch (err) {
    throw new Unathorized('Необходима авторизация');
  }

  req.user = payload as { _id: JwtPayload };
  next();
};
