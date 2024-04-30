import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  RESOURCE_CREATED,
  INTERNAL_SERVER_ERROR,
} from '../constants/constants';
import User from '../models/user';

// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

// Получаем всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Server error' });
  }
};

// Находим пользователя по айди
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('User with such id was not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user id' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Создаем нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) {
      throw new Error('User not found');
    }
    return res.status(RESOURCE_CREATED).send({ data: newUser });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Обновляем профиль
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // подразумевается, что в теле запроса пришел профиль уже с обновленными полями
    // вытаскиваю их из req.body
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
      .orFail(() => {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        return error;
      });
    return res.send(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Обновляем аватар
export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // пришедший в теле запроса новый аватар - вытаскиваю:
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
      .orFail(() => {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        return error;
      });
    return res.send(updatedAvatar);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: 'User not found' });
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};
