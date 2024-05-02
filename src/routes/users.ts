import { Router } from 'express';
import {
  // eslint-disable-next-line import/named
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from '../controllers/users';
import {
  updateUserValidation,
  updateUserAvatarValidation,
  getUserValidation,
} from '../utils/validation';

const userRouter = Router();

// Маршрут возвращает всех пользователей
userRouter.get('/', getUsers);

// Возвращает пользователя по _id
userRouter.get('/:userId', getUserValidation, getUserById);

// Возвращает текущего пользователя
userRouter.get('/me', getCurrentUser);

// Создаёт пользователя
userRouter.post('/', createUser);

// Обновляет профиль пользователя
userRouter.patch('/me', updateUserValidation, updateUserProfile);

// Обновляет аватар пользователя
userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
