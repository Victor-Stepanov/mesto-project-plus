import './env';
import express, { json } from 'express';
import mongoose from 'mongoose';
import * as process from 'process';
import routes from './routes ';
import { fakeId } from './tmp';

const {
  PORT = 3001,
  MONGO_URL = 'none',
} = process.env;

const app = express();
app.use(json());
app.use(routes);
// app.use((req: IRequestCustom, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: '5d8b8592978f8bd833ca8133',
//   };
//
//   next();
// });
app.use(fakeId);

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
