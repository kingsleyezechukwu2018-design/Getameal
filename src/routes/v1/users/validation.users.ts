import Joi from "joi";
import { LoginOption } from "models/auth/auth.entity";

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
  loginOption: Joi.string().valid(...Object.values(LoginOption)).required(),
  phoneNumber: Joi.string().required(),
  countryCode: Joi.string().required(),
});