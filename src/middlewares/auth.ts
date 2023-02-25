import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import * as process from 'process';

interface ISessionRequest extends Request {
  user?: string | JwtPayload;
}

const extractBearerToken = (token: string) => token.replace('Bearer ', '');
// eslint-disable-next-line consistent-return
export default (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
