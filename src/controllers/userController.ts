import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { HttpStatusCode, IRequestCustom } from '../types';
import { badRequest, internalServerError, notFoundError, conflict } from '../error/error';
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
        return next(notFoundError('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(currentUser);
    } catch (err) {
      return next(internalServerError('Server error'));
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getUsers();
      return res.status(HttpStatusCode.OK)
        .send(users);
    } catch {
      return next(internalServerError('Server error'));
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      if (!user) {
        return next(notFoundError('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(user);
    } catch (err) {
      if (err instanceof Error && err.name === 'CastError') {
        return next(badRequest('Incorrect id was submitted.'));
      }
      return next(internalServerError('Server error'));
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
      const isUser = await UserService.checkUser(email);
      if (isUser) {
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
      return next(internalServerError('Server error'));
    }
  }

  async updateProfile(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const updateUser = await UserService.updateProfile(req);
      if (!updateUser) {
        return next(notFoundError('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(internalServerError('Server error'));
    }
  }

  async updateProfileAvatar(req: IRequestCustom, res: Response, next: NextFunction) {
    try {
      const updateUser = await UserService.updateProfileAvatar(req);
      if (!updateUser) {
        return next(notFoundError('Required user not found.'));
      }
      return res.status(HttpStatusCode.OK)
        .send(updateUser);
    } catch (err) {
      if (err instanceof Error && err.name === 'ValidationError') {
        return next(badRequest('Incorrect data was submitted.'));
      }
      return next(internalServerError('Server error'));
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
      return next(internalServerError('Server error'));
    }
  }
}

export default new UserController();
