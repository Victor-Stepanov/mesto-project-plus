import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { HttpStatusCode, IRequestCustom } from '../types';
import {
  badRequest, conflict, notFoundError, unAuthorized,
} from '../error/error';
import UserService from '../service/userService';
import { generateToken } from '../utils/jwt';

interface IUserController {
  getUser(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

  getUsers(req: Request, res: Response, next: NextFunction): Promise<void | Response>;

  getUserById(req: Request, res: Response, next: NextFunction): Promise<void | Response>;

  createUser(req: Request, res: Response, next: NextFunction): Promise<void | Response>;

  updateProfile(req: IRequestCustom, res: Response, next: NextFunction): Promise<void | Response>;

  updateProfileAvatar(req: IRequestCustom, res: Response, next: NextFunction):
    Promise<void | Response>;

  login(req: Request, res: Response, next: NextFunction):
    Promise<void | Response>;
}

class UserController implements IUserController {
  async getUser(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const id = req.user?._id as string;
      const currentUser = await UserService.getUserById(id);
      if (!currentUser) {
        return next(unAuthorized('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(currentUser);
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getUsers();
      return res.status(HttpStatusCode.OK)
        .send(users);
    } catch (err) {
      return next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      if (!user) {
        return next(unAuthorized('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(user);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Incorrect id was submitted.'));
      }
      return next(err);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    if (!email || !password) {
      return next(badRequest('No emails or passwords submitted.'));
    }
    try {
      const user = await UserService.checkUser(email);
      if (user) {
        return next(conflict('This user already exists.'));
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.createUser({
        name,
        about,
        avatar,
        email,
        password: hashPassword,
      });
      if (newUser) {
        return res.status(HttpStatusCode.CREATED)
          .send(newUser);
      }
      return next(badRequest('Something wrong...'));
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(err);
    }
  }

  async updateProfile(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const updateUser = await UserService.updateProfile(req);
      if (!updateUser) {
        return next(unAuthorized('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(err);
    }
  }

  async updateProfileAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const updateUser = await UserService.updateProfileAvatar(req);
      if (!updateUser) {
        return next(unAuthorized('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const {
      email,
      password,
    } = req.body;
    if (!email || !password) {
      return next(badRequest('No emails or passwords submitted.'));
    }
    try {
      const user = await UserService.login(email, password);
      if (!user) {
        return next(notFoundError('Required user not found.'));
      }
      const token = generateToken({
        _id: user._id as string,
      });
      return res.send({ token });
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(err);
    }
  }
}

export default new UserController();
