import { NextFunction, Response } from 'express';
import { IRequestCustom } from './types';

export const fakeId = (req: IRequestCustom, res: Response, next: NextFunction) => {
  req.user = {
    _id: '63dbf491afb837faef5b48b5',
  };
  next();
};

export default {};
