import Joi from "joi";

export const addFavouriteCookSchema = Joi.object({
  cookId: Joi.string().required(),
});

export const removeFavouriteCookSchema = Joi.object({
  cookId: Joi.string().required(),
});