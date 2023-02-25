import { celebrate, Joi } from 'celebrate';
import { regExp } from '../utils/const';

export const createUserValidation = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string().pattern(regExp),
      about: Joi.string()
        .min(2)
        .max(200),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

export const getUserByIdValidation = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required(),
    }),
});

export const updateProfileValidation = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(200),
    }),
});
export const updateProfileAvatarValidation = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string().pattern(regExp),
    }),
});

export const loginValidation = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

export default {};
