import { NextFunction, Response } from 'express';
import { IRequestCustom } from './types';

export const fakeId = (req: IRequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };
  next();
};

export default {};
