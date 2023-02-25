import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode, IRequestCustom } from '../types';
import { badRequest, forBidden, notFoundError } from '../error/error';
import CardsService from '../service/cardsService';

interface ICardController {
  getCards(req: Request, res: Response, next: NextFunction): Promise<void | Response>;

  deleteCardById(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

  createCard(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

  likeCard(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

  dislikeCard(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

}

class CardController implements ICardController {
  async createCard(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response> {
    try {
      const newCard = await CardsService.createCard(req);
      return res.status(HttpStatusCode.CREATED)
        .send(newCard);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    }
  }

  async deleteCardById(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response> {
    try {
      const card = await CardsService.deleteCardById(req);
      if (!card) {
        return next(notFoundError('Карточка с указанным _id не найдена.'));
      }
      if (card.owner.toString() !== req.user?._id) {
        return next(forBidden('Запрещено удалять чужие карточки.'));
      }
      return res.status(HttpStatusCode.OK)
        .send({
          message: 'Карточка успешно удалена.',
        });
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Передан некорректный _id карточки.'));
      }
      return next(err);
    }
  }

  async dislikeCard(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response> {
    try {
      const card = await CardsService.dislikeCard(req);
      if (!card) {
        return next(notFoundError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(card);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Передан некорректный _id карточки.'));
      }
      return next(err);
    }
  }

  async getCards(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const cards = await CardsService.getCards();
      return res.status(HttpStatusCode.OK)
        .send(cards);
    } catch (err) {
      return next(err);
    }
  }

  async likeCard(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const card = await CardsService.likeCard(req);
      if (!card) {
        return next(notFoundError('Переданы некорректные данные для постановки/снятии лайка.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(card);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Передан некорректный _id карточки.'));
      }
      return next(err);
    }
  }
}

export default new CardController();
