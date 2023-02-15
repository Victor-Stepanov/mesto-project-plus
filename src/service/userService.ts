import User from '../models/userModels';
import { IRequestCustom } from '../types';
import { OPTS } from '../utils/const';

class UserService {
  checkUser(email: string) {
    return User.findOne({ email });
  }

  getUsers() {
    return User.find({});
  }

  getUserById(id: string) {
    return User.findById(id);
  }

  createUser(data: Record<string, string>) {
    return User.create({
      ...data,
    });
  }

  updateProfile(data: IRequestCustom) {
    const id = data.user?._id;
    const {
      name,
      about,
    } = data.body;
    return User.findByIdAndUpdate(id, {
      name,
      about,
    }, OPTS);
  }

  updateProfileAvatar(data: IRequestCustom) {
    const id = data.user?._id;
    const { avatar } = data.body;
    return User.findByIdAndUpdate(id, { avatar }, OPTS);
  }

  login(email: string, password: string) {
    return User.findUserByCredentials(email, password);
  }
}

export default new UserService();
