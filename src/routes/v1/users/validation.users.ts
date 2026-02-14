import Joi from "joi";

export const addFavouriteCookSchema = Joi.object({
  cookId: Joi.string().required(),
});

export const removeFavouriteCookSchema = Joi.object({
  cookId: Joi.string().required(),
});

export const completeUserSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  fullName: Joi.string().required(),
  userId: Joi.string().required(),
  loginOption: Joi.string().valid("GOOGLE", "FACEBOOK", "APPLE").required(),
  phoneNumber: Joi.string().required(),
  countryCode: Joi.string().required(),
});