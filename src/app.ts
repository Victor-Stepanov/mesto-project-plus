import express from 'express';
import * as process from 'process';

const { PORT = 3000 } = process.env;
const app = express();

app.listen(PORT);
