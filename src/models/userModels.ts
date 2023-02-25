import validator from 'validator';
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, IUserModal } from '../types';

const userSchema = new Schema<IUser, IUserModal>({
  name: {
    type: String,
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
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Invalid URL',
    },
  },
  email: {
    type: String,
    required: [true, 'The email field is required '],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Invalid email',
    },
  },
  password: {
    type: String,
    required: [true, 'The password field is required '],
    minlength: 8,
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  const user = await this.findOne({ email })
    .select('+password');
  if (!user) {
    return Promise.reject(new Error('Incorrect email or password.'));
  }
  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return Promise.reject(new Error('Incorrect email or password.'));
  }
  return user;
});

export default model<IUser, IUserModal>('user', userSchema);
