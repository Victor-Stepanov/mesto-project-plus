import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/userModels';

class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find({});
      res.status(200)
        .send(users);
    } catch (err) {
      res.status(500)
        .send({
          message: 'Ошибка на сервере',
        });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404)
          .send({
            message: 'Required user not found.',
          });
      }
      return res.status(200)
        .send(user);
    } catch (err) {
      return res.status(500)
        .send({
          message: 'Ошибка на сервере',
        });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const {
        name,
        about,
        avatar,
      } = req.body;
      const newUser = User.create({
        name,
        about,
        avatar,
      });
      return res.status(201)
        .send(newUser);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400)
          .send({
            message: err.message,
          });
      }
      return res.status(500)
        .send({
          message: 'Ошибка на сервере',
        });
    }
  }
}

export default UserController;
