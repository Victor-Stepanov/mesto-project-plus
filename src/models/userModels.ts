import validator from 'validator';
import { model, Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'The name field is required '],
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 30,
      message: 'Text should not be less than 2 characters long or more than 30 characters long.',
    },
  },
  about: {
    type: String,
    required: [true, 'The about field is required '],
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
    validate: {
      validator: (v: string) => v.length > 2 && v.length < 200,
      message: 'Text should not be less than 2 characters long or more than 200 characters long.',
    },
  },
  avatar: {
    type: String,
    required: [true, 'The avatar field is required '],
    default: 'https://arte1.ru/images/detailed/4/23608.jpg',
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Invalid URL',
    },
  },
}, {
  versionKey: false,
});

export default model<IUser>('user', userSchema);
