import { Router } from 'express';
import UserController from '../controllers/userController';
import {
  getUserByIdValidation,
  updateProfileAvatarValidation,
  updateProfileValidation,
} from '../validation/userValidation';

const userRouter = Router();

userRouter.get('/', UserController.getUsers);
userRouter.get('/me', UserController.getUser);
userRouter.get('/:userId', getUserByIdValidation, UserController.getUserById);
userRouter.patch('/me', updateProfileValidation, UserController.updateProfile);
userRouter.patch('/me/avatar', updateProfileAvatarValidation, UserController.updateProfileAvatar);

export default userRouter;
