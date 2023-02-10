import { ObjectId } from 'mongoose';
import Card from '../models/cardModels';
import { IRequestCustom } from '../types';
import { OPTS } from '../const';

class CardsService {
  getCards() {
    return Card.find({});
  }

  deleteCardById(data: IRequestCustom) {
    const { cardId } = data.params;
    return Card.findByIdAndDelete(cardId);
  }

  createCard(data: IRequestCustom) {
    const id = data.user?._id;
    const {
      name,
      link,
    } = data.body;
    return Card.create({
      name,
      link,
      owner: id,
    });
  }

  likeCard(data: IRequestCustom) {
    const id = data.user?._id;
    const { cardId } = data.params;
    return Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: id } },
      OPTS,
    );
  }

  dislikeCard(data: IRequestCustom) {
    const id = data.user?._id as ObjectId;
    const { cardId } = data.params;
    return Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: id } },
      OPTS,
    );
  }
}

export default new CardsService();
