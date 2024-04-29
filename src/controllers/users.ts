import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  REQUEST_SUCCEEDED,
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
    return res.status(REQUEST_SUCCEEDED).send(users);
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
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user id' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: error });
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
      return res.status(BAD_REQUEST_ERROR).send({ message: error });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: error });
  }
};

// Обновляем профиль
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // подразумевается, что в теле запроса пришел профиль уже с обновленными полями
    // вытаскиваю их из req.body
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { name, about }, { new: true })
      .orFail(() => {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        return error;
      });
    return res.status(REQUEST_SUCCEEDED).send(updatedUser);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: error });
  }
};

// Обновляем аватар
export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body.user; // id текущего пользователя
    // пришедший в теле запроса новый аватар - вытаскиваю:
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(_id, { avatar }, { new: true })
      .orFail(() => {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        return error;
      });
    return res.status(REQUEST_SUCCEEDED).send(updatedAvatar);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: error });
  }
};
