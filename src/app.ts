import './env';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import * as process from 'process';
import helmet from 'helmet';
import auth from './middlewares/auth';
import routes from './routes ';
import UserController from './controllers/userController';

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
app.use(limiter);
app.post('/signup', UserController.createUser);
app.post('/signin', UserController.login);

app.use(auth);
app.use('/api', routes);

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
