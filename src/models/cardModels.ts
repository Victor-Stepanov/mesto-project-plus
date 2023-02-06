import { model, Schema } from 'mongoose';
import validator from 'validator';
import { ICard } from '../types';

const cardModels = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'The name field is required '],
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 30,
      message: 'Text should not be less than 2 characters long or more than 30 characters long.',
    },
  },
  link: {
    type: String,
    required: [true, 'The link field is required '],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Invalid URL',
    },
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
