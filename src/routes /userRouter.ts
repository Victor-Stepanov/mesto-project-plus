import { Router } from 'express';
import UserController from '../controllers/userController';

const {
  getUsers,
  getUserById,
  createUser,
} = UserController;

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);

export default userRouter;
