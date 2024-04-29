import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users';

const userRouter = Router();

// Маршрут возвращает всех пользователей
userRouter.get('/', getUsers);

// Возвращает пользователя по _id
userRouter.get('/:userId', getUserById);

// Создаёт пользователя
userRouter.post('/', createUser);

// Обновляет профиль пользователя
userRouter.patch('/me', updateUserProfile);

// Обновляет аватар пользователя
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
