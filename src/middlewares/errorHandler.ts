import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../types';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const {
    statusCode = 500,
    message,
  } = err;
  res.status(statusCode)
    .send({
      message: statusCode === HttpStatusCode.INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка.'
        : message,
    });
  next();
};
export default {};
