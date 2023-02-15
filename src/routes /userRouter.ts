import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/me', UserController.getUser);
userRouter.get('/:userId', UserController.getUserById);
userRouter.patch('/me', UserController.updateProfile);
userRouter.patch('/me/avatar', UserController.updateProfileAvatar);

export default userRouter;
