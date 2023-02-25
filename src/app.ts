import './env';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import * as process from 'process';
import helmet from 'helmet';
import { errors } from 'celebrate';
import auth from './middlewares/auth';
import routes from './routes ';
import UserController from './controllers/userController';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './validation/userValidation';
import { errorHandler } from './middlewares/errorHandler';

const {
  PORT = 3001,
  MONGO_URL = 'none',
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(helmet());
app.use(json());
app.use(requestLogger);
app.use(limiter);
app.post('/signup', createUserValidation, UserController.createUser);
app.post('/signin', loginValidation, UserController.login);

app.use('/api', auth, routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function connection() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URL);
    await app.listen(PORT);
  } catch (err) {
    throw new Error(`Something wrong:${err}`);
  }
}

connection();
