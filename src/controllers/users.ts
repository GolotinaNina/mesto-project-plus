import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequest from '../utils/errors/BadRequest';
import NotFound from '../utils/errors/NotFound';
import Conflict from '../utils/errors/Conflict';
import Unathorized from '../utils/errors/Unathorized';
// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.
// Получаем всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next();
  }
};

// Находим пользователя по айди
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFound('Users not found');
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequest('Invalid user id'));
    }
    return next(error);
  }
};

// Создаем нового пользователя
export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userInformation) => {
      res.send({
        _id: userInformation._id,
        name: userInformation.name,
        about: userInformation.about,
        avatar: userInformation.avatar,
        email: userInformation.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('User with this email already exists'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Incorrect credentials for when creating a user'));
      } else {
        next(err);
      }
    });
};

// Обновляем профиль
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // подразумевается, что в теле запроса пришел профиль уже с обновленными полями
    // вытаскиваю их из req.body
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
      .orFail(() => {
        throw new NotFound('User not found');
      });
    return res.send(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequest('Invalid user data'));
    }
    return next(error);
  }
};

// Обновляем аватар
export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // пришедший в теле запроса новый аватар - вытаскиваю:
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
      .orFail(() => {
        throw new NotFound('User not found');
      });
    return res.send(updatedAvatar);
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequest('Invalid user data'));
    }
    return next(error);
  }
};

export const login = (req: Request, res: Response, next:NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((userInformation) => {
      res
        .send({
          token: jwt.sign({ _id: userInformation._id }, 'super-strong-secret', { expiresIn: '7d' }),
        });
    })
    .catch((error) => {
      next(new Unathorized(error.message));
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.body.user._id)
    .then((userInformation) => {
      if (!userInformation) {
        throw new NotFound('Пользователь по указанному _id не найден');
      } else {
        res.send(userInformation);
      }
    })
    .catch((err) => {
      next(err);
    });
};
