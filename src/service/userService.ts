import User from '../models/userModels';
import { IRequestCustom } from '../types';
import { OPTS } from '../const';

class UserService {
  getUsers() {
    return User.find({});
  }

  getUserById(id: string) {
    return User.findById(id);
  }

  createUser(data: IRequestCustom) {
    return User.create({ ...data });
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
}

export default new UserService();
