import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode, IRequestCustom } from '../types';
import {
  badRequest, forBidden, internalServerError, notFoundError,
} from '../error/error';
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
      if (err) {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(internalServerError('Server error'));
    }
  }

  async deleteCardById(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response> {
    try {
      const card = await CardsService.deleteCardById(req);
      if (!card) {
        return next(notFoundError('Required card not found.'));
      }
      if (card.owner.toString() !== req.user?._id) {
        return next(forBidden('Do not delete the cards of others.'));
      }
      return res.status(HttpStatusCode.OK)
        .send({
          message: 'Required card removed with success.',
        });
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Incorrect id was submitted.'));
      }
      return next(internalServerError('Server error'));
    }
  }

  async dislikeCard(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response> {
    try {
      const card = await CardsService.dislikeCard(req);
      if (!card) {
        return next(notFoundError('Required card not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(card);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Incorrect id was submitted.'));
      }
      return next(internalServerError('Server error'));
    }
  }

  async getCards(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const cards = await CardsService.getCards();
      return res.status(HttpStatusCode.OK)
        .send(cards);
    } catch {
      return next(internalServerError('Server error'));
    }
  }

  async likeCard(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response> {
    try {
      const card = await CardsService.likeCard(req);
      if (!card) {
        return next(notFoundError('Required card not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(card);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Incorrect id was submitted.'));
      }
      return next(internalServerError('Server error'));
    }
  }
}

export default new CardController();
