import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/constants';

export default (
  err: { statusCode: number, message: string },
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : message,
    });
  next();
};
