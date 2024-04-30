import express, {
  json,
  NextFunction,
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import path from 'path';
import 'dotenv/config';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { NOT_FOUND_ERROR } from 'constants/constants';

const { PORT = 3000, MONGO_URL = "" } = process.env;
const app = express();

app.use(json());

// Мидлвар авторизации: временная заглушка для будущей логики авторизации
app.use((req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: '662f641e80e7f750a8fdfe1b',
  };
  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

app.use((res: Response) => {
  res.status(NOT_FOUND_ERROR).send("Sorry, that route doesn't exist.");
});

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL as string);
  console.log('Connected to the database');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();
