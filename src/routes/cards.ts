import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { cardValidation, createCardValidation } from '../utils/validation';

const cardRouter = Router();

// Маршруты карточек:

// Маршрут возвращает все карточки
cardRouter.get('/', getCards);

// Создает карточку
cardRouter.post('/', createCardValidation, createCard);

// Удаляет карточку по идентификатору
cardRouter.delete('/:cardId', cardValidation, deleteCardById);

// Поставить лайк карточке
cardRouter.put('/:cardId/likes', cardValidation, likeCard);

// Убрать лайк с карточки
cardRouter.delete('/:cardId/likes', cardValidation, dislikeCard);

export default cardRouter;
