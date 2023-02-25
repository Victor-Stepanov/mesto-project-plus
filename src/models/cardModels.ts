import { model, Schema } from 'mongoose';
import validator from 'validator';
import { ICard } from '../types';

const cardModels = new Schema<ICard>({
  name: {
    type: String,
    required: [true, 'Поле name является обязательным.'],
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 30,
      message: 'Текст должен быть не короче 2 символов и не длиннее 30.',
    },
  },
  link: {
    type: String,
    required: [true, 'Поле link является обязательным.'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректная ссылка.',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner является обязательным.'],
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
