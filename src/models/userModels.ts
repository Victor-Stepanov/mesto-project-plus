import { model, Schema } from 'mongoose';
import { IUser } from '../types/user.types';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'The name field is required '],
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'The about field is required '],
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: [true, 'The avatar field is required '],
    default: '',
  },
}, {
  versionKey: false,
});

export default model<IUser>('user', userSchema);
