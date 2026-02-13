import Joi from "joi";
import { LoginOption } from "models/auth/auth.entity";

export const getLocationSchema = Joi.object({
  lat: Joi.number().required().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be greater than or equal to -90",
    "number.max": "Latitude must be less than or equal to 90",
    "any.required": "Latitude is required",
  }),
  lng: Joi.number().required().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be greater than or equal to -180",
    "number.max": "Longitude must be less than or equal to 180",
    "any.required": "Longitude is required",
  }),
});

export const addUserLocationSchema = Joi.object({
  userId: Joi.string().required().required(),
  lat: Joi.number().required().min(-90).max(90).required(),
  lng: Joi.number().required().min(-180).max(180).required(),
  fullName: Joi.string().required(),
  loginOption: Joi.string()
    .valid(...Object.values(LoginOption))
    .required(),
});

export const getAllLocationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  per_page: Joi.number().integer().min(1).max(100).default(20),
});

export const getCooksByLocationSchema = Joi.object({
  lat: Joi.number().optional().min(-90).max(90).messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be greater than or equal to -90",
    "number.max": "Latitude must be less than or equal to 90",
  }),
  lng: Joi.number().optional().min(-180).max(180).messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be greater than or equal to -180",
    "number.max": "Longitude must be less than or equal to 180",
  }),
  count: Joi.number().integer().min(1).max(100).optional()
});
