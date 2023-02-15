import jwt from 'jsonwebtoken';
import * as process from 'process';

const {
  JWT_SECRET,
} = process.env;
export const generateToken = (payload: Record<string, string>) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

export default {};
