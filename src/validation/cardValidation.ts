import { celebrate, Joi } from 'celebrate';
import { regExp } from '../utils/const';

export const createCardValidation = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required().pattern(regExp),
    }),
});

export const cardIdValidation = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .required(),
    }),
});

export default {};
