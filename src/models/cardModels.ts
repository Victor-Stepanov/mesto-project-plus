import { model, Schema } from 'mongoose';
import { ICard } from '../types/card.types';

const cardModels = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'The name field is required '],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'The link field is required '],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'The owner field is required '],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

export default model<ICard>('card', cardModels);
