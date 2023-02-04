import { Router } from 'express';
import UserController from '../controllers/userController';

const userRouter = Router();

userRouter.get('/', UserController.getUsers.bind(UserController));
userRouter.get('/:userId', UserController.getUserById.bind(UserController));
userRouter.post('/', UserController.createUser.bind(UserController));
userRouter.patch('/me', UserController.updateProfile.bind(UserController));
userRouter.patch('/me/avatar', UserController.updateProfileAvatar.bind(UserController));

export default userRouter;
