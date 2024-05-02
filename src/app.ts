import express, {
  Request,
  Response,
} from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { errors } from 'celebrate';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { NOT_FOUND_ERROR } from './constants/constants';
import { requestLogger, errorLogger } from './middlewares/logger';
import auth from './middlewares/auth';
import { signinValidation, createUserValidation } from './utils/validation';
import { login, createUser } from './controllers/users';
import error from './middlewares/error';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Sorry, that route doesn't exist." });
});

app.use(errorLogger);
app.use(errors());
app.use(error);

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL as string);
  await app.listen(PORT);
};

connect();
