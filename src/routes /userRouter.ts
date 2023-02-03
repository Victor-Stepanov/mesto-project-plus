import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/:userId', UserController.getUserById);
userRouter.post('/', UserController.createUser);

export default userRouter;
