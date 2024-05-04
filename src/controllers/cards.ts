import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import BadRequest from '../utils/errors/BadRequest';
import NotFound from '../utils/errors/NotFound';
import Forbidden from '../utils/errors/Forbidden';

// Методы контроллеров описывают, как обрабатывать данные и какой результат возвращать.

// + Получаем все карточки
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next();
  }
};

// + Создаем новую карточку
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.body.user; // id текущего пользователя
    const newCard = await Card.create({ name, link, owner: _id }); // создаю карточку
    return res.send({ data: newCard }); // возвращаю ее с сервера
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest('Incorrect data'));
    }
    return next();
  }
};

// + Удаляем карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params; // идентификатор карточки из урла
    const { _id } = req.body.user; // id текущего пользователя
    const card = await Card.findById(cardId).orFail(() => {
      throw new NotFound('Card was not found');
    });
    if (card.owner.toString() !== _id) {
      throw new Forbidden('You are not permitted to delete this card');
    }
    await Card.deleteOne({ _id: cardId });
    return res.send({ message: 'Card deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new BadRequest('Non-correct identifier'));
    }
    return next(error);
  }
};

const updateLike = async (req: Request, res: Response, next: NextFunction, method: string) => {
  try {
    const { cardId } = req.params;
    const updatedCard = await Card
      .findByIdAndUpdate(cardId, { [method]: { likes: req.body.user._id } }, { new: true })
      .orFail(() => {
        throw new NotFound('Card was not found');
      });
    return res.send(updatedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(new BadRequest('Incorrect data'));
    }
    return next();
  }
};

// + Лайкаем карточку
export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$addToSet');

// + Убираем лайк с карточки
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$pull');
