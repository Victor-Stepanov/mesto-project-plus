import { Router } from 'express';
import CardController from '../controllers/cardController';
import { cardIdValidation, createCardValidation } from '../validation/cardValidation';

const cardsRouter = Router();
cardsRouter.get('/', CardController.getCards);
cardsRouter.post('/', createCardValidation, CardController.createCard);
cardsRouter.delete('/:cardId', cardIdValidation, CardController.deleteCardById);
cardsRouter.put('/:cardId/likes', cardIdValidation, CardController.likeCard);
cardsRouter.delete('/:cardId/likes', cardIdValidation, CardController.dislikeCard);
export default cardsRouter;
