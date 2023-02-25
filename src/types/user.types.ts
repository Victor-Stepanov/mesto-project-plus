import mongoose from 'mongoose';

export interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string
  password: string

}

export interface IUserModal extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<unknown, any, IUser>>;

}
